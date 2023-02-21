import React, { useState, useEffect } from 'react'
import getConfig from 'next/config'
import { ethers } from 'ethers'
import {
  useContractWrite,
  usePrepareContractWrite,
  useContractEvent,
} from 'wagmi'
import {
  Segment,
  Tab,
  Header,
  Grid,
  Button,
  Form,
  TextArea,
  Label,
} from 'semantic-ui-react'
import { useDebounce } from '../../hooks/useDebounce'
import { getFromStorage, setToStorage } from '../../lib/helpers'
import { isEmptyString, isNumber } from '../../lib/validators'
import { errorHandler } from '../../lib/errorHandler'
import ErrorWrapper from '../../components/ErrorWrapper'
import { MarkdownIsSupported } from '../../components/MarkdownIsSupported'
import { UnsavedChangesDialog } from '../../components/UnsavedChangesDialog'
import { FormattedDescription } from '../../components/FormattedDescription'
import { ConfirmTransactionMessage } from '../../components/ConfirmTransactionMessage'
import { JustOneSecondBlockchain } from '../../components/JustOneSecond'
import gigsAddJobCommandABI from '../../../contracts/GigsAddJobCommand.json'
import { ValidationErrors } from '../../components/ValidationErrors'
import { SuggestMinimizeGasFees } from '../../components/SuggestMinimizeGasFees'
import { useConversionRate } from '../../hooks/useConversionRate'

const { publicRuntimeConfig } = getConfig()
const { optriSpaceContractAddress, frontendNodeAddress } = publicRuntimeConfig

