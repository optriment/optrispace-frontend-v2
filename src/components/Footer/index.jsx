import React from 'react'
import { Divider, Container } from 'semantic-ui-react'

export const Footer = ({ contractVersion, frontendNodeAddress }) => {
  return (
    <Container textAlign="center">
      <Divider hidden />
      <p>
        The platform is in testing stage. If you find any issues, errors or
        unexpected behaviour while using our platform, please contact us via{' '}
        <a
          href="https://discord.gg/7WEbtmuqtv"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          Discord
        </a>{' '}
        or{' '}
        <a
          href="https://github.com/optriment/optrispace-frontend-v2/issues/new"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          GitHub
        </a>
        . We would appreciate your help!
      </p>
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
