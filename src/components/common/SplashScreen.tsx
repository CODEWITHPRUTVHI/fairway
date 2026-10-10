import React, { useState, useEffect } from 'react';
import { Sparkles, Shield, ChevronRight, Compass } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  appName?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isDismissing, setIsDismissing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          triggerFinish();
          return 100;
        }
        return prev + 2.5;
      });
    }, 45);

    return () => clearInterval(timer);
  }, []);

  const triggerFinish = () => {
    setIsDismissing(true);
    setTimeout(() => {
      onComplete();
    }, 400);
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#0A0E17] text-white flex flex-col justify-between p-6 select-none overflow-hidden transition-all duration-400 ${
        isDismissing ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#FCC016]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Bar with Badge */}
      <div className="flex items-center justify-between z-10 pt-3">
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-full backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#FCC016] animate-ping" />
          <span className="text-[11px] font-mono font-bold tracking-widest text-[#FCC016]">
            NASHIK · MH-15
          </span>
        </div>
        <button
          onClick={triggerFinish}
          className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1 rounded-full bg-slate-850 hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>Skip</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Cinematic Showcase */}
      <div className="flex-1 flex flex-col items-center justify-center text-center z-10 space-y-6">
        {/* Animated Auto Rickshaw with Headlamp Projection */}
        <div className="relative flex items-center justify-center">
          {/* Headlamp beam glowing to the right */}
          <div
            className="absolute left-[60%] top-1/2 -translate-y-1/2 w-48 h-24 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at left, rgba(252, 192, 22, 0.45) 0%, rgba(252, 192, 22, 0.08) 50%, transparent 80%)',
              clipPath: 'polygon(0% 40%, 100% 0%, 100% 100%, 0% 60%)',
              filter: 'blur(3px)',
            }}
          />

          {/* Pulse Ripple Rings */}
          <div className="absolute w-36 h-36 rounded-full border border-[#FCC016]/30 animate-ping opacity-30" />
          <div className="absolute w-28 h-28 rounded-full border border-[#FCC016]/50 animate-pulse" />

          {/* Golden Auto Rickshaw Emblem */}
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#1E1E1E] via-[#2A2A2A] to-[#1E1E1E] border-2 border-[#FCC016] shadow-[0_0_40px_rgba(252,192,22,0.4)] flex items-center justify-center text-5xl transform transition-transform duration-500 hover:scale-105">
            🛺
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-2 max-w-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCC016]/10 border border-[#FCC016]/30 text-[#FCC016] text-[11px] font-bold tracking-wider uppercase">
            <Sparkles className="w-3 h-3" />
            <span>Smart Auto-Rickshaw Pooling</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>FAIRWAY</span>
            <span className="text-[#FCC016]">नाशिक</span>
          </h1>

          <p className="text-xs text-slate-300 font-medium leading-relaxed">
            Fair Fares · Smarter Routes · 15% Detour Bound
          </p>
        </div>

        {/* Feature Highlights Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-sm pt-2">
          <span className="text-[10px] bg-slate-800/80 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-lg flex items-center gap-1">
            <span>⚡ Shapley Value Split</span>
          </span>
          <span className="text-[10px] bg-purple-950/60 border border-purple-500/40 text-purple-300 px-2.5 py-1 rounded-lg flex items-center gap-1">
            <Shield className="w-3 h-3 text-purple-400" />
            <span>Mahila Sakhi Mode</span>
          </span>
          <span className="text-[10px] bg-slate-800/80 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-lg flex items-center gap-1">
            <Compass className="w-3 h-3 text-amber-400" />
            <span>Midpoint Meeting</span>
          </span>
        </div>
      </div>

      {/* Bottom Progress Bar & Enter Button */}
      <div className="z-10 space-y-4 max-w-sm mx-auto w-full pb-4">
        {/* Animated Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>Loading Nashik Corridors...</span>
            <span className="font-bold text-[#FCC016]">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-[#FCC016] to-yellow-300 rounded-full transition-all duration-100 shadow-[0_0_8px_#FCC016]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Enter App Button */}
        <button
          onClick={triggerFinish}
          className="w-full py-3.5 bg-[#FCC016] hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-black text-sm rounded-2xl shadow-[0_6px_20px_rgba(252,192,22,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Start Journey in Nashik</span>
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
