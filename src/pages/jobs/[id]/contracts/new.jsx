import React from 'react'
import { useRouter } from 'next/router'
import { useHasMounted } from '../../../../hooks/useHasMounted'
import { isAddress } from '../../../../lib/validators'
import { LandingLayout } from '../../../../layouts/Landing'
import { UnauthorizedScreen } from '../../../../screens/unauthorized'
import { NewContractScreen } from '../../../../screens/contracts/new'
import { WalletLoader } from '../../../../components/WalletLoader'
import JustOneSecond from '../../../../components/JustOneSecond'
import ErrorWrapper from '../../../../components/ErrorWrapper'
import { InsufficientBalance } from '../../../../components/InsufficientBalance'

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

        const { id: jobAddress, application_address: applicationAddress } =
          query

        if (!isAddress(jobAddress)) {
          return (
            <ErrorWrapper
              header="Invalid Job Address"
              error="Job address must be a hexadecimal"
            />
          )
        }

        if (!isAddress(applicationAddress)) {
          return (
            <ErrorWrapper
              header="Invalid Application Address"
              error="Application address must be a hexadecimal"
            />
          )
        }

        if (wallet.accountBalance.formatted > 0) {
          return (
            <NewContractScreen
              jobAddress={jobAddress}
              applicationAddress={applicationAddress}
              currentAccount={wallet.address}
              accountBalance={wallet.accountBalance}
            />
          )
        }

        return <InsufficientBalance />
      }}
    />
  )
}

export default Page
