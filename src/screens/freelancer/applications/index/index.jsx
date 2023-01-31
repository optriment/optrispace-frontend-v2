import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import getConfig from 'next/config'
import { Grid, Header } from 'semantic-ui-react'
import { MyApplicationsList } from '../../../../components/MyApplicationsList'
import { useContractRead } from 'wagmi'

import gigsGetMyApplicationsQueryABI from '../../../../../contracts/GigsGetMyApplicationsQuery.json'
import { JustOneSecondBlockchain } from '../../../../components/JustOneSecond'
import { errorHandler } from '../../../../lib/errorHandler'
import ErrorWrapper from '../../../../components/ErrorWrapper'

const { publicRuntimeConfig } = getConfig()
const { optriSpaceContractAddress } = publicRuntimeConfig

export const ApplicationsScreen = ({ currentAccount }) => {
  const {
    data: rawApplications,
    error: applicationsError,
    isLoading: applicationsLoading,
  } = useContractRead({
    address: optriSpaceContractAddress,
    abi: gigsGetMyApplicationsQueryABI,
    functionName: 'gigsGetMyApplications',
    overrides: { from: currentAccount },
  })

  const [applications, setApplications] = useState(undefined)

  // FIXME: It should be replaced with: https://wagmi.sh/react/hooks/useContractRead#select-optional
  useEffect(() => {
    if (!rawApplications) return

    const j = rawApplications.map((application) => {
      return {
        address: application.applicationAddress,
        jobAddress: application.jobAddress,
        contractAddress: application.contractAddress,
        hasContract: application.hasContract,
        jobTitle: application.jobTitle,
        jobDescription: application.jobDescription,
        applicationComment: application.applicationComment,
        jobCategoryCode: application.jobCategoryCode,
        jobCategoryLabel: application.jobCategoryLabel,
        jobBudget: ethers.utils.formatEther(application.jobBudget.toString()),
        applicationServiceFee: ethers.utils.formatEther(
          application.applicationServiceFee.toString()
        ),
        applicationCreatedAt: +application.applicationCreatedAt.toString(),
      }
    })

    const orderedApplications = j.slice().sort((a, b) => {
      return +b.applicationCreatedAt - +a.applicationCreatedAt
    })

    setApplications(orderedApplications)
  }, [rawApplications])

  return (
    <Grid stackable columns={1}>
      <Grid.Column textAlign="center">
        <Header as="h1" content="My Applications" />
      </Grid.Column>

      <Grid.Column>
        {applicationsLoading && (
          <JustOneSecondBlockchain message="Fetching applications from the blockchain..." />
        )}

        {applicationsError && (
          <ErrorWrapper
            header="Error fetching applications"
            error={errorHandler(applicationsError)}
          />
        )}

        {applications && <MyApplicationsList applications={applications} />}
      </Grid.Column>
    </Grid>
  )
}
