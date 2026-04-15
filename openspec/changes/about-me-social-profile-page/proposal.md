## Why

Create a professional single-page "About Me" site that can stay current using data from existing social profiles instead of manual copy/paste edits. This reduces maintenance overhead and ensures consistent personal branding across platforms.

## What Changes

- Add a personal single-page website layout that presents biography, experience highlights, repositories/projects, and contact links.
- Add profile data ingestion for LinkedIn and GitHub using the handle `imahmoodsultani`.
- Add normalization logic to map profile data into a unified internal profile model for page rendering.
- Add graceful fallback behavior when one provider is unavailable (show cached/static fallback content and keep the page usable).
- Add refresh controls to define when and how profile data is re-fetched.

## Capabilities

### New Capabilities
- `social-profile-ingestion`: Fetch and normalize public profile data from LinkedIn and GitHub for a single configured handle.
- `about-page-rendering`: Render a responsive single-page "About Me" experience from normalized profile data with accessible sections and fallback states.

### Modified Capabilities
- None.

## Impact

- New frontend page components and styling for a single-page personal site.
- New integration layer for LinkedIn and GitHub profile/repository data retrieval.
- Possible dependency additions for API clients, fetch helpers, caching, and schema validation.
- Operational considerations for API limits, provider outages, and refresh cadence.
