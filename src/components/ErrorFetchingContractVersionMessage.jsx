import { Divider, Message, Icon } from 'semantic-ui-react'

export const ErrorFetchingContractVersionMessage = ({ description }) => {
  return (
    <Message negative icon>
      <Icon name="warning sign" />

      <Message.Content>
        <Message.Header>Invalid Settings Detected!</Message.Header>

        <Divider />

        <p>
          It looks like current application is connected to an invalid smart
          contract address.
          <br />
          Please contact our team to get actual smart contract address and
          update your application settings.
        </p>

        <p>
          <b>Error description:</b>
          <br />
          {description}
        </p>
      </Message.Content>
    </Message>
  )
}
