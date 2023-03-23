import React from 'react'
import { Button, Divider, Message, Icon } from 'semantic-ui-react'
import useTranslation from 'next-translate/useTranslation'

export const WrongBlockchainNetwork = ({
  blockchainNetworkName,
  switchNetwork,
}) => {
  const { t } = useTranslation('common')

  return (
    <Message warning icon>
      <Icon name="warning sign" />

      <Message.Content>
        <Message.Header
          content={t('components.wrong_blockchain_network.header')}
        />

        <Divider />

        <p>
          {t('components.wrong_blockchain_network.our_platform_uses', {
            blockchainNetworkName: blockchainNetworkName,
          })}
          <br />
          {t('components.wrong_blockchain_network.connect_to_valid_network')}
        </p>

        <Divider />

        <Button primary onClick={() => switchNetwork()}>
          {t('components.wrong_blockchain_network.switch_network', {
            blockchainNetworkName: blockchainNetworkName,
          })}
        </Button>
      </Message.Content>
    </Message>
  )
}
