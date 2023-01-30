import React from 'react'
import { useRouter } from 'next/router'
import { useHasMounted } from '../../../hooks/useHasMounted'
import { isAddress } from '../../../lib/validators'
import { LandingLayout } from '../../../layouts/Landing'
import { UnauthorizedScreen } from '../../../screens/unauthorized'
import { JobScreen } from '../../../screens/jobs/show'
import { WalletLoader } from '../../../components/WalletLoader'
import JustOneSecond from '../../../components/JustOneSecond'
import ErrorWrapper from '../../../components/ErrorWrapper'

const Page = () => {
  const hasMounted = useHasMounted()
  const { query, isReady: routerReady } = useRouter()

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
      onConnected={(wallet) => {
        if (!routerReady) {
          return <JustOneSecond title="Initializing..." />
        }

        const jobAddress = query.id

        if (!isAddress(jobAddress)) {
          return (
            <ErrorWrapper
              header="Invalid Job Address"
              error="Job address must be a hexadecimal"
            />
          )
        }

        return (
          <JobScreen
            jobAddress={jobAddress}
            currentAccount={wallet.address}
            accountBalance={wallet.accountBalance}
          />
        )
      }}
    />
  )
}

export default Page
