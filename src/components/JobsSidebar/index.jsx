import React from 'react'
import { Form, Segment, Header } from 'semantic-ui-react'
import useTranslation from 'next-translate/useTranslation'

export const JobsSidebar = () => {
  const { t } = useTranslation('common')

  return (
    <Segment>
      <Segment basic>
        <Header
          as="h3"
          dividing
          content={t('components.jobs_sidebar.filters')}
        />

        <Form>
          <Form.Select
            fluid
            label={`${t('components.jobs_sidebar.category')}:`}
            placeholder={t('components.jobs_sidebar.all')}
            disabled
          />

          <Form.Select
            fluid
            label={`${t('components.jobs_sidebar.applications')}:`}
            placeholder={t('components.jobs_sidebar.all')}
            disabled
          />

          <Form.Select
            fluid
            label={`${t('components.jobs_sidebar.budget')}:`}
            placeholder={t('components.jobs_sidebar.all')}
            disabled
          />

          <Form.Button content={t('buttons.reset')} disabled />
        </Form>
      </Segment>
    </Segment>
  )
}
