import React from 'react'
import Link from 'next/link'
import { Header, Divider, Label, Icon } from 'semantic-ui-react'
import { formatDateTime } from '../../lib/formatDate'

export const ApplicationListItem = ({ application }) => {
  const {
    jobBudget,
    applicationServiceFee,
    jobCategoryLabel,
    hasContract,
    contractAddress,
  } = application
  const applicationCreatedAt = formatDateTime(application.applicationCreatedAt)

  return (
    <>
      <Header as="h3" style={{ wordWrap: 'break-word' }}>
        <Link href={`/jobs/${application.jobAddress}`}>
          {application.jobTitle}
        </Link>
      </Header>

      <Header as="h4">Job Description Preview:</Header>

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

      <Header as="h4">Comment:</Header>

      <div style={{ wordWrap: 'break-word' }}>
        {application.applicationComment.trim()}
      </div>

      <Divider />

      {jobBudget && jobBudget > 0 && (
        <Label>
          <Icon name="money bill alternate" title="Job budget" /> {jobBudget}
        </Label>
      )}

      <Label>
        <Icon name="money bill alternate outline" title="Service rate" />
        {' ' + applicationServiceFee}
      </Label>

      <Label>
        <Icon name="list" /> {jobCategoryLabel}
      </Label>

      <Label>
        <Icon name="clock" title="Application created at" />
        {' ' + applicationCreatedAt}
      </Label>

      {hasContract && (
        <Label as="a" href={`/contracts/${contractAddress}`} color="green">
          <Icon name="browser" title="Has contract" /> Open contract
        </Label>
      )}
    </>
  )
}
