import React from 'react'
import Head from 'next/head'
import getConfig from 'next/config'
import { Divider, Grid } from 'semantic-ui-react'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { Favicon } from '../../components/Favicon'

const { publicRuntimeConfig } = getConfig() || {}
const { domain, frontendNodeAddress } = publicRuntimeConfig || {}

import 'semantic-ui-css/semantic.min.css'

export const LandingLayout = ({
  children,
  isConnected,
  connect,
  meta = {},
}) => {
  const { title, description } = meta

  const productTitle = 'OptriSpace'
  const pageTitle = title ? `${title} | ${productTitle}` : productTitle

  const defaultDescription =
    'OptriSpace brings together digital and IT experts, founders, freelancers, stakeholders and enthusiasts ' +
    'and provides a decentralized platform for collaboration and services exchange'

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={description || defaultDescription} />

        <meta property="og:title" content={title} />
        <meta
          property="og:description"
          content={description || defaultDescription}
        />
        <meta property="og:url" content={`https://${domain}`} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@optrispace" />
        <meta property="twitter:domain" content={domain} />
        <meta property="twitter:url" content={`https://${domain}`} />
        <meta name="twitter:title" content={title} />
        <meta
          name="twitter:description"
          content={description || defaultDescription}
        />

        <Favicon />
      </Head>

      <Grid container columns={1}>
        <Grid.Column>
          <Header isConnected={isConnected} connect={connect} />

          <Divider />
        </Grid.Column>

        <Grid.Column>{children}</Grid.Column>

        <Grid.Column>
          <Footer frontendNodeAddress={frontendNodeAddress} />
        </Grid.Column>
      </Grid>
    </>
  )
}
