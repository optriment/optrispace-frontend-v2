import ReactMarkdown from 'react-markdown'

export const FormattedDescription = ({ description }) => {
  return (
    <ReactMarkdown
      linkTarget="_blank"
      components={{
        h1: 'p',
        h2: 'p',
        h3: 'p',
        h4: 'p',
        h5: 'p',
        h6: 'p',
        blockquote: 'p',
      }}
    >
      {description}
    </ReactMarkdown>
  )
}
