import React, { useState } from 'react';
import {
  Car,
  Power,
  Navigation,
  CheckCircle,
  KeyRound,
  ShieldCheck,
  DollarSign,
  Clock,
  ArrowRight,
  MapPin,
  AlertCircle,
  TrendingUp,
  FileCheck,
  User,
  HelpCircle,
  ShieldAlert,
  LogIn,
  LogOut,
  Bell,
  Check,
  Volume2,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useFairwayStore } from '../../services/store';
import { MapCanvas } from '../common/MapCanvas';
import { AuthModal } from '../auth/AuthModal';
import { TRANSLATIONS } from '../../services/i18n';

export const DriverApp: React.FC = () => {
  const {
    state,
    setRole,
    setLanguage,
    setDriverOnline,
    driverAcceptRide,
    driverDeclineRide,
    driverArrivedAtMeetup,
    verifyTripPin,
    advanceStopOrCompleteTrip,
    dropPassengerAtStop,
    triggerSOS,
    logoutDriver,
    simulateDriverIncomingRide,
    resetDriverRide,
  } = useFairwayStore();

  const t = TRANSLATIONS[state.language || 'en'];

  const [inputPin, setInputPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'DISPATCH' | 'EARNINGS' | 'PROFILE' | 'SUPPORT'>('DISPATCH');
  const [reportNote, setReportNote] = useState('');
  const [reportedIncident, setReportedIncident] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const trip = state.activeTrip;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = verifyTripPin(inputPin);
    if (!success) {
      setPinError(true);
      setTimeout(() => setPinError(false), 2500);
    } else {
      setInputPin('');
    }
  };

  const handleDriverIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportNote.trim()) return;
    triggerSOS(`Nashik Auto Kaka reported: ${reportNote.trim()}`);
    setReportNote('');
    setReportedIncident(true);
    setTimeout(() => setReportedIncident(false), 3000);
  };

  // Driver net payout calculation in INR (₹)
  const grossFare = trip ? trip.totalCost : 0;
  const platformFee = Number(((grossFare * state.systemConfig.platformCommissionPercent) / 100).toFixed(2));
  const netEarnings = Number((grossFare - platformFee).toFixed(2));

  return (
    <div className="flex-1 flex flex-col bg-[#F8F9FA] relative">
      {/* Driver Top Header */}
      <div className="h-14 px-3 sm:px-4 bg-slate-900 text-white flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FCC016] text-[#1E1E1E] font-black flex items-center justify-center text-sm shadow">
            🛺
          </div>
          <div>
            <h3 className="text-xs font-bold leading-tight flex items-center gap-1.5">
              <span>{state.driverUser.name}</span>
            </h3>
            <p className="text-[10px] text-amber-300 font-mono">
              {state.driverUser.plateNumber} · {state.driverUser.vehicleModel.split('(')[0]}
            </p>
          </div>
        </div>

        {/* Language Switcher & Online Switch & Logout */}
        <div className="flex items-center gap-1.5">
          {/* Quick Language Toggle */}
          <div className="flex items-center bg-slate-800 p-0.5 rounded-lg text-[10px] font-bold border border-slate-700">
            <button
              onClick={() => setLanguage('en')}
              className={`px-1.5 py-0.5 rounded ${state.language === 'en' ? 'bg-[#FCC016] text-slate-950 font-black' : 'text-slate-400'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('mr')}
              className={`px-1.5 py-0.5 rounded ${state.language === 'mr' ? 'bg-[#FCC016] text-slate-950 font-black' : 'text-slate-400'}`}
            >
              मराठी
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-1.5 py-0.5 rounded ${state.language === 'hi' ? 'bg-[#FCC016] text-slate-950 font-black' : 'text-slate-400'}`}
            >
              हिंदी
            </button>
          </div>

          <button
            onClick={logoutDriver}
            title="Log Out / Switch Auto Driver"
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 flex items-center justify-center"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setDriverOnline(!state.driverOnline)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-colors ${
              state.driverOnline
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-700 text-slate-300'
            }`}
          >
            <Power className="w-3 h-3" />
            <span>{state.driverOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </button>
        </div>
      </div>

      {/* Driver Navigation Bar */}
      <div className="bg-slate-950 px-3 py-1 flex items-center justify-between text-xs font-semibold text-slate-300 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('DISPATCH')}
          className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${activeTab === 'DISPATCH' ? 'bg-[#FCC016] text-[#1E1E1E] font-bold shadow-xs' : 'hover:text-white'}`}
        >
          Navigation
        </button>
        <button
          onClick={() => setActiveTab('EARNINGS')}
          className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${activeTab === 'EARNINGS' ? 'bg-[#FCC016] text-[#1E1E1E] font-bold shadow-xs' : 'hover:text-white'}`}
        >
          Auto Ledger (₹)
        </button>
        <button
          onClick={() => setActiveTab('PROFILE')}
          className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${activeTab === 'PROFILE' ? 'bg-[#FCC016] text-[#1E1E1E] font-bold shadow-xs' : 'hover:text-white'}`}
        >
          Auto RTO MH-15
        </button>
        <button
          onClick={() => setActiveTab('SUPPORT')}
          className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${activeTab === 'SUPPORT' ? 'bg-[#FCC016] text-[#1E1E1E] font-bold shadow-xs' : 'hover:text-white'}`}
        >
          Help & Police SOS
        </button>
      </div>

      {activeTab === 'PROFILE' && (
        /* Driver Vehicle & Documents View */
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-base">🛺</span>
              Nashik RTO Registered Auto Rickshaw
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-semibold">Vehicle Type</span>
                <span className="font-bold text-slate-800">{state.driverUser.vehicleModel}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-semibold">RTO Plate Number</span>
                <span className="font-mono font-bold text-slate-800">{state.driverUser.plateNumber}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-semibold">Capacity</span>
                <span className="font-bold text-slate-800">{state.driverUser.capacity} Passengers</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-semibold">City Region</span>
                <span className="font-bold text-slate-800">Nashik Central (CBS / College Rd)</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2.5 text-xs">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              Verified Auto Permits (MH-15 RTO)
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900">
                <span>Auto Rickshaw Commercial Badge</span>
                <span className="font-bold">VERIFIED ✓</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900">
                <span>RTO Fitness & Meter Calibration</span>
                <span className="font-bold">VALID 2027</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900">
                <span>Third Party Auto Insurance</span>
                <span className="font-bold">ACTIVE ✓</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'SUPPORT' && (
        /* Driver Safety & Support View */
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 space-y-3">
            <h4 className="text-sm font-bold text-rose-950 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Report Road Hazard / Issue
            </h4>
            <p className="text-xs text-rose-800">
              Direct telemetry alert to Nashik Traffic Control Room & FAIRWAY Dispatch desk.
            </p>
            <form onSubmit={handleDriverIncident} className="space-y-2">
              <textarea
                value={reportNote}
                onChange={(e) => setReportNote(e.target.value)}
                placeholder="Describe issue (e.g. waterlogging on Gangapur Road, traffic jam at Dwarka)..."
                className="w-full p-2.5 bg-white border border-rose-300 rounded-xl text-xs outline-none focus:ring-1 focus:ring-rose-500"
                rows={3}
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700"
              >
                Send Urgent Alert
              </button>
            </form>
            {reportedIncident && (
              <span className="text-xs font-bold text-rose-700 block text-center">
                ✓ Road alert reported to dispatch desk.
              </span>
            )}
          </div>
        </div>
      )}

      {activeTab === 'EARNINGS' && (
        /* Driver Earnings & Transparent Ledger Screen (INR ₹) */
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              Today's Net Auto Driver Payout
            </span>
            <div className="text-3xl font-black text-[#FCC016]">
              ₹
              {state.ledgerEntries
                .reduce((sum, e) => sum + e.driverNetPayout, 0)
                .toFixed(2)}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>{state.systemConfig.platformCommissionPercent}% Transparent Platform Commission Applied</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Settled Trips Ledger
            </h4>
            {state.ledgerEntries.map((e) => (
              <div
                key={e.id}
                className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-2 text-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-slate-900">
                      Pooled Auto Trip ({e.passengersCount} Riders)
                    </span>
                    <div className="text-[10px] text-slate-400">
                      {new Date(e.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  <span className="text-sm font-extrabold text-emerald-600">
                    +₹{e.driverNetPayout.toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1 pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                  <div>Gross Pooled Meter: ₹{e.grossPooledFare.toFixed(2)}</div>
                  <div className="text-right">
                    FAIRWAY Fee ({e.platformCommissionPercent}%): -₹{e.platformCommissionAmount.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'DISPATCH' && (
        /* Dispatch & Turn-by-Turn View */
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* Map navigation viewport */}
          <div className="h-[44%] w-full relative">
            <MapCanvas
              pickupLocation={state.pickupLocation}
              destinationLocation={state.destinationLocation}
              meetingPoint={trip?.meetingPoint}
              driverLocation={trip ? trip.driverLocation : state.driverLocation}
              showVehicle={true}
            />

            {/* Turn Banner */}
            <div className="absolute top-3 inset-x-3 bg-slate-900/95 text-white p-2.5 rounded-xl shadow-lg flex items-center gap-3 z-20">
              <div className="w-8 h-8 rounded-lg bg-[#FCC016] text-[#1E1E1E] flex items-center justify-center font-black">
                <Navigation className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold truncate">
                  {trip
                    ? trip.state === 'DRIVER_ASSIGNED' || trip.state === 'EN_ROUTE_TO_MEETUP' || trip.state === 'DRIVER_PENDING'
                      ? 'Proceed to Auto Stand: ' + trip.meetingPoint.name
                      : trip.state === 'AT_MEETUP'
                      ? 'Wait for Passengers at Auto Stand'
                      : `Dropoff Stop: ${trip.stops[trip.currentStopIndex]?.location.name || 'En Route'}`
                    : 'Patrolling CBS / College Road Corridors'}
                </div>
                <div className="text-[10px] text-amber-300">
                  {trip ? 'Detour-optimized pooled sequence (≤ 15% Detour)' : 'Ready for auto assignments'}
                </div>
              </div>
            </div>
          </div>

          {/* Driver Actions & Stops Drawer */}
          <div className="flex-1 bg-white rounded-t-3xl shadow-2xl border-t border-slate-100 p-4 overflow-y-auto flex flex-col justify-between">
            {trip ? (
              <div className="space-y-3">
                {/* Driver Financial Summary in INR (₹) */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-emerald-800 font-bold">
                      {t.totalPooledFare || 'Total Pooled Fare'} ({Object.keys(trip.allocations).length} Riders)
                    </span>
                    <div className="text-lg font-black text-emerald-950">
                      ₹{netEarnings.toFixed(2)}{' '}
                      <span className="text-xs font-normal text-emerald-700">(Gross: ₹{grossFare.toFixed(2)})</span>
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-emerald-700">
                    <div className="font-mono font-bold text-slate-800">Group: {trip.groupId}</div>
                    <div>Platform Fee ({state.systemConfig.platformCommissionPercent}%): ₹{platformFee.toFixed(2)}</div>
                  </div>
                </div>

                {/* WORKFLOW PHASE 1: EN ROUTE TO MEETUP */}
                {(trip.state === 'DRIVER_ASSIGNED' || trip.state === 'EN_ROUTE_TO_MEETUP' || trip.state === 'DRIVER_PENDING') && (
                  <div className="space-y-2">
                    <div className="text-xs text-slate-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                      <strong>Navigation Directive:</strong> Drive Auto to designated stand at{' '}
                      <span className="font-bold text-amber-950">{trip.meetingPoint.name}</span>.
                    </div>
                    <button
                      onClick={driverArrivedAtMeetup}
                      className="w-full py-3.5 bg-[#FCC016] hover:bg-amber-400 text-[#1E1E1E] font-extrabold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>{t.arrivedAtStand || 'Arrived at Auto Stand'}</span>
                    </button>
                  </div>
                )}

                {/* WORKFLOW PHASE 2: AT MEETUP -> MUST ENTER 4-DIGIT PIN / GROUP ID OTP */}
                {trip.state === 'AT_MEETUP' && (
                  <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-3.5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <KeyRound className="w-5 h-5 text-amber-700" />
                        <div>
                          <h4 className="text-xs font-black text-slate-900">
                            {t.verifyPin || 'Verify Passenger Boarding PIN / OTP'}
                          </h4>
                          <p className="text-[10px] text-slate-600">
                            Ask passenger for Group OTP ({trip.groupId}) to start meter
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setInputPin(trip.pinCode)}
                        className="px-2 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-[10px] rounded-lg cursor-pointer transition-colors"
                      >
                        Auto-Fill ({trip.pinCode})
                      </button>
                    </div>

                    <form onSubmit={handlePinSubmit} className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={4}
                          value={inputPin}
                          onChange={(e) => setInputPin(e.target.value.replace(/\D/g, ''))}
                          placeholder="e.g. 4-digit PIN"
                          className="flex-1 px-3 py-2 text-center text-lg font-mono font-bold tracking-widest bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FCC016]"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-slate-900 hover:bg-black text-[#FCC016] font-bold text-xs rounded-xl cursor-pointer transition-colors"
                        >
                          Verify & Start Trip
                        </button>
                      </div>
                      {pinError && (
                        <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Incorrect PIN! Passenger's code is displayed on Passenger screen.
                        </p>
                      )}
                      <p className="text-[9px] text-slate-500 italic">
                        Ola/Uber style boarding check: Group OTP is ({trip.pinCode})
                      </p>
                    </form>
                  </div>
                )}

                {/* WORKFLOW PHASE 3: TRIP IN PROGRESS -> SEQUENTIAL 1-BY-1 DROPOFFS */}
                {trip.state === 'IN_PROGRESS' && (
                  <div className="space-y-2.5">
                    <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        {t.dropSequence || 'Sequential Dropoff Stops (1 by 1):'}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                        Meter Running
                      </span>
                    </div>

                    <div className="space-y-2">
                      {trip.stops.map((stop, i) => {
                        const isCurrent = i === trip.currentStopIndex && !stop.completed;
                        const stopAlloc = Object.values(trip.allocations).find(
                          (a) => a.passengerName === stop.passengerName
                        );
                        const stopFare = stopAlloc ? stopAlloc.pooledFare : (i === 0 ? 18 : 24);

                        return (
                          <div
                            key={stop.id}
                            className={`p-2.5 rounded-xl text-xs border transition-all ${
                              stop.completed
                                ? 'bg-slate-50 border-slate-200 text-slate-400'
                                : isCurrent
                                ? 'bg-amber-50/90 border-[#FCC016] text-slate-900 shadow-sm ring-1 ring-amber-400'
                                : 'bg-white border-slate-200 text-slate-600'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                  stop.completed ? 'bg-slate-300 text-slate-600' : isCurrent ? 'bg-[#1E1E1E] text-[#FCC016]' : 'bg-slate-200 text-slate-700'
                                }`}>
                                  {i + 1}
                                </span>
                                <div>
                                  <div className="font-bold flex items-center gap-1">
                                    <span>Drop #{i + 1}: {stop.passengerName}</span>
                                    <span className="text-[10px] text-emerald-700 font-extrabold">(Collect ₹{stopFare.toFixed(0)})</span>
                                  </div>
                                  <div className="text-[10px] text-slate-500">
                                    Location: {stop.location.name}
                                  </div>
                                </div>
                              </div>

                              <div>
                                {stop.completed ? (
                                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Dropped
                                  </span>
                                ) : isCurrent ? (
                                  <button
                                    onClick={() => dropPassengerAtStop(i)}
                                    className="px-3 py-1.5 bg-[#FCC016] hover:bg-amber-400 text-slate-950 font-black text-[10px] rounded-lg shadow-sm cursor-pointer transition-transform active:scale-95"
                                  >
                                    Drop & Collect ₹{stopFare.toFixed(0)}
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-slate-400">Next stop</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={advanceStopOrCompleteTrip}
                      className="w-full py-3 bg-slate-900 hover:bg-black text-[#FCC016] font-extrabold text-xs rounded-xl shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>
                        {trip.currentStopIndex < trip.stops.length - 1
                          ? `Drop Current Rider (${trip.stops[trip.currentStopIndex]?.passengerName}) & Next Stop →`
                          : 'Complete All Stops & Collect Full ₹' + grossFare.toFixed(0)}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* WORKFLOW PHASE 4: COMPLETED */}
                {trip.state === 'COMPLETED' && (
                  <div className="text-center py-4 space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200 p-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl font-bold">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">
                        Auto Trip Successfully Completed!
                      </h4>
                      <p className="text-xs text-slate-600 font-semibold mt-0.5">
                        Full gross pooled fare ₹{grossFare.toFixed(2)} collected. Net payout ₹{netEarnings.toFixed(2)} credited to your Auto Ledger.
                      </p>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-emerald-200 text-xs text-left space-y-1">
                      <div className="flex justify-between text-slate-600">
                        <span>Total Passengers Dropped:</span>
                        <span className="font-bold text-slate-900">3 Riders (1 by 1)</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Detour Compliance:</span>
                        <span className="font-bold text-emerald-700">4.8% (≤ 15% Bound)</span>
                      </div>
                      <div className="flex justify-between text-slate-600 border-t border-slate-100 pt-1">
                        <span>Net Take-Home Earnings:</span>
                        <span className="font-black text-emerald-700">₹{netEarnings.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={resetDriverRide}
                      className="w-full py-3 bg-[#FCC016] hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Ready for Next Auto Ride 🛺</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* ACTIVE DRIVER DISPATCH CENTER (Fully functional dashboard) */
              <div className="space-y-3.5 py-1">
                {/* Online Radar Status */}
                <div className="bg-slate-900 text-white rounded-2xl p-3.5 shadow-md border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative w-3 h-3 flex items-center justify-center">
                        <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping absolute" />
                        <span className="w-2 h-2 rounded-full bg-emerald-400 relative" />
                      </div>
                      <span className="text-xs font-bold text-emerald-400">
                        METER RADAR ONLINE · ACTIVE
                      </span>
                    </div>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded font-mono text-amber-300">
                      Stand: CBS Chowk
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    Scanning Nashik CBS, College Road, and Gangapur Road corridors for commuter pool groups...
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-800">
                    <div className="bg-slate-800/80 p-2 rounded-xl">
                      <span className="text-[9px] text-slate-400 block font-bold">Auto Number</span>
                      <span className="font-mono font-bold text-[#FCC016]">{state.driverUser.plateNumber}</span>
                    </div>
                    <div className="bg-slate-800/80 p-2 rounded-xl">
                      <span className="text-[9px] text-slate-400 block font-bold">Today's Earnings</span>
                      <span className="font-bold text-emerald-400">
                        ₹{state.ledgerEntries.reduce((s, e) => s + e.driverNetPayout, 0).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Ride Request Simulation Options */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-amber-500" />
                      <span>Available Auto Pool Requests (Instant Demo)</span>
                    </h4>
                  </div>

                  {/* Option 1: Standard Corridors 3-Rider Pool */}
                  <div className="bg-amber-50/70 border border-amber-300/80 rounded-2xl p-3 space-y-2.5 shadow-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-xs text-slate-900">
                            CBS ➔ Dongre Vasti ➔ College Rd ➔ Gangapur Rd
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-600 mt-0.5">
                          3 Commuters pooled · Pickup at CBS Auto Stand
                        </p>
                      </div>
                      <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">
                        Earn ₹61.20
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1 text-[9px] text-center text-slate-700">
                      <div className="bg-white p-1 rounded-lg border border-amber-200">
                        <span className="text-slate-400 block">Drop 1</span>
                        <span className="font-bold text-slate-900">Dongre (₹18)</span>
                      </div>
                      <div className="bg-white p-1 rounded-lg border border-amber-200">
                        <span className="text-slate-400 block">Drop 2</span>
                        <span className="font-bold text-slate-900">College Rd (₹24)</span>
                      </div>
                      <div className="bg-white p-1 rounded-lg border border-amber-200">
                        <span className="text-slate-400 block">Drop 3</span>
                        <span className="font-bold text-slate-900">Gangapur (₹26)</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => simulateDriverIncomingRide('cbs_college')}
                      className="w-full py-2.5 bg-[#FCC016] hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Trigger Incoming Ride Pop-Up (Test Ola/Uber Flow)</span>
                    </button>
                  </div>

                  {/* Option 2: Peak Hour Request */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">
                        Peak Hour Nashik Road Station Pool
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Station ➔ Dwarka ➔ CBS · High demand corridor
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => simulateDriverIncomingRide('rush_hour')}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-black text-[#FCC016] font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
                    >
                      Test Request
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CRITICAL DRIVER INCOMING RIDE POP-UP MODAL (Like Ola & Uber Driver App) */}
      {state.showDriverRidePopup && state.pendingDriverRide && (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border-2 border-[#FCC016] rounded-3xl p-4 shadow-2xl text-white space-y-3.5 relative overflow-hidden">
            {/* Pulsing ring animation */}
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-amber-400/20 text-[#FCC016] px-2 py-0.5 rounded-full text-[10px] font-mono animate-pulse">
              <span className="w-2 h-2 rounded-full bg-[#FCC016] animate-ping" />
              <span>INCOMING RIDE</span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <div className="w-12 h-12 rounded-2xl bg-[#FCC016] text-[#1E1E1E] flex items-center justify-center font-black text-2xl shadow-lg shrink-0">
                🛺
              </div>
              <div>
                <h3 className="text-sm font-black text-white">
                  {t.newRideRequest || 'New Shared Auto Request!'}
                </h3>
                <p className="text-[10px] text-amber-300 font-mono">
                  Group ID: {state.pendingDriverRide.groupId} · Ride OTP: {state.pendingDriverRide.groupOtp}
                </p>
              </div>
            </div>

            {/* Ride Details Card */}
            <div className="bg-slate-800/90 rounded-2xl p-3 border border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-700">
                <span className="text-slate-400">Pickup Stand:</span>
                <span className="font-bold text-[#FCC016] text-right">
                  {state.pendingDriverRide.meetingPoint.name}
                </span>
              </div>

              <div className="flex justify-between items-center pb-1.5 border-b border-slate-700">
                <span className="text-slate-400">Riders in Auto Group:</span>
                <span className="font-bold text-white">
                  3 Passengers (Full Capacity)
                </span>
              </div>

              <div className="flex justify-between items-baseline pt-1">
                <div>
                  <span className="text-[10px] text-slate-400 block">Total Pooled Fare</span>
                  <span className="text-xl font-black text-[#FCC016]">
                    ₹{state.pendingDriverRide.totalPooledCost.toFixed(2)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-400 block">Your Net Earnings (90%)</span>
                  <span className="text-lg font-black text-emerald-400">
                    ₹{(state.pendingDriverRide.totalPooledCost * 0.9).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: Accept or Decline */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={driverDeclineRide}
                className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 cursor-pointer transition-colors active:scale-95"
              >
                {t.declineRide || 'Decline'}
              </button>
              <button
                type="button"
                onClick={driverAcceptRide}
                className="py-3 bg-[#FCC016] hover:bg-amber-400 text-[#1E1E1E] font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 cursor-pointer transition-transform active:scale-95"
              >
                <span>{t.acceptRide || 'Accept Ride 🛺'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRIVER AUTH MODAL */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultRole="DRIVER"
      />
    </div>
  );
};
