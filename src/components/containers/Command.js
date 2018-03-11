import React, { Component } from 'react'
import CommandUI from '../ui/CommandUI'
import { isValidInput, parseInput, stringifyOutput, changeDirection, moveForward } from '../../utils/command'

export default class Command extends Component {
  constructor(props) {
    super(props)
    this.state = {
      input: '',
      output: '',
      canvasSize: { x: 0, y: 0 },
      rovers: [],
      error: null
    }
  }

  handleMoves() {
    this.state.rovers.forEach(rover => {
      for (let i = 0, length = rover.moves.length; i < length; i++) {
        const move = rover.moves[i]
        switch (move) {
          case 'L':
          case 'R':
            rover.direction = changeDirection(rover.direction, move)
            break
          case 'M':
            rover.position = moveForward(rover.position, this.state.canvasSize, rover.direction)
            break
          default:
            break
        }
      }
    })
    this.setState({output: stringifyOutput(this.state.rovers)})
  }

  onInputChange = (e) => {
    this.setState({input: e.target.value, output: ''})
  }

  onSubmit = (e) => {
    e.preventDefault()
    this.setState({error: null})

    const input = this.state.input
    if (!input) {
      this.setState({error: 'Please input commands.'})
      return
    } else if (!isValidInput(input)) {
      this.setState({error: 'Invalid command string.'})
      return
    }

    const { canvasSize, rovers } = parseInput(input)
    this.setState({canvasSize: canvasSize, rovers: rovers}, () => {
      this.handleMoves()
    })
  }

  render() {
    return (
      <CommandUI
        input={this.state.input}
        output={this.state.output}
        onInputChange={this.onInputChange}
        onSubmit={this.onSubmit}
        error={this.state.error} />
    )
  }
}
