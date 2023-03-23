import React from 'react'
import getConfig from 'next/config'
import { Image, Container, Divider, Header, List } from 'semantic-ui-react'
import useTranslation from 'next-translate/useTranslation'

const { publicRuntimeConfig } = getConfig()
const { gitHubLink } = publicRuntimeConfig

export const LandingScreen = () => {
  const { t } = useTranslation('common')

  return (
    <>
      <Container textAlign="center">
        <Image
          src="/optrispace-logo-with-slogan.png"
          alt="OptriSpace"
          bordered
          rounded
          centered
        />
      </Container>

      <Divider hidden />
      <Divider />
      <Divider hidden />

      <Container text textAlign="justified">
        <Header
          as="h2"
          content={t('pages.landing.what_is_optrispace.header.title')}
        />

        <p>{t('pages.landing.what_is_optrispace.line1')}</p>

        <p>{t('pages.landing.what_is_optrispace.line2')}</p>

        <Header
          as="h2"
          content={t('pages.landing.how_optrispace_works.header.title')}
        />

        <Header
          as="h3"
          content={t('pages.landing.how_optrispace_works.section1.header')}
        />

        <p>{t('pages.landing.how_optrispace_works.section1.line1')}</p>

        <Header
          as="h3"
          content={t('pages.landing.how_optrispace_works.section2.header')}
        />

        <p>
          {t('pages.landing.how_optrispace_works.section2.line1')}
          <br />
          {t('pages.landing.how_optrispace_works.section2.line2')}
        </p>

        <Header
          as="h3"
          content={t('pages.landing.how_optrispace_works.section3.header')}
        />

        <p>{t('pages.landing.how_optrispace_works.section3.line1')}</p>

        <Header
          as="h3"
          content={t('pages.landing.how_optrispace_works.section4.header')}
        />

        <p>{t('pages.landing.how_optrispace_works.section4.line1')}</p>

        <Header
          as="h3"
          content={t('pages.landing.how_optrispace_works.section5.header')}
        />

        <p>{t('pages.landing.how_optrispace_works.section5.line1')}</p>

        <Header
          as="h3"
          content={t('pages.landing.how_optrispace_works.section6.header')}
        />

        <p>{t('pages.landing.how_optrispace_works.section6.line1')}</p>

        <Header
          as="h2"
          content={t('pages.landing.what_is_inside.header.title')}
        />

        <List bulleted>
          <List.Item>
            {t('pages.landing.what_is_inside.powered_by')}{' '}
            <a
              href={`${gitHubLink}/optrispace-contract-v2`}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              {t('pages.landing.what_is_inside.smart_contracts')}
            </a>
          </List.Item>
          <List.Item>
            {t('pages.landing.what_is_inside.all_of_our_code')}{' '}
            <a
              href={gitHubLink}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              {t('pages.landing.what_is_inside.open_source')}
            </a>
          </List.Item>
          <List.Item>
            {t('pages.landing.what_is_inside.all_payments_in_crypto')}
          </List.Item>
          <List.Item>
            {t('pages.landing.what_is_inside.no_paperwork')}
          </List.Item>
          <List.Item>
            {t('pages.landing.what_is_inside.no_middlemen')}
          </List.Item>
        </List>

        <Header as="h2" content="What network do we use?" />

        <p>
          {t('pages.landing.what_network_do_we_use.line1')}
          <br />
          {t('pages.landing.what_network_do_we_use.line2')}
        </p>
      </Container>
    </>
  )
}
