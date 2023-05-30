import getConfig from 'next/config'
import { createClient, configureChains } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { publicProvider } from 'wagmi/providers/public'

const binanceSmartChainMainnet = {
  id: 56,
  name: 'Binance Smart Chain Mainnet',
  network: 'binance-smart chain mainnet',
  nativeCurrency: {
    name: 'Binance Chain Native Token',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://bsc-dataseed.binance.org',
    dataseed1: 'https://bsc-dataseed1.binance.org',
    dataseed2: 'https://bsc-dataseed2.binance.org',
    dataseed3: 'https://bsc-dataseed3.binance.org',
    dataseed4: 'https://bsc-dataseed4.binance.org',
  },
  blockExplorers: {
    default: { name: 'Bscscan', url: 'https://bscscan.com' },
  },
  testnet: false,
}

// NOTE: https://github.com/wagmi-dev/wagmi/discussions/1051
const binanceSmartChainTestnet = {
  id: 97,
  name: 'Binance Smart Chain Testnet',
  network: 'binance smart chain testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Binance Chain Native Token',
    symbol: 'tBNB',
  },
  rpcUrls: {
    default: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    prebsc1s2: 'https://data-seed-prebsc-1-s2.binance.org:8545',
    prebsc2s1: 'https://data-seed-prebsc-2-s1.binance.org:8545',
    prebsc2s2: 'https://data-seed-prebsc-2-s2.binance.org:8545',
  },
  blockExplorers: {
    default: { name: 'Bscscan', url: 'https://testnet.bscscan.com' },
  },
  testnet: true,
}

const localhost = {
  id: 31337,
  name: 'Localhost',
  network: 'localhost',
  nativeCurrency: {
    decimals: 18,
    name: 'Localhost Token',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: 'http://127.0.0.1:8545/',
  },
  testnet: true,
}

const networks = {
  31337: localhost,
  97: binanceSmartChainTestnet,
  56: binanceSmartChainMainnet,
}

const { blockchainNetworkId } = getConfig().publicRuntimeConfig
export const blockchainNetwork = networks[blockchainNetworkId]
if (!blockchainNetwork) {
  throw new Error(`Not supported blockchain network: ${blockchainNetworkId}!`)
}

const { chains, provider } = configureChains(
  [blockchainNetwork],
  [publicProvider()]
)

export const client = createClient({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  provider,
})
