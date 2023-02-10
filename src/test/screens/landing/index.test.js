/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

/**
 * Example of how to call and test React page with components inside it
 * First we need to import these components with jest mock pointing to component location.
 * Then, use regular import from the library. Note: importing several components with {} doesn't work for some reason.
 * Before executing each test, mount the component, inside the beforeEach function
 * */

jest.mock(
  '../../../screens/landing',
  () =>
    ({ children }) =>
      children
)

jest.mock(
  'semantic-ui-react',
  () =>
    ({ children }) =>
      children
)

import '@testing-library/jest-dom'
import LandingScreen from '../../../screens/landing'
import Container from 'semantic-ui-react'
import Image from 'semantic-ui-react'
import Enzyme, { mount } from 'enzyme'
import Adapter from '@cfaester/enzyme-adapter-react-18'

jest.mock('@fluentui/react-component-ref')

Enzyme.configure({ adapter: new Adapter() })

describe('<LandingScreen />', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<LandingScreen />)
  })

  it('should render render Container component', () => {
    expect(wrapper.find(Container)).toBeTruthy()
  })

  it('should render render Image component', () => {
    expect(wrapper.find(Image)).toBeTruthy()
  })
})
