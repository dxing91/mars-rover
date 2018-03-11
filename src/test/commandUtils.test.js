import { isValidInput, parseInput, stringifyOutput, changeDirection, moveForward } from '../utils/command'
import { expect } from 'chai'

describe('isValidInput', () => {
  it('should pass valid inputs', () => {
    const validInput1 = '5 5\n1 2 N\nLMLMLMLMM\n3 3 E\nMMRMMRMRRM'
    const validInput2 = '7 10\n4 2 E\nMMLRMRRML'
    const validInput3 = '20 8\n13 6 S\nLLRLLRLMMRMRML\n5 2 W\nMMLRMRRML\n4 8 S\nMMMMRMMMLRRMM'
    const validInput4 = '300 500\n13 6 S\nLLRLLRLMMRMRML\n0 2 W\nMMLRMRRML\n4 8 S\nMMMMRMMMLRRMM'

    expect(isValidInput(validInput1)).to.be.true
    expect(isValidInput(validInput2)).to.be.true
    expect(isValidInput(validInput3)).to.be.true
    expect(isValidInput(validInput4)).to.be.true
  })

  it('should fail if canvas size command has invalid syntax or dimensions', () => {
    const invalidCanvasCommand1 = '-1 -1\n1 2 N\nLMLMLMLMM\n3 3 E\nMMRMMRMRRM'
    const invalidCanvasCommand2 = '-5 5\n1 2 N\nLMLMLMLMM\n3 3 E\nMMRMMRMRRM'
    const invalidCanvasCommand3 = '5 -5\n1 2 N\nLMLMLMLMM\n3 3 E\nMMRMMRMRRM'
    const invalidCanvasCommand4 = 'N 5\n1 2 N\nLMLMLMLMM\n3 3 E\nMMRMMRMRRM'
    const invalidCanvasCommand5 = '5\n1 2 N\nLMLMLMLMM\n3 3 E\nMMRMMRMRRM'
    const invalidCanvasCommand6 = 'P\n1 2 N\nLMLMLMLMM\n3 3 E\nMMRMMRMRRM'
    const invalidCanvasCommand7 = '0 0\n1 2 N\nLMLMLMLMM\n3 3 E\nMMRMMRMRRM'

    expect(isValidInput(invalidCanvasCommand1)).to.be.false
    expect(isValidInput(invalidCanvasCommand2)).to.be.false
    expect(isValidInput(invalidCanvasCommand3)).to.be.false
    expect(isValidInput(invalidCanvasCommand4)).to.be.false
    expect(isValidInput(invalidCanvasCommand5)).to.be.false
    expect(isValidInput(invalidCanvasCommand6)).to.be.false
    expect(isValidInput(invalidCanvasCommand7)).to.be.false
  })

  it('should fail if canvas size command is missing', () => {
    const missingCanvasCommand = '1 2 N\nLMLMLMLMM\n3 3 E\nMMRMMRMRRM'

    expect(isValidInput(missingCanvasCommand)).to.be.false
  })

  it('should fail if rover commands have invalid syntax, positioning or moves', () => {
    const invalidRoverCommands1 = '5 5\n1 2 Q\nLMLMLMLMM'
    const invalidRoverCommands2 = '5 5\n-1 2 N\nLMLMLMLMM'
    const invalidRoverCommands3 = '5 5\n1 -2 N\nLMLMLMLMM'
    const invalidRoverCommands4 = '5 5\n1 2 R\nPLMLMLMLMM'
    const invalidRoverCommands5 = '5 5\n1 2 N\n3LMLMLMLMM'

    expect(isValidInput(invalidRoverCommands1)).to.be.false
    expect(isValidInput(invalidRoverCommands2)).to.be.false
    expect(isValidInput(invalidRoverCommands3)).to.be.false
    expect(isValidInput(invalidRoverCommands4)).to.be.false
    expect(isValidInput(invalidRoverCommands5)).to.be.false
  })

  it('should fail if whole command has any invalid syntax', () => {
    const invalidSyntax1 = '5 5 \n1 2 N\nLMLMLMLMM\n3 3 E\nMMRMMRMRRM'
    const invalidSyntax2 = '5 5\n 1 2 N\nLMLMLMLMM\n3 3 E\nMMRMMRMRRM'
    const invalidSyntax3 = '5 5\n1 2 N\n LMLMLMLMM\n3 3 E\nMMRMMRMRRM'
    const invalidSyntax4 = '5 5\n1 2 N\nLMLMLMLMM\n3 3 E'
    const invalidSyntax5 = '5 5\n\n1 2 N\nLMLMLMLMM\n3 3 E\nMMRMMRMRRM'

    expect(isValidInput(invalidSyntax1)).to.be.false
    expect(isValidInput(invalidSyntax2)).to.be.false
    expect(isValidInput(invalidSyntax3)).to.be.false
    expect(isValidInput(invalidSyntax4)).to.be.false
    expect(isValidInput(invalidSyntax5)).to.be.false
  })

  it('should fail if rovers are placed outside of the specified canvas size', () => {
    const invalidRoverPosition1 = '5 5\n7 9 N\nLMLMLMLMM\n3 3 E\nMMRMMRMRRM'
    const invalidRoverPosition2 = '3 5\n6 2 N\nLMLMLMLMM\n3 3 E\nMMRMMRMRRM'
    const invalidRoverPosition3 = '5 6\n1 2 N\nLMLMLMLMM\n1 8 E\nMMRMMRMRRM'
    
    expect(isValidInput(invalidRoverPosition1)).to.be.false
    expect(isValidInput(invalidRoverPosition2)).to.be.false
    expect(isValidInput(invalidRoverPosition3)).to.be.false
  })
})

