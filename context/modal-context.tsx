'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import Modal from '@/components/WhitelistModal';
import WhitelistForm from '@/components/WhitelistForm';

type ModalContextType = {
  openWhitelistModal: () => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isThankYouVisible, setIsThankYouVisible] = useState(false);

  const openWhitelistModal = () => {
    setIsModalOpen(true);
    setIsThankYouVisible(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsThankYouVisible(false);
  };

  const handleFormSuccess = () => {
    setIsThankYouVisible(true);
    // Close modal after 3 seconds of showing the thank you message
    setTimeout(() => {
      closeModal();
    }, 3000);
  };

  return (
    <ModalContext.Provider value={{ openWhitelistModal, closeModal }
    }>
      {children}

      < Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        title={isThankYouVisible ? "Thank You!" : "Join the Formation Waitlist"}
      >
        {
          isThankYouVisible ? (
            <div className="text-center py-6" >
              <p className="text-green-600 text-lg font-medium mb-2">
                You've been added to our waitlist!
              </p>
              < p className="text-gray-600" >
                We'll notify you when Formation is ready for you.
              </p>
            </div>
          ) : (
            <WhitelistForm onSuccess={handleFormSuccess} />
          )}
      </Modal>
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
