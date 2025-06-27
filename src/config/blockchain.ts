import { createConfig, configureChains } from 'wagmi';
import { sepolia, polygonMumbai, goerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

// Get API keys from environment variables with proper fallbacks
const alchemyApiKey = import.meta.env.VITE_ALCHEMY_API_KEY;
const infuraApiKey = import.meta.env.VITE_INFURA_API_KEY;
const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

// Configure providers with fallbacks
const providers = [];

// Add Alchemy provider if available
if (alchemyApiKey && alchemyApiKey !== 'your_alchemy_api_key_here' && alchemyApiKey.length > 0) {
  providers.push(alchemyProvider({ apiKey: alchemyApiKey }));
}

// Add Infura provider if available
if (infuraApiKey && infuraApiKey !== 'your_infura_api_key_here' && infuraApiKey.length > 0) {
  providers.push(infuraProvider({ apiKey: infuraApiKey }));
}

// Always add public provider as fallback
providers.push(publicProvider());

// Configure chains with available providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia, polygonMumbai, goerli],
  providers
);

// Configure wallet connectors with improved error handling
let connectors;
let walletConnectConfigured = false;

try {
  // More robust WalletConnect validation
  const isWalletConnectValid = walletConnectProjectId && 
    walletConnectProjectId !== 'your_walletconnect_project_id_here' &&
    walletConnectProjectId !== 'demo' &&
    walletConnectProjectId !== '' &&
    walletConnectProjectId.length >= 32; // WalletConnect project IDs are 32+ characters

  if (isWalletConnectValid) {
    console.log('✅ WalletConnect configured with project ID:', walletConnectProjectId.slice(0, 8) + '...');
    const { connectors: defaultConnectors } = getDefaultWallets({
      appName: 'SoulCred',
      projectId: walletConnectProjectId,
      chains,
    });
    connectors = defaultConnectors;
    walletConnectConfigured = true;
  } else {
    console.warn('⚠️ WalletConnect not properly configured. Using fallback connectors.');
    console.log('📝 To enable WalletConnect, set VITE_WALLETCONNECT_PROJECT_ID to a valid project ID from https://cloud.walletconnect.com');
    throw new Error('WalletConnect not configured');
  }
} catch (error) {
  console.log('🔄 Using fallback wallet connectors (MetaMask + Injected)');
  // Fallback to basic connectors that don't require external services
  connectors = [
    new MetaMaskConnector({ 
      chains,
      options: {
        shimDisconnect: true,
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Browser Wallet',
        shimDisconnect: true,
      },
    }),
  ];
  walletConnectConfigured = false;
}

export const wagmiConfig = createConfig({
  autoConnect: true, // Enable auto-connect for better UX
  connectors,
  publicClient,
  webSocketPublicClient,
});

export { chains };

// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  [sepolia.id]: null,  // Set to actual address after deployment
  [polygonMumbai.id]: null, // Set to actual address after deployment
  [goerli.id]: null, // Set to actual address after deployment
} as const;

// IPFS Configuration
export const IPFS_CONFIG = {
  pinataApiKey: import.meta.env.VITE_PINATA_API_KEY,
  pinataSecretKey: import.meta.env.VITE_PINATA_SECRET_KEY,
  pinataJWT: import.meta.env.VITE_PINATA_JWT,
  gateway: 'https://gateway.pinata.cloud/ipfs/',
};

// Default network for development
export const DEFAULT_CHAIN = sepolia;

// Helper function to check if blockchain services are properly configured
export const isBlockchainConfigured = () => {
  return !!(
    (alchemyApiKey && alchemyApiKey !== 'your_alchemy_api_key_here') ||
    (infuraApiKey && infuraApiKey !== 'your_infura_api_key_here')
  );
};

// Helper function to check if WalletConnect is configured
export const isWalletConnectConfigured = () => {
  return walletConnectConfigured;
};

// Helper function to check if contracts are deployed
export const isContractDeployed = (chainId: number) => {
  return CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES] !== null;
};

// Helper function to get contract address safely
export const getContractAddress = (chainId: number) => {
  const address = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
  if (!address) {
    console.warn(`Contract not deployed on chain ${chainId}`);
    return null;
  }
  return address;
};

// Debug function to check configuration status
export const getConfigurationStatus = () => {
  return {
    walletConnect: walletConnectConfigured,
    alchemy: !!(alchemyApiKey && alchemyApiKey !== 'your_alchemy_api_key_here'),
    infura: !!(infuraApiKey && infuraApiKey !== 'your_infura_api_key_here'),
    pinata: !!(IPFS_CONFIG.pinataJWT && IPFS_CONFIG.pinataJWT !== 'your_pinata_jwt_here'),
  };
};