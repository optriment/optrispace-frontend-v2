import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import getConfig from 'next/config'
import { Header, Grid } from 'semantic-ui-react'
import { useContractRead } from 'wagmi'
import { ContractCardForContractor } from '../../../components/ContractCardForContractor'
import { ContractCardForCustomer } from '../../../components/ContractCardForCustomer'
import { errorHandler } from '../../../lib/errorHandler'
import gigsContractsServiceABI from '../../../../contracts/GigsContractsService.json'
import ErrorWrapper from '../../../components/ErrorWrapper'
import JustOneSecond, {
  JustOneSecondBlockchain,
} from '../../../components/JustOneSecond'
import useTranslation from 'next-translate/useTranslation'

const { publicRuntimeConfig } = getConfig()
const { optriSpaceContractAddress } = publicRuntimeConfig

export const ContractScreen = ({
  contractAddress,
  currentAccount,
  accountBalance,
}) => {
  const { t } = useTranslation('common')

  const [contract, setContract] = useState(undefined)
  const [contractExists, setContractExists] = useState(false)

  const {
    data: response,
    error,
    isLoading,
  } = useContractRead({
    address: optriSpaceContractAddress,
    abi: gigsContractsServiceABI,
    functionName: 'gigsGetContract',
    args: [contractAddress],
    overrides: { from: currentAccount },
  })

  useEffect(() => {
    if (!response) return

    const { exists, dto, contractBalance } = response

    if (!exists) return

    setContractExists(true)

    const workShouldBeStartedBefore = +dto.workShouldBeStartedBefore
    let remainingTimeToStartWork = 0
    if (workShouldBeStartedBefore > 0) {
      remainingTimeToStartWork =
        workShouldBeStartedBefore - Math.floor(+Date.now() / 1000)
    }

    const resultShouldBeDeliveredBefore = +dto.resultShouldBeDeliveredBefore
    let remainingTimeToDeliverResult = 0
    if (resultShouldBeDeliveredBefore > 0) {
      remainingTimeToDeliverResult =
        resultShouldBeDeliveredBefore - Math.floor(+Date.now() / 1000)
    }

    const j = {
      address: dto.id,
      jobAddress: dto.jobAddress,
      applicationAddress: dto.applicationAddress,
      customerAddress: dto.customerAddress,
      contractorAddress: dto.contractorAddress,
      title: dto.title,
      description: dto.description,
      status: dto.status,
      balance: ethers.utils.formatEther(contractBalance.toString()),
      value: ethers.utils.formatEther(dto.value.toString()),
      durationInDays: +dto.durationInDays,
      daysToStartWork: +dto.daysToStartWork,
      createdAt: +dto.createdAt.toString(),
      acceptedAt: +dto.acceptedAt.toString(),
      fundedAt: +dto.fundedAt.toString(),
      startedAt: +dto.startedAt.toString(),
      deliveredAt: +dto.deliveredAt.toString(),
      approvedAt: +dto.approvedAt.toString(),
      declinedAt: +dto.declinedAt.toString(),
      withdrewAt: +dto.withdrewAt.toString(),
      refundedAt: +dto.refundedAt.toString(),
      closedAt: +dto.closedAt.toString(),
      remainingTimeToStartWork: remainingTimeToStartWork,
      remainingTimeToDeliverResult: remainingTimeToDeliverResult,
      workShouldBeStartedBefore: workShouldBeStartedBefore,
      resultShouldBeDeliveredBefore: resultShouldBeDeliveredBefore,
    }

    setContract(j)
  }, [response])

  if (isLoading) {
    return (
      <JustOneSecondBlockchain message={t('labels.loading_from_blockchain')} />
    )
  }

  if (error) {
    return (
      <ErrorWrapper
        header={t('errors.transactions.load')}
        error={errorHandler(error)}
      />
    )
  }

  if (!contractExists) {
    return (
      <ErrorWrapper
        header={t('errors.messages.not_found', {
          entity: `Contract ${contractAddress}`,
        })}
      />
    )
  }

  if (!contract) {
    return <JustOneSecond title={t('labels.initializing')} />
  }

  const isMyContract = contract.customerAddress === currentAccount

  return (
    <Grid stackable columns={1}>
      <Grid.Column textAlign="center">
        <Header as="h1" content={contract.title} />
      </Grid.Column>

      <Grid.Column>
        {isMyContract ? (
          <ContractCardForCustomer
            contract={contract}
            currentAccount={currentAccount}
            accountBalance={accountBalance}
          />
        ) : (
          <ContractCardForContractor
            contract={contract}
            currentAccount={currentAccount}
            accountBalance={accountBalance}
          />
        )}
      </Grid.Column>
    </Grid>
  )
}
