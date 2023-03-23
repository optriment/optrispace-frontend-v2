import React, { useState } from 'react'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import {
  Header,
  Tab,
  Icon,
  Divider,
  Message,
  Grid,
  Segment,
} from 'semantic-ui-react'
import { useContract } from '../../hooks/useContract'
import ErrorWrapper from '../ErrorWrapper'
import { Sidebar } from './Sidebar'
import { errorHandler } from '../../lib/errorHandler'
import { JustOneSecondBlockchain } from '../JustOneSecond'
import { FormattedDescription } from '../FormattedDescription'
import { ConfirmTransactionMessage } from '../../components/ConfirmTransactionMessage'
import { ExecuteBlockchainTransactionButton } from '../ExecuteBlockchainTransactionButton'
import { WhatIsNextMessage } from '../WhatIsNextMessage'
import { formatDateTime, toDaysMinutesSeconds } from '../../lib/formatDate'
import { ContractLifeCycle } from './ContractLifeCycle'
import { ContractMeta } from './ContractMeta'
import { ConfirmationMessage } from '../ConfirmationMessage'
import { InsufficientBalance } from '../InsufficientBalance'
import useTranslation from 'next-translate/useTranslation'

const { publicRuntimeConfig } = getConfig()
const {
  optriSpaceContractAddress,
  blockchainViewAddressURL,
  twitterLink,
  linkedInLink,
  discordLink,
} = publicRuntimeConfig

