import React from 'react'
import Link from 'next/link'
import { Header, Divider, Label, Icon } from 'semantic-ui-react'
import { formatDateTime } from '../../lib/formatDate'

export const JobListItem = ({ job }) => {
  const { budget, applicationsCount, categoryLabel } = job
  const createdAt = formatDateTime(job.createdAt)

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
          <Icon name="money" /> {budget}
        </Label>
      )}

      <Label>
        <Icon name="user" title="Applications" /> {applicationsCount}
      </Label>

      <Label>
        <Icon name="list" /> {categoryLabel}
      </Label>

      <Label>
        <Icon name="clock" title="Created" /> {createdAt}
      </Label>
    </>
  )
}
