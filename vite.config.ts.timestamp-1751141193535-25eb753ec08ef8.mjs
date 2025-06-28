// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          wagmi: ["wagmi", "@wagmi/core", "viem"],
          rainbowkit: ["@rainbow-me/rainbowkit"],
          charts: ["recharts"],
          utils: ["axios", "react-dropzone"]
        }
      }
    },
    chunkSizeWarningLimit: 1e3,
    sourcemap: false,
    // Disable sourcemaps in production for smaller bundle
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        // Remove console.log in production
        drop_debugger: true
      }
    }
  },
  define: {
    global: "globalThis",
    // Only expose non-sensitive environment variables
    "import.meta.env.VITE_APP_NAME": JSON.stringify("SoulCred"),
    "import.meta.env.VITE_APP_VERSION": JSON.stringify("1.0.0"),
    "import.meta.env.VITE_ENABLE_MAINNET": JSON.stringify(process.env.VITE_ENABLE_MAINNET || "false")
  },
  server: {
    port: 5173,
    host: true,
    open: true
  },
  preview: {
    port: 4173,
    host: true
  },
  esbuild: {
    // Remove console.log in production
    drop: ["console", "debugger"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGV4Y2x1ZGU6IFsnbHVjaWRlLXJlYWN0J10sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgIHZlbmRvcjogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcbiAgICAgICAgICB3YWdtaTogWyd3YWdtaScsICdAd2FnbWkvY29yZScsICd2aWVtJ10sXG4gICAgICAgICAgcmFpbmJvd2tpdDogWydAcmFpbmJvdy1tZS9yYWluYm93a2l0J10sXG4gICAgICAgICAgY2hhcnRzOiBbJ3JlY2hhcnRzJ10sXG4gICAgICAgICAgdXRpbHM6IFsnYXhpb3MnLCAncmVhY3QtZHJvcHpvbmUnXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEwMDAsXG4gICAgc291cmNlbWFwOiBmYWxzZSwgLy8gRGlzYWJsZSBzb3VyY2VtYXBzIGluIHByb2R1Y3Rpb24gZm9yIHNtYWxsZXIgYnVuZGxlXG4gICAgbWluaWZ5OiAndGVyc2VyJyxcbiAgICB0ZXJzZXJPcHRpb25zOiB7XG4gICAgICBjb21wcmVzczoge1xuICAgICAgICBkcm9wX2NvbnNvbGU6IHRydWUsIC8vIFJlbW92ZSBjb25zb2xlLmxvZyBpbiBwcm9kdWN0aW9uXG4gICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIGRlZmluZToge1xuICAgIGdsb2JhbDogJ2dsb2JhbFRoaXMnLFxuICAgIC8vIE9ubHkgZXhwb3NlIG5vbi1zZW5zaXRpdmUgZW52aXJvbm1lbnQgdmFyaWFibGVzXG4gICAgJ2ltcG9ydC5tZXRhLmVudi5WSVRFX0FQUF9OQU1FJzogSlNPTi5zdHJpbmdpZnkoJ1NvdWxDcmVkJyksXG4gICAgJ2ltcG9ydC5tZXRhLmVudi5WSVRFX0FQUF9WRVJTSU9OJzogSlNPTi5zdHJpbmdpZnkoJzEuMC4wJyksXG4gICAgJ2ltcG9ydC5tZXRhLmVudi5WSVRFX0VOQUJMRV9NQUlOTkVUJzogSlNPTi5zdHJpbmdpZnkocHJvY2Vzcy5lbnYuVklURV9FTkFCTEVfTUFJTk5FVCB8fCAnZmFsc2UnKSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogNTE3MyxcbiAgICBob3N0OiB0cnVlLFxuICAgIG9wZW46IHRydWUsXG4gIH0sXG4gIHByZXZpZXc6IHtcbiAgICBwb3J0OiA0MTczLFxuICAgIGhvc3Q6IHRydWUsXG4gIH0sXG4gIGVzYnVpbGQ6IHtcbiAgICAvLyBSZW1vdmUgY29uc29sZS5sb2cgaW4gcHJvZHVjdGlvblxuICAgIGRyb3A6IFsnY29uc29sZScsICdkZWJ1Z2dlciddLFxuICB9LFxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLG9CQUFvQjtBQUN0UCxPQUFPLFdBQVc7QUFHbEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxjQUFjO0FBQUEsRUFDMUI7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQSxVQUNaLFFBQVEsQ0FBQyxTQUFTLFdBQVc7QUFBQSxVQUM3QixPQUFPLENBQUMsU0FBUyxlQUFlLE1BQU07QUFBQSxVQUN0QyxZQUFZLENBQUMsd0JBQXdCO0FBQUEsVUFDckMsUUFBUSxDQUFDLFVBQVU7QUFBQSxVQUNuQixPQUFPLENBQUMsU0FBUyxnQkFBZ0I7QUFBQSxRQUNuQztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSx1QkFBdUI7QUFBQSxJQUN2QixXQUFXO0FBQUE7QUFBQSxJQUNYLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQSxRQUNSLGNBQWM7QUFBQTtBQUFBLFFBQ2QsZUFBZTtBQUFBLE1BQ2pCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLFFBQVE7QUFBQTtBQUFBLElBRVIsaUNBQWlDLEtBQUssVUFBVSxVQUFVO0FBQUEsSUFDMUQsb0NBQW9DLEtBQUssVUFBVSxPQUFPO0FBQUEsSUFDMUQsdUNBQXVDLEtBQUssVUFBVSxRQUFRLElBQUksdUJBQXVCLE9BQU87QUFBQSxFQUNsRztBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTO0FBQUE7QUFBQSxJQUVQLE1BQU0sQ0FBQyxXQUFXLFVBQVU7QUFBQSxFQUM5QjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
