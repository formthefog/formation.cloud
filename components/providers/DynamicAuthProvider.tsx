'use client';

import { ReactNode } from 'react';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { DynamicAuthService } from '@/lib/services/dynamicAuth';

interface DynamicAuthProviderProps {
  children: ReactNode;
}

export function DynamicAuthProvider({ children }: DynamicAuthProviderProps) {
  const authService = DynamicAuthService.getInstance();

  const settings = {
    environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
    eventsCallbacks: {
      onAuthSuccess: async (user: any) => {
        try {
          await authService.handleAuthSuccess(user);
        } catch (error) {
          console.error('Auth success callback failed:', error);
        }
      },
      onAuthError: async (error: any) => {
        try {
          await authService.handleAuthError(error);
        } catch (err) {
          console.error('Auth error callback failed:', err);
        }
      },
      onLogout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout callback failed:', error);
        }
      },
    },
    // Third-party JWT configuration
    jwtAuth: {
      isEnabled: true,
      issuer: process.env.NEXT_PUBLIC_JWT_ISSUER!,
      jwksUri: process.env.NEXT_PUBLIC_JWKS_URL!,
      audience: process.env.NEXT_PUBLIC_JWT_AUDIENCE!,
      cookieName: process.env.JWT_COOKIE_NAME || 'formation_auth_token'
    },
    // Enable all authentication methods
    socialLoginConnectors: [
      'google',
      'github',
      'discord',
      'twitter',
      'email',
      'apple',
      'facebook',
      'linkedin'
    ],
    walletConnectorsPriority: [
      'metamask',
      'walletconnect',
      'coinbase',
      'phantom',
      'rainbow',
      'trust',
      'zerion',
      'backpack',
      'glow',
      'solflare'
    ],
    displayMode: 'navigation'
  };

  return (
    <DynamicContextProvider settings={settings}>
      {children}
    </DynamicContextProvider>
  );
} 