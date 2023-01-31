import React from 'react'
import { Segment, Grid } from 'semantic-ui-react'
import { ApplicationListItem } from './ApplicationListItem'

export const MyApplicationsList = ({ applications }) => {
  return (
    <Grid columns={1}>
      {applications.length > 0 ? (
        <>
          {applications.map((application) => {
            return (
              <Grid.Column key={application.address}>
                <Segment>
                  <ApplicationListItem application={application} />
                </Segment>
              </Grid.Column>
            )
          })}
        </>
      ) : (
        <Grid.Column>
          <Segment>
            <p>No applications yet</p>
          </Segment>
        </Grid.Column>
      )}
    </Grid>
  )
}
