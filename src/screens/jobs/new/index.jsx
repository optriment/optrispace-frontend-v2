import React, { useState, useEffect } from 'react'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import { useContractRead } from 'wagmi'
import { Header, Grid } from 'semantic-ui-react'
import { InsufficientBalance } from '../../../components/InsufficientBalance'
import { NewJobForm } from '../../../forms/NewJobForm'
import gigsPluginABI from '../../../../contracts/GigsPlugin.json'
import JustOneSecond, {
  JustOneSecondBlockchain,
} from '../../../components/JustOneSecond'
import { errorHandler } from '../../../lib/errorHandler'
import ErrorWrapper from '../../../components/ErrorWrapper'
import useTranslation from 'next-translate/useTranslation'

const { publicRuntimeConfig } = getConfig()
const { optriSpaceContractAddress } = publicRuntimeConfig

export const NewJobScreen = ({ currentAccount, accountBalance }) => {
  const { t } = useTranslation('common')

  const router = useRouter()

  const onJobCreated = (jobAddress) => {
    router.push(`/jobs/${jobAddress}`)
  }

  const {
    data: response,
    error,
    isLoading,
  } = useContractRead({
    address: optriSpaceContractAddress,
    abi: gigsPluginABI,
    functionName: 'gigsGetJobsCategories',
    overrides: { from: currentAccount },
  })

  const [jobsCategories, setJobsCategories] = useState(undefined)

  // FIXME: It should be replaced with: https://wagmi.sh/react/hooks/useContractRead#select-optional
  useEffect(() => {
    if (!response) return

    const jc = response.map((jobCategory, idx) => {
      return {
        index: idx,
        code: jobCategory.code,
        label: t(`jobs:categories.${jobCategory.code}`),
      }
    })

    const orderedCategories = jc.slice().sort((a, b) => {
      let x = a.label.toLowerCase()
      let y = b.label.toLowerCase()

      if (x > y) return 1
      if (x < y) return -1
      return 0
    })

    setJobsCategories(orderedCategories)
  }, [t, response])

  if (isLoading) {
    return (
      <JustOneSecondBlockchain message={t('labels.loading_from_blockchain')} />
    )
  }

  if (error) {
    return (
      <ErrorWrapper
        header={t('errors.transactions.load')}
        error={errorHandler(error)}
      />
    )
  }

  if (!jobsCategories) {
    return <JustOneSecond title={t('labels.initializing')} />
  }

  if (jobsCategories.length === 0) {
    return (
      <ErrorWrapper
        header={t('pages.jobs.new.no_jobs_categories.header')}
        error={t('pages.jobs.new.no_jobs_categories.description')}
      />
    )
  }

  return (
    <Grid stackable columns={1}>
      <Grid.Column textAlign="center">
        <Header as="h1" content={t('pages.jobs.new.header.title')} />
      </Grid.Column>

      <Grid.Column>
        {+accountBalance.formatted > 0 ? (
          <NewJobForm
            currentAccount={currentAccount}
            accountBalance={accountBalance}
            onJobCreated={onJobCreated}
            jobsCategories={jobsCategories}
          />
        ) : (
          <InsufficientBalance />
        )}
      </Grid.Column>
    </Grid>
  )
}
