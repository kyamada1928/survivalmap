# Japan Survival Map: Umeda

A mobile-first Progressive Web App for foreign tourists around Umeda / Osaka Station.
It helps you quickly find toilets, coin lockers, trash bins, ATMs, smoking areas, and station exits without an API key.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Build

```bash
npm run build
```

## Type check

```bash
npm run typecheck
```

## Lint

```bash
npm run lint
```

## End-to-end tests

```bash
npm run test:e2e
```

## MVP Description

This app uses local JSON seed data to show sample spots around Umeda and Osaka Station.
It includes:

- Leaflet map with OpenStreetMap tiles
- Category filters for essential spot types
- Nearby spot list and location-based sorting
- Bottom sheet detail view for each spot
- User spot submission form with local storage persistence
- Geolocation support with graceful fallback if denied
- Basic PWA manifest and install-ready configuration

## Future extension ideas

- Add Supabase-backed data storage for live spot updates
- Add a feedback form so tourists can report missing or closed locations
- Allow users to suggest new spots and edit details
- Add offline caching for map tiles and spot data
- Add language support beyond English
