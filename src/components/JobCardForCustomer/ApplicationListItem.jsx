import React from 'react'
import Link from 'next/link'
import { Button, Label, Divider, Header, Icon } from 'semantic-ui-react'
import { FormattedDescription } from '../FormattedDescription'
import { formatDateTime } from '../../lib/formatDate'
import useTranslation from 'next-translate/useTranslation'

export default function ApplicationListItem({
  application,
  blockchainViewAddressURL,
}) {
  const { t } = useTranslation('common')

  const createdAt = formatDateTime(application.createdAt, t('date.locale'))

  return (
    <>
      <Header as="h4">
        <Link href={`/freelancers/${application.applicantAddress}`}>
          {application.applicantAddress}
        </Link>
      </Header>

      <span>
        {' '}
        <a
          href={`${blockchainViewAddressURL}/${application.applicantAddress}`}
          target="_blank"
          rel="noreferrer noopener nofollow"
        >
          <Icon name="address card" /> {t('labels.view_transactions_history')}
        </a>
      </span>

      <Divider />

      <div style={{ wordWrap: 'break-word' }}>
        <FormattedDescription description={application.comment} />
      </div>

      <Divider />

      <Label>
        <Icon name="money" title={t('applications:model.service_rate')} />{' '}
        {application.serviceFee}
      </Label>

      <Label>
        <Icon name="clock" title={t('applications:model.created_at')} />{' '}
        {createdAt}
      </Label>

      <Divider />

      {application.hasContract ? (
        <Button
          size="tiny"
          positive
          href={`/contracts/${application.contractAddress}`}
          content={t('pages.jobs.show.applications.buttons.open_contract')}
        />
      ) : (
        <Button
          size="tiny"
          primary
          href={`/jobs/${application.jobAddress}/contracts/new?application_address=${application.address}`}
          content={t('pages.jobs.show.applications.buttons.create_contract')}
        />
      )}
    </>
  )
}
