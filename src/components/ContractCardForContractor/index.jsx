import React, { useState, useEffect } from 'react'
import getConfig from 'next/config'
import { useRouter } from 'next/router'
import { useContract } from '../../hooks/useContract'
import {
  Header,
  Tab,
  Divider,
  Icon,
  Message,
  Grid,
  Segment,
} from 'semantic-ui-react'
import ErrorWrapper from '../ErrorWrapper'
import { Sidebar } from './Sidebar'
import { errorHandler } from '../../lib/errorHandler'
import { JustOneSecondBlockchain } from '../JustOneSecond'
import { FormattedDescription } from '../FormattedDescription'
import { ConfirmTransactionMessage } from '../../components/ConfirmTransactionMessage'
import { WhatIsNextMessage } from '../WhatIsNextMessage'
import { ExecuteBlockchainTransactionButton } from '../ExecuteBlockchainTransactionButton'
import { formatDateTime, toDaysMinutesSeconds } from '../../lib/formatDate'
import { ContractLifeCycle } from './ContractLifeCycle'
import { ContractMeta } from './ContractMeta'
import { ConfirmationMessage } from '../ConfirmationMessage'
import useTranslation from 'next-translate/useTranslation'
import { useContractRead } from 'wagmi'
import gigsFreelancerServiceABI from '../../../contracts/GigsFreelancerService.json'

const { publicRuntimeConfig } = getConfig()
const {
  optriSpaceContractAddress,
  blockchainViewAddressURL,
  twitterLink,
  linkedInLink,
  discordLink,
} = publicRuntimeConfig

