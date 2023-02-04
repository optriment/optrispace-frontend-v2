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

const { publicRuntimeConfig } = getConfig()
const { optriSpaceContractAddress, blockchainViewAddressURL } =
  publicRuntimeConfig

export const CustomerScreen = ({ customerAddress, currentAccount }) => {
  const [customer, setCustomer] = useState(undefined)
  const [customerExists, setCustomerExists] = useState(false)

  const {
    data: response,
    error: customerError,
    isLoading: customerLoading,
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

  if (customerLoading) {
    return <JustOneSecondBlockchain message="Loading customer..." />
  }

  if (customerError) {
    return (
      <ErrorWrapper
        header="Error fetching customer"
        error={errorHandler(customerError)}
      />
    )
  }

  if (!customerExists) {
    return (
      <ErrorWrapper header={`Customer ${customerAddress} does not exist`} />
    )
  }

  if (!customer) {
    return <JustOneSecond title="Initializing customer..." />
  }

  return (
    <Grid stackable columns={1} divided padded relaxed>
      <Grid.Row>
        <Grid.Column textAlign="center">
          <Header as="h1">
            Welcome to my profile!
            {customer.displayName !== '' && (
              <> I&apos;m {customer.displayName}</>
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
                href={`${blockchainViewAddressURL}/${customer.address}`}
                target="_blank"
                rel="noreferrer noopener nofollow"
                title="Open wallet information"
              >
                {customer.address}
              </a>
            </p>

            <Header as="h3" style={{ wordWrap: 'break-word' }}>
              My stats:
            </Header>

            <List>
              <List.Item>
                Total contracts: {customer.totalContractsCount}
              </List.Item>
            </List>

            <Header as="h3" style={{ wordWrap: 'break-word' }}>
              My last transaction on OptriSpace was:
            </Header>

            <p>{formatDateTime(customer.lastActivityAt)}</p>
          </Container>
        </Grid.Column>

        <Grid.Column floated="right" width={4}>
          <Image src="/default-userpic.png" alt="Avatar" floated="right" />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}
