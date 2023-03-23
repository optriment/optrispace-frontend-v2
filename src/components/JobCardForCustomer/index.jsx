import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import getConfig from 'next/config'
import { Header, Segment, Grid } from 'semantic-ui-react'
import { JobCardHeader } from '../JobCardHeader'
import Applications from './Applications'
import JustOneSecond, { JustOneSecondBlockchain } from '../JustOneSecond'
import ErrorWrapper from '../ErrorWrapper'
import { useContractRead } from 'wagmi'
import gigsCustomerServiceABI from '../../../contracts/GigsCustomerService.json'
import useTranslation from 'next-translate/useTranslation'
import { errorHandler } from '../../lib/errorHandler'

const { publicRuntimeConfig } = getConfig()
const { optriSpaceContractAddress, blockchainViewAddressURL } =
  publicRuntimeConfig

export const JobCardForCustomer = ({ job, currentAccount }) => {
  const { t } = useTranslation('common')

  const {
    data: rawApplications,
    error: applicationsError,
    isLoading: applicationsLoading,
  } = useContractRead({
    address: optriSpaceContractAddress,
    abi: gigsCustomerServiceABI,
    functionName: 'gigsGetApplications',
    args: [job.address],
    overrides: { from: currentAccount },
  })

  const [applications, setApplications] = useState(undefined)

  // FIXME: It should be replaced with: https://wagmi.sh/react/hooks/useContractRead#select-optional
  useEffect(() => {
    if (!rawApplications) return

    const a = rawApplications.map((application) => {
      return {
        address: application.id,
        jobAddress: application.jobAddress,
        contractAddress: application.contractAddress,
        hasContract: application.hasContract,
        comment: application.comment,
        serviceFee: ethers.utils.formatEther(application.serviceFee.toString()),
        customerAddress: application.customerAddress,
        applicantAddress: application.applicantAddress,
        createdAt: +application.createdAt.toString(),
      }
    })

    const orderedApplications = a.slice().sort((a, b) => {
      return b.createdAt - +a.createdAt
    })

    setApplications(orderedApplications)
  }, [rawApplications])

  if (job.customerAddress !== currentAccount) {
    return <ErrorWrapper header={t('labels.access_denied')} />
  }

  if (applicationsLoading) {
    return (
      <JustOneSecondBlockchain message={t('labels.loading_from_blockchain')} />
    )
  }

  if (applicationsError) {
    return (
      <ErrorWrapper
        header={t('errors.transactions.load')}
        error={errorHandler(applicationsError)}
      />
    )
  }

  if (!applications) {
    return <JustOneSecond title={t('labels.initializing')} />
  }

  return (
    <Grid stackable columns={1}>
      <Grid.Column>
        <Segment>
          <JobCardHeader
            job={job}
            blockchainViewAddressURL={blockchainViewAddressURL}
          />
        </Segment>
      </Grid.Column>

      <Grid.Column>
        <Segment>
          <Header
            as="h3"
            content={t('pages.jobs.show.applications.header', {
              count: job.applicationsCount,
            })}
          />

          {job.applicationsCount > 0 ? (
            <Applications
              applications={applications}
              blockchainViewAddressURL={blockchainViewAddressURL}
            />
          ) : (
            <p>{t('pages.jobs.show.applications.no_records')}</p>
          )}
        </Segment>
      </Grid.Column>
    </Grid>
  )
}
