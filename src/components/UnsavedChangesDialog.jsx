import { Button, Modal } from 'semantic-ui-react'

export const UnsavedChangesDialog = ({ open, onNoClicked, onYesClicked }) => {
  return (
    <Modal open={open} size="tiny">
      <Modal.Header>Unsaved changes were found!</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p>Do you want to recover this information?</p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button content="No, remove it" onClick={onNoClicked} negative />
        <Button content="Yes, please recover" onClick={onYesClicked} positive />
      </Modal.Actions>
    </Modal>
  )
}
