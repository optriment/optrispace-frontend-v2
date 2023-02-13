import React from 'react'
import Link from 'next/link'
import { List, Icon, Divider, Button, Segment, Header } from 'semantic-ui-react'
import { formatDateTime } from '../../lib/formatDate'

const formatTimestamp = (timestamp) => {
  if (timestamp === 0) return 'No'

  return formatDateTime(timestamp)
}

export const Sidebar = ({ contract, symbol, blockchainViewAddressURL }) => {
  return (
    <>
      <Segment>
        <Header as="h3">Your Contract</Header>

        <List bulleted>
          <List.Item>Current Status: {contract.status}</List.Item>
          <List.Item>
            Contract Value: {contract.value} {symbol}
          </List.Item>
          <List.Item>
            Contract Balance: {contract.balance} {symbol}
          </List.Item>
          <List.Item>
            Contractor profile:{' '}
            <Link href={`/freelancers/${contract.contractorAddress}`}>
              open
            </Link>
          </List.Item>
        </List>

        <Divider />

        <p>
          These values below are automatically calculated and depend on current
          contract status. For example, you will know expected dates of your
          contract when contract will be funded.
        </p>

        <List bulleted>
          <List.Item>
            Work Should be Started Before:{' '}
            {contract.workShouldBeStartedBefore > 0
              ? formatTimestamp(contract.workShouldBeStartedBefore)
              : 'N/A'}
          </List.Item>

          <List.Item>
            Result Should be Delivered Before:{' '}
            {contract.workShouldBeStartedBefore > 0
              ? formatTimestamp(contract.resultShouldBeDeliveredBefore)
              : 'N/A'}
          </List.Item>
        </List>
      </Segment>

      <Segment>
        <Header as="h3">Wallets & Transactions</Header>

        <p>
          If you want to check all transactions of your contractor or smart
          contract on blockchain, feel free to use buttons below.
        </p>

        <Button
          icon
          labelPosition="right"
          as="a"
          href={`${blockchainViewAddressURL}/${contract.contractorAddress}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          <Icon name="external alternate" />
          Contractor
        </Button>

        <Button
          icon
          labelPosition="right"
          as="a"
          href={`${blockchainViewAddressURL}/${contract.address}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          <Icon name="external alternate" />
          Contract
        </Button>
      </Segment>

      <Segment>
        <Header as="h3">Do you need any help?</Header>

        <p>
          Please join our social media community and ask anything what you want
          about our platform.
        </p>

        <Button
          as="a"
          color="twitter"
          icon="twitter"
          href="https://twitter.com/optrispace"
          target="_blank"
          rel="noreferrer noopener nofollow"
          title="Twitter"
          content="Twitter"
        />

        <Button
          as="a"
          color="linkedin"
          icon="linkedin"
          href="https://www.linkedin.com/company/optriment"
          target="_blank"
          rel="noreferrer noopener nofollow"
          title="LinkedIn"
          content="LinkedIn"
        />

        <Button
          as="a"
          color="violet"
          icon="discord"
          href="https://discord.gg/7WEbtmuqtv"
          target="_blank"
          rel="noreferrer noopener nofollow"
          title="Discord"
          content="Discord"
        />
      </Segment>
    </>
  )
}
