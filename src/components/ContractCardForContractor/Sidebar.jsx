import React from 'react'
import Link from 'next/link'
import { List, Icon, Divider, Button, Segment, Header } from 'semantic-ui-react'
import { formatDateTime } from '../../lib/formatDate'
import useTranslation from 'next-translate/useTranslation'

const formatTimestamp = (timestamp, locale) => {
  if (timestamp === 0) return ''

  return formatDateTime(timestamp, locale)
}

export const Sidebar = ({
  contract,
  symbol,
  blockchainViewAddressURL,
  twitterLink,
  linkedInLink,
  discordLink,
}) => {
  const { t } = useTranslation('common')
  const locale = t('date.locale')

  return (
    <>
      <Segment>
        <Header
          as="h3"
          content={t('pages.contracts.show.sidebar.your_contract.header')}
        />

        <List bulleted>
          <List.Item
            content={t(
              'pages.contracts.show.sidebar.your_contract.current_status',
              {
                value: t(`contracts:model.statuses.${contract.status}`),
              }
            )}
          />

          <List.Item
            content={t(
              'pages.contracts.show.sidebar.your_contract.contract_value',
              {
                value: contract.value,
                symbol: symbol,
              }
            )}
          />

          <List.Item
            content={t(
              'pages.contracts.show.sidebar.your_contract.contract_balance',
              {
                value: contract.balance,
                symbol: symbol,
              }
            )}
          />

          <List.Item>
            <Link href={`/customers/${contract.customerAddress}`}>
              {t(
                'pages.contracts.show.sidebar.your_contract.open_customer_profile'
              )}
            </Link>
          </List.Item>
        </List>

        <Divider />

        <p>{t('pages.contracts.show.sidebar.your_contract.description')}</p>

        <List bulleted>
          <List.Item
            content={t(
              'pages.contracts.show.sidebar.your_contract.work_should_be_started_before',
              {
                value:
                  contract.workShouldBeStartedBefore > 0
                    ? formatTimestamp(
                        contract.workShouldBeStartedBefore,
                        locale
                      )
                    : t('labels.not_available'),
              }
            )}
          />

          <List.Item
            content={t(
              'pages.contracts.show.sidebar.your_contract.result_should_be_delivered_before',
              {
                value:
                  contract.resultShouldBeDeliveredBefore > 0
                    ? formatTimestamp(
                        contract.resultShouldBeDeliveredBefore,
                        locale
                      )
                    : t('labels.not_available'),
              }
            )}
          />
        </List>
      </Segment>

      <Segment>
        <Header
          as="h3"
          content={t(
            'pages.contracts.show.sidebar.wallets_and_transactions.header'
          )}
        />

        <p>
          {t(
            'pages.contracts.show.sidebar.wallets_and_transactions.description_for_contractor'
          )}
        </p>

        <Button
          icon
          labelPosition="right"
          as="a"
          href={`${blockchainViewAddressURL}/${contract.customerAddress}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          <Icon name="external alternate" />
          {t('pages.contracts.show.sidebar.wallets_and_transactions.customer')}
        </Button>

        <Button
          icon
          labelPosition="right"
          as="a"
          href={`${blockchainViewAddressURL}/${contract.address}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          <Icon name="external alternate" />
          {t('pages.contracts.show.sidebar.wallets_and_transactions.contract')}
        </Button>
      </Segment>

      <Segment>
        <Header
          as="h3"
          content={t(
            'pages.contracts.show.sidebar.do_you_need_any_help.header'
          )}
        />

        <p>
          {t('pages.contracts.show.sidebar.do_you_need_any_help.description')}
        </p>

        <Button
          as="a"
          color="twitter"
          icon="twitter"
          href={twitterLink}
          target="_blank"
          rel="noreferrer noopener nofollow"
          title="Twitter"
          content="Twitter"
        />

        <Button
          as="a"
          color="linkedin"
          icon="linkedin"
          href={linkedInLink}
          target="_blank"
          rel="noreferrer noopener nofollow"
          title="LinkedIn"
          content="LinkedIn"
        />

        <Button
          as="a"
          color="violet"
          icon="discord"
          href={discordLink}
          target="_blank"
          rel="noreferrer noopener nofollow"
          title="Discord"
          content="Discord"
        />
      </Segment>
    </>
  )
}
