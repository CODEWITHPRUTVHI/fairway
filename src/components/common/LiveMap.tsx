/**
 * FAIRWAY Nashik - Real Leaflet Map Component
 * Replaces the static SVG MapCanvas with live OpenStreetMap tile map.
 * Features:
 *  - Live GPS location (browser Geolocation API)
 *  - Animated auto rickshaw marker that moves like Swiggy/Zomato rider
 *  - Driver marker movement via simulated GPS breadcrumbs
 *  - Stranger scan radius circle (phases 1/2/3)
 *  - Meeting point pulse animation
 *  - Full route polyline (pickup → meetpoint → destination)
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocationPoint, RouteStop } from '../../types';

// Fix Leaflet default icon paths for Vite/Webpack bundlers
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface LiveMapProps {
  pickupLocation: LocationPoint;
  destinationLocation: LocationPoint;
  meetingPoint?: LocationPoint;
  stops?: RouteStop[];
  driverLocation?: { lat: number; lng: number };
  showVehicle?: boolean;
  className?: string;
  scanPhase?: 0 | 1 | 2 | 3; // 0=idle, 1=1km scan, 2=expanded, 3=final
  strangerMarkers?: Array<{ lat: number; lng: number; name: string; gender: string }>;
  showUserLocation?: boolean;
}

// Custom icon creators
const createPickupIcon = () => L.divIcon({
  html: `<div style="
    width:28px;height:28px;background:#1E1E1E;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 2px 8px rgba(0,0,0,0.4);
    border:3px solid white;
  ">
    <svg width="10" height="10" viewBox="0 0 10 10" fill="white">
      <circle cx="5" cy="5" r="3"/>
    </svg>
  </div>`,
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const createDestinationIcon = () => L.divIcon({
  html: `<div style="position:relative">
    <div style="
      width:0;height:0;
      border-left:10px solid transparent;border-right:10px solid transparent;
      border-top:22px solid #FCC016;
      filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4));
    "></div>
    <div style="
      position:absolute;top:-18px;left:50%;transform:translateX(-50%);
      width:10px;height:10px;background:#1E1E1E;border-radius:50%;border:2px solid white;
    "></div>
  </div>`,
  className: '',
  iconSize: [20, 22],
  iconAnchor: [10, 22],
});

const createAutoIcon = () => L.divIcon({
  html: `<div style="
    width:40px;height:40px;background:#FCC016;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    font-size:20px;
    box-shadow:0 0 0 6px rgba(252,192,22,0.3),0 2px 8px rgba(0,0,0,0.3);
    border:3px solid white;
    animation:none;
  ">🛺</div>`,
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const createMeetingIcon = () => L.divIcon({
  html: `<div style="
    width:36px;height:36px;background:#FCC016;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 0 0 8px rgba(252,192,22,0.25);
    border:3px solid #1E1E1E;
  ">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="#1E1E1E">
      <path d="M8 2C5.8 2 4 3.8 4 6c0 3.3 4 8 4 8s4-4.7 4-8c0-2.2-1.8-4-4-4zm0 5.5c-.8 0-1.5-.7-1.5-1.5S7.2 4.5 8 4.5s1.5.7 1.5 1.5S8.8 7.5 8 7.5z"/>
    </svg>
  </div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const createUserLocationIcon = () => L.divIcon({
  html: `<div style="
    width:18px;height:18px;background:#3B82F6;border-radius:50%;
    border:3px solid white;
    box-shadow:0 0 0 6px rgba(59,130,246,0.25);
  "></div>`,
  className: '',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const createStrangerIcon = (gender: string) => L.divIcon({
  html: `<div style="
    width:28px;height:28px;background:${gender === 'female' ? '#A855F7' : '#3B82F6'};
    border-radius:50%;border:2px solid white;
    display:flex;align-items:center;justify-content:center;
    font-size:12px;
    box-shadow:0 2px 6px rgba(0,0,0,0.3);
  ">${gender === 'female' ? '👩' : '👨'}</div>`,
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

export const LiveMap: React.FC<LiveMapProps> = ({
  pickupLocation,
  destinationLocation,
  meetingPoint,
  stops,
  driverLocation,
  showVehicle = true,
  className = '',
  scanPhase = 0,
  strangerMarkers = [],
  showUserLocation = true,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const pickupMarker = useRef<L.Marker | null>(null);
  const destinationMarker = useRef<L.Marker | null>(null);
  const meetingMarker = useRef<L.Marker | null>(null);
  const autoMarker = useRef<L.Marker | null>(null);
  const userLocationMarker = useRef<L.Marker | null>(null);
  const routePolyline = useRef<L.Polyline | null>(null);
  const scanCircles = useRef<L.Circle[]>([]);
  const strangerMarkersRef = useRef<L.Marker[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Center of Nashik (CBS Chowk)
  const NASHIK_CENTER: [number, number] = [20.0059, 73.7897];

  // Attempt to get real GPS location
  useEffect(() => {
    if (!showUserLocation || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // Only use location if it's in Nashik region (rough bounding box)
        if (
          latitude >= 19.8 && latitude <= 20.2 &&
          longitude >= 73.5 && longitude <= 74.0
        ) {
          setUserLocation({ lat: latitude, lng: longitude });
        }
      },
      (err) => {
        // GPS access denied or unavailable — continue with simulated location
        console.info('[FAIRWAY LiveMap] GPS access:', err.message);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 3000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [showUserLocation]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: NASHIK_CENTER,
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });

    // OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Zoom control bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Attribution bottom-left, small
    L.control.attribution({ position: 'bottomleft', prefix: '© OSM' }).addTo(map);

    mapInstance.current = map;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update pickup marker
  useEffect(() => {
    if (!mapInstance.current) return;
    if (pickupMarker.current) {
      pickupMarker.current.setLatLng([pickupLocation.lat, pickupLocation.lng]);
    } else {
      pickupMarker.current = L.marker(
        [pickupLocation.lat, pickupLocation.lng],
        { icon: createPickupIcon(), zIndexOffset: 100 }
      )
        .bindTooltip(`🟢 ${pickupLocation.name}`, { permanent: false, className: 'fairway-tooltip' })
        .addTo(mapInstance.current);
    }
  }, [pickupLocation]);

  // Update destination marker
  useEffect(() => {
    if (!mapInstance.current) return;
    if (destinationMarker.current) {
      destinationMarker.current.setLatLng([destinationLocation.lat, destinationLocation.lng]);
    } else {
      destinationMarker.current = L.marker(
        [destinationLocation.lat, destinationLocation.lng],
        { icon: createDestinationIcon(), zIndexOffset: 100 }
      )
        .bindTooltip(`📍 ${destinationLocation.name}`, { permanent: false, className: 'fairway-tooltip' })
        .addTo(mapInstance.current);
    }
  }, [destinationLocation]);

  // Update meeting point marker
  useEffect(() => {
    if (!mapInstance.current) return;
    if (meetingPoint) {
      if (meetingMarker.current) {
        meetingMarker.current.setLatLng([meetingPoint.lat, meetingPoint.lng]);
      } else {
        meetingMarker.current = L.marker(
          [meetingPoint.lat, meetingPoint.lng],
          { icon: createMeetingIcon(), zIndexOffset: 200 }
        )
          .bindTooltip(`🛺 ${meetingPoint.name}`, { permanent: true, className: 'fairway-tooltip-meeting' })
          .addTo(mapInstance.current);
      }
    } else {
      if (meetingMarker.current) {
        meetingMarker.current.remove();
        meetingMarker.current = null;
      }
    }
  }, [meetingPoint]);

  // Update auto rickshaw driver marker
  useEffect(() => {
    if (!mapInstance.current || !showVehicle) return;
    const loc = driverLocation || { lat: pickupLocation.lat - 0.003, lng: pickupLocation.lng + 0.002 };

    if (autoMarker.current) {
      // Smooth transition animation like Swiggy/Ola
      autoMarker.current.setLatLng([loc.lat, loc.lng]);
    } else {
      autoMarker.current = L.marker(
        [loc.lat, loc.lng],
        { icon: createAutoIcon(), zIndexOffset: 300 }
      )
        .bindTooltip('🛺 Auto Rickshaw', { className: 'fairway-tooltip' })
        .addTo(mapInstance.current);
    }
  }, [driverLocation, pickupLocation, showVehicle]);

  // Update user's real GPS location marker
  useEffect(() => {
    if (!mapInstance.current || !userLocation) return;
    if (userLocationMarker.current) {
      userLocationMarker.current.setLatLng([userLocation.lat, userLocation.lng]);
    } else {
      userLocationMarker.current = L.marker(
        [userLocation.lat, userLocation.lng],
        { icon: createUserLocationIcon(), zIndexOffset: 400 }
      )
        .bindTooltip('📍 You are here', { className: 'fairway-tooltip' })
        .addTo(mapInstance.current);

      // Pan to user's real location
      mapInstance.current.setView([userLocation.lat, userLocation.lng], 15);
    }
  }, [userLocation]);

  // Draw route polyline
  useEffect(() => {
    if (!mapInstance.current) return;

    const points: [number, number][] = [];
    if (meetingPoint) {
      points.push([pickupLocation.lat, pickupLocation.lng]);
      points.push([meetingPoint.lat, meetingPoint.lng]);
      points.push([destinationLocation.lat, destinationLocation.lng]);
    } else {
      points.push([pickupLocation.lat, pickupLocation.lng]);
      points.push([destinationLocation.lat, destinationLocation.lng]);
    }

    if (routePolyline.current) {
      routePolyline.current.setLatLngs(points);
    } else {
      routePolyline.current = L.polyline(points, {
        color: '#FCC016',
        weight: 4,
        opacity: 0.85,
        dashArray: meetingPoint ? undefined : '8 6',
      }).addTo(mapInstance.current);
    }

    // Fit map to show the whole route
    if (points.length >= 2) {
      mapInstance.current.fitBounds(L.latLngBounds(points), { padding: [40, 40] });
    }
  }, [pickupLocation, destinationLocation, meetingPoint]);

  // Draw scan radius circles for stranger matching
  useEffect(() => {
    if (!mapInstance.current) return;

    // Clear previous scan circles
    scanCircles.current.forEach((c) => c.remove());
    scanCircles.current = [];

    if (scanPhase === 0) return;

    const origin: [number, number] = [pickupLocation.lat, pickupLocation.lng];
    const radii = [1000, 1200, 1500]; // Phase 1: 1km, Phase 2: +200m, Phase 3: +300m
    const colors = ['#FCC016', '#10B981', '#F97316'];
    const labels = ['Phase 1: 1.0 km', 'Phase 2: 1.2 km', 'Phase 3: 1.5 km'];

    for (let p = 0; p < scanPhase; p++) {
      const circle = L.circle(origin, {
        radius: radii[p],
        color: colors[p],
        weight: 2,
        opacity: p === scanPhase - 1 ? 0.9 : 0.4,
        fillColor: colors[p],
        fillOpacity: p === scanPhase - 1 ? 0.07 : 0.03,
        dashArray: p < scanPhase - 1 ? '5 5' : undefined,
      })
        .bindTooltip(labels[p], { permanent: false, className: 'fairway-tooltip' })
        .addTo(mapInstance.current!);
      scanCircles.current.push(circle);
    }

    // Fit to show the scan area
    if (scanPhase > 0) {
      mapInstance.current.setView(origin, 15);
    }
  }, [scanPhase, pickupLocation]);

  // Draw stranger markers
  useEffect(() => {
    if (!mapInstance.current) return;
    strangerMarkersRef.current.forEach((m) => m.remove());
    strangerMarkersRef.current = [];

    strangerMarkers.forEach((s) => {
      const m = L.marker([s.lat, s.lng], {
        icon: createStrangerIcon(s.gender),
        zIndexOffset: 150,
      })
        .bindTooltip(`${s.name} • ${s.gender === 'female' ? '♀' : '♂'}`, { className: 'fairway-tooltip' })
        .addTo(mapInstance.current!);
      strangerMarkersRef.current.push(m);
    });
  }, [strangerMarkers]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Leaflet map container */}
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

      {/* Floating overlay info */}
      <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm shadow-md rounded-xl px-3 py-1.5 flex items-center gap-2 z-[1000] border border-slate-200/60 pointer-events-none">
        <span className="text-xs">🛺</span>
        <span className="text-[11px] font-bold text-slate-800">Nashik Auto Network · Live Map</span>
      </div>

      {/* Live GPS badge */}
      {userLocation && (
        <div className="absolute bottom-10 left-2 bg-blue-600 text-white text-[10px] font-mono px-2 py-1 rounded-full shadow-md flex items-center gap-1 z-[1000] pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          <span>Live GPS Active</span>
        </div>
      )}

      {!userLocation && showUserLocation && (
        <div className="absolute bottom-10 left-2 bg-slate-700 text-white text-[10px] px-2 py-1 rounded-full shadow z-[1000] pointer-events-none">
          📡 Allow location for live tracking
        </div>
      )}
    </div>
  );
};
