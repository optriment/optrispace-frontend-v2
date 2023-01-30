import { Message } from 'semantic-ui-react'

export const ApplicationCreatedMessage = ({ comment, serviceFee, symbol }) => {
  return (
    <Message>
      <Message.Header>
        You&apos;ve applied with the service rate of
        {` ${serviceFee} ${symbol}`} (application price).
      </Message.Header>

      <p>Your comment: {comment}</p>

      <Message.List>
        <Message.Item>
          The next step is to get a contract from the customer to do this task
          and get paid.
        </Message.Item>

        <Message.Item>
          You have to discuss terms and conditions and then prove, that you are
          ready to work.
        </Message.Item>

        <Message.Item>
          Pay attention and ask anything you need to complete this task.
        </Message.Item>

        <Message.Item>
          <b>Please do not start working before getting funded contract!</b>
        </Message.Item>
      </Message.List>
    </Message>
  )
}
