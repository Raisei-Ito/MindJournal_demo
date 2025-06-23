import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      // Supabase APIへのプロキシ設定でSSL検証を無効化
      '/rest': {
        target: 'https://sjvgdiwiolycbatblsaf.supabase.co',
        changeOrigin: true,
        secure: false, // SSL証明書検証を無効化
        rewrite: (path) => path.replace(/^\/rest/, '/rest'),
      },
    },
  },
});
