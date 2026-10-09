import React, { useState } from 'react';
import { User, Car, Phone, Shield, ArrowRight, CheckCircle, X, Lock, Key, Award, UserPlus, LogIn } from 'lucide-react';
import { useFairwayStore } from '../../services/store';
import { SEEDED_DRIVERS, SEEDED_PASSENGERS } from '../../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'CUSTOMER' | 'DRIVER';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'CUSTOMER',
}) => {
  const { loginCustomer, loginDriver, setRole } = useFairwayStore();
  const [authRole, setAuthRole] = useState<'CUSTOMER' | 'DRIVER'>(defaultRole);
  const [authAction, setAuthAction] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  // Customer form fields
  const [custName, setCustName] = useState('Pooja Sharma');
  const [custPhone, setCustPhone] = useState('+91 98221 44556');
  const [custPassword, setCustPassword] = useState('••••••••');
  const [custGender, setCustGender] = useState<'female' | 'male'>('female');
  const [custEmergencyPhone, setCustEmergencyPhone] = useState('+91 98229 11223');

  // Driver form fields
  const [driverName, setDriverName] = useState('Ramesh Shinde (Kaka)');
  const [driverPhone, setDriverPhone] = useState('+91 98220 12345');
  const [driverPlate, setDriverPlate] = useState('MH-15 EF 4321');
  const [driverModel, setDriverModel] = useState('Bajaj Compact RE (MH-15 Auto)');
  const [driverBadgeNo, setDriverBadgeNo] = useState('MH15-COM-2024-890');
  const [driverPassword, setDriverPassword] = useState('••••••••');

  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim() || !custPhone.trim()) return;

    loginCustomer(custName.trim(), custPhone.trim(), custGender);
    setFormSuccess(authAction === 'LOGIN' ? `Welcome back, ${custName}!` : `Account created for ${custName}!`);
    setTimeout(() => {
      setFormSuccess(null);
      setRole('CUSTOMER');
      onClose();
    }, 900);
  };

  const handleDriverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverName.trim() || !driverPlate.trim()) return;

    loginDriver(driverName.trim(), driverPlate.trim(), driverModel);
    setFormSuccess(authAction === 'LOGIN' ? `Namaste Kaka! Logged in as ${driverName}` : `Auto Rickshaw ${driverPlate} Registered!`);
    setTimeout(() => {
      setFormSuccess(null);
      setRole('DRIVER');
      onClose();
    }, 900);
  };

  const handleQuickPassenger = (p: typeof SEEDED_PASSENGERS[0]) => {
    setCustName(p.name);
    setCustPhone(p.phone);
    setCustGender(p.gender as any);
  };

  const handleQuickDriver = (d: typeof SEEDED_DRIVERS[0]) => {
    setDriverName(d.name);
    setDriverPhone(d.phone);
    setDriverPlate(d.plateNumber);
    setDriverModel(d.vehicleModel);
  };

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#FCC016] text-[#1E1E1E] flex items-center justify-center font-black text-lg shadow-sm">
              🛺
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 leading-tight">
                FAIRWAY Nashik
              </h3>
              <p className="text-[10px] text-slate-500 font-medium">
                MH-15 Auto Rickshaw Mobility Network
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role Toggle: Passenger vs Auto Driver */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => {
              setAuthRole('CUSTOMER');
              setFormSuccess(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              authRole === 'CUSTOMER'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Passenger</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthRole('DRIVER');
              setFormSuccess(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              authRole === 'DRIVER'
                ? 'bg-[#FCC016] text-[#1E1E1E] shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="text-xs">🛺</span>
            <span>Auto Driver</span>
          </button>
        </div>

        {/* Action Toggle: Sign In vs Sign Up */}
        <div className="flex items-center justify-center border-b border-slate-100 pb-2 gap-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setAuthAction('LOGIN')}
            className={`pb-1 relative transition-colors ${
              authAction === 'LOGIN'
                ? 'text-slate-900 border-b-2 border-[#FCC016]'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthAction('SIGNUP')}
            className={`pb-1 relative transition-colors ${
              authAction === 'SIGNUP'
                ? 'text-slate-900 border-b-2 border-[#FCC016]'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            Create Account (Sign Up)
          </button>
        </div>

        {formSuccess && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{formSuccess}</span>
          </div>
        )}

        {/* PASSENGER AUTH FORM */}
        {authRole === 'CUSTOMER' ? (
          <form onSubmit={handleCustomerSubmit} className="space-y-3">
            <div className="space-y-2 text-xs">
              {authAction === 'SIGNUP' && (
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    placeholder="e.g. Pooja Sharma"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:ring-1 focus:ring-[#FCC016]"
                  />
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Mobile Number (Maharashtra +91)
                </label>
                <input
                  type="tel"
                  required
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  placeholder="+91 98221 ..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 outline-none focus:ring-1 focus:ring-[#FCC016]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  {authAction === 'LOGIN' ? 'Password / OTP' : 'Create Security PIN / Password'}
                </label>
                <input
                  type="password"
                  required
                  value={custPassword}
                  onChange={(e) => setCustPassword(e.target.value)}
                  placeholder="Enter 4-digit PIN or password"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 outline-none focus:ring-1 focus:ring-[#FCC016]"
                />
              </div>

              {authAction === 'SIGNUP' && (
                <>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Gender (Used strictly for Women-Only Auto Groups)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setCustGender('female')}
                        className={`py-1.5 rounded-xl border text-xs font-bold transition-all ${
                          custGender === 'female'
                            ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm'
                            : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        Female (Mahila Sakhi)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustGender('male')}
                        className={`py-1.5 rounded-xl border text-xs font-bold transition-all ${
                          custGender === 'male'
                            ? 'border-slate-800 bg-slate-100 text-slate-900 shadow-sm'
                            : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        Male / General
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Emergency Trusted Contact Mobile
                    </label>
                    <input
                      type="tel"
                      value={custEmergencyPhone}
                      onChange={(e) => setCustEmergencyPhone(e.target.value)}
                      placeholder="+91 98..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900 outline-none focus:ring-1 focus:ring-[#FCC016]"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Quick Demo Commuter Cards */}
            <div className="space-y-1 pt-1 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Or Quick Test with Demo Commuter:
              </span>
              <div className="flex gap-1.5 overflow-x-auto text-[11px]">
                {SEEDED_PASSENGERS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleQuickPassenger(p)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg whitespace-nowrap font-semibold border border-slate-200/60"
                  >
                    {p.name.split(' ')[0]} ({p.gender === 'female' ? '♀' : '♂'})
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1E1E1E] hover:bg-black text-[#FCC016] font-black text-xs rounded-xl shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
            >
              <span>{authAction === 'LOGIN' ? 'Sign In as Passenger' : 'Complete Registration & Start'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* AUTO DRIVER AUTH FORM */
          <form onSubmit={handleDriverSubmit} className="space-y-3">
            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Driver Name (Auto Kaka)
                </label>
                <input
                  type="text"
                  required
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="e.g. Ramesh Shinde"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:ring-1 focus:ring-[#FCC016]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Nashik Auto Registration Plate (MH-15)
                </label>
                <input
                  type="text"
                  required
                  value={driverPlate}
                  onChange={(e) => setDriverPlate(e.target.value.toUpperCase())}
                  placeholder="MH-15 EF 4321"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 outline-none focus:ring-1 focus:ring-[#FCC016]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Auto Rickshaw Model Tier
                </label>
                <select
                  value={driverModel}
                  onChange={(e) => setDriverModel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none"
                >
                  <option value="Bajaj Compact RE (MH-15 Auto)">Bajaj RE 3-Seater (CNG Auto)</option>
                  <option value="Mahindra Treo Electric Auto">Mahindra Treo EV Auto (Green Auto)</option>
                  <option value="Piaggio Ape 6-Seater Maxi Auto">Piaggio Ape 6-Seater (Maxi Route Auto)</option>
                </select>
              </div>

              {authAction === 'SIGNUP' && (
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    RTO Commercial Driving Badge Number
                  </label>
                  <input
                    type="text"
                    required
                    value={driverBadgeNo}
                    onChange={(e) => setDriverBadgeNo(e.target.value)}
                    placeholder="MH15-COM-..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 outline-none focus:ring-1 focus:ring-[#FCC016]"
                  />
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Driver Passcode
                </label>
                <input
                  type="password"
                  required
                  value={driverPassword}
                  onChange={(e) => setDriverPassword(e.target.value)}
                  placeholder="Enter 4-digit driver PIN"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 outline-none focus:ring-1 focus:ring-[#FCC016]"
                />
              </div>
            </div>

            {/* Quick Demo Auto Drivers */}
            <div className="space-y-1 pt-1 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Or Quick Fill Demo Auto Driver:
              </span>
              <div className="flex gap-1.5 overflow-x-auto text-[11px]">
                {SEEDED_DRIVERS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => handleQuickDriver(d)}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg whitespace-nowrap font-semibold"
                  >
                    {d.name.split(' ')[0]} ({d.plateNumber})
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#FCC016] hover:bg-amber-400 text-[#1E1E1E] font-black text-xs rounded-xl shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
            >
              <span>{authAction === 'LOGIN' ? 'Login as Auto Driver (Go Online)' : 'Register Auto Driver & Go Online'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
