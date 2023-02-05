import React from 'react'
import { Divider, Container } from 'semantic-ui-react'

export const Footer = ({ contractVersion, frontendNodeAddress }) => {
  return (
    <Container textAlign="center">
      <Divider hidden />
      &copy; 2023 OPTRIMENT LLC
      {contractVersion && (
        <>
          {' | Version: '}
          <a
            href={`https://github.com/optriment/optrispace-contract-v2/tree/master/releases/history/${contractVersion}/README.md`}
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            {contractVersion}
          </a>
        </>
      )}
      {frontendNodeAddress && <>{` | Node: ${frontendNodeAddress}`}</>}
    </Container>
  )
}
