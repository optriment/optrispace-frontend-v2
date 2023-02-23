import React, { useState } from 'react'
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

const { publicRuntimeConfig } = getConfig()
const {
  optriSpaceContractAddress,
  blockchainViewAddressURL,
  twitterLink,
  linkedInLink,
  discordLink,
} = publicRuntimeConfig

export const ContractCardForContractor = ({
  contract,
  currentAccount,
  accountBalance,
}) => {
  const router = useRouter()
  const [displayModal, setDisplayModal] = useState(false)
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

  const panes = [
    {
      menuItem: { key: 'history', content: 'Contract History' },
      render: () => (
        <Tab.Pane>
          <ContractLifeCycle contract={contract} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: { key: 'meta', content: 'Technical Details' },
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
    return (
      <JustOneSecondBlockchain message="Waiting for the contract status..." />
    )
  }

  return (
    <Grid columns={1} stackable>
      {acceptPrepareError && (
        <Grid.Column>
          <ErrorWrapper
            header="Unable to prepare accept"
            error={errorHandler(acceptPrepareError, 'acceptPrepareError')}
          />
        </Grid.Column>
      )}

      {acceptError && (
        <Grid.Column>
          <ErrorWrapper
            header="Unable to accept"
            error={errorHandler(acceptError, 'acceptError')}
          />
        </Grid.Column>
      )}

      {startPrepareError && (
        <Grid.Column>
          <ErrorWrapper
            header="Unable to prepare start"
            error={errorHandler(startPrepareError, 'startPrepareError')}
          />
        </Grid.Column>
      )}

      {startError && (
        <Grid.Column>
          <ErrorWrapper
            header="Unable to start"
            error={errorHandler(startError, 'startError')}
          />
        </Grid.Column>
      )}

      {deliverPrepareError && (
        <Grid.Column>
          <ErrorWrapper
            header="Unable to prepare deliver"
            error={errorHandler(deliverPrepareError, 'deliverPrepareError')}
          />
        </Grid.Column>
      )}

      {deliverError && (
        <Grid.Column>
          <ErrorWrapper
            header="Unable to deliver"
            error={errorHandler(deliverError, 'deliverError')}
          />
        </Grid.Column>
      )}

      {withdrawPrepareError && (
        <Grid.Column>
          <ErrorWrapper
            header="Unable to prepare withdraw"
            error={errorHandler(withdrawPrepareError, 'withdrawPrepareError')}
          />
        </Grid.Column>
      )}

      {withdrawError && (
        <Grid.Column>
          <ErrorWrapper
            header="Unable to withdraw"
            error={errorHandler(withdrawError, 'withdrawError')}
          />
        </Grid.Column>
      )}

      {displayModal && (
        <ConfirmationMessage
          onClose={() => setDisplayModal(false)}
          onConfirm={() => {
            writeDeliver?.()
            setDisplayModal(false)
          }}
          confirmationButtonContent="Deliver result"
          confirmationButtonPositive
        >
          At this stage we notice that you will not be able to change contract
          status after delivering result. If customer decides to decline your
          contract, you will not be paid.
          <Divider />
          <b>Please check twice all requirements in terms of contract.</b>
        </ConfirmationMessage>
      )}

      {currentStatus === 'created' && (
        <Grid.Column>
          <DoNotStartWorking />

          <Message icon>
            <Icon name="file text" />

            <Message.Content>
              <Message.Header>
                Please check all requirements, terms and conditions of the
                contract
              </Message.Header>

              <Divider />

              <p>
                Please ask your customer whatever you need to make this job
                done.
                <br />
                If you agree with the contract and everything is good for you,
                please click &quot;Accept Terms & Conditions &quot; to continue.
                <br />
                After this step the customer will be able to fund smart contract
                on blockchain.
              </p>
            </Message.Content>
          </Message>

          <ExecuteBlockchainTransactionButton
            icon="file text"
            content="Accept Terms & Conditions"
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
              At this moment we are waiting for the smart contract to be funded
              on the blockchain by the customer.
              <br />
              After this you will be able to start your work.
            </p>
          </WhatIsNextMessage>
        </Grid.Column>
      )}

      {currentStatus === 'funded' && (
        <Grid.Column>
          {contract.remainingTimeToStartWork > 0 ? (
            <>
              <Message icon>
                <Icon name="play" />

                <Message.Content>
                  <Message.Header>Be ready!</Message.Header>

                  <Divider />

                  <p>
                    At this moment customer is waiting for you to start work.
                  </p>

                  <p>
                    You have about{' '}
                    {toDaysMinutesSeconds(contract.remainingTimeToStartWork)} to
                    update contract status. Expected date:{' '}
                    {formatDateTime(contract.workShouldBeStartedBefore)}.
                  </p>

                  <p>
                    <b>
                      If work will not be started on time, customer will be able
                      to refund money!
                    </b>
                  </p>
                </Message.Content>
              </Message>

              <ExecuteBlockchainTransactionButton
                content="Start Work"
                onClick={startContract}
                floated="right"
              />
            </>
          ) : (
            <Message icon error>
              <Icon name="ban" />

              <Message.Content>
                <Message.Header>Too late to start work</Message.Header>

                <Divider />

                <p>
                  Unfortunately you are out of time to start work within this
                  contract.
                  <br />
                  Customer will request money back.
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
              <Message icon>
                <Icon name="stop" />

                <Message.Content>
                  <Message.Header>
                    Please do not forget to deliver result on time!
                  </Message.Header>

                  <Divider />

                  <p>
                    At this moment customer is waiting for you to deliver
                    result.
                  </p>

                  <p>
                    You have about{' '}
                    {toDaysMinutesSeconds(
                      contract.remainingTimeToDeliverResult
                    )}{' '}
                    to update contract status. Expected date:{' '}
                    {formatDateTime(contract.resultShouldBeDeliveredBefore)}.
                    <br />
                    If work will not be delivered on time, customer will be able
                    to refund money.
                  </p>
                </Message.Content>
              </Message>

              <ExecuteBlockchainTransactionButton
                icon="stop"
                content="Deliver Result"
                onClick={deliverContract}
                floated="right"
              />
            </>
          ) : (
            <Message icon error>
              <Icon name="ban" />

              <Message.Content>
                <Message.Header>Too late to deliver result</Message.Header>

                <Divider />

                <p>
                  Unfortunately you are out of time to deliver work result
                  within this contract.
                  <br />
                  Customer will request money back.
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
              At this moment we are waiting for the smart contract to be
              confirmed (or even declined) by the customer.
              <br />
              Please do your best to help your customer to confirm your work
              result.
            </p>
          </WhatIsNextMessage>
        </Grid.Column>
      )}

      {currentStatus === 'approved' && (
        <Grid.Column>
          <Message positive icon>
            <Icon name="fire" />

            <Message.Content>
              <Message.Header>You contract has been approved!</Message.Header>

              <Divider />

              <p>Now you can request your money.</p>
            </Message.Content>
          </Message>

          <ExecuteBlockchainTransactionButton
            icon="money"
            positive
            content="Withdraw"
            onClick={withdrawContract}
            floated="right"
          />
        </Grid.Column>
      )}

      {currentStatus === 'declined' && (
        <Grid.Column>
          <Message negative icon>
            <Icon name="ban" />

            <Message.Content>
              <Message.Header>Your contract has been declined!</Message.Header>

              <Divider />

              <p>
                Customer has rejected your work result.
                <br />
                Please do your best next time and wish you good luck!
              </p>
            </Message.Content>
          </Message>
        </Grid.Column>
      )}

      {currentStatus === 'closed' && (
        <Grid.Column>
          <Message positive icon>
            <Icon name="fire" />

            <Message.Content>
              <Message.Header>Congratulations!</Message.Header>

              <Divider />

              <p>We hope you have enjoyed working with this customer!</p>

              <p>
                If you have any ideas on how to improve OptriSpace – feel free
                to contact us.
              </p>
            </Message.Content>
          </Message>
        </Grid.Column>
      )}

      <Grid.Column mobile={16} computer={10}>
        <Segment>
          <Header as="h3">Contract Description, Terms & Conditions</Header>

          <div style={{ wordWrap: 'break-word' }}>
            <FormattedDescription description={contract.description} />
          </div>
        </Segment>

        <Segment>
          <Header as="h3">Detailed View</Header>

          <p>
            We provide some additional information (it is usually bored for
            non-technical people) to let you know what is happening with your
            smart contract on blockchain. If you don&apos;t need it - ignore
            this section below :-)
          </p>

          <p>
            But! These tables will be necessary if you will have any issues with
            our platform. Please provide this details to our support team with
            any problems or unexpected behaviours while using this contract.
          </p>

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
  return (
    <Message icon>
      <Icon name="bell" />

      <Message.Content>
        <Message.Header>Friendly reminder from OptriSpace Team:</Message.Header>

        <Divider />

        <p>
          This contract has not been funded yet!
          <br />
          Please don&apos;t start working on this job before getting funded
          contract!
        </p>
      </Message.Content>
    </Message>
  )
}
