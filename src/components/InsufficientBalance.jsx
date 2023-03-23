import { Divider, Message, Icon } from 'semantic-ui-react'
import useTranslation from 'next-translate/useTranslation'

export const InsufficientBalance = () => {
  const { t } = useTranslation('common')

  return (
    <Message warning icon>
      <Icon name="warning circle" />

      <Message.Content>
        <Message.Header content={t('components.insufficient_balance.header')} />

        <Divider />

        <p>{t('components.insufficient_balance.line1')}</p>
        <p>{t('components.insufficient_balance.line2')}</p>
      </Message.Content>
    </Message>
  )
}
