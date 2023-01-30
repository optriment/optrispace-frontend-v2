import React from 'react'
import { Divider, Container } from 'semantic-ui-react'

export const Footer = ({ contractVersion, frontendNodeAddress }) => {
  return (
    <Container textAlign="center">
      <Divider hidden />
      &copy; 2023 Optriment LLC
      {contractVersion && <>{` | Contract: ${contractVersion}`}</>}
      {frontendNodeAddress && <>{` | Node: ${frontendNodeAddress}`}</>}
    </Container>
  )
}
