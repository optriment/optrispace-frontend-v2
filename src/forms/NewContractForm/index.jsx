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
import { isEmptyString, isPositiveNumber } from '../../lib/validators'
import { errorHandler } from '../../lib/errorHandler'
import ErrorWrapper from '../../components/ErrorWrapper'
import { ConfirmTransactionMessage } from '../../components/ConfirmTransactionMessage'
import { JustOneSecondBlockchain } from '../../components/JustOneSecond'
import { AutoFillFormDialog } from './AutoFillFormDialog'

import gigsAddContractCommandABI from '../../../contracts/GigsAddContractCommand.json'

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

  const formFilled =
    !isEmptyString(debouncedTitle) &&
    !isEmptyString(debouncedDescription) &&
    isPositiveNumber(debouncedValue) &&
    isPositiveNumber(debouncedDurationInDays) &&
    Number.isInteger(+debouncedDurationInDays) &&
    isPositiveNumber(debouncedDaysToStartWork) &&
    Number.isInteger(+debouncedDaysToStartWork) &&
    debouncedDurationInDays > debouncedDaysToStartWork

  const { config, error: prepareError } = usePrepareContractWrite({
    address: optriSpaceContractAddress,
    abi: gigsAddContractCommandABI,
    functionName: 'gigsAddContract',
    args: [
      frontendNodeAddress,
      dto.jobAddress,
      dto.applicationAddress,
      debouncedTitle,
      debouncedDescription,
      ethers.utils.parseEther(debouncedValue > 0 ? debouncedValue : '0'),
      +debouncedDurationInDays,
      +debouncedDaysToStartWork,
    ],
    mode: 'prepared',
    enabled: formFilled,
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
            <Button content="Publish" primary disabled={!formFilled} />
          </Grid.Column>

          <Grid.Column mobile={16} computer={11}>
            <Segment>
              <Header as="h3">Title:</Header>

              <Form.Input
                id="title"
                error={
                  isEmptyString(title)
                    ? 'Please enter title (up to 256 characters)'
                    : null
                }
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
                make changed in this contract later.
                <br />
                So, we recommend you to put all information right now just to
                save your money.
              </p>

              <Form.Input
                control={TextArea}
                id="description"
                error={
                  isEmptyString(description) ? 'Please enter description' : null
                }
                placeholder=""
                rows={12}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                autoComplete="off"
              />
            </Segment>

            <Segment>
              <Header as="h3">Contract Lifecycle</Header>

              <Step.Group widths={3}>
                <Step active link onClick={() => alert('Create')}>
                  <Step.Content>
                    <Step.Title>1. Create</Step.Title>
                    <Step.Description>
                      Customer creates a contract
                    </Step.Description>
                  </Step.Content>
                </Step>
                <Step link onClick={() => alert('Accept')}>
                  <Step.Content>
                    <Step.Title>2. Accept</Step.Title>
                    <Step.Description>
                      Contractor accepts the terms
                    </Step.Description>
                  </Step.Content>
                </Step>
                <Step link onClick={() => alert('Fund')}>
                  <Step.Content>
                    <Step.Title>3. Fund</Step.Title>
                    <Step.Description>
                      Customer funds the contract
                    </Step.Description>
                  </Step.Content>
                </Step>
              </Step.Group>

              <Step.Group widths={3}>
                <Step link onClick={() => alert('Start')}>
                  <Step.Content>
                    <Step.Title>4. Start</Step.Title>
                    <Step.Description>
                      Contractor starts working
                    </Step.Description>
                  </Step.Content>
                </Step>
                <Step link onClick={() => alert('Confirm')}>
                  <Step.Content>
                    <Step.Title>5. Deliver</Step.Title>
                    <Step.Description>
                      Contractor delivers the results
                    </Step.Description>
                  </Step.Content>
                </Step>
                <Step link onClick={() => alert('Confirm')}>
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
              <Header as="h3">Contract Value ({accountBalance.symbol})</Header>

              <Form.Input
                id="value"
                type="number"
                error={
                  !isPositiveNumber(value)
                    ? 'Please enter contract value'
                    : null
                }
                min={0.001}
                step={0.001}
                max={100.0}
                placeholder=""
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
                autoComplete="off"
              />
            </Segment>

            <Segment>
              <Header as="h3">Days to Start Work</Header>

              <Form.Input
                id="daysToStartWork"
                type="number"
                error={
                  !isPositiveNumber(daysToStartWork) ||
                  !Number.isInteger(+daysToStartWork)
                    ? 'Please enter number of days (1-7 days)'
                    : null
                }
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
              />

              <p>
                How many days will contractor have to start working on your
                contract, starting from the date when the contract was funded.
              </p>

              <p>
                If the contractor does not change the contract status from
                &quot;Funded&quot; to &quot;Started&quot; within these number of
                days, you will be able to refund your money.
              </p>
            </Segment>

            <Segment>
              <Header as="h3">Days to Deliver Result</Header>

              <Form.Input
                id="durationInDays"
                type="number"
                error={
                  !isPositiveNumber(durationInDays) ||
                  !Number.isInteger(+durationInDays)
                    ? 'Please enter contract duration (1-31 days)'
                    : null
                }
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
              <Header as="h3">Meta</Header>

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
