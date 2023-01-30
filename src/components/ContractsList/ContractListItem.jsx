import React from 'react'
import Link from 'next/link'
import { Header, Divider, Label, Icon } from 'semantic-ui-react'
import { formatDateTime } from '../../lib/formatDate'

export const ContractListItem = ({ contract, as }) => {
  const createdAt = formatDateTime(contract.createdAt)

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
        <Icon name="user" />
        {as === 'customer'
          ? contract.contractorAddress
          : contract.customerAddress}
      </Label>

      <Label>
        <Icon name="money" /> {contract.value}
      </Label>

      <Label>
        <Icon name="info circle" title="Status" /> {contract.status}
      </Label>

      <Label>
        <Icon name="clock" title="Created" /> {createdAt}
      </Label>
    </>
  )
}
