import { LocationPoint, UserProfile, VehicleOption, VoucherPromotion } from '../types';

export const NASHIK_LOCATIONS: LocationPoint[] = [
  {
    id: 'loc-cbs',
    name: 'CBS (Central Bus Stand)',
    address: 'CBS Chowk, Old Nashik, Nashik 422001',
    lat: 19.9975,
    lng: 73.7898,
  },
  {
    id: 'loc-college-rd',
    name: 'College Road (BYK Chowk)',
    address: 'Near Big Bazaar, College Road, Nashik 422005',
    lat: 20.0065,
    lng: 73.7650,
  },
  {
    id: 'loc-gangapur-rd',
    name: 'Gangapur Road (Jehan Circle)',
    address: 'Jehan Circle, Gangapur Road, Nashik 422013',
    lat: 20.0150,
    lng: 73.7680,
  },
  {
    id: 'loc-nashik-rd',
    name: 'Nashik Road Railway Station',
    address: 'Station Road, Nashik Road, Nashik 422101',
    lat: 19.9570,
    lng: 73.8340,
  },
  {
    id: 'loc-panchavati',
    name: 'Panchavati (Ramkund Ghat)',
    address: 'Godavari Riverbank, Panchavati, Nashik 422003',
    lat: 20.0090,
    lng: 73.7925,
  },
  {
    id: 'loc-indira-nagar',
    name: 'Indira Nagar / Mumbai Naka',
    address: 'Mumbai Naka Highway Junction, Nashik 422009',
    lat: 19.9850,
    lng: 73.7800,
  },
  {
    id: 'loc-cidco',
    name: 'CIDCO (Trimurti Chowk)',
    address: 'Trimurti Chowk, New Nashik (CIDCO) 422009',
    lat: 19.9720,
    lng: 73.7550,
  },
  {
    id: 'loc-satpur',
    name: 'Satpur MIDC Industrial Area',
    address: 'VIP Lounge Circle, Satpur MIDC, Nashik 422007',
    lat: 20.0010,
    lng: 73.7250,
  },
];

export const VEHICLE_OPTIONS: VehicleOption[] = [
  {
    id: 'auto-share-3',
    name: 'Share-Auto (3-Seater)',
    seats: 3,
    soloPrice: 40.00,
    pooledEstimate: 22.00,
    iconType: 'car4',
    description: 'Standard Bajaj RE city auto rickshaw for fast pooling',
    discountTag: 'Save up to 45%',
  },
  {
    id: 'auto-ev',
    name: 'Mahindra Treo EV Auto',
    seats: 4,
    soloPrice: 35.00,
    pooledEstimate: 18.00,
    iconType: 'car4',
    description: 'Silent, zero-emission green electric auto rickshaw',
    discountTag: 'Save up to 48%',
  },
  {
    id: 'auto-maxi-6',
    name: 'Maxi Auto (6-Seater)',
    seats: 6,
    soloPrice: 55.00,
    pooledEstimate: 25.00,
    iconType: 'car7',
    description: 'High-capacity Piaggio Ape / Vikram route auto',
    discountTag: 'Save up to 54%',
  },
  {
    id: 'auto-special',
    name: 'Special Reserved Auto',
    seats: 3,
    soloPrice: 65.00,
    pooledEstimate: 45.00,
    iconType: 'taxi4',
    description: 'Direct door-to-door reserved meter auto',
    discountTag: 'Save up to 30%',
  },
];

export const PROMOTIONS: VoucherPromotion[] = [
  {
    id: 'v-nashik-1',
    title: 'Nashik Auto Share',
    subtitle: '₹10 OFF on College Rd - Station Trips',
    discountType: 'FIXED',
    discountValue: 10,
    expiryDate: '31/12/2026',
    code: 'NASHIK10',
    vehicleTier: 'Share-Auto (3-Seater)',
  },
  {
    id: 'v-nashik-2',
    title: 'EV Auto Green Discount',
    subtitle: '15% Discount on Mahindra Treo EV',
    discountType: 'PERCENT',
    discountValue: 15,
    expiryDate: '15/11/2026',
    code: 'GREENEV',
    vehicleTier: 'Mahindra Treo EV Auto',
  },
  {
    id: 'v-nashik-3',
    title: 'Women Pool Commute',
    subtitle: '₹15 OFF for Verified Women-Only Auto Groups',
    discountType: 'FIXED',
    discountValue: 15,
    expiryDate: '30/11/2026',
    code: 'SAKHI15',
    vehicleTier: 'Share-Auto (3-Seater)',
  },
];

