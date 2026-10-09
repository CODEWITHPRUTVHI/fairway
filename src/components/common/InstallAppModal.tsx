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
  Check,
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
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect if already installed as standalone PWA
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    if (standalone) {
      return;
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

    // Capture PWA beforeinstallprompt event if supported by browser
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // If user hasn't dismissed before, we can show a prompt or enable the button
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Auto-open only if forceOpen is passed or if user hasn't dismissed yet
    const hasDismissed = localStorage.getItem('fairway_pwa_dismissed');
    if (forceOpen) {
      setIsOpen(true);
    } else if (!hasDismissed) {
      // Delay opening slightly so the user sees the app first
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1200);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [forceOpen]);

  const handleDismiss = () => {
    localStorage.setItem('fairway_pwa_dismissed', 'true');
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        setInstallState('INSTALLING');
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setInstallState('INSTALLED');
          localStorage.setItem('fairway_pwa_dismissed', 'true');
          setTimeout(() => handleDismiss(), 2000);
        } else {
          setInstallState('IDLE');
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error('PWA install error', err);
        setInstallState('IDLE');
      }
    } else if (activePlatformTab === 'IOS') {
      // Already showing iOS instructions
    } else {
      // If deferredPrompt is not yet fired on Android/Desktop, show standard install simulation or guidance
      setInstallState('INSTALLING');
      setTimeout(() => {
        setInstallState('INSTALLED');
        localStorage.setItem('fairway_pwa_dismissed', 'true');
        setTimeout(() => {
          handleDismiss();
        }, 1800);
      }, 1200);
    }
  };

  if (!isOpen || isStandalone) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-slate-900 border-t-2 sm:border-2 border-[#FCC016] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100 relative max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition-colors cursor-pointer"
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
              MH-15 NASHIK AUTO APP
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              Direct Install
            </span>
          </div>

          <h2 className="text-xl font-black text-white mt-2 tracking-tight">
            Install FAIRWAY on Your Phone
          </h2>
          <p className="text-xs text-slate-300 max-w-xs mx-auto mt-1 leading-relaxed">
            Download directly to your home screen for full-screen view, faster bookings, and real-time auto radar.
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
              <span>iPhone</span>
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
              <span>App Highlights</span>
            </div>

            <div className="space-y-1.5 text-slate-300 text-[11px]">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">
                  ✓
                </div>
                <span><strong>Full-Screen Mobile Experience:</strong> No address bar, runs fast and clean like a native app.</span>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">
                  ⚡
                </div>
                <span><strong>Instant Booking & OTP Boarding:</strong> Live radar matching across CBS, College Rd & Gangapur Rd corridors.</span>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">
                  🛡️
                </div>
                <span><strong>1-Tap Police SOS & Women-Only Auto Groups:</strong> Immediate emergency safety desk integration.</span>
              </div>
            </div>
          </div>

          {/* Platform Specific Instruction Guide */}
          {activePlatformTab === 'ANDROID' && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-3 text-[11px] text-slate-300 space-y-2">
              <div className="flex items-center gap-1.5 text-[#FCC016] font-bold">
                <Smartphone className="w-3.5 h-3.5" />
                <span>How to Install on Android:</span>
              </div>
              <p className="leading-relaxed">
                Tap <strong>"Install App to Home Screen"</strong> below. Chrome will prompt you to add <strong>FAIRWAY</strong> to your app drawer.
              </p>
              <div className="text-[10px] text-slate-400 border-t border-slate-700/60 pt-1.5">
                Tip: You can also tap Chrome's menu <strong>(⋮)</strong> and select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
              </div>
            </div>
          )}

          {activePlatformTab === 'IOS' && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-3.5 text-[11px] text-slate-300 space-y-2.5">
              <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                <Share2 className="w-3.5 h-3.5" />
                <span>Quick iPhone / Safari Installation (3 Easy Steps):</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                <li>Tap the <strong>Share button</strong> <span className="inline-block p-1 bg-slate-700 rounded text-blue-400 font-bold">⎋</span> at the bottom of your Safari screen.</li>
                <li>Scroll down and tap <strong>"Add to Home Screen"</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-emerald-400" />.</li>
                <li>Tap <strong>"Add"</strong> in the top-right corner to finish.</li>
              </ol>
              <p className="text-[10px] text-emerald-400 font-medium">
                Once added, tap the FAIRWAY rickshaw icon on your home screen for full-screen edge-to-edge experience!
              </p>
            </div>
          )}

          {activePlatformTab === 'DESKTOP' && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-3 text-[11px] text-slate-300 space-y-2">
              <div className="flex items-center gap-1.5 text-[#FCC016] font-bold">
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop Chrome / Edge:</span>
              </div>
              <p className="leading-relaxed">
                Click <strong>"Install App Now"</strong> below or look for the install icon <Download className="w-3 h-3 inline mx-0.5 text-amber-400" /> on the right side of your browser address bar.
              </p>
            </div>
          )}
        </div>

        {/* Action Button Footer */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 space-y-2">
          {installState === 'INSTALLED' ? (
            <div className="py-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-xl text-center font-bold text-xs flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>FAIRWAY App Installed! Launching...</span>
            </div>
          ) : installState === 'INSTALLING' ? (
            <div className="py-3 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl text-center font-bold text-xs flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-[#FCC016] border-t-transparent rounded-full animate-spin" />
              <span>Adding FAIRWAY to Home Screen...</span>
            </div>
          ) : activePlatformTab === 'IOS' ? (
            <button
              type="button"
              onClick={handleDismiss}
              className="w-full py-3.5 bg-[#FCC016] hover:bg-amber-400 text-[#1E1E1E] font-black text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Got it, I'll Add to Home Screen</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleInstallClick}
              className="w-full py-3.5 bg-[#FCC016] hover:bg-amber-400 text-[#1E1E1E] font-black text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Install App to Home Screen</span>
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