export const NewJobForm = ({
  currentAccount,
  accountBalance,
  onJobCreated,
  jobsCategories,
}) => {
  const [displayModal, setDisplayModal] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState(0)
  const [categoryCode, setCategoryCode] = useState('')
  const [categoryId, setCategoryId] = useState(-1)

  const debouncedTitle = useDebounce(title)
  const debouncedDescription = useDebounce(description)
  const debouncedBudget = useDebounce(budget)

  const [titleError, setTitleError] = useState(null)
  const [descriptionError, setDescriptionError] = useState(null)
  const [budgetError, setBudgetError] = useState(null)
  const [categoryError, setCategoryError] = useState(null)

  const [isValidForm, setIsValidForm] = useState(false)
  const [validationErrors, setValidationErrors] = useState([])

  const conversionRate = useConversionRate()

  const hookIsEnabled =
    !isEmptyString(debouncedTitle) &&
    !isEmptyString(debouncedDescription) &&
    !isEmptyString(debouncedBudget) &&
    isNumber(debouncedBudget) &&
    +debouncedBudget >= 0 &&
    +debouncedBudget <= 100 &&
    categoryId >= 0

  const { config, error: prepareError } = usePrepareContractWrite({
    address: optriSpaceContractAddress,
    abi: gigsAddJobCommandABI,
    functionName: 'gigsAddJob',
    args: [
      frontendNodeAddress,
      ethers.utils.parseEther(
        isNumber(debouncedBudget) &&
          +debouncedBudget >= 0 &&
          +debouncedBudget <= 100
          ? debouncedBudget.toString()
          : '0'
      ),
      debouncedTitle.trim(),
      debouncedDescription.trim(),
      categoryId,
    ],
    mode: 'prepared',
    enabled: hookIsEnabled,
    overrides: { from: currentAccount },
  })

  const {
    error: createError,
    isLoading: jobCreating,
    isSuccess: jobCreated,
    write,
  } = useContractWrite(config)

  useContractEvent({
    address: optriSpaceContractAddress,
    abi: gigsAddJobCommandABI,
    eventName: 'JobCreated',
    listener(memberAddress, jobAddress) {
      if (!jobCreated) return
      if (memberAddress !== currentAccount) return

      clearStoredFields()

      onJobCreated(jobAddress)
    },
  })

  useEffect(() => {
    setIsValidForm(false)
    setTitleError(null)
    setDescriptionError(null)
    setBudgetError(null)
    setCategoryError(null)

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

    if (!isEmptyString(debouncedBudget) && isNumber(debouncedBudget)) {
      if (+debouncedBudget < 0 || +debouncedBudget > 100) {
        error = 'Budget must be between 0-100'
        setBudgetError(error)
        errors.push(error)
      }
    } else {
      error = 'Budget must be a number'
      setBudgetError(error)
      errors.push(error)
    }

    if (categoryId < 0 || isEmptyString(categoryCode)) {
      error = 'Category must be set'
      setCategoryError(error)
      errors.push(error)
    }

    setIsValidForm(errors.length === 0)
    setValidationErrors(errors)
  }, [
    debouncedTitle,
    debouncedDescription,
    debouncedBudget,
    categoryId,
    categoryCode,
  ])

  const panes = [
    {
      menuItem: { key: 'write', icon: 'pencil', content: 'Edit' },
      render: () => <Tab.Pane>{renderWriteJob()}</Tab.Pane>,
    },
    {
      menuItem: { key: 'preview', icon: 'eye', content: 'Preview' },
      render: () => <Tab.Pane>{renderPreviewJob()}</Tab.Pane>,
    },
  ]

  const handleTitleChange = (e) => {
    const { value } = e.target

    setTitle(value)
    setToStorage('newJobTitle', value)
  }

  const handleDescriptionChange = (e) => {
    const { value } = e.target

    setDescription(value)
    setToStorage('newJobDescription', value)
  }

  const handleBudgetChange = (e) => {
    const { value } = e.target

    setBudget(value)
    setToStorage('newJobBudget', value)
  }

  const handleCategoryChange = (e, o) => {
    const { value } = o

    const category = findCategoryByCode(value)

    if (category) {
      setCategoryId(category.index)
    }

    setCategoryCode(value)
    setToStorage('newJobCategoryCode', value)
  }

  const findCategoryByCode = (categoryCode) => {
    return jobsCategories.find(
      (jobCategory) => jobCategory.code === categoryCode
    )
  }

  const clearStoredFields = () => {
    localStorage.removeItem('newJobTitle')
    localStorage.removeItem('newJobDescription')
    localStorage.removeItem('newJobBudget')
    localStorage.removeItem('newJobCategoryCode')
  }

  const storedTitle = getFromStorage('newJobTitle')
  const storedDescription = getFromStorage('newJobDescription')
  const storedBudget = getFromStorage('newJobBudget')
  const storedCategoryCode = getFromStorage('newJobCategoryCode')

  const restoreUnsavedChanges = () => {
    if (storedCategoryCode !== '') {
      const category = findCategoryByCode(storedCategoryCode)

      if (category) {
        setCategoryId(category.index)
      }
    }

    setTitle(storedTitle)
    setDescription(storedDescription)
    setBudget(storedBudget)
    setCategoryCode(storedCategoryCode)
    setIsLoaded(true)
  }

  const categories = jobsCategories.map((jobsCategory) => {
    return {
      key: jobsCategory.code,
      text: jobsCategory.label,
      value: jobsCategory.code,
    }
  })

  useEffect(() => {
    if (isLoaded) return

    if (
      storedTitle === '' &&
      storedDescription === '' &&
      storedBudget === '' &&
      storedCategoryCode === ''
    ) {
      setIsLoaded(true)
    } else {
      setDisplayModal(true)
    }
  }, [
    isLoaded,
    storedTitle,
    storedDescription,
    storedBudget,
    storedCategoryCode,
  ])

  const renderWriteJob = () => {
    return (
      <Form.Input
        control={TextArea}
        id="description"
        error={descriptionError}
        placeholder=""
        rows={12}
        value={description}
        onChange={handleDescriptionChange}
        required
        disabled={jobCreating || jobCreated}
      />
    )
  }

  const renderPreviewJob = () => {
    return (
      <FormattedDescription
        description={
          !isEmptyString(description)
            ? getFromStorage('newJobDescription')
            : 'Nothing to preview!'
        }
      />
    )
  }

  if (jobCreating) {
    return <ConfirmTransactionMessage />
  }

  if (jobCreated) {
    return <JustOneSecondBlockchain message="Waiting for the job address..." />
  }

  return (
    <>
      {validationErrors.length > 0 && (
        <ValidationErrors errors={validationErrors} />
      )}

      {createError && (
        <ErrorWrapper
          header="Unable to create a job"
          error={errorHandler(createError)}
        />
      )}

      {prepareError && (
        <ErrorWrapper
          header="Job prepare error"
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
                onChange={handleTitleChange}
                maxLength={256}
                required
              />
            </Segment>

            <Segment>
              <Header as="h3">
                Please describe everything you need to be done by freelancers:
              </Header>

              <Tab panes={panes} />

              <MarkdownIsSupported />
              <SuggestMinimizeGasFees />
            </Segment>
          </Grid.Column>

          <Grid.Column mobile={16} computer={5}>
            <Segment>
              <Header as="h3">Budget ({accountBalance.symbol}):</Header>
              <Form.Input
                id="budget"
                error={budgetError}
                placeholder=""
                value={budget}
                onChange={handleBudgetChange}
                autoComplete="off"
                maxLength={10}
                labelPosition="right"
              >
                <input />
                <Label>
                  {budget > 0 && !budgetError
                    ? `~ $${(conversionRate * budget).toFixed(2)}`
                    : '~$0'}
                </Label>
              </Form.Input>

              <p>Minimum budget: 0, maximum: 100.0 {accountBalance.symbol}.</p>
            </Segment>

            <Segment>
              <Header as="h3">Category:</Header>

              <Form.Select
                fluid
                error={categoryError}
                required
                options={categories}
                value={categoryCode}
                placeholder="Please select"
                onChange={handleCategoryChange}
              />
            </Segment>
          </Grid.Column>
        </Grid>
      </Form>

      <UnsavedChangesDialog
        open={displayModal}
        onNoClicked={() => {
          clearStoredFields()
          setIsLoaded(true)
          setDisplayModal(false)
        }}
        onYesClicked={() => {
          restoreUnsavedChanges()
          setIsLoaded(true)
          setDisplayModal(false)
        }}
      />
    </>
  )
}
