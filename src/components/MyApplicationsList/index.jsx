import React from 'react'
import { Segment, Grid } from 'semantic-ui-react'
import { ApplicationListItem } from './ApplicationListItem'

export const MyApplicationsList = ({ applications }) => {
  return (
    <Grid columns={1}>
      {applications.map((application) => {
        return (
          <Grid.Column key={application.address}>
            <Segment>
              <ApplicationListItem application={application} />
            </Segment>
          </Grid.Column>
        )
      })}
    </Grid>
  )
}
