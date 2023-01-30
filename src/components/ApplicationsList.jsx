import React from 'react'
import { Segment, Grid } from 'semantic-ui-react'
import ApplicationListItem from './ApplicationListItem'

export default function ApplicationsList({ applications, person, coinSymbol }) {
  return (
    <Grid columns={1}>
      {applications.map((application) => {
        return (
          <Grid.Column key={application.id}>
            <Segment>
              <ApplicationListItem
                key={application.id}
                application={application}
                person={person}
                coinSymbol={coinSymbol}
              />
            </Segment>
          </Grid.Column>
        )
      })}
    </Grid>
  )
}
