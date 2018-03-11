import React, { Component } from 'react'
import Command from './Command'

export default class App extends Component {
  render() {
    return (
      <div className='app'>
        <div className='header'>
          <h1 className='header__heading'>Mars Rover</h1>
        </div>
        <Command />
      </div>
    )
  }
}
