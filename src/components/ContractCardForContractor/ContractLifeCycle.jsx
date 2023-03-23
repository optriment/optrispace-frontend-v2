import React from 'react'
import { Table } from 'semantic-ui-react'
import { formatDateTime } from '../../lib/formatDate'
import useTranslation from 'next-translate/useTranslation'

const formatTimestamp = (timestamp, locale) => {
  if (timestamp === 0) return ''

  return formatDateTime(timestamp, locale)
}

export const ContractLifeCycle = ({ contract }) => {
  const { t } = useTranslation('common')
  const locale = t('date.locale')

  return (
    <Table basic="very" stackable celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell></Table.HeaderCell>
          <Table.HeaderCell
            content={t(
              'pages.contracts.show.contract_lifecycle.headers.status'
            )}
          />
          <Table.HeaderCell
            content={t(
              'pages.contracts.show.contract_lifecycle.headers.responsible'
            )}
          />
          <Table.HeaderCell
            textAlign="right"
            content={t('pages.contracts.show.contract_lifecycle.headers.time')}
          />
        </Table.Row>
      </Table.Header>

      <Table.Body>
        <Table.Row>
          <Table.Cell>1.</Table.Cell>
          <Table.Cell content={t('contracts:model.statuses.created')} />
          <Table.Cell
            content={t('pages.contracts.show.contract_lifecycle.customer')}
          />
          <Table.Cell textAlign="right">
            {formatTimestamp(contract.createdAt, locale)}
          </Table.Cell>
        </Table.Row>

        {contract.acceptedAt ? (
          <Table.Row>
            <Table.Cell>2.</Table.Cell>
            <Table.Cell content={t('contracts:model.statuses.accepted')} />
            <Table.Cell
              content={t('pages.contracts.show.contract_lifecycle.you')}
            />
            <Table.Cell textAlign="right">
              {formatTimestamp(contract.acceptedAt, locale)}
            </Table.Cell>
          </Table.Row>
        ) : (
          <Table.Row>
            <Table.Cell>2.</Table.Cell>
            <Table.Cell
              content={t('pages.contracts.show.contract_lifecycle.accept')}
            />
            <Table.Cell
              content={t('pages.contracts.show.contract_lifecycle.you')}
            />
            <Table.Cell textAlign="right"></Table.Cell>
          </Table.Row>
        )}

        {contract.fundedAt ? (
          <Table.Row>
            <Table.Cell>3.</Table.Cell>
            <Table.Cell content={t('contracts:model.statuses.funded')} />
            <Table.Cell
              content={t('pages.contracts.show.contract_lifecycle.customer')}
            />
            <Table.Cell textAlign="right">
              {formatTimestamp(contract.fundedAt, locale)}
            </Table.Cell>
          </Table.Row>
        ) : (
          <Table.Row>
            <Table.Cell>3.</Table.Cell>
            <Table.Cell
              content={t('pages.contracts.show.contract_lifecycle.fund')}
            />
            <Table.Cell
              content={t('pages.contracts.show.contract_lifecycle.customer')}
            />
            <Table.Cell textAlign="right"></Table.Cell>
          </Table.Row>
        )}

        {contract.startedAt ? (
          <Table.Row>
            <Table.Cell>4.</Table.Cell>
            <Table.Cell content={t('contracts:model.statuses.started')} />
            <Table.Cell
              content={t('pages.contracts.show.contract_lifecycle.you')}
            />
            <Table.Cell textAlign="right">
              {formatTimestamp(contract.startedAt, locale)}
            </Table.Cell>
          </Table.Row>
        ) : (
          <Table.Row>
            <Table.Cell>4.</Table.Cell>
            <Table.Cell
              content={t('pages.contracts.show.contract_lifecycle.start')}
            />
            <Table.Cell
              content={t('pages.contracts.show.contract_lifecycle.you')}
            />
            <Table.Cell textAlign="right"></Table.Cell>
          </Table.Row>
        )}

        {contract.deliveredAt ? (
          <Table.Row>
            <Table.Cell>5.</Table.Cell>
            <Table.Cell content={t('contracts:model.statuses.delivered')} />
            <Table.Cell
              content={t('pages.contracts.show.contract_lifecycle.you')}
            />
            <Table.Cell textAlign="right">
              {formatTimestamp(contract.deliveredAt, locale)}
            </Table.Cell>
          </Table.Row>
        ) : (
          <Table.Row>
            <Table.Cell>5.</Table.Cell>
            <Table.Cell
              content={t('pages.contracts.show.contract_lifecycle.deliver')}
            />
            <Table.Cell
              content={t('pages.contracts.show.contract_lifecycle.you')}
            />
            <Table.Cell textAlign="right"></Table.Cell>
          </Table.Row>
        )}

        {contract.approvedAt || contract.declinedAt ? (
          <>
            {contract.approvedAt ? (
              <Table.Row>
                <Table.Cell>6.</Table.Cell>
                <Table.Cell content={t('contracts:model.statuses.approved')} />
                <Table.Cell
                  content={t(
                    'pages.contracts.show.contract_lifecycle.customer'
                  )}
                />
                <Table.Cell textAlign="right">
                  {formatTimestamp(contract.approvedAt, locale)}
                </Table.Cell>
              </Table.Row>
            ) : (
              <Table.Row>
                <Table.Cell>6.</Table.Cell>
                <Table.Cell content={t('contracts:model.statuses.declined')} />
                <Table.Cell
                  content={t(
                    'pages.contracts.show.contract_lifecycle.customer'
                  )}
                />
                <Table.Cell textAlign="right">
                  {formatTimestamp(contract.declinedAt, locale)}
                </Table.Cell>
              </Table.Row>
            )}
          </>
        ) : (
          <Table.Row>
            <Table.Cell>6.</Table.Cell>
            <Table.Cell
              content={t(
                'pages.contracts.show.contract_lifecycle.approve_or_decline'
              )}
            />
            <Table.Cell
              content={t('pages.contracts.show.contract_lifecycle.customer')}
            />
            <Table.Cell textAlign="right"></Table.Cell>
          </Table.Row>
        )}

        {contract.withdrewAt ? (
          <Table.Row>
            <Table.Cell>7.</Table.Cell>
            <Table.Cell content={t('contracts:model.statuses.withdrew')} />
            <Table.Cell
              content={t('pages.contracts.show.contract_lifecycle.you')}
            />
            <Table.Cell textAlign="right">
              {formatTimestamp(contract.withdrewAt, locale)}
            </Table.Cell>
          </Table.Row>
        ) : (
          <Table.Row>
            <Table.Cell>7.</Table.Cell>
            <Table.Cell
              content={t('pages.contracts.show.contract_lifecycle.withdraw')}
            />
            <Table.Cell
              content={t('pages.contracts.show.contract_lifecycle.you')}
            />
            <Table.Cell textAlign="right"></Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  )
}
