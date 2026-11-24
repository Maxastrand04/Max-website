# ADR-0001: Page sections take their content as props

**Decision:** Components that lay out a page section MUST receive their text and file references as props and MUST NOT import from `src/content/`; only page files in `src/app/` import content and pass it down.

**Reason:** The home page ticket requires that changing text never touches layout. A section component that imports its content module directly, the way `Footer` holds its own URL constants, was weighed and lost: it binds the component to one content file, mixes text into a layout file, and can't be rendered with test data.

**Consequence:** Every section component has a props type, defined in the content module it is filled from, and is a pure function of those props apart from fixed labels such as "Download CV". A page file is the one place that pairs a section with its content. A component that reaches into `src/content/` itself breaks this record.

**Scope:** `src/components/`, `src/app/`, `src/content/`. `Header` and `Footer` predate this record and are not page sections.

**Date:** 2026-11-24
