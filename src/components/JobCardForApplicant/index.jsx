import React, { useState, useEffect } from 'react'
import getConfig from 'next/config'
import Link from 'next/link'
import { ethers } from 'ethers'
import { Message, Segment, Header, Grid } from 'semantic-ui-react'
import { ApplicationForm } from '../../forms/ApplicationForm'
import ErrorWrapper from '../ErrorWrapper'
import { JobCardHeader } from '../JobCardHeader'
import JustOneSecond, { JustOneSecondBlockchain } from '../JustOneSecond'
import { useContractRead } from 'wagmi'
import gigsFreelancerServiceABI from '../../../contracts/GigsFreelancerService.json'
import { InsufficientBalance } from '../InsufficientBalance'
import { ApplicationCreatedMessage } from './ApplicationCreatedMessage'
import useTranslation from 'next-translate/useTranslation'
import { errorHandler } from '../../lib/errorHandler'

const { publicRuntimeConfig } = getConfig()
const { optriSpaceContractAddress, blockchainViewAddressURL } =
  publicRuntimeConfig

export const JobCardForApplicant = ({
  job,
  currentAccount,
  accountBalance,
}) => {
  const { t } = useTranslation('common')

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
    return (
      <JustOneSecondBlockchain message={t('labels.loading_from_blockchain')} />
    )
  }

  if (applicationError) {
    return (
      <ErrorWrapper
        header={t('errors.transactions.load')}
        error={errorHandler(applicationError)}
      />
    )
  }

  if (!application) {
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
          <Header as="h3" content={t('pages.jobs.show.apply_for_this_job')} />
          {isExists || applicationCreated ? (
            <>
              {application.hasContract ? (
                <Message positive>
                  <Message.Header
                    content={t(
                      'pages.jobs.show.application.you_have_a_contract'
                    )}
                  />
                  <p>
                    <Link
                      href="/contracts/[id]"
                      as={`/contracts/${application.contractAddress}`}
                      passHref
                    >
                      <a>
                        {t(
                          'pages.jobs.show.application.click_here_to_open_contract'
                        )}
                      </a>
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
              {+accountBalance.formatted > 0 ? (
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
