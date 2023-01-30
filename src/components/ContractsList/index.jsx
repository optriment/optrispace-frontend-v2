import React from 'react'
import { Grid, Segment } from 'semantic-ui-react'
import { ContractListItem } from './ContractListItem'

export const ContractsList = ({ contracts, as }) => {
  return (
    <Grid columns={1}>
      {contracts.length > 0 ? (
        <>
          {contracts.map((contract) => {
            return (
              <Grid.Column key={contract.address}>
                <Segment>
                  <ContractListItem contract={contract} as={as} />
                </Segment>
              </Grid.Column>
            )
          })}
        </>
      ) : (
        <Grid.Column>
          <Segment>
            <p>No contracts yet</p>
          </Segment>
        </Grid.Column>
      )}
    </Grid>
  )
}
