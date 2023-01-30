import React from 'react'
import { Header, Icon, Label, Divider } from 'semantic-ui-react'
import Link from 'next/link'
import { formatDateTime } from '../lib/formatDate'

export default function ApplicationListItem({ application, coinSymbol }) {
  const createdAt = formatDateTime(application.created_at)

  return (
    <>
      <Header as="h3">
        <Link href={`/jobs/${application.job_id}`}>
          {application.job_title}
        </Link>
      </Header>

      <div style={{ wordWrap: 'break-word' }}>
        {application.job_description
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

      <Label>
        <Icon name="money" /> {application.price} {coinSymbol}
      </Label>

      <Label>
        <Icon name="clock" title="Created" /> {createdAt}
      </Label>
    </>
  )
}
