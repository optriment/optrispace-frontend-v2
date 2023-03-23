import React from 'react'
import Head from 'next/head'
import getConfig from 'next/config'
import { Segment, Divider, Grid } from 'semantic-ui-react'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { Favicon } from '../../components/Favicon'
import { LanguageSwitcher } from '../../components/LanguageSwitcher'

const { publicRuntimeConfig } = getConfig()
const { frontendNodeAddress, discordLink, gitHubLink } = publicRuntimeConfig

import 'semantic-ui-css/semantic.min.css'

export const UsersLayout = ({
  children,
  isConnected,
  isReconnecting,
  connect,
  disconnect,
  accountBalance,
  contractVersion,
  currentAccount,
  meta = {},
}) => {
  const { title } = meta

  const productTitle = 'OptriSpace'
  const pageTitle = title ? `${title} | ${productTitle}` : productTitle

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <Favicon />
      </Head>

      <Grid container columns={1}>
        <Grid.Column>
          <Header
            isConnected={isConnected}
            isReconnecting={isReconnecting}
            connect={connect}
            disconnect={disconnect}
            accountBalance={accountBalance}
            currentAccount={currentAccount}
          />

          <Divider />
        </Grid.Column>

        <Grid.Column>
          <Segment textAlign="center">
            <p>
              <b>Hey guys! Feel free to use this language switcher</b>
            </p>
            <p>
              This section will be removed from header to footer when we
              translate our application to Spanish and Portuguese.
            </p>
            <LanguageSwitcher />
          </Segment>
        </Grid.Column>

        <Grid.Column>{children}</Grid.Column>

        <Grid.Column>
          <Footer
            contractVersion={contractVersion}
            frontendNodeAddress={frontendNodeAddress}
            discordLink={discordLink}
            gitHubLink={gitHubLink}
          />
        </Grid.Column>
      </Grid>
    </>
  )
}
