import React, { useState, useEffect } from 'react'
import getConfig from 'next/config'
import Link from 'next/link'
import { ethers } from 'ethers'
import { Message, Segment, Header, Grid } from 'semantic-ui-react'
import { ApplicationForm } from '../../forms/ApplicationForm'
import ErrorWrapper from '../ErrorWrapper'
import { JobCardHeader } from '../JobCardHeader'
import JustOneSecond from '../JustOneSecond'
import { useContractRead } from 'wagmi'
import gigsFreelancerServiceABI from '../../../contracts/GigsFreelancerService.json'
import { InsufficientBalance } from '../InsufficientBalance'
import { ApplicationCreatedMessage } from './ApplicationCreatedMessage'

const { publicRuntimeConfig } = getConfig()
const { optriSpaceContractAddress, blockchainViewAddressURL } =
  publicRuntimeConfig

export const JobCardForApplicant = ({
  job,
  currentAccount,
  accountBalance,
}) => {
  const {
    data: response,
    error: applicationError,
    isLoading: applicationLoading,
  } = useContractRead({
    address: optriSpaceContractAddress,
    abi: gigsFreelancerServiceABI,
    functionName: 'gigsGetMyApplication',
    args: [job.address],
    overrides: { from: currentAccount },
  })

  const [application, setApplication] = useState(undefined)
  const [isExists, setIsExists] = useState(false)
  const [applicationCreated, setApplicationCreated] = useState(false)
  const [comment, setComment] = useState('')
  const [serviceFee, setServiceFee] = useState('')

  const onApplicationCreated = (comment, serviceFee) => {
    setApplicationCreated(true)
    setComment(comment)
    setServiceFee(serviceFee)
  }

  useEffect(() => {
    if (!response) return

    const { exists, dto: rawApplication } = response

    setIsExists(exists)

    const a = {
      address: rawApplication.id,
      hasContract: rawApplication.hasContract,
      contractAddress: rawApplication.contractAddress,
      comment: rawApplication.comment,
      serviceFee: ethers.utils.formatEther(
        rawApplication.serviceFee.toString()
      ),
      createdAt: +rawApplication.createdAt.toString(),
    }

    setComment(a.comment)
    setServiceFee(a.serviceFee)

    setApplication(a)
  }, [response])

  if (applicationLoading) {
    return <JustOneSecond title="Fetching application..." />
  }

  if (applicationError) {
    return (
      <ErrorWrapper
        header="Error fetching application"
        error={applicationError.message}
      />
    )
  }

  if (!application) {
    return <JustOneSecond title="Initializing application..." />
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
          <Header as="h3">Apply for this job</Header>
          {isExists || applicationCreated ? (
            <>
              {application.hasContract ? (
                <Message positive>
                  <Message.Header>You have a contract</Message.Header>
                  <p>
                    <Link
                      href="/contracts/[id]"
                      as={`/contracts/${application.contractAddress}`}
                      passHref
                    >
                      <a>Click here to open contract</a>
                    </Link>
                  </p>
                </Message>
              ) : (
                <ApplicationCreatedMessage
                  comment={comment}
                  serviceFee={serviceFee}
                  symbol={accountBalance.symbol}
                />
              )}
            </>
          ) : (
            <>
              {accountBalance.formatted > 0 ? (
                <ApplicationForm
                  job={job}
                  currentAccount={currentAccount}
                  symbol={accountBalance.symbol}
                  onApplicationCreated={onApplicationCreated}
                />
              ) : (
                <InsufficientBalance />
              )}
            </>
          )}
        </Segment>
      </Grid.Column>
    </Grid>
  )
}
