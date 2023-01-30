import { Message, Icon, Divider } from 'semantic-ui-react'

export const ConfirmTransactionMessage = () => (
  <Message warning icon>
    <Icon name="file code" />

    <Message.Content>
      <Message.Header>Action required</Message.Header>

      <Divider />

      <p>
        We are ready to save data on blockchain.
        <br />
        Please confirm transaction in your MetaMask wallet.
      </p>
    </Message.Content>
  </Message>
)
