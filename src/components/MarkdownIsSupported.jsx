import { Message, Icon } from 'semantic-ui-react'

export const MarkdownIsSupported = () => {
  return (
    <Message icon>
      <Icon name="lightbulb outline" />
      <Message.Content>
        <Message.Header>Do you know?</Message.Header>
        <p>
          You can use{' '}
          <a
            href="https://commonmark.org/help/"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            Markdown{' '}
          </a>
          formatting elements in a description.
          <br />
          Headings (h1-h6) and blockquote are not supported.
        </p>
      </Message.Content>
    </Message>
  )
}
