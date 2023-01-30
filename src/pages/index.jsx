import React from 'react'
import { useHasMounted } from '../hooks/useHasMounted'
import { LandingLayout } from '../layouts/Landing'
import { LandingScreen } from '../screens/landing'
import { DashboardScreen } from '../screens/dashboard'
import JustOneSecond from '../components/JustOneSecond'
import { WalletLoader } from '../components/WalletLoader'

const Page = () => {
  const hasMounted = useHasMounted()

  if (!hasMounted) {
    return (
      <LandingLayout>
        <JustOneSecond />
      </LandingLayout>
    )
  }

  return (
    <WalletLoader
      onDisconnected={() => <LandingScreen />}
      onConnected={(wallet) => (
        <DashboardScreen currentAccount={wallet.address} />
      )}
    />
  )
}

export default Page
