import React from 'react'
import { Form, Segment, Header } from 'semantic-ui-react'

export const ContractsSidebar = ({ as }) => {
  return (
    <Segment>
      <Segment basic>
        <Header as="h3" dividing content="Filters" />

        <Form>
          <Form.Select fluid label="Status:" placeholder="All" disabled />

          <Form.Select fluid label="Job:" placeholder="All" disabled />

          <Form.Select
            fluid
            label={as === 'customer' ? 'Freelancer:' : 'Customer:'}
            placeholder="All"
            disabled
          />

          <Form.Checkbox label="Action Required" disabled />

          <Form.Button content="Reset" disabled />
        </Form>
      </Segment>
    </Segment>
  )
}
