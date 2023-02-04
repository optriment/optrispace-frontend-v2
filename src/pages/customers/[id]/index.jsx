import React from 'react'
import { useRouter } from 'next/router'
import { useHasMounted } from '../../../hooks/useHasMounted'
import { isAddress } from '../../../lib/validators'
import { LandingLayout } from '../../../layouts/Landing'
import { UnauthorizedScreen } from '../../../screens/unauthorized'
import { CustomerScreen } from '../../../screens/customers/show'
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

        const customerAddress = query.id

        if (!isAddress(customerAddress)) {
          return (
            <ErrorWrapper
              header="Invalid Customer Address"
              error="Customer address must be a hexadecimal"
            />
          )
        }

        return (
          <CustomerScreen
            customerAddress={customerAddress}
            currentAccount={wallet.address}
          />
        )
      }}
    />
  )
}

export default Page
