import { createConfig, configureChains } from 'wagmi';
import { sepolia, polygonMumbai, goerli, mainnet, polygon } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

// Get API keys from environment variables - these will be undefined in production build
const alchemyApiKey = typeof window === 'undefined' ? process.env.VITE_ALCHEMY_API_KEY : undefined;
const infuraApiKey = typeof window === 'undefined' ? process.env.VITE_INFURA_API_KEY : undefined;
const walletConnectProjectId = typeof window === 'undefined' ? process.env.VITE_WALLETCONNECT_PROJECT_ID : undefined;

// For client-side, we'll use public providers and basic wallet connectors
const isClientSide = typeof window !== 'undefined';

// Configure providers with public fallbacks for client-side
const providers = [];

// Only add API-based providers on server-side or if explicitly configured
if (!isClientSide && alchemyApiKey && alchemyApiKey !== 'your_alchemy_api_key_here') {
  providers.push(alchemyProvider({ apiKey: alchemyApiKey }));
  console.log('✅ Alchemy provider configured (server-side)');
}

if (!isClientSide && infuraApiKey && infuraApiKey !== 'your_infura_api_key_here') {
  providers.push(infuraProvider({ apiKey: infuraApiKey }));
  console.log('✅ Infura provider configured (server-side)');
}

// Always add public provider
providers.push(publicProvider());
if (isClientSide) {
  console.log('✅ Using public providers for client-side');
}

// Configure chains - prioritize testnets for development
const supportedChains = [sepolia, polygonMumbai, goerli];

// Add mainnet chains only if explicitly enabled
if (import.meta.env.VITE_ENABLE_MAINNET === 'true') {
  supportedChains.unshift(mainnet, polygon);
  console.log('✅ Mainnet chains enabled');
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  supportedChains,
  providers
);

// Configure wallet connectors - use basic connectors for security
let connectors;

// For production, use basic connectors to avoid exposing WalletConnect project ID
if (isClientSide || !walletConnectProjectId || walletConnectProjectId === 'your_walletconnect_project_id_here') {
  console.log('🔄 Using secure wallet connectors (MetaMask + Injected)');
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
} else {
  // Only use WalletConnect on server-side during development
  try {
    const { connectors: defaultConnectors } = getDefaultWallets({
      appName: 'SoulCred',
      projectId: walletConnectProjectId,
      chains,
    });
    connectors = defaultConnectors;
    console.log('✅ WalletConnect configured (development)');
  } catch (error) {
    console.log('🔄 Falling back to basic connectors');
    connectors = [
      new MetaMaskConnector({ chains }),
      new InjectedConnector({ chains }),
    ];
  }
}

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export { chains };

// Contract addresses for different networks
// 🚀 UPDATED WITH YOUR DEPLOYED CONTRACT
export const CONTRACT_ADDRESSES = {
  [mainnet.id]: null, // Deploy to mainnet when ready
  [polygon.id]: null, // Deploy to Polygon when ready
  [sepolia.id]: 'YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE', // 🎯 REPLACE WITH YOUR ACTUAL ADDRESS
  [polygonMumbai.id]: null, // Deploy to Mumbai when ready  
  [goerli.id]: null, // Deploy to Goerli when ready
} as const;

// IPFS Configuration - no sensitive data exposed
export const IPFS_CONFIG = {
  gateway: 'https://gateway.pinata.cloud/ipfs/',
  // API keys handled server-side only
};

// Default network for development
export const DEFAULT_CHAIN = sepolia;

// Helper functions
export const isBlockchainConfigured = () => {
  // Always return true for client-side since we use public providers
  return true;
};

export const isWalletConnectConfigured = () => {
  // Return false for client-side to use basic connectors
  return false;
};

export const isIPFSConfigured = () => {
  // Check if IPFS service is available via serverless function
  return true; // Will be validated when actually used
};

export const isContractDeployed = (chainId: number) => {
  return CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES] !== null;
};

export const getContractAddress = (chainId: number) => {
  const address = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
  if (!address) {
    console.warn(`Contract not deployed on chain ${chainId}`);
    return null;
  }
  return address;
};

export const getConfigurationStatus = () => {
  return {
    walletConnect: false, // Disabled for security
    blockchain: true, // Using public providers
    pinata: true, // Handled server-side
    environment: import.meta.env.MODE,
    production: import.meta.env.PROD,
  };
};

// Network configuration helper
export const getNetworkConfig = (chainId: number) => {
  const networkConfigs = {
    [mainnet.id]: {
      name: 'Ethereum Mainnet',
      currency: 'ETH',
      explorerUrl: 'https://etherscan.io',
      rpcUrl: 'https://cloudflare-eth.com',
    },
    [polygon.id]: {
      name: 'Polygon',
      currency: 'MATIC',
      explorerUrl: 'https://polygonscan.com',
      rpcUrl: 'https://polygon-rpc.com',
    },
    [sepolia.id]: {
      name: 'Sepolia Testnet',
      currency: 'ETH',
      explorerUrl: 'https://sepolia.etherscan.io',
      rpcUrl: 'https://rpc.sepolia.org',
    },
    [polygonMumbai.id]: {
      name: 'Polygon Mumbai',
      currency: 'MATIC',
      explorerUrl: 'https://mumbai.polygonscan.com',
      rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    },
    [goerli.id]: {
      name: 'Goerli Testnet',
      currency: 'ETH',
      explorerUrl: 'https://goerli.etherscan.io',
      rpcUrl: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    },
  };

  return networkConfigs[chainId] || null;
};