describe('parseInput', () => {
  it('should parse command string into data objects correctly', () => {
    const input = '5 5\n1 2 N\nLMLMLMLMM\n3 3 E\nMMRMMRMRRM'
    const expectedOutput = {
      canvasSize: { x: 5, y: 5 },
      rovers: [
        { position: { x: 1, y: 2 }, direction: 'N', moves: 'LMLMLMLMM' },
        { position: { x: 3, y: 3 }, direction: 'E', moves: 'MMRMMRMRRM' }
      ]
    }

    expect(parseInput(input)).to.deep.equal(expectedOutput)
  })
})

describe('stringifyOutput', () => {
  it('should stringify data objects into output string correctly', () => {
    const input = [
      { position: { x: 1, y: 2 }, direction: 'N', moves: 'LMLMLMLMM' },
      { position: { x: 3, y: 3 }, direction: 'E', moves: 'MMRMMRMRRM' }
    ]
    const expectedOutput = '1 2 N\n3 3 E\n'

    expect(stringifyOutput(input)).to.equal(expectedOutput)
  })
})

describe('changeDirection', () => {
  it('should handle direction changes correctly', () => {
    expect(changeDirection('N', 'R')).to.equal('E')
    expect(changeDirection('N', 'L')).to.equal('W')
    expect(changeDirection('E', 'R')).to.equal('S')
    expect(changeDirection('E', 'L')).to.equal('N')
    expect(changeDirection('S', 'R')).to.equal('W')
    expect(changeDirection('S', 'L')).to.equal('E')
    expect(changeDirection('W', 'R')).to.equal('N')
    expect(changeDirection('W', 'L')).to.equal('S')
  })
})

describe('moveForward', () => {
  it('should handle movement correctly if within canvas', () => {
    const currentXY = { x: 1, y: 1 }
    const constraintsXY = { x: 2, y: 2 }

    expect(moveForward(currentXY, constraintsXY, 'N')).to.deep.equal({x: 1, y: 2})
    expect(moveForward(currentXY, constraintsXY, 'E')).to.deep.equal({x: 2, y: 1})
    expect(moveForward(currentXY, constraintsXY, 'S')).to.deep.equal({x: 1, y: 0})
    expect(moveForward(currentXY, constraintsXY, 'W')).to.deep.equal({x: 0, y: 1})
  })

  it('should prevent movement if move exceeds canvas size', () => {
    const constraintsXY = { x: 2, y: 2 }

    expect(moveForward({x: 2, y: 2}, constraintsXY, 'N')).to.deep.equal({x: 2, y: 2})
    expect(moveForward({x: 2, y: 2}, constraintsXY, 'E')).to.deep.equal({x: 2, y: 2})
    expect(moveForward({x: 0, y: 0}, constraintsXY, 'S')).to.deep.equal({x: 0, y: 0})
    expect(moveForward({x: 0, y: 0}, constraintsXY, 'W')).to.deep.equal({x: 0, y: 0})
  })
})
