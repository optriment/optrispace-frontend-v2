import React from 'react'
import { Divider, Container } from 'semantic-ui-react'
import useTranslation from 'next-translate/useTranslation'
import Trans from 'next-translate/Trans'
import { LanguageSwitcher } from '../LanguageSwitcher'

export const Footer = ({
  contractVersion,
  frontendNodeAddress,
  discordLink,
  gitHubLink,
}) => {
  const { t } = useTranslation('common')

  return (
    <Container textAlign="center">
      <Divider hidden />

      <Trans
        i18nKey="common:footer.platform_is_in_testing_stage"
        components={[
          <p key={0} />,
          <a
            key={1}
            href={discordLink}
            target="_blank"
            rel="nofollow noopener noreferrer"
          />,
          <a
            key={2}
            href={`${gitHubLink}/optrispace-frontend-v2/issues/new`}
            target="_blank"
            rel="nofollow noopener noreferrer"
          />,
        ]}
      />

      <p>
        &copy; 2023 OPTRIMENT LLC
        {contractVersion && (
          <>
            {` | ${t('footer.version')}: `}
            <a
              href={`${gitHubLink}/optrispace-contract-v2/tree/master/releases/history/${contractVersion}/README.md`}
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              {contractVersion}
            </a>
          </>
        )}
        {frontendNodeAddress && (
          <>{` | ${t('footer.node')}: ${frontendNodeAddress}`}</>
        )}
      </p>

      <LanguageSwitcher />
    </Container>
  )
}
