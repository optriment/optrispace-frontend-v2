import React from 'react'
import { Grid, Header, Divider } from 'semantic-ui-react'
import useTranslation from 'next-translate/useTranslation'

export const UnauthorizedScreen = () => {
  const { t } = useTranslation('common')

  return (
    <Grid stackable columns={1}>
      <Grid.Column textAlign="center">
        <Header as="h1" content={t('pages.unauthorized.header.title')} />

        <Divider hidden />

        <p>{t('pages.unauthorized.line1')}</p>
      </Grid.Column>
    </Grid>
  )
}
