import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { User, WalletState } from '../types';
import { getConfigurationStatus } from '../config/blockchain';
import { databaseService } from '../services/database';

interface AuthContextType {
  walletState: WalletState;
  user: User | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
  isAuthenticated: boolean;
  isConnecting: boolean;
  connectionError: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount();
  const { connect, connectors, error: connectError, isLoading } = useConnect();
  const { disconnect } = useDisconnect();

  // Disable ENS lookups to prevent errors (they're optional features)
  const ensName = null;
  const ensAvatar = null;

  const [user, setUser] = useState<User | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Log configuration status on mount
  useEffect(() => {
    const config = getConfigurationStatus();
    console.log('🔧 SoulCred Configuration Status:', {
      walletConnect: config.walletConnect ? '✅ Configured' : '❌ Not configured (using basic connectors)',
      alchemy: config.alchemy ? '✅ Configured' : '❌ Not configured (using public RPC)',
      infura: config.infura ? '✅ Configured' : '❌ Not configured (using public RPC)',
      pinata: config.pinata ? '✅ Configured' : '❌ Not configured',
      environment: config.environment,
    });
    
    console.log('🔌 Available connectors:', connectors.map(c => ({ 
      name: c.name, 
      ready: c.ready,
      id: c.id 
    })));

    // Test MetaMask detection
    console.log('🦊 MetaMask detection:', {
      windowEthereum: !!window.ethereum,
      isMetaMask: !!(window.ethereum as any)?.isMetaMask,
      provider: window.ethereum ? 'Available' : 'Not found'
    });
  }, [connectors]);

  // Create wallet state
  const walletState: WalletState = {
    isConnected,
    address: address || null,
    isConnecting: isConnecting || isLoading || isReconnecting,
    error: connectError?.message || connectionError,
  };

  // Clear error function
  const clearError = () => {
    setConnectionError(null);
  };

