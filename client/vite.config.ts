import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [
    react(),
    ...(process.env.HTTPS === 'true' ? [basicSsl()] : []),
  ],
  server: {
    port: 5173,
    host: true, // Expose to local network (WiFi) for mobile camera connection
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true,
      },
    },
  },
});
