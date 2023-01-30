import { Button } from 'semantic-ui-react'

export const ExecuteBlockchainTransactionButton = ({
  icon,
  content,
  onClick,
  positive,
  negative,
  floated,
}) => (
  <Button
    icon={icon ?? 'play'}
    labelPosition="left"
    floated={floated}
    color="orange"
    positive={positive}
    negative={negative}
    content={content}
    onClick={onClick}
  />
)
