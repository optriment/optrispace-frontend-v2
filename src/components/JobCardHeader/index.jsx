import { Header, Divider, Label, Icon } from 'semantic-ui-react'
import { formatDateTime } from '../../lib/formatDate'
import { FormattedDescription } from '../FormattedDescription'

export const JobCardHeader = ({ job, blockchainViewAddressURL }) => {
  const { budget, applicationsCount, categoryLabel } = job
  const createdAt = formatDateTime(job.createdAt)

  return (
    <>
      <Header as="h3">{job.customerAddress}</Header>

      <span>
        {' '}
        <a
          href={`${blockchainViewAddressURL}/${job.address}`}
          target="_blank"
          rel="noreferrer noopener nofollow"
          title="Open wallet information"
        >
          <Icon name="address card" /> View transactions history
        </a>
      </span>

      <Divider />

      <div style={{ wordWrap: 'break-word' }}>
        <FormattedDescription description={job.description} />
      </div>

      <Divider />

      {budget && budget > 0 && (
        <Label>
          <Icon name="money" /> {budget}
        </Label>
      )}

      <Label>
        <Icon name="list" /> {categoryLabel}
      </Label>

      {applicationsCount > 0 && (
        <Label>
          <Icon name="user" title="Applicants" /> {applicationsCount}
        </Label>
      )}

      <Label>
        <Icon name="clock" title="Created" /> {createdAt}
      </Label>
    </>
  )
}
