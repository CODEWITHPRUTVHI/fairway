import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Shield, Compass, Lock, ChevronRight, Check } from 'lucide-react';

interface OnboardingModalProps {
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: 'Fair Fares with Shapley Value',
      tagline: 'Cooperative Game Theory Pricing',
      desc: 'Never overpay for ride-pooling. Total vehicle operating costs are mathematically divided using Lloyd Shapley’s Nobel Prize formulation, giving every rider true synergy discounts.',
      icon: '📐',
      color: 'bg-amber-100 text-amber-900',
    },
    {
      title: 'Hard 15% Detour Cap',
      tagline: 'Zero Endless Sidetracks',
      desc: 'No pooled passenger is ever subjected to more than a 15% detour over their solo direct baseline. If a detour violates the 15% threshold, the proposal is automatically rejected.',
      icon: '⏱️',
      color: 'bg-emerald-100 text-emerald-900',
    },
    {
      title: 'Women-Only Travel Partners',
      tagline: 'Comfort & Community Safety',
      desc: 'Traveling at night or prefer female companions? Toggle Women-Only Matching to guarantee all co-riders in your vehicle are verified female passengers.',
      icon: '🛡️',
      color: 'bg-purple-100 text-purple-900',
    },
    {
      title: '4-Digit Boarding Security PIN',
      tagline: 'Board the Right Vehicle Every Time',
      desc: 'Every trip generates a unique 4-digit code. The driver cannot start the meter or drive off without entering your secret boarding PIN.',
      icon: '🔐',
      color: 'bg-blue-100 text-blue-900',
    },
  ];

  const current = slides[step];

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col p-6 animate-in fade-in justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FCC016] text-[#1E1E1E] flex items-center justify-center font-black text-sm">
            F
          </div>
          <span className="font-extrabold text-slate-900 text-sm">FAIRWAY</span>
        </div>
        <button
          onClick={onClose}
          className="text-xs font-bold text-slate-400 hover:text-slate-800"
        >
          Skip
        </button>
      </div>

      <div className="space-y-4 my-auto text-center px-2">
        <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-md border border-slate-100">
          {current.icon}
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] font-bold tracking-wider uppercase text-amber-600">
            {current.tagline}
          </span>
          <h3 className="text-xl font-black text-slate-900">
            {current.title}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
            {current.desc}
          </p>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 pt-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'w-6 bg-[#FCC016]' : 'w-1.5 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="pt-4">
        {step < slides.length - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="w-full py-3.5 bg-[#1E1E1E] text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 hover:bg-black transition-colors"
          >
            <span>Continue</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-[#FCC016] text-[#1E1E1E] font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 hover:bg-amber-400 transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Get Started with FAIRWAY</span>
          </button>
        )}
      </div>
    </div>
  );
};
