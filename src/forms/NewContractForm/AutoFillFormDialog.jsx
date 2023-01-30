import { List, Button, Modal } from 'semantic-ui-react'

export const AutoFillFormDialog = ({ open, onNoClicked, onYesClicked }) => {
  return (
    <Modal open={open} size="small">
      <Modal.Header>
        Do you want to fill all fields in this form automatically?
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p>
            We can collect all required information from your job card and
            applicant&apos;s application and fill this form.
          </p>

          <List bulleted>
            <List.Item>
              Title and description will be loaded from job form
            </List.Item>

            <List.Item>
              Contract price we will get from applicant&apos; application.
            </List.Item>
          </List>

          <p>
            <b>Do you want to proceed?</b>
          </p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content="No, I'll do it manually"
          onClick={onNoClicked}
          negative
        />

        <Button content="Yes, please fill" onClick={onYesClicked} positive />
      </Modal.Actions>
    </Modal>
  )
}
