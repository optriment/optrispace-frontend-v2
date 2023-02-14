import { Message, List } from 'semantic-ui-react'

export const ValidationErrors = ({ errors }) => {
  return (
    <Message warning>
      <Message.Header>Please fill in the form correctly:</Message.Header>

      <List bulleted>
        {errors.map((e, index) => {
          return <List.Item key={index}>{e}</List.Item>
        })}
      </List>
    </Message>
  )
}
