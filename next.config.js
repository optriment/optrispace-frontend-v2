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
    discordLink: 'https://discord.com/invite/7WEbtmuqtv',
    gitHubLink: 'https://github.com/optriment',
    twitterLink: 'https://twitter.com/optrispace',
    linkedInLink: 'https://www.linkedin.com/company/optriment',
  },
}

module.exports = nextTranslate(nextConfig)
