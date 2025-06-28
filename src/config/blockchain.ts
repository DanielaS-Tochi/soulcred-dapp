import { createConfig, configureChains } from 'wagmi';
import { sepolia, polygonMumbai, goerli, mainnet, polygon } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

// Get API keys from environment variables with proper validation
const alchemyApiKey = import.meta.env.VITE_ALCHEMY_API_KEY;
const infuraApiKey = import.meta.env.VITE_INFURA_API_KEY;
const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

// Validate API keys
const isValidApiKey = (key: string | undefined): boolean => {
  return !!(key && 
    key !== 'your_alchemy_api_key_here' && 
    key !== 'your_infura_api_key_here' && 
    key !== 'demo' && 
    key !== '' && 
    key.length > 10);
};

// Configure providers with fallbacks
const providers = [];

// Add Alchemy provider if available
if (isValidApiKey(alchemyApiKey)) {
  providers.push(alchemyProvider({ apiKey: alchemyApiKey }));
  console.log('✅ Alchemy provider configured');
} else {
  console.warn('⚠️ Alchemy API key not configured or invalid');
}

// Add Infura provider if available
if (isValidApiKey(infuraApiKey)) {
  providers.push(infuraProvider({ apiKey: infuraApiKey }));
  console.log('✅ Infura provider configured');
} else {
  console.warn('⚠️ Infura API key not configured or invalid');
}

// Always add public provider as fallback
providers.push(publicProvider());
console.log('✅ Public provider added as fallback');

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

// Configure wallet connectors with improved error handling
let connectors;
let walletConnectConfigured = false;

try {
  // Validate WalletConnect project ID
  const isWalletConnectValid = walletConnectProjectId && 
    walletConnectProjectId !== 'your_walletconnect_project_id_here' &&
    walletConnectProjectId !== 'demo' &&
    walletConnectProjectId !== '' &&
    walletConnectProjectId.length >= 32;

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
    throw new Error('WalletConnect not configured');
  }
} catch (error) {
  console.log('🔄 Using fallback wallet connectors (MetaMask + Injected)');
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
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export { chains };

// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  [mainnet.id]: null, // Deploy to mainnet when ready
  [polygon.id]: null, // Deploy to Polygon when ready
  [sepolia.id]: null, // Set after testnet deployment
  [polygonMumbai.id]: null, // Set after testnet deployment
  [goerli.id]: null, // Set after testnet deployment
} as const;

// IPFS Configuration with validation
export const IPFS_CONFIG = {
  pinataApiKey: import.meta.env.VITE_PINATA_API_KEY,
  pinataSecretKey: import.meta.env.VITE_PINATA_SECRET_KEY,
  pinataJWT: import.meta.env.VITE_PINATA_JWT,
  gateway: 'https://gateway.pinata.cloud/ipfs/',
};

// Default network for development
export const DEFAULT_CHAIN = sepolia;

// Helper functions with improved validation
export const isBlockchainConfigured = () => {
  return isValidApiKey(alchemyApiKey) || isValidApiKey(infuraApiKey);
};

export const isWalletConnectConfigured = () => {
  return walletConnectConfigured;
};

export const isIPFSConfigured = () => {
  const jwt = IPFS_CONFIG.pinataJWT;
  return !!(jwt && jwt !== 'your_pinata_jwt_here' && jwt !== '' && jwt.length > 50);
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
    walletConnect: walletConnectConfigured,
    alchemy: isValidApiKey(alchemyApiKey),
    infura: isValidApiKey(infuraApiKey),
    pinata: isIPFSConfigured(),
    blockchain: isBlockchainConfigured(),
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
      rpcUrl: isValidApiKey(alchemyApiKey) 
        ? `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`
        : 'https://cloudflare-eth.com',
    },
    [polygon.id]: {
      name: 'Polygon',
      currency: 'MATIC',
      explorerUrl: 'https://polygonscan.com',
      rpcUrl: isValidApiKey(alchemyApiKey)
        ? `https://polygon-mainnet.g.alchemy.com/v2/${alchemyApiKey}`
        : 'https://polygon-rpc.com',
    },
    [sepolia.id]: {
      name: 'Sepolia Testnet',
      currency: 'ETH',
      explorerUrl: 'https://sepolia.etherscan.io',
      rpcUrl: isValidApiKey(alchemyApiKey)
        ? `https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`
        : 'https://rpc.sepolia.org',
    },
    [polygonMumbai.id]: {
      name: 'Polygon Mumbai',
      currency: 'MATIC',
      explorerUrl: 'https://mumbai.polygonscan.com',
      rpcUrl: isValidApiKey(alchemyApiKey)
        ? `https://polygon-mumbai.g.alchemy.com/v2/${alchemyApiKey}`
        : 'https://rpc-mumbai.maticvigil.com',
    },
    [goerli.id]: {
      name: 'Goerli Testnet',
      currency: 'ETH',
      explorerUrl: 'https://goerli.etherscan.io',
      rpcUrl: isValidApiKey(alchemyApiKey)
        ? `https://eth-goerli.g.alchemy.com/v2/${alchemyApiKey}`
        : 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    },
  };

  return networkConfigs[chainId] || null;
};