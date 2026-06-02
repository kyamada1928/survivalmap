# Agents

## Japan Survival Map: Umeda

### Product overview

A simple mobile-first web app for foreign tourists around Umeda / Osaka Station.
The app helps users quickly locate toilets, coin lockers, trash bins, ATMs, smoking areas, and station exits.
It is built as a PWA with no API key requirements.

### MVP scope

- Single-screen mobile-first map app
- Local JSON seed data for 20+ sample spots
- Category filter and spot listing
- Leaflet + OpenStreetMap map view
- Location permission handling with graceful fallback
- Bottom sheet detail view for selected spots
- Minimal PWA manifest and home screen support
- Playwright E2E tests for core flows

### Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- React Leaflet + Leaflet
- PWA with `manifest.json`
- Playwright for E2E tests

### Commands

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm run test:e2e`

### Coding rules

- Keep code readable and straightforward
- Do not add paid APIs or authentication
- Do not introduce Supabase or database logic yet
- Keep UI English only
- Make the layout mobile-first and easy to use with one hand
- Handle geolocation denial without breaking the app

### Constraints

- No Google Maps or API-key-dependent map services
- No authentication or login
- No external paid services
- The app must work if geolocation is denied
- UI should be designed for smartphone usage
