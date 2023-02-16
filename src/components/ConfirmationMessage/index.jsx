import React from 'react'
import { Button, Modal, Header } from 'semantic-ui-react'

export const ConfirmationMessage = ({
  onClose,
  onConfirm,
  children,
  confirmationButtonContent = 'Continue',
}) => {
  return (
    <Modal closeIcon open size="tiny" onClose={onClose}>
      <Header icon="warning sign" content="Warning" />
      <Modal.Content>
        <Modal.Description>{children}</Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button secondary icon="remove" onClick={onClose} content="Close" />
        <Button
          icon="checkmark"
          positive
          onClick={onConfirm}
          content={confirmationButtonContent}
        />
      </Modal.Actions>
    </Modal>
  )
}
