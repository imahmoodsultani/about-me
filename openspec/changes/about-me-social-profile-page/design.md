## Context

The project needs a single-page personal website that stays up to date by ingesting profile data from LinkedIn and GitHub for the configured handle `imahmoodsultani`. LinkedIn and GitHub expose different data shapes and reliability characteristics, so the system needs a normalization layer and fallback behavior to avoid blank or broken page experiences when one source fails.

## Goals / Non-Goals

**Goals:**
- Build a unified profile data contract that combines LinkedIn and GitHub public information.
- Render a responsive single-page "About Me" website from normalized profile data.
- Keep the page available even when a provider is unavailable by using fallback/cached content.
- Support controlled refresh behavior so external calls are predictable and rate-limit friendly.

**Non-Goals:**
- Implement user accounts, CMS authoring, or multi-user profile management.
- Mirror every LinkedIn or GitHub field; only page-relevant fields are in scope.
- Guarantee real-time synchronization of social profile changes.
- Introduce paid third-party enrichment services.

## Decisions

1. **Use a provider adapter pattern for ingestion**
   - Build one adapter per source (`linkedin`, `github`) that maps provider payloads to a common `NormalizedProfile`.
   - **Rationale:** Isolates provider-specific parsing and makes source-level failures non-fatal.
   - **Alternative considered:** A single combined parser for both APIs. Rejected due to tight coupling and difficult maintenance.

2. **Persist a normalized snapshot for rendering**
   - Store the latest successful merged profile snapshot and render from it.
   - **Rationale:** Enables deterministic page rendering and graceful degradation when live fetch fails.
   - **Alternative considered:** Always render directly from live API calls. Rejected due to availability and rate-limit risks.

3. **Use scheduled or on-demand refresh with guardrails**
   - Refresh can be triggered manually or on a configured interval, with per-provider timeout and error boundaries.
   - **Rationale:** Balances freshness with external dependency reliability.
   - **Alternative considered:** Refresh on every page request. Rejected due to quota risk and variable latency.

4. **Render sections conditionally with accessibility defaults**
   - The page renderer shows only sections with available data and provides fallback text for missing sections.
   - **Rationale:** Prevents empty UI blocks and improves usability under partial data.
   - **Alternative considered:** Strict requirement for complete data before rendering. Rejected because it makes outages user-visible.

## Risks / Trade-offs

- [LinkedIn API access or scraping constraints] -> Mitigation: abstract LinkedIn ingestion behind an adapter and support a manual/static fallback if direct API data is restricted.
- [Provider schema drift] -> Mitigation: validate ingestion payloads and default missing fields at normalization boundaries.
- [Rate limit throttling] -> Mitigation: cache snapshots, back off failed refreshes, and avoid request-per-page strategies.
- [Stale cached profile data] -> Mitigation: surface last-updated metadata and allow a safe manual refresh path.
