## 1. Data Ingestion Foundation

- [x] 1.1 Create provider adapter interfaces and implement initial `linkedin` and `github` adapters for handle-based profile fetches.
- [x] 1.2 Define the normalized profile schema and add mapping/validation utilities from provider payloads.
- [x] 1.3 Implement snapshot persistence for the latest normalized profile with timestamp metadata.

## 2. Refresh, Caching, and Resilience

- [x] 2.1 Add refresh orchestration (manual and/or scheduled trigger) that coordinates both providers.
- [x] 2.2 Add timeout, retry/backoff, and partial-failure handling so one provider failure does not abort full refresh.
- [x] 2.3 Add caching/fallback logic that serves the last successful snapshot when live refresh fails or is rate-limited.

## 3. Single-Page About UI

- [x] 3.1 Build the single-page layout sections for identity, bio, experience highlights, projects, and contact links.
- [x] 3.2 Wire UI rendering to normalized snapshot data with section-level conditional rendering and fallback copy.
- [x] 3.3 Implement responsive behavior and accessibility semantics (landmarks, heading structure, keyboard-friendly navigation).

## 4. Freshness and Observability

- [x] 4.1 Display snapshot freshness metadata (last-updated timestamp) on the page.
- [x] 4.2 Display non-blocking degradation notices when one source failed in the latest refresh.
- [x] 4.3 Add structured logging/telemetry for refresh outcomes, provider failures, and rate-limit events.

## 5. Verification

- [x] 5.1 Add unit tests for adapter parsing and normalized schema mapping with missing-field and malformed-payload cases.
- [x] 5.2 Add integration tests for successful dual-source refresh, partial-source failure, and cached snapshot fallback scenarios.
- [x] 5.3 Add UI tests for responsive rendering, accessibility basics, and fallback/degradation states.
