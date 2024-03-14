/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['visionaid.org'],
      },
    experimental: { appDir: true },
    webpack(config) {
        config.experiments = { ...config.experiments, topLevelAwait: true }
        return config
    },
}

module.exports = nextConfig
