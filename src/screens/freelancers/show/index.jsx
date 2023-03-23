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
import useTranslation from 'next-translate/useTranslation'

const { publicRuntimeConfig } = getConfig()
const { optriSpaceContractAddress, blockchainViewAddressURL } =
  publicRuntimeConfig

export const FreelancerScreen = ({ freelancerAddress, currentAccount }) => {
  const { t } = useTranslation('common')

  const [freelancer, setFreelancer] = useState(undefined)
  const [freelancerExists, setFreelancerExists] = useState(false)

  const {
    data: response,
    error,
    isLoading,
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

    const f = {
      address: dto.id,
      displayName: dto.displayName,
      about: dto.about,
      totalContractsCount: +dto.totalContractsCount,
      succeededContractsCount: +dto.succeededContractsCount,
      failedContractsCount: +dto.failedContractsCount,
      lastActivityAt: +dto.lastActivityAt.toString(),
    }

    setFreelancer(f)
  }, [response])

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

  if (!freelancerExists) {
    return (
      <ErrorWrapper
        header={t('errors.messages.not_found', {
          entity: `Freelancer ${freelancerAddress}`,
        })}
      />
    )
  }

  if (!freelancer) {
    return <JustOneSecond title={t('labels.initializing')} />
  }

  return (
    <Grid stackable columns={1} divided padded relaxed>
      <Grid.Row>
        <Grid.Column textAlign="center">
          <Header
            as="h1"
            content={t('pages.freelancers.show.header.title', {
              name:
                freelancer.displayName !== ''
                  ? freelancer.displayName
                  : freelancer.address,
            })}
          />

          <Divider hidden />
        </Grid.Column>
      </Grid.Row>

      <Grid.Row>
        <Grid.Column width={12}>
          <Container text>
            <Header
              as="h3"
              style={{ wordWrap: 'break-word' }}
              content={t('pages.freelancers.show.about.header')}
            />

            {freelancer.about ||
              t('pages.freelancers.show.about.no_information_given')}

            <Header
              as="h3"
              content={t('pages.freelancers.show.blockchain_address.header')}
            />

            <p>
              <a
                href={`${blockchainViewAddressURL}/${freelancer.address}`}
                target="_blank"
                rel="noreferrer noopener nofollow"
              >
                {freelancer.address}
              </a>
            </p>

            <Header
              as="h3"
              content={t('pages.freelancers.show.stats.header')}
            />

            <List>
              <List.Item
                content={t('pages.freelancers.show.stats.total_contracts', {
                  count: freelancer.totalContractsCount,
                })}
              />
              <List.Item
                content={t('pages.freelancers.show.stats.succeeded_contracts', {
                  count: freelancer.succeededContractsCount,
                })}
              />
              <List.Item
                content={t('pages.freelancers.show.stats.failed_contracts', {
                  count: freelancer.failedContractsCount,
                })}
              />
            </List>

            <Header
              as="h3"
              content={t('pages.freelancers.show.last_transaction_was.header')}
            />

            <p>{formatDateTime(freelancer.lastActivityAt, t('date.locale'))}</p>
          </Container>
        </Grid.Column>

        <Grid.Column floated="right" width={4}>
          <Image
            src="/default-userpic.png"
            alt={t('pages.freelancers.show.profile_picture')}
            floated="right"
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}
