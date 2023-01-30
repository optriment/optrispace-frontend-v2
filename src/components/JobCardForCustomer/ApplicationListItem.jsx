import React from 'react'
import { Button, Label, Divider, Header, Icon } from 'semantic-ui-react'
import { FormattedDescription } from '../FormattedDescription'
import { formatDateTime } from '../../lib/formatDate'

export default function ApplicationListItem({
  application,
  blockchainViewAddressURL,
}) {
  const createdAt = formatDateTime(application.createdAt)

  return (
    <>
      <Header as="h4">{application.applicantAddress}</Header>

      <span>
        {' '}
        <a
          href={`${blockchainViewAddressURL}/${application.applicantAddress}`}
          target="_blank"
          rel="noreferrer noopener nofollow"
          title="Open wallet information"
        >
          <Icon name="address card" /> View transactions history
        </a>
      </span>

      <Divider />

      <div style={{ wordWrap: 'break-word' }}>
        <FormattedDescription description={application.comment} />
      </div>

      <Divider />

      <Label>
        <Icon name="money" /> {application.serviceFee}
      </Label>

      <Label>
        <Icon name="clock" title="Created" /> {createdAt}
      </Label>

      <Divider />

      {application.hasContract ? (
        <Button
          size="tiny"
          positive
          href={`/contracts/${application.contractAddress}`}
          content="Open contract"
        />
      ) : (
        <Button
          size="tiny"
          primary
          href={`/jobs/${application.jobAddress}/contracts/new?application_address=${application.address}`}
          content="Create Contract"
        />
      )}
    </>
  )
}
