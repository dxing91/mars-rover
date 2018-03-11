import React from 'react'
import Enzyme, { mount, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai'
import Command from '../components/containers/Command'

Enzyme.configure({ adapter: new Adapter() });

describe('<Command />', () => {
  it('should handle moves correctly', () => {
    const wrapper = mount(<Command />)
    const input = '5 5\n1 2 N\nLMLMLMLMM\n3 3 E\nMMRMMRMRRM'
    wrapper.setState({input: input})
    wrapper.find('button').simulate('click')
    expect(wrapper.state().output).to.equal('1 3 N\n5 1 E\n')
  })

  it('should display an error if input is invalid', () => {
    const wrapper = mount(<Command />)
    const input = 'A5 5\n1 2 N\nLMLMLMLMM\n3 3 E\nMMRMMRMRRM'
    wrapper.setState({input: input})
    wrapper.find('button').simulate('click')
    expect(wrapper.state().error).to.equal('Invalid command string.')
  })
})
