import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Maximize2,
  User,
  Car,
  Sliders,
  CheckCircle,
  RotateCcw,
  Languages,
  Download,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { useFairwayStore } from '../../services/store';
import { TRANSLATIONS } from '../../services/i18n';
import { InstallAppModal } from './InstallAppModal';

interface DeviceFrameProps {
  children: React.ReactNode;
}

/**
 * Clean, modern app window container.
 * Free of fake plastic phone borders, notch, dynamic island, or hardware buttons.
 */
export const CleanAppContainer: React.FC<{
  children: React.ReactNode;
  title?: string;
  badge?: string;
  badgeColor?: string;
}> = ({ children, title, badge, badgeColor }) => {
  return (
    <div className="w-full max-w-[430px] h-[860px] max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-700/60 overflow-hidden flex flex-col text-slate-900 shrink-0 relative transition-all">
      {title && (
        <div className="h-8 bg-slate-900 border-b border-slate-800 px-3 flex items-center justify-between text-xs font-semibold text-slate-200 select-none shrink-0">
          <span className="font-bold tracking-tight">{title}</span>
          {badge && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                badgeColor || 'bg-amber-400/20 text-[#FCC016]'
              }`}
            >
              {badge}
            </span>
          )}
        </div>
      )}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        {children}
      </div>
    </div>
  );
};

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const { state, setRole, setViewportMode, resetDemoState, setLanguage, clearNotification } = useFairwayStore();
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showMobileRoleMenu, setShowMobileRoleMenu] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);
  }, []);

  const t = TRANSLATIONS[state.language || 'en'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* ========================================================
          1. MOBILE VIEW: 100% FULL SCREEN EDGE-TO-EDGE
          Zero fake phone mockups, zero plastic bezels, zero fake notch!
         ======================================================== */}
      <div className="md:hidden fixed inset-0 w-full h-[100dvh] bg-[#F8F9FA] flex flex-col overflow-hidden z-10 text-slate-900">
        {/* Sleek Floating Role Switcher Pill for Mobile Testers */}
        <div className="fixed top-2.5 right-3 z-50 flex items-center gap-1.5 pointer-events-auto">
          {!isStandalone && (
            <button
              onClick={() => setShowInstallModal(true)}
              className="bg-[#FCC016] text-[#1E1E1E] px-2.5 py-1 rounded-full text-[11px] font-black shadow-md border border-amber-400 flex items-center gap-1 cursor-pointer active:scale-95 transition-transform"
            >
              <Download className="w-3 h-3 stroke-[2.5]" />
              <span>Install</span>
            </button>
          )}

          <div className="relative">
            <button
              onClick={() => setShowMobileRoleMenu(!showMobileRoleMenu)}
              className="bg-slate-900/90 hover:bg-slate-800 text-amber-300 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md border border-slate-700/80 flex items-center gap-1 cursor-pointer active:scale-95 transition-transform"
            >
              <span>
                {state.currentRole === 'CUSTOMER'
                  ? '👤 Rider'
                  : state.currentRole === 'DRIVER'
                  ? '🛺 Driver'
                  : state.currentRole === 'ADMIN'
                  ? '📊 Ops'
                  : '🧪 Test'}
              </span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* Mobile Role Switch Dropdown */}
            {showMobileRoleMenu && (
              <div className="absolute right-0 top-8 w-44 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl p-1.5 space-y-1 text-xs text-slate-200 z-50 animate-in fade-in zoom-in-95">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch App Role:
                </div>
                <button
                  onClick={() => {
                    setRole('CUSTOMER');
                    setShowMobileRoleMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center gap-2 cursor-pointer ${
                    state.currentRole === 'CUSTOMER'
                      ? 'bg-[#FCC016] text-[#1E1E1E] font-bold'
                      : 'hover:bg-slate-800'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Passenger (Pooja)</span>
                </button>
                <button
                  onClick={() => {
                    setRole('DRIVER');
                    setShowMobileRoleMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center gap-2 cursor-pointer ${
                    state.currentRole === 'DRIVER'
                      ? 'bg-[#FCC016] text-[#1E1E1E] font-bold'
                      : 'hover:bg-slate-800'
                  }`}
                >
                  <span>🛺</span>
                  <span>Driver (Ramesh)</span>
                </button>
                <button
                  onClick={() => {
                    setRole('ADMIN');
                    setShowMobileRoleMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center gap-2 cursor-pointer ${
                    state.currentRole === 'ADMIN'
                      ? 'bg-[#FCC016] text-[#1E1E1E] font-bold'
                      : 'hover:bg-slate-800'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Ops & Dispatch</span>
                </button>
                <button
                  onClick={() => {
                    setRole('TESTS');
                    setShowMobileRoleMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center gap-2 cursor-pointer ${
                    state.currentRole === 'TESTS'
                      ? 'bg-[#FCC016] text-[#1E1E1E] font-bold'
                      : 'hover:bg-slate-800'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Test Suite</span>
                </button>
                <div className="border-t border-slate-800 pt-1 mt-1 flex justify-between px-2 text-[10px]">
                  <button
                    onClick={() => {
                      resetDemoState();
                      setShowMobileRoleMenu(false);
                    }}
                    className="text-amber-400 font-bold hover:underline"
                  >
                    Reset Demo
                  </button>
                  <button
                    onClick={() => setShowMobileRoleMenu(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* The Native-feel Mobile Content */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {children}
        </div>
      </div>

      {/* ========================================================
          2. DESKTOP VIEW: Sleek Pro App Shell
          No fake iPhone bezels, notch or volume buttons!
         ======================================================== */}
      <div className="hidden md:flex flex-col min-h-screen">
        {/* Top Control Bar */}
        <header className="h-14 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-4 flex items-center justify-between z-50 shrink-0">
          {/* Brand Lockup */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FCC016] text-[#1E1E1E] flex items-center justify-center font-black text-base shadow-sm">
              🛺
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-sm tracking-tight">{t.appName}</span>
                <span className="text-[10px] bg-amber-400/20 text-[#FCC016] px-1.5 py-0.5 rounded font-mono font-medium">
                  MH-15 AUTO
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Nashik District Real-Time Auto Rickshaw Pooling (15% Max Detour)
              </p>
            </div>
          </div>

          {/* Role Switcher Tabs */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setRole('CUSTOMER')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                state.currentRole === 'CUSTOMER'
                  ? 'bg-[#FCC016] text-[#1E1E1E] shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{t.passenger}</span>
            </button>

            <button
              onClick={() => setRole('DRIVER')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                state.currentRole === 'DRIVER'
                  ? 'bg-[#FCC016] text-[#1E1E1E] shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className="text-xs">🛺</span>
              <span>{t.autoDriver}</span>
            </button>

            <button
              onClick={() => setRole('ADMIN')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                state.currentRole === 'ADMIN'
                  ? 'bg-[#FCC016] text-[#1E1E1E] shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{t.opsDispatch}</span>
            </button>

            <button
              onClick={() => setRole('TESTS')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                state.currentRole === 'TESTS'
                  ? 'bg-[#FCC016] text-[#1E1E1E] shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{t.testSuite}</span>
            </button>
          </div>

          {/* Viewport, Language & Controls */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-[11px] font-bold">
              <button
                onClick={() => setLanguage('en')}
                title="English"
                className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                  state.language === 'en'
                    ? 'bg-[#FCC016] text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('mr')}
                title="मराठी (Marathi)"
                className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                  state.language === 'mr'
                    ? 'bg-[#FCC016] text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                मराठी
              </button>
              <button
                onClick={() => setLanguage('hi')}
                title="हिंदी (Hindi)"
                className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                  state.language === 'hi'
                    ? 'bg-[#FCC016] text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* Viewport Mode Switcher */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-[11px] font-bold">
              <button
                onClick={() => setViewportMode('PHONE_SIMULATOR')}
                title="App Card View"
                className={`flex items-center gap-1 px-2.5 py-1 rounded cursor-pointer transition-colors ${
                  state.viewportMode === 'PHONE_SIMULATOR'
                    ? 'bg-[#FCC016] text-slate-950 shadow-sm font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>App</span>
              </button>

              <button
                onClick={() => setViewportMode('DUAL_SIMULATOR')}
                title="Dual View: Rider + Driver Side-by-Side"
                className={`flex items-center gap-1 px-2.5 py-1 rounded cursor-pointer transition-colors ${
                  state.viewportMode === 'DUAL_SIMULATOR'
                    ? 'bg-[#FCC016] text-slate-950 shadow-sm font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Dual</span>
              </button>

              <button
                onClick={() => setViewportMode('RESPONSIVE_CANVAS')}
                title="Full Responsive Canvas"
                className={`flex items-center gap-1 px-2.5 py-1 rounded cursor-pointer transition-colors ${
                  state.viewportMode === 'RESPONSIVE_CANVAS'
                    ? 'bg-[#FCC016] text-slate-950 shadow-sm font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Canvas</span>
              </button>
            </div>

            <button
              onClick={() => setShowInstallModal(true)}
              title="Install FAIRWAY App on Mobile / Desktop"
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-black text-[#1E1E1E] bg-[#FCC016] hover:bg-amber-400 rounded-lg shadow-sm cursor-pointer transition-transform active:scale-95 border border-amber-400"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Install App</span>
            </button>

            <button
              onClick={resetDemoState}
              title="Reset Simulation State"
              className="p-1.5 text-slate-400 hover:text-amber-400 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Main Workspace Area */}
        <main className="flex-1 flex items-center justify-center p-3 sm:p-5 lg:p-6 overflow-auto">
          {state.viewportMode === 'DUAL_SIMULATOR' ? (
            children
          ) : state.viewportMode === 'PHONE_SIMULATOR' ? (
            <CleanAppContainer>{children}</CleanAppContainer>
          ) : (
            /* Full Responsive Canvas */
            <div className="w-full max-w-6xl h-full bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-800">
              <div className="flex-1 overflow-auto">{children}</div>
            </div>
          )}
        </main>
      </div>

      {/* Modern Non-Obstructive Notification Toast Banner */}
      {state.simulatedNotification && (
        <div className="fixed top-14 sm:top-4 right-3 sm:right-4 max-w-sm z-[9999] bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-2xl border border-amber-400/40 flex items-start gap-2.5 animate-in slide-in-from-top-3 duration-200">
          <div className="w-7 h-7 rounded-xl bg-[#FCC016] text-[#1E1E1E] flex items-center justify-center shrink-0 font-bold text-sm shadow">
            {state.simulatedNotification.includes('EMERGENCY') ? '🚨' : '🛺'}
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#FCC016] block">
              {state.simulatedNotification.includes('EMERGENCY') ? 'Police & SOS Alert' : 'Live Update'}
            </span>
            <p className="text-xs text-slate-200 leading-snug mt-0.5">
              {state.simulatedNotification.replace(/🚨 EMERGENCY ALERT:? ?/, '')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => clearNotification()}
            className="w-6 h-6 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center shrink-0 cursor-pointer text-xs font-bold transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* App Install Popup Modal */}
      <InstallAppModal
        forceOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </div>
  );
};
