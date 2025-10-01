import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          wagmi: ['wagmi', '@wagmi/core', 'viem'],
          rainbowkit: ['@rainbow-me/rainbowkit'],
          charts: ['recharts'],
          utils: ['axios', 'react-dropzone'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
    chunkSizeWarningLimit: 1500,
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
        pure_funcs: ['console.debug', 'console.trace'],
      },
      format: {
        comments: false,
      },
    },
  },
  define: {
    global: 'globalThis',
    'import.meta.env.VITE_APP_NAME': JSON.stringify('SoulCred'),
    'import.meta.env.VITE_APP_VERSION': JSON.stringify('1.0.0'),
    'import.meta.env.VITE_ENABLE_MAINNET': JSON.stringify(process.env.VITE_ENABLE_MAINNET || 'false'),
  },
  server: {
    port: 5173,
    host: true,
    open: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
  esbuild: {
    drop: ['debugger'],
  },
});