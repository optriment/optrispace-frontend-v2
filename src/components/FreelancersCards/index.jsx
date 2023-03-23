import React from 'react'
import { Card } from 'semantic-ui-react'
import { FreelancerCard } from './FreelancerCard'

export const FreelancersCards = ({ freelancers }) => {
  return (
    <Card.Group itemsPerRow={3}>
      {freelancers.map((freelancer) => {
        return (
          <FreelancerCard key={freelancer.address} freelancer={freelancer} />
        )
      })}
    </Card.Group>
  )
}
