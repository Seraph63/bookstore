import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Questo risolve l'errore del log forzando l'uso di webpack con il polling
  webpack: (config: any, { dev }: { dev: boolean }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,         // Controlla i file ogni secondo
        aggregateTimeout: 300,
      }
    }
    return config
  },
}

export default nextConfig