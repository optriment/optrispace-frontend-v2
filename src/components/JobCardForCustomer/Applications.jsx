import React from 'react'
import { Grid, Segment } from 'semantic-ui-react'
import ApplicationListItem from './ApplicationListItem'

const Applications = ({ applications, blockchainViewAddressURL }) => {
  return (
    <Grid stackable columns={1}>
      {applications.map((application) => {
        return (
          <Grid.Column key={application.address}>
            <Segment color={application.hasContract ? 'green' : null}>
              <ApplicationListItem
                key={application.address}
                application={application}
                blockchainViewAddressURL={blockchainViewAddressURL}
              />
            </Segment>
          </Grid.Column>
        )
      })}
    </Grid>
  )
}

export default Applications
