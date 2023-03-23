import React from 'react'
import { Button, Modal, Header } from 'semantic-ui-react'
import useTranslation from 'next-translate/useTranslation'

export const ConfirmationMessage = ({
  onClose,
  onConfirm,
  children,
  confirmationButtonContent,
  confirmationButtonPositive = true,
  confirmationButtonNegative = false,
}) => {
  const { t } = useTranslation('common')

  return (
    <Modal closeIcon open size="tiny" onClose={onClose}>
      <Header
        icon="warning sign"
        content={t('components.confirmation_message.header')}
      />
      <Modal.Content>
        <Modal.Description>{children}</Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          secondary
          onClick={onClose}
          content={t('components.confirmation_message.close_button')}
        />
        <Button
          positive={confirmationButtonPositive}
          negative={confirmationButtonNegative}
          onClick={onConfirm}
          content={confirmationButtonContent}
        />
      </Modal.Actions>
    </Modal>
  )
}
