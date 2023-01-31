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

const { publicRuntimeConfig } = getConfig()
const { optriSpaceContractAddress, frontendNodeAddress } = publicRuntimeConfig

export const DashboardScreen = ({ currentAccount }) => {
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
      membersCount: +rawStats.membersCount,
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
    })
  }, [rawGigsStats])

  if (statsLoading) {
    return <JustOneSecondBlockchain message="Loading stats..." />
  }

  if (statsError) {
    return (
      <ErrorWrapper
        header="Error fetching stats"
        error={errorHandler(statsError)}
      />
    )
  }

  if (!stats) {
    return <JustOneSecond title="Initializing stats..." />
  }

  if (eventsLoading) {
    return <JustOneSecondBlockchain message="Loading events..." />
  }

  if (eventsError) {
    return (
      <ErrorWrapper
        header="Error fetching events"
        error={errorHandler(eventsError)}
      />
    )
  }

  if (!events) {
    return <JustOneSecond title="Initializing events..." />
  }

  if (gigsStatsLoading) {
    return <JustOneSecondBlockchain message="Loading gigs stats..." />
  }

  if (gigsStatsError) {
    return (
      <ErrorWrapper
        header="Error fetching gigs stats"
        error={errorHandler(gigsStatsError)}
      />
    )
  }

  if (!gigsStats) {
    return <JustOneSecond title="Initializing gigs stats..." />
  }

  return (
    <Container textAlign="center">
      <Header as="h1" content="Dashboard" />

      <Divider hidden />

      <Segment placeholder>
        <Grid columns={3} relaxed="very" stackable>
          <Grid.Column>
            <Header as="h3">Your Stats</Header>

            <Segment textAlign="left">
              <List size="large">
                <List.Item>Total jobs created: (unknown)</List.Item>
                <List.Item>Available jobs: (unknown)</List.Item>
                <List.Item>Created applications: (unknown)</List.Item>
                <List.Item>Total contracts: (unknown)</List.Item>
                <List.Item>Active contracts: (unknown)</List.Item>
                <List.Item>Total transactions volume: (unknown)</List.Item>
                <List.Item>Income as a freelancer: (unknown)</List.Item>
              </List>
            </Segment>
          </Grid.Column>

          <Grid.Column>
            <Header as="h3">Current Node Stats</Header>

            <Segment textAlign="left">
              <List size="large">
                <List.Item>Clients: {events.CLIENT_CREATED}</List.Item>
                <List.Item>Processed jobs: {events.JOB_CREATED}</List.Item>
                <List.Item>
                  Processed applications: {events.APPLICATION_CREATED}
                </List.Item>
                <List.Item>
                  Processed contracts: {events.CONTRACT_CREATED}
                </List.Item>
              </List>
            </Segment>
          </Grid.Column>

          <Grid.Column>
            <Header as="h3">OptriSpace Stats</Header>

            <Segment textAlign="left">
              <List size="large">
                <List.Item>Node owners: {stats.nodeOwnersCount}</List.Item>
                <List.Item>
                  Frontend nodes: {stats.frontendNodesCount}
                </List.Item>
                <List.Item>Members: {stats.membersCount}</List.Item>
                <List.Item>Jobs: {gigsStats.jobsCount}</List.Item>
                <List.Item>
                  Applications: {gigsStats.applicationsCount}
                </List.Item>
                <List.Item>Contracts: {gigsStats.contractsCount}</List.Item>
                <List.Item>
                  Jobs categories: {gigsStats.jobsCategoriesCount}
                </List.Item>
              </List>
            </Segment>
          </Grid.Column>
        </Grid>
      </Segment>
    </Container>
  )
}
