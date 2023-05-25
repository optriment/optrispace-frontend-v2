import React, { useState } from 'react'
import { Form, Segment, Header } from 'semantic-ui-react'
import useTranslation from 'next-translate/useTranslation'

const defaultFilters = {
  status: 'active',
}

const statuses = [
  'active',
  'created',
  'accepted',
  'funded',
  'started',
  'delivered',
  'approved',
  'declined',
  'withdrew',
  'refunded',
  'closed',
]

export const ContractsSidebar = ({ onFilterChanged }) => {
  const { t } = useTranslation('common')

  const [filters, setFilters] = useState(defaultFilters)

  const statusOptions = () => {
    const s = [
      {
        key: 'all',
        text: t('components.contracts_sidebar.all'),
        value: 'all',
      },
    ]

    return s.concat(
      statuses.map((key) => {
        return {
          key: key,
          text: t(`contracts:model.statuses.${key}`),
          value: key,
        }
      })
    )
  }

  const handleStatusChange = (e, o) => {
    setFilters({ ...filters, status: o.value })
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
          content={t('components.contracts_sidebar.filters')}
        />

        <Form>
          <Form.Select
            fluid
            label={`${t('components.contracts_sidebar.status')}:`}
            options={statusOptions()}
            value={filters.status}
            onChange={handleStatusChange}
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
