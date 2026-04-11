/** @type {import('next').NextConfig} */
const nextConfig = {
  // Questo risolve l'errore del log forzando l'uso di webpack con il polling
  webpack: (config, { dev }) => {
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