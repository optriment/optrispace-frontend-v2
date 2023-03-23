import React from 'react'
import Link from 'next/link'
import { Header, Divider, Label, Icon } from 'semantic-ui-react'
import { formatDateTime } from '../../lib/formatDate'
import useTranslation from 'next-translate/useTranslation'

export const JobListItem = ({ job }) => {
  const { t } = useTranslation('jobs')
  const { budget, applicationsCount, categoryCode } = job
  const createdAt = formatDateTime(job.createdAt, t('common:date.locale'))

  return (
    <>
      <Header as="h3" style={{ wordWrap: 'break-word' }}>
        <Link href={`/jobs/${job.address}`}>{job.title}</Link>
      </Header>

      <div style={{ wordWrap: 'break-word' }}>
        {job.description
          .trim()
          .split('\n')
          .map((str, idx) => {
            if (idx < 5) {
              return (
                <div key={idx}>
                  {str}

                  <br />
                </div>
              )
            }
          })}
      </div>

      <Divider />

      {budget && budget > 0 && (
        <Label>
          <Icon name="money" title={t('model.budget')} /> {budget}
        </Label>
      )}

      <Label>
        <Icon name="user" title={t('model.applications_count')} />
        {' ' + applicationsCount}
      </Label>

      <Label>
        <Icon name="list" title={t('model.category')} />
        {' ' + t(`categories.${categoryCode}`)}
      </Label>

      <Label>
        <Icon name="clock" title={t('model.created_at')} /> {createdAt}
      </Label>
    </>
  )
}
