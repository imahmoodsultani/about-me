# About Me Social Profile Page

A single-page personal website that builds profile content from LinkedIn and GitHub data for `imahmoodsultani`.

## Features

- Single-page "About Me" UI with bio, experience highlights, projects, and contact links
- Multi-source ingestion using LinkedIn and GitHub adapters
- Normalized profile model for consistent rendering
- Snapshot caching and graceful fallback when providers fail
- Refresh telemetry logging and automated tests

## Requirements

- Node.js 18+ (or newer)
- npm

## Setup

```bash
npm install
```

## Run

Start the server:

```bash
npm start
```

Open: [http://localhost:3000](http://localhost:3000)

Refresh snapshot manually:

```bash
npm run refresh
```

## Test

```bash
npm test
```

## Project Structure

- `src/providers/` social source adapters
- `src/lib/` normalization, refresh orchestration, snapshot storage
- `src/ui/` page rendering and styles
- `src/server.mjs` HTTP entrypoint
- `src/scripts/refresh.mjs` manual refresh task
- `test/` unit, integration, and UI tests
- `openspec/changes/about-me-social-profile-page/` OpenSpec artifacts and task history