export const SEEDED_PASSENGERS: UserProfile[] = [
  {
    id: 'user-pooja',
    name: 'Pooja Sharma',
    phone: '+91 98221 44556',
    role: 'CUSTOMER',
    gender: 'female',
    rating: 4.96,
  },
  {
    id: 'user-snehal',
    name: 'Snehal Patil',
    phone: '+91 98233 77889',
    role: 'CUSTOMER',
    gender: 'female',
    rating: 4.91,
  },
  {
    id: 'user-rahul',
    name: 'Rahul Deshmukh',
    phone: '+91 94222 33445',
    role: 'CUSTOMER',
    gender: 'male',
    rating: 4.84,
  },
];

export const SEEDED_DRIVERS = [
  {
    id: 'driver-ramesh',
    name: 'Ramesh Shinde (Kaka)',
    phone: '+91 98220 12345',
    role: 'DRIVER' as const,
    gender: 'male' as const,
    rating: 4.97,
    vehicleModel: 'Bajaj Compact RE (MH-15 Auto)',
    plateNumber: 'MH-15 EF 4321',
    vehicleColor: 'Yellow & Black Auto',
    capacity: 3,
    isOnline: true,
    location: { lat: 19.9980, lng: 73.7890 }, // Near CBS
  },
  {
    id: 'driver-ganesh',
    name: 'Ganesh Bhalerao',
    phone: '+91 98230 67890',
    role: 'DRIVER' as const,
    gender: 'male' as const,
    rating: 4.94,
    vehicleModel: 'Mahindra Treo Electric Auto',
    plateNumber: 'MH-15 EV 8899',
    vehicleColor: 'Green & Yellow EV Auto',
    capacity: 4,
    isOnline: true,
    location: { lat: 20.0050, lng: 73.7660 }, // Near College Road
  },
];

export const DEFAULT_SYSTEM_CONFIG: import('../types').SystemConfig = {
  maxAllowedDetourPercent: 15.0,
  maxWalkingRadiusMeters: 250,
  maxWaitTimeWindowMin: 8,
  platformCommissionPercent: 10.0, // Nashik Auto platform commission 10%
  trafficCongestionFactor: 1.25,
  demandMultiplier: 1.0,
  demandTier: 'NORMAL',
};

export const INITIAL_AUDIT_LOGS: import('../types').AuditLogEvent[] = [
  {
    id: 'aud-nashik-1',
    timestamp: Date.now() - 3600000,
    actor: 'NASHIK_DISPATCH_ENGINE',
    action: 'SHARE_AUTO_MATCH_FORMED',
    category: 'DISPATCH',
    details: 'Matched Pooja (CBS) with Snehal (College Rd). Auto Detour verified at +7.8% (Limit: <= 15.0%).',
  },
  {
    id: 'aud-nashik-2',
    timestamp: Date.now() - 3400000,
    actor: 'SHAPLEY_FARE_CORE',
    action: 'AUTO_FARE_RECONCILED',
    category: 'FINANCE',
    details: 'Allocated ₹44.00 pooled auto fare. Rider 1: ₹22.00, Rider 2: ₹22.00. 100% budget balance.',
  },
  {
    id: 'aud-nashik-3',
    timestamp: Date.now() - 1800000,
    actor: 'SECURITY_PIN_GATEWAY',
    action: 'BOARDING_PIN_VERIFIED',
    category: 'SECURITY',
    details: 'Driver Ramesh Shinde verified 4-digit PIN for passenger Pooja at CBS Auto Stand.',
  },
];

export const PAST_RIDES: import('../types').PastRideHistoryItem[] = [
  {
    id: 'ride-nashik-1',
    date: 'Yesterday, 17:30',
    originName: 'College Road (BYK Chowk)',
    destName: 'Nashik Road Railway Station',
    vehicleName: 'Share-Auto (3-Seater)',
    soloFare: 120.00,
    actualPaidFare: 65.00,
    savings: 55.00,
    detourPercent: 8.4,
    isPooled: true,
    coPassengers: ['Snehal P.'],
    driverName: 'Ramesh Shinde',
    ratingGiven: 5,
  },
  {
    id: 'ride-nashik-2',
    date: '08 Oct, 09:15',
    originName: 'CBS (Central Bus Stand)',
    destName: 'Gangapur Road (Jehan Circle)',
    vehicleName: 'Mahindra Treo EV Auto',
    soloFare: 50.00,
    actualPaidFare: 28.00,
    savings: 22.00,
    detourPercent: 6.2,
    isPooled: true,
    coPassengers: ['Rahul D.'],
    driverName: 'Ganesh Bhalerao',
    ratingGiven: 5,
  },
];
