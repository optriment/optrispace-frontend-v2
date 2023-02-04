import React, { useState, useEffect } from 'react'
import getConfig from 'next/config'
import { Grid, Header } from 'semantic-ui-react'
import { FreelancersCards } from '../../../components/FreelancersCards'
import { useContractRead } from 'wagmi'

import gigsGetFreelancersQueryABI from '../../../../contracts/GigsGetFreelancersQuery.json'
import { JustOneSecondBlockchain } from '../../../components/JustOneSecond'
import { errorHandler } from '../../../lib/errorHandler'
import ErrorWrapper from '../../../components/ErrorWrapper'

const { publicRuntimeConfig } = getConfig()
const { optriSpaceContractAddress } = publicRuntimeConfig

export const FreelancersScreen = ({ currentAccount }) => {
  const {
    data: rawFreelancers,
    error: freelancersError,
    isLoading: freelancersLoading,
  } = useContractRead({
    address: optriSpaceContractAddress,
    abi: gigsGetFreelancersQueryABI,
    functionName: 'gigsGetFreelancers',
    overrides: { from: currentAccount },
  })

  const [freelancers, setFreelancers] = useState(undefined)

  // FIXME: It should be replaced with: https://wagmi.sh/react/hooks/useContractRead#select-optional
  useEffect(() => {
    if (!rawFreelancers) return

    const f = rawFreelancers.map((freelancer) => {
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

    setFreelancers(orderedFreelancers)
  }, [rawFreelancers])

  return (
    <Grid stackable columns={1}>
      <Grid.Column textAlign="center">
        <Header as="h1">Freelancers</Header>
      </Grid.Column>

      <Grid.Column>
        {freelancersLoading && (
          <JustOneSecondBlockchain message="Fetching freelancers from the blockchain..." />
        )}

        {freelancersError && (
          <ErrorWrapper
            header="Error fetching freelancers"
            error={errorHandler(freelancersError)}
          />
        )}

        {freelancers && <FreelancersCards freelancers={freelancers} />}
      </Grid.Column>
    </Grid>
  )
}
