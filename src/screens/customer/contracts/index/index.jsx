import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import getConfig from 'next/config'
import { Grid, Header } from 'semantic-ui-react'
import { ContractsList } from '../../../../components/ContractsList'
import { ContractsSidebar } from '../../../../components/ContractsSidebar'
import { useContractRead } from 'wagmi'

import gigsCustomerServiceABI from '../../../../../contracts/GigsCustomerService.json'
import { JustOneSecondBlockchain } from '../../../../components/JustOneSecond'
import { errorHandler } from '../../../../lib/errorHandler'
import ErrorWrapper from '../../../../components/ErrorWrapper'

const { publicRuntimeConfig } = getConfig()
const { optriSpaceContractAddress } = publicRuntimeConfig

export const ContractsScreen = ({ currentAccount }) => {
  const {
    data: rawContracts,
    error: contractsError,
    isLoading: contractsLoading,
  } = useContractRead({
    address: optriSpaceContractAddress,
    abi: gigsCustomerServiceABI,
    functionName: 'gigsGetContractsAsCustomer',
    overrides: { from: currentAccount },
  })

  const [contracts, setContracts] = useState(undefined)

  // FIXME: It should be replaced with: https://wagmi.sh/react/hooks/useContractRead#select-optional
  useEffect(() => {
    if (!rawContracts) return

    const j = rawContracts.map((contract) => {
      return {
        address: contract.id,
        customerAddress: contract.customerAddress,
        contractorAddress: contract.contractorAddress,
        title: contract.title,
        description: contract.description,
        value: ethers.utils.formatEther(contract.value.toString()),
        durationInDays: +contract.durationInDays,
        daysToBeginWork: +contract.daysToBeginWork,
        status: contract.status,
        createdAt: +contract.createdAt.toString(),
      }
    })

    const orderedContracts = j.slice().sort((a, b) => {
      return +b.createdAt - +a.createdAt
    })

    setContracts(orderedContracts)
  }, [rawContracts])

  return (
    <Grid stackable columns={1}>
      <Grid.Column textAlign="center">
        <Header as="h1">My Contracts as Customer</Header>
      </Grid.Column>

      <Grid.Column>
        <Grid columns={2} stackable>
          <Grid.Column mobile={16} computer={11}>
            {contractsLoading && (
              <JustOneSecondBlockchain message="Fetching contracts from the blockchain..." />
            )}

            {contractsError && (
              <ErrorWrapper
                header="Error fetching contracts"
                error={errorHandler(contractsError)}
              />
            )}

            {contracts && <ContractsList contracts={contracts} as="customer" />}
          </Grid.Column>

          <Grid.Column computer={5} only="computer">
            <ContractsSidebar as="customer" />
          </Grid.Column>
        </Grid>
      </Grid.Column>
    </Grid>
  )
}
