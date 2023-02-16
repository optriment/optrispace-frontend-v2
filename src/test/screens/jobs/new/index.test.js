/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

/**
 * Example of how to call and test React page with components inside it
 * Also has some examples of passing props to components
 * First we need to import these components with jest mock pointing to component location.
 * Then, use regular import from the library. Note: importing several components with {} doesn't work for some reason.
 * Before executing each test, mount the component, inside the beforeEach function
 * */

jest.mock(
  '../../../../screens/jobs/new',
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

jest.mock(
  '../../../../components/InsufficientBalance',
  () =>
    ({ children }) =>
      children
)

jest.mock(
  '../../../../forms/NewJobForm',
  () =>
    ({ children }) =>
      children
)

import '@testing-library/jest-dom'

import NewJobScreen from '../../../../screens/jobs/new'
import Grid from 'semantic-ui-react'
import Enzyme, { mount, shallow } from 'enzyme'
import Adapter from '@cfaester/enzyme-adapter-react-18'
import InsufficientBalance from '../../../../components/InsufficientBalance'
jest.mock('@fluentui/react-component-ref')

Enzyme.configure({ adapter: new Adapter() })

describe('<NewJobScreen />', () => {
  let wrapper

  const props = {
    currentAccount: 'test',
    accountBalance: 4,
  }

  it('should render render omponent', () => {
    wrapper = mount(
      <NewJobScreen currentAccount={'testAccount'} accountBalance={3} />
    )
    expect(wrapper).toBeTruthy()
  })

  it('should render render Grid component', () => {
    wrapper = mount(
      <NewJobScreen currentAccount={'testAccount'} accountBalance={3} />
    )
    expect(wrapper.find(Grid)).toBeTruthy()
  })

  it('should render insufficients funds component', () => {
    wrapper = mount(
      <NewJobScreen currentAccount={'testAccount'} accountBalance={0} />
    )

    expect(wrapper.find(InsufficientBalance)).toBeTruthy()
  })
})
