import React from 'react'
import { useRouter } from 'next/router'
import { useHasMounted } from '../../../hooks/useHasMounted'
import { isAddress } from '../../../lib/validators'
import { LandingLayout } from '../../../layouts/Landing'
import { UnauthorizedScreen } from '../../../screens/unauthorized'
import { ContractScreen } from '../../../screens/contracts/show'
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

        const contractAddress = query.id

        if (!isAddress(contractAddress)) {
          return (
            <ErrorWrapper
              header="Invalid Contract Address"
              error="Contract address must be a hexadecimal"
            />
          )
        }

        return (
          <ContractScreen
            contractAddress={contractAddress}
            currentAccount={wallet.address}
            accountBalance={wallet.accountBalance}
          />
        )
      }}
    />
  )
}

export default Page
