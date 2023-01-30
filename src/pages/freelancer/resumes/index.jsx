import React from 'react'
import { useHasMounted } from '../../../hooks/useHasMounted'
import { LandingLayout } from '../../../layouts/Landing'
import { UnauthorizedScreen } from '../../../screens/unauthorized'
import { ResumesScreen } from '../../../screens/freelancer/resumes/index'
import { WalletLoader } from '../../../components/WalletLoader'
import JustOneSecond from '../../../components/JustOneSecond'

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
      onDisconnected={() => <UnauthorizedScreen />}
      onConnected={(wallet) => (
        <ResumesScreen currentAccount={wallet.address} />
      )}
    />
  )
}

export default Page
