import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import fs from 'node:fs'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
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
          if (url.startsWith('/dict/') && url.endsWith('.dat.gz')) {
            const filePath = path.join(process.cwd(), 'public', url);

            if (fs.existsSync(filePath)) {
              const stat = fs.statSync(filePath);
              // Force binary content type and disable compression
              res.setHeader('Content-Type', 'application/octet-stream');
              res.setHeader('Content-Length', stat.size);
              // Ensure no compression headers are sent
              res.removeHeader('Content-Encoding');

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
})
