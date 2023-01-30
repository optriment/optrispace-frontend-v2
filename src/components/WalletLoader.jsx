import { useWeb3 } from '../hooks/useWeb3'
import { LandingLayout } from '../layouts/Landing'
import { UsersLayout } from '../layouts/Users'
import { errorHandler } from '../lib/errorHandler'
import { ErrorFetchingContractVersionMessage } from './ErrorFetchingContractVersionMessage'
import ErrorWrapper from './ErrorWrapper'
import { JustOneSecondBlockchain } from './JustOneSecond'
import { WrongBlockchainNetwork } from './WrongBlockchainNetwork'

export const WalletLoader = ({ onDisconnected, onConnected }) => {
  const wallet = useWeb3()

  const {
    connect,
    disconnect,
    isConnecting,
    isReconnecting,
    isConnected,
    address,
    accountError,
    isDisconnected,
    balanceLoading,
    balanceError,
    accountBalance,
    versionLoading,
    versionError,
    contractVersion,
    connectedToValidNetwork,
    blockchainNetworkName,
    blockchainNetworkId,
    switchNetworkError,
    switchingNetwork,
    switchNetwork,
    pendingChainId,
  } = wallet

  let layoutProps = {
    connect,
    disconnect,
    isConnected,
    isReconnecting,
    currentAccount: address,
    connectedToValidNetwork,
  }

  if (isConnecting) {
    return (
      <LandingLayout {...layoutProps}>
        <JustOneSecondBlockchain message="Connecting to account..." />
      </LandingLayout>
    )
  }

  if (isReconnecting) {
    return (
      <LandingLayout {...layoutProps}>
        <JustOneSecondBlockchain message="Reconnecting to account..." />
      </LandingLayout>
    )
  }

  if (accountError) {
    return (
      <LandingLayout {...layoutProps}>
        <ErrorWrapper
          header="Error loading account"
          error={errorHandler(accountError)}
        />
      </LandingLayout>
    )
  }

  if (switchingNetwork && pendingChainId == blockchainNetworkId) {
    return (
      <LandingLayout {...layoutProps}>
        <JustOneSecondBlockchain message="Switching network..." />
      </LandingLayout>
    )
  }

  if (switchNetworkError) {
    return (
      <LandingLayout {...layoutProps}>
        <ErrorWrapper
          header="Error switching network"
          error={errorHandler(switchNetworkError)}
        />
      </LandingLayout>
    )
  }

  if (isDisconnected) {
    return <LandingLayout {...layoutProps}>{onDisconnected()}</LandingLayout>
  }

  if (!connectedToValidNetwork) {
    return (
      <LandingLayout {...layoutProps}>
        <WrongBlockchainNetwork
          blockchainNetworkName={blockchainNetworkName}
          switchNetwork={switchNetwork}
        />
      </LandingLayout>
    )
  }

  if (balanceLoading) {
    return (
      <UsersLayout {...layoutProps}>
        <JustOneSecondBlockchain message="Loading balance..." />
      </UsersLayout>
    )
  }

  if (balanceError) {
    return (
      <UsersLayout {...layoutProps}>
        <ErrorWrapper
          header="Error loading balance"
          error={errorHandler(balanceError)}
        />
      </UsersLayout>
    )
  }

  layoutProps['accountBalance'] = accountBalance

  if (versionLoading) {
    return (
      <UsersLayout {...layoutProps}>
        <JustOneSecondBlockchain message="Loading contract version..." />
      </UsersLayout>
    )
  }

  if (versionError) {
    return (
      <UsersLayout {...layoutProps}>
        <ErrorFetchingContractVersionMessage
          description={errorHandler(versionError)}
        />
      </UsersLayout>
    )
  }

  layoutProps['contractVersion'] = contractVersion

  return <UsersLayout {...layoutProps}>{onConnected(wallet)}</UsersLayout>
}
