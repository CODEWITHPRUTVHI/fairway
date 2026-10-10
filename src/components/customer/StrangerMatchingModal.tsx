import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Radio,
  MapPin,
  Users,
  Shield,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Zap,
  ArrowRight,
  Send,
  Navigation,
  Compass,
} from 'lucide-react';
import { LocationPoint, UserProfile } from '../../types';
import { LiveMap } from '../common/LiveMap';
import { NASHIK_LOCATIONS } from '../../data/mockData';
import { TRANSLATIONS } from '../../services/i18n';
import { realtimeSync } from '../../services/realtimeSync';

interface StrangerMatchingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pickupLocation: LocationPoint;
  destinationLocation: LocationPoint;
  womenOnly: boolean;
  language: 'en' | 'mr' | 'hi';
  onConfirmMatch: (matchedRiders: any[], meetingPoint: LocationPoint, splitFares: any) => void;
}

export const StrangerMatchingModal: React.FC<StrangerMatchingModalProps> = ({
  isOpen,
  onClose,
  pickupLocation,
  destinationLocation,
  womenOnly,
  language,
  onConfirmMatch,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[language || 'en'];

  // Total 5-minute process (300 seconds)
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [isSearching, setIsSearching] = useState(true);
  const [isMatched, setIsMatched] = useState(false);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [paymentReminderSent, setPaymentReminderSent] = useState(false);

  // Derived phase based on 5-minute breakdown:
  // Phase 1 (0 to 120s elapsed -> 300 to 180s left): 1.0 km diameter (500m radius)
  // Phase 2 (120 to 240s elapsed -> 180 to 60s left): +200m -> 1.2 km diameter (600m radius)
  // Phase 3 (240 to 300s elapsed -> 60 to 0s left): +200m -> 1.4 km diameter (700m radius)
  const elapsed = 300 - secondsLeft;
  const currentPhase: 1 | 2 | 3 =
    elapsed < 120 ? 1 : elapsed < 240 ? 2 : 3;

  const currentDiameterKm =
    currentPhase === 1 ? '1.0 km' : currentPhase === 2 ? '1.2 km (+200m)' : '1.4 km (+400m)';

  // Calculate optimal Mid Meeting Point (Centroid of riders snapped to recognized auto stand)
  const midMeetingPoint: LocationPoint = {
    id: `mid-meet-${pickupLocation.id}`,
    name: `${pickupLocation.name.split('(')[0].trim()} Auto Stand (Platform A)`,
    address: `${pickupLocation.address}, Nashik`,
    lat: Number((pickupLocation.lat + 0.0004).toFixed(4)),
    lng: Number((pickupLocation.lng + 0.0003).toFixed(4)),
  };

  // Simulated candidate stranger blips around pickup location
  const candidateStrangers = [
    {
      id: 'st-1',
      name: 'Snehal Patil',
      gender: 'female',
      distance: '180m away',
      destination: 'Dongre Vasti',
      lat: pickupLocation.lat + 0.0012,
      lng: pickupLocation.lng + 0.0014,
      savings: '₹22',
      soloFare: 40,
      pooledFare: 18,
    },
    {
      id: 'st-2',
      name: womenOnly ? 'Neha Kulkarni' : 'Rahul Deshmukh',
      gender: womenOnly ? 'female' : 'male',
      distance: '320m away',
      destination: destinationLocation.name,
      lat: pickupLocation.lat - 0.0015,
      lng: pickupLocation.lng - 0.0011,
      savings: '₹36',
      soloFare: 65,
      pooledFare: 26,
    },
  ];

  // Timer countdown loop
  useEffect(() => {
    if (!isSearching || isMatched) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsSearching(false);
          setHasTimedOut(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSearching, isMatched]);

  // Fast forward or trigger instant match
  const handleTriggerInstantMatch = () => {
    setIsSearching(false);
    setIsMatched(true);

    // Broadcast match found to cross-device sync
    realtimeSync.broadcast({
      type: 'STRANGER_MATCH_FOUND',
      senderRole: 'PASSENGER',
      senderId: 'passenger-active',
      senderName: 'Pooja Sharma',
      payload: {
        strangers: candidateStrangers,
        meetingPoint: midMeetingPoint,
        phase: currentPhase,
      },
    });
  };

  const handleFastForward = (seconds: number) => {
    setSecondsLeft((prev) => Math.max(5, prev - seconds));
  };

  const handleBookWithStrangers = () => {
    const splitFares = {
      user: { soloFare: 60, pooledFare: 24, savings: 36 },
      stranger1: { soloFare: 40, pooledFare: 18, savings: 22 },
      stranger2: { soloFare: 65, pooledFare: 26, savings: 39 },
    };

    onConfirmMatch(candidateStrangers, midMeetingPoint, splitFares);
    onClose();
  };

  const handleSendPaymentReminder = () => {
    setPaymentReminderSent(true);
    realtimeSync.broadcast({
      type: 'PAYMENT_REMINDER_SENT',
      senderRole: 'PASSENGER',
      senderId: 'user-active',
      senderName: 'Pooja Sharma',
      payload: {
        message: 'Friendly reminder: Please keep ₹24 cash or UPI ready for Auto Kaka upon reaching your stop!',
      },
    });
    setTimeout(() => setPaymentReminderSent(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex flex-col items-center justify-end sm:justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[94vh] max-h-[860px] text-slate-100">
        
        {/* Modal Header */}
        <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FCC016] text-[#1E1E1E] flex items-center justify-center font-bold text-base">
              🛺
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black text-white">
                  {t.findStrangers || 'Find Strangers for Ride'}
                </h3>
                {womenOnly && (
                  <span className="text-[10px] bg-purple-900/60 text-purple-300 border border-purple-500/40 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                    <Shield className="w-2.5 h-2.5" />
                    <span>सखी Only</span>
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400">
                5-Min 3-Phase Corridor Radar · Nashik Auto Pool
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Phase Timeline Pill Indicator (3 Phases over 5 Minutes) */}
        <div className="px-3.5 py-2 bg-slate-850 border-b border-slate-800 shrink-0">
          <div className="flex items-center justify-between mb-1.5 text-[11px] font-mono">
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#FCC016]" />
              <span>
                {String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:
                {String(secondsLeft % 60).padStart(2, '0')}
              </span>
              <span className="text-slate-400 font-sans font-normal">(5-min window)</span>
            </span>
            <span className="text-slate-300 font-bold bg-slate-800 px-2 py-0.5 rounded text-[10px]">
              Scan Diameter: <span className="text-[#FCC016]">{currentDiameterKm}</span>
            </span>
          </div>

          {/* 3 Phase Bar */}
          <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-semibold">
            <div
              className={`py-1 rounded-lg border transition-all ${
                currentPhase === 1
                  ? 'bg-amber-500/20 border-[#FCC016] text-[#FCC016] ring-1 ring-[#FCC016]'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400'
              }`}
            >
              <div>Phase 1 (2 min)</div>
              <div className="text-[9px] opacity-80">1.0 km Anchor</div>
            </div>

            <div
              className={`py-1 rounded-lg border transition-all ${
                currentPhase === 2
                  ? 'bg-amber-500/20 border-[#FCC016] text-[#FCC016] ring-1 ring-[#FCC016]'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400'
              }`}
            >
              <div>Phase 2 (2 min)</div>
              <div className="text-[9px] opacity-80">+200m (1.2 km)</div>
            </div>

            <div
              className={`py-1 rounded-lg border transition-all ${
                currentPhase === 3
                  ? 'bg-amber-500/20 border-[#FCC016] text-[#FCC016] ring-1 ring-[#FCC016]'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400'
              }`}
            >
              <div>Phase 3 (1 min)</div>
              <div className="text-[9px] opacity-80">+400m (1.4 km)</div>
            </div>
          </div>
        </div>

        {/* Live Interactive Map Area with Radar Pulse Overlay */}
        <div className="relative h-60 w-full shrink-0 overflow-hidden bg-slate-950">
          <LiveMap
            pickupLocation={pickupLocation}
            destinationLocation={destinationLocation}
            meetingPoint={isMatched ? midMeetingPoint : undefined}
            scanPhase={isMatched ? 0 : currentPhase}
            showVehicle={true}
            showUserLocation={true}
          />

          {/* Sweeping Radar Animation Overlay when searching */}
          {isSearching && !isMatched && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              {/* Radar circular rings */}
              <div className="relative w-48 h-48 rounded-full border border-amber-400/30 flex items-center justify-center animate-pulse">
                <div className="w-36 h-36 rounded-full border border-amber-400/40 animate-ping opacity-30" />
                <div className="w-24 h-24 rounded-full border border-[#FCC016]/50" />
                {/* 360-degree rotating radar beam */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      'conic-gradient(from 0deg at 50% 50%, rgba(252, 192, 22, 0.35) 0deg, transparent 60deg, transparent 360deg)',
                    animation: 'spin 3s linear infinite',
                  }}
                />
              </div>

              {/* Status pill in map */}
              <div className="absolute bottom-2 left-2 right-2 bg-slate-900/95 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-lg flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FCC016] animate-ping" />
                  <span>
                    {currentPhase === 1
                      ? t.scanning1km || 'Scanning 1.0 km diameter for co-passengers...'
                      : currentPhase === 2
                      ? t.expandingScan || 'Expanding scan diameter by +200m...'
                      : t.maxRadiusScan || 'Final 1-minute scan at maximum radius...'}
                  </span>
                </div>
                <button
                  onClick={handleTriggerInstantMatch}
                  className="bg-[#FCC016] hover:bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded cursor-pointer"
                >
                  ⚡ Match Now
                </button>
              </div>
            </div>
          )}

          {/* Matched overlay badge */}
          {isMatched && (
            <div className="absolute top-2 left-2 right-2 bg-emerald-950/90 border border-emerald-500 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-xl backdrop-blur-md shadow-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Compatible Strangers Found! Mid Meeting Point Calculated.</span>
            </div>
          )}
        </div>

        {/* Bottom Details Section (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900">
          {/* STATE A: MATCHED STRANGERS & MID MEETING POINT */}
          {isMatched ? (
            <div className="space-y-3 animate-in fade-in">
              {/* Mid Meeting Point Banner */}
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10 border border-amber-400/50 rounded-2xl p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-[#FCC016]" />
                    <span>{t.midpointMeeting || 'Designated Mid Meeting Point'}</span>
                  </span>
                  <span className="text-[10px] font-mono bg-amber-400/20 text-[#FCC016] px-2 py-0.5 rounded font-bold">
                    180m Walk (2 min)
                  </span>
                </div>
                <h4 className="text-sm font-black text-white">
                  {midMeetingPoint.name}
                </h4>
                <p className="text-[11px] text-slate-300">
                  Calculated optimal centroid for all 3 commuters to gather safely at CBS Stand before auto arrival.
                </p>
              </div>

              {/* Matched Strangers Group List */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Matched Co-Riders (3 Seats Full)</span>
                  <span>Shapley Fair Share</span>
                </div>

                {/* You */}
                <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">
                      1
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <span>You (Pooja Sharma)</span>
                        <span className="text-[9px] bg-slate-700 text-slate-300 px-1 rounded">Rider</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Drop: {destinationLocation.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-[#FCC016]">₹24.00</div>
                    <div className="text-[9px] text-emerald-400 font-bold">-₹36 Saved (60% Off)</div>
                  </div>
                </div>

                {/* Stranger 1 */}
                <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                      2
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <span>{candidateStrangers[0].name}</span>
                        <span className="text-[9px] bg-emerald-900/60 text-emerald-300 px-1 rounded">Matched ✓</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Drop: {candidateStrangers[0].destination} · {candidateStrangers[0].distance}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-[#FCC016]">₹18.00</div>
                    <div className="text-[9px] text-emerald-400 font-bold">Saved {candidateStrangers[0].savings}</div>
                  </div>
                </div>

                {/* Stranger 2 */}
                <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                      3
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <span>{candidateStrangers[1].name}</span>
                        <span className="text-[9px] bg-emerald-900/60 text-emerald-300 px-1 rounded">Matched ✓</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Drop: Corridor Stop C · {candidateStrangers[1].distance}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-[#FCC016]">₹26.00</div>
                    <div className="text-[9px] text-emerald-400 font-bold">Saved {candidateStrangers[1].savings}</div>
                  </div>
                </div>
              </div>

              {/* Payment Reminder Affordance */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleSendPaymentReminder}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {paymentReminderSent
                      ? '✓ Payment Reminder Broadcasted to Group!'
                      : t.paymentReminder || 'Send Fare Payment Reminder to Group'}
                  </span>
                </button>
              </div>

              {/* Confirm & Book Button */}
              <button
                type="button"
                onClick={handleBookWithStrangers}
                className="w-full py-3.5 bg-[#FCC016] hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Confirm & Book Shared Auto (₹24)</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          ) : hasTimedOut ? (
            /* STATE B: 5-MIN TIMEOUT (NO STRANGERS FOUND) */
            <div className="py-6 text-center space-y-3 animate-in fade-in">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-xl font-bold">
                ⏱️
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-white">5-Minute Search Expired</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  No compatible co-passengers found along this corridor within 1.4 km max radius.
                </p>
              </div>
              <div className="space-y-2 max-w-xs mx-auto pt-2">
                <button
                  onClick={() => {
                    setSecondsLeft(300);
                    setIsSearching(true);
                    setHasTimedOut(false);
                  }}
                  className="w-full py-2.5 bg-[#FCC016] text-slate-950 font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry 5-Min Search</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2 text-slate-400 hover:text-white text-xs cursor-pointer font-semibold"
                >
                  Back to Booking
                </button>
              </div>
            </div>
          ) : (
            /* STATE C: ACTIVE SEARCH CONTROLS & RADAR INSIGHTS */
            <div className="space-y-3">
              <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FCC016]" />
                    <span>How Stranger Matching Works</span>
                  </span>
                  <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono">
                    3-Phase Sliding Window
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px] text-slate-300">
                  <p>
                    • <strong>Phase 1 (First 2 min):</strong> Scans 1.0 km anchor diameter around your pickup stand.
                  </p>
                  <p>
                    • <strong>Phase 2 (Next 2 min):</strong> Expands diameter to 1.2 km (+200m) along the shared corridor.
                  </p>
                  <p>
                    • <strong>Phase 3 (Final 1 min):</strong> Maximizes corridor radius to 1.4 km before timing out safely.
                  </p>
                </div>
              </div>

              {/* Fast Forward Test Controls */}
              <div className="p-2.5 bg-slate-850 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-semibold">Demo Simulation:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleFastForward(60)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] rounded-lg cursor-pointer"
                  >
                    +1 Min Forward
                  </button>
                  <button
                    onClick={handleTriggerInstantMatch}
                    className="px-3 py-1 bg-[#FCC016] hover:bg-amber-400 text-slate-950 font-black text-[11px] rounded-lg shadow-xs cursor-pointer"
                  >
                    Instant Match
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
