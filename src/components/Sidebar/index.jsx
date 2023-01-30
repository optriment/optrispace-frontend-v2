import React from 'react'
import { List, Segment, Header } from 'semantic-ui-react'

export const Sidebar = () => {
  return (
    <>
      <Segment>
        <Segment basic>
          <Header as="h3" dividing>
            Our Core Features
          </Header>

          <List bulleted>
            <List.Item>No paperwork</List.Item>
            <List.Item>No middlemen</List.Item>
            <List.Item>No managers</List.Item>
            <List.Item>No third parties</List.Item>
            <List.Item>Fast & secure payments</List.Item>
            <List.Item>No platform fees</List.Item>
            <List.Item>Powered by Smart Contracts</List.Item>
            <List.Item>All of our code is open source</List.Item>
            <List.Item>All payments in crypto</List.Item>
            <List.Item>Born to work globally</List.Item>
          </List>
        </Segment>
      </Segment>
    </>
  )
}
