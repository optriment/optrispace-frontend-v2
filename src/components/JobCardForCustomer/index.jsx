import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import getConfig from 'next/config'
import { Header, Segment, Grid } from 'semantic-ui-react'
import { JobCardHeader } from '../JobCardHeader'
import Applications from './Applications'
import JustOneSecond from '../JustOneSecond'
import ErrorWrapper from '../ErrorWrapper'
import { useContractRead } from 'wagmi'
import gigsCustomerServiceABI from '../../../contracts/GigsCustomerService.json'

const { publicRuntimeConfig } = getConfig()
const { optriSpaceContractAddress, blockchainViewAddressURL } =
  publicRuntimeConfig

export const JobCardForCustomer = ({ job, currentAccount }) => {
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
    return <ErrorWrapper header="You do not have access to this job" />
  }

  if (applicationsLoading) {
    return <JustOneSecond title="Loading applications..." />
  }

  if (applicationsError) {
    return (
      <ErrorWrapper
        header="Unable to load applications"
        error={applicationsError.message}
      />
    )
  }

  if (!applications) {
    return <JustOneSecond title="Initializing applications..." />
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

      {job.applicationsCount > 0 && (
        <Grid.Column>
          <Segment>
            <Header as="h3">{`Applications (${job.applicationsCount})`}</Header>

            <Applications
              applications={applications}
              blockchainViewAddressURL={blockchainViewAddressURL}
            />
          </Segment>
        </Grid.Column>
      )}
    </Grid>
  )
}
