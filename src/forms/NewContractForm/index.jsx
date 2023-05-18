import React, { useState, useEffect } from 'react'
import getConfig from 'next/config'
import Link from 'next/link'
import { ethers } from 'ethers'
import {
  useContractWrite,
  usePrepareContractWrite,
  useContractEvent,
} from 'wagmi'
import {
  Step,
  List,
  Segment,
  Header,
  Grid,
  Button,
  Form,
  TextArea,
  Divider,
} from 'semantic-ui-react'
import { useDebounce } from '../../hooks/useDebounce'
import {
  isEmptyString,
  isNumber,
  isPositiveInteger,
} from '../../lib/validators'
import { errorHandler } from '../../lib/errorHandler'
import ErrorWrapper from '../../components/ErrorWrapper'
import { ConfirmTransactionMessage } from '../../components/ConfirmTransactionMessage'
import { ConfirmationMessage } from '../../components/ConfirmationMessage'
import { JustOneSecondBlockchain } from '../../components/JustOneSecond'
import { AutoFillFormDialog } from './AutoFillFormDialog'

import gigsAddContractCommandABI from '../../../contracts/GigsAddContractCommand.json'
import { ValidationErrors } from '../../components/ValidationErrors'
import useTranslation from 'next-translate/useTranslation'
import { ROUTES } from '../../lib/routes'

const { publicRuntimeConfig } = getConfig()
const {
  optriSpaceContractAddress,
  frontendNodeAddress,
  blockchainViewAddressURL,
} = publicRuntimeConfig

