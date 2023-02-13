import React from 'react'
import Link from 'next/link'
import { Card, List, Image, Divider } from 'semantic-ui-react'
import { formatDateTime } from '../../lib/formatDate'

export const FreelancerCard = ({ freelancer }) => {
  const lastActivityAt = formatDateTime(freelancer.lastActivityAt)

  const displayName = (freelancer.displayName || freelancer.address).replace(
    /(.{17})..+/,
    '$1...'
  )

  return (
    <Card>
      <Card.Content>
        <Image
          src="/default-userpic-64x64.png"
          alt="Avatar"
          size="mini"
          floated="right"
        />

        <Card.Header>
          <Link href={`/freelancers/${freelancer.address}`}>{displayName}</Link>
        </Card.Header>

        <Card.Meta style={{ marginTop: '1em' }}>
          <span className="date">Last activity: {lastActivityAt}</span>
        </Card.Meta>

        {freelancer.about.length > 0 && (
          <Card.Description>{freelancer.about}</Card.Description>
        )}

        {freelancer.skills.length > 0 && (
          <Card.Description>
            <Divider hidden />
            Skill tags:
            {freelancer.skills.split(',').map((skill) => {
              return (
                <Link key={skill} href="#">
                  {' #' + skill.trim()}
                </Link>
              )
            })}
          </Card.Description>
        )}
      </Card.Content>

      <Card.Content extra>
        <List>
          <List.Item>
            Total contracts: {freelancer.totalContractsCount}
          </List.Item>
          <List.Item>
            Succeeded contracts: {freelancer.succeededContractsCount}
          </List.Item>
          <List.Item>
            Failed contracts: {freelancer.failedContractsCount}
          </List.Item>
        </List>
      </Card.Content>
    </Card>
  )
}