  // Enhanced connect wallet function
  const connectWallet = () => {
    setConnectionError(null);
    
    try {
      console.log('🚀 Attempting wallet connection...');
      console.log('🔌 Available connectors:', connectors.map(c => ({ 
        name: c.name, 
        ready: c.ready,
        id: c.id 
      })));
      
      // Find the best available connector
      const metaMaskConnector = connectors.find(c => 
        c.name.toLowerCase().includes('metamask') && c.ready
      );
      const injectedConnector = connectors.find(c => 
        (c.name.toLowerCase().includes('injected') || c.name.toLowerCase().includes('browser')) && c.ready
      );
      const anyReadyConnector = connectors.find(c => c.ready);
      
      const connector = metaMaskConnector || injectedConnector || anyReadyConnector;
      
      if (!connector) {
        console.error('❌ No wallet connector available');
        setConnectionError('No wallet connector available. Please install MetaMask or another Web3 wallet.');
        return;
      }

      console.log('🚀 Connecting with:', {
        name: connector.name,
        id: connector.id,
        ready: connector.ready
      });

      // Attempt connection
      connect({ connector });
    } catch (error) {
      console.error('❌ Connection error:', error);
      setConnectionError(error instanceof Error ? error.message : 'Failed to connect wallet');
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    try {
      disconnect();
      setUser(null);
      setConnectionError(null);
      console.log('👋 Wallet disconnected successfully');
    } catch (error) {
      console.error('❌ Disconnect error:', error);
    }
  };

  // Generate user profile when wallet connects and sync with Supabase
  useEffect(() => {
    const initializeUser = async () => {
      if (isConnected && address) {
        console.log('✅ Wallet connected:', address);

        try {
          // Try to fetch existing profile from Supabase
          let profile = await databaseService.getUserProfile(address);

          if (profile) {
            // Convert database profile to User type
            const existingUser: User = {
              id: profile.id || address,
              address: profile.wallet_address,
              name: profile.display_name || `User ${address.slice(0, 6)}...${address.slice(-4)}`,
              bio: profile.bio || 'Web3 learner passionate about decentralized technologies and continuous education.',
              avatar: profile.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${address}&backgroundColor=8b5cf6`,
              skills: profile.skills || ['Web3', 'Blockchain', 'Learning'],
              location: profile.location || 'Decentralized Web',
              joinedDate: profile.created_at || new Date().toISOString(),
              totalCredentials: profile.total_credentials || 0,
              endorsements: profile.total_endorsements || 0,
              reputation: profile.reputation || 100,
            };

            setUser(existingUser);
            console.log('👤 Loaded existing user profile from database');
          } else {
            // Create new profile in database
            const newProfile = {
              wallet_address: address,
              display_name: ensName || `User ${address.slice(0, 6)}...${address.slice(-4)}`,
              bio: 'Web3 learner passionate about decentralized technologies and continuous education.',
              avatar_url: ensAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${address}&backgroundColor=8b5cf6`,
              skills: ['Web3', 'Blockchain', 'Learning'],
              location: 'Decentralized Web',
              reputation: 100,
              total_credentials: 0,
              total_endorsements: 0,
            };

            const createdProfile = await databaseService.createUserProfile(newProfile);

            if (createdProfile) {
              const newUser: User = {
                id: createdProfile.id || address,
                address: createdProfile.wallet_address,
                name: createdProfile.display_name || `User ${address.slice(0, 6)}...${address.slice(-4)}`,
                bio: createdProfile.bio || 'Web3 learner passionate about decentralized technologies and continuous education.',
                avatar: createdProfile.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${address}&backgroundColor=8b5cf6`,
                skills: createdProfile.skills || ['Web3', 'Blockchain', 'Learning'],
                location: createdProfile.location || 'Decentralized Web',
                joinedDate: createdProfile.created_at || new Date().toISOString(),
                totalCredentials: createdProfile.total_credentials || 0,
                endorsements: createdProfile.total_endorsements || 0,
                reputation: createdProfile.reputation || 100,
              };

              setUser(newUser);
              console.log('🎉 Created new user profile in database');
            }
          }
        } catch (error) {
          console.error('❌ Error initializing user profile:', error);

          // Fallback to local profile creation
          const fallbackUser: User = {
            id: address,
            address,
            name: ensName || `User ${address.slice(0, 6)}...${address.slice(-4)}`,
            bio: 'Web3 learner passionate about decentralized technologies and continuous education.',
            avatar: ensAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${address}&backgroundColor=8b5cf6`,
            skills: ['Web3', 'Blockchain', 'Learning'],
            location: 'Decentralized Web',
            joinedDate: new Date().toISOString(),
            totalCredentials: 0,
            endorsements: 0,
            reputation: 100,
          };

          setUser(fallbackUser);
          console.log('⚠️ Using fallback user profile');
        }
      } else if (!isConnected) {
        setUser(null);
      }
    };

    initializeUser();
  }, [isConnected, address, ensName, ensAvatar]);

  // Handle connection errors with better messaging
  useEffect(() => {
    if (connectError) {
      console.error('❌ Connect error:', connectError);
      let errorMessage = connectError.message;
      
      // Provide more user-friendly error messages
      if (errorMessage.includes('User rejected') || errorMessage.includes('User denied')) {
        errorMessage = 'Connection was cancelled. Please try again and approve the connection.';
      } else if (errorMessage.includes('No provider') || errorMessage.includes('window.ethereum')) {
        errorMessage = 'No wallet found. Please install MetaMask or another Web3 wallet.';
      } else if (errorMessage.includes('Already processing')) {
        errorMessage = 'Connection already in progress. Please wait.';
      } else if (errorMessage.includes('Chain not configured')) {
        errorMessage = 'Please switch to a supported network (Sepolia, Goerli, or Polygon Mumbai).';
      } else if (errorMessage.includes('Connector not found')) {
        errorMessage = 'Wallet connector not available. Please try refreshing the page.';
      } else if (errorMessage.includes('extension not found')) {
        errorMessage = 'Wallet extension not detected. Please install MetaMask or enable your wallet extension.';
      }
      
      setConnectionError(errorMessage);
    }
  }, [connectError]);

  // Clear error when connection is successful
  useEffect(() => {
    if (isConnected) {
      setConnectionError(null);
    }
  }, [isConnected]);

  const value = {
    walletState,
    user,
    connectWallet,
    disconnectWallet,
    isAuthenticated: isConnected && user !== null,
    isConnecting: isConnecting || isLoading || isReconnecting,
    connectionError,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};