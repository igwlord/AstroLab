import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'AstroLab - Laboratorio Astrológico',
        short_name: 'AstroLab',
        description: 'Tu laboratorio astrológico personal. Calcula cartas natales precisas, explora el glosario y medita con frecuencias holísticas.',
        theme_color: '#7c3aed',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        categories: ['lifestyle', 'education', 'health'],
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Nueva Carta Natal',
            short_name: 'Carta Natal',
            description: 'Calcula una nueva carta natal',
            url: '/natal-chart',
            icons: [{ src: 'favicon.svg', sizes: '96x96' }]
          },
          {
            name: 'Glosario',
            short_name: 'Glosario',
            description: 'Explora el glosario astrológico',
            url: '/glossary',
            icons: [{ src: 'favicon.svg', sizes: '96x96' }]
          },
          {
            name: 'Frecuencias',
            short_name: 'Frecuencias',
            description: 'Medita con frecuencias holísticas',
            url: '/frequencies',
            icons: [{ src: 'favicon.svg', sizes: '96x96' }]
          }
        ]
      },
      workbox: {
        // Excluir mp3 del precache - son muy grandes (10-16 MB cada uno)
        globPatterns: ['**/*.{js,css,html,svg,png,json,woff,woff2}'],
        globIgnores: ['**/media/**'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'firestore-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 días
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Cache de audios de frecuencias
            urlPattern: /\.mp3$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'audio-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 año
              }
            }
          },
          {
            // Cache de imágenes
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 días
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  assetsInclude: ['**/*.wasm', '**/*.data'],
  optimizeDeps: {
    exclude: ['swisseph-wasm']
  },
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin'
    },
    fs: {
      allow: ['..']
    }
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // No agregar hash a archivos WASM y data para que swisseph-wasm los encuentre
          if (assetInfo.name?.endsWith('.wasm') || assetInfo.name?.endsWith('.data')) {
            return 'assets/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        manualChunks: (id) => {
          // React vendor - split into smaller chunks
          if (id.includes('node_modules/react-dom')) {
            return 'react-dom';
          }
          if (id.includes('node_modules/react-router-dom')) {
            return 'react-router';
          }
          if (id.includes('node_modules/react/')) {
            return 'react-core';
          }
          
          // Astronomy calculations
          if (id.includes('node_modules/astronomy-engine')) {
            return 'astronomy';
          }
          
          // Swiss Ephemeris (heavy)
          if (id.includes('node_modules/swisseph-wasm')) {
            return 'swisseph';
          }
          
          // PDF generation - split
          if (id.includes('node_modules/html2canvas')) {
            return 'html2canvas';
          }
          if (id.includes('node_modules/jspdf')) {
            return 'jspdf';
          }
          
          // i18n
          if (id.includes('node_modules/i18next') || 
              id.includes('node_modules/react-i18next')) {
            return 'i18n';
          }
          
          // Lucide icons (separate from main bundle)
          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }
          
          // Zustand state management
          if (id.includes('node_modules/zustand')) {
            return 'state';
          }
          
          // Glossary modals - group 1 (Basics)
          if (id.includes('PlanetModal') || 
              id.includes('HouseModal') || 
              id.includes('AspectModal') || 
              id.includes('ZodiacModal')) {
            return 'glossary-modals';
          }
          
          // Glossary modals - group 2 (Advanced)
          if (id.includes('CelestialBodyModal') || 
              id.includes('AsteroidModal') || 
              id.includes('MoonSignModal') || 
              id.includes('AscendantModal')) {
            return 'glossary-modals-2';
          }
          
          // Glossary modals - group 3 (Special)
          if (id.includes('ConfigurationModal') || 
              id.includes('RelationalModal') || 
              id.includes('DignityModal') || 
              id.includes('PolarizationModal')) {
            return 'glossary-modals-3';
          }
          
          // Glossary Grids (lazy loaded, but grouped)
          if (id.includes('Grid.tsx') && id.includes('/components/')) {
            return 'glossary-grids';
          }
          
          // Chart calculators - group heavy calculation modules
          if (id.includes('/services/') && 
              (id.includes('Calculator') || id.includes('calculator'))) {
            return 'calculators';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
