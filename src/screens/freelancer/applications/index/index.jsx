import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import getConfig from 'next/config'
import { Segment, Grid, Header } from 'semantic-ui-react'
import { MyApplicationsList } from '../../../../components/MyApplicationsList'
import { useContractRead } from 'wagmi'
import gigsGetMyApplicationsQueryABI from '../../../../../contracts/GigsGetMyApplicationsQuery.json'
import { JustOneSecondBlockchain } from '../../../../components/JustOneSecond'
import { errorHandler } from '../../../../lib/errorHandler'
import ErrorWrapper from '../../../../components/ErrorWrapper'
import useTranslation from 'next-translate/useTranslation'

const { publicRuntimeConfig } = getConfig()
const { optriSpaceContractAddress } = publicRuntimeConfig

export const ApplicationsScreen = ({ currentAccount }) => {
  const { t } = useTranslation('common')

  const {
    data: rawData,
    error,
    isLoading,
  } = useContractRead({
    address: optriSpaceContractAddress,
    abi: gigsGetMyApplicationsQueryABI,
    functionName: 'gigsGetMyApplications',
    overrides: { from: currentAccount },
  })

  const [data, setData] = useState(undefined)

  // FIXME: It should be replaced with: https://wagmi.sh/react/hooks/useContractRead#select-optional
  useEffect(() => {
    if (!rawData) return

    const j = rawData.map((application) => {
      return {
        address: application.applicationAddress,
        jobAddress: application.jobAddress,
        contractAddress: application.contractAddress,
        hasContract: application.hasContract,
        jobTitle: application.jobTitle,
        jobDescription: application.jobDescription,
        applicationComment: application.applicationComment,
        jobCategoryCode: application.jobCategoryCode,
        jobCategoryLabel: application.jobCategoryLabel,
        jobBudget: ethers.utils.formatEther(application.jobBudget.toString()),
        applicationServiceFee: ethers.utils.formatEther(
          application.applicationServiceFee.toString()
        ),
        applicationCreatedAt: +application.applicationCreatedAt.toString(),
      }
    })

    const orderedApplications = j.slice().sort((a, b) => {
      return +b.applicationCreatedAt - +a.applicationCreatedAt
    })

    setData(orderedApplications)
  }, [rawData])

  return (
    <Grid stackable columns={1}>
      <Grid.Column textAlign="center">
        <Header
          as="h1"
          content={t('pages.freelancer.applications.index.header.title')}
        />
      </Grid.Column>

      <Grid.Column>
        {isLoading && (
          <JustOneSecondBlockchain
            message={t('labels.loading_from_blockchain')}
          />
        )}

        {error && (
          <ErrorWrapper
            header={t('errors.transactions.load')}
            error={errorHandler(error)}
          />
        )}

        {data && (
          <>
            {data.length > 0 ? (
              <MyApplicationsList applications={data} />
            ) : (
              <Segment>
                <p>{t('pages.freelancer.applications.index.no_records')}</p>
              </Segment>
            )}
          </>
        )}
      </Grid.Column>
    </Grid>
  )
}
