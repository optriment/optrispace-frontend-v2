import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import getConfig from 'next/config'
import { Header, Grid } from 'semantic-ui-react'
import { useContractRead } from 'wagmi'
import { JobCardForApplicant } from '../../../components/JobCardForApplicant'
import { JobCardForCustomer } from '../../../components/JobCardForCustomer'
import { Sidebar } from '../../../components/Sidebar'
import { errorHandler } from '../../../lib/errorHandler'
import gigsPluginContractABI from '../../../../contracts/GigsPlugin.json'
import ErrorWrapper from '../../../components/ErrorWrapper'
import JustOneSecond, {
  JustOneSecondBlockchain,
} from '../../../components/JustOneSecond'

const { publicRuntimeConfig } = getConfig()
const { optriSpaceContractAddress } = publicRuntimeConfig

export const JobScreen = ({ jobAddress, currentAccount, accountBalance }) => {
  const [job, setJob] = useState(undefined)
  const [jobExists, setJobExists] = useState(false)

  const {
    data: response,
    error: jobError,
    isLoading: jobLoading,
  } = useContractRead({
    address: optriSpaceContractAddress,
    abi: gigsPluginContractABI,
    functionName: 'gigsGetJob',
    args: [jobAddress],
    overrides: { from: currentAccount },
  })

  useEffect(() => {
    if (!response) return

    const { exists, dto } = response

    if (!exists) return

    setJobExists(true)

    const j = {
      address: dto.id,
      title: dto.title,
      description: dto.description,
      budget: ethers.utils.formatEther(dto.budget.toString()),
      applicationsCount: +dto.applicationsCount.toString(),
      customerAddress: dto.customerAddress,
      createdAt: +dto.createdAt.toString(),
      categoryCode: dto.category.code,
      categoryLabel: dto.category.label,
    }

    setJob(j)
  }, [response])

  if (jobLoading) {
    return <JustOneSecondBlockchain message="Loading job..." />
  }

  if (jobError) {
    return (
      <ErrorWrapper
        header="Error fetching job"
        error={errorHandler(jobError)}
      />
    )
  }

  if (!jobExists) {
    return <ErrorWrapper header={`Job ${jobAddress} does not exist`} />
  }

  if (!job) {
    return <JustOneSecond title="Initializing job..." />
  }

  const isMyJob = job.customerAddress === currentAccount

  return (
    <Wrapper job={job}>
      {isMyJob ? (
        <JobCardForCustomer job={job} currentAccount={currentAccount} />
      ) : (
        <JobCardForApplicant
          job={job}
          currentAccount={currentAccount}
          accountBalance={accountBalance}
        />
      )}
    </Wrapper>
  )
}

const Wrapper = ({ job, children }) => {
  const { title } = job

  return (
    <Grid stackable columns={1}>
      <Grid.Column textAlign="center">
        <Header as="h1" style={{ wordWrap: 'break-word' }}>
          {title}
        </Header>
      </Grid.Column>

      <Grid.Column>
        <Grid columns={2} stackable>
          <Grid.Column mobile={16} computer={11}>
            {children}
          </Grid.Column>

          <Grid.Column computer={5} only="computer">
            <Sidebar />
          </Grid.Column>
        </Grid>
      </Grid.Column>
    </Grid>
  )
}
