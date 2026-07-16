"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import maplibregl from "maplibre-gl";
import type { CountryMeta } from "@/lib/types";
import { navigateWithTransition } from "@/lib/viewTransition";

const BASEMAP_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
const WATER_COLOR = "#1b2734";
const DEFAULT_FILL = "#252b38";
const DEFAULT_LINE = "#454d5f";
const EASE = (t: number) => 1 - Math.pow(1 - t, 3);

export interface HoverInfo {
  x: number;
  y: number;
  isActive: boolean;
  code: string | null;
  name: string;
}

export interface WorldMapHandle {
  flyToCountry: (country: CountryMeta) => void;
  highlightIso3: (iso3List: string[], centers: [number, number][]) => void;
}

interface WorldMapProps {
  countries: CountryMeta[];
  onHover?: (info: HoverInfo | null) => void;
}

export const WorldMap = forwardRef<WorldMapHandle, WorldMapProps>(function WorldMap(
  { countries, onHover },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const router = useRouter();
  const hoveredIdRef = useRef<number | string | null>(null);
  const pulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onHoverRef = useRef<typeof onHover>(onHover);

  useEffect(() => {
    onHoverRef.current = onHover;
  }, [onHover]);

  const polygonCountries = useMemo(
    () => countries.filter((c) => c.geometryType === "polygon"),
    [countries]
  );
  const markerCountries = useMemo(
    () => countries.filter((c) => c.geometryType === "marker"),
    [countries]
  );

  const iso3ToCode = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of polygonCountries) {
      for (const iso of c.isoA3) map.set(iso, c.code);
    }
    return map;
  }, [polygonCountries]);

  const codeToMeta = useMemo(() => {
    const map = new Map<string, CountryMeta>();
    for (const c of countries) map.set(c.code, c);
    return map;
  }, [countries]);

  const activeIso3List = useMemo(
    () => polygonCountries.flatMap((c) => c.isoA3),
    [polygonCountries]
  );

  const fillColorExpr = useMemo(() => {
    const expr: unknown[] = ["match", ["get", "ADM0_A3"]];
    for (const c of polygonCountries) {
      for (const iso of c.isoA3) expr.push(iso, c.accentColor.dark);
    }
    expr.push(DEFAULT_FILL);
    return expr;
  }, [polygonCountries]);

  const lineColorExpr = useMemo(() => {
    const expr: unknown[] = ["match", ["get", "ADM0_A3"]];
    for (const c of polygonCountries) {
      for (const iso of c.isoA3) expr.push(iso, c.accentColor.dark);
    }
    expr.push(DEFAULT_LINE);
    return expr;
  }, [polygonCountries]);

  function pulse(map: maplibregl.Map, iso3List: string[]) {
    if (!map.isStyleLoaded() || !map.getSource("countries")) return;

    if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
    const features = map.querySourceFeatures("countries", {
      filter: ["in", ["get", "ADM0_A3"], ["literal", iso3List]],
    });
    const ids = features.map((f) => f.id).filter((id): id is number => id !== undefined);
    for (const id of ids) {
      map.setFeatureState({ source: "countries", id }, { pulse: true });
    }
    pulseTimeoutRef.current = setTimeout(() => {
      for (const id of ids) {
        map.setFeatureState({ source: "countries", id }, { pulse: false });
      }
    }, 2200);
  }

  useImperativeHandle(ref, () => ({
    flyToCountry(country: CountryMeta) {
      const map = mapRef.current;
      if (!map) return;
      map.flyTo({
        center: country.center,
        zoom: country.zoom,
        duration: 2000,
        curve: 1.3,
        easing: EASE,
        essential: true,
      });
      pulse(map, country.isoA3);
    },
    highlightIso3(iso3List: string[], centers: [number, number][]) {
      const map = mapRef.current;
      if (!map) return;
      pulse(map, iso3List);

      // Fit from known representative centers rather than raw polygon
      // extents — a country's full geometry (e.g. the US including Alaska)
      // can span almost the whole globe and would blow the zoom out.
      if (centers.length === 1) {
        map.flyTo({
          center: centers[0],
          zoom: 4.5,
          duration: 2000,
          curve: 1.3,
          easing: EASE,
          essential: true,
        });
      } else if (centers.length > 1) {
        const bounds = new maplibregl.LngLatBounds();
        for (const c of centers) bounds.extend(c);
        map.fitBounds(bounds, { padding: 140, duration: 1900, easing: EASE, maxZoom: 5 });
      }
    },
  }));

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: BASEMAP_STYLE,
      center: [12, 28],
      zoom: 1.9,
      minZoom: 1.4,
      maxZoom: 10,
      attributionControl: { compact: true },
    });
    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
    map.scrollZoom.setWheelZoomRate(1 / 320);
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();

    map.on("load", () => {
      const style = map.getStyle();
      const waterLayer = style?.layers?.find(
        (l) => l.id === "water" || l.id.toLowerCase().includes("water")
      );
      if (waterLayer) {
        try {
          map.setPaintProperty(waterLayer.id, "fill-color", WATER_COLOR);
        } catch {
          // basemap layer shape differs from expected — safe to skip
        }
      }

      map.addSource("countries", {
        type: "geojson",
        data: "/world-boundaries.geojson",
        generateId: true,
      });

      map.addLayer({
        id: "countries-glow",
        type: "line",
        source: "countries",
        paint: {
          "line-color": [
            "case",
            ["boolean", ["feature-state", "pulse"], false],
            ["case", ["boolean", ["feature-state", "hover"], false], "#f3ead9", fillColorExpr as never],
            fillColorExpr as never,
          ],
          "line-width": [
            "case",
            ["boolean", ["feature-state", "pulse"], false],
            12,
            ["match", ["get", "ADM0_A3"], activeIso3List, 5, 0],
          ],
          "line-opacity": [
            "case",
            ["boolean", ["feature-state", "pulse"], false],
            0.38,
            ["match", ["get", "ADM0_A3"], activeIso3List, 0.15, 0],
          ],
          "line-blur": [
            "case",
            ["boolean", ["feature-state", "pulse"], false],
            10,
            ["match", ["get", "ADM0_A3"], activeIso3List, 5, 0],
          ],
        },
      });

      map.addLayer({
        id: "countries-fill",
        type: "fill",
        source: "countries",
        paint: {
          "fill-color": fillColorExpr as never,
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "pulse"], false],
            0.48,
            ["boolean", ["feature-state", "hover"], false],
            ["match", ["get", "ADM0_A3"], activeIso3List, 0.4, 0.09],
            ["match", ["get", "ADM0_A3"], activeIso3List, 0.24, 0.03],
          ],
        },
      });

      map.addLayer({
        id: "countries-line",
        type: "line",
        source: "countries",
        paint: {
          "line-color": lineColorExpr as never,
          "line-width": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            ["match", ["get", "ADM0_A3"], activeIso3List, 2.1, 0.6],
            ["match", ["get", "ADM0_A3"], activeIso3List, 1.3, 0.5],
          ],
          "line-opacity": ["match", ["get", "ADM0_A3"], activeIso3List, 0.95, 0.35],
        },
      });

      map.on("mousemove", "countries-fill", (e) => {
        if (!e.features?.length) return;
        const feature = e.features[0];
        const iso3 = String(feature.properties?.ADM0_A3);
        const code = iso3ToCode.get(iso3) ?? null;

        map.getCanvas().style.cursor = code ? "pointer" : "default";

        if (hoveredIdRef.current !== null && hoveredIdRef.current !== feature.id) {
          map.setFeatureState(
            { source: "countries", id: hoveredIdRef.current },
            { hover: false }
          );
        }
        if (feature.id !== undefined) {
          hoveredIdRef.current = feature.id;
          map.setFeatureState({ source: "countries", id: feature.id }, { hover: true });
        }

        onHoverRef.current?.({
          x: e.point.x,
          y: e.point.y,
          isActive: Boolean(code),
          code,
          name: code
            ? codeToMeta.get(code)?.name ?? String(feature.properties?.NAME)
            : String(feature.properties?.NAME ?? "Unknown"),
        });
      });

      map.on("mouseleave", "countries-fill", () => {
        map.getCanvas().style.cursor = "";
        if (hoveredIdRef.current !== null) {
          map.setFeatureState(
            { source: "countries", id: hoveredIdRef.current },
            { hover: false }
          );
          hoveredIdRef.current = null;
        }
        onHoverRef.current?.(null);
      });

      map.on("click", "countries-fill", (e) => {
        if (!e.features?.length) return;
        const feature = e.features[0];
        const iso3 = String(feature.properties?.ADM0_A3);
        const code = iso3ToCode.get(iso3);
        if (code) navigateWithTransition(router, `/country/${code}`);
      });

      // Supranational entities (EU) render as their own marker, never as a
      // polygon fill — this is the fix for member states being swept into
      // "EU" ownership, and for overseas territories (e.g. French Guiana)
      // rendering as if they belonged to the EU rather than their own country.
      for (const country of markerCountries) {
        const el = document.createElement("div");
        el.className = "eu-marker";
        el.textContent = country.shortName;
        el.setAttribute("role", "button");
        el.setAttribute("aria-label", `Open ${country.name}`);

        const reportHover = () => {
          const point = map.project(country.center);
          onHoverRef.current?.({
            x: point.x,
            y: point.y,
            isActive: true,
            code: country.code,
            name: country.name,
          });
        };

        // MapLibre listens for mousemove on the shared canvas container and
        // does its own pixel-based feature lookup regardless of which DOM
        // element the event originated on — without stopping propagation,
        // hovering the marker still resolves to whatever country polygon
        // sits underneath it (e.g. Belgium) and overwrites this tooltip.
        el.addEventListener("mouseenter", reportHover);
        el.addEventListener("mousemove", (e) => {
          e.stopPropagation();
          reportHover();
        });
        el.addEventListener("mouseleave", () => onHoverRef.current?.(null));
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          navigateWithTransition(router, `/country/${country.code}`);
        });

        const marker = new maplibregl.Marker({ element: el, anchor: "center" })
          .setLngLat(country.center)
          .addTo(map);
        markersRef.current.push(marker);
      }
    });

    return () => {
      for (const m of markersRef.current) m.remove();
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} className="h-full w-full" />;
});
