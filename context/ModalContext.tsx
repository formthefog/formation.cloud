'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WaitlistDialog } from '@/components/WaitlistDialog';

interface ModalContextType {
  openWaitlistModal: () => void;
  closeWaitlistModal: () => void;
  isWaitlistModalOpen: boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);

  const openWaitlistModal = () => {
    setIsWaitlistModalOpen(true);
  };

  const closeWaitlistModal = () => {
    setIsWaitlistModalOpen(false);
  };

  return (
    <ModalContext.Provider
      value={{
        openWaitlistModal,
        closeWaitlistModal,
        isWaitlistModalOpen
      }}
    >
      {children}
      <WaitlistDialog
        isOpen={isWaitlistModalOpen}
        onOpenChange={setIsWaitlistModalOpen}
      />
    </ModalContext.Provider>
  );
}
