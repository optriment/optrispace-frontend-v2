import React from 'react'
import Link from 'next/link'
import { Header, Divider, Label, Icon } from 'semantic-ui-react'
import { formatDateTime } from '../../lib/formatDate'
import useTranslation from 'next-translate/useTranslation'
import { ROUTES } from '../../lib/routes'

export const ApplicationListItem = ({ application }) => {
  const {
    jobBudget,
    applicationServiceFee,
    jobCategoryCode,
    hasContract,
    contractAddress,
  } = application
  const { t } = useTranslation('common')

  const applicationCreatedAt = formatDateTime(
    application.applicationCreatedAt,
    t('date.locale')
  )

  return (
    <>
      <Header as="h3" style={{ wordWrap: 'break-word' }}>
        <Link href={ROUTES.JOBS_LIST + application.jobAddress}>
          {application.jobTitle}
        </Link>
      </Header>

      <Header
        as="h4"
        content={t(
          'pages.freelancer.applications.index.job_description_preview'
        )}
      />

      <div style={{ wordWrap: 'break-word' }}>
        {application.jobDescription
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

      <Header
        as="h4"
        content={t('pages.freelancer.applications.index.comment')}
      />

      <div style={{ wordWrap: 'break-word' }}>
        {application.applicationComment.trim()}
      </div>

      <Divider />

      {jobBudget && jobBudget > 0 && (
        <Label>
          <Icon
            name="money bill alternate"
            title={t('applications:model.job_budget')}
          />{' '}
          {jobBudget}
        </Label>
      )}

      <Label>
        <Icon
          name="money bill alternate outline"
          title={t('applications:model.service_rate')}
        />{' '}
        {applicationServiceFee}
      </Label>

      <Label>
        <Icon name="list" title={t('applications:model.job_category')} />{' '}
        {t(`jobs:categories.${jobCategoryCode}`)}
      </Label>

      <Label>
        <Icon name="clock" title={t('applications:model.created_at')} />{' '}
        {applicationCreatedAt}
      </Label>

      {hasContract && (
        <Label as="a" href={`/contracts/${contractAddress}`} color="green">
          <Icon
            name="browser"
            title={t('pages.freelancer.applications.index.has_contract')}
          />{' '}
          {t('pages.freelancer.applications.index.open_contract')}
        </Label>
      )}
    </>
  )
}
