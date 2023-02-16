import { Divider, Message, Icon } from 'semantic-ui-react'

export default function JustOneSecond({ title }) {
  return (
    <Message icon>
      <Icon name="circle notched" loading />
      <Message.Content>
        <Message.Header>Just one second</Message.Header>
        {title || 'We are fetching that content for you.'}
      </Message.Content>
    </Message>
  )
}

export function JustOneSecondBlockchain({ message }) {
  return (
    <Message icon>
      <Icon name="circle notched" loading />
      <Message.Content>
        <Message.Header>Please wait...</Message.Header>

        {message ? (
          <p>{message}</p>
        ) : (
          <p>We are waiting for the blockchain response.</p>
        )}

        <Divider />

        <p>
          If this message will not disappear in 15-20 seconds, please refresh
          the page.
        </p>
      </Message.Content>
    </Message>
  )
}
