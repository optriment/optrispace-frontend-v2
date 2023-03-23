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
import gigsGetCustomerQuery from '../../../../contracts/GigsGetCustomerQuery.json'
import ErrorWrapper from '../../../components/ErrorWrapper'
import JustOneSecond, {
  JustOneSecondBlockchain,
} from '../../../components/JustOneSecond'
import { formatDateTime } from '../../../lib/formatDate'
import useTranslation from 'next-translate/useTranslation'

const { publicRuntimeConfig } = getConfig()
const { optriSpaceContractAddress, blockchainViewAddressURL } =
  publicRuntimeConfig

export const CustomerScreen = ({ customerAddress, currentAccount }) => {
  const { t } = useTranslation('common')

  const [customer, setCustomer] = useState(undefined)
  const [customerExists, setCustomerExists] = useState(false)

  const {
    data: response,
    error,
    isLoading,
  } = useContractRead({
    address: optriSpaceContractAddress,
    abi: gigsGetCustomerQuery,
    functionName: 'gigsGetCustomer',
    args: [customerAddress],
    overrides: { from: currentAccount },
  })

  useEffect(() => {
    if (!response) return

    const { exists, dto } = response

    if (!exists) return

    setCustomerExists(true)

    const j = {
      address: dto.id,
      displayName: dto.displayName,
      totalContractsCount: +dto.totalContractsCount,
      lastActivityAt: +dto.lastActivityAt.toString(),
    }

    setCustomer(j)
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

  if (!customerExists) {
    return (
      <ErrorWrapper
        header={t('errors.messages.not_found', {
          entity: `Customer ${customerAddress}`,
        })}
      />
    )
  }

  if (!customer) {
    return <JustOneSecond title={t('labels.initializing')} />
  }

  return (
    <Grid stackable columns={1} divided padded relaxed>
      <Grid.Row>
        <Grid.Column textAlign="center">
          <Header
            as="h1"
            content={t('pages.customers.show.header.title', {
              name:
                customer.displayName !== ''
                  ? customer.displayName
                  : customer.address,
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
              content={t('pages.customers.show.blockchain_address.header')}
            />

            <p>
              <a
                href={`${blockchainViewAddressURL}/${customer.address}`}
                target="_blank"
                rel="noreferrer noopener nofollow"
              >
                {customer.address}
              </a>
            </p>

            <Header as="h3" content={t('pages.customers.show.stats.header')} />

            <List>
              <List.Item
                content={t('pages.customers.show.stats.total_contracts', {
                  count: customer.totalContractsCount,
                })}
              />
            </List>

            <Header
              as="h3"
              content={t('pages.customers.show.last_transaction_was.header')}
            />

            <p>{formatDateTime(customer.lastActivityAt, t('date.locale'))}</p>
          </Container>
        </Grid.Column>

        <Grid.Column floated="right" width={4}>
          <Image
            src="/default-userpic.png"
            alt={t('pages.customers.show.profile_picture')}
            floated="right"
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}
