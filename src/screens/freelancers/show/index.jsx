import React, { useState, useEffect } from 'react'
import getConfig from 'next/config'
import {
  Divider,
  Container,
  List,
  Image,
  Header,
  Grid,
} from 'semantic-ui-react'
import { useContractRead } from 'wagmi'
import { errorHandler } from '../../../lib/errorHandler'
import gigsGetFreelancerQuery from '../../../../contracts/GigsGetFreelancerQuery.json'
import ErrorWrapper from '../../../components/ErrorWrapper'
import JustOneSecond, {
  JustOneSecondBlockchain,
} from '../../../components/JustOneSecond'
import { formatDateTime } from '../../../lib/formatDate'

const { publicRuntimeConfig } = getConfig()
const { optriSpaceContractAddress, blockchainViewAddressURL } =
  publicRuntimeConfig

export const FreelancerScreen = ({ freelancerAddress, currentAccount }) => {
  const [freelancer, setFreelancer] = useState(undefined)
  const [freelancerExists, setFreelancerExists] = useState(false)

  const {
    data: response,
    error: freelancerError,
    isLoading: freelancerLoading,
  } = useContractRead({
    address: optriSpaceContractAddress,
    abi: gigsGetFreelancerQuery,
    functionName: 'gigsGetFreelancer',
    args: [freelancerAddress],
    overrides: { from: currentAccount },
  })

  useEffect(() => {
    if (!response) return

    const { exists, dto } = response

    if (!exists) return

    setFreelancerExists(true)

    const j = {
      address: dto.id,
      displayName: dto.displayName,
      about: dto.about,
      totalContractsCount: +dto.totalContractsCount,
      succeededContractsCount: +dto.succeededContractsCount,
      failedContractsCount: +dto.failedContractsCount,
      lastActivityAt: +dto.lastActivityAt.toString(),
    }

    setFreelancer(j)
  }, [response])

  if (freelancerLoading) {
    return <JustOneSecondBlockchain message="Loading freelancer..." />
  }

  if (freelancerError) {
    return (
      <ErrorWrapper
        header="Error fetching freelancer"
        error={errorHandler(freelancerError)}
      />
    )
  }

  if (!freelancerExists) {
    return (
      <ErrorWrapper header={`Freelancer ${freelancerAddress} does not exist`} />
    )
  }

  if (!freelancer) {
    return <JustOneSecond title="Initializing freelancer..." />
  }

  return (
    <Grid stackable columns={1} divided padded relaxed>
      <Grid.Row>
        <Grid.Column textAlign="center">
          <Header as="h1">
            Welcome to my profile!
            {freelancer.displayName !== '' && (
              <> I&apos;m {freelancer.displayName}</>
            )}
          </Header>

          <Divider hidden />
        </Grid.Column>
      </Grid.Row>

      <Grid.Row>
        <Grid.Column width={12}>
          <Container text>
            <Header as="h3">My blockchain address:</Header>

            <p>
              <a
                href={`${blockchainViewAddressURL}/${freelancer.address}`}
                target="_blank"
                rel="noreferrer noopener nofollow"
                title="Open wallet information"
              >
                {freelancer.address}
              </a>
            </p>

            {freelancer.about !== '' && (
              <>
                <Header as="h3" style={{ wordWrap: 'break-word' }}>
                  About me:
                </Header>

                {freelancer.about}
              </>
            )}

            <Header as="h3" style={{ wordWrap: 'break-word' }}>
              My stats:
            </Header>

            <List>
              <List.Item>
                Total contracts: {freelancer.totalContractsCount}
              </List.Item>
              <List.Item>
                Succeeded contracts: {freelancer.succeededContractsCount}
              </List.Item>
              <List.Item>
                Failed contracts: {freelancer.failedContractsCount}
              </List.Item>
            </List>

            <Header as="h3" style={{ wordWrap: 'break-word' }}>
              My last transaction on OptriSpace was:
            </Header>

            <p>{formatDateTime(freelancer.lastActivityAt)}</p>
          </Container>
        </Grid.Column>

        <Grid.Column floated="right" width={4}>
          <Image src="/default-userpic.png" alt="Avatar" floated="right" />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}
