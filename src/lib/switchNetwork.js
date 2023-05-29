import { blockchainNetwork } from './wagmi'
import * as Sentry from '@sentry/nextjs'

const getNetworkDetails = () => {
  return {
    chainId: `0x${blockchainNetwork.id.toString(16)}`,
    chainName: blockchainNetwork.name,
    nativeCurrency: {
      name: blockchainNetwork.nativeCurrency.name,
      symbol: blockchainNetwork.nativeCurrency.symbol,
      decimals: blockchainNetwork.nativeCurrency.decimals,
    },
    rpcUrls: Object.values(blockchainNetwork.rpcUrls),
    blockExplorerUrls: [blockchainNetwork.blockExplorers.default.url],
  }
}

const switchNetwork = async (provider, networkDetails) => {
  try {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [networkDetails],
    })
  } catch (error) {
    Sentry.captureException(error)
  }
}

export const handleNetworkSwitch = async (connect) => {
  const provider = window.ethereum
  const networkDetails = getNetworkDetails()
  await switchNetwork(provider, networkDetails)

  try {
    await connect()
  } catch (error) {
    Sentry.captureException(error)
  }
}
