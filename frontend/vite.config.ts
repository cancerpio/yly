import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import fs from 'node:fs'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/yly/',
  plugins: [
    vue(),
    nodePolyfills({
      include: ['path', 'util'],
    }),
    {
      name: 'serve-dictionary-files',
      configureServer(server) {
        // Intercept requests for dictionary files
        server.middlewares.use((req, res, next) => {
          const url = req.url || '';
          if (url.includes('/dict/') && url.endsWith('.dat.gz')) {
            // Remove base path to get the relative file path in public folder
            const relativeUrl = url.replace(/^\/yly/, '');
            const filePath = path.join(process.cwd(), 'public', relativeUrl);

            if (fs.existsSync(filePath)) {
              const stat = fs.statSync(filePath);
              res.writeHead(200, {
                'Content-Type': 'application/octet-stream',
                'Content-Length': stat.size.toString(),
              });
              const readStream = fs.createReadStream(filePath);
              readStream.pipe(res);
              return;
            }
          }
          next();
        });
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
