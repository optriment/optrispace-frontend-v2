import { Message, Icon, Divider } from 'semantic-ui-react'
import useTranslation from 'next-translate/useTranslation'

export const ConfirmTransactionMessage = () => {
  const { t } = useTranslation('common')

  return (
    <Message warning icon>
      <Icon name="file code" />

      <Message.Content>
        <Message.Header
          content={t('components.confirm_transaction_message.header')}
        />

        <Divider />

        <p>{t('components.confirm_transaction_message.line1')}</p>
        <p>{t('components.confirm_transaction_message.line2')}</p>
      </Message.Content>
    </Message>
  )
}
