import React from 'react'
import { Table } from 'semantic-ui-react'
import { formatDateTime, toDaysMinutesSeconds } from '../../lib/formatDate'

const formatTimestamp = (timestamp) => {
  if (timestamp === 0) return ''

  return formatDateTime(timestamp)
}

export const ContractMeta = ({ contract, symbol }) => {
  return (
    <Table basic="very" stackable celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Key</Table.HeaderCell>
          <Table.HeaderCell textAlign="right">Value</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        <Table.Row>
          <Table.Cell>Current Status</Table.Cell>
          <Table.Cell textAlign="right">{contract.status}</Table.Cell>
        </Table.Row>

        <Table.Row>
          <Table.Cell>Contract Value</Table.Cell>
          <Table.Cell textAlign="right">
            {contract.value} {symbol}
          </Table.Cell>
        </Table.Row>

        <Table.Row>
          <Table.Cell>Contract Balance</Table.Cell>
          <Table.Cell textAlign="right">
            {contract.balance} {symbol}
          </Table.Cell>
        </Table.Row>

        <Table.Row>
          <Table.Cell>Days to Start Work (after funding)</Table.Cell>
          <Table.Cell textAlign="right">{contract.daysToStartWork}</Table.Cell>
        </Table.Row>

        <Table.Row>
          <Table.Cell>Days to Deliver Result (after funding)</Table.Cell>
          <Table.Cell textAlign="right">{contract.durationInDays}</Table.Cell>
        </Table.Row>

        <Table.Row>
          <Table.Cell>Work Should be Started Before</Table.Cell>
          <Table.Cell textAlign="right">
            {contract.workShouldBeStartedBefore
              ? formatTimestamp(contract.workShouldBeStartedBefore)
              : 'N/A'}
          </Table.Cell>
        </Table.Row>

        <Table.Row>
          <Table.Cell>Result Should be Delivered Before</Table.Cell>
          <Table.Cell textAlign="right">
            {contract.resultShouldBeDeliveredBefore
              ? formatTimestamp(contract.resultShouldBeDeliveredBefore)
              : 'N/A'}
          </Table.Cell>
        </Table.Row>

        <Table.Row>
          <Table.Cell>Remaining Time to Start Work</Table.Cell>
          <Table.Cell textAlign="right">
            {contract.status === 'started' ||
            contract.status === 'delivered' ? (
              <p>Work started on time!</p>
            ) : (
              <>
                {contract.remainingTimeToStartWork > 0 &&
                  toDaysMinutesSeconds(contract.remainingTimeToStartWork)}
              </>
            )}
          </Table.Cell>
        </Table.Row>

        <Table.Row>
          <Table.Cell>Remaining Time to Deliver Result</Table.Cell>
          <Table.Cell textAlign="right">
            {contract.status === 'delivered' ? (
              <p>Result delivered on time!</p>
            ) : (
              <>
                {contract.remainingTimeToDeliverResult > 0 &&
                  toDaysMinutesSeconds(contract.remainingTimeToDeliverResult)}
              </>
            )}
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  )
}
