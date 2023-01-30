import React from 'react'
import { Form, Segment, Header } from 'semantic-ui-react'

export const JobsSidebar = () => {
  return (
    <Segment>
      <Segment basic>
        <Header as="h3" dividing content="Filters" />

        <Form>
          <Form.Select fluid label="Category:" placeholder="All" disabled />

          <Form.Select fluid label="Applications:" placeholder="All" disabled />

          <Form.Select fluid label="Budget:" placeholder="All" disabled />

          <Form.Button content="Reset" disabled />
        </Form>
      </Segment>
    </Segment>
  )
}
