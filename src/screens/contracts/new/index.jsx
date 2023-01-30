import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import getConfig from 'next/config'
import { Header, Grid } from 'semantic-ui-react'
import { useContractRead } from 'wagmi'
import { errorHandler } from '../../../lib/errorHandler'
import gigsCustomerServiceABI from '../../../../contracts/GigsCustomerService.json'
import ErrorWrapper from '../../../components/ErrorWrapper'
import { NewContractForm } from '../../../forms/NewContractForm'

import JustOneSecond, {
  JustOneSecondBlockchain,
} from '../../../components/JustOneSecond'

const { publicRuntimeConfig } = getConfig()
const { optriSpaceContractAddress } = publicRuntimeConfig

export const NewContractScreen = ({
  jobAddress,
  applicationAddress,
  currentAccount,
  accountBalance,
}) => {
  const router = useRouter()

  const [dto, setDTO] = useState(undefined)

  const onContractCreated = (contractAddress) => {
    router.push(`/contracts/${contractAddress}`)
  }

  const {
    data: response,
    error: jobAndApplicationForContractError,
    isLoading: jobAndApplicationForContractLoading,
  } = useContractRead({
    address: optriSpaceContractAddress,
    abi: gigsCustomerServiceABI,
    functionName: 'gigsGetJobAndApplicationForContract',
    args: [jobAddress, applicationAddress],
    overrides: { from: currentAccount },
  })

  useEffect(() => {
    if (!response) return

    const d = {
      jobAddress: response.jobAddress,
      applicationAddress: response.applicationAddress,
      applicantAddress: response.applicantAddress,
      title: response.title,
      description: response.description,
      budget: ethers.utils.formatEther(response.budget),
      comment: response.comment,
      serviceFee: ethers.utils.formatEther(response.serviceFee),
    }

    setDTO(d)
  }, [response])

  if (jobAndApplicationForContractLoading) {
    return (
      <JustOneSecondBlockchain message="Validating job and application..." />
    )
  }

  if (jobAndApplicationForContractError) {
    return (
      <ErrorWrapper
        header="Error validating job and application"
        error={errorHandler(jobAndApplicationForContractError)}
      />
    )
  }

  if (!dto) {
    return <JustOneSecond title="Initializing job and application..." />
  }

  return (
    <Grid stackable columns={1}>
      <Grid.Column textAlign="center">
        <Header as="h1">Add New Contract</Header>
      </Grid.Column>

      <Grid.Column>
        <NewContractForm
          dto={dto}
          currentAccount={currentAccount}
          accountBalance={accountBalance}
          onContractCreated={onContractCreated}
        />
      </Grid.Column>
    </Grid>
  )
}
