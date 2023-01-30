import React, { useState } from 'react'
import getConfig from 'next/config'
import { ethers } from 'ethers'
import {
  useContractWrite,
  usePrepareContractWrite,
  useContractEvent,
} from 'wagmi'
import { Header, Grid, Button, Form } from 'semantic-ui-react'
import { useDebounce } from '../../hooks/useDebounce'
import { isEmptyString, isPositiveNumber } from '../../lib/validators'
import { errorHandler } from '../../lib/errorHandler'
import { ConfirmTransactionMessage } from '../../components/ConfirmTransactionMessage'
import ErrorWrapper from '../../components/ErrorWrapper'
import { JustOneSecondBlockchain } from '../../components/JustOneSecond'
import { FriendlyReminderMessage } from './FriendlyReminderMessage'
import gigsAddApplicationCommandABI from '../../../contracts/GigsAddApplicationCommand.json'

const { publicRuntimeConfig } = getConfig()
const { optriSpaceContractAddress, frontendNodeAddress } = publicRuntimeConfig

export const ApplicationForm = ({
  job,
  currentAccount,
  symbol,
  onApplicationCreated,
}) => {
  const [comment, setComment] = useState('')
  const [serviceFee, setServiceFee] = useState('')

  const debouncedComment = useDebounce(comment)
  const debouncedServiceFee = useDebounce(serviceFee)

  const [accepted, setAccepted] = useState(false)

  const formFilled =
    !isEmptyString(debouncedComment) && isPositiveNumber(debouncedServiceFee)

  const { config, error: prepareError } = usePrepareContractWrite({
    address: optriSpaceContractAddress,
    abi: gigsAddApplicationCommandABI,
    functionName: 'gigsAddApplication',
    args: [
      frontendNodeAddress,
      job.address,
      debouncedComment,
      ethers.utils.parseEther(
        debouncedServiceFee > 0 ? debouncedServiceFee : '0'
      ),
    ],
    mode: 'prepared',
    enabled: formFilled,
    overrides: { from: currentAccount },
  })

  const {
    error: createError,
    isLoading: applicationCreating,
    isSuccess: applicationCreated,
    write,
  } = useContractWrite({
    ...config,
  })

  useContractEvent({
    address: optriSpaceContractAddress,
    abi: gigsAddApplicationCommandABI,
    eventName: 'ApplicationCreated',
    listener(memberAddress, jobAddress) {
      if (!applicationCreated) return
      if (memberAddress !== currentAccount) return
      if (jobAddress !== job.address) return

      onApplicationCreated(debouncedComment, debouncedServiceFee)
    },
  })

  if (applicationCreating) {
    return <ConfirmTransactionMessage />
  }

  if (applicationCreated) {
    return (
      <JustOneSecondBlockchain message="Waiting for the application address..." />
    )
  }

  return (
    <>
      {createError && (
        <ErrorWrapper
          header="Unable to create an application"
          error={errorHandler(createError)}
        />
      )}

      {prepareError && (
        <ErrorWrapper
          header="Application prepare error"
          error={errorHandler(prepareError)}
        />
      )}

      <Form
        onSubmit={(e) => {
          e.preventDefault()
          write?.()
        }}
      >
        <Grid stackable columns={1}>
          {!accepted ? (
            <Grid.Column>
              <FriendlyReminderMessage onAgree={() => setAccepted(true)} />
            </Grid.Column>
          ) : (
            <>
              <Grid.Column>
                <Header as="h4">Comment:</Header>

                <Form.TextArea
                  id="comment"
                  rows={5}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </Grid.Column>

              <Grid.Column mobile={16} tablet={8} computer={8}>
                <Header as="h4">Expected service rate ({symbol}):</Header>

                <Form.Input
                  id="serviceFee"
                  type="number"
                  min={0.001}
                  step={0.001}
                  max={100.0}
                  value={serviceFee}
                  required
                  onChange={(e) => setServiceFee(e.target.value)}
                  autoComplete="off"
                />
              </Grid.Column>

              <Grid.Column>
                <Button content="Apply" primary disabled={!formFilled} />
              </Grid.Column>
            </>
          )}
        </Grid>
      </Form>
    </>
  )
}
