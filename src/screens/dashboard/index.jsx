import React, { useState, useEffect } from 'react'
import getConfig from 'next/config'
import {
  Segment,
  Grid,
  List,
  Container,
  Header,
  Divider,
} from 'semantic-ui-react'
import { useContractRead } from 'wagmi'
import coreGetStatsQueryABI from '../../../contracts/CoreGetStatsQuery.json'
import frontendNodeContractABI from '../../../contracts/FrontendNode.json'
import gigsPluginContractABI from '../../../contracts/GigsPlugin.json'
import JustOneSecond, {
  JustOneSecondBlockchain,
} from '../../components/JustOneSecond'
import ErrorWrapper from '../../components/ErrorWrapper'
import { errorHandler } from '../../lib/errorHandler'
import useTranslation from 'next-translate/useTranslation'

const { publicRuntimeConfig } = getConfig()
const { optriSpaceContractAddress, frontendNodeAddress } = publicRuntimeConfig

export const DashboardScreen = ({ currentAccount }) => {
  const { t } = useTranslation('common')

  const [stats, setStats] = useState()
  const [events, setEvents] = useState()
  const [gigsStats, setGigsStats] = useState()

  const {
    data: rawStats,
    error: statsError,
    isLoading: statsLoading,
  } = useContractRead({
    address: optriSpaceContractAddress,
    abi: coreGetStatsQueryABI,
    functionName: 'coreGetStats',
    overrides: { from: currentAccount },
  })

  const {
    data: rawEvents,
    error: eventsError,
    isLoading: eventsLoading,
  } = useContractRead({
    address: frontendNodeAddress,
    abi: frontendNodeContractABI,
    functionName: 'getEventTypesCount',
    overrides: { from: currentAccount },
  })

  const {
    data: rawGigsStats,
    error: gigsStatsError,
    isLoading: gigsStatsLoading,
  } = useContractRead({
    address: optriSpaceContractAddress,
    abi: gigsPluginContractABI,
    functionName: 'gigsGetStats',
    overrides: { from: currentAccount },
  })

  useEffect(() => {
    if (!rawStats) return

    setStats({
      peopleCount: +rawStats.peopleCount,
      nodeOwnersCount: +rawStats.nodeOwnersCount,
      frontendNodesCount: +rawStats.frontendNodesCount,
    })
  }, [rawStats])

  useEffect(() => {
    if (!rawEvents) return

    let e = {}

    for (let idx = 0; idx < rawEvents.eventTypes.length; idx++) {
      e[rawEvents.eventTypes[idx]] = +rawEvents.eventsCount[idx]
    }

    setEvents(e)
  }, [rawEvents])

  useEffect(() => {
    if (!rawGigsStats) return

    setGigsStats({
      jobsCount: +rawGigsStats.jobsCount,
      applicationsCount: +rawGigsStats.applicationsCount,
      contractsCount: +rawGigsStats.contractsCount,
      jobsCategoriesCount: +rawGigsStats.jobsCategoriesCount,
      freelancersCount: +rawGigsStats.freelancersCount,
      customersCount: +rawGigsStats.customersCount,
    })
  }, [rawGigsStats])

  if (statsLoading) {
    return (
      <JustOneSecondBlockchain message={t('labels.loading_from_blockchain')} />
    )
  }

  if (statsError) {
    return (
      <ErrorWrapper
        header={t('errors.transactions.load')}
        error={errorHandler(statsError)}
      />
    )
  }

  if (!stats) {
    return <JustOneSecond title={t('labels.initializing')} />
  }

  if (eventsLoading) {
    return (
      <JustOneSecondBlockchain message={t('labels.loading_from_blockchain')} />
    )
  }

  if (eventsError) {
    return (
      <ErrorWrapper
        header={t('errors.transactions.load')}
        error={errorHandler(eventsError)}
      />
    )
  }

  if (!events) {
    return <JustOneSecond title={t('labels.initializing')} />
  }

  if (gigsStatsLoading) {
    return (
      <JustOneSecondBlockchain message={t('labels.loading_from_blockchain')} />
    )
  }

  if (gigsStatsError) {
    return (
      <ErrorWrapper
        header={t('errors.transactions.load')}
        error={errorHandler(gigsStatsError)}
      />
    )
  }

  if (!gigsStats) {
    return <JustOneSecond title={t('labels.initializing')} />
  }

  return (
    <Container textAlign="center">
      <Header as="h1" content={t('pages.dashboard.header.title')} />

      <Divider hidden />

      <Segment placeholder>
        <Grid columns={3} relaxed="very" stackable>
          <Grid.Column>
            <Header as="h3" content={t('pages.dashboard.your_stats.header')} />

            <Segment textAlign="left">
              <List size="large">
                <List.Item
                  content={t('pages.dashboard.your_stats.total_jobs_created', {
                    value: '',
                  })}
                />
                <List.Item
                  content={t('pages.dashboard.your_stats.available_jobs', {
                    value: '',
                  })}
                />
                <List.Item
                  content={t(
                    'pages.dashboard.your_stats.created_applications',
                    {
                      value: '',
                    }
                  )}
                />
                <List.Item
                  content={t('pages.dashboard.your_stats.total_contracts', {
                    value: '',
                  })}
                />
                <List.Item
                  content={t('pages.dashboard.your_stats.active_contracts', {
                    value: '',
                  })}
                />
                <List.Item
                  content={t(
                    'pages.dashboard.your_stats.total_transactions_volume',
                    { value: '' }
                  )}
                />
                <List.Item
                  content={t(
                    'pages.dashboard.your_stats.income_as_a_freelancer',
                    { value: '' }
                  )}
                />
              </List>
            </Segment>
          </Grid.Column>

          <Grid.Column>
            <Header
              as="h3"
              content={t('pages.dashboard.current_node_stats.header')}
            />

            <Segment textAlign="left">
              <List size="large">
                <List.Item
                  content={t('pages.dashboard.current_node_stats.clients', {
                    value: events.CLIENT_CREATED,
                  })}
                />
                <List.Item
                  content={t(
                    'pages.dashboard.current_node_stats.processed_jobs',
                    { value: events.JOB_CREATED }
                  )}
                />
                <List.Item
                  content={t(
                    'pages.dashboard.current_node_stats.processed_applications',
                    { value: events.APPLICATION_CREATED }
                  )}
                />
                <List.Item
                  content={t(
                    'pages.dashboard.current_node_stats.processed_contracts',
                    { value: events.CONTRACT_CREATED }
                  )}
                />
              </List>
            </Segment>
          </Grid.Column>

          <Grid.Column>
            <Header
              as="h3"
              content={t('pages.dashboard.platform_stats.header')}
            />

            <Segment textAlign="left">
              <List size="large">
                <List.Item
                  content={t('pages.dashboard.platform_stats.node_owners', {
                    value: stats.nodeOwnersCount,
                  })}
                />
                <List.Item
                  content={t('pages.dashboard.platform_stats.frontend_nodes', {
                    value: stats.frontendNodesCount,
                  })}
                />
                <List.Item
                  content={t('pages.dashboard.platform_stats.members', {
                    value: stats.peopleCount,
                  })}
                />
                <List.Item
                  content={t('pages.dashboard.platform_stats.freelancers', {
                    value: gigsStats.freelancersCount,
                  })}
                />
                <List.Item
                  content={t('pages.dashboard.platform_stats.customers', {
                    value: gigsStats.customersCount,
                  })}
                />
                <List.Item
                  content={t('pages.dashboard.platform_stats.jobs', {
                    value: gigsStats.jobsCount,
                  })}
                />
                <List.Item
                  content={t('pages.dashboard.platform_stats.applications', {
                    value: gigsStats.applicationsCount,
                  })}
                />
                <List.Item
                  content={t('pages.dashboard.platform_stats.contracts', {
                    value: gigsStats.contractsCount,
                  })}
                />
                <List.Item
                  content={t('pages.dashboard.platform_stats.jobs_categories', {
                    value: gigsStats.jobsCategoriesCount,
                  })}
                />
              </List>
            </Segment>
          </Grid.Column>
        </Grid>
      </Segment>
    </Container>
  )
}
