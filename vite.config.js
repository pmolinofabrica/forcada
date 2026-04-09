import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    host: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        galeria: 'galeria.html',
        contacto: 'contacto.html',
        experiencias: 'experiencias.html',
        hospitalidad: 'hospitalidad.html',
        identidad: 'identidad.html',
      }
    }
  }
})
