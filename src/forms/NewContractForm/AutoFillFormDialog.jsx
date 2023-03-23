import { List, Button, Modal } from 'semantic-ui-react'
import useTranslation from 'next-translate/useTranslation'

export const AutoFillFormDialog = ({ open, onNoClicked, onYesClicked }) => {
  const { t } = useTranslation('common')

  return (
    <Modal open={open} size="small">
      <Modal.Header
        content={t('forms.contract_form.auto_fill_form_dialog.header')}
      />
      <Modal.Content>
        <Modal.Description>
          <p>{t('forms.contract_form.auto_fill_form_dialog.line1')}</p>

          <List bulleted>
            <List.Item
              content={t('forms.contract_form.auto_fill_form_dialog.line2')}
            />
            <List.Item
              content={t('forms.contract_form.auto_fill_form_dialog.line3')}
            />
          </List>

          <p>
            <b>{t('forms.contract_form.auto_fill_form_dialog.line4')}</b>
          </p>
        </Modal.Description>
      </Modal.Content>

      <Modal.Actions>
        <Button
          content={t(
            'forms.contract_form.auto_fill_form_dialog.negative_button'
          )}
          onClick={onNoClicked}
          negative
        />

        <Button
          content={t(
            'forms.contract_form.auto_fill_form_dialog.positive_button'
          )}
          onClick={onYesClicked}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}
