import { Message, List } from 'semantic-ui-react'
import useTranslation from 'next-translate/useTranslation'

export const ValidationErrors = ({ errors }) => {
  const { t } = useTranslation('common')

  return (
    <Message warning>
      <Message.Header content={t('errors.template.body')} />

      <List bulleted>
        {errors.map((e, index) => {
          return <List.Item key={index}>{e}</List.Item>
        })}
      </List>
    </Message>
  )
}
