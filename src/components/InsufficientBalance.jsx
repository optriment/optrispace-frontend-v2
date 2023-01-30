import { Divider, Message, Icon } from 'semantic-ui-react'

export const InsufficientBalance = () => {
  return (
    <Message warning icon>
      <Icon name="warning circle" />

      <Message.Content>
        <Message.Header>Insufficient Balance</Message.Header>

        <Divider />

        <p>
          Unfortunately you do not have enough money in your account to perform
          a transaction on blockchain.
          <br />
          Please deposit some money to your wallet and try again.
        </p>
      </Message.Content>
    </Message>
  )
}
