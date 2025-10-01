import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig, chains } from './config/blockchain';
import { environmentValidator } from './services/environmentValidator';
import App from './App.tsx';
import './index.css';
import '@rainbow-me/rainbowkit/styles.css';

environmentValidator.validateOnStartup();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Custom RainbowKit theme
const customTheme = {
  ...lightTheme({
    accentColor: '#8b5cf6',
    accentColorForeground: 'white',
    borderRadius: 'medium',
    fontStack: 'system',
  }),
  colors: {
    ...lightTheme().colors,
    modalBackground: 'rgba(255, 255, 255, 0.95)',
    modalBorder: 'rgba(139, 92, 246, 0.1)',
    connectButtonBackground: '#8b5cf6',
    connectButtonText: 'white',
  },
};

const customDarkTheme = {
  ...darkTheme({
    accentColor: '#8b5cf6',
    accentColorForeground: 'white',
    borderRadius: 'medium',
    fontStack: 'system',
  }),
  colors: {
    ...darkTheme().colors,
    modalBackground: 'rgba(17, 24, 39, 0.95)',
    modalBorder: 'rgba(139, 92, 246, 0.2)',
    connectButtonBackground: '#8b5cf6',
    connectButtonText: 'white',
  },
};

// Add error boundary for better debugging
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          chains={chains}
          theme={{
            lightMode: customTheme,
            darkMode: customDarkTheme,
          }}
          appInfo={{
            appName: 'SoulCred',
            learnMoreUrl: 'https://ethereum.org/en/wallets/',
          }}
          modalSize="compact"
          showRecentTransactions={true}
          initialChain={chains[0]}
          coolMode={false}
        >
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  </StrictMode>
);