import { Button, Modal } from 'semantic-ui-react'
import useTranslation from 'next-translate/useTranslation'

export const UnsavedChangesDialog = ({ open, onNoClicked, onYesClicked }) => {
  const { t } = useTranslation('common')

  return (
    <Modal open={open} size="tiny">
      <Modal.Header content={t('components.unsaved_changes_dialog.header')} />
      <Modal.Content>
        <Modal.Description>
          <p>{t('components.unsaved_changes_dialog.description')}</p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content={t('components.unsaved_changes_dialog.negative_button')}
          onClick={onNoClicked}
          negative
        />
        <Button
          content={t('components.unsaved_changes_dialog.positive_button')}
          onClick={onYesClicked}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}
