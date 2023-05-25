const nextTranslate = require('next-translate-plugin')

const nextConfig = {
  poweredByHeader: false,

  // https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode
  reactStrictMode: true,

  // https://nextjs.org/docs/api-reference/next.config.js/trailing-slash
  trailingSlash: true,

  // This will build the project as a standalone app inside the Docker image
  output: 'standalone',

  // output source map for debugging
  productionBrowserSourceMaps: true,

  publicRuntimeConfig: {
    // Will be available on both server and client
    optriSpaceContractAddress: process.env.OPTRISPACE_CONTRACT_ADDRESS,
    domain: process.env.DOMAIN,
    blockchainNetworkId: process.env.BLOCKCHAIN_NETWORK_ID,
    blockchainViewAddressURL: process.env.BLOCKCHAIN_VIEW_ADDRESS_URL,
    frontendNodeAddress: process.env.FRONTEND_NODE_ADDRESS,
    sentryDsn: process.env.SENTRY_DSN,
    discordLink: 'https://discord.com/invite/7WEbtmuqtv',
    gitHubLink: 'https://github.com/optriment',
    twitterLink: 'https://twitter.com/optrispace',
    linkedInLink: 'https://www.linkedin.com/company/optriment',
  },
}

module.exports = nextTranslate(nextConfig)

// Injected content via Sentry wizard below

const { withSentryConfig } = require('@sentry/nextjs')

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,

    org: 'optriment-le',
    project: 'optrispace',
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: '/monitoring',

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  }
)
