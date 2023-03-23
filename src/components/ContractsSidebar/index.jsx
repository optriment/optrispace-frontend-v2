import React from 'react'
import { Form, Segment, Header } from 'semantic-ui-react'
import useTranslation from 'next-translate/useTranslation'

export const ContractsSidebar = ({ as }) => {
  const { t } = useTranslation('common')

  return (
    <Segment>
      <Segment basic>
        <Header
          as="h3"
          dividing
          content={t('components.contracts_sidebar.filters')}
        />

        <Form>
          <Form.Select
            fluid
            label={`${t('components.contracts_sidebar.status')}:`}
            placeholder={t('components.contracts_sidebar.all')}
            disabled
          />

          <Form.Select
            fluid
            label={`${t('components.contracts_sidebar.job')}:`}
            placeholder={t('components.contracts_sidebar.all')}
            disabled
          />

          <Form.Select
            fluid
            label={
              as === 'customer'
                ? t('components.contracts_sidebar.contractor')
                : t('components.contracts_sidebar.customer')
            }
            placeholder="All"
            disabled
          />

          <Form.Checkbox
            label={t('components.contracts_sidebar.action_required')}
            disabled
          />

          <Form.Button content={t('buttons.reset')} disabled />
        </Form>
      </Segment>
    </Segment>
  )
}
