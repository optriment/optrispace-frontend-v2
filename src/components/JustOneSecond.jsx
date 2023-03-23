import { Divider, Message, Icon } from 'semantic-ui-react'
import useTranslation from 'next-translate/useTranslation'

export default function JustOneSecond({ title }) {
  const { t } = useTranslation('common')

  return (
    <Message icon>
      <Icon name="circle notched" loading />
      <Message.Content>
        <Message.Header content={t('components.just_one_second.header')} />
        <p>{title || t('components.just_one_second.default_description')}</p>
      </Message.Content>
    </Message>
  )
}

export function JustOneSecondBlockchain({ message }) {
  const { t } = useTranslation('common')

  return (
    <Message icon>
      <Icon name="circle notched" loading />
      <Message.Content>
        <Message.Header
          content={t('components.just_one_second_blockchain.header')}
        />

        {message ? (
          <p>{message}</p>
        ) : (
          <p>
            {t('components.just_one_second_blockchain.default_description')}
          </p>
        )}

        <Divider />

        <p>{t('components.just_one_second_blockchain.suggestion')}</p>
      </Message.Content>
    </Message>
  )
}
