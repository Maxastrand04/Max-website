# How the site is hosted and deployed

Researched 2026-11-24. Repo state is commit `20756ea` on `main`. Live state comes from read-only Ankra MCP calls made the same day, between about 18:15 and 18:25 UTC. Each claim cites a file and line, a doc URL, or the tool call that produced it.

## Summary

A push to `main` on GitHub starts an Ankra Pipelines run. Ankra Pipelines is Ankra's own CI system, which runs jobs as pods inside a Kubernetes cluster. The run tests the code, builds a container image from the `Dockerfile`, scans it, and pushes it to Ankra's private registry as `sha-<7 chars of the commit>`. Ankra then rolls that image out to the cluster named `upcloud`, a 3-node Kubernetes v1.36.6 cluster on UpCloud in Warsaw (`pl-waw1`). Inside the container, nginx serves the static files that `next build` wrote. Traffic reaches it through an UpCloud managed load balancer, then Traefik, the cluster's ingress controller, then a Kubernetes Service. The public address is `https://max-website.yitv97ysj0.gad61abkao.ankra.cc`, a hostname under Ankra's `ankra.cc` domain. Nobody runs a deploy command by hand. GitHub Actions plays no part.

```
git push main
  -> Ankra Pipelines (.ankra/pipeline.yaml): checkout, test, build, scan, gate, publish
  -> registry.ankra.cloud/org-42f2ef23-.../max-website:sha-<commit>
  -> push-to-deploy renders .ankra/manifests with .ankra/ankra.yaml values
  -> stack "deploy-max-website", namespace max-website-system, cluster "upcloud"

browser
  -> DNS: max-website.yitv97ysj0.gad61abkao.ankra.cc  CNAME  lb-0ae69923...-1.upcloudlb.com  (5.22.222.68)
  -> UpCloud managed load balancer, plan "development"
  -> Traefik (Service type LoadBalancer, ports 80 and 443, TLS ends here)
  -> Service max-website :80
  -> Pod max-website :8080, nginx serving /usr/share/nginx/html
```

## Terms used here

A few Kubernetes and Ankra terms come up throughout, so here they are in one place.

| Term | Meaning |
| --- | --- |
| Pod | The smallest thing Kubernetes runs: one or more containers sharing a network address. |
| Deployment | A Kubernetes object that keeps a set number of identical pods running and swaps them out when the image changes. |
| Service | A stable in-cluster address and port that forwards to whichever pods match a label. `ClusterIP` means reachable only inside the cluster. `LoadBalancer` means the cloud provider puts a public load balancer in front of it. |
| Ingress | A rule that maps a public hostname and path to a Service. An ingress controller, here Traefik, does the actual routing. |
| IngressClass | Names which ingress controller handles an Ingress. |
| NetworkPolicy | A firewall rule for pods, saying who may connect to them. |
| Namespace | A named folder inside a cluster that groups objects. |
| Probe | A check the kubelet (the agent on each node) runs against a container. Startup waits for the app to come up, readiness decides whether it gets traffic, liveness restarts it if it hangs. |
| cert-manager | A cluster add-on that gets TLS certificates from a certificate authority and keeps them renewed. |
| ClusterIssuer | A cert-manager object that says which certificate authority to ask and how to prove domain ownership. |
| ACME, HTTP-01 | ACME is the protocol Let's Encrypt and ZeroSSL use to issue certificates. HTTP-01 proves you own a domain by serving a token at a URL on it. |
| external-dns | A cluster add-on that reads Ingress hostnames and creates matching DNS records with a DNS provider. |
| CNI, Cilium | CNI is the plugin that gives pods network addresses. Cilium is the one this cluster uses. |
| Ankra stack | Ankra's unit of deployment: a named bundle of Helm charts, raw manifests, or applications installed together on one cluster. |
| Ankra application | An Ankra object tied to a Git repo, with its own pipeline, image, and deploy targets. |
| Helm chart | A packaged, templated set of Kubernetes manifests. |
| Image digest | The content hash of a container image. Unlike a tag, it cannot be moved to point at different content. |

