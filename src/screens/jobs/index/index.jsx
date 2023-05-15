import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import getConfig from 'next/config'
import { Segment, Grid, Header, Button } from 'semantic-ui-react'
import { JobsList } from '../../../components/JobsList'
import { JobsSidebar } from '../../../components/JobsSidebar'
import { useContractRead } from 'wagmi'
import gigsPluginContractABI from '../../../../contracts/GigsPlugin.json'
import { JustOneSecondBlockchain } from '../../../components/JustOneSecond'
import { errorHandler } from '../../../lib/errorHandler'
import ErrorWrapper from '../../../components/ErrorWrapper'
import useTranslation from 'next-translate/useTranslation'
import { useJobsFilter } from '../../../hooks/useJobsFilter'
import { Pagination } from '../../../components/Pagination'

const { publicRuntimeConfig } = getConfig()
const { optriSpaceContractAddress } = publicRuntimeConfig

export const JobsScreen = ({ currentAccount }) => {
  const { t } = useTranslation('common')

  const {
    data: rawData,
    error,
    isLoading,
  } = useContractRead({
    address: optriSpaceContractAddress,
    abi: gigsPluginContractABI,
    functionName: 'gigsGetJobs',
    overrides: { from: currentAccount },
  })

  const [data, setData] = useState(undefined)
  const [filters, setFilters] = useState({})
  const filteredJobs = useJobsFilter({ data, filters })

  const [recordsPerPage, setRecordsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(null)
  const [showPagination, setShowPagination] = useState(null)

  const onFilterChanged = (f) => {
    setFilters(f)
  }

  const changePage = (_e, { activePage }) => {
    setCurrentPage(activePage)
  }

  // FIXME: It should be replaced with: https://wagmi.sh/react/hooks/useContractRead#select-optional
  useEffect(() => {
    if (!rawData) return

    const j = rawData.map((job) => {
      return {
        address: job.id,
        title: job.title,
        description: job.description,
        budget: ethers.utils.formatEther(job.budget.toString()),
        applicationsCount: +job.applicationsCount.toString(),
        categoryCode: job.category.code,
        categoryLabel: job.category.label,
        owner: job.customerAddress,
        createdAt: +job.createdAt.toString(),
      }
    })

    const orderedJobs = j.slice().sort((a, b) => {
      return +b.createdAt - +a.createdAt
    })

    setData(orderedJobs)

    const recordsCount = orderedJobs.length
    const pagesCount = Math.ceil(recordsCount / recordsPerPage)

    if (currentPage > pagesCount) {
      setCurrentPage(1)
    }

    const startFrom = (currentPage - 1) * recordsPerPage

    setTotalPages(pagesCount)
    setShowPagination(pagesCount > 1)
    setData(orderedJobs.slice(startFrom, startFrom + recordsPerPage))
  }, [currentPage, rawData, recordsPerPage])

  return (
    <Grid stackable columns={1}>
      <Grid.Column textAlign="center">
        <Header as="h1" content={t('pages.jobs.index.header.title')} />
        <Header as="h2" content={t('pages.jobs.index.header.subtitle')} />
      </Grid.Column>

      <Grid.Column>
        <Button
          as="a"
          primary
          href="/jobs/new"
          floated="right"
          content={t('buttons.add_new')}
        />
      </Grid.Column>

      <Grid.Column>
        <Grid columns={2} stackable>
          <Grid.Column mobile={16} computer={11}>
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

            {filteredJobs.length > 0 ? (
              <JobsList jobs={filteredJobs} />
            ) : (
              <Segment>
                <p>{t('pages.jobs.index.no_records')}</p>
              </Segment>
            )}

            <Grid>
              {showPagination && (
                <Grid.Column textAlign="center">
                  <Pagination totalPages={totalPages} changePage={changePage} />
                </Grid.Column>
              )}
            </Grid>
          </Grid.Column>

          <Grid.Column computer={5} only="computer">
            <JobsSidebar onFilterChanged={onFilterChanged} />
          </Grid.Column>
        </Grid>
      </Grid.Column>
    </Grid>
  )
}
