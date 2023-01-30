import React from 'react'
import { Grid, Header, Divider } from 'semantic-ui-react'

export const UnauthorizedScreen = () => {
  return (
    <Grid stackable columns={1}>
      <Grid.Column textAlign="center">
        <Header as="h1">
          Please connect wallet to get access to the platform
        </Header>

        <Divider hidden />

        <p>
          We store all data on blockchain, because of this we require connected
          wallet to request all required information.
        </p>
      </Grid.Column>
    </Grid>
  )
}
