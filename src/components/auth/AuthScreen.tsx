import React, { useState } from 'react';
import {
  User,
  Shield,
  ArrowRight,
  CheckCircle,
  Lock,
  Phone,
  Mail,
  UserCheck,
  FileCheck,
  AlertCircle,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { useFairwayStore } from '../../services/store';
import { SEEDED_DRIVERS, SEEDED_PASSENGERS } from '../../data/mockData';

interface AuthScreenProps {
  initialRole?: 'CUSTOMER' | 'DRIVER' | 'ADMIN';
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialRole = 'CUSTOMER',
}) => {
  const { loginCustomer, loginDriver, loginAdmin, setRole, quickDemoLoginBoth } = useFairwayStore();
  const [authRole, setAuthRole] = useState<'CUSTOMER' | 'DRIVER' | 'ADMIN'>(initialRole);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  // Customer Form State
  const [custName, setCustName] = useState('Pooja Sharma');
  const [custPhone, setCustPhone] = useState('+91 98221 44556');
  const [custEmail, setCustEmail] = useState('pooja.sharma@nashik.in');
  const [custGender, setCustGender] = useState<'female' | 'male' | 'other'>('female');
  const [custPin, setCustPin] = useState('1234');
  const [custEmergency, setCustEmergency] = useState('+91 98229 11223');

  // Driver Form State
  const [driverName, setDriverName] = useState('Ramesh Shinde (Kaka)');
  const [driverPhone, setDriverPhone] = useState('+91 98220 12345');
  const [driverPlate, setDriverPlate] = useState('MH-15 EF 4321');
  const [driverModel, setDriverModel] = useState('Bajaj Compact RE (MH-15 Auto)');
  const [driverBadge, setDriverBadge] = useState('MH15-COM-2024-890');
  const [driverPin, setDriverPin] = useState('4321');
  const [driverStand, setDriverStand] = useState('CBS (Central Bus Stand)');

  // Admin / Dispatcher Form State
  const [adminPin, setAdminPin] = useState('9999');

  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Handle Passenger Submit
  const handlePassengerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim() || !custPhone.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Please fill all required passenger details' });
      return;
    }

    loginCustomer(custName.trim(), custPhone.trim(), custGender);
    setFeedbackMsg({
      type: 'success',
      text: authMode === 'LOGIN' ? `Welcome back, ${custName}!` : `Account created for ${custName}! Entering Fairway...`,
    });
    setTimeout(() => {
      setRole('CUSTOMER');
    }, 700);
  };

  // Handle Driver Submit
  const handleDriverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverName.trim() || !driverPlate.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Please provide driver name and MH-15 auto number' });
      return;
    }

    loginDriver(driverName.trim(), driverPlate.trim().toUpperCase(), driverModel);
    setFeedbackMsg({
      type: 'success',
      text: authMode === 'LOGIN' ? `Namaste Kaka! Logged in as ${driverName}` : `Auto Rickshaw ${driverPlate} Registered! Going Online...`,
    });
    setTimeout(() => {
      setRole('DRIVER');
    }, 700);
  };

  // Handle Admin / Dispatcher Submit
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = loginAdmin(adminPin);
    if (!ok) {
      setFeedbackMsg({ type: 'error', text: 'Invalid Dispatcher Passcode! Use 9999 for demo access.' });
      return;
    }
    setFeedbackMsg({ type: 'success', text: 'Authorized as Nashik Traffic Dispatcher! Launching Operations Console...' });
    setTimeout(() => {
      setRole('ADMIN');
    }, 700);
  };

  // Quick 1-tap fill for testing
  const selectDemoPassenger = (p: typeof SEEDED_PASSENGERS[0]) => {
    setCustName(p.name);
    setCustPhone(p.phone);
    setCustGender(p.gender as any);
    setCustEmail(`${p.name.toLowerCase().replace(/\s+/g, '.')}@nashik.in`);
    setCustPin('1234');
    setFeedbackMsg({ type: 'success', text: `Loaded demo commuter profile: ${p.name}` });
    setTimeout(() => setFeedbackMsg(null), 2000);
  };

  const selectDemoDriver = (d: typeof SEEDED_DRIVERS[0]) => {
    setDriverName(d.name);
    setDriverPhone(d.phone);
    setDriverPlate(d.plateNumber);
    setDriverModel(d.vehicleModel);
    setDriverBadge(`MH15-${d.plateNumber.replace(/\s+/g, '')}`);
    setDriverPin('4321');
    setFeedbackMsg({ type: 'success', text: `Loaded demo auto driver profile: ${d.name}` });
    setTimeout(() => setFeedbackMsg(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 overflow-y-auto">
      {/* Brand Hero Header */}
      <div className="bg-gradient-to-b from-[#1E1E1E] to-slate-900 px-6 pt-7 pb-5 border-b border-slate-800 text-center relative">
        <div className="w-16 h-16 rounded-2xl bg-[#FCC016] text-[#1E1E1E] flex items-center justify-center font-black text-3xl mx-auto shadow-xl shadow-amber-400/10 mb-3 border border-amber-300">
          🛺
        </div>
        <h1 className="text-xl font-black text-white tracking-tight">
          FAIRWAY NASHIK
        </h1>
        <p className="text-xs text-[#FCC016] font-semibold mt-0.5">
          नाशिक रिक्षा सामायिकरण (Auto Rickshaw Pooling)
        </p>
        <p className="text-[11px] text-slate-400 max-w-xs mx-auto mt-1">
          Smart shared auto rides across Nashik District with strict 15% detour limits & fair Shapley cost splitting.
        </p>

        {/* Primary Role Selector Tabs */}
        <div className="grid grid-cols-3 p-1 bg-slate-800/90 rounded-2xl gap-1 mt-4 max-w-sm mx-auto border border-slate-700/80">
          <button
            type="button"
            onClick={() => {
              setAuthRole('CUSTOMER');
              setFeedbackMsg(null);
            }}
            className={`py-2 px-1 text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition-all ${
              authRole === 'CUSTOMER'
                ? 'bg-[#FCC016] text-[#1E1E1E] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3 h-3 shrink-0" />
            <span className="truncate">Passenger</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthRole('DRIVER');
              setFeedbackMsg(null);
            }}
            className={`py-2 px-1 text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition-all ${
              authRole === 'DRIVER'
                ? 'bg-[#FCC016] text-[#1E1E1E] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="text-[11px] shrink-0">🛺</span>
            <span className="truncate">Driver</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthRole('ADMIN');
              setFeedbackMsg(null);
            }}
            className={`py-2 px-1 text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition-all ${
              authRole === 'ADMIN'
                ? 'bg-[#FCC016] text-[#1E1E1E] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3 h-3 shrink-0" />
            <span className="truncate">Dispatcher</span>
          </button>
        </div>
      </div>

      {/* Main Authentication Container */}
      <div className="flex-1 p-4 sm:p-6 max-w-md w-full mx-auto flex flex-col justify-between">
        <div className="bg-white text-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200/80 space-y-4">
          {/* Sub-Tabs: Sign In vs Sign Up */}
          <div className="flex items-center justify-around border-b border-slate-200 pb-2.5">
            <button
              type="button"
              onClick={() => {
                setAuthMode('LOGIN');
                setFeedbackMsg(null);
              }}
              className={`text-xs font-bold pb-1 relative transition-colors flex items-center gap-1.5 ${
                authMode === 'LOGIN'
                  ? 'text-slate-900 border-b-2 border-[#FCC016]'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In (लॉगिन)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('SIGNUP');
                setFeedbackMsg(null);
              }}
              className={`text-xs font-bold pb-1 relative transition-colors flex items-center gap-1.5 ${
                authMode === 'SIGNUP'
                  ? 'text-slate-900 border-b-2 border-[#FCC016]'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account (नवीन नोंदणी)</span>
            </button>
          </div>

          {/* Feedback Banner */}
          {feedbackMsg && (
            <div
              className={`p-2.5 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 animate-in fade-in ${
                feedbackMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {feedbackMsg.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          {/* QUICK 1-TAP DEMO ACCESS CARD */}
          <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-2.5 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-amber-950 uppercase tracking-wide flex items-center gap-1">
                <span>⚡</span> 1-TAP DEMO INSTANT ACCESS
              </span>
              <button
                type="button"
                onClick={quickDemoLoginBoth}
                className="text-[9px] font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 px-2 py-0.5 rounded cursor-pointer transition-colors"
              >
                Sign In Both (Dual Mode)
              </button>
            </div>

            {authRole === 'CUSTOMER' && (
              <button
                type="button"
                onClick={() => {
                  loginCustomer('Pooja Sharma', '+91 98221 44556', 'female');
                  setRole('CUSTOMER');
                }}
                className="w-full py-2 bg-[#FCC016] hover:bg-amber-400 text-[#1E1E1E] font-black text-xs rounded-xl shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>⚡ Instant Enter: Pooja Sharma (Passenger)</span>
              </button>
            )}

            {authRole === 'DRIVER' && (
              <button
                type="button"
                onClick={() => {
                  loginDriver('Ramesh Shinde (Kaka)', 'MH-15 EF 4321', 'Bajaj Compact RE (MH-15 Auto)');
                  setRole('DRIVER');
                }}
                className="w-full py-2 bg-[#FCC016] hover:bg-amber-400 text-[#1E1E1E] font-black text-xs rounded-xl shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>⚡ Instant Enter: Ramesh Kaka (Auto Driver)</span>
              </button>
            )}

            {authRole === 'ADMIN' && (
              <button
                type="button"
                onClick={() => {
                  loginAdmin('9999');
                  setRole('ADMIN');
                }}
                className="w-full py-2 bg-[#FCC016] hover:bg-amber-400 text-[#1E1E1E] font-black text-xs rounded-xl shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>⚡ Instant Enter: Nashik Operations Desk</span>
              </button>
            )}
          </div>

          {/* PASSENGER AUTHENTICATION FORM */}
          {authRole === 'CUSTOMER' ? (
            <form onSubmit={handlePassengerSubmit} className="space-y-3.5">
              <div className="space-y-2.5 text-xs">
                {authMode === 'SIGNUP' && (
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Full Name (संपूर्ण नाव)
                    </label>
                    <input
                      type="text"
                      required
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      placeholder="e.g. Pooja Sharma"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-[#FCC016]"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1 flex items-center justify-between">
                    <span>Mobile Number (मोबाईल नंबर)</span>
                    <span className="text-[10px] text-slate-400">Nashik +91</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={custPhone}
                      onChange={(e) => setCustPhone(e.target.value)}
                      placeholder="+91 98221 44556"
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-[#FCC016]"
                    />
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  </div>
                </div>

                {authMode === 'SIGNUP' && (
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={custEmail}
                        onChange={(e) => setCustEmail(e.target.value)}
                        placeholder="pooja.sharma@gmail.com"
                        className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 outline-none focus:ring-2 focus:ring-[#FCC016]"
                      />
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                    </div>
                  </div>
                )}

                {/* Gender (Critical for Mahila Sakhi Auto Pooling) */}
                {authMode === 'SIGNUP' && (
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1 flex items-center justify-between">
                      <span>Gender (लिंग)</span>
                      <span className="text-[10px] text-purple-700 font-semibold">
                        Used for Women-Only Auto Groups
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setCustGender('female')}
                        className={`py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          custGender === 'female'
                            ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-sm ring-1 ring-purple-600'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Shield className="w-3.5 h-3.5 text-purple-600" />
                        <span>Female (महिला सखी)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCustGender('male')}
                        className={`py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          custGender === 'male'
                            ? 'border-slate-900 bg-slate-100 text-slate-950 shadow-sm ring-1 ring-slate-900'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <User className="w-3.5 h-3.5 text-slate-700" />
                        <span>Male (पुरुष / General)</span>
                      </button>
                    </div>
                  </div>
                )}

                {authMode === 'SIGNUP' && (
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Emergency Trusted Contact (आपत्कालीन संपर्क)
                    </label>
                    <input
                      type="tel"
                      value={custEmergency}
                      onChange={(e) => setCustEmergency(e.target.value)}
                      placeholder="+91 98229 11223 (Family / Police)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 outline-none focus:ring-2 focus:ring-[#FCC016]"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    {authMode === 'LOGIN' ? 'Security PIN / Password (पासवर्ड)' : 'Create 4-Digit Passcode'}
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={custPin}
                      onChange={(e) => setCustPin(e.target.value)}
                      placeholder="Enter 4-digit PIN"
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-[#FCC016]"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  </div>
                </div>
              </div>

              {/* Quick 1-Tap Nashik Commuters */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider block">
                  Quick Demo Commuter 1-Tap Fill:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {SEEDED_PASSENGERS.slice(0, 4).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => selectDemoPassenger(p)}
                      className="px-2.5 py-1.5 bg-slate-50 hover:bg-amber-50 text-slate-800 rounded-xl text-left border border-slate-200 transition-colors flex items-center justify-between"
                    >
                      <div className="truncate">
                        <div className="text-[11px] font-bold truncate">{p.name}</div>
                        <div className="text-[9px] text-slate-500">
                          {p.gender === 'female' ? '♀ Sakhi Pool' : '♂ General'}
                        </div>
                      </div>
                      <span className="text-[10px] text-amber-700 font-bold ml-1">Use</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#1E1E1E] hover:bg-black text-[#FCC016] font-black text-xs rounded-xl shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                <span>
                  {authMode === 'LOGIN' ? 'Sign In as Passenger & Book Auto' : 'Register Passenger & Continue'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : authRole === 'DRIVER' ? (
            /* AUTO RICKSHAW DRIVER AUTHENTICATION FORM */
            <form onSubmit={handleDriverSubmit} className="space-y-3.5">
              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Auto Driver Full Name (चालकाचे नाव)
                  </label>
                  <input
                    type="text"
                    required
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="e.g. Ramesh Shinde (Kaka)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-[#FCC016]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Mobile Number (मोबाईल नंबर)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={driverPhone}
                      onChange={(e) => setDriverPhone(e.target.value)}
                      placeholder="+91 98220 12345"
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-[#FCC016]"
                    />
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Nashik Auto RTO Number (रिक्षा नंबर MH-15)
                  </label>
                  <input
                    type="text"
                    required
                    value={driverPlate}
                    onChange={(e) => setDriverPlate(e.target.value.toUpperCase())}
                    placeholder="MH-15 EF 4321"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-[#FCC016]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Auto Rickshaw Model Type
                  </label>
                  <select
                    value={driverModel}
                    onChange={(e) => setDriverModel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 outline-none"
                  >
                    <option value="Bajaj Compact RE (MH-15 Auto)">Bajaj RE 3-Seater (CNG City Auto)</option>
                    <option value="Mahindra Treo Electric Auto">Mahindra Treo EV Auto (Green Auto)</option>
                    <option value="Piaggio Ape 6-Seater Maxi Auto">Piaggio Ape 6-Seater (Maxi Route Auto)</option>
                  </select>
                </div>

                {authMode === 'SIGNUP' && (
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Commercial Driving Badge / Permit No.
                    </label>
                    <input
                      type="text"
                      required
                      value={driverBadge}
                      onChange={(e) => setDriverBadge(e.target.value)}
                      placeholder="MH15-COM-2024-..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 outline-none focus:ring-2 focus:ring-[#FCC016]"
                    />
                  </div>
                )}

                {authMode === 'SIGNUP' && (
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Primary Nashik Auto Stand (प्रमुख रिक्षा थांबा)
                    </label>
                    <select
                      value={driverStand}
                      onChange={(e) => setDriverStand(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 outline-none"
                    >
                      <option value="CBS (Central Bus Stand)">CBS (Central Bus Stand)</option>
                      <option value="College Road (BYK Chowk)">College Road (BYK Chowk)</option>
                      <option value="Nashik Road Station">Nashik Road Railway Station</option>
                      <option value="Panchavati (Ramkund Ghat)">Panchavati (Ramkund Ghat)</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Driver PIN / Passcode (चालक पिन)
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={driverPin}
                      onChange={(e) => setDriverPin(e.target.value)}
                      placeholder="4-digit driver PIN"
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-[#FCC016]"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  </div>
                </div>
              </div>

              {/* Quick 1-Tap Auto Drivers */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider block">
                  Quick Demo Auto Drivers:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {SEEDED_DRIVERS.slice(0, 4).map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => selectDemoDriver(d)}
                      className="px-2.5 py-1.5 bg-amber-50/70 hover:bg-amber-100 text-amber-950 rounded-xl text-left border border-amber-200 transition-colors flex items-center justify-between"
                    >
                      <div className="truncate">
                        <div className="text-[11px] font-bold truncate">{d.name}</div>
                        <div className="text-[9px] text-amber-800 font-mono">{d.plateNumber}</div>
                      </div>
                      <span className="text-[10px] text-amber-900 font-bold ml-1">Use</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#FCC016] hover:bg-amber-400 text-[#1E1E1E] font-black text-xs rounded-xl shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                <span>
                  {authMode === 'LOGIN' ? 'Driver Login (Go Online)' : 'Register Auto Rickshaw & Go Online'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : authRole === 'ADMIN' ? (
            /* DISPATCHER / ADMIN AUTHENTICATION FORM */
            <form onSubmit={handleAdminSubmit} className="space-y-3.5">
              <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-3 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-950">
                  <Shield className="w-4 h-4 text-amber-600" />
                  <span>Nashik District Operations & Dispatch Control</span>
                </div>
                <p className="text-[10px] text-amber-800">
                  Restricted access for traffic authorities, algorithmic dispatch audit, VRPTW detour inspection, and safety desk.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Dispatcher Passcode / Security PIN
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={adminPin}
                      onChange={(e) => setAdminPin(e.target.value)}
                      placeholder="Enter 4-digit PIN (default 9999)"
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-[#FCC016]"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Default demo passcode: <strong className="text-slate-700">9999</strong>
                  </span>
                </div>
              </div>

              {/* Quick Demo Operator Buttons */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider block">
                  Quick 1-Tap Operator Profiles:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setAdminPin('9999');
                      setFeedbackMsg({ type: 'success', text: 'Loaded Chief Inspector Pawar credentials (PIN: 9999)' });
                    }}
                    className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-xl text-left border border-slate-200 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-[11px] font-bold truncate">Insp. Pawar</div>
                      <div className="text-[9px] text-slate-500">Chief Dispatcher</div>
                    </div>
                    <span className="text-[10px] text-amber-600 font-bold ml-1">Use</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAdminPin('9999');
                      setFeedbackMsg({ type: 'success', text: 'Loaded Officer Deshmukh credentials (PIN: 9999)' });
                    }}
                    className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-xl text-left border border-slate-200 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-[11px] font-bold truncate">Off. Deshmukh</div>
                      <div className="text-[9px] text-slate-500">Corridor Lead</div>
                    </div>
                    <span className="text-[10px] text-amber-600 font-bold ml-1">Use</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#FCC016] hover:bg-amber-400 text-[#1E1E1E] font-black text-xs rounded-xl shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                <span>Authorize & Launch Operations Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : null}
        </div>

        {/* Footer info badge */}
        <div className="text-center pt-3 pb-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/60">
            <Shield className="w-3 h-3 text-[#FCC016]" />
            <span>Nashik RTO & Police SOS Integrated Network</span>
          </div>
        </div>
      </div>
    </div>
  );
};
