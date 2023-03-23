import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import getConfig from 'next/config'
import { Segment, Grid, Header, Button } from 'semantic-ui-react'
import { JobsList } from '../../../../components/JobsList'
import { JobsSidebar } from '../../../../components/JobsSidebar'
import { useContractRead } from 'wagmi'
import gigsCustomerServiceABI from '../../../../../contracts/GigsCustomerService.json'
import { JustOneSecondBlockchain } from '../../../../components/JustOneSecond'
import { errorHandler } from '../../../../lib/errorHandler'
import ErrorWrapper from '../../../../components/ErrorWrapper'
import useTranslation from 'next-translate/useTranslation'

const { publicRuntimeConfig } = getConfig()
const { optriSpaceContractAddress } = publicRuntimeConfig

export const JobsScreen = ({ currentAccount }) => {
  const { t } = useTranslation('common')

  const {
    data: rawData,
    error,
    isLoading,
  } = useContractRead({
    address: optriSpaceContractAddress,
    abi: gigsCustomerServiceABI,
    functionName: 'gigsGetMyJobs',
    overrides: { from: currentAccount },
  })

  const [data, setData] = useState(undefined)

  // FIXME: It should be replaced with: https://wagmi.sh/react/hooks/useContractRead#select-optional
  useEffect(() => {
    if (!rawData) return

    const j = rawData.map((job) => {
      return {
        address: job.id,
        title: job.title,
        description: job.description,
        budget: ethers.utils.formatEther(job.budget.toString()),
        applicationsCount: +job.applicationsCount.toString(),
        categoryCode: job.category.code,
        categoryLabel: job.category.label,
        owner: job.owner,
        createdAt: +job.createdAt.toString(),
      }
    })

    const orderedJobs = j.slice().sort((a, b) => {
      return +b.createdAt - +a.createdAt
    })

    setData(orderedJobs)
  }, [rawData])

  return (
    <Grid stackable columns={1}>
      <Grid.Column textAlign="center">
        <Header as="h1" content={t('pages.customer.jobs.index.header.title')} />
      </Grid.Column>

      <Grid.Column>
        <Button
          as="a"
          primary
          href="/jobs/new"
          floated="right"
          content={t('buttons.add_new')}
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
                {data.length > 0 ? (
                  <JobsList jobs={data} />
                ) : (
                  <Segment>
                    <p>{t('pages.customer.jobs.index.no_records')}</p>
                  </Segment>
                )}
              </>
            )}
          </Grid.Column>

          <Grid.Column computer={5} only="computer">
            <JobsSidebar />
          </Grid.Column>
        </Grid>
      </Grid.Column>
    </Grid>
  )
}
