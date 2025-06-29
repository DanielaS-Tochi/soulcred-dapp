import { createConfig, configureChains } from 'wagmi';
import { sepolia, polygonMumbai, goerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

// Get API keys from environment variables
const alchemyApiKey = import.meta.env.VITE_ALCHEMY_API_KEY;
const infuraApiKey = import.meta.env.VITE_INFURA_API_KEY;
const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

console.log('🔧 Blockchain Configuration:', {
  alchemyConfigured: !!alchemyApiKey && alchemyApiKey !== 'your_alchemy_api_key_here',
  infuraConfigured: !!infuraApiKey && infuraApiKey !== 'your_infura_api_key_here',
  walletConnectConfigured: !!walletConnectProjectId && walletConnectProjectId !== 'your_walletconnect_project_id_here',
  environment: import.meta.env.MODE,
});

// Configure providers
const providers = [];

// Add API-based providers if configured
if (alchemyApiKey && alchemyApiKey !== 'your_alchemy_api_key_here') {
  providers.push(alchemyProvider({ apiKey: alchemyApiKey }));
  console.log('✅ Alchemy provider configured');
}

if (infuraApiKey && infuraApiKey !== 'your_infura_api_key_here') {
  providers.push(infuraProvider({ apiKey: infuraApiKey }));
  console.log('✅ Infura provider configured');
}

// Always add public provider as fallback
providers.push(publicProvider());
console.log('✅ Public provider configured');

// Configure chains - only testnets to avoid TypeScript issues
const supportedChains = [sepolia, polygonMumbai, goerli];

const { chains, publicClient, webSocketPublicClient } = configureChains(
  supportedChains,
  providers
);

// Configure wallet connectors
let connectors;

try {
  if (walletConnectProjectId && walletConnectProjectId !== 'your_walletconnect_project_id_here') {
    // Use RainbowKit with WalletConnect
    const { connectors: defaultConnectors } = getDefaultWallets({
      appName: 'SoulCred',
      projectId: walletConnectProjectId,
      chains,
    });
    connectors = defaultConnectors;
    console.log('✅ RainbowKit connectors configured with WalletConnect');
  } else {
    throw new Error('WalletConnect not configured, using basic connectors');
  }
} catch {
  console.log('🔄 Using basic wallet connectors (MetaMask + Injected)');
  // Fallback to basic connectors
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
        name: 'Injected Wallet',
        shimDisconnect: true,
      },
    }),
  ];
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
  [sepolia.id]: '0xF766558E8042681F5f0861df2e4f06c7A2cfD17b', // ✅ YOUR DEPLOYED CONTRACT
  [polygonMumbai.id]: null, // Deploy to Mumbai when ready  
  [goerli.id]: null, // Deploy to Goerli when ready
} as const;

// IPFS Configuration
export const IPFS_CONFIG = {
  gateway: 'https://gateway.pinata.cloud/ipfs/',
};

// Default network for development
export const DEFAULT_CHAIN = sepolia;

// Helper functions
export const isBlockchainConfigured = () => {
  return true; // Always return true since we have public providers
};

export const isWalletConnectConfigured = () => {
  return !!walletConnectProjectId && walletConnectProjectId !== 'your_walletconnect_project_id_here';
};

export const isIPFSConfigured = () => {
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
    walletConnect: isWalletConnectConfigured(),
    alchemy: !!alchemyApiKey && alchemyApiKey !== 'your_alchemy_api_key_here',
    infura: !!infuraApiKey && infuraApiKey !== 'your_infura_api_key_here',
    pinata: true, // Handled server-side
    blockchain: true,
    environment: import.meta.env.MODE,
    production: import.meta.env.PROD,
  };
};

// Network configuration helper with proper typing
export const getNetworkConfig = (chainId: number) => {
  const networkConfigs: Record<number, {
    name: string;
    currency: string;
    explorerUrl: string;
    rpcUrl: string;
  }> = {
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