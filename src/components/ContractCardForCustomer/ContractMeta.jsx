import React from 'react'
import { Table } from 'semantic-ui-react'
import { formatDateTime, toDaysMinutesSeconds } from '../../lib/formatDate'
import useTranslation from 'next-translate/useTranslation'

const formatTimestamp = (timestamp, locale) => {
  if (timestamp === 0) return ''

  return formatDateTime(timestamp, locale)
}

export const ContractMeta = ({ contract, symbol }) => {
  const { t } = useTranslation('common')
  const locale = t('date.locale')

  return (
    <Table basic="very" stackable celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell
            content={t('pages.contracts.show.contract_meta.headers.key')}
          />
          <Table.HeaderCell
            content={t('pages.contracts.show.contract_meta.headers.value')}
            textAlign="right"
          />
        </Table.Row>
      </Table.Header>

      <Table.Body>
        <Table.Row>
          <Table.Cell
            content={t('pages.contracts.show.contract_meta.current_status')}
          />
          <Table.Cell textAlign="right">
            {t(`contracts:model.statuses.${contract.status}`)}
          </Table.Cell>
        </Table.Row>

        <Table.Row>
          <Table.Cell
            content={t('pages.contracts.show.contract_meta.contract_value')}
          />
          <Table.Cell textAlign="right">
            {contract.value} {symbol}
          </Table.Cell>
        </Table.Row>

        <Table.Row>
          <Table.Cell
            content={t('pages.contracts.show.contract_meta.contract_balance')}
          />
          <Table.Cell textAlign="right">
            {contract.balance} {symbol}
          </Table.Cell>
        </Table.Row>

        <Table.Row>
          <Table.Cell
            content={t('pages.contracts.show.contract_meta.days_to_start_work')}
          />
          <Table.Cell textAlign="right">{contract.daysToStartWork}</Table.Cell>
        </Table.Row>

        <Table.Row>
          <Table.Cell
            content={t(
              'pages.contracts.show.contract_meta.days_to_deliver_result'
            )}
          />
          <Table.Cell textAlign="right">{contract.durationInDays}</Table.Cell>
        </Table.Row>

        <Table.Row>
          <Table.Cell
            content={t(
              'pages.contracts.show.contract_meta.work_should_be_started_before'
            )}
          />
          <Table.Cell textAlign="right">
            {contract.workShouldBeStartedBefore
              ? formatTimestamp(contract.workShouldBeStartedBefore, locale)
              : t('labels.not_available')}
          </Table.Cell>
        </Table.Row>

        <Table.Row>
          <Table.Cell
            content={t(
              'pages.contracts.show.contract_meta.result_should_be_delivered_before'
            )}
          />
          <Table.Cell textAlign="right">
            {contract.resultShouldBeDeliveredBefore
              ? formatTimestamp(contract.resultShouldBeDeliveredBefore, locale)
              : t('labels.not_available')}
          </Table.Cell>
        </Table.Row>

        <Table.Row>
          <Table.Cell
            content={t(
              'pages.contracts.show.contract_meta.remaining_time_to_start_work'
            )}
          />
          <Table.Cell textAlign="right">
            {contract.status === 'started' ||
            contract.status === 'delivered' ? (
              <p>
                {t('pages.contracts.show.contract_meta.work_started_on_time')}
              </p>
            ) : (
              <>
                {contract.remainingTimeToStartWork > 0 &&
                  toDaysMinutesSeconds(contract.remainingTimeToStartWork)}
              </>
            )}
          </Table.Cell>
        </Table.Row>

        <Table.Row>
          <Table.Cell
            content={t(
              'pages.contracts.show.contract_meta.remaining_time_to_deliver_result'
            )}
          />
          <Table.Cell textAlign="right">
            {contract.status === 'delivered' ? (
              <p>
                {t(
                  'pages.contracts.show.contract_meta.result_delivered_on_time'
                )}
              </p>
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
