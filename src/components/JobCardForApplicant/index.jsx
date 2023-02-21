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
const AVG_PRICE_API_URL =
  'https://api.binance.com/api/v3/avgPrice?symbol=BNBBUSD'

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
  const [conversionRate, setConversionRate] = useState(0)

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

  function fetchBnbPrice() {
    fetch(AVG_PRICE_API_URL)
      .then((res) => res.json())
      .then((data) => {
        setConversionRate(data.price)
      })
      .catch(() => {
        setConversionRate(0)
      })
  }

  useEffect(() => {
    fetchBnbPrice()
  }, [])

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
                  conversionRate={conversionRate}
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
