import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // Le navigateur ne parle qu'à Vite, qui relaie /api vers Symfony (npm run back),
    // comme en prod où front et API partagent le même domaine : pas de CORS, cookies
    // sur la même origine.
    proxy: {
      '/api': {
        target: 'https://127.0.0.1:8000',
        changeOrigin: true,
        // Certificat local de la CLI Symfony : inutile de le faire valider ici.
        secure: false,
      },
    },
  },
})
