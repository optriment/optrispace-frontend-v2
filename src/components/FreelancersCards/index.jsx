import React from 'react'
import { Segment, Card } from 'semantic-ui-react'
import { FreelancerCard } from './FreelancerCard'

export const FreelancersCards = ({ freelancers }) => {
  if (freelancers.length === 0) {
    return (
      <Segment>
        <p>No freelancers yet</p>
      </Segment>
    )
  }

  return (
    <Card.Group>
      {freelancers.map((freelancer) => {
        return (
          <FreelancerCard key={freelancer.address} freelancer={freelancer} />
        )
      })}
    </Card.Group>
  )
}
