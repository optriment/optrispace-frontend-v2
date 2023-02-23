import { Divider, Message, Button } from 'semantic-ui-react'

export const FriendlyReminderMessage = ({ onAgree, gitHubLink }) => {
  return (
    <Message>
      <Message.Header>Friendly reminder from OptriSpace Team</Message.Header>

      <Divider />

      <p>
        Please note that we will do our best to review all applications (for our
        tasks) and answer everyone ASAP. If you really like the project, and
        you&apos;d like your application to be reviewed sooner, please consider
        creating some meaningful Pull Requests to any of our
        <a href={gitHubLink} target="_blank" rel="noreferrer noopener nofollow">
          {' open-source projects '}
        </a>
        and include the link to a PR to your application.
      </p>

      <p>
        <b>Pay attention!</b> When applying for jobs, you should never have to
        pay to apply (except gas fees for processing transactions on the
        blockchain). You should also never have to pay a customer for something
        (to speed up your application processing, etc.).
      </p>

      <Divider />

      <p>
        <Button positive onClick={onAgree}>
          Agree
        </Button>
      </p>
    </Message>
  )
}
