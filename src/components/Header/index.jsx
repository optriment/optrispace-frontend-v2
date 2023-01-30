import React from 'react'
import Menu from '../Menu'

export const Header = ({
  isConnected,
  isReconnecting,
  connect,
  disconnect,
  accountBalance,
  currentAccount,
}) => {
  return (
    <Menu
      isConnected={isConnected}
      isReconnecting={isReconnecting}
      connect={connect}
      disconnect={disconnect}
      accountBalance={accountBalance}
      currentAccount={currentAccount}
    />
  )
}
