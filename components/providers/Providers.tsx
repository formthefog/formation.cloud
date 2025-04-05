'use client';

import { ReactNode } from 'react';
import { DynamicAuthProvider } from './DynamicAuthProvider';
import { ModalProvider } from '@/context/ModalContext';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <DynamicAuthProvider>
      {children}
    </DynamicAuthProvider>
  );
} 