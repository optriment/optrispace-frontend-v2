import React from 'react'
import { Button, Modal, Icon, Header } from 'semantic-ui-react'

export const ConfirmationMessage = ({ onClose, onConfirm, ...props }) => {
  return (
    <Modal closeIcon open={open} size={'tiny'} onClose={onClose}>
      <Header icon="warning sign" content="Warning" />
      <Modal.Content>
        <Modal.Description>{props.children}</Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={onClose}>
          <Icon name="remove" /> No
        </Button>
        <Button color="green" onClick={onConfirm}>
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  )
}
