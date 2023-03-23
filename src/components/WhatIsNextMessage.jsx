import { Icon, Message, Divider } from 'semantic-ui-react'
import useTranslation from 'next-translate/useTranslation'

export const WhatIsNextMessage = ({ children }) => {
  const { t } = useTranslation('common')

  return (
    <Message icon>
      <Icon name="wait" />

      <Message.Content>
        <Message.Header content={t('components.what_is_next_message.header')} />

        <Divider />

        {children}
      </Message.Content>
    </Message>
  )
}
