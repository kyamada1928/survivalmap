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

- MapLibre GL JS map with OpenFreeMap tiles
- Category filters for essential spot types
- Nearby spot list and location-based sorting
- Bottom sheet detail view for each spot
- Verified / last checked labels and API-key-free external map links
- User spot submission form with local storage persistence
- User-added spot editing and deletion
- Problem report form with offline local queue
- Geolocation support with graceful fallback if denied
- PWA manifest, install icons, offline fallback page, and service worker runtime caching
- English / Japanese UI switching
- Optional Supabase REST sync with approval-first user submissions

## Optional Supabase sync

The app stays local-first and works without Supabase. User-added spots are visible immediately only on the submitter's device, then sent to Supabase as `pending_review`. The public app fetches only `active` spots.

To enable best-effort sync for user spots and reports, set:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Expected tables:

```sql
create table spots (
  id text primary key,
  name text not null,
  category text not null,
  description text not null,
  note text not null,
  tags text[] not null default '{}',
  hours text not null,
  payment text not null,
  inside_station boolean not null,
  verified boolean not null default false,
  last_checked date,
  lat double precision not null,
  lng double precision not null,
  source text not null default 'user',
  status text not null default 'pending_review',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table spot_reports (
  id text primary key,
  spot_id text not null,
  spot_name text not null,
  type text not null,
  details text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);
```

Recommended publication flow:

```text
local user spot -> spots.status = pending_review -> admin review -> set verified/last_checked -> active or rejected
```

The traveler-facing app fetches `status = active` rows only. Realtime subscription can be layered on top of these tables later; the current implementation avoids adding a Supabase package and keeps offline behavior stable.
