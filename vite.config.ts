import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4173,
    allowedHosts: ['nzooimmo.com', 'www.nzooimmo.com'],
  },
  base: '/',  // à ajouter si ce n’est pas déjà fait
});


