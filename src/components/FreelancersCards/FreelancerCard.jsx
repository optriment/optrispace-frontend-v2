import React from 'react'
import Link from 'next/link'
import { Card, List, Image, Divider } from 'semantic-ui-react'
import { formatDateTime } from '../../lib/formatDate'
import useTranslation from 'next-translate/useTranslation'

export const FreelancerCard = ({ freelancer }) => {
  const { t } = useTranslation('common')

  const lastActivityAt = formatDateTime(
    freelancer.lastActivityAt,
    t('date.locale')
  )

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
          <span className="date">
            {t('pages.freelancers.index.last_activity', {
              date: lastActivityAt,
            })}
          </span>
        </Card.Meta>

        {freelancer.about.length > 0 && (
          <Card.Description>{freelancer.about}</Card.Description>
        )}

        {freelancer.skills.length > 0 && (
          <Card.Description>
            <Divider hidden />
            {t('pages.freelancers.index.skill_tags')}

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
          <List.Item
            content={t('pages.freelancers.index.total_contracts', {
              count: freelancer.totalContractsCount,
            })}
          />
          <List.Item
            content={t('pages.freelancers.index.succeeded_contracts', {
              count: freelancer.succeededContractsCount,
            })}
          />
          <List.Item
            content={t('pages.freelancers.index.failed_contracts', {
              count: freelancer.failedContractsCount,
            })}
          />
        </List>
      </Card.Content>
    </Card>
  )
}
