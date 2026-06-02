# Screen Flow

Below is the app's screen flow and interactions. This is a mobile-first, single-screen app with auxiliary flows for PWA and settings.

```mermaid
flowchart LR
  Home[Home / Map Screen]
  CF[Category Filter]
  Map[Map (Leaflet + OSM)]
  List[Spot List]
  Detail[Bottom Sheet — Spot Details]
  PWA[PWA Install Prompt]
  Settings[About / Help]

  Home --> CF
  Home --> Map
  Home --> List
  CF -- filter --> List
  CF -- filter --> Map
  Map -- click marker --> Detail
  List -- tap item --> Detail
  Home -- show install prompt --> PWA
  Home --> Settings

  subgraph Interactions
    Geoloc[Geolocation] --> Map
    Geoloc --> List
    Geoloc --> Home
  end

  style Home fill:#f8fafc,stroke:#0f4c81,stroke-width:1px
  style Detail fill:#fff7ed,stroke:#f59e0b,stroke-width:1px
```

**Notes**

- Primary flow: `Category Filter` -> `Map` / `Spot List` -> `Spot Details` (bottom sheet).
- Geolocation influences map center and list sorting but is optional; app must remain usable when denied.
- PWA install is an optional prompt; `Settings` holds About/Help content.
