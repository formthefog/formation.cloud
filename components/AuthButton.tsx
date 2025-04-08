'use client';

import { 
  useDynamicContext,
  useIsLoggedIn,
  useDynamicEvents,
  useUserWallets,
  useDynamicModals,
  useRefreshUser
} from '@dynamic-labs/sdk-react-core';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function AuthButton() {
  const router = useRouter();
  const { 
    primaryWallet, 
    handleLogOut, 
    setShowAuthFlow,
    sdkHasLoaded,
    user
  } = useDynamicContext();

  const isLoggedIn = useIsLoggedIn();
  const userWallets = useUserWallets();
  const { setShowLinkNewWalletModal } = useDynamicModals();
  const refreshUser = useRefreshUser();
  const [isHovered, setIsHovered] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSignOutHovered, setIsSignOutHovered] = useState(false);

  console.log('Dynamic SDK State:', {
    sdkHasLoaded,
    primaryWallet,
    user,
    isLoggedIn
  });

  // Subscribe to auth events
  useDynamicEvents('logout', () => {
    toast.info('Successfully logged out');
  });

  useDynamicEvents('authInit', (method) => {
    toast.info(`Authenticating with ${method}...`);
  });

  // Handle auth failures
  useDynamicEvents('authFailure', () => {
    toast.error('Authentication failed');
  });

  useDynamicEvents('walletAdded', () => {
    toast.success('New wallet connected!');
  });

  // Refresh user data periodically
  useEffect(() => {
    if (isLoggedIn) {
      const interval = setInterval(async () => {
        try {
          setIsRefreshing(true);
          await refreshUser();
        } catch (error) {
          console.error('Failed to refresh user:', error);
        } finally {
          setIsRefreshing(false);
        }
      }, 60000); // Refresh every minute

      return () => clearInterval(interval);
    }
  }, [isLoggedIn, refreshUser]);

  const handleProfileClick = () => {
    if (primaryWallet) {
      router.push('/marketplace/settings');
    } else {
      setShowAuthFlow(true);
    }
  };

  const handleSignOutClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (primaryWallet) {
      await handleLogOut();
    }
  };

  if (!sdkHasLoaded) {
    return (
      <div className="flex items-center">
        <Button
          variant="outline"
          className="relative overflow-hidden bg-white/50 backdrop-blur-sm border-gray-200/60"
          disabled
        >
          <div className="absolute inset-0 bg-[#0A84FF]/10 animate-pulse" />
          <span className="relative text-gray-600">Loading...</span>
        </Button>
      </div>
    );
  }

  // Mobile version of the button
  const MobileButton = () => (
    <div
      onClick={handleProfileClick}
      className={`
        md:hidden relative overflow-hidden transition-all duration-300 cursor-pointer
        ${primaryWallet 
          ? 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200/60 shadow-sm hover:border-gray-300'
          : 'bg-gradient-to-r from-[#0A84FF]/10 to-blue-500/10 hover:from-[#0A84FF]/15 hover:to-blue-500/15 backdrop-blur-md border border-white/20 text-white shadow-lg hover:shadow-[#0A84FF]/20 ring-1 ring-[#0A84FF]/20'
        }
        inline-flex items-center rounded-xl
      `}
    >
      {primaryWallet ? (
        <div className="flex items-center">
          <div className="px-2 py-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium text-sm shadow-inner">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
          {isSignOutHovered && (
            <div
              onClick={handleSignOutClick}
              className="px-2 py-2 text-red-500"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                />
              </svg>
            </div>
          )}
        </div>
      ) : (
        <div className="px-3 py-2 flex items-center gap-2">
          <span className="font-medium text-sm text-[#0A84FF]">Get Early Access</span>
          <svg 
            className="w-4 h-4 text-[#0A84FF]" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" 
            />
          </svg>
        </div>
      )}
    </div>
  );

  // Desktop version of the button
  const DesktopButton = () => (
    <div
      onClick={handleProfileClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        hidden md:inline-flex relative overflow-hidden transition-all duration-300 cursor-pointer
        ${primaryWallet 
          ? 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200/60 shadow-sm hover:border-gray-300'
          : `
            bg-gradient-to-r from-[#0A84FF]/10 to-blue-500/10 
            hover:from-[#0A84FF]/15 hover:to-blue-500/15 
            backdrop-blur-md border border-white/20 
            text-[#0A84FF] shadow-lg hover:shadow-[#0A84FF]/20 
            ring-1 ring-[#0A84FF]/20 group
            after:absolute after:inset-0 
            after:bg-gradient-to-r after:from-white/5 after:to-[#0A84FF]/5
            after:opacity-0 after:transition-opacity after:duration-300
            hover:after:opacity-100
          `
        }
        items-center rounded-lg text-sm font-medium
      `}
    >
      <motion.div
        animate={{
          scale: isRefreshing ? 0.95 : 1,
        }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-2.5 px-4 py-2.5 z-10"
      >
        {primaryWallet ? (
          <>
            <div className="h-7 w-7 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium text-sm shadow-inner">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-medium">
                {user?.email?.split('@')[0] || 'Account'}
              </span>
              <span className="text-xs bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                PRO
              </span>
            </div>
          </>
        ) : (
          <>
            <span className="font-medium">Get Early Access</span>
            <motion.div
              animate={{ x: isHovered ? 2 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg 
                className="w-4 h-4 ml-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" 
                />
              </svg>
            </motion.div>
          </>
        )}
      </motion.div>
      {primaryWallet && (
        <div
          onClick={handleSignOutClick}
          onMouseEnter={() => setIsSignOutHovered(true)}
          onMouseLeave={() => setIsSignOutHovered(false)}
          className={`
            px-3.5 py-2.5 border-l border-gray-200/60 transition-colors duration-300
            ${isSignOutHovered ? 'bg-red-50 text-red-500 border-l-red-100' : 'text-gray-400 hover:text-gray-500'}
          `}
        >
          <svg 
            className="w-[18px] h-[18px]" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
            />
          </svg>
        </div>
      )}
      {isRefreshing && (
        <div className="absolute inset-0 bg-black/5 animate-pulse" />
      )}
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        <div 
          className="absolute inset-0 bg-gradient-to-r from-[#0A84FF]/10 to-blue-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
        />
        <MobileButton />
        <DesktopButton />
      </motion.div>
    </AnimatePresence>
  );
} 