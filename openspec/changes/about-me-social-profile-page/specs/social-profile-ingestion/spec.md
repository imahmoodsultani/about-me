## ADDED Requirements

### Requirement: Multi-source social profile ingestion
The system SHALL ingest profile data for the configured handle from both LinkedIn and GitHub through source-specific adapters.

#### Scenario: Successful ingestion from both providers
- **WHEN** a refresh is triggered for handle `imahmoodsultani`
- **THEN** the system fetches data from LinkedIn and GitHub adapters and produces source payloads for normalization

#### Scenario: Partial provider failure during ingestion
- **WHEN** one provider request fails or times out during refresh
- **THEN** the system records the provider error and continues processing available provider data without aborting the full refresh job

### Requirement: Normalized profile snapshot
The system SHALL map provider-specific fields into a single normalized profile schema and persist the latest successful snapshot for page rendering.

#### Scenario: Successful profile normalization
- **WHEN** provider payloads are returned
- **THEN** the system maps identity, summary, experience highlights, skills, and repository/project fields into the normalized profile schema

#### Scenario: Missing optional provider fields
- **WHEN** a provider omits optional fields
- **THEN** the system stores schema-valid defaults and still persists a usable normalized snapshot

### Requirement: Refresh and resilience controls
The system SHALL support controlled refresh execution with caching and provider-safe retry behavior.

#### Scenario: Scheduled refresh execution
- **WHEN** the configured refresh interval elapses
- **THEN** the system initiates a refresh job and updates the normalized snapshot if valid data is produced

#### Scenario: Provider rate limit response
- **WHEN** a provider responds with a rate limit error
- **THEN** the system keeps the previous snapshot available, logs the rate limit event, and defers subsequent retries according to backoff rules
