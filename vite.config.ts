import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import pkg from './package.json'

export default defineConfig({
  define: {
    __APP_NAME__:    JSON.stringify(pkg.name),
    __APP_VERSION__: JSON.stringify(pkg.version),
    __APP_BUILD__:   JSON.stringify((pkg as Record<string, unknown>)['build'] ?? ''),
    __APP_AUTHOR__:  JSON.stringify((pkg as Record<string, unknown>)['author'] ?? ''),
    __APP_LICENSE__: JSON.stringify((pkg as Record<string, unknown>)['license'] ?? ''),
  },
  plugins: [
    tailwindcss(),
    react(),
    {
      name: 'html-replace',
      transformIndexHtml: (html) => html.replace('%APP_NAME%', pkg.name),
    },
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 1500, // mjml-browser is a known large lazy-loaded chunk
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/scheduler')) {
            return 'react-vendor'
          }
          if (id.includes('node_modules/@hello-pangea')) return 'dnd-vendor'
          if (id.includes('node_modules/react-i18next') || id.includes('node_modules/i18next')) return 'i18n-vendor'
          if (id.includes('node_modules/zustand') || id.includes('node_modules/zundo')) return 'state-vendor'
        },
      },
    },
  },
})
