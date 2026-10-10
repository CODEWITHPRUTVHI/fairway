/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DeviceFrame, CleanAppContainer } from './components/common/DeviceFrame';
import { CustomerApp } from './components/customer/CustomerApp';
import { DriverApp } from './components/driver/DriverApp';
import { OperationsConsole } from './components/admin/OperationsConsole';
import { VerificationRunner } from './components/test/VerificationRunner';
import { AuthScreen } from './components/auth/AuthScreen';
import { SplashScreen } from './components/common/SplashScreen';
import { useFairwayStore } from './services/store';

export default function App() {
  const { state } = useFairwayStore();
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <MainAppContent state={state} />
    </>
  );
}

function MainAppContent({ state }: { state: any }) {

  if (state.viewportMode === 'DUAL_SIMULATOR') {
    return (
      <DeviceFrame>
        <div className="flex flex-col xl:flex-row items-center justify-center gap-6 py-2 px-1 w-full max-w-7xl mx-auto animate-in fade-in">
          {/* Left App: Passenger */}
          <div className="flex flex-col items-center">
            <div className="mb-2.5 flex items-center gap-2 bg-slate-900/90 px-3.5 py-1.5 rounded-full border border-slate-800 shadow-sm text-xs font-black text-amber-300">
              <span className="w-2 h-2 rounded-full bg-[#FCC016] animate-pulse" />
              <span>PASSENGER APP (POOJA SHARMA)</span>
              <span className="text-[10px] bg-amber-400/20 text-[#FCC016] px-1.5 py-0.5 rounded font-mono font-medium">MH-15 RIDER</span>
            </div>
            <CleanAppContainer>
              {state.isCustomerAuthenticated ? <CustomerApp /> : <AuthScreen initialRole="CUSTOMER" />}
            </CleanAppContainer>
          </div>

          {/* Right App: Driver */}
          <div className="flex flex-col items-center">
            <div className="mb-2.5 flex items-center gap-2 bg-slate-900/90 px-3.5 py-1.5 rounded-full border border-slate-800 shadow-sm text-xs font-black text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>AUTO DRIVER APP (RAMESH SHINDE KAKA)</span>
              <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-medium">MH-15 EF 4321</span>
            </div>
            <CleanAppContainer>
              {state.isDriverAuthenticated ? <DriverApp /> : <AuthScreen initialRole="DRIVER" />}
            </CleanAppContainer>
          </div>
        </div>
      </DeviceFrame>
    );
  }

  return (
    <DeviceFrame>
      {state.currentRole === 'CUSTOMER' && (
        state.isCustomerAuthenticated ? <CustomerApp /> : <AuthScreen initialRole="CUSTOMER" />
      )}
      {state.currentRole === 'DRIVER' && (
        state.isDriverAuthenticated ? <DriverApp /> : <AuthScreen initialRole="DRIVER" />
      )}
      {state.currentRole === 'ADMIN' && (
        state.isAdminAuthenticated ? <OperationsConsole /> : <AuthScreen initialRole="ADMIN" />
      )}
      {state.currentRole === 'TESTS' && <VerificationRunner />}
    </DeviceFrame>
  );
}
