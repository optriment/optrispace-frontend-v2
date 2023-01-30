import React from 'react'
import { Button, Divider, Message, Icon } from 'semantic-ui-react'

export const WrongBlockchainNetwork = ({
  blockchainNetworkName,
  switchNetwork,
}) => {
  return (
    <Message warning icon>
      <Icon name="warning sign" />

      <Message.Content>
        <Message.Header>
          You are connected to the wrong blockchain network
        </Message.Header>

        <Divider />

        <p>
          Our platform uses {blockchainNetworkName}.
          <br />
          Please connect your wallet to the valid network and reload the page.
        </p>

        <Divider />

        <Button primary onClick={() => switchNetwork()}>
          Switch Network to {blockchainNetworkName}
        </Button>
      </Message.Content>
    </Message>
  )
}
