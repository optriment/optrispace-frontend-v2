import { Icon, Message } from 'semantic-ui-react'
import useTranslation from 'next-translate/useTranslation'

export const SuggestMinimizeGasFees = () => {
  const { t } = useTranslation('common')

  return (
    <Message icon>
      <Icon name="lightbulb outline" />

      <Message.Content>
        <Message.Header
          content={t('components.suggest_minimize_gas_fees.header')}
        />

        <p>{t('components.suggest_minimize_gas_fees.line1')}</p>
        <p>{t('components.suggest_minimize_gas_fees.line2')}</p>
        <p>{t('components.suggest_minimize_gas_fees.line3')}</p>
      </Message.Content>
    </Message>
  )
}
