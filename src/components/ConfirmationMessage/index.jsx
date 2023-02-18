import React from 'react'
import { Button, Modal, Header } from 'semantic-ui-react'

export const ConfirmationMessage = ({
  onClose,
  onConfirm,
  children,
  confirmationButtonContent = 'Continue',
  confirmationButtonPositive = true,
  confirmationButtonNegative = false,
}) => {
  return (
    <Modal closeIcon open size="tiny" onClose={onClose}>
      <Header icon="warning sign" content="Warning" />
      <Modal.Content>
        <Modal.Description>{children}</Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button secondary onClick={onClose} content="Close" />
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
