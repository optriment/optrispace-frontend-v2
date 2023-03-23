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
import useTranslation from 'next-translate/useTranslation'

const { publicRuntimeConfig } = getConfig()
const { optriSpaceContractAddress, frontendNodeAddress } = publicRuntimeConfig

export const NewJobForm = ({
  currentAccount,
  accountBalance,
  onJobCreated,
  jobsCategories,
}) => {
  const { t } = useTranslation('common')

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
      error = t('errors.messages.empty', { field: t('jobs:model.title') })
      setTitleError(error)
      errors.push(error)
    }

    if (isEmptyString(debouncedDescription)) {
      error = t('errors.messages.empty', { field: t('jobs:model.description') })
      setDescriptionError(error)
      errors.push(error)
    }

    if (!isEmptyString(debouncedBudget) && isNumber(debouncedBudget)) {
      if (+debouncedBudget < 0 || +debouncedBudget > 100) {
        error = t('errors.messages.between', {
          field: t('jobs:model.budget'),
          from: '0',
          to: '100.0',
        })
        setBudgetError(error)
        errors.push(error)
      }
    } else {
      error = t('errors.messages.not_a_number', {
        field: t('jobs:model.budget'),
      })
      setBudgetError(error)
      errors.push(error)
    }

    if (categoryId < 0 || isEmptyString(categoryCode)) {
      error = t('errors.messages.empty', { field: t('jobs:model.category') })
      setCategoryError(error)
      errors.push(error)
    }

    setIsValidForm(errors.length === 0)
    setValidationErrors(errors)
  }, [
    t,
    debouncedTitle,
    debouncedDescription,
    debouncedBudget,
    categoryId,
    categoryCode,
  ])

  const panes = [
    {
      menuItem: {
        key: 'write',
        icon: 'pencil',
        content: t('forms.job_form.description.tab_edit'),
      },
      render: () => <Tab.Pane>{renderWriteJob()}</Tab.Pane>,
    },
    {
      menuItem: {
        key: 'preview',
        icon: 'eye',
        content: t('forms.job_form.description.tab_preview'),
      },
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
      text: t(`jobs:categories.${jobsCategory.code}`),
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
            : t('forms.job_form.description.nothing_to_preview')
        }
      />
    )
  }

  if (jobCreating) {
    return <ConfirmTransactionMessage />
  }

  if (jobCreated) {
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

      <Form
        onSubmit={(e) => {
          e.preventDefault()
          write?.()
        }}
      >
        <Grid stackable columns={1}>
          <Grid.Column textAlign="right">
            <Button
              content={t('buttons.publish')}
              primary
              disabled={!isValidForm}
            />
          </Grid.Column>

          <Grid.Column mobile={16} computer={11}>
            <Segment>
              <Header as="h3" content={t('forms.job_form.title.label')} />

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
              <Header as="h3" content={t('forms.job_form.description.label')} />

              <Tab panes={panes} />

              <SuggestMinimizeGasFees />
              <MarkdownIsSupported />
            </Segment>
          </Grid.Column>

          <Grid.Column mobile={16} computer={5}>
            <Segment>
              <Header
                as="h3"
                content={t('forms.job_form.budget.label', {
                  symbol: accountBalance.symbol,
                })}
              />
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

              <p>
                {t('forms.job_form.budget.range', {
                  min: '0',
                  max: '100.0',
                  symbol: accountBalance.symbol,
                })}
              </p>
            </Segment>

            <Segment>
              <Header as="h3" content={t('forms.job_form.category.label')} />

              <Form.Select
                fluid
                error={categoryError}
                required
                options={categories}
                value={categoryCode}
                placeholder={t('labels.please_select')}
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
