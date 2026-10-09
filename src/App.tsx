/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DeviceFrame } from './components/common/DeviceFrame';
import { CustomerApp } from './components/customer/CustomerApp';
import { DriverApp } from './components/driver/DriverApp';
import { OperationsConsole } from './components/admin/OperationsConsole';
import { VerificationRunner } from './components/test/VerificationRunner';
import { AuthScreen } from './components/auth/AuthScreen';
import { useFairwayStore } from './services/store';

export default function App() {
  const { state } = useFairwayStore();

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
