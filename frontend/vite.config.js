import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The dev server proxies /api to the backend. Set API_URL if the backend isn't on port 4000
// (for example when another project already uses that port).
const API_URL = process.env.API_URL || 'http://localhost:4000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': API_URL },
  },
});
