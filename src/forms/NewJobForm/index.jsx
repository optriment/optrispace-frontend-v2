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
} from 'semantic-ui-react'
import { useDebounce } from '../../hooks/useDebounce'
import { getFromStorage, setToStorage } from '../../lib/helpers'
import { isEmptyString } from '../../lib/validators'
import { errorHandler } from '../../lib/errorHandler'
import ErrorWrapper from '../../components/ErrorWrapper'
import { MarkdownIsSupported } from '../../components/MarkdownIsSupported'
import { UnsavedChangesDialog } from '../../components/UnsavedChangesDialog'
import { FormattedDescription } from '../../components/FormattedDescription'
import { ConfirmTransactionMessage } from '../../components/ConfirmTransactionMessage'
import { JustOneSecondBlockchain } from '../../components/JustOneSecond'
import gigsAddJobCommandABI from '../../../contracts/GigsAddJobCommand.json'

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

  const formFilled =
    isLoaded &&
    !isEmptyString(debouncedTitle) &&
    !isEmptyString(debouncedDescription) &&
    !isEmptyString(debouncedBudget) &&
    !isEmptyString(categoryCode) &&
    categoryId >= 0

  const { config, error: prepareError } = usePrepareContractWrite({
    address: optriSpaceContractAddress,
    abi: gigsAddJobCommandABI,
    functionName: 'gigsAddJob',
    args: [
      frontendNodeAddress,
      ethers.utils.parseEther(debouncedBudget > 0 ? debouncedBudget : '0'),
      debouncedTitle,
      debouncedDescription,
      categoryId,
    ],
    mode: 'prepared',
    enabled: formFilled,
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
        error={isEmptyString(description) ? 'Please enter description' : null}
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
            <Button content="Publish" primary disabled={!formFilled} />
          </Grid.Column>

          <Grid.Column mobile={16} computer={11}>
            <Segment>
              <Grid columns={1}>
                <Grid.Column>
                  <Header as="h4">Title:</Header>

                  <Form.Input
                    id="title"
                    error={
                      isEmptyString(title)
                        ? 'Please enter title (up to 256 characters)'
                        : null
                    }
                    placeholder=""
                    value={title}
                    onChange={handleTitleChange}
                    maxLength={256}
                    required
                  />
                </Grid.Column>

                <Grid.Column>
                  <Header as="h4">Description:</Header>

                  <Tab panes={panes} />

                  <MarkdownIsSupported />
                </Grid.Column>
              </Grid>
            </Segment>
          </Grid.Column>

          <Grid.Column mobile={16} computer={5}>
            <Segment>
              <Grid columns={1}>
                <Grid.Column>
                  <Header as="h4">Budget ({accountBalance.symbol}):</Header>

                  <Form.Input
                    id="budget"
                    type="number"
                    min={0}
                    step={0.001}
                    max={100.0}
                    placeholder=""
                    value={budget}
                    onChange={handleBudgetChange}
                    autoComplete="off"
                  />

                  <p>
                    Minimum budget: 0, maximum: 100.0 {accountBalance.symbol}.
                  </p>
                </Grid.Column>

                <Grid.Column>
                  <Header as="h4">Category:</Header>

                  <Form.Select
                    fluid
                    options={categories}
                    value={categoryCode}
                    placeholder="Please select"
                    onChange={handleCategoryChange}
                  />
                </Grid.Column>
              </Grid>
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
