import React from 'react'
import Link from 'next/link'
import { Header, Divider, Label, Icon } from 'semantic-ui-react'
import { formatDateTime } from '../../lib/formatDate'
import useTranslation from 'next-translate/useTranslation'

export const ContractListItem = ({ contract, as }) => {
  const { t } = useTranslation('contracts')
  const createdAt = formatDateTime(contract.createdAt, t('common:date.locale'))

  return (
    <>
      <Header as="h3" style={{ wordWrap: 'break-word' }}>
        <Link href={`/contracts/${contract.address}`}>{contract.title}</Link>
      </Header>

      <div style={{ wordWrap: 'break-word' }}>
        {contract.description
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
        <Icon
          name="user"
          title={
            as === 'customer'
              ? t('model.contractor_address')
              : t('model.customer_address')
          }
        />
        {as === 'customer'
          ? contract.contractorAddress
          : contract.customerAddress}
      </Label>

      <Label>
        <Icon name="money" title={t('model.value')} /> {contract.value}
      </Label>

      <Label>
        <Icon name="info circle" title={t('model.status')} />{' '}
        {t(`model.statuses.${contract.status}`)}
      </Label>

      <Label>
        <Icon name="clock" title={t('model.created_at')} /> {createdAt}
      </Label>
    </>
  )
}
