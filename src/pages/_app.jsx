import React from 'react'
import { WagmiConfig } from 'wagmi'
import { client } from '../lib/wagmi'

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={client}>
      <Component {...pageProps} />
    </WagmiConfig>
  )
}

export default MyApp
