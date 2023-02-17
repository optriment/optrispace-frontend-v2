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
import { JustOneSecondBlockchain } from '../../components/JustOneSecond'
import { AutoFillFormDialog } from './AutoFillFormDialog'

import gigsAddContractCommandABI from '../../../contracts/GigsAddContractCommand.json'
import { ValidationErrors } from '../../components/ValidationErrors'

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
      error = 'Title must be filled'
      setTitleError(error)
      errors.push(error)
    }

    if (isEmptyString(debouncedDescription)) {
      error = 'Description must be filled'
      setDescriptionError(error)
      errors.push(error)
    }

    if (!isEmptyString(debouncedValue) && isNumber(debouncedValue)) {
      if (+debouncedValue <= 0 || +debouncedValue > 100) {
        error = 'Value must be greater than zero and less or equal to 100'
        setValueError(error)
        errors.push(error)
      }
    } else {
      error = 'Contract value must be a number'
      setValueError(error)
      errors.push(error)
    }

    let _durationInDaysValid = false

    if (isPositiveInteger(debouncedDurationInDays)) {
      if (+debouncedDurationInDays > 31) {
        error = 'Days to deliver result must be between 1-31'
        setDurationInDaysError(error)
        errors.push(error)
      } else {
        _durationInDaysValid = true
      }
    } else {
      error = 'Days to deliver result must be greater than zero'
      setDurationInDaysError(error)
      errors.push(error)
    }

    if (isPositiveInteger(debouncedDaysToStartWork)) {
      if (+debouncedDaysToStartWork > 7) {
        error = 'Days to start work must be between 1-7'
        setDaysToStartWorkError(error)
        errors.push(error)
      } else {
        if (
          _durationInDaysValid &&
          +debouncedDaysToStartWork >= +debouncedDurationInDays
        ) {
          error =
            'Days to start work must not be greater than days to deliver result'
          setDaysToStartWorkError(error)
          errors.push(error)
        }
      }
    } else {
      error = 'Days to start work must be greater than zero'
      setDaysToStartWorkError(error)
      errors.push(error)
    }

    setIsValidForm(errors.length === 0)
    setValidationErrors(errors)
  }, [
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
    return (
      <JustOneSecondBlockchain message="Waiting for the contract address..." />
    )
  }

  return (
    <>
      {validationErrors.length > 0 && (
        <ValidationErrors errors={validationErrors} />
      )}

      {createError && (
        <ErrorWrapper
          header="Unable to create a contract"
          error={errorHandler(createError)}
        />
      )}

      {prepareError && (
        <ErrorWrapper
          header="Contract prepare error"
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
          <Grid.Column textAlign="right">
            {!fillForm && (
              <Button
                content="Fill form from job and application"
                onClick={() => setFillForm(true)}
              />
            )}

            <Button content="Publish" primary disabled={!isValidForm} />
          </Grid.Column>

          <Grid.Column mobile={16} computer={11}>
            <Segment>
              <Header as="h3">Title:</Header>

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
              <Header as="h3">
                Please describe everything you need to be done by your
                contractor in terms of contract
              </Header>

              <p>
                Put here whatever you want: acceptance criteria, links to
                required documents, assets, or references.
                <br />
                Pay attention: you will pay extra gas fee if you would like to
                make changes in this contract later.
                <br />
                So, we recommend you to put all information right now just to
                save your money.
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
              <Header as="h3">Contract Lifecycle:</Header>

              <Step.Group widths={3}>
                <Step active link>
                  <Step.Content>
                    <Step.Title>1. Create</Step.Title>
                    <Step.Description>
                      Customer creates a contract
                    </Step.Description>
                  </Step.Content>
                </Step>
                <Step link>
                  <Step.Content>
                    <Step.Title>2. Accept</Step.Title>
                    <Step.Description>
                      Contractor accepts the terms
                    </Step.Description>
                  </Step.Content>
                </Step>
                <Step link>
                  <Step.Content>
                    <Step.Title>3. Fund</Step.Title>
                    <Step.Description>
                      Customer funds the contract
                    </Step.Description>
                  </Step.Content>
                </Step>
              </Step.Group>

              <Step.Group widths={3}>
                <Step link>
                  <Step.Content>
                    <Step.Title>4. Start</Step.Title>
                    <Step.Description>
                      Contractor starts working
                    </Step.Description>
                  </Step.Content>
                </Step>
                <Step link>
                  <Step.Content>
                    <Step.Title>5. Deliver</Step.Title>
                    <Step.Description>
                      Contractor delivers the results
                    </Step.Description>
                  </Step.Content>
                </Step>
                <Step link>
                  <Step.Content>
                    <Step.Title>6. Confirm</Step.Title>
                    <Step.Description>
                      Customer allows withdrawal
                    </Step.Description>
                  </Step.Content>
                </Step>
              </Step.Group>
            </Segment>
          </Grid.Column>

          <Grid.Column mobile={16} computer={5}>
            <Segment>
              <Header as="h3">Contract Value ({accountBalance.symbol}):</Header>

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
              <Header as="h3">Days to Start Work:</Header>

              <Form.Input
                id="daysToStartWork"
                error={daysToStartWorkError}
                min={1}
                max={7}
                step={1}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Our recommendation: 3"
                value={daysToStartWork}
                onChange={(e) => setDaysToStartWork(e.target.value)}
                required
                autoComplete="off"
                maxLength={1}
              />

              <p>
                How many days contractor will have to start working on your
                contract, starting from the date when the contract was funded.
              </p>

              <p>
                If the contractor does not change the contract status from
                &quot;Funded&quot; to &quot;Started&quot; within these number of
                days, you will be able to refund your money.
              </p>
            </Segment>

            <Segment>
              <Header as="h3">Days to Deliver Result:</Header>

              <Form.Input
                id="durationInDays"
                error={durationInDaysError}
                min={1}
                max={31}
                step={1}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Our recommendation: 7"
                value={durationInDays}
                onChange={(e) => setDurationInDays(e.target.value)}
                required
                autoComplete="off"
                maxLength={2}
              />

              <p>This is a contract lifetime after fund.</p>

              <p>
                <b>It must be greater than &quot;Days to Start Work&quot;.</b>
              </p>

              <p>
                If the contractor does not send the final results in accordance
                with the terms of this contract within the deadline, you will be
                able to request a refund.
              </p>

              <p>This value will be used after you fund the contract.</p>

              <p>
                <Link href="#">Please show me some examples how it works.</Link>
              </p>
            </Segment>

            <Segment>
              <Header as="h3">Meta:</Header>

              <List bulleted>
                <List.Item>
                  <Link href={`/jobs/${dto.jobAddress}`} target="_blank">
                    Open original job
                  </Link>
                </List.Item>

                <List.Item>
                  <Link href={`/freelancers/${dto.applicantAddress}`}>
                    Open contractor&apos; profile
                  </Link>
                </List.Item>

                <List.Item>
                  <a
                    href={`${blockchainViewAddressURL}/${dto.applicantAddress}`}
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                  >
                    Check contractor&apos;s transactions
                  </a>
                </List.Item>

                <List.Item>
                  Job budget: {`${dto.budget} (${accountBalance.symbol})`}
                </List.Item>
                <List.Item>
                  Contractor&apos;s service rate:{' '}
                  {`${dto.serviceFee} (${accountBalance.symbol})`}
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
