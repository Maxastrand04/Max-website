# syntax=docker/dockerfile:1
FROM node:26-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:1-alpine AS runtime
USER root
RUN apk --no-cache upgrade
# Listen on IPv4 and IPv6. The cluster hands pods IPv6 addresses, and the
# image's own IPv6 listener cannot be added on a read-only root filesystem,
# so kubelet's startup/readiness/liveness TCP probes were refused until the
# container was killed (proof failure: nothing accepted connections on 8080).
COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
    listen 8080;
    listen [::]:8080;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html index.htm;
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    location / {
        try_files $uri $uri/ =404;
    }
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
EOF
USER 101
COPY --from=build /app/out /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