## 1. Build

The `Dockerfile` has two stages, so the final image carries only nginx and the built files, not Node or `node_modules`.

| Stage | Base image | What it does | Source |
| --- | --- | --- | --- |
| `build` | `node:26-alpine` | Sets `NEXT_TELEMETRY_DISABLED=1`, runs `npm ci`, copies the repo, runs `npm run build`. | `Dockerfile:2-8` |
| `runtime` | `nginxinc/nginx-unprivileged:1-alpine` | Runs `apk --no-cache upgrade` as root, writes its own nginx config, switches to user `101`, copies `/app/out` into `/usr/share/nginx/html`, exposes `8080`, runs `nginx -g "daemon off;"`. | `Dockerfile:10-37` |

`npm run build` is `next build` (`package.json`, `scripts.build`). `next.config.ts:10-12` sets `output: "export"`, so the build writes plain HTML, CSS, and JS to `out/` and needs no Node server at request time. PCR-0001 makes this a rule (`docs/pcr/0001-nextjs-static-export.md:3,7`).

The nginx config is inlined with a heredoc (`Dockerfile:17-33`). It listens on `8080` for IPv4 and `[::]:8080` for IPv6, serves from `/usr/share/nginx/html`, uses `try_files $uri $uri/ =404`, and maps 404 to `/404.html`, the page Next.js exports. The comment at `Dockerfile:13-16` and the second commit in PR #14 (`8ee6b50`) explain why: pods on this cluster get IPv6 addresses, and the stock image only adds its IPv6 listener by editing its config at startup, which a read-only root filesystem blocks. Without the explicit `[::]:8080` line the probes were refused and the pod was killed.

`.dockerignore` keeps `.git`, `.github`, `.ankra`, `node_modules`, `.env` and `.env.*` out of the build context (`.dockerignore:1-6`).

The live response confirms the server: `curl -I https://max-website.yitv97ysj0.gad61abkao.ankra.cc/` returned `HTTP/2 200` with `server: nginx/1.31.7` on 2026-11-24 18:24 UTC.

## 2. The Ankra application descriptor

File: `.ankra/ankra.yaml`. Ankra generated it in PR #14 (`8ee6b50`, co-authored by `ankra-platform[bot]`). Its header comment says Ankra reads it on every analysis run and that the `options` block is the app's "deploy-time parameter contract" which drives the deploy form and is validated on deploy (`.ankra/ankra.yaml:1-4`).

Ankra's public docs do not document this file's schema. `https://docs.ankra.ai/concepts/applications.md` mentions `.ankra/ankra.yaml` only for its `components` block (monorepos), which this file does not use. The `https://docs.ankra.ai/llms.txt` index has no page for the descriptor or its options. What follows on behaviour comes from the file's own comments and from live Ankra API output, not from a reference doc.

### Metadata

| Field | Value | Line |
| --- | --- | --- |
| `apiVersion` | `ankra.io/v1` | 5 |
| `kind` | `Application` | 6 |
| `metadata.name` | `max-website` | 8 |
| `metadata.version` | `0.1.0` | 9 |
| `metadata.app_version` | `0.1.0` | 10 |
| `metadata.license` | `MIT` | 11 |
| `metadata.icon` | GitHub avatar URL | 12 |
| `metadata.sources` | `https://github.com/Maxastrand04/Max-website` | 13-14 |
| `metadata.maintainers` | `Maxastrand04` | 15-17 |

### Options

Each option becomes a `${{ ankra.<name> }}` placeholder that Ankra fills in when it renders `.ankra/manifests/` at deploy time.

