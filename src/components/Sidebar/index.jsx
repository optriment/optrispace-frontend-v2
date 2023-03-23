import React from 'react'
import { List, Segment, Header } from 'semantic-ui-react'
import useTranslation from 'next-translate/useTranslation'

export const Sidebar = () => {
  const { t } = useTranslation('common')

  return (
    <>
      <Segment>
        <Segment basic>
          <Header as="h3" dividing content={t('components.sidebar.header')} />

          <List bulleted>
            <List.Item content={t('components.sidebar.no_paperwork')} />
            <List.Item content={t('components.sidebar.no_middlemen')} />
            <List.Item content={t('components.sidebar.no_managers')} />
            <List.Item content={t('components.sidebar.no_third_parties')} />
            <List.Item
              content={t('components.sidebar.fast_and_secure_payments')}
            />
            <List.Item content={t('components.sidebar.no_platform_fees')} />
            <List.Item
              content={t('components.sidebar.powered_by_smart_contracts')}
            />
            <List.Item
              content={t('components.sidebar.all_code_is_open_source')}
            />
            <List.Item
              content={t('components.sidebar.all_payments_in_crypto')}
            />
            <List.Item
              content={t('components.sidebar.born_to_work_globally')}
            />
          </List>
        </Segment>
      </Segment>
    </>
  )
}
