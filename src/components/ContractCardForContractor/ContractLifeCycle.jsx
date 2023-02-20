import React from 'react'
import { Table } from 'semantic-ui-react'
import { formatDateTime } from '../../lib/formatDate'

const formatTimestamp = (timestamp) => {
  if (timestamp === 0) return ''

  return formatDateTime(timestamp)
}

export const ContractLifeCycle = ({ contract }) => {
  return (
    <Table basic="very" stackable celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell></Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
          <Table.HeaderCell>Responsible</Table.HeaderCell>
          <Table.HeaderCell textAlign="right">Time</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        <Table.Row>
          <Table.Cell>1.</Table.Cell>
          <Table.Cell>Created</Table.Cell>
          <Table.Cell>Customer</Table.Cell>
          <Table.Cell textAlign="right">
            {formatTimestamp(contract.createdAt)}
          </Table.Cell>
        </Table.Row>

        {contract.acceptedAt ? (
          <Table.Row>
            <Table.Cell>2.</Table.Cell>
            <Table.Cell>Accepted</Table.Cell>
            <Table.Cell>You</Table.Cell>
            <Table.Cell textAlign="right">
              {formatTimestamp(contract.acceptedAt)}
            </Table.Cell>
          </Table.Row>
        ) : (
          <Table.Row>
            <Table.Cell>2.</Table.Cell>
            <Table.Cell>Accept</Table.Cell>
            <Table.Cell>You</Table.Cell>
            <Table.Cell textAlign="right"></Table.Cell>
          </Table.Row>
        )}

        {contract.fundedAt ? (
          <Table.Row>
            <Table.Cell>3.</Table.Cell>
            <Table.Cell>Funded</Table.Cell>
            <Table.Cell>Customer</Table.Cell>
            <Table.Cell textAlign="right">
              {formatTimestamp(contract.fundedAt)}
            </Table.Cell>
          </Table.Row>
        ) : (
          <Table.Row>
            <Table.Cell>3.</Table.Cell>
            <Table.Cell>Fund</Table.Cell>
            <Table.Cell>Customer</Table.Cell>
            <Table.Cell textAlign="right"></Table.Cell>
          </Table.Row>
        )}

        {contract.startedAt ? (
          <Table.Row>
            <Table.Cell>4.</Table.Cell>
            <Table.Cell>Work Started</Table.Cell>
            <Table.Cell>You</Table.Cell>
            <Table.Cell textAlign="right">
              {formatTimestamp(contract.startedAt)}
            </Table.Cell>
          </Table.Row>
        ) : (
          <Table.Row>
            <Table.Cell>4.</Table.Cell>
            <Table.Cell>Start Work</Table.Cell>
            <Table.Cell>You</Table.Cell>
            <Table.Cell textAlign="right"></Table.Cell>
          </Table.Row>
        )}

        {contract.deliveredAt ? (
          <Table.Row>
            <Table.Cell>5.</Table.Cell>
            <Table.Cell>Result Delivered</Table.Cell>
            <Table.Cell>You</Table.Cell>
            <Table.Cell textAlign="right">
              {formatTimestamp(contract.deliveredAt)}
            </Table.Cell>
          </Table.Row>
        ) : (
          <Table.Row>
            <Table.Cell>5.</Table.Cell>
            <Table.Cell>Deliver Result</Table.Cell>
            <Table.Cell>You</Table.Cell>
            <Table.Cell textAlign="right"></Table.Cell>
          </Table.Row>
        )}

        {contract.approvedAt || contract.declinedAt ? (
          <>
            {contract.approvedAt ? (
              <Table.Row>
                <Table.Cell>6.</Table.Cell>
                <Table.Cell>Approved</Table.Cell>
                <Table.Cell>Customer</Table.Cell>
                <Table.Cell textAlign="right">
                  {formatTimestamp(contract.approvedAt)}
                </Table.Cell>
              </Table.Row>
            ) : (
              <Table.Row>
                <Table.Cell>6.</Table.Cell>
                <Table.Cell>Declined</Table.Cell>
                <Table.Cell>Customer</Table.Cell>
                <Table.Cell textAlign="right">
                  {formatTimestamp(contract.declinedAt)}
                </Table.Cell>
              </Table.Row>
            )}
          </>
        ) : (
          <Table.Row>
            <Table.Cell>6.</Table.Cell>
            <Table.Cell>Approve or Decline</Table.Cell>
            <Table.Cell>Customer</Table.Cell>
            <Table.Cell textAlign="right"></Table.Cell>
          </Table.Row>
        )}

        {contract.withdrewAt ? (
          <Table.Row>
            <Table.Cell>7.</Table.Cell>
            <Table.Cell>Withdrew</Table.Cell>
            <Table.Cell>You</Table.Cell>
            <Table.Cell textAlign="right">
              {formatTimestamp(contract.withdrewAt)}
            </Table.Cell>
          </Table.Row>
        ) : (
          <Table.Row>
            <Table.Cell>7.</Table.Cell>
            <Table.Cell>Withdraw</Table.Cell>
            <Table.Cell>You</Table.Cell>
            <Table.Cell textAlign="right"></Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  )
}
