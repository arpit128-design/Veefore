import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          charts: ['recharts'],
          animation: ['framer-motion']
        }
      }
    },
    // Optimize bundle size
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },

  // Development server configuration
  server: {
    port: 3000,
    host: true,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },

  // Preview server configuration
  preview: {
    port: 3000,
    host: true
  },

  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/components': resolve(__dirname, 'src/components'),
      '@/hooks': resolve(__dirname, 'src/hooks'),
      '@/lib': resolve(__dirname, 'src/lib'),
      '@/pages': resolve(__dirname, 'src/pages'),
      '@/utils': resolve(__dirname, 'src/utils'),
      '@/assets': resolve(__dirname, 'public'),
      '@shared': resolve(__dirname, '../shared')
    }
  },

  // Environment variables
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __PROD__: JSON.stringify(process.env.NODE_ENV === 'production')
  },

  // Optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'axios',
      'framer-motion',
      'lucide-react',
      'zod',
      '@tanstack/react-query'
    ],
    exclude: ['@tensorflow/tfjs']
  },

  // CSS configuration
  css: {
    postcss: './postcss.config.js',
    devSourcemap: true
  },

  // Asset handling
  assetsInclude: ['**/*.woff', '**/*.woff2', '**/*.ttf', '**/*.otf'],

  // Performance optimizations
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
});