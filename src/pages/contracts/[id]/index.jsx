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
import useTranslation from 'next-translate/useTranslation'

const Page = () => {
  const { t } = useTranslation('common')
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
          return <JustOneSecond />
        }

        const contractAddress = query.id

        if (!isAddress(contractAddress)) {
          return (
            <ErrorWrapper
              header={t('errors.messages.not_a_blockchain_address', {
                field: `Contract ID ${contractAddress}`,
              })}
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
