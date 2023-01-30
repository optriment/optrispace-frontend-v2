import React from 'react'
import { Message } from 'semantic-ui-react'

export default function ErrorWrapper({ header, error }) {
  return (
    <Message negative>
      <Message.Header>{header}</Message.Header>
      {error && error !== '' && <p>{error}</p>}
    </Message>
  )
}
