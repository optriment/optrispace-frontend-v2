import React, { useState, useEffect } from 'react'
import getConfig from 'next/config'
import { ethers } from 'ethers'
import {
  useContractWrite,
  usePrepareContractWrite,
  useContractEvent,
} from 'wagmi'
import { Header, Grid, Button, Form, Label } from 'semantic-ui-react'
import { useDebounce } from '../../hooks/useDebounce'
import { isEmptyString, isNumber } from '../../lib/validators'
import { errorHandler } from '../../lib/errorHandler'
import { ConfirmTransactionMessage } from '../../components/ConfirmTransactionMessage'
import ErrorWrapper from '../../components/ErrorWrapper'
import { JustOneSecondBlockchain } from '../../components/JustOneSecond'
import { FriendlyReminderMessage } from './FriendlyReminderMessage'
import gigsAddApplicationCommandABI from '../../../contracts/GigsAddApplicationCommand.json'
import { ValidationErrors } from '../../components/ValidationErrors'
import { useConversionRate } from '../../hooks/useConversionRate'
import useTranslation from 'next-translate/useTranslation'

const { publicRuntimeConfig } = getConfig()
const { optriSpaceContractAddress, frontendNodeAddress, gitHubLink } =
  publicRuntimeConfig

export const ApplicationForm = ({
  job,
  currentAccount,
  symbol,
  onApplicationCreated,
}) => {
  const { t } = useTranslation('common')

  const [comment, setComment] = useState('')
  const [serviceFee, setServiceFee] = useState('')

  const debouncedComment = useDebounce(comment)
  const debouncedServiceFee = useDebounce(serviceFee)

  const [commentError, setCommentError] = useState(null)
  const [serviceFeeError, setServiceFeeError] = useState(null)

  const [isValidForm, setIsValidForm] = useState(false)
  const [validationErrors, setValidationErrors] = useState([])

  const [accepted, setAccepted] = useState(false)

  const conversionRate = useConversionRate()

  const hookIsEnabled =
    !isEmptyString(debouncedComment) &&
    !isEmptyString(debouncedServiceFee) &&
    isNumber(debouncedServiceFee) &&
    +debouncedServiceFee > 0 &&
    +debouncedServiceFee <= 100

  const { config, error: prepareError } = usePrepareContractWrite({
    address: optriSpaceContractAddress,
    abi: gigsAddApplicationCommandABI,
    functionName: 'gigsAddApplication',
    args: [
      frontendNodeAddress,
      job.address,
      debouncedComment.trim(),
      ethers.utils.parseEther(
        // FIXME: We should replace 0.01 here and refactor this code
        // to not make a request to blockchain if value is not valid.
        // The problem is in validation on smart contract side: it doesn't allow to pass 0 as value.
        isNumber(debouncedServiceFee) &&
          +debouncedServiceFee > 0 &&
          +debouncedServiceFee <= 100
          ? debouncedServiceFee.toString()
          : '0.001'
      ),
    ],
    mode: 'prepared',
    enabled: hookIsEnabled,
    overrides: { from: currentAccount },
  })

  const {
    error: createError,
    isLoading: applicationCreating,
    isSuccess: applicationCreated,
    write,
  } = useContractWrite(config)

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

  useEffect(() => {
    setIsValidForm(false)
    setCommentError(null)
    setServiceFeeError(null)

    const errors = []
    let error

    if (isEmptyString(debouncedComment)) {
      error = t('errors.messages.empty', {
        field: t('applications:model.comment'),
      })
      setCommentError(error)
      errors.push(error)
    }

    if (!isEmptyString(debouncedServiceFee) && isNumber(debouncedServiceFee)) {
      if (+debouncedServiceFee <= 0 || +debouncedServiceFee > 100) {
        error = t('errors.messages.between', {
          field: t('applications:model.service_rate'),
          from: '0.001',
          to: '100.0',
        })
        setServiceFeeError(error)
        errors.push(error)
      }
    } else {
      error = t('errors.messages.not_a_number', {
        field: t('applications:model.service_rate'),
      })
      setServiceFeeError(error)
      errors.push(error)
    }

    setIsValidForm(errors.length === 0)
    setValidationErrors(errors)
  }, [t, debouncedComment, debouncedServiceFee])

  if (applicationCreating) {
    return <ConfirmTransactionMessage />
  }

  if (applicationCreated) {
    return <JustOneSecondBlockchain />
  }

  return (
    <>
      {createError && (
        <ErrorWrapper
          header={t('errors.transactions.execute')}
          error={errorHandler(createError)}
        />
      )}

      {prepareError && (
        <ErrorWrapper
          header={t('errors.transactions.prepare')}
          error={errorHandler(prepareError)}
        />
      )}

      {accepted ? (
        <>
          {validationErrors.length > 0 && (
            <ValidationErrors errors={validationErrors} />
          )}

          <Form
            onSubmit={(e) => {
              e.preventDefault()
              write?.()
            }}
          >
            <Grid stackable columns={1}>
              <Grid.Column>
                <Header
                  as="h4"
                  content={t('forms.application_form.comment.label')}
                />

                <Form.TextArea
                  id="comment"
                  error={commentError}
                  rows={5}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </Grid.Column>

              <Grid.Column mobile={16} tablet={8} computer={8}>
                <Header
                  as="h4"
                  content={t('forms.application_form.service_rate.label', {
                    symbol: symbol,
                  })}
                />

                <Form.Input
                  id="serviceFee"
                  error={serviceFeeError}
                  placeholder=""
                  value={serviceFee}
                  required
                  onChange={(e) => setServiceFee(e.target.value)}
                  autoComplete="off"
                  maxLength={10}
                  labelPosition="right"
                >
                  <input />
                  <Label>
                    {serviceFee > 0 && !serviceFeeError
                      ? `~ $${(conversionRate * serviceFee).toFixed(2)}`
                      : '~$0'}
                  </Label>
                </Form.Input>
              </Grid.Column>

              <Grid.Column>
                <Button
                  content={t('buttons.apply')}
                  primary
                  disabled={!isValidForm}
                />
              </Grid.Column>
            </Grid>
          </Form>
        </>
      ) : (
        <Grid.Column>
          <FriendlyReminderMessage
            onAgree={() => setAccepted(true)}
            gitHubLink={gitHubLink}
          />
        </Grid.Column>
      )}
    </>
  )
}