| Option | Type | Default | Used in | Line |
| --- | --- | --- | --- | --- |
| `image_tag` | string | none | `deployment.yaml:45,61` | 19-22 |
| `replicas` | number | `1` | written over `deployment.yaml:18` | 23-27 |
| `target_port` | number | `8080` | written over `deployment.yaml:57` | 28-32 |
| `cpu_request` | string | `100m` | written over `deployment.yaml:86` | 33-37 |
| `cpu_limit` | string | empty, no limit | not set in the file | 38-42 |
| `memory_request` | string | `512Mi` | written over `deployment.yaml:87` | 43-47 |
| `memory_limit` | string | `512Mi` | written over `deployment.yaml:84` | 48-52 |
| `ingress_enabled` | boolean | `false` | see discrepancy below | 53-57 |
| `ingress_host` | string | empty | `ingress.yaml:14,17` | 58-62 |
| `ingress_class` | string | empty, cluster default | `ingress.yaml:11` | 63-67 |
| `ingress_extra_hosts` | string | empty, max 5 | not referenced | 68-72 |
| `redirect_hosts` | string | empty, max 5, needs Traefik | not referenced | 73-77 |
| `env_from_secrets` | string | empty | not referenced | 78-82 |
| `ingress_tls_issuer` | string | `letsencrypt-prod` | `ingress.yaml:9` | 83-87 |
| `ingress_https_redirect` | boolean | `true` | Ankra adds Traefik middlewares | 88-92 |

The replica count, CPU, memory, and container port do not come from the manifest file. `get_application_deployments` says so directly: "The replica count, CPU and memory and the container port are the exception: the deploy writes them over the file from the defaults in .ankra/ankra.yaml, which Ankra re-reads on every deploy, so change them there." The same call lists the live `deploy_inputs` (`replicas=1`, `cpu_request=100m`, `cpu_limit=""`, `memory_request=512Mi`, `memory_limit=512Mi`, `target_port=8080`, `env_from_secrets=""`), each with `source: contract_default`, so no value is overridden from the deploy form.

