import React from 'react'
import { Segment, Grid } from 'semantic-ui-react'
import { JobListItem } from './JobListItem'

export const JobsList = ({ jobs }) => {
  return (
    <Grid columns={1}>
      {jobs.map((job) => {
        return (
          <Grid.Column key={job.address}>
            <Segment>
              <JobListItem job={job} />
            </Segment>
          </Grid.Column>
        )
      })}
    </Grid>
  )
}
