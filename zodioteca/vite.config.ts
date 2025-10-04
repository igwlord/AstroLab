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
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React vendor
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') || 
              id.includes('node_modules/react-router-dom')) {
            return 'react-vendor';
          }
          
          // Astronomy calculations
          if (id.includes('node_modules/astronomy-engine')) {
            return 'astronomy';
          }
          
          // PDF generation
          if (id.includes('node_modules/jspdf') || 
              id.includes('node_modules/html2canvas')) {
            return 'pdf-vendor';
          }
          
          // i18n
          if (id.includes('node_modules/i18next') || 
              id.includes('node_modules/react-i18next')) {
            return 'i18n';
          }
          
          // Glossary modals - group 1
          if (id.includes('PlanetModal') || 
              id.includes('HouseModal') || 
              id.includes('AspectModal') || 
              id.includes('ZodiacModal')) {
            return 'glossary-modals';
          }
          
          // Glossary modals - group 2
          if (id.includes('CelestialBodyModal') || 
              id.includes('AsteroidModal') || 
              id.includes('MoonSignModal') || 
              id.includes('AscendantModal')) {
            return 'glossary-modals-2';
          }
          
          // Glossary modals - group 3
          if (id.includes('ConfigurationModal') || 
              id.includes('RelationalModal') || 
              id.includes('DignityModal') || 
              id.includes('PolarizationModal')) {
            return 'glossary-modals-3';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
