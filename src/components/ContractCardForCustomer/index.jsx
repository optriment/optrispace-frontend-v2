import React from 'react'
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

const { publicRuntimeConfig } = getConfig()
const { optriSpaceContractAddress, blockchainViewAddressURL } =
  publicRuntimeConfig

export const ContractCardForCustomer = ({
  contract,
  currentAccount,
  accountBalance,
}) => {
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

  const currentStatus = contract.status

  const fundContract = () => {
    if (!isFundAllowed) return

    writeFund?.()
  }

  const approveContract = () => {
    if (!isApproveAllowed) return

    writeApprove?.()
  }

  const declineContract = () => {
    if (!isDeclineAllowed) return

    writeDecline?.()
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
    return (
      <JustOneSecondBlockchain message="Waiting for the contract status..." />
    )
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

  return (
    <Grid columns={1} stackable>
      {fundPrepareError && (
        <Grid.Column>
          <ErrorWrapper
            header="Unable to prepare fund"
            error={errorHandler(fundPrepareError, 'fundPrepareError')}
          />
        </Grid.Column>
      )}

      {fundError && (
        <Grid.Column>
          <ErrorWrapper
            header="Unable to fund"
            error={errorHandler(fundError, 'fundError')}
          />
        </Grid.Column>
      )}

      {approvePrepareError && (
        <Grid.Column>
          <ErrorWrapper
            header="Unable to prepare approve"
            error={errorHandler(approvePrepareError, 'approvePrepareError')}
          />
        </Grid.Column>
      )}

      {approveError && (
        <Grid.Column>
          <ErrorWrapper
            header="Unable to approve"
            error={errorHandler(approveError, 'approveError')}
          />
        </Grid.Column>
      )}

      {declinePrepareError && (
        <Grid.Column>
          <ErrorWrapper
            header="Unable to prepare decline"
            error={errorHandler(declinePrepareError, 'declinePrepareError')}
          />
        </Grid.Column>
      )}

      {declineError && (
        <Grid.Column>
          <ErrorWrapper
            header="Unable to decline"
            error={errorHandler(declineError, 'declineError')}
          />
        </Grid.Column>
      )}

      {refundPrepareError && (
        <Grid.Column>
          <ErrorWrapper
            header="Unable to prepare refund"
            error={errorHandler(refundPrepareError, 'refundPrepareError')}
          />
        </Grid.Column>
      )}

      {refundError && (
        <Grid.Column>
          <ErrorWrapper
            header="Unable to refund"
            error={errorHandler(refundError, 'refundError')}
          />
        </Grid.Column>
      )}

      {currentStatus === 'created' && (
        <Grid.Column>
          <WhatIsNextMessage>
            <p>
              At this moment we are waiting for the contract to be accepted by
              the contractor.
              <br />
              After this you will be able to create the contract on blockchain.
            </p>
          </WhatIsNextMessage>
        </Grid.Column>
      )}

      {currentStatus === 'accepted' && (
        <Grid.Column>
          {+accountBalance.formatted > +contract.value ? (
            <>
              <Message icon>
                <Icon name="money" />

                <Message.Content>
                  <Message.Header>
                    Smart contract is ready to be funded by
                    {` ${contract.value} ${accountBalance.symbol}`}
                  </Message.Header>

                  <Divider />

                  <p>
                    Please click &quot;Fund smart contract&quot; to open
                    MetaMask to confirm transaction.
                    <br />
                    You have to pay gas fee for this transaction.
                    <br />
                    After this step the contractor will be able to start
                    working.
                  </p>
                </Message.Content>
              </Message>

              <ExecuteBlockchainTransactionButton
                content="Fund smart contract"
                onClick={fundContract}
                floated="right"
              />
            </>
          ) : (
            <Message icon warning>
              <Icon name="exclamation circle" />

              <Message.Content>
                <Message.Header>
                  Smart contract is ready to be funded by
                  {` ${contract.value} ${accountBalance.symbol}`}
                </Message.Header>

                <Divider />

                <p>
                  Unfortunately you do not have enough money in your account to
                  fund this smart contract.
                  <br />
                  Please deposit at least{' '}
                  {(+contract.value - +accountBalance.formatted).toFixed(6) +
                    ' ' +
                    accountBalance.symbol +
                    ' '}
                  to your wallet and try again.
                </p>
              </Message.Content>
            </Message>
          )}
        </Grid.Column>
      )}

      {currentStatus === 'funded' && (
        <Grid.Column>
          {contract.remainingTimeToStartWork > 0 ? (
            <WhatIsNextMessage>
              <p>
                At this moment we are waiting for the contractor starts work.
              </p>

              <p>
                Contractor has about{' '}
                {toDaysMinutesSeconds(contract.remainingTimeToStartWork)} to
                update contract status. Expected date:{' '}
                {formatDateTime(contract.workShouldBeStartedBefore)}.
                <br />
                If work will not be started on time, you will be able to refund
                your money.
              </p>
            </WhatIsNextMessage>
          ) : (
            <>
              <Message icon>
                <Icon name="ban" />

                <Message.Content>
                  <Message.Header>
                    Contractor did not start work on time!
                  </Message.Header>

                  <Divider />

                  <p>
                    Please click &quot;Refund&quot; below to get your money
                    back.
                    <br />
                    All money ({contract.value} {accountBalance.symbol}) will be
                    send to your wallet immediately.
                  </p>
                </Message.Content>
              </Message>

              <ExecuteBlockchainTransactionButton
                content="Refund"
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
                  At this moment we are waiting for the contractor to deliver
                  result.
                </p>

                <p>
                  Contractor has about{' '}
                  {toDaysMinutesSeconds(contract.remainingTimeToDeliverResult) +
                    ' '}
                  to update contract status. Expected date:{' '}
                  {formatDateTime(contract.resultShouldBeDeliveredBefore)}.
                  <br />
                  If work result will not be delivered on time, you will be able
                  to refund your money.
                </p>

                <Divider />

                <p>
                  Also you are able to approve contract before getting delivered
                  result.
                  <br />
                  Right after this contractor will be able to withdraw money.
                </p>

                <b>
                  You will not be able to refund money if you approve this
                  contract at this step! Think twice please.
                </b>
              </WhatIsNextMessage>

              <ExecuteBlockchainTransactionButton
                content="I understand and I want to approve the contract"
                icon="check"
                onClick={approveContract}
                floated="right"
              />
            </>
          ) : (
            <>
              <Message icon>
                <Icon name="ban" />

                <Message.Content>
                  <Message.Header>
                    Contractor did not deliver result on time!
                  </Message.Header>

                  <Divider />

                  <p>
                    Please click &quot;Refund&quot; below to get your money
                    back.
                    <br />
                    All money ({contract.value} {accountBalance.symbol}) will be
                    send to your wallet immediately.
                  </p>
                </Message.Content>
              </Message>

              <ExecuteBlockchainTransactionButton
                content="Refund"
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
              <Message.Header>
                Wow! It looks like your contractor has delivered result on time!
              </Message.Header>

              <Divider />

              <p>Right now you have two options. Let us explain.</p>

              <p>
                You are able to approve delivered result and right after this
                contractor will be able to withdraw money. Please check: were
                all terms, conditions and requirements of the contract met? Do
                you have any questions, additional information or improvements
                have to be done in terms of this contract?
              </p>

              <b>
                You will not be able to refund money if you approve this
                contract!
              </b>

              <p>
                If you decide to decline contract, you will be able to refund
                your money and contractor will not get paid. Contract will be
                closed instantly.
              </p>
            </Message.Content>
          </Message>

          <ExecuteBlockchainTransactionButton
            content="Approve"
            icon="check"
            onClick={approveContract}
            positive
            floated="right"
          />

          <ExecuteBlockchainTransactionButton
            content="Decline"
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
              <Message.Header>Congratulations!</Message.Header>

              <Divider />

              <p>We hope you have enjoyed working with this freelancer!</p>

              <p>
                If you have any ideas on how to improve OptriSpace – feel free
                to contact us.
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
              <Message.Header>Your have declined this contract!</Message.Header>

              <Divider />

              <p>
                Please click &quot;Refund&quot; below to get your money back.
                <br />
                All money ({contract.value} {accountBalance.symbol}) will be
                send to your wallet immediately.
              </p>
            </Message.Content>
          </Message>

          <ExecuteBlockchainTransactionButton
            content="Refund"
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
              <Message.Header>Your refund has been processed!</Message.Header>

              <Divider />

              <p>
                We hope you will enjoy working with this freelancer next time!
              </p>

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
          <Header as="h3">Bored Information</Header>

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
        />
      </Grid.Column>
    </Grid>
  )
}