export const ContractCardForContractor = ({
  jobAddress,
  contract,
  currentAccount,
  accountBalance,
}) => {
  const { t } = useTranslation('common')

  const router = useRouter()
  const [displayModal, setDisplayModal] = useState(false)

  const [comment, setComment] = useState('')

  const {
    isAcceptAllowed,
    isStartAllowed,
    isDeliverAllowed,
    isWithdrawAllowed,

    // Accept
    acceptPrepareError,
    acceptError,
    contractAccepting,
    contractAccepted,
    writeAccept,

    // Start
    startPrepareError,
    startError,
    contractStarting,
    contractStarted,
    writeStart,

    // Deliver
    deliverPrepareError,
    deliverError,
    contractDelivering,
    contractDelivered,
    writeDeliver,

    // Withdraw
    withdrawPrepareError,
    withdrawError,
    contractWithdrawing,
    contractWithdrew,
    writeWithdraw,
  } = useContract({
    optriSpaceContractAddress,
    contract,
    currentAccount,
    onContractAccepted: () => reloadPage(),
    onContractStarted: () => reloadPage(),
    onContractDelivered: () => reloadPage(),
    onContractWithdrew: () => reloadPage(),
  })

  const { data: response } = useContractRead({
    address: optriSpaceContractAddress,
    abi: gigsFreelancerServiceABI,
    functionName: 'gigsGetMyApplication',
    args: [jobAddress],
    overrides: { from: currentAccount },
  })

  const reloadPage = () => router.reload()

  const currentStatus = contract.status

  const acceptContract = () => {
    if (!isAcceptAllowed) return

    writeAccept?.()
  }

  const startContract = () => {
    if (!isStartAllowed) return

    writeStart?.()
  }

  const deliverContract = () => {
    if (!isDeliverAllowed) return

    setDisplayModal(true)
  }

  const withdrawContract = () => {
    if (!isWithdrawAllowed) return

    writeWithdraw?.()
  }

  useEffect(() => {
    if (!response) return

    const { dto: rawApplication } = response

    const a = {
      comment: rawApplication.comment,
    }
    setComment(a.comment)
  }, [response])

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

  if (
    contractAccepting ||
    contractStarting ||
    contractDelivering ||
    contractWithdrawing
  ) {
    return <ConfirmTransactionMessage />
  }

  if (
    contractAccepted ||
    contractStarted ||
    contractDelivered ||
    contractWithdrew
  ) {
    return <JustOneSecondBlockchain />
  }

  return (
    <Grid columns={1} stackable>
      {acceptPrepareError && (
        <Grid.Column>
          <ErrorWrapper
            header={t('errors.transactions.prepare')}
            error={errorHandler(acceptPrepareError, 'acceptPrepareError')}
          />
        </Grid.Column>
      )}

      {acceptError && (
        <Grid.Column>
          <ErrorWrapper
            header={t('errors.transactions.execute')}
            error={errorHandler(acceptError, 'acceptError')}
          />
        </Grid.Column>
      )}

      {startPrepareError && (
        <Grid.Column>
          <ErrorWrapper
            header={t('errors.transactions.prepare')}
            error={errorHandler(startPrepareError, 'startPrepareError')}
          />
        </Grid.Column>
      )}

      {startError && (
        <Grid.Column>
          <ErrorWrapper
            header={t('errors.transactions.execute')}
            error={errorHandler(startError, 'startError')}
          />
        </Grid.Column>
      )}

      {deliverPrepareError && (
        <Grid.Column>
          <ErrorWrapper
            header={t('errors.transactions.prepare')}
            error={errorHandler(deliverPrepareError, 'deliverPrepareError')}
          />
        </Grid.Column>
      )}

      {deliverError && (
        <Grid.Column>
          <ErrorWrapper
            header={t('errors.transactions.execute')}
            error={errorHandler(deliverError, 'deliverError')}
          />
        </Grid.Column>
      )}

      {withdrawPrepareError && (
        <Grid.Column>
          <ErrorWrapper
            header={t('errors.transactions.prepare')}
            error={errorHandler(withdrawPrepareError, 'withdrawPrepareError')}
          />
        </Grid.Column>
      )}

      {withdrawError && (
        <Grid.Column>
          <ErrorWrapper
            header={t('errors.transactions.execute')}
            error={errorHandler(withdrawError, 'withdrawError')}
          />
        </Grid.Column>
      )}

      {currentStatus === 'created' && (
        <Grid.Column>
          <DoNotStartWorking />

          <WhatIsNextMessage>
            <p>
              {t(
                'pages.contracts.show.contractor_screen.contract_created.what_is_next.line1'
              )}
              <br />
              {t(
                'pages.contracts.show.contractor_screen.contract_created.what_is_next.line2'
              )}
              <br />
              {t(
                'pages.contracts.show.contractor_screen.contract_created.what_is_next.line3'
              )}
            </p>
          </WhatIsNextMessage>

          <ExecuteBlockchainTransactionButton
            icon="file text"
            content={t(
              'pages.contracts.show.contractor_screen.contract_created.accept_contract'
            )}
            onClick={acceptContract}
            floated="right"
          />
        </Grid.Column>
      )}

      {currentStatus === 'accepted' && (
        <Grid.Column>
          <DoNotStartWorking />

          <WhatIsNextMessage>
            <p>
              {t(
                'pages.contracts.show.contractor_screen.contract_accepted.what_is_next.line1'
              )}
              <br />
              {t(
                'pages.contracts.show.contractor_screen.contract_accepted.what_is_next.line2'
              )}
            </p>
          </WhatIsNextMessage>
        </Grid.Column>
      )}

      {currentStatus === 'funded' && (
        <Grid.Column>
          {contract.remainingTimeToStartWork > 0 ? (
            <>
              <WhatIsNextMessage>
                <p>
                  <b>
                    {t(
                      'pages.contracts.show.contractor_screen.contract_funded.what_is_next.header'
                    )}
                  </b>
                </p>

                <p>
                  {t(
                    'pages.contracts.show.contractor_screen.contract_funded.what_is_next.line1',
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
                </p>

                <p>
                  <b>
                    {t(
                      'pages.contracts.show.contractor_screen.contract_funded.what_is_next.line2'
                    )}
                  </b>
                </p>
              </WhatIsNextMessage>

              <ExecuteBlockchainTransactionButton
                content={t(
                  'pages.contracts.show.contractor_screen.contract_funded.start_work'
                )}
                onClick={startContract}
                floated="right"
              />
            </>
          ) : (
            <Message icon error>
              <Icon name="ban" />

              <Message.Content>
                <Message.Header
                  content={t(
                    'pages.contracts.show.contractor_screen.contract_funded.out_of_time.header'
                  )}
                />

                <Divider />

                <p>
                  {t(
                    'pages.contracts.show.contractor_screen.contract_funded.out_of_time.line1'
                  )}
                  <br />
                  {t(
                    'pages.contracts.show.contractor_screen.contract_funded.out_of_time.line2'
                  )}
                </p>
              </Message.Content>
            </Message>
          )}
        </Grid.Column>
      )}

      {currentStatus === 'started' && (
        <Grid.Column>
          {contract.remainingTimeToDeliverResult > 0 ? (
            <>
              {displayModal && (
                <ConfirmationMessage
                  onClose={() => setDisplayModal(false)}
                  onConfirm={() => {
                    writeDeliver?.()
                    setDisplayModal(false)
                  }}
                  confirmationButtonContent={t(
                    'pages.contracts.show.contractor_screen.contract_started.confirmation_message.confirm_button'
                  )}
                  confirmationButtonPositive
                >
                  <p>
                    {t(
                      'pages.contracts.show.contractor_screen.contract_started.confirmation_message.line1'
                    )}
                  </p>

                  <Divider />

                  <p>
                    <b>
                      {t(
                        'pages.contracts.show.contractor_screen.contract_started.confirmation_message.line2'
                      )}
                    </b>
                  </p>
                </ConfirmationMessage>
              )}

              <WhatIsNextMessage>
                <p>
                  <b>
                    {t(
                      'pages.contracts.show.contractor_screen.contract_started.what_is_next.header'
                    )}
                  </b>
                </p>

                <p>
                  {t(
                    'pages.contracts.show.contractor_screen.contract_started.what_is_next.line1'
                  )}
                  <br />
                  {t(
                    'pages.contracts.show.contractor_screen.contract_started.what_is_next.line2',
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
                </p>

                <p>
                  <b>
                    {t(
                      'pages.contracts.show.contractor_screen.contract_started.what_is_next.line3'
                    )}
                  </b>
                </p>
              </WhatIsNextMessage>

              <ExecuteBlockchainTransactionButton
                icon="stop"
                content={t(
                  'pages.contracts.show.contractor_screen.contract_started.deliver_result'
                )}
                onClick={deliverContract}
                floated="right"
              />
            </>
          ) : (
            <Message icon error>
              <Icon name="ban" />

              <Message.Content>
                <Message.Header
                  content={t(
                    'pages.contracts.show.contractor_screen.contract_started.out_of_time.header'
                  )}
                />

                <Divider />

                <p>
                  {t(
                    'pages.contracts.show.contractor_screen.contract_started.out_of_time.line1'
                  )}
                  <br />
                  {t(
                    'pages.contracts.show.contractor_screen.contract_started.out_of_time.line2'
                  )}
                </p>
              </Message.Content>
            </Message>
          )}
        </Grid.Column>
      )}

      {currentStatus === 'delivered' && (
        <Grid.Column>
          <WhatIsNextMessage>
            <p>
              {t(
                'pages.contracts.show.contractor_screen.contract_delivered.what_is_next.line1'
              )}
              <br />
              {t(
                'pages.contracts.show.contractor_screen.contract_delivered.what_is_next.line2'
              )}
            </p>
          </WhatIsNextMessage>
        </Grid.Column>
      )}

      {currentStatus === 'approved' && (
        <Grid.Column>
          <Message positive icon>
            <Icon name="fire" />

            <Message.Content>
              <Message.Header
                content={t(
                  'pages.contracts.show.contractor_screen.contract_approved.header'
                )}
              />

              <Divider />

              <p>
                {t(
                  'pages.contracts.show.contractor_screen.contract_approved.line1'
                )}
              </p>
            </Message.Content>
          </Message>

          <ExecuteBlockchainTransactionButton
            icon="money"
            positive
            content={t(
              'pages.contracts.show.contractor_screen.contract_approved.withdraw_contract'
            )}
            onClick={withdrawContract}
            floated="right"
          />
        </Grid.Column>
      )}

      {(currentStatus === 'declined' ||
        (currentStatus === 'closed' && contract.declinedAt > 0)) && (
        <Grid.Column>
          <Message negative icon>
            <Icon name="ban" />

            <Message.Content>
              <Message.Header
                content={t(
                  'pages.contracts.show.contractor_screen.contract_declined.header'
                )}
              />

              <Divider />

              <p>
                {t(
                  'pages.contracts.show.contractor_screen.contract_declined.line1'
                )}
                <br />
                {t(
                  'pages.contracts.show.contractor_screen.contract_declined.line2'
                )}
              </p>
            </Message.Content>
          </Message>
        </Grid.Column>
      )}

      {currentStatus === 'closed' && contract.withdrewAt > 0 && (
        <Grid.Column>
          <Message positive icon>
            <Icon name="fire" />

            <Message.Content>
              <Message.Header
                content={t(
                  'pages.contracts.show.contractor_screen.contract_withdrew.header'
                )}
              />

              <Divider />

              <p>
                {t(
                  'pages.contracts.show.contractor_screen.contract_withdrew.line1'
                )}
                <br />
                {t(
                  'pages.contracts.show.contractor_screen.contract_withdrew.line2'
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
            content={t('pages.contracts.show.contractor_screen.comment')}
          />

          <div style={{ wordWrap: 'break-word' }}>
            <FormattedDescription description={comment} />
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

const DoNotStartWorking = () => {
  const { t } = useTranslation('common')

  return (
    <Message icon>
      <Icon name="bell" />

      <Message.Content>
        <Message.Header
          content={t(
            'pages.contracts.show.contractor_screen.do_not_start_working.header'
          )}
        />

        <Divider />

        <p>
          {t(
            'pages.contracts.show.contractor_screen.do_not_start_working.line1'
          )}
          <br />
          {t(
            'pages.contracts.show.contractor_screen.do_not_start_working.line2'
          )}
        </p>
      </Message.Content>
    </Message>
  )
}