export const ContractCardForCustomer = ({
  contract,
  currentAccount,
  accountBalance,
}) => {
  const { t } = useTranslation('common')

  const router = useRouter()

  const {
    isFundAllowed,
    isApproveAllowed,
    isDeclineAllowed,
    isRefundAllowed,

    // Fund
    fundPrepareError,
    fundError,
    contractFunding,
    contractFunded,
    writeFund,

    // Approve
    approvePrepareError,
    approveError,
    contractApproving,
    contractApproved,
    writeApprove,

    // Decline
    declinePrepareError,
    declineError,
    contractDeclining,
    contractDeclined,
    writeDecline,

    // Refund
    refundPrepareError,
    refundError,
    contractRefunding,
    contractRefunded,
    writeRefund,
  } = useContract({
    optriSpaceContractAddress,
    contract,
    currentAccount,
    onContractFunded: () => reloadPage(),
    onContractApproved: () => reloadPage(),
    onContractDeclined: () => reloadPage(),
    onContractRefunded: () => reloadPage(),
  })

  const reloadPage = () => router.reload()
  const [showIsApprove, setShowIsApprove] = useState(false)
  const [showIsDecline, setShowIsDecline] = useState(false)
  const currentStatus = contract.status

  const fundContract = () => {
    if (!isFundAllowed) return

    writeFund?.()
  }

  const approveContract = () => {
    if (!isApproveAllowed) return

    setShowIsApprove(true)
  }

  const declineContract = () => {
    if (!isDeclineAllowed) return

    setShowIsDecline(true)
  }

  const refundContract = () => {
    if (!isRefundAllowed) return

    writeRefund?.()
  }

  if (
    contractFunding ||
    contractApproving ||
    contractDeclining ||
    contractRefunding
  ) {
    return <ConfirmTransactionMessage />
  }

  if (
    contractFunded ||
    contractApproved ||
    contractDeclined ||
    contractRefunded
  ) {
    return <JustOneSecondBlockchain />
  }

  const panes = [
    {
      menuItem: {
        key: 'history',
        content: t('pages.contracts.show.detailed_view.contract_history.title'),
      },
      render: () => (
        <Tab.Pane>
          <ContractLifeCycle contract={contract} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: {
        key: 'meta',
        content: t(
          'pages.contracts.show.detailed_view.technical_details.title'
        ),
      },
      render: () => (
        <Tab.Pane>
          <ContractMeta contract={contract} symbol={accountBalance.symbol} />
        </Tab.Pane>
      ),
    },
  ]

  return (
    <Grid columns={1} stackable>
      {fundPrepareError && (
        <Grid.Column>
          <ErrorWrapper
            header={t('errors.transactions.prepare')}
            error={errorHandler(fundPrepareError, 'fundPrepareError')}
          />
        </Grid.Column>
      )}

      {fundError && (
        <Grid.Column>
          <ErrorWrapper
            header={t('errors.transactions.execute')}
            error={errorHandler(fundError, 'fundError')}
          />
        </Grid.Column>
      )}

      {approvePrepareError && (
        <Grid.Column>
          <ErrorWrapper
            header={t('errors.transactions.prepare')}
            error={errorHandler(approvePrepareError, 'approvePrepareError')}
          />
        </Grid.Column>
      )}

      {approveError && (
        <Grid.Column>
          <ErrorWrapper
            header={t('errors.transactions.execute')}
            error={errorHandler(approveError, 'approveError')}
          />
        </Grid.Column>
      )}

      {declinePrepareError && (
        <Grid.Column>
          <ErrorWrapper
            header={t('errors.transactions.prepare')}
            error={errorHandler(declinePrepareError, 'declinePrepareError')}
          />
        </Grid.Column>
      )}

      {declineError && (
        <Grid.Column>
          <ErrorWrapper
            header={t('errors.transactions.execute')}
            error={errorHandler(declineError, 'declineError')}
          />
        </Grid.Column>
      )}

      {refundPrepareError && (
        <Grid.Column>
          <ErrorWrapper
            header={t('errors.transactions.prepare')}
            error={errorHandler(refundPrepareError, 'refundPrepareError')}
          />
        </Grid.Column>
      )}

      {refundError && (
        <Grid.Column>
          <ErrorWrapper
            header={t('errors.transactions.execute')}
            error={errorHandler(refundError, 'refundError')}
          />
        </Grid.Column>
      )}

      {showIsApprove && (
        <ConfirmationMessage
          onClose={() => setShowIsApprove(false)}
          onConfirm={() => {
            writeApprove?.()
            setShowIsApprove(false)
          }}
          confirmationButtonContent={t(
            'pages.contracts.show.customer_screen.approve_confirmation_message.confirm_button'
          )}
          confirmationButtonPositive
        >
          <p>
            {t(
              'pages.contracts.show.customer_screen.approve_confirmation_message.line1'
            )}
          </p>

          <Divider />

          <p>
            <b>
              {t(
                'pages.contracts.show.customer_screen.approve_confirmation_message.line2'
              )}
            </b>
          </p>
        </ConfirmationMessage>
      )}

      {showIsDecline && (
        <ConfirmationMessage
          onClose={() => setShowIsDecline(false)}
          onConfirm={() => {
            writeDecline?.()
            setShowIsDecline(false)
          }}
          confirmationButtonContent={t(
            'pages.contracts.show.customer_screen.decline_confirmation_message.confirm_button'
          )}
          confirmationButtonNegative
        >
          <p>
            {t(
              'pages.contracts.show.customer_screen.decline_confirmation_message.line1'
            )}
          </p>

          <Divider />

          <p>
            <b>
              {t(
                'pages.contracts.show.customer_screen.decline_confirmation_message.line2'
              )}
            </b>
          </p>
        </ConfirmationMessage>
      )}

      {currentStatus === 'created' && (
        <Grid.Column>
          <WhatIsNextMessage>
            <p>
              {t(
                'pages.contracts.show.customer_screen.contract_created.what_is_next.line1'
              )}
              <br />
              {t(
                'pages.contracts.show.customer_screen.contract_created.what_is_next.line2'
              )}
            </p>
          </WhatIsNextMessage>
        </Grid.Column>
      )}

      {currentStatus === 'accepted' && (
        <Grid.Column>
          {+accountBalance.formatted > +contract.value ? (
            <>
              <WhatIsNextMessage>
                <p>
                  <b>
                    {t(
                      'pages.contracts.show.customer_screen.contract_accepted.what_is_next.header',
                      {
                        value: contract.value,
                        symbol: accountBalance.symbol,
                      }
                    )}
                  </b>
                </p>

                <p>
                  {t(
                    'pages.contracts.show.customer_screen.contract_accepted.what_is_next.line1'
                  )}
                  <br />
                  {t(
                    'pages.contracts.show.customer_screen.contract_accepted.what_is_next.line2'
                  )}
                  <br />
                  {t(
                    'pages.contracts.show.customer_screen.contract_accepted.what_is_next.line3'
                  )}
                </p>
              </WhatIsNextMessage>

              <ExecuteBlockchainTransactionButton
                content={t(
                  'pages.contracts.show.customer_screen.contract_accepted.fund_contract',
                  {
                    value: contract.value,
                    symbol: accountBalance.symbol,
                  }
                )}
                onClick={fundContract}
                floated="right"
              />
            </>
          ) : (
            <InsufficientBalance />
          )}
        </Grid.Column>
      )}

      {currentStatus === 'funded' && (
        <Grid.Column>
          {contract.remainingTimeToStartWork > 0 ? (
            <WhatIsNextMessage>
              <p>
                {t(
                  'pages.contracts.show.customer_screen.contract_funded.what_is_next.header'
                )}
              </p>

              <p>
                {t(
                  'pages.contracts.show.customer_screen.contract_funded.what_is_next.line1',
                  {
                    remainingTimeToStartWork: toDaysMinutesSeconds(
                      contract.remainingTimeToStartWork
                    ),
                    expectedDate: formatDateTime(
                      contract.workShouldBeStartedBefore,
                      t('date.locale')
                    ),
                  }
                )}
                <br />
                {t(
                  'pages.contracts.show.customer_screen.contract_funded.what_is_next.line2'
                )}
              </p>
            </WhatIsNextMessage>
          ) : (
            <>
              <Message icon warning>
                <Icon name="ban" />

                <Message.Content>
                  <Message.Header
                    content={t(
                      'pages.contracts.show.customer_screen.contract_funded.out_of_time.header'
                    )}
                  />

                  <Divider />

                  <p>
                    {t(
                      'pages.contracts.show.customer_screen.contract_funded.out_of_time.line1'
                    )}
                    <br />
                    {t(
                      'pages.contracts.show.customer_screen.contract_funded.out_of_time.line2',
                      {
                        value: contract.value,
                        symbol: accountBalance.symbol,
                      }
                    )}
                  </p>
                </Message.Content>
              </Message>

              <ExecuteBlockchainTransactionButton
                content={t(
                  'pages.contracts.show.customer_screen.contract_funded.out_of_time.refund_contract'
                )}
                icon="money"
                onClick={refundContract}
                floated="right"
              />
            </>
          )}
        </Grid.Column>
      )}

      {currentStatus === 'started' && (
        <Grid.Column>
          {contract.remainingTimeToDeliverResult > 0 ? (
            <>
              <WhatIsNextMessage>
                <p>
                  {t(
                    'pages.contracts.show.customer_screen.contract_started.what_is_next.header'
                  )}
                </p>

                <p>
                  {t(
                    'pages.contracts.show.customer_screen.contract_started.what_is_next.line1',
                    {
                      remainingTimeToDeliverResult: toDaysMinutesSeconds(
                        contract.remainingTimeToDeliverResult
                      ),
                      expectedDate: formatDateTime(
                        contract.resultShouldBeDeliveredBefore,
                        t('date.locale')
                      ),
                    }
                  )}
                  <br />
                  {t(
                    'pages.contracts.show.customer_screen.contract_started.what_is_next.line2'
                  )}
                </p>

                <Divider />

                <p>
                  {t(
                    'pages.contracts.show.customer_screen.contract_started.what_is_next.line3'
                  )}
                  <br />
                  {t(
                    'pages.contracts.show.customer_screen.contract_started.what_is_next.line4'
                  )}
                </p>

                <p>
                  <b>
                    {t(
                      'pages.contracts.show.customer_screen.contract_started.what_is_next.line5'
                    )}
                  </b>
                </p>
              </WhatIsNextMessage>

              <ExecuteBlockchainTransactionButton
                content={t(
                  'pages.contracts.show.customer_screen.contract_started.approve_contract'
                )}
                icon="check"
                onClick={approveContract}
                floated="right"
              />
            </>
          ) : (
            <>
              <Message icon warning>
                <Icon name="ban" />

                <Message.Content>
                  <Message.Header
                    content={t(
                      'pages.contracts.show.customer_screen.contract_started.out_of_time.header'
                    )}
                  />

                  <Divider />

                  <p>
                    {t(
                      'pages.contracts.show.customer_screen.contract_started.out_of_time.line1'
                    )}
                    <br />
                    {t(
                      'pages.contracts.show.customer_screen.contract_started.out_of_time.line2',
                      {
                        value: contract.value,
                        symbol: accountBalance.symbol,
                      }
                    )}
                  </p>
                </Message.Content>
              </Message>

              <ExecuteBlockchainTransactionButton
                content={t(
                  'pages.contracts.show.customer_screen.contract_started.out_of_time.refund_contract'
                )}
                icon="money"
                onClick={refundContract}
                floated="right"
              />
            </>
          )}
        </Grid.Column>
      )}

      {currentStatus === 'delivered' && (
        <Grid.Column>
          <Message icon positive>
            <Icon name="check" />

            <Message.Content>
              <Message.Header
                content={t(
                  'pages.contracts.show.customer_screen.contract_delivered.header'
                )}
              />

              <Divider />

              <p>
                {t(
                  'pages.contracts.show.customer_screen.contract_delivered.line1'
                )}
              </p>

              <p>
                {t(
                  'pages.contracts.show.customer_screen.contract_delivered.line2'
                )}
              </p>

              <p>
                <b>
                  {t(
                    'pages.contracts.show.customer_screen.contract_delivered.line3'
                  )}
                </b>
              </p>

              <p>
                {t(
                  'pages.contracts.show.customer_screen.contract_delivered.line4'
                )}
              </p>
            </Message.Content>
          </Message>

          <ExecuteBlockchainTransactionButton
            content={t(
              'pages.contracts.show.customer_screen.contract_delivered.approve_contract'
            )}
            icon="check"
            onClick={approveContract}
            positive
            floated="right"
          />

          <ExecuteBlockchainTransactionButton
            content={t(
              'pages.contracts.show.customer_screen.contract_delivered.decline_contract'
            )}
            icon="close"
            onClick={declineContract}
            negative
            floated="right"
          />
        </Grid.Column>
      )}

      {(currentStatus === 'approved' ||
        (currentStatus === 'closed' && contract.approvedAt > 0)) && (
        <Grid.Column>
          <Message positive icon>
            <Icon name="fire" />

            <Message.Content>
              <Message.Header
                content={t(
                  'pages.contracts.show.customer_screen.contract_approved.header'
                )}
              />

              <Divider />

              <p>
                {t(
                  'pages.contracts.show.customer_screen.contract_approved.line1'
                )}
              </p>

              <p>
                {t(
                  'pages.contracts.show.customer_screen.contract_approved.line2'
                )}
              </p>
            </Message.Content>
          </Message>
        </Grid.Column>
      )}

      {currentStatus === 'declined' && (
        <Grid.Column>
          <Message icon>
            <Icon name="ban" />

            <Message.Content>
              <Message.Header
                content={t(
                  'pages.contracts.show.customer_screen.contract_declined.header'
                )}
              />

              <Divider />

              <p>
                {t(
                  'pages.contracts.show.customer_screen.contract_declined.line1'
                )}
              </p>

              <p>
                {t(
                  'pages.contracts.show.customer_screen.contract_declined.line2',
                  {
                    value: contract.value,
                    symbol: accountBalance.symbol,
                  }
                )}
              </p>
            </Message.Content>
          </Message>

          <ExecuteBlockchainTransactionButton
            content={t(
              'pages.contracts.show.customer_screen.contract_declined.refund_contract'
            )}
            icon="money"
            onClick={refundContract}
            floated="right"
          />
        </Grid.Column>
      )}

      {currentStatus === 'closed' && contract.declinedAt > 0 && (
        <Grid.Column>
          <Message icon>
            <Icon name="money" />

            <Message.Content>
              <Message.Header
                content={t(
                  'pages.contracts.show.customer_screen.contract_refunded.header'
                )}
              />

              <Divider />

              <p>
                {t(
                  'pages.contracts.show.customer_screen.contract_refunded.line1'
                )}
              </p>

              <p>
                {t(
                  'pages.contracts.show.customer_screen.contract_refunded.line2'
                )}
              </p>
            </Message.Content>
          </Message>
        </Grid.Column>
      )}

      <Grid.Column mobile={16} computer={10}>
        <Segment>
          <Header
            as="h3"
            content={t('pages.contracts.show.contract_description.title')}
          />

          <div style={{ wordWrap: 'break-word' }}>
            <FormattedDescription description={contract.description} />
          </div>
        </Segment>

        <Segment>
          <Header
            as="h3"
            content={t('pages.contracts.show.detailed_view.title')}
          />

          <p>{t('pages.contracts.show.detailed_view.line1')}</p>
          <p>{t('pages.contracts.show.detailed_view.line2')}</p>

          <Tab panes={panes} />
        </Segment>
      </Grid.Column>

      <Grid.Column mobile={16} computer={6}>
        <Sidebar
          contract={contract}
          symbol={accountBalance.symbol}
          blockchainViewAddressURL={blockchainViewAddressURL}
          twitterLink={twitterLink}
          linkedInLink={linkedInLink}
          discordLink={discordLink}
        />
      </Grid.Column>
    </Grid>
  )
}
