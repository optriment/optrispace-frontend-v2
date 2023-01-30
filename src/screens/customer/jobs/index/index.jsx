import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import getConfig from 'next/config'
import { Grid, Header, Button } from 'semantic-ui-react'
import { JobsList } from '../../../../components/JobsList'
import { JobsSidebar } from '../../../../components/JobsSidebar'
import { useContractRead } from 'wagmi'

import gigsCustomerServiceABI from '../../../../../contracts/GigsCustomerService.json'
import { JustOneSecondBlockchain } from '../../../../components/JustOneSecond'
import { errorHandler } from '../../../../lib/errorHandler'
import ErrorWrapper from '../../../../components/ErrorWrapper'

const { publicRuntimeConfig } = getConfig()
const { optriSpaceContractAddress } = publicRuntimeConfig

export const JobsScreen = ({ currentAccount }) => {
  const {
    data: rawJobs,
    error: jobsError,
    isLoading: jobsLoading,
  } = useContractRead({
    address: optriSpaceContractAddress,
    abi: gigsCustomerServiceABI,
    functionName: 'gigsGetMyJobs',
    overrides: { from: currentAccount },
  })

  const [jobs, setJobs] = useState(undefined)

  // FIXME: It should be replaced with: https://wagmi.sh/react/hooks/useContractRead#select-optional
  useEffect(() => {
    if (!rawJobs) return

    const j = rawJobs.map((job) => {
      return {
        address: job.id,
        title: job.title,
        description: job.description,
        budget: ethers.utils.formatEther(job.budget.toString()),
        applicationsCount: +job.applicationsCount.toString(),
        categoryCode: job.categoryCode,
        categoryLabel: job.categoryLabel,
        owner: job.owner,
        createdAt: +job.createdAt.toString(),
      }
    })

    const orderedJobs = j.slice().sort((a, b) => {
      return +b.createdAt - +a.createdAt
    })

    setJobs(orderedJobs)
  }, [rawJobs])

  return (
    <Grid stackable columns={1}>
      <Grid.Column textAlign="center">
        <Header as="h1" content="My Jobs" />
      </Grid.Column>

      <Grid.Column>
        <Button
          as="a"
          primary
          href="/jobs/new"
          floated="right"
          content="Post New Job"
        />
      </Grid.Column>

      <Grid.Column>
        <Grid columns={2} stackable>
          <Grid.Column mobile={16} computer={11}>
            {jobsLoading && (
              <JustOneSecondBlockchain message="Fetching jobs from the blockchain..." />
            )}

            {jobsError && (
              <ErrorWrapper
                header="Error fetching jobs"
                error={errorHandler(jobsError)}
              />
            )}

            {jobs && <JobsList jobs={jobs} />}
          </Grid.Column>

          <Grid.Column computer={5} only="computer">
            <JobsSidebar />
          </Grid.Column>
        </Grid>
      </Grid.Column>
    </Grid>
  )
}
