"use client";

import { useEffect, useMemo, useRef } from "react";
import maplibregl, { type LngLatLike, type Map, type Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Spot } from "../types/spot";
import { getCategoryColor } from "../utils/constants";
import type { Translator } from "../utils/i18n";

const mapStyle = "https://tiles.openfreemap.org/styles/liberty";
const center: [number, number] = [34.702485, 135.495951];

type MapViewProps = {
  spots: Spot[];
  position: { lat: number; lng: number } | null;
  onViewMore: (spot: Spot) => void;
  t: Translator;
};

function createMarkerElement(color: string, label?: string) {
  const element = document.createElement("button");
  element.type = "button";
  element.className = "map-marker";
  element.setAttribute("aria-label", label ?? "Map marker");
  element.innerHTML = `
    <svg viewBox="0 0 32 42" aria-hidden="true" focusable="false">
      <path d="M16 1C8.3 1 2 7.2 2 14.9c0 10.8 14 26.1 14 26.1s14-15.3 14-26.1C30 7.2 23.7 1 16 1Z" fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="16" cy="15" r="5" fill="white"/>
    </svg>
  `;

  return element;
}

function createCurrentLocationElement() {
  const element = document.createElement("div");
  element.className = "map-current-location";
  element.setAttribute("aria-label", "Your location");

  const outerPulse = document.createElement("span");
  outerPulse.className = "map-current-location-pulse map-current-location-pulse-outer";
  element.appendChild(outerPulse);

  const innerPulse = document.createElement("span");
  innerPulse.className = "map-current-location-pulse map-current-location-pulse-inner";
  element.appendChild(innerPulse);

  const dot = document.createElement("span");
  dot.className = "map-current-location-dot";
  element.appendChild(dot);

  const label = document.createElement("span");
  label.className = "map-current-location-label";
  label.textContent = "You";
  element.appendChild(label);

  return element;
}

function createSpotPopup(spot: Spot, t: Translator, onViewMore: (spot: Spot) => void) {
  const wrapper = document.createElement("div");
  wrapper.className = "min-w-[150px]";

  const name = document.createElement("strong");
  name.className = "block text-sm text-slate-900";
  name.textContent = spot.name;
  wrapper.appendChild(name);

  const category = document.createElement("p");
  category.className = "m-0 mt-1 text-xs text-slate-600";
  category.textContent = spot.category;
  wrapper.appendChild(category);

  const button = document.createElement("button");
  button.type = "button";
  button.dataset.testid = `map-view-more-${spot.id}`;
  button.className = "mt-2 p-0 text-sm font-semibold text-primary underline underline-offset-2";
  button.textContent = t("viewMore");
  button.addEventListener("click", () => onViewMore(spot));
  wrapper.appendChild(button);

  return wrapper;
}

export default function MapView({ spots, position, onViewMore, t }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const spotMarkersRef = useRef<Marker[]>([]);
  const userMarkerRef = useRef<Marker | null>(null);

  const initialCenter = useMemo<LngLatLike>(
    () => (position ? [position.lng, position.lat] : [center[1], center[0]]),
    [position]
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    mapRef.current = new maplibregl.Map({
      container: containerRef.current,
      style: mapStyle,
      center: initialCenter,
      zoom: 15.8,
      attributionControl: false,
    });

    mapRef.current.addControl(
      new maplibregl.AttributionControl({
        compact: true,
        customAttribution: "OpenFreeMap",
      }),
      "bottom-right"
    );
    window.setTimeout(() => mapRef.current?.resize(), 0);

    return () => {
      spotMarkersRef.current.forEach((marker) => marker.remove());
      userMarkerRef.current?.remove();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [initialCenter]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !position) {
      return;
    }

    if (!userMarkerRef.current) {
      const element = createCurrentLocationElement();
      userMarkerRef.current = new maplibregl.Marker({ element, anchor: "bottom" });
    }

    userMarkerRef.current.setLngLat([position.lng, position.lat]).addTo(map);
    map.easeTo({ center: [position.lng, position.lat], zoom: Math.max(map.getZoom(), 15.8), duration: 500 });
  }, [position]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    spotMarkersRef.current.forEach((marker) => marker.remove());
    spotMarkersRef.current = spots.map((spot) => {
      const element = createMarkerElement(getCategoryColor(spot.category), spot.name);
      const popup = new maplibregl.Popup({
        closeButton: true,
        closeOnClick: true,
        offset: 20,
      }).setDOMContent(createSpotPopup(spot, t, onViewMore));

      const marker = new maplibregl.Marker({ element, anchor: "bottom" })
        .setLngLat([spot.lng, spot.lat])
        .setPopup(popup)
        .addTo(map);

      return marker;
    });
  }, [onViewMore, spots, t]);

  return <div ref={containerRef} className="w-full" style={{ height: "56vh", minHeight: 360 }} data-testid="map-view" />;
}
