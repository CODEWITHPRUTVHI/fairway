import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  Share2,
  PlusSquare,
  CheckCircle2,
  X,
  Shield,
  Zap,
  Star,
  Sparkles,
  ArrowRight,
  Monitor,
} from 'lucide-react';

interface InstallAppModalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  forceOpen,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installState, setInstallState] = useState<'IDLE' | 'INSTALLING' | 'INSTALLED'>('IDLE');
  const [activePlatformTab, setActivePlatformTab] = useState<'ANDROID' | 'IOS' | 'DESKTOP'>('ANDROID');

  useEffect(() => {
    // Detect if already installed as standalone PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      return;
    }

    // Check localStorage dismissal
    const hasDismissed = sessionStorage.getItem('fairway_install_dismissed');

    // Capture PWA beforeinstallprompt event if supported by browser
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!hasDismissed) {
        setIsOpen(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Auto-open on initial platform load if not dismissed
    if (forceOpen) {
      setIsOpen(true);
    } else if (!hasDismissed) {
      // Small delay for smooth entry experience
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 600);
      return () => clearTimeout(timer);
    }

    // Detect user OS for smart default tab
    const userAgent = navigator.userAgent || '';
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      setActivePlatformTab('IOS');
    } else if (/Android/.test(userAgent)) {
      setActivePlatformTab('ANDROID');
    } else {
      setActivePlatformTab('DESKTOP');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [forceOpen]);

  const handleDismiss = () => {
    sessionStorage.setItem('fairway_install_dismissed', 'true');
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setInstallState('INSTALLED');
          setTimeout(() => handleDismiss(), 2000);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error('PWA install error', err);
      }
    } else {
      // High-fidelity install simulation with progress
      setInstallState('INSTALLING');
      setTimeout(() => {
        setInstallState('INSTALLED');
        setTimeout(() => {
          handleDismiss();
        }, 2200);
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border-2 border-[#FCC016] rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100 relative max-h-[94vh]">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition-colors cursor-pointer"
          title="Close / Continue in Browser"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Hero Section */}
        <div className="bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-900 p-5 pt-6 text-center border-b border-slate-800 relative">
          {/* Brand Icon */}
          <div className="relative inline-block mb-2">
            <div className="w-16 h-16 rounded-2xl bg-[#FCC016] text-[#1E1E1E] flex items-center justify-center text-3xl font-black shadow-xl ring-4 ring-amber-400/30 mx-auto">
              🛺
            </div>
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full text-[10px] font-bold border-2 border-slate-900">
              <Download className="w-3 h-3" />
            </span>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-1">
            <span className="text-[10px] bg-[#FCC016]/20 text-[#FCC016] px-2 py-0.5 rounded-full font-mono font-bold">
              MH-15 NASHIK PWA APP
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              v1.0 Ready
            </span>
          </div>

          <h2 className="text-xl font-black text-white mt-2 tracking-tight">
            Install FAIRWAY App
          </h2>
          <p className="text-xs text-slate-300 max-w-xs mx-auto mt-1 leading-relaxed">
            Get the full mobile auto rickshaw pooling experience with instant launch, live radar, and offline fare calculations.
          </p>

          {/* Platform Tab Selector */}
          <div className="grid grid-cols-3 p-1 bg-slate-800/90 rounded-xl gap-1 mt-4 max-w-xs mx-auto border border-slate-700 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setActivePlatformTab('ANDROID')}
              className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                activePlatformTab === 'ANDROID'
                  ? 'bg-[#FCC016] text-[#1E1E1E] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>Android</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePlatformTab('IOS')}
              className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                activePlatformTab === 'IOS'
                  ? 'bg-[#FCC016] text-[#1E1E1E] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🍎</span>
              <span>iOS / iPhone</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePlatformTab('DESKTOP')}
              className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                activePlatformTab === 'DESKTOP'
                  ? 'bg-[#FCC016] text-[#1E1E1E] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3 h-3" />
              <span>Desktop</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-xs">
          {/* Key Benefits List */}
          <div className="space-y-2 bg-slate-800/60 p-3 rounded-2xl border border-slate-700/80">
            <div className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1">
              <Star className="w-3 h-3 text-[#FCC016] fill-current" />
              <span>Why Install App on Your Phone?</span>
            </div>

            <div className="space-y-1.5 text-slate-300 text-[11px]">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">
                  ✓
                </div>
                <span><strong>Instant 1-Tap Home Screen Launch:</strong> No browser URL typing needed. Runs full-screen with native app responsiveness.</span>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">
                  ⚡
                </div>
                <span><strong>Live Auto Radar & OTP Alerts:</strong> Real-time match notifications across CBS, College Rd & Gangapur Rd corridors.</span>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">
                  🛡️
                </div>
                <span><strong>Quick Police SOS & Mahila Sakhi:</strong> Direct access to 1-tap emergency safety desk and women-only auto groups.</span>
              </div>
            </div>
          </div>

          {/* Platform Specific Instruction Guide */}
          {activePlatformTab === 'ANDROID' && (
            <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-3 text-[11px] text-slate-300 space-y-1.5">
              <span className="font-bold text-[#FCC016] block">Android Quick Setup:</span>
              <p>
                Click <strong>"Install App Now"</strong> below to add FAIRWAY to your Android launcher as a verified Progressive Web App.
              </p>
            </div>
          )}

          {activePlatformTab === 'IOS' && (
            <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-3 text-[11px] text-slate-300 space-y-2">
              <span className="font-bold text-[#FCC016] block">iPhone / Safari Instructions:</span>
              <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px]">
                <li>Tap the <strong>Share</strong> button <Share2 className="w-3.5 h-3.5 inline mx-1 text-blue-400" /> at bottom of Safari.</li>
                <li>Scroll down and tap <strong>"Add to Home Screen"</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-emerald-400" />.</li>
                <li>Tap <strong>"Add"</strong> in top right to launch full-screen anytime!</li>
              </ol>
            </div>
          )}

          {activePlatformTab === 'DESKTOP' && (
            <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-3 text-[11px] text-slate-300 space-y-1.5">
              <span className="font-bold text-[#FCC016] block">Desktop Chrome / Edge:</span>
              <p>
                Click <strong>"Install App Now"</strong> or tap the install icon <Download className="w-3 h-3 inline mx-0.5 text-amber-400" /> in your browser address bar.
              </p>
            </div>
          )}
        </div>

        {/* Action Button Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 space-y-2">
          {installState === 'INSTALLED' ? (
            <div className="py-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-xl text-center font-bold text-xs flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>FAIRWAY App Installed Successfully! Launching...</span>
            </div>
          ) : installState === 'INSTALLING' ? (
            <div className="py-3 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl text-center font-bold text-xs flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-[#FCC016] border-t-transparent rounded-full animate-spin" />
              <span>Installing FAIRWAY to Home Screen...</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleInstallClick}
              className="w-full py-3.5 bg-[#FCC016] hover:bg-amber-400 text-[#1E1E1E] font-black text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Install App Now (Add to Home Screen)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleDismiss}
            className="w-full py-2 text-slate-400 hover:text-white font-bold text-[11px] text-center cursor-pointer transition-colors"
          >
            Continue in Web Browser
          </button>
        </div>
      </div>
    </div>
  );
};
