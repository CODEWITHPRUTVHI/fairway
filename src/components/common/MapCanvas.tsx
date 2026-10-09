import React from 'react';
import { LocationPoint, RouteStop } from '../../types';

interface MapCanvasProps {
  pickupLocation: LocationPoint;
  destinationLocation: LocationPoint;
  meetingPoint?: LocationPoint;
  stops?: RouteStop[];
  driverLocation?: { lat: number; lng: number };
  showVehicle?: boolean;
  className?: string;
}

export const MapCanvas: React.FC<MapCanvasProps> = ({
  pickupLocation,
  destinationLocation,
  meetingPoint,
  stops,
  driverLocation,
  showVehicle = true,
  className = '',
}) => {
  // Nashik District Bounding Box:
  // Lat: 19.950 (Station / CIDCO south) to 20.025 (Panchavati / Gangapur north)
  // Lng: 73.720 (Satpur west) to 73.840 (Nashik Road Station east)
  const latMin = 19.950;
  const latMax = 20.025;
  const lngMin = 73.720;
  const lngMax = 73.840;

  const toSvgX = (lng: number) => {
    return Math.max(10, Math.min(350, ((lng - lngMin) / (lngMax - lngMin)) * 360));
  };

  const toSvgY = (lat: number) => {
    // Invert Y for SVG
    return Math.max(10, Math.min(350, 360 - ((lat - latMin) / (latMax - latMin)) * 360));
  };

  const pX = toSvgX(pickupLocation.lng);
  const pY = toSvgY(pickupLocation.lat);

  const dX = toSvgX(destinationLocation.lng);
  const dY = toSvgY(destinationLocation.lat);

  const mX = meetingPoint ? toSvgX(meetingPoint.lng) : (pX + dX) / 2;
  const mY = meetingPoint ? toSvgY(meetingPoint.lat) : (pY + dY) / 2;

  const carX = driverLocation ? toSvgX(driverLocation.lng) : mX - 15;
  const carY = driverLocation ? toSvgY(driverLocation.lat) : mY + 20;

  return (
    <div
      className={`relative w-full h-full bg-[#E8ECE6] overflow-hidden select-none ${className}`}
    >
      <svg
        viewBox="0 0 360 360"
        className="w-full h-full object-cover"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="nashikGrid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path
              d="M 28 0 L 0 0 0 28"
              fill="none"
              stroke="#D4DFD4"
              strokeWidth="0.8"
            />
          </pattern>
        </defs>

        {/* Map Canvas Background */}
        <rect width="360" height="360" fill="#EAF0EA" />
        <rect width="360" height="360" fill="url(#nashikGrid)" />

        {/* Green Hills & Parks (Pandav Leni / Godavari Ghats) */}
        <path
          d="M 10,260 Q 60,220 90,290 T 20,350 Z"
          fill="#CCE3CD"
          opacity="0.9"
        />
        <text x="35" y="310" fontSize="7" fontWeight="bold" fill="#406942">
          PANDAV LENI
        </text>

        <path
          d="M 190,40 Q 250,20 280,70 T 220,110 Z"
          fill="#CCE3CD"
          opacity="0.8"
        />
        <text x="215" y="70" fontSize="7" fontWeight="bold" fill="#406942">
          PANCHAVATI
        </text>

        {/* HOLY GODAVARI RIVER (Flows through central Nashik) */}
        <path
          d="M 60,60 C 120,80 160,110 200,90 C 240,70 270,120 310,140 C 340,155 360,170 360,175"
          fill="none"
          stroke="#93C5FD"
          strokeWidth="12"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M 60,60 C 120,80 160,110 200,90 C 240,70 270,120 310,140 C 340,155 360,170 360,175"
          fill="none"
          stroke="#60A5FA"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <text
          x="180"
          y="108"
          fontSize="8"
          fontWeight="700"
          fill="#1D4ED8"
          textAnchor="middle"
        >
          Godavari River (रामकुंड)
        </text>

        {/* NASHIK ARTERIAL HIGHWAYS & STREETS */}
        {/* Mumbai-Agra Highway (NH-3 / Mumbai Naka) */}
        <line
          x1="30"
          y1="340"
          x2="330"
          y2="90"
          stroke="#FFFFFF"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <line
          x1="30"
          y1="340"
          x2="330"
          y2="90"
          stroke="#CBD5E1"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Trimbak Road to CBS */}
        <line
          x1="20"
          y1="160"
          x2="220"
          y2="190"
          stroke="#FFFFFF"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <line
          x1="20"
          y1="160"
          x2="220"
          y2="190"
          stroke="#CBD5E1"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* College Road (connecting Gangapur Rd to Canada Corner) */}
        <line
          x1="120"
          y1="80"
          x2="170"
          y2="220"
          stroke="#FFFFFF"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <line
          x1="120"
          y1="80"
          x2="170"
          y2="220"
          stroke="#CBD5E1"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Nashik-Pune Highway (towards Nashik Road Station) */}
        <line
          x1="220"
          y1="190"
          x2="340"
          y2="310"
          stroke="#FFFFFF"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <line
          x1="220"
          y1="190"
          x2="340"
          y2="310"
          stroke="#CBD5E1"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Street Labels */}
        <text x="140" y="165" fontSize="7" fontWeight="bold" fill="#64748B">
          COLLEGE ROAD
        </text>
        <text x="210" y="180" fontSize="8" fontWeight="bold" fill="#1E1E1E">
          CBS CHOWK
        </text>
        <text x="280" y="275" fontSize="7" fontWeight="bold" fill="#64748B">
          NASHIK ROAD STN
        </text>

        {/* WALKING PATH TO AUTO STAND (Dashed Black Line) */}
        {meetingPoint && (
          <path
            d={`M ${pX},${pY} L ${mX},${mY}`}
            stroke="#1E1E1E"
            strokeWidth="2.5"
            strokeDasharray="4 3"
            fill="none"
          />
        )}

        {/* SHARED AUTO POOLED ROUTE (Yellow Taxi-Gold Line) */}
        <path
          d={`M ${mX},${mY} Q ${(mX + dX) / 2 + 20},${(mY + dY) / 2 - 15} ${dX},${dY}`}
          stroke="#FCC016"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d={`M ${mX},${mY} Q ${(mX + dX) / 2 + 20},${(mY + dY) / 2 - 15} ${dX},${dY}`}
          stroke="#1E1E1E"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          fill="none"
          opacity="0.8"
        />

        {/* PICKUP PIN */}
        <g transform={`translate(${pX}, ${pY})`}>
          <circle r="7" fill="#1E1E1E" />
          <circle r="3" fill="#FFFFFF" />
          <text
            x="11"
            y="4"
            fontSize="8"
            fontWeight="bold"
            fill="#1E1E1E"
          >
            {pickupLocation.name.split('(')[0]}
          </text>
        </g>

        {/* DESIGNATED AUTO STAND / MEETUP POINT */}
        {meetingPoint && (
          <g transform={`translate(${mX}, ${mY})`}>
            <circle r="14" fill="#FCC016" opacity="0.35" className="animate-ping" />
            <circle r="9" fill="#FCC016" stroke="#1E1E1E" strokeWidth="2" />
            <circle r="3.5" fill="#1E1E1E" />
            <rect
              x="-46"
              y="-22"
              width="92"
              height="15"
              rx="7.5"
              fill="#1E1E1E"
              opacity="0.9"
            />
            <text
              x="0"
              y="-12"
              fontSize="7.5"
              fontWeight="bold"
              fill="#FCC016"
              textAnchor="middle"
            >
              🛺 Auto Stand
            </text>
          </g>
        )}

        {/* DESTINATION PIN */}
        <g transform={`translate(${dX}, ${dY})`}>
          <path
            d="M 0,-18 C -7,-18 -10,-11 0,0 C 10,-11 7,-18 0,-18 Z"
            fill="#FCC016"
            stroke="#1E1E1E"
            strokeWidth="1.5"
          />
          <circle cx="0" cy="-11" r="3" fill="#1E1E1E" />
          <text
            x="11"
            y="-7"
            fontSize="8"
            fontWeight="bold"
            fill="#1E1E1E"
          >
            {destinationLocation.name.split('(')[0]}
          </text>
        </g>

        {/* REAL-TIME MOVING AUTO RICKSHAW ICON */}
        {showVehicle && (
          <g transform={`translate(${carX}, ${carY})`} className="transition-all duration-700 ease-out">
            {/* Halo pulse */}
            <circle r="16" fill="#FCC016" opacity="0.25" className="animate-pulse" />
            {/* Auto Rickshaw Geometry (Iconic 3-wheeler profile with yellow roof & black sides) */}
            {/* Rear Wheels */}
            <circle cx="-6" cy="7" r="3" fill="#1E1E1E" />
            <circle cx="6" cy="7" r="3" fill="#1E1E1E" />
            {/* Front Single Wheel */}
            <circle cx="0" cy="-8" r="3" fill="#1E1E1E" />
            {/* Body */}
            <path
              d="M -8,5 L -7,-3 L 0,-8 L 7,-3 L 8,5 Z"
              fill="#1E1E1E"
              stroke="#FCC016"
              strokeWidth="1.2"
            />
            {/* Yellow Canopy Roof */}
            <rect x="-7" y="-2" width="14" height="6" rx="2" fill="#FCC016" />
            {/* Windshield */}
            <polygon points="-4,-2 0,-6 4,-2" fill="#60A5FA" opacity="0.8" />
            {/* Headlight beam */}
            <polygon points="-2,-8 0,-14 2,-8" fill="#FEF08A" opacity="0.6" />
            {/* Label */}
            <rect x="-18" y="-19" width="36" height="10" rx="4" fill="#1E1E1E" />
            <text x="0" y="-12" fontSize="6.5" fontWeight="bold" fill="#FCC016" textAnchor="middle">
              MH-15 Auto
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
