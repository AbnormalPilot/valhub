import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        agents: resolve(__dirname, 'agents.html'),
        maps: resolve(__dirname, 'maps.html'),
        weapons: resolve(__dirname, 'weapons.html'),
        ranks: resolve(__dirname, 'ranks.html')
      }
    }
  }
})
