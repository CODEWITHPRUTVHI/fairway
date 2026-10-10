import React, { useState } from 'react';
import {
  Menu,
  Settings,
  MapPin,
  Circle,
  Plus,
  Shield,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Share2,
  Phone,
  ChevronRight,
  Gift,
  Coins,
  ArrowLeft,
  X,
  Lock,
  KeyRound,
  Compass,
  History,
  User,
  HelpCircle,
  LogOut,
  Star,
  Check,
  Radio,
  LogIn,
  Users,
  CheckCircle,
  ThumbsUp,
  TrendingDown,
  RotateCcw,
  Globe,
} from 'lucide-react';
import { useFairwayStore } from '../../services/store';
import { NASHIK_LOCATIONS, PROMOTIONS, VEHICLE_OPTIONS } from '../../data/mockData';
import { LiveMap } from '../common/LiveMap';
import { RideHistoryModal } from './RideHistoryModal';
import { ProfileContactsModal } from './ProfileContactsModal';
import { OnboardingModal } from './OnboardingModal';
import { AuthModal } from '../auth/AuthModal';
import { StrangerMatchingModal } from './StrangerMatchingModal';
import { TRANSLATIONS } from '../../services/i18n';
import { calculateUrbanRoadDistanceKm } from '../../algorithms/routing';

