import { useState } from 'react'
import { Form, Segment, Header } from 'semantic-ui-react'
import useTranslation from 'next-translate/useTranslation'

const defaultFilters = {
  posted: 'all',
  category: 'all',
  applicationsCount: 'all',
}

const categories = [
  'other',
  'programming',
  'marketing',
  'seo',
  'system_administration',
  'design_and_illustrations',
  'writing',
  'translations',
  'multimedia',
  'administration_support',
  'customer_service',
  'data_science_and_analytics',
  'legal',
  'engineering_and_architecture',
  'human_resources',
  'testing',
]

export const JobsSidebar = ({ onFilterChanged }) => {
  const { t } = useTranslation('common')

  const [filters, setFilters] = useState(defaultFilters)

  const postedOptions = [
    {
      key: 'all',
      text: t('components.jobs_sidebar.all'),
      value: 'all',
    },
    {
      key: 'last_week',
      text: t('components.jobs_sidebar.last_week'),
      value: 'last_week',
    },
    {
      key: 'last_month',
      text: t('components.jobs_sidebar.last_month'),
      value: 'last_month',
    },
  ]

  const categoryOptions = () => {
    const c = [
      {
        key: 'all',
        text: t('components.jobs_sidebar.all'),
        value: 'all',
      },
    ]

    return c.concat(
      categories.sort().map((key) => {
        return {
          key: key,
          text: t(`jobs:categories.${key}`),
          value: key,
        }
      })
    )
  }

  const applicationOptions = [
    {
      key: 'all',
      text: t('components.jobs_sidebar.all'),
      value: 'all',
    },
    {
      key: 'zero',
      text: '0',
      value: 'zero',
    },
    {
      key: 'not_zero',
      text: '> 0',
      value: 'not_zero',
    },
  ]

  const handlePosted = (e, o) => {
    setFilters({
      ...filters,
      posted: o.value,
    })
  }

  const handleCategoryChange = (e, o) => {
    setFilters({
      ...filters,
      category: o.value,
    })
  }

  const handleApplicationsCount = (e, o) => {
    setFilters({
      ...filters,
      applicationsCount: o.value,
    })
  }

  const handleSetFilters = () => {
    onFilterChanged(filters)
  }

  const handleResetFilters = () => {
    setFilters(defaultFilters)
    onFilterChanged(defaultFilters)
  }

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
            label={`${t('components.jobs_sidebar.posted')}:`}
            options={postedOptions}
            value={filters.posted}
            onChange={handlePosted}
          />

          <Form.Select
            fluid
            label={`${t('components.jobs_sidebar.category')}:`}
            options={categoryOptions()}
            value={filters.category}
            onChange={handleCategoryChange}
          />

          <Form.Select
            fluid
            label={`${t('components.jobs_sidebar.applications')}:`}
            options={applicationOptions}
            value={filters.applicationsCount}
            onChange={handleApplicationsCount}
          />

          <Form.Select
            fluid
            label={`${t('components.jobs_sidebar.budget')}:`}
            placeholder={t('components.jobs_sidebar.all')}
            disabled
          />

          <Form.Group>
            <Form.Button
              primary
              content={t('buttons.apply')}
              onClick={handleSetFilters}
            />

            <Form.Button
              content={t('buttons.reset')}
              onClick={handleResetFilters}
            />
          </Form.Group>
        </Form>
      </Segment>
    </Segment>
  )
}