export const NewContractForm = ({
  dto,
  currentAccount,
  accountBalance,
  onContractCreated,
}) => {
  const { t } = useTranslation('common')

  const [displayModal, setDisplayModal] = useState(true)
  const [fillForm, setFillForm] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [value, setValue] = useState('')
  const [durationInDays, setDurationInDays] = useState('')
  const [daysToStartWork, setDaysToStartWork] = useState('')

  const debouncedTitle = useDebounce(title)
  const debouncedDescription = useDebounce(description)
  const debouncedValue = useDebounce(value)
  const debouncedDurationInDays = useDebounce(durationInDays)
  const debouncedDaysToStartWork = useDebounce(daysToStartWork)

  const [titleError, setTitleError] = useState(null)
  const [descriptionError, setDescriptionError] = useState(null)
  const [valueError, setValueError] = useState(null)
  const [daysToStartWorkError, setDaysToStartWorkError] = useState(null)
  const [durationInDaysError, setDurationInDaysError] = useState(null)

  const [isValidForm, setIsValidForm] = useState(false)
  const [validationErrors, setValidationErrors] = useState([])

  const [displayContractConfirmation, setDisplayContractConfirmation] =
    useState(false)

  const hookIsEnabled =
    !isEmptyString(debouncedTitle) &&
    !isEmptyString(debouncedDescription) &&
    !isEmptyString(debouncedValue) &&
    isNumber(debouncedValue) &&
    +debouncedValue > 0 &&
    +debouncedValue <= 100 &&
    isPositiveInteger(debouncedDurationInDays) &&
    isPositiveInteger(debouncedDaysToStartWork) &&
    +debouncedDaysToStartWork > 0 &&
    +debouncedDaysToStartWork <= 7 &&
    +debouncedDurationInDays > +debouncedDaysToStartWork &&
    +debouncedDurationInDays <= 31

  const { config, error: prepareError } = usePrepareContractWrite({
    address: optriSpaceContractAddress,
    abi: gigsAddContractCommandABI,
    functionName: 'gigsAddContract',
    args: [
      frontendNodeAddress,
      dto.jobAddress,
      dto.applicationAddress,
      debouncedTitle.trim(),
      debouncedDescription.trim(),
      ethers.utils.parseEther(
        // FIXME: We should replace 0.001 here and refactor this code
        // to not make a request to blockchain if value is not valid.
        // The problem is in validation on smart contract side: it doesn't allow to pass 0 as value.
        isNumber(debouncedValue) &&
          +debouncedValue > 0 &&
          +debouncedValue <= 100
          ? debouncedValue.toString()
          : '0.001'
      ),
      +debouncedDurationInDays,
      +debouncedDaysToStartWork,
    ],
    mode: 'prepared',
    enabled: hookIsEnabled,
    overrides: { from: currentAccount },
  })

  const {
    error: createError,
    isLoading: contractCreating,
    isSuccess: contractCreated,
    write,
  } = useContractWrite(config)

  useContractEvent({
    address: optriSpaceContractAddress,
    abi: gigsAddContractCommandABI,
    eventName: 'ContractCreated',
    listener(memberAddress, jobAddress, applicationAddress, contractAddress) {
      if (!contractCreated) return
      if (memberAddress !== currentAccount) return
      if (jobAddress !== dto.jobAddress) return
      if (applicationAddress !== dto.applicationAddress) return

      onContractCreated(contractAddress)
    },
  })

  useEffect(() => {
    if (!fillForm) return

    setTitle(dto.title)
    setDescription(dto.description)
    setValue(dto.serviceFee)
  }, [fillForm, dto])

  useEffect(() => {
    setTitleError(null)
    setDescriptionError(null)
    setValueError(null)
    setDurationInDaysError(null)
    setDaysToStartWorkError(null)

    const errors = []
    let error

    if (isEmptyString(debouncedTitle)) {
      error = t('errors.messages.empty', { field: t('contracts:model.title') })
      setTitleError(error)
      errors.push(error)
    }

    if (isEmptyString(debouncedDescription)) {
      error = t('errors.messages.empty', {
        field: t('contracts:model.description'),
      })
      setDescriptionError(error)
      errors.push(error)
    }

    if (!isEmptyString(debouncedValue) && isNumber(debouncedValue)) {
      if (+debouncedValue <= 0 || +debouncedValue > 100) {
        error = t('errors.messages.between', {
          field: t('contracts:model.value'),
          from: '0.001',
          to: '100.0',
        })
        setValueError(error)
        errors.push(error)
      }
    } else {
      error = t('errors.messages.not_a_number', {
        field: t('contracts:model.value'),
      })
      setValueError(error)
      errors.push(error)
    }

    let _durationInDaysValid = false

    if (isPositiveInteger(debouncedDurationInDays)) {
      if (+debouncedDurationInDays > 31) {
        error = t('errors.messages.between', {
          field: t('contracts:model.days_to_deliver_result'),
          from: '1',
          to: '31',
        })
        setDurationInDaysError(error)
        errors.push(error)
      } else {
        _durationInDaysValid = true
      }
    } else {
      error = t('errors.messages.greater_than', {
        field: t('contracts:model.days_to_deliver_result'),
        count: '0',
      })
      setDurationInDaysError(error)
      errors.push(error)
    }

    if (isPositiveInteger(debouncedDaysToStartWork)) {
      if (+debouncedDaysToStartWork > 7) {
        error = t('errors.messages.between', {
          field: t('contracts:model.days_to_start_work'),
          from: '1',
          to: '7',
        })
        setDaysToStartWorkError(error)
        errors.push(error)
      } else {
        if (
          _durationInDaysValid &&
          +debouncedDaysToStartWork >= +debouncedDurationInDays
        ) {
          error = t('errors.messages.less_than', {
            field: t('contracts:model.days_to_start_work'),
            count: t('contracts:model.days_to_deliver_result'),
          })
          setDaysToStartWorkError(error)
          errors.push(error)
        }
      }
    } else {
      error = t('errors.messages.greater_than', {
        field: t('contracts:model.days_to_start_work'),
        count: '0',
      })
      setDaysToStartWorkError(error)
      errors.push(error)
    }

    setIsValidForm(errors.length === 0)
    setValidationErrors(errors)
  }, [
    t,
    debouncedTitle,
    debouncedDescription,
    debouncedValue,
    debouncedDurationInDays,
    debouncedDaysToStartWork,
  ])

  if (contractCreating) {
    return <ConfirmTransactionMessage />
  }

  if (contractCreated) {
    return <JustOneSecondBlockchain />
  }

  return (
    <>
      {validationErrors.length > 0 && (
        <ValidationErrors errors={validationErrors} />
      )}

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

      {displayContractConfirmation && (
        <ConfirmationMessage
          onClose={() => setDisplayContractConfirmation(false)}
          onConfirm={() => {
            write?.()
            setDisplayContractConfirmation(false)
          }}
          confirmationButtonContent={t(
            'pages.contracts.show.customer_screen.confirm_contract_creation_message.confirm_button'
          )}
          confirmationButtonPositive
        >
          <p>
            {t(
              'pages.contracts.show.customer_screen.confirm_contract_creation_message.line1'
            )}
          </p>

          <Divider />

          <p>
            <b>
              {t(
                'pages.contracts.show.customer_screen.confirm_contract_creation_message.line2'
              )}
            </b>
          </p>
        </ConfirmationMessage>
      )}

      <Form
        onSubmit={(e) => {
          e.preventDefault()
          setDisplayContractConfirmation(true)
        }}
      >
        <Grid stackable columns={1}>
          <Grid.Column textAlign="right">
            {!fillForm && (
              <Button
                content={t('forms.contract_form.buttons.fill_form')}
                onClick={() => setFillForm(true)}
              />
            )}

            <Button
              content={t('buttons.publish')}
              primary
              disabled={!isValidForm}
            />
          </Grid.Column>

          <Grid.Column mobile={16} computer={11}>
            <Segment>
              <Header as="h3" content={t('forms.contract_form.title.label')} />

              <Form.Input
                id="title"
                error={titleError}
                placeholder=""
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={256}
                required
                autoComplete="off"
              />
            </Segment>

            <Segment>
              <Header
                as="h3"
                content={t('forms.contract_form.description.label')}
              />

              <p>
                {t('forms.contract_form.description.line1')}
                <br />
                {t('forms.contract_form.description.line2')}
                <br />
                {t('forms.contract_form.description.line3')}
              </p>

              <Form.Input
                control={TextArea}
                id="description"
                error={descriptionError}
                placeholder=""
                rows={12}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                autoComplete="off"
              />
            </Segment>

            <Segment>
              <Header
                as="h3"
                content={t('forms.contract_form.contract_lifecycle.label')}
              />

              <p>{t('forms.contract_form.contract_lifecycle.description')}</p>

              <Step.Group fluid widths={3}>
                <Step active>
                  <Step.Content
                    title={t(
                      'forms.contract_form.contract_lifecycle.steps.create.title'
                    )}
                    description={t(
                      'forms.contract_form.contract_lifecycle.steps.create.description'
                    )}
                  />
                </Step>
                <Step>
                  <Step.Content
                    title={t(
                      'forms.contract_form.contract_lifecycle.steps.accept.title'
                    )}
                    description={t(
                      'forms.contract_form.contract_lifecycle.steps.accept.description'
                    )}
                  />
                </Step>
                <Step>
                  <Step.Content
                    title={t(
                      'forms.contract_form.contract_lifecycle.steps.fund.title'
                    )}
                    description={t(
                      'forms.contract_form.contract_lifecycle.steps.fund.description'
                    )}
                  />
                </Step>
              </Step.Group>
              <Step.Group fluid widths={3}>
                <Step>
                  <Step.Content
                    title={t(
                      'forms.contract_form.contract_lifecycle.steps.start.title'
                    )}
                    description={t(
                      'forms.contract_form.contract_lifecycle.steps.start.description'
                    )}
                  />
                </Step>
                <Step>
                  <Step.Content
                    title={t(
                      'forms.contract_form.contract_lifecycle.steps.deliver.title'
                    )}
                    description={t(
                      'forms.contract_form.contract_lifecycle.steps.deliver.description'
                    )}
                  />
                </Step>
                <Step>
                  <Step.Content
                    title={t(
                      'forms.contract_form.contract_lifecycle.steps.confirm_decline.title'
                    )}
                    description={t(
                      'forms.contract_form.contract_lifecycle.steps.confirm_decline.description'
                    )}
                  />
                </Step>
              </Step.Group>
            </Segment>
          </Grid.Column>

          <Grid.Column mobile={16} computer={5}>
            <Segment>
              <Header
                as="h3"
                content={t('forms.contract_form.value.label', {
                  symbol: accountBalance.symbol,
                })}
              />

              <Form.Input
                id="value"
                error={valueError}
                placeholder=""
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
                autoComplete="off"
                maxLength={10}
              />
            </Segment>

            <Segment>
              <Header
                as="h3"
                content={t('forms.contract_form.days_to_start_work.label')}
              />

              <Form.Input
                id="daysToStartWork"
                error={daysToStartWorkError}
                min={1}
                max={7}
                step={1}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={t('labels.our_recommendation', { value: '3' })}
                value={daysToStartWork}
                onChange={(e) => setDaysToStartWork(e.target.value)}
                required
                autoComplete="off"
                maxLength={1}
              />

              <p>{t('forms.contract_form.days_to_start_work.line1')}</p>
              <p>{t('forms.contract_form.days_to_start_work.line2')}</p>
            </Segment>

            <Segment>
              <Header
                as="h3"
                content={t('forms.contract_form.days_to_deliver_result.label')}
              />

              <Form.Input
                id="durationInDays"
                error={durationInDaysError}
                min={1}
                max={31}
                step={1}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={t('labels.our_recommendation', { value: '7' })}
                value={durationInDays}
                onChange={(e) => setDurationInDays(e.target.value)}
                required
                autoComplete="off"
                maxLength={2}
              />

              <p>{t('forms.contract_form.days_to_deliver_result.line1')}</p>
              <p>
                <b>{t('forms.contract_form.days_to_deliver_result.line2')}</b>
              </p>
              <p>{t('forms.contract_form.days_to_deliver_result.line3')}</p>
              <p>{t('forms.contract_form.days_to_deliver_result.line4')}</p>
            </Segment>

            <Segment>
              <Header as="h3" content={t('forms.contract_form.meta.label')} />

              <List bulleted>
                <List.Item>
                  <Link
                    href={ROUTES.JOBS_LIST + dto.jobAddress}
                    target="_blank"
                  >
                    {t('forms.contract_form.meta.open_original_job')}
                  </Link>
                </List.Item>

                <List.Item>
                  <Link href={ROUTES.FREELANCERS_LIST + dto.applicantAddress}>
                    {t('forms.contract_form.meta.open_contractor_profile')}
                  </Link>
                </List.Item>

                <List.Item>
                  <a
                    href={`${blockchainViewAddressURL}/${dto.applicantAddress}`}
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                  >
                    {t(
                      'forms.contract_form.meta.check_contractor_transactions'
                    )}
                  </a>
                </List.Item>

                <List.Item>
                  {t('forms.contract_form.meta.job_budget', {
                    budget: dto.budget,
                    symbol: accountBalance.symbol,
                  })}
                </List.Item>

                <List.Item>
                  {t('forms.contract_form.meta.contractor_service_rate', {
                    serviceRate: dto.serviceFee,
                    symbol: accountBalance.symbol,
                  })}
                </List.Item>
              </List>
            </Segment>
          </Grid.Column>
        </Grid>
      </Form>

      <AutoFillFormDialog
        open={displayModal}
        onNoClicked={() => {
          setDisplayModal(false)
        }}
        onYesClicked={() => {
          setFillForm(true)
          setDisplayModal(false)
        }}
      />
    </>
  )
}
