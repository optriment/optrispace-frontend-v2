import { Icon, Message, Divider } from 'semantic-ui-react'

export const WhatIsNextMessage = ({ children }) => {
  return (
    <Message icon>
      <Icon name="wait" />

      <Message.Content>
        <Message.Header>What is next?</Message.Header>

        <Divider />

        {children}
      </Message.Content>
    </Message>
  )
}
