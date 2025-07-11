"use client";

import { WaitlistDialog } from "@/components/WaitlistDialog";
import React, { createContext, useContext, useState, ReactNode } from "react";

type ModalContextType = {
  openWaitlistModal: () => void;
  closeWaitlistModal: () => void;
  isWaitlistModalOpen: boolean;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
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
        isWaitlistModalOpen,
      }}
    >
      {children}
      <WaitlistDialog
        isOpen={isWaitlistModalOpen}
        onOpenChange={setIsWaitlistModalOpen}
        buttonText="Join the Waitlist"
        trigger={<></>}
      />
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