export const CustomerApp: React.FC = () => {
  const {
    state,
    setRole,
    setLanguage,
    setPickup,
    setDestination,
    setSelectedVehicle,
    setWomenOnly,
    setPaymentMethod,
    bookRide,
    confirmStrangerMatch,
    triggerMatchingTimeout,
    simulateInstantMatch,
    retryMatchingSearch,
    bookSoloDirect,
    setDemandTier,
    markPassengerReady,
    acceptProposal,
    rejectProposal,
    triggerSOS,
    cancelActiveRide,
    rateAndCloseTrip,
    switchUser,
    addTrustedContact,
    removeTrustedContact,
    logoutCustomer,
  } = useFairwayStore();

  const t = TRANSLATIONS[state.language || 'en'];

  const [activeTab, setActiveTab] = useState<'BOOK' | 'PROMOTIONS' | 'SAFETY'>('BOOK');
  const [showDrawer, setShowDrawer] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showStrangerScanner, setShowStrangerScanner] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShapleyModal, setShowShapleyModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);

  // Quick preset destinations in Nashik
  const handleQuickSelect = (locId: string) => {
    const loc = NASHIK_LOCATIONS.find((l) => l.id === locId);
    if (loc) {
      setDestination(loc);
    }
  };

  const currentAllocation =
    state.activeTrip?.allocations[state.currentUser.id] ||
    state.activeProposal?.allocations[state.currentUser.id];

  // ── REAL-TIME DYNAMIC FARE CALCULATION ──
  const tripRoadDistKm = Math.max(
    1.2,
    Number(calculateUrbanRoadDistanceKm(state.pickupLocation, state.destinationLocation).toFixed(1))
  );
  const ratePerKm = state.selectedVehicle.perKmRate || 14;
  const calculatedSoloFare = Math.round(
    Math.max(30, (25 + Math.max(0, tripRoadDistKm - 1.5) * ratePerKm) * state.demandMultiplier)
  );
  const calculatedPooledFare = Math.round(Math.max(16, calculatedSoloFare * 0.40));
  const calculatedSavings = calculatedSoloFare - calculatedPooledFare;
  const calculatedSavingsPct = Math.round((calculatedSavings / calculatedSoloFare) * 100);
  const stopBIntermediateFare = Math.round(calculatedPooledFare * 0.72);

  return (
    <div className="flex-1 flex flex-col bg-[#F8F9FA] relative">
      {/* ── App Top Bar ── FIXED ALIGNMENT: hamburger | name | language | sakhi | logout+settings */}
      <div className="h-14 px-3 bg-white/95 backdrop-blur-md border-b border-slate-100 flex items-center gap-2 z-30 shrink-0">
        {/* Left: Hamburger + Name */}
        <button
          onClick={() => setShowDrawer(true)}
          className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer shrink-0"
        >
          <Menu className="w-4.5 h-4.5" />
        </button>

        {/* Center: Name (flex-1 so it takes remaining space, truncates cleanly) */}
        <div className="flex-1 min-w-0">
          <span className="text-[10px] text-slate-400 font-medium block leading-none">Nashik · Passenger</span>
          <h2 className="text-sm font-black text-slate-900 leading-tight truncate">
            Namaste, {state.currentUser.name.split(' ')[0]}! 👋
          </h2>
        </div>

        {/* Right: Language pill */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold shrink-0">
          <button
            onClick={() => setLanguage('en')}
            className={`px-1.5 py-0.5 rounded cursor-pointer transition-all ${state.language === 'en' ? 'bg-[#FCC016] text-slate-950 font-black shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('mr')}
            className={`px-1.5 py-0.5 rounded cursor-pointer transition-all ${state.language === 'mr' ? 'bg-[#FCC016] text-slate-950 font-black shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
          >
            मर
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-1.5 py-0.5 rounded cursor-pointer transition-all ${state.language === 'hi' ? 'bg-[#FCC016] text-slate-950 font-black shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
          >
            हि
          </button>
        </div>

        {/* Women-only active indicator */}
        {state.currentUser.gender === 'female' && state.womenOnlyPreference && (
          <span className="shrink-0 text-[10px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 border border-purple-200">
            <Shield className="w-2.5 h-2.5" />
            <span>Sakhi</span>
          </span>
        )}

        {/* Logout */}
        <button
          onClick={logoutCustomer}
          title="Log Out"
          className="w-8 h-8 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 flex items-center justify-center border border-amber-200 cursor-pointer transition-colors shrink-0"
        >
          <LogOut className="w-3.5 h-3.5 text-amber-800" />
        </button>

        {/* Settings */}
        <button
          onClick={() => setActiveTab('SAFETY')}
          title="Safety & Settings"
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer transition-colors shrink-0"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main View Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Real Leaflet Map Section */}
        {/* Real Leaflet Map Section (Constrained height with strict isolation) */}
        <div className="h-[38%] min-h-[190px] w-full relative z-0 isolate overflow-hidden shrink-0">
          <LiveMap
            pickupLocation={state.pickupLocation}
            destinationLocation={state.destinationLocation}
            meetingPoint={
              state.activeTrip?.meetingPoint ||
              state.activeProposal?.meetingPoint
            }
            driverLocation={
              state.activeTrip ? state.activeTrip.driverLocation : state.driverLocation
            }
            showVehicle={true}
            showUserLocation={true}
            scanPhase={state.isSearchingPartners ? (state.matchingPhase || 1) as any : 0}
          />

          {/* Live GPS movement badge */}
          {state.activeTrip && state.activeTrip.state === 'DRIVER_ASSIGNED' && (
            <div className="absolute bottom-3 left-3 bg-slate-900/90 text-[#FCC016] text-[10px] font-mono px-2.5 py-1 rounded-full shadow-lg border border-amber-400/40 flex items-center gap-1.5 z-10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Live GPS: Auto approaching {state.activeTrip.meetingPoint.name}</span>
            </div>
          )}
        </div>

        {/* Dynamic Bottom Sheet Container (Full smooth touch scroll with bottom padding) */}
        <div className="flex-1 min-h-0 bg-white rounded-t-3xl shadow-2xl border-t border-slate-100 overflow-y-auto overscroll-contain px-4 py-3 pb-28 flex flex-col z-10 relative">
          {/* Subtle Touch Drag Indicator */}
          <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-2 shrink-0 cursor-grab" />
          {/* SEARCHING RADAR STATE: LIVE 5-MINUTE BATCHING COUNTDOWN */}
          {state.isSearchingPartners ? (
            <div className="py-6 text-center space-y-3.5 animate-in fade-in">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#FCC016] opacity-25 animate-ping" />
                <div className="w-12 h-12 rounded-full bg-[#FCC016] text-[#1E1E1E] font-black text-2xl flex items-center justify-center shadow-lg">
                  🛺
                </div>
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-950 font-mono text-xs font-bold">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>
                    {String(Math.floor(state.matchingSecondsLeft / 60)).padStart(2, '0')}:
                    {String(state.matchingSecondsLeft % 60).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-amber-700 font-sans font-medium">(5-min window)</span>
                </div>

                <h4 className="text-sm font-extrabold text-slate-900 mt-1">
                  Matching Real-Time Auto Partners
                </h4>
                <p className="text-xs font-semibold text-amber-700 animate-pulse">
                  {state.matchingSearchStep || 'Scanning 1.0 km Anchor Radius...'}
                </p>
                <p className="text-[10px] text-slate-400">
                  Anchor radius: 1.0 km around {state.pickupLocation.name.split('(')[0]} · Max 3 auto capacity · ≤ 15% Detour bound
                </p>
              </div>

              <div className="w-48 h-1.5 bg-slate-100 rounded-full mx-auto overflow-hidden">
                <div className="w-full h-full bg-[#FCC016] rounded-full animate-pulse" />
              </div>

              {/* Demo Fast-Forward / Timeout Test Controls */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={simulateInstantMatch}
                  className="px-3 py-1.5 bg-[#FCC016] hover:bg-amber-400 text-slate-950 font-black text-[11px] rounded-xl shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <span>Instant Match (3 Riders)</span>
                </button>
                <button
                  type="button"
                  onClick={triggerMatchingTimeout}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-xl cursor-pointer"
                >
                  <span>Simulate 5-Min Timeout</span>
                </button>
              </div>
            </div>
          ) : state.matchingTimedOut ? (
            /* 5-MINUTE TIMEOUT NO-MATCH FALLBACK SCREEN (Phase 4) */
            <div className="py-6 text-center space-y-3.5 animate-in fade-in">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto text-xl font-bold">
                ⏱️
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900">
                  5-Minute Matching Window Expired
                </h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  No compatible co-passengers were found within 1.0 km of {state.pickupLocation.name.split('(')[0]} heading your direction with ≤ 15% detour limit.
                </p>
                <div className="text-[10px] text-slate-400 font-mono">
                  Request {state.activeRequest?.id || 'REQ-AUTO'} released safely.
                </div>
              </div>

              <div className="space-y-2 max-w-xs mx-auto pt-2">
                <button
                  type="button"
                  onClick={retryMatchingSearch}
                  className="w-full py-2.5 bg-[#FCC016] hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry 5-Min Shared Auto Search</span>
                </button>

                <button
                  type="button"
                  onClick={bookSoloDirect}
                  className="w-full py-2.5 bg-slate-900 hover:bg-black text-[#FCC016] font-bold text-xs rounded-xl shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Book Direct Solo Auto (₹{(60 * state.demandMultiplier).toFixed(0)}) →</span>
                </button>

                <button
                  type="button"
                  onClick={() => cancelActiveRide('User cancelled after timeout')}
                  className="w-full py-2 text-slate-500 hover:text-slate-800 font-bold text-xs cursor-pointer"
                >
                  Cancel Request
                </button>
              </div>
            </div>
          ) : state.activeTrip ? (
            /* STATE 1: ACTIVE TRIP IN PROGRESS OR DRIVER EN ROUTE */
            <div className="space-y-3">
              {/* Trip Status Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-amber-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    {state.activeTrip.state === 'DRIVER_PENDING'
                      ? 'ASSIGNING NEAREST AUTO...'
                      : state.activeTrip.state === 'DRIVER_ASSIGNED' || state.activeTrip.state === 'EN_ROUTE_TO_MEETUP'
                      ? 'AUTO EN-ROUTE TO AUTO STAND'
                      : state.activeTrip.state === 'AT_MEETUP'
                      ? 'AUTO ARRIVED AT AUTO STAND'
                      : state.activeTrip.state === 'PIN_VERIFIED' || state.activeTrip.state === 'IN_PROGRESS'
                      ? 'SHARED AUTO TRIP IN PROGRESS'
                      : 'TRIP COMPLETED'}
                  </span>
                  <h3 className="text-sm font-black text-slate-900">
                    {state.activeTrip.vehicleModel}
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold bg-[#FCC016] text-slate-950 px-2.5 py-1 rounded-md border border-amber-400">
                  {state.activeTrip.plateNumber}
                </span>
              </div>

              {/* CRITICAL 4-DIGIT PIN BOARDING VERIFICATION */}
              {state.activeTrip.state !== 'COMPLETED' && (
                <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#FCC016] text-[#1E1E1E] flex items-center justify-center font-bold">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-amber-950">
                        Auto Boarding PIN
                      </div>
                      <div className="text-[10px] text-amber-800">
                        Tell this code to Auto Kaka before starting
                      </div>
                    </div>
                  </div>
                  <div className="text-xl font-black font-mono tracking-widest bg-white px-3.5 py-1 rounded-xl border border-amber-300 text-slate-900 shadow">
                    {state.activeTrip.pinCode}
                  </div>
                </div>
              )}

              {/* Driver Card Info */}
              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-[#1E1E1E] text-amber-400 font-bold flex items-center justify-center text-sm">
                    🛺
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {state.activeTrip.driverName}
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      ⭐ {state.activeTrip.driverRating} · Verified Nashik Auto Driver
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${state.activeTrip.driverPhone}`}
                    className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Switch to Driver View Button (Helper for testing) */}
              <div className="p-2 bg-slate-900 text-white rounded-xl flex items-center justify-between text-[11px]">
                <span className="text-slate-300">Testing as Auto Driver?</span>
                <button
                  onClick={() => setRole('DRIVER')}
                  className="px-2.5 py-1 bg-[#FCC016] text-[#1E1E1E] rounded-md font-bold text-[10px] hover:bg-amber-400"
                >
                  Switch to Driver App →
                </button>
              </div>

              {/* Shapley & Detour Verification Card */}
              {currentAllocation && (
                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Shapley Shared Fare</span>
                    <span className="text-emerald-700 font-black">
                      ₹{currentAllocation.pooledFare.toFixed(2)}{' '}
                      <span className="line-through text-slate-400 font-normal">
                        ₹{currentAllocation.soloFare.toFixed(2)}
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Individual Detour Bound</span>
                    <span className="font-semibold text-emerald-600">
                      +{currentAllocation.detourPercent}% (≤ 15.0% Limit)
                    </span>
                  </div>
                </div>
              )}

              {/* TRIP COMPLETED DIALOG & RATING */}
              {state.activeTrip.state === 'COMPLETED' ? (
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto font-bold text-lg">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-emerald-950">
                      Destination Reached!
                    </h4>
                    <p className="text-xs text-emerald-700 font-semibold">
                      You saved ₹{currentAllocation ? currentAllocation.savingsAmount.toFixed(2) : '18.00'} on this Share-Auto trip!
                    </p>
                  </div>

                  <div className="flex justify-center gap-2 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setSelectedRating(star)}
                        className={`text-xl ${star <= selectedRating ? 'text-amber-400' : 'text-slate-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => rateAndCloseTrip(selectedRating)}
                    className="w-full py-3 bg-[#1E1E1E] text-white font-bold text-xs rounded-xl hover:bg-black"
                  >
                    Done & Collect Receipt
                  </button>
                </div>
              ) : (
                /* Safety SOS & Cancel Action Bar */
                <div className="pt-1 flex items-center gap-2">
                  <button
                    onClick={() => triggerSOS('Passenger SOS in Nashik Auto')}
                    className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98] transition-transform"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>NASHIK POLICE SOS</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Cancel this Auto ride?')) {
                        cancelActiveRide('User requested cancellation');
                      }
                    }}
                    className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ) : state.activeProposal ? (
            /* STATE 2: MATCH PROPOSAL & AUTO GROUP CREATED (Max 3 Passengers) */
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    {t.groupCreated || 'Auto Rickshaw Group Created!'}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900">
                    MH-15 Auto Pool Group (3/3)
                  </h3>
                </div>
                <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Save ~55%
                </span>
              </div>

              {/* CRITICAL GROUP ID & RIDE OTP DISPLAY */}
              <div className="bg-slate-900 text-white rounded-2xl p-3 shadow-md border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🛺</span>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {t.groupIdOtp || 'Group ID & Ride OTP'}
                      </div>
                      <div className="text-sm font-black font-mono text-[#FCC016]">
                        {state.activeProposal.groupId}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-slate-400">Boarding OTP</div>
                    <div className="text-xl font-black font-mono text-white bg-slate-800 px-2.5 py-0.5 rounded-lg border border-amber-400/40">
                      {state.activeProposal.groupOtp}
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-amber-300/90 bg-slate-800/80 px-2.5 py-1 rounded-xl flex items-center gap-1.5 border border-slate-700">
                  <KeyRound className="w-3 h-3 text-[#FCC016] shrink-0" />
                  <span>{t.otpExplanation || 'This Group ID / OTP acts like Ola/Uber PIN to verify with Auto Kaka'}</span>
                </div>
              </div>

              {/* Designated Safe Meeting Point Card (Calculated from all 3) */}
              <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-2.5 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                  <Compass className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t.autoPickupPoint || 'Auto Pickup Point'}: {state.activeProposal.meetingPoint.name}</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Optimally calculated from all 3 passenger coordinates. Walk {state.activeProposal.walkingDistanceMeters}m ({state.activeProposal.walkingTimeMin} min walk).
                </p>
              </div>

              {/* 3 Group Passengers & Dynamic Split Fares List */}
              <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex justify-between">
                  <span>Group Passengers (Max 3 Auto Capacity)</span>
                  <span>Split Fare</span>
                </div>

                {/* Passenger 1: You */}
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center">
                      1
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                        <span>{state.currentUser.name} (You)</span>
                        <span className="text-[9px] bg-slate-100 text-slate-600 px-1 rounded">Rider</span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                        Drop: {state.destinationLocation.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-black text-emerald-600">
                      ₹{currentAllocation?.pooledFare.toFixed(2) || '24.00'}
                    </div>
                    <div className="text-[9px] text-slate-400 line-through">
                      ₹{currentAllocation?.soloFare.toFixed(2) || '60.00'}
                    </div>
                  </div>
                </div>

                {/* Passenger 2: Snehal Patil */}
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                      2
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <span>Snehal Patil</span>
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1 rounded">Ready ✓</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Drop: Midway Stop B (Dongre Vasti)
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-black text-emerald-600">₹18.00</div>
                    <div className="text-[9px] text-emerald-700 font-semibold">-₹22.00 saved</div>
                  </div>
                </div>

                {/* Passenger 3: Co-Rider */}
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                      3
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <span>{state.womenOnlyPreference ? 'Neha Kulkarni' : 'Rahul Deshmukh'}</span>
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1 rounded">Ready ✓</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Drop: Corridor Stop C
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-black text-emerald-600">₹26.00</div>
                    <div className="text-[9px] text-emerald-700 font-semibold">-₹39.00 saved</div>
                  </div>
                </div>
              </div>

              {/* Ready Status & Auto-Book Button */}
              <div className="space-y-2 pt-1">
                {state.activeProposal.groupReadyStates?.[state.currentUser.id] ? (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>You and all co-passengers are marked READY at stand! Auto auto-booking...</span>
                  </div>
                ) : (
                  <button
                    onClick={() => markPassengerReady(state.currentUser.id)}
                    className="w-full py-3 bg-[#FCC016] hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{t.iAmReady || 'I am Ready at Stand'} — Auto-Book Now (₹{currentAllocation?.pooledFare.toFixed(0) || '24'})</span>
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={rejectProposal}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
                  >
                    {t.decline || 'Decline'}
                  </button>
                  <button
                    onClick={acceptProposal}
                    className="flex-[2] py-2.5 rounded-xl bg-slate-900 text-[#FCC016] font-black text-xs shadow-md hover:bg-black transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>{t.acceptAssign || 'Confirm & Assign Auto'}</span>
                    <ChevronRight className="w-4 h-4 text-[#FCC016]" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* STATE 3: BOOKING INPUT SHEET (Ola / Uber Style with Cost Splitting) */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900">
                  {t.whereTo || 'Where to in Nashik?'}
                </h3>
                <span className="text-[10px] bg-amber-100 text-amber-900 font-mono font-bold px-2 py-0.5 rounded">
                  MH-15 RIKSHAW
                </span>
              </div>

              {/* Origin & Destination Inputs */}
              <div className="space-y-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80">
                {/* Pickup row */}
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-slate-900 shrink-0 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-white" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] text-slate-400 block font-bold">{t.pickupStand || 'Pickup Auto Stand'}</span>
                    <select
                      value={state.pickupLocation.id}
                      onChange={(e) => {
                        const loc = NASHIK_LOCATIONS.find((l) => l.id === e.target.value);
                        if (loc) setPickup(loc);
                      }}
                      className="w-full text-xs font-bold text-slate-800 bg-transparent outline-none cursor-pointer"
                    >
                      {NASHIK_LOCATIONS.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-200 ml-5" />

                {/* Destination row */}
                <div className="flex items-center gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#FCC016] text-[#1E1E1E] shrink-0 flex items-center justify-center font-bold text-[8px]">
                    📍
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] text-slate-400 block font-bold">{t.destination || 'Destination'}</span>
                    <select
                      value={state.destinationLocation.id}
                      onChange={(e) => {
                        const loc = NASHIK_LOCATIONS.find((l) => l.id === e.target.value);
                        if (loc) setDestination(loc);
                      }}
                      className="w-full text-xs font-bold text-slate-800 bg-transparent outline-none cursor-pointer"
                    >
                      {NASHIK_LOCATIONS.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Quick Destination Chips (Nashik Landmarks) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickSelect('loc-college-rd')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg whitespace-nowrap text-[11px] font-semibold cursor-pointer transition-colors active:scale-95"
                >
                  College Road
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSelect('loc-nashik-rd')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg whitespace-nowrap text-[11px] font-semibold cursor-pointer transition-colors active:scale-95"
                >
                  Nashik Road Stn
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSelect('loc-gangapur-rd')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg whitespace-nowrap text-[11px] font-semibold cursor-pointer transition-colors active:scale-95"
                >
                  Gangapur Rd
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSelect('loc-panchavati')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg whitespace-nowrap text-[11px] font-semibold cursor-pointer transition-colors active:scale-95"
                >
                  Ramkund Ghat
                </button>
              </div>

              {/* DYNAMIC FARE & COST SPLITTING PREVIEW (Ola / Uber Style) */}
              <div className="bg-slate-900 text-white rounded-2xl p-3 shadow-md space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#FCC016]" />
                    <span>{t.costSplitTitle || 'Dynamic Fair Cost Splitting'}</span>
                    <span className="text-slate-400 font-normal">({tripRoadDistKm} km)</span>
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">
                    Save ₹{calculatedSavings} ({calculatedSavingsPct}% Off)
                  </span>
                </div>

                {/* Fare comparison */}
                <div className="flex items-baseline justify-between pt-0.5">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total Solo Direct Fare</span>
                    <span className="text-base font-bold text-slate-300 line-through">₹{calculatedSoloFare.toFixed(2)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-300 block">Your Pooled Share-Auto Fare</span>
                    <span className="text-2xl font-black text-[#FCC016]">₹{calculatedPooledFare.toFixed(2)}</span>
                  </div>
                </div>

                {/* Visual Step-by-Step Dropoff Route & Money Split Diagram */}
                <div className="bg-slate-800/90 rounded-xl p-2.5 text-[10px] space-y-2 border border-slate-700">
                  <div className="font-bold text-slate-200 flex items-center justify-between">
                    <span>Route Cost Split (If co-rider drops at Stop B):</span>
                    <span className="text-[9px] text-[#FCC016] font-mono">{tripRoadDistKm} km total</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-center text-[9px]">
                    <div className="bg-slate-700/60 p-1.5 rounded-lg border border-slate-600">
                      <div className="text-slate-400 truncate">Stop A (Pickup)</div>
                      <div className="font-bold text-white truncate">{state.pickupLocation.name.split('(')[0].trim()}</div>
                      <div className="text-[#FCC016] font-semibold mt-0.5">3 Board</div>
                    </div>

                    <div className="bg-emerald-950/60 p-1.5 rounded-lg border border-emerald-600/40">
                      <div className="text-emerald-400 font-bold truncate">Stop B (Midway)</div>
                      <div className="font-bold text-white truncate">Dongre / Chowk</div>
                      <div className="text-emerald-300 font-black mt-0.5">Rider 2: ₹{stopBIntermediateFare}</div>
                    </div>

                    <div className="bg-amber-950/60 p-1.5 rounded-lg border border-amber-500/40">
                      <div className="text-amber-400 font-bold truncate">Stop C (Your Stop)</div>
                      <div className="font-bold text-white truncate">{state.destinationLocation.name.split('(')[0].trim()}</div>
                      <div className="text-[#FCC016] font-black mt-0.5">You: ₹{calculatedPooledFare}</div>
                    </div>
                  </div>

                  <div className="text-[9px] text-slate-300 pt-0.5">
                    💡 <em>{t.costSplitDesc || 'When a rider drops midway at Stop B, their fare is deducted and split, giving the Auto driver full combined earnings of ₹68!'}</em>
                  </div>
                </div>
              </div>

              {/* Women-Only Auto Group Toggle (Mahila Sakhi Auto) - STRICTLY FEMALE PASSENGERS ONLY */}
              {state.currentUser.gender === 'female' && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-purple-950">
                        {t.womenOnlyPool || 'Women-Only Auto Pool (सखी)'}
                      </h5>
                      <p className="text-[10px] text-purple-700">
                        {t.womenOnlySub || 'Filter strictly verified female co-passengers'}
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.womenOnlyPreference}
                      onChange={(e) => setWomenOnly(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-purple-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              )}

              {/* Auto Rickshaw Tiers */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  {t.selectAutoTier || 'Select Auto Rickshaw Tier'}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {VEHICLE_OPTIONS.map((veh) => {
                    const isSelected = state.selectedVehicle.id === veh.id;
                    return (
                      <button
                        key={veh.id}
                        type="button"
                        onClick={() => setSelectedVehicle(veh)}
                        className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-start gap-2 ${
                          isSelected
                            ? 'border-[#FCC016] bg-amber-50/70 shadow-sm ring-1 ring-[#FCC016]'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="text-xl">🛺</div>
                        <div className="min-w-0">
                          <div className="text-[11px] font-bold text-slate-900 leading-tight">
                            ₹{veh.soloPrice.toFixed(0)} <span className="text-[9px] text-emerald-700 font-bold">(Pool ₹{veh.pooledEstimate.toFixed(0)})</span>
                          </div>
                          <div className="text-[10px] text-slate-600 font-semibold truncate mt-0.5">
                            {veh.name}
                          </div>
                          <div className="text-[9px] text-emerald-600 font-medium">
                            {veh.discountTag}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Payment Row (Cash | UPI) */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CASH')}
                  className={`flex-1 p-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    state.paymentMethod === 'CASH'
                      ? 'border-[#1E1E1E] bg-[#1E1E1E] text-white'
                      : 'border-slate-200 text-slate-700 bg-white'
                  }`}
                >
                  <Coins className="w-3.5 h-3.5 text-[#FCC016]" />
                  <span>{t.payCash || '₹ Cash to Auto Kaka'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CAPAY')}
                  className={`flex-1 p-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    state.paymentMethod === 'CAPAY'
                      ? 'border-[#1E1E1E] bg-[#1E1E1E] text-white'
                      : 'border-slate-200 text-slate-700 bg-white'
                  }`}
                >
                  <Gift className="w-3.5 h-3.5 text-[#FCC016]" />
                  <span>{t.payUPI || 'UPI / Online Wallet'}</span>
                </button>
              </div>

              {/* PRIMARY ACTION BUTTONS: FIND STRANGERS (5-MIN RADAR) & DIRECT SHARE AUTO */}
              <div className="space-y-2 pt-2 pb-8">
                <button
                  type="button"
                  onClick={() => setShowStrangerScanner(true)}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-[#FCC016] to-amber-400 hover:from-amber-450 hover:to-amber-350 active:scale-[0.98] text-slate-950 font-black text-sm rounded-2xl shadow-lg border border-amber-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Users className="w-4.5 h-4.5 stroke-[2.5]" />
                  <span>{t.findStrangers || 'Find Strangers for Ride'}</span>
                  <span className="text-[10px] bg-slate-950 text-[#FCC016] px-2 py-0.5 rounded font-bold font-mono">
                    5-Min Radar
                  </span>
                </button>

                <button
                  type="button"
                  onClick={bookRide}
                  className="w-full py-3 bg-[#1E1E1E] hover:bg-black text-white font-bold text-xs rounded-xl shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t.bookShareAuto || 'Direct Share-Auto Pool'}</span>
                  <span className="text-[#FCC016]">
                    (Pool & Save up to 54%)
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* LOGIN / AUTH MODAL */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultRole="CUSTOMER"
      />

      {/* SIDE DRAWER MENU */}
      {showDrawer && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[9999] flex">
          <div className="w-[82%] max-w-xs bg-white h-full p-4 flex flex-col justify-between shadow-2xl relative z-10 animate-in slide-in-from-left duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#FCC016] text-[#1E1E1E] font-black flex items-center justify-center">
                    {state.currentUser.name[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">
                      {state.currentUser.name}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      ⭐ {state.currentUser.rating} · Nashik Passenger
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDrawer(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="space-y-1 text-xs font-semibold text-slate-700">
                <button
                  onClick={() => {
                    setActiveTab('BOOK');
                    setShowDrawer(false);
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-slate-100 flex items-center gap-2.5 text-left cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span>Book Share-Auto</span>
                </button>

                {/* Find Strangers for Ride */}
                <button
                  onClick={() => {
                    setShowDrawer(false);
                    setShowStrangerScanner(true);
                  }}
                  className="w-full p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold flex items-center justify-between text-left cursor-pointer border border-amber-200"
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-amber-600" />
                    <span>{t.findStrangers || 'Find Strangers for Ride'}</span>
                  </div>
                  <span className="text-[9px] bg-[#FCC016] text-slate-950 px-1.5 py-0.5 rounded font-black font-mono">
                    5-MIN
                  </span>
                </button>

                {/* Women-Only Sakhi Mode Quick Toggle */}
                <div className="w-full p-2.5 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="text-xs font-bold text-purple-950">Mahila Sakhi Pool</div>
                      <div className="text-[10px] text-purple-700">Strictly verified women only</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={state.womenOnlyPreference}
                      onChange={(e) => setWomenOnly(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-purple-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {/* Language Switcher in Drawer */}
                <div className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Globe className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-bold">Language (भाषा)</span>
                  </div>
                  <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold">
                    <button
                      onClick={() => setLanguage('en')}
                      className={`px-1.5 py-0.5 rounded cursor-pointer ${
                        state.language === 'en' ? 'bg-[#FCC016] text-slate-950 font-black' : 'text-slate-500'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setLanguage('mr')}
                      className={`px-1.5 py-0.5 rounded cursor-pointer ${
                        state.language === 'mr' ? 'bg-[#FCC016] text-slate-950 font-black' : 'text-slate-500'
                      }`}
                    >
                      मराठी
                    </button>
                    <button
                      onClick={() => setLanguage('hi')}
                      className={`px-1.5 py-0.5 rounded cursor-pointer ${
                        state.language === 'hi' ? 'bg-[#FCC016] text-slate-950 font-black' : 'text-slate-500'
                      }`}
                    >
                      हिंदी
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowHistoryModal(true);
                    setShowDrawer(false);
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-slate-100 flex items-center gap-2.5 text-left cursor-pointer"
                >
                  <History className="w-4 h-4 text-slate-500" />
                  <span>Nashik Ride History ({state.pastRides.length})</span>
                </button>

                <button
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowDrawer(false);
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-slate-100 flex items-center gap-2.5 text-left cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Profile & Trusted Contacts</span>
                </button>

                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setShowDrawer(false);
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-amber-50 text-amber-900 font-bold flex items-center gap-2.5 text-left cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-amber-600" />
                  <span>Login / Switch Commuter</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('PROMOTIONS');
                    setShowDrawer(false);
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-slate-100 flex items-center gap-2.5 text-left cursor-pointer"
                >
                  <Gift className="w-4 h-4 text-slate-500" />
                  <span>Nashik Auto Promotions</span>
                </button>

                <button
                  onClick={() => {
                    setShowOnboardingModal(true);
                    setShowDrawer(false);
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-slate-100 flex items-center gap-2.5 text-left cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  <span>How FAIRWAY Works</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('SAFETY');
                    setShowDrawer(false);
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-slate-100 flex items-center gap-2.5 text-left cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-slate-500" />
                  <span>Safety, Terms & Police SOS</span>
                </button>

                <button
                  onClick={() => {
                    setShowDrawer(false);
                    logoutCustomer();
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-rose-50 text-rose-700 font-bold flex items-center gap-2.5 text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Log Out (बाहेर पडा)</span>
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 block text-center">
                FAIRWAY Nashik · Maharashtra RTO MH-15
              </span>
            </div>
          </div>
          <div className="flex-1" onClick={() => setShowDrawer(false)} />
        </div>
      )}

      {/* RIDE HISTORY MODAL */}
      {showHistoryModal && (
        <RideHistoryModal
          rides={state.pastRides}
          onClose={() => setShowHistoryModal(false)}
        />
      )}

      {/* PROFILE & CONTACTS MODAL */}
      {showProfileModal && (
        <ProfileContactsModal
          currentUser={state.currentUser}
          trustedContacts={state.trustedContacts}
          onSwitchUser={switchUser}
          onAddContact={addTrustedContact}
          onRemoveContact={removeTrustedContact}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {/* ONBOARDING MODAL */}
      {showOnboardingModal && (
        <OnboardingModal onClose={() => setShowOnboardingModal(false)} />
      )}

      {/* MODAL: PROMOTIONS */}
      {activeTab === 'PROMOTIONS' && (
        <div className="absolute inset-0 bg-white z-50 flex flex-col p-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <button
              onClick={() => setActiveTab('BOOK')}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold text-slate-900">Nashik Auto Rewards</h3>
            <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
              🪙 540 pts
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pt-3">
            {PROMOTIONS.map((v) => (
              <div
                key={v.id}
                className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm hover:border-amber-400 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl shrink-0">
                  🛺
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-extrabold text-slate-900">
                    {v.title}
                  </div>
                  <div className="text-[11px] text-amber-600 font-semibold truncate">
                    {v.subtitle}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Code: <span className="font-mono text-slate-700 font-bold">{v.code}</span> · Exp: {v.expiryDate}
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-black">
                  Apply
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: SAFETY & COMPLIANCE */}
      {activeTab === 'SAFETY' && (
        <div className="absolute inset-0 bg-white z-50 flex flex-col p-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <button
              onClick={() => setActiveTab('BOOK')}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold text-slate-900">Nashik Commuter Safety</h3>
            <div className="w-5" />
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pt-2 text-xs text-slate-700">
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-900">
              <h4 className="font-bold text-sm mb-1">Strict 15% Detour Guarantee</h4>
              <p className="text-[11px] leading-relaxed">
                FAIRWAY algorithmically guarantees that your Share-Auto trip will never detour more than 15.0% over direct travel time between CBS, College Road, and Nashik Road.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Emergency SOS (Nashik 112)</h4>
              <p className="text-[11px] text-slate-600">
                In-app SOS transmits live auto telemetry and MH-15 registration to Nashik Police Control & registered contacts.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-semibold text-slate-800">Your Trusted Contacts:</div>
                <ul className="list-disc pl-4 mt-1 text-[11px] text-slate-600 space-y-1">
                  {state.trustedContacts.map((c) => (
                    <li key={c.id}>
                      {c.name} ({c.relationship}) — {c.phone}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SHARE TRIP */}
      {showShareModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center p-3">
          <div className="w-full bg-white rounded-3xl p-4 space-y-3 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-blue-600" />
                Share Auto Ride with Family
              </h4>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Share real-time tracking link with live Auto location, Auto Kaka name, and arrival ETA.
            </p>

            <div className="p-2.5 bg-slate-100 rounded-xl flex items-center justify-between font-mono text-[11px] text-slate-800">
              <span className="truncate">
                https://fairway.in/nashik/{state.activeTrip?.id || 'live'}
              </span>
              <button
                onClick={() => {
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="px-2.5 py-1 bg-slate-900 text-white rounded-md text-xs font-bold hover:bg-black shrink-0 ml-2"
              >
                {copiedLink ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase">
                Send via SMS / WhatsApp:
              </span>
              {state.trustedContacts.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-800">{c.name}</span>
                    <span className="text-slate-400 ml-1.5">({c.relationship})</span>
                  </div>
                  <button
                    onClick={() => {
                      alert(`[SIMULATED SMS] Auto tracking link sent to ${c.phone}`);
                      setShowShareModal(false);
                    }}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800"
                  >
                    Send SMS
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SHAPLEY FORMULA */}
      {showShapleyModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3">
          <div className="w-full bg-white rounded-3xl p-4 space-y-3 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FCC016]" />
                Shapley Value Fair Fare Split
              </h4>
              <button
                onClick={() => setShowShapleyModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-700 space-y-2">
              <p className="leading-relaxed">
                FAIRWAY divides the total Auto Rickshaw operating cost using Lloyd Shapley’s Nobel Prize cooperative game formula:
              </p>

              <div className="p-3 bg-slate-900 text-[#FCC016] rounded-xl font-mono text-[11px] text-center">
                {'φ_i(v) = ∑ [ |S|!(n - |S| - 1)! / n! ] · (c(S ∪ {i}) - c(S))'}
              </div>

              <div className="space-y-1">
                <div className="font-bold text-slate-900">Why It's 100% Fair for Nashik Commuters:</div>
                <ul className="list-disc pl-4 text-[11px] text-slate-600 space-y-1">
                  <li><strong>Budget Balance:</strong> Total passenger payments equal the Auto's exact meter cost without hidden markups.</li>
                  <li><strong>Individual Rationality:</strong> Every pooled rider pays 35%–54% less than a solo auto ride.</li>
                  <li><strong>Symmetry:</strong> Riders travelling shared distances receive equal discount allocations.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STRANGER MATCHING 5-MIN RADAR MODAL */}
      <StrangerMatchingModal
        isOpen={showStrangerScanner}
        onClose={() => setShowStrangerScanner(false)}
        pickupLocation={state.pickupLocation}
        destinationLocation={state.destinationLocation}
        womenOnly={state.womenOnlyPreference}
        language={state.language}
        onConfirmMatch={(strangers, meetingPoint, splitFares) => {
          confirmStrangerMatch(strangers, meetingPoint, splitFares);
          setShowStrangerScanner(false);
        }}
      />
    </div>
  );
};
