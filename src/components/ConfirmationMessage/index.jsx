import React from 'react'
import { Button, Modal, Icon, Header } from 'semantic-ui-react'
import { FilterXSS } from 'xss'
import { XSS_WHITELIST } from '../../lib/xss'

export const ConfirmationMessage = ({ description, onClose, onConfirm }) => {
  return (
    <Modal closeIcon open={open} size={'tiny'} onClose={onClose}>
      <Header icon="warning sign" content="Warning" />
      <Modal.Content>
        <Modal.Description
          dangerouslySetInnerHTML={{
            __html: new FilterXSS(XSS_WHITELIST).process(description),
          }}
        />
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
