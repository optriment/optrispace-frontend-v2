import React, { useState, useEffect } from 'react'
import getConfig from 'next/config'
import { Segment, Grid, Header } from 'semantic-ui-react'
import { FreelancersCards } from '../../../components/FreelancersCards'
import { useContractRead } from 'wagmi'
import gigsGetFreelancersQueryABI from '../../../../contracts/GigsGetFreelancersQuery.json'
import { JustOneSecondBlockchain } from '../../../components/JustOneSecond'
import { errorHandler } from '../../../lib/errorHandler'
import ErrorWrapper from '../../../components/ErrorWrapper'
import useTranslation from 'next-translate/useTranslation'

const { publicRuntimeConfig } = getConfig()
const { optriSpaceContractAddress } = publicRuntimeConfig

export const FreelancersScreen = ({ currentAccount }) => {
  const { t } = useTranslation('common')

  const {
    data: rawData,
    error,
    isLoading,
  } = useContractRead({
    address: optriSpaceContractAddress,
    abi: gigsGetFreelancersQueryABI,
    functionName: 'gigsGetFreelancers',
    overrides: { from: currentAccount },
  })

  const [data, setData] = useState(undefined)

  // FIXME: It should be replaced with: https://wagmi.sh/react/hooks/useContractRead#select-optional
  useEffect(() => {
    if (!rawData) return

    const f = rawData.map((freelancer) => {
      return {
        address: freelancer.id,
        displayName: freelancer.displayName,
        about: freelancer.about,
        lastActivityAt: +freelancer.lastActivityAt.toString(),
        totalContractsCount: +freelancer.totalContractsCount,
        failedContractsCount: +freelancer.failedContractsCount,
        succeededContractsCount: +freelancer.succeededContractsCount,
        skills: '',
      }
    })

    const orderedFreelancers = f.slice().sort((a, b) => {
      return +b.lastActivityAt - +a.lastActivityAt
    })

    setData(orderedFreelancers)
  }, [rawData])

  return (
    <Grid stackable columns={1}>
      <Grid.Column textAlign="center">
        <Header as="h1" content={t('pages.freelancers.index.header.title')} />
      </Grid.Column>

      <Grid.Column>
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
            {data.length > 0 ? (
              <FreelancersCards freelancers={data} />
            ) : (
              <Segment>
                <p>{t('pages.freelancers.index.no_records')}</p>
              </Segment>
            )}
          </>
        )}
      </Grid.Column>
    </Grid>
  )
}
