import React from 'react'
import { useRouter } from 'next/router'
import { useHasMounted } from '../../../hooks/useHasMounted'
import { isAddress } from '../../../lib/validators'
import { LandingLayout } from '../../../layouts/Landing'
import { UnauthorizedScreen } from '../../../screens/unauthorized'
import { FreelancerScreen } from '../../../screens/freelancers/show'
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

        const freelancerAddress = query.id

        if (!isAddress(freelancerAddress)) {
          return (
            <ErrorWrapper
              header="Invalid Freelancer Address"
              error="Freelancer address must be a hexadecimal"
            />
          )
        }

        return (
          <FreelancerScreen
            freelancerAddress={freelancerAddress}
            currentAccount={wallet.address}
          />
        )
      }}
    />
  )
}

export default Page
