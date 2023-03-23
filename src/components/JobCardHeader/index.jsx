import Link from 'next/link'
import { Header, Divider, Label, Icon } from 'semantic-ui-react'
import { formatDateTime } from '../../lib/formatDate'
import { FormattedDescription } from '../FormattedDescription'
import useTranslation from 'next-translate/useTranslation'

export const JobCardHeader = ({ job, blockchainViewAddressURL }) => {
  const { t } = useTranslation('common')

  const { budget, applicationsCount, categoryCode } = job
  const createdAt = formatDateTime(job.createdAt, t('date.locale'))

  return (
    <>
      <Header as="h3">
        <Link href={`/customers/${job.customerAddress}`}>
          {job.customerAddress}
        </Link>
      </Header>

      <span>
        {' '}
        <a
          href={`${blockchainViewAddressURL}/${job.customerAddress}`}
          target="_blank"
          rel="noreferrer noopener nofollow"
        >
          <Icon name="address card" /> {t('labels.view_transactions_history')}
        </a>
      </span>

      <Divider />

      <div style={{ wordWrap: 'break-word' }}>
        <FormattedDescription description={job.description} />
      </div>

      <Divider />

      {budget && budget > 0 && (
        <Label>
          <Icon name="money" title={t('jobs:model.budget')} /> {budget}
        </Label>
      )}

      <Label>
        <Icon name="list" title={t('jobs:model.category')} />{' '}
        {t(`jobs:categories.${categoryCode}`)}
      </Label>

      {applicationsCount > 0 && (
        <Label>
          <Icon name="user" title={t('jobs:model.applications_count')} />{' '}
          {applicationsCount}
        </Label>
      )}

      <Label>
        <Icon name="clock" title={t('jobs:model.created_at')} /> {createdAt}
      </Label>
    </>
  )
}
