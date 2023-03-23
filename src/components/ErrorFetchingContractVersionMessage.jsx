import { Divider, Message, Icon } from 'semantic-ui-react'
import useTranslation from 'next-translate/useTranslation'

export const ErrorFetchingContractVersionMessage = ({ description }) => {
  const { t } = useTranslation('common')

  return (
    <Message negative icon>
      <Icon name="warning sign" />

      <Message.Content>
        <Message.Header
          content={t('components.error_fetching_contract_version.header')}
        />

        <Divider />

        <p>
          {t('components.error_fetching_contract_version.line1')}
          <br />
          {t('components.error_fetching_contract_version.line2')}
        </p>

        <p>
          <b>
            {t('components.error_fetching_contract_version.error_description')}
          </b>
          <br />
          {description}
        </p>
      </Message.Content>
    </Message>
  )
}