This explains commit `b889954` (PR #17). The `target_port` default used to be `3000`. Because the descriptor overrides `containerPort`, the pod listened on 8080 while Kubernetes probed 3000, and the startup probe killed it every 60 seconds (30 failures x 2 s). The fix changed `.ankra/ankra.yaml:30` to `8080`.

## 3. Kubernetes manifests

All four files sit in `.ankra/manifests/`. Ankra renders them into a stack on every deploy, and the call `get_application_deployments` reports that edits to the live objects get overwritten by the next deploy ("The stack the deploy creates is rendered from those files on every deploy").

### ServiceAccount and Deployment (`deployment.yaml`)

- ServiceAccount `max-website` with `automountServiceAccountToken: false`, so the pod gets no Kubernetes API token (`deployment.yaml:1-7`).
- Deployment `max-website`, 1 replica, `RollingUpdate` with `maxSurge: 1` and `maxUnavailable: 0`, so a new pod must be ready before the old one stops. `progressDeadlineSeconds: 600` (`deployment.yaml:9-24`).
- Pod security: `runAsNonRoot`, `runAsUser: 101`, `fsGroup: 101`, seccomp `RuntimeDefault` (`deployment.yaml:35-40`). Container: `readOnlyRootFilesystem`, no privilege escalation, all Linux capabilities dropped (`deployment.yaml:47-54`). A writable `emptyDir` is mounted at `/tmp` for nginx's temp files (`deployment.yaml:62-64,88-90`).
- Image `registry.ankra.cloud/org-42f2ef23-87f7-4905-b022-d4c46f30c980/max-website:${{ ankra.image_tag }}`, pulled with secret `ankra-registry-pull` (`deployment.yaml:41-45`). The tag is also exposed to the app as env var `ANKRA_RELEASE` (`deployment.yaml:59-61`).
- Port `http` = `8080/TCP` (`deployment.yaml:55-58`).
- Probes, all TCP connects to port `http` (`deployment.yaml:65-81`):

| Probe | Period | Timeout | Failure threshold | Effect |
| --- | --- | --- | --- | --- |
| startup | 2 s | 3 s | 30 | up to 60 s to start |
| liveness | 10 s | 3 s | 5 | restart after about 50 s of failures |
| readiness | 5 s | 3 s | default 3 | drop from Service after about 15 s |

- Resources: requests `cpu: 100m`, `memory: 512Mi`; limit `memory: 512Mi`; no CPU limit (`deployment.yaml:82-87`).

### Service (`service.yaml`)

`ClusterIP` Service `max-website`, port `80` to `targetPort 8080`, selecting `app.kubernetes.io/name: max-website` (`service.yaml:1-15`).

### Ingress (`ingress.yaml`)

Ingress `max-website` with annotation `cert-manager.io/cluster-issuer: ${{ ankra.ingress_tls_issuer }}`, class `${{ ankra.ingress_class }}`, one rule for host `${{ ankra.ingress_host }}`, path `/` (`Prefix`) to Service `max-website:80`, and TLS for that host stored in secret `max-website-tls` (`ingress.yaml:1-26`).

### NetworkPolicy (`networkpolicy.yaml`)

Applies to the `max-website` pods, ingress direction only, with two rules (`networkpolicy.yaml:13-18`). Rule one allows any pod in the same namespace on any port. Rule two allows any source on `8080/TCP`. Kubernetes ORs the rules of a policy together ([Kubernetes docs, Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/)), so in practice any source can reach port 8080, which is the only port the container listens on. The policy restricts nothing that matters today. Since Traefik runs in a different namespace (`traefik`), rule two is what lets it through.

## 4. CI/CD

### No GitHub Actions

`.github/` holds only `dependabot.yml`. There is no `.github/workflows/` directory. `list_application_workflow_runs` returned `"runs": []`, and `list_applications` reports `pipeline_source: "ankra_pipeline"`.

### Ankra Pipelines (`.ankra/pipeline.yaml`)

The file header says Ankra runs the pipeline in your own cluster on every push, pull request, and schedule it declares, with stages as hardened Jobs sharing one workspace, and that the definition on the default branch governs (`.ankra/pipeline.yaml:1-5`). [Get started with Ankra CI](https://docs.ankra.ai/get-started/ankra-ci.md) confirms jobs run as pods on a cluster you run through Ankra, in an `ankra-ci` namespace, with each run starting from an empty workspace at `/workspace`.

Triggers: push to `main`, pull requests against `main` (forks get `read_only`), and manual runs (`.ankra/pipeline.yaml:10-18`). Runs for the same ref cancel older ones (`:19-21`). Workspace is a 10 GiB `ReadWriteOnce` volume (`:22-24`). Default timeout 30 min, network `egress-https` (`:25-27`), which the Ankra CI doc defines as "HTTPS to the public internet and nothing private".

| Stage | Kind | What it does | Lines |
| --- | --- | --- | --- |
| `checkout` | checkout | clones the repo | 31-32 |
| `test` | run | `npm ci && npm test` in `node:24-alpine`, with an npm cache keyed on `package-lock.json` | 33-51 |
| `build` | build | builds the `Dockerfile`, with provenance and an SBOM (software bill of materials) | 52-59 |
| `scan` | scan | Semgrep (`p/default p/docker p/github-actions p/javascript`), Checkov, Trivy. Fails on Semgrep `error` and Trivy findings in the app layer; Checkov never fails the run | 60-76 |
| `gate` | gate | requires `scan` to pass | 77-83 |
| `publish` | publish | pushes to `registry.ankra.cloud/org-42f2ef23-87f7-4905-b022-d4c46f30c980/max-website`, only on `push` events, `promote_from: pull_request` | 84-94 |

The Ankra CI doc says "nothing reaches your registry until the gate has judged the exact digest". [Ship your app](https://docs.ankra.ai/guides/deliver-your-app.md) says Ankra Pipelines "re-tags the approved digest as `sha-<7>` in the application's registry". The live tags match: `sha-b889954` and `sha-20756ea`. The meaning of `promote_from: pull_request` is not documented. A reasonable reading is that a push reuses the digest already built and scanned for the PR instead of rebuilding, but this is not verified.

`get_pipeline_repository` shows the repo is connected through the GitHub credential `github-app-maxastrand04`, default branch `main`, no CI cluster override (`cluster_id: null`), merge train off.

### Deploy on push

`get_application_auto_deploy` returns `enabled: true`, branch `main`, for environment `upcloud`. The Ship your app guide says "Push to deploy is on for every new application from the moment it is registered" and "every successful build of the tracked branch rolls out to every cluster it is installed on".

`get_application_timeline` shows the chain working end to end:

| Time (UTC) | Event | Commit | Image tag |
| --- | --- | --- | --- |
| 17:58:09 | application created | | |
| 17:58:43 | build, reason `first_onboard` | `8ee6b50` | |
| 17:59:31 | manual deploy by Max | | |
| 18:02:06 | pipeline build | `8ee6b50` | |
| 18:07:21, 18:08:41 | two manual deploys by Max | | |
| 18:10:11 | pipeline build, 34 s | `b889954` | |
| 18:11:58 | deploy, rule `deploys_on_push` | `b889954` | `sha-b889954` |
| 18:22:15 | pipeline build, 31 s | `20756ea` | |
| 18:23:33 | deploy, rule `deploys_on_push` | `20756ea` | `sha-20756ea` |

From push to live took about 5 minutes for `20756ea` (pushed 18:18:52, deployed 18:23:33).

### What the deploy creates

`list_stacks` on the `upcloud` cluster shows stack `deploy-max-website` holding one application, `max-website`, in namespace `max-website-system`, with this sync policy: automated, auto-prune, self-heal, `CreateNamespace=true`, `ServerSideApply=true`, retry up to 5 times with backoff from 5 s to 3 min, `rollback_on_failure: true`, revision history 10. `get_application_deployments` reports `health_status: Healthy`, `sync_status: InSync`, `manifest_drift: in_sync`, 1 of 1 pods ready.

### Dependabot

`.github/dependabot.yml` was also generated by Ankra (`:1`). It opens weekly grouped PRs for `npm` and `docker` (the `Dockerfile` base images), with a 7-day cooldown and at most 5 open PRs per ecosystem (`:7-41`). Commit `20756ea` (PR #15) is one of these, bumping `node:24-alpine` to `node:26-alpine`. Each Dependabot PR runs the Ankra pipeline before merge (`:5`).

## 5. Live state

### Cluster

| Property | Value | Source |
| --- | --- | --- |
| Name, id | `upcloud`, `0ae1a5af-441c-478e-bfc1-d54738961fec` | `list_clusters` |
| Kind | `upcloud` (Ankra-provisioned on UpCloud) | `list_clusters` |
| State, environment | `online`, `development` | `list_clusters` |
| Kubernetes | `v1.36.6` on all kubelets | `list_clusters`, `get_nodes` |
| Created | 2026-11-24 17:44 UTC | `list_clusters` |
| Region, zone | `pl-waw`, `pl-waw1` | node labels, `describe_resource Node` |
| Nodes | 1 control plane `upcloud-0ae1a5af-cp-0`, 2 workers `upcloud-0ae1a5af-default-0/1` | `get_nodes` |
| Node plan | `PREMIUM-4xCPU-8GB` for all three: 4 vCPU, about 7.7 GiB RAM, 3800m CPU allocatable | `list_node_groups`, `get_nodes` |
| Autoscaling | off (`autoscaling_enabled: false`) | `list_node_groups` |
| OS, runtime | Ubuntu 24.04.5 LTS, kernel 6.8.0-149, containerd 2.2.1, amd64 | `describe_resource Node status.nodeInfo` |
| Network | Cilium 1.19.8, pods get IPv6 addresses | `list_stacks`, `Dockerfile:13-16` |
| Node IPs | private only (10.32.62.3-5), no public IP on nodes | `get_nodes` |
| Ankra agent | 2.1.1356 | `list_clusters` |

UpCloud's `pl-waw1` zone is its Warsaw, Poland data centre, in Equinix WA3 ([UpCloud blog, PL-WAW1](https://upcloud.com/blog/pl-waw1-new-data-centre-in-warsaw/), [UpCloud locations](https://upcloud.com/docs/getting-started/locations/)).

The cluster is not UpCloud Managed Kubernetes. Ankra provisioned the servers itself and runs its own UpCloud integration charts: `upcloud-ccm` 0.4.0 (cloud controller manager, which creates UpCloud load balancers for `LoadBalancer` Services) and `upcloud-csi` 0.5.0 (storage driver), both from `oci://ghcr.io/ankraio/ankra-charts` (`list_stacks`, stack `upcloud-cloud-provider`). `get_cluster_platform_settings` rejected the `k3s_disabled_components` report with "only supported for the k3s distribution", so the cluster does not run k3s. Which Kubernetes distribution it does run was not confirmed.

### Other stacks on the cluster

| Stack | Contents | Source |
| --- | --- | --- |
| `upcloud-cloud-provider` | `upcloud-ccm` 0.4.0, `upcloud-csi` 0.5.0, credentials manifest | `list_stacks` |
| `cilium` | Cilium 1.19.8 in `kube-system` | `list_stacks` |
| `networking` | Traefik chart 42.4.3, cert-manager v1.21.3, external-dns manifests, `letsencrypt-prod` ClusterIssuer and its EAB secret | `list_stacks` |
| `ankra-security-baseline` | Trivy Operator 0.38.1, pod security manifests | `list_stacks` |
| `deploy-max-website` | the site | `list_stacks` |

### The app's objects

The live objects in `max-website-system` match the repo files, with the substitutions Ankra makes:

- Deployment image `registry.ankra.cloud/org-42f2ef23-87f7-4905-b022-d4c46f30c980/max-website:sha-b889954` at 18:15, then `sha-20756ea` after the 18:23 deploy (`describe_resource Deployment`, `get_application_timeline`). `ANKRA_RELEASE` matches the tag. Probes, security context, and resources match `deployment.yaml` line for line.
- Service `ClusterIP 10.224.11.41`, `80 -> 8080` (`get_services`).
- Ingress with `ingressClassName: traefik`, host `max-website.yitv97ysj0.gad61abkao.ankra.cc`, TLS secret `max-website-tls`, load balancer `lb-0ae6992325d14af58ed3d7ea393e8ecf-1.upcloudlb.com` (`describe_resource Ingress`).
- Secrets `ankra-registry-pull` (`kubernetes.io/dockerconfigjson`) and `max-website-tls` (`kubernetes.io/tls`) (`describe_resource Secret`).
- Certificate `max-website-tls`, ready, valid until 2027-02-22, renewal scheduled 2027-01-23 (`describe_resource Certificate`).

## 6. DNS, TLS, and the request path

### Hostname

The cluster has a generated DNS zone `yitv97ysj0.gad61abkao.ankra.cc`, state `active` (`get_cluster_dns_zone`). Ankra delegates it to its own nameservers: `dig NS yitv97ysj0.gad61abkao.ankra.cc` returns `venus.ankra.ai.` and `saturn.ankra.ai.`. The app's hostname is `max-website.<cluster zone>`. The [Applications concept page](https://docs.ankra.ai/concepts/applications.md) says "The Ankra domain in rule 2 is `ankra.cc` by default" and that "An organisation can register its own custom domain" to replace it.

### How the DNS record gets created

external-dns v0.22.0 runs in namespace `external-dns` with `--source=ingress --source=service --provider=webhook --policy=sync --registry=txt --txt-owner-id=yitv97ysj0 --min-ttl=120s`. A sidecar `ghcr.io/ankraio/images/external-dns-webhook-proxy:v0.2.0` forwards its record changes to a URL kept in secret `external-dns-avura` (`describe_resource Deployment external-dns`). So external-dns watches the Ingress, and Ankra's webhook writes the record into the Ankra-hosted zone.

On 2026-11-24, `dig` showed:

```
max-website.yitv97ysj0.gad61abkao.ankra.cc  CNAME  lb-0ae6992325d14af58ed3d7ea393e8ecf-1.upcloudlb.com
lb-0ae6992325d14af58ed3d7ea393e8ecf-1.upcloudlb.com  A  5.22.222.68
```

### Load balancer

Traefik runs as 2 replicas behind a Service of type `LoadBalancer` with ports `80 -> web` and `443 -> websecure` (`get_services`, `get_deployments`). The UpCloud cloud controller created UpCloud managed load balancer `0ae69923-25d1-4af5-8ed3-d7ea393e8ecf`, named `0ae1a5af-...-traefik-traefik`, on plan `development`, state `running` (`get_cluster_platform_settings load_balancer_plan`). That report lists `development` as 1 server, 1000 sessions per server, `highly_available: false`. The HA plans are `production-small` (2 servers) and `production-medium` (5 servers).

### TLS

The Ingress annotation `cert-manager.io/cluster-issuer: letsencrypt-prod` (`ingress.yaml:9`, default from `.ankra/ankra.yaml:85`) tells cert-manager to get a certificate. The live ClusterIssuer `letsencrypt-prod` does not point at Let's Encrypt. Its ACME server is `https://acme.zerossl.com/v2/DV90`, with External Account Binding from secret `letsencrypt-prod-eab`, and it proves ownership with an HTTP-01 solver through the `traefik` ingress class (`describe_resource ClusterIssuer letsencrypt-prod`). So the certificate comes from ZeroSSL. TLS ends at Traefik. Traefik talks plain HTTP to the pod on 8080.

### HTTPS redirect and HSTS

The live Ingress carries an annotation that is not in the repo file: `traefik.ingress.kubernetes.io/router.middlewares: max-website-system-max-website-https-redirect@kubernetescrd,max-website-system-max-website-hsts@kubernetescrd`. Two Traefik Middleware objects, `max-website-https-redirect` and `max-website-hsts`, exist in the namespace (`describe_resource Ingress`, `describe_resource Middleware`). Ankra adds them because `ingress_https_redirect` defaults to `true` and the only host is an Ankra hostname (`.ankra/ankra.yaml:88-92`). Live checks: `http://` returns `308 Permanent Redirect` to `https://`, and `https://` returns `strict-transport-security: max-age=86400` (one day).

## Where the repo and the live state differ

1. `ingress_enabled` defaults to `false` (`.ankra/ankra.yaml:53-57`), yet a live Ingress exists and serves the site. `ingress_host` and `ingress_class` default to empty (`:58-67`), yet live they are `max-website.yitv97ysj0.gad61abkao.ankra.cc` and `traefik`. None of the three appear in the `deploy_inputs` that `get_application_deployments` returns. Ankra fills them in from somewhere the API did not show, probably the cluster's generated domain (the [Applications page](https://docs.ankra.ai/concepts/applications.md) mentions `${{ ankra.cluster_domain }}`). Reading the repo alone, you would expect no Ingress.
2. The ClusterIssuer is called `letsencrypt-prod` but issues from ZeroSSL, not Let's Encrypt.
3. The live Ingress has a Traefik middleware annotation and two Middleware objects that the repo does not define. Ankra adds them.
4. The pipeline's `test` stage runs in `node:24-alpine` (`.ankra/pipeline.yaml:35`), while the image is built on `node:26-alpine` (`Dockerfile:2`) since PR #15. Dependabot's `docker` ecosystem updates the `Dockerfile` but did not touch `.ankra/pipeline.yaml`, so tests and build now run on different Node majors.
5. `ingress_extra_hosts`, `redirect_hosts`, and `env_from_secrets` are declared options, but no manifest in `.ankra/manifests/` references them. Setting them would only take effect if Ankra injects them itself, as it does for the replica count and resources.
6. The README (`README.md:31-37`) explains how to build to `out/` but says nothing about the container, Ankra, or where the site runs.

## Open questions

1. How Ankra sets `ingress_host` and `ingress_class`, and turns on the Ingress, when the descriptor defaults are empty and `false`. The API calls did not show the source.
2. What `promote_from: pull_request` does exactly. No public Ankra doc defines it.
3. Which Kubernetes distribution the cluster runs. It is not k3s, and it is not UpCloud Managed Kubernetes, but the API did not name it.
4. Which engine applies the stack. The sync options (`CreateNamespace=true`, `ServerSideApply=true`, self-heal, prune) look like Argo CD's, but no tool output confirmed it.
5. Where the pipeline actually runs. `cluster_id: null` on the pipeline repository means no override, so runs use the organisation's pipeline cluster. Whether that is `upcloud`, the `playground-8b12c2` Ankra Cloud cluster, or Ankra's build fallback was not checked.
6. Whether the setup should move to production settings. Today the cluster is labelled `development`, has 1 control plane node, runs 1 app replica, and sits behind a non-HA `development` load balancer. Any one of those failing takes the site down.
7. A custom domain. The site only answers on the generated `ankra.cc` hostname. Using a personal domain would need `ingress_extra_hosts` or an organisation custom domain, plus DNS at the domain's registrar. Not set up.
8. The full schema of `.ankra/ankra.yaml`. Ankra's public docs do not publish it, so field meanings here rest on the file's own comments and live API output.

## Sources

Repo files: `Dockerfile`, `.dockerignore`, `next.config.ts`, `package.json`, `README.md`, `docs/pcr/0001-nextjs-static-export.md`, `.ankra/ankra.yaml`, `.ankra/pipeline.yaml`, `.ankra/manifests/{deployment,service,ingress,networkpolicy}.yaml`, `.github/dependabot.yml`, and commit messages of `8ee6b50`, `b889954`, `20756ea`.

Ankra docs:
- [Applications](https://docs.ankra.ai/concepts/applications.md)
- [Get started with Ankra CI](https://docs.ankra.ai/get-started/ankra-ci.md)
- [Put my app online](https://docs.ankra.ai/get-started/put-your-app-online.md)
- [Ship your app](https://docs.ankra.ai/guides/deliver-your-app.md)
- [Docs index](https://docs.ankra.ai/llms.txt)

UpCloud docs:
- [PL-WAW1 announcement](https://upcloud.com/blog/pl-waw1-new-data-centre-in-warsaw/)
- [Locations](https://upcloud.com/docs/getting-started/locations/)

Kubernetes docs:
- [Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/)

Ankra MCP calls, all read-only: `list_clusters`, `get_cluster_details`, `list_applications`, `get_application_deployments`, `get_application_auto_deploy`, `get_application_timeline`, `list_application_workflow_runs`, `list_pipeline_repositories`, `get_pipeline_repository`, `list_stacks`, `list_node_groups`, `get_nodes`, `get_deployments`, `get_services`, `get_ingresses`, `get_cluster_dns_zone`, `get_cluster_platform_settings` (`load_balancer_plan`, `k3s_disabled_components`), and `describe_resource` for Deployment, Ingress, ClusterIssuer, Certificate, Middleware, Secret (names and types only), NetworkPolicy, and Node.

Network checks: `dig` for the A, CNAME, and NS records, and `curl -I` over HTTP and HTTPS, on 2026-11-24 around 18:24 UTC.
