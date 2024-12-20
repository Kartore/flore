import build from '@hono/vite-build/cloudflare-workers'
import adapter from '@hono/vite-dev-server/cloudflare'
import honox from 'honox/vite'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  return {
    plugins: [honox({devServer: {adapter}}), build()],
    build: {
      rollupOptions: {
        input: mode === "client" ? ["app/index.css"] : [],
      }
    }
  }
})
