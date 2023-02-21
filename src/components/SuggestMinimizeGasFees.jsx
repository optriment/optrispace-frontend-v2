import { Message } from 'semantic-ui-react'

export const SuggestMinimizeGasFees = () => {
  return (
    <Message icon>
      <Message.Content>
        <Message.Header>Suggestion</Message.Header>
        <p>
          If you are working on a project that involves sharing and
          collaborating on documents or code, you may want to consider using a
          cloud-based platform such as Google Docs or GitHub. The more detailed
          is your description here, the more you will pay in gas fees to submit
          this job.
        </p>
        <p>
          Providing detailed explanations of the tasks in a separate document or
          repository can help reduce the amount of data you need to store on the
          blockchain. These platforms allow you to collaborate with others
          without incurring high gas fees, as the data is not stored on the
          blockchain.
        </p>
        <p>
          Additionally, you can use Telegram or Discord to share and discuss
          ideas with the freelancer.
        </p>
      </Message.Content>
    </Message>
  )
}
