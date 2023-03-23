import { Divider, Message, Button } from 'semantic-ui-react'
import useTranslation from 'next-translate/useTranslation'
import Trans from 'next-translate/Trans'

export const FriendlyReminderMessage = ({ onAgree, gitHubLink }) => {
  const { t } = useTranslation('common')

  return (
    <Message>
      <Message.Header
        content={t('forms.application_form.friendly_reminder_message.header')}
      />

      <Divider />

      <Trans
        i18nKey="common:forms.application_form.friendly_reminder_message.line1"
        components={[
          <p key={1} />,
          <a
            key={2}
            href={gitHubLink}
            target="_blank"
            rel="noreferrer noopener nofollow"
          />,
        ]}
      />

      <p>{t('forms.application_form.friendly_reminder_message.line2')}</p>

      <Divider />

      <p>
        <Button positive onClick={onAgree} content={t('buttons.agree')} />
      </p>
    </Message>
  )
}
