import { Message, Icon } from 'semantic-ui-react'
import useTranslation from 'next-translate/useTranslation'
import Trans from 'next-translate/Trans'

export const MarkdownIsSupported = () => {
  const { t } = useTranslation('common')

  return (
    <Message icon>
      <Icon name="lightbulb outline" />
      <Message.Content>
        <Message.Header
          content={t('components.markdown_is_supported.header')}
        />

        <Trans
          i18nKey="common:components.markdown_is_supported.line1"
          components={[
            <p key={1} />,
            <a
              key={2}
              href="https://commonmark.org/help/"
              target="_blank"
              rel="nofollow noopener noreferrer"
            />,
          ]}
        />

        <p>{t('components.markdown_is_supported.line2')}</p>
      </Message.Content>
    </Message>
  )
}
