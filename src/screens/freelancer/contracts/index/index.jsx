import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import getConfig from 'next/config'
import { Segment, Grid, Header } from 'semantic-ui-react'
import { ContractsList } from '../../../../components/ContractsList'
import { ContractsSidebar } from '../../../../components/ContractsSidebar'
import { useContractRead } from 'wagmi'
import gigsFreelancerServiceABI from '../../../../../contracts/GigsFreelancerService.json'
import { JustOneSecondBlockchain } from '../../../../components/JustOneSecond'
import { errorHandler } from '../../../../lib/errorHandler'
import ErrorWrapper from '../../../../components/ErrorWrapper'
import useTranslation from 'next-translate/useTranslation'
import { useContractsFilter } from '../../../../hooks/useContractsFilter'

const { publicRuntimeConfig } = getConfig()
const { optriSpaceContractAddress } = publicRuntimeConfig

export const ContractsScreen = ({ currentAccount }) => {
  const { t } = useTranslation('common')

  const {
    data: rawData,
    error,
    isLoading,
  } = useContractRead({
    address: optriSpaceContractAddress,
    abi: gigsFreelancerServiceABI,
    functionName: 'gigsGetContractsAsContractor',
    overrides: { from: currentAccount },
  })

  const [data, setData] = useState(undefined)
  const [filters, setFilters] = useState({})
  const filteredContracts = useContractsFilter({ data, filters })

  const onFilterChanged = (f) => {
    setFilters(f)
  }

  // FIXME: It should be replaced with: https://wagmi.sh/react/hooks/useContractRead#select-optional
  useEffect(() => {
    if (!rawData) return

    const j = rawData.map((contract) => {
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

    setData(orderedContracts)
  }, [rawData])

  return (
    <Grid stackable columns={1}>
      <Grid.Column textAlign="center">
        <Header
          as="h1"
          content={t('pages.freelancer.contracts.index.header.title')}
        />
      </Grid.Column>

      <Grid.Column>
        <Grid columns={2} stackable>
          <Grid.Column mobile={16} computer={11}>
            {isLoading && (
              <JustOneSecondBlockchain
                message={t('labels.loading_from_blockchain')}
              />
            )}

            {error && (
              <ErrorWrapper
                header={t('errors.transactions.load')}
                error={errorHandler(error)}
              />
            )}

            {data && (
              <>
                {filteredContracts.length > 0 ? (
                  <ContractsList
                    contracts={filteredContracts}
                    as="freelancer"
                  />
                ) : (
                  <Segment>
                    <p>{t('pages.freelancer.contracts.index.no_records')}</p>
                  </Segment>
                )}
              </>
            )}
          </Grid.Column>

          <Grid.Column computer={5} only="computer">
            <ContractsSidebar
              as="freelancer"
              onFilterChanged={onFilterChanged}
            />
          </Grid.Column>
        </Grid>
      </Grid.Column>
    </Grid>
  )
}
