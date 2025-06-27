import { createConfig, configureChains } from 'wagmi';
import { sepolia, polygonMumbai, goerli, mainnet, polygon } from 'wagmi/chains';
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

// Configure chains - include mainnet for production readiness
const supportedChains = [sepolia, polygonMumbai, goerli];

// Add mainnet chains if in production
if (import.meta.env.PROD) {
  supportedChains.unshift(mainnet, polygon);
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  supportedChains,
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

// Contract addresses for different networks - Updated for production
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
  return !!(
    (alchemyApiKey && alchemyApiKey !== 'your_alchemy_api_key_here') ||
    (infuraApiKey && infuraApiKey !== 'your_infura_api_key_here')
  );
};

export const isWalletConnectConfigured = () => {
  return walletConnectConfigured;
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
    alchemy: !!(alchemyApiKey && alchemyApiKey !== 'your_alchemy_api_key_here'),
    infura: !!(infuraApiKey && infuraApiKey !== 'your_infura_api_key_here'),
    pinata: !!(IPFS_CONFIG.pinataJWT && IPFS_CONFIG.pinataJWT !== 'your_pinata_jwt_here'),
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
      rpcUrl: `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
    },
    [polygon.id]: {
      name: 'Polygon',
      currency: 'MATIC',
      explorerUrl: 'https://polygonscan.com',
      rpcUrl: `https://polygon-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
    },
    [sepolia.id]: {
      name: 'Sepolia Testnet',
      currency: 'ETH',
      explorerUrl: 'https://sepolia.etherscan.io',
      rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
    },
    [polygonMumbai.id]: {
      name: 'Polygon Mumbai',
      currency: 'MATIC',
      explorerUrl: 'https://mumbai.polygonscan.com',
      rpcUrl: `https://polygon-mumbai.g.alchemy.com/v2/${alchemyApiKey}`,
    },
    [goerli.id]: {
      name: 'Goerli Testnet',
      currency: 'ETH',
      explorerUrl: 'https://goerli.etherscan.io',
      rpcUrl: `https://eth-goerli.g.alchemy.com/v2/${alchemyApiKey}`,
    },
  };

  return networkConfigs[chainId] || null;
};