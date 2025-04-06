'use client';

import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
        walletConnectors: [EthereumWalletConnectors],
        displaySiweStatement: true,
        storageKey: 'formation.cloud.auth',
        appName: 'Formation',
        appLogoUrl: '/logo.png',
        appWebsiteUrl: process.env.NEXT_PUBLIC_APP_URL,
      }}
    >
      {children}
    </DynamicContextProvider>
  );
} 