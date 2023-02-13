import getConfig from 'next/config'
import {
  useNetwork,
  useSwitchNetwork,
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useContractRead,
} from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import optriSpaceContractABI from '../../contracts/OptriSpace.json'

const { publicRuntimeConfig } = getConfig()

const { blockchainNetworkId, optriSpaceContractAddress } = publicRuntimeConfig

export const useWeb3 = () => {
  const { chain } = useNetwork()
  const {
    error: switchNetworkError,
    isLoading: switchingNetwork,
    pendingChainId,
    switchNetwork,
  } = useSwitchNetwork({
    chainId: +blockchainNetworkId,
  })

  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })

  const { disconnect } = useDisconnect()

  const {
    error: accountError,
    isConnecting,
    isReconnecting,
    isConnected,
    isDisconnected,
    address,
  } = useAccount()

  const {
    data: accountBalance,
    error: balanceError,
    isLoading: balanceLoading,
  } = useBalance({
    enabled: isConnected,
    address: address,
  })

  const {
    data: contractVersion,
    error: versionError,
    isLoading: versionLoading,
  } = useContractRead({
    address: optriSpaceContractAddress,
    abi: optriSpaceContractABI,
    functionName: 'releaseName',
    enabled: isConnected,
    overrides: { from: address },
  })

  let blockchainNetworkName

  switch (blockchainNetworkId) {
    case '97':
      blockchainNetworkName = 'Binance Smart Chain Testnet'
      break
    case '31337':
      blockchainNetworkName = 'Localhost'
      break
    case '56':
      blockchainNetworkName = 'Binance Smart Chain Mainnet'
      break
    default:
      throw new Error('Unsupported blockchain network')
  }

  return {
    connect,
    disconnect,
    isConnected,
    address,
    accountError,
    isConnecting,
    isReconnecting,
    isDisconnected,
    balanceLoading,
    balanceError,
    accountBalance,
    versionLoading,
    versionError,
    contractVersion,
    connectedToValidNetwork: Boolean(chain?.id == blockchainNetworkId),
    blockchainNetworkId,
    blockchainNetworkName,
    switchNetworkError,
    switchingNetwork,
    switchNetwork,
    pendingChainId,
  }
}
