import React from 'react';
import {
  Smartphone,
  Maximize2,
  User,
  Car,
  Sliders,
  CheckCircle,
  RotateCcw,
  Wifi,
  Battery,
  Languages,
} from 'lucide-react';
import { useFairwayStore } from '../../services/store';
import { TRANSLATIONS } from '../../services/i18n';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const { state, setRole, setViewportMode, resetDemoState, setLanguage } = useFairwayStore();
  const t = TRANSLATIONS[state.language || 'en'];

  const isPhoneMode = state.viewportMode === 'PHONE_SIMULATOR';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Engineering Control Bar */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-3 sm:px-4 flex items-center justify-between z-50 shrink-0">
        {/* Brand Lockup */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FCC016] text-[#1E1E1E] flex items-center justify-center font-black text-base shadow-sm">
            🛺
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-xs sm:text-sm tracking-tight">{t.appName}</span>
              <span className="text-[9px] sm:text-[10px] bg-amber-400/20 text-[#FCC016] px-1.5 py-0.5 rounded font-mono font-medium">
                MH-15 AUTO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden md:block">
              Nashik District Real-Time Auto Rickshaw Pooling (15% Max Detour)
            </p>
          </div>
        </div>

        {/* Role Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          <button
            onClick={() => setRole('CUSTOMER')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              state.currentRole === 'CUSTOMER'
                ? 'bg-[#FCC016] text-[#1E1E1E] shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.passenger}</span>
          </button>

          <button
            onClick={() => setRole('DRIVER')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              state.currentRole === 'DRIVER'
                ? 'bg-[#FCC016] text-[#1E1E1E] shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span className="text-xs">🛺</span>
            <span className="hidden sm:inline">{t.autoDriver}</span>
          </button>

          <button
            onClick={() => setRole('ADMIN')}
            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              state.currentRole === 'ADMIN'
                ? 'bg-[#FCC016] text-[#1E1E1E] shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.opsDispatch}</span>
          </button>

          <button
            onClick={() => setRole('TESTS')}
            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              state.currentRole === 'TESTS'
                ? 'bg-[#FCC016] text-[#1E1E1E] shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.testSuite}</span>
          </button>
        </div>

        {/* Viewport, Language & Reset controls */}
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

          <button
            onClick={() =>
              setViewportMode(
                isPhoneMode ? 'RESPONSIVE_CANVAS' : 'PHONE_SIMULATOR'
              )
            }
            title={isPhoneMode ? 'Switch to Fullscreen' : 'Switch to Phone View'}
            className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 cursor-pointer transition-colors"
          >
            {isPhoneMode ? (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Full Canvas</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Phone Frame</span>
              </>
            )}
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

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-auto">
        {isPhoneMode ? (
          /* Phone Device Shell */
          <div className="relative w-[385px] h-[812px] max-h-[92vh] bg-black rounded-[48px] p-3 shadow-2xl ring-1 ring-slate-800 border-4 border-slate-800 flex flex-col shrink-0">
            {/* Physical Frame Buttons simulation */}
            <div className="absolute -left-1.5 top-24 w-1 h-12 bg-slate-700 rounded-l" />
            <div className="absolute -left-1.5 top-40 w-1 h-12 bg-slate-700 rounded-l" />
            <div className="absolute -right-1.5 top-32 w-1 h-16 bg-slate-700 rounded-r" />

            {/* Inner Phone Screen */}
            <div className="relative w-full h-full bg-white rounded-[38px] overflow-hidden flex flex-col text-slate-900 shadow-inner">
              {/* iOS Status Bar */}
              <div className="h-10 bg-white/95 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-40 select-none text-xs font-semibold text-slate-900 border-b border-slate-100/40">
                <span>9:41</span>
                {/* Dynamic Island Pill */}
                <div className="w-24 h-4.5 bg-black rounded-full flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 mr-2" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400/80 animate-pulse" />
                </div>
                <div className="flex items-center gap-1.5 text-slate-800">
                  <Wifi className="w-3.5 h-3.5" />
                  <Battery className="w-4 h-4" />
                </div>
              </div>

              {/* Mobile Viewport Content */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
                {children}
              </div>

              {/* iOS Home Indicator Bar */}
              <div className="h-5 bg-white/95 backdrop-blur flex items-center justify-center shrink-0 z-40">
                <div className="w-32 h-1 bg-slate-300 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          /* Full Responsive Canvas */
          <div className="w-full max-w-6xl h-full bg-white text-slate-900 rounded-2xl shadow-xl overflow-hidden flex flex-col border border-slate-800">
            <div className="flex-1 overflow-auto">{children}</div>
          </div>
        )}
      </main>

      {/* Simulated notification banner */}
      {state.simulatedNotification && (
        <div className="fixed bottom-4 right-4 max-w-md bg-amber-500 text-slate-950 px-4 py-3 rounded-xl shadow-2xl font-medium text-xs z-50 flex items-center gap-2 border border-amber-600 animate-bounce">
          <span className="font-bold">⚠️ EMERGENCY ALERT:</span>
          <span>{state.simulatedNotification}</span>
        </div>
      )}
    </div>
  );
};
