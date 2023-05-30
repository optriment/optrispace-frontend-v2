import { useWeb3 } from '../hooks/useWeb3'
import { LandingLayout } from '../layouts/Landing'
import { UsersLayout } from '../layouts/Users'
import { errorHandler } from '../lib/errorHandler'
import { ErrorFetchingContractVersionMessage } from './ErrorFetchingContractVersionMessage'
import ErrorWrapper from './ErrorWrapper'
import { JustOneSecondBlockchain } from './JustOneSecond'
import { WrongBlockchainNetwork } from './WrongBlockchainNetwork'
import useTranslation from 'next-translate/useTranslation'

export const WalletLoader = ({ onDisconnected, onConnected }) => {
  const { t } = useTranslation('common')

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
        <JustOneSecondBlockchain
          message={t('components.wallet_loader.connecting_to_account')}
        />
      </LandingLayout>
    )
  }

  if (isReconnecting) {
    return (
      <LandingLayout {...layoutProps}>
        <JustOneSecondBlockchain
          message={t('components.wallet_loader.reconnecting_to_account')}
        />
      </LandingLayout>
    )
  }

  if (accountError) {
    return (
      <LandingLayout {...layoutProps}>
        <ErrorWrapper
          header={t('components.wallet_loader.error_loading_account')}
          error={errorHandler(accountError)}
        />
      </LandingLayout>
    )
  }

  if (switchingNetwork && pendingChainId == blockchainNetworkId) {
    return (
      <LandingLayout {...layoutProps}>
        <JustOneSecondBlockchain
          message={t('components.wallet_loader.switching_network')}
        />
      </LandingLayout>
    )
  }

  if (switchNetworkError) {
    return (
      <LandingLayout {...layoutProps}>
        <ErrorWrapper
          header={t('components.wallet_loader.error_switching_network')}
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
          connect={connect}
        />
      </LandingLayout>
    )
  }

  if (balanceLoading) {
    return (
      <UsersLayout {...layoutProps}>
        <JustOneSecondBlockchain
          message={t('components.wallet_loader.loading_balance')}
        />
      </UsersLayout>
    )
  }

  if (balanceError) {
    return (
      <UsersLayout {...layoutProps}>
        <ErrorWrapper
          header={t('components.wallet_loader.error_loading_balance')}
          error={errorHandler(balanceError)}
        />
      </UsersLayout>
    )
  }

  layoutProps['accountBalance'] = accountBalance

  if (versionLoading) {
    return (
      <UsersLayout {...layoutProps}>
        <JustOneSecondBlockchain
          message={t('components.wallet_loader.loading_contract_version')}
        />
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
