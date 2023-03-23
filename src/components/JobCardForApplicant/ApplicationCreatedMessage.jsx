import { Message } from 'semantic-ui-react'
import useTranslation from 'next-translate/useTranslation'

export const ApplicationCreatedMessage = ({ comment, serviceFee, symbol }) => {
  const { t } = useTranslation('common')

  return (
    <Message>
      <Message.Header
        content={t('pages.jobs.show.application_created_message.header', {
          serviceRate: serviceFee,
          symbol: symbol,
        })}
      />

      <p>
        {t('pages.jobs.show.application_created_message.comment', {
          comment: comment,
        })}
      </p>

      <Message.List>
        <Message.Item>
          {t('pages.jobs.show.application_created_message.line1')}
        </Message.Item>

        <Message.Item>
          {t('pages.jobs.show.application_created_message.line2')}
        </Message.Item>

        <Message.Item>
          {t('pages.jobs.show.application_created_message.line3')}
        </Message.Item>

        <Message.Item>
          <b>{t('pages.jobs.show.application_created_message.line4')}</b>
        </Message.Item>
      </Message.List>
    </Message>
  )
}
