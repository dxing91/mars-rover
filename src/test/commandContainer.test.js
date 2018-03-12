import React from 'react'
import Enzyme, { mount, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai'
import Command from '../components/containers/Command'

Enzyme.configure({ adapter: new Adapter() });

describe('<Command />', () => {
  it('should handle moves correctly', () => {
    const wrapper = mount(<Command />)
    const canvasSize = { x: 5, y: 5 }
    const rovers = [
      { position: { x: 1, y: 2 }, direction: 'N', moves: 'LMLMLMLMM' },
      { position: { x: 3, y: 3 }, direction: 'E', moves: 'MMRMMRMRRM' }
    ]
    wrapper.setState({canvasSize: canvasSize, rovers: rovers})
    wrapper.instance().handleMoves()
    expect(wrapper.state().output).to.equal('1 3 N\n5 1 E\n')
  })

  it('should take a valid input string and produce expected output string', () => {
    const wrapper = mount(<Command />)
    const input = '5 5\n1 2 N\nLMLMLMLMM\n3 3 E\nMMRMMRMRRM'
    wrapper.find('#input').simulate('change', {target: {value: input}})
    wrapper.find('#submit').simulate('click')
    expect(wrapper.find('#output').instance().value).to.equal('1 3 N\n5 1 E\n')
  })

  it('should display an error if input string is invalid', () => {
    const wrapper = mount(<Command />)
    const input = 'A5 5\n1 2 N\nLMLMLMLMM\n3 3 E\nMMRMMRMRRM'
    wrapper.find('#input').simulate('change', {target: {value: input}})
    wrapper.find('#submit').simulate('click')
    expect(wrapper.find('.command__error').exists()).to.be.true
  })
})
