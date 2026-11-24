# ADR-0001: Page sections take their content as props

**Decision:** Components that lay out a page section MUST receive their text and file references as props and MUST NOT import from `src/content/`; only page files in `src/app/` import content and pass it down.

**Reason:** The home page ticket requires that changing text never touches layout. A section component that imports its content module directly, the way `Footer` holds its own URL constants, was weighed and lost: it binds the component to one content file, mixes text into a layout file, and can't be rendered with test data.

**Consequence:** Every section component has a props type, defined in `src/types/` and shared by the component and the content module that fills it, and is a pure function of those props apart from fixed labels such as "Download CV". A page file is the one place that pairs a section with its content. Props types live outside `src/content/` so a component can import its props without importing content. A component that imports from `src/content/` breaks this record. Re-exporting the types from a content module is allowed, but components must not import them from there.

**Scope:** `src/components/`, `src/app/`, `src/content/`, `src/types/`. `Header` and `Footer` predate this record and are not page sections.

**Date:** 2026-11-24
