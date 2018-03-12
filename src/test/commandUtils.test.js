import { isValidInput, isValidCanvasCommand, isValidRoverCommands,
  isValidRoverPositions, parseInput, stringifyOutput,
  changeDirection, moveForward } from '../utils/command'
import { expect } from 'chai'

describe('Command Utils', () => {
  describe('isValidInput', () => {
    it('should pass if valid input is given "5 5\\n1 2 N\\nLMLMLMLMM\\n3 3 E\\nMMRMMRMRRM"', () => {
      const input = '5 5\n1 2 N\nLMLMLMLMM\n3 3 E\nMMRMMRMRRM'
      expect(isValidInput(input)).to.be.true
    })

    it('should fail if canvas size command is not given', () => {
      const input = '\n1 2 N\nLMLMLMLMM\n3 3 E\nMMRMMRMRRM'
      expect(isValidInput(input)).to.be.false
    })

    it('should fail if rover commands are invalid', () => {
      const input1 = '5 5\n-1 2 N\nLMLMLMLMM'
      expect(isValidInput(input1)).to.be.false

      const input2 = '5 5\n1 2 Q\nLMLMLMLMM'
      expect(isValidInput(input2)).to.be.false

      const input3 = '5 5\n1 2 N\nALMLMLMLMM'
      expect(isValidInput(input3)).to.be.false
    })

    it('should fail if rover placements are invalid', () => {
      const input1 = '5 5\n6 2 N\nLMLMLMLMM'
      expect(isValidInput(input1)).to.be.false

      const input2 = '5 5\n2 6 N\nLMLMLMLMM'
      expect(isValidInput(input2)).to.be.false
    })

    describe ('isValidCanvasCommand', () => {
      it('should pass valid canvas command "5 5"', () => {
        const input = '5 5'
        expect(isValidCanvasCommand(input)).to.be.true
      })

      it('should pass valid canvas command "10 13"', () => {
        const input = '10 13'
        expect(isValidCanvasCommand(input)).to.be.true        
      })

      it('should pass valid canvas command "12 9"', () => {
        const input = '12 9'
        expect(isValidCanvasCommand(input)).to.be.true
      })

      it('should fail empty canvas command ""', () => {
        const input = ''
        expect(isValidCanvasCommand(input)).to.be.false
      })

      it('should fail invalid canvas size of "0 0"', () => {
        const input = '0 0'
        expect(isValidCanvasCommand(input)).to.be.false
      })

      it('should fail if invalid negative canvas width is given "-1 1"', () => {
        const input = '-1 1'
        expect(isValidCanvasCommand(input)).to.be.false
      })

      it('should fail if invalid negative canvas height is given "1 -1"', () => {
        const input = '1 -1'
        expect(isValidCanvasCommand(input)).to.be.false
      })

      it('should fail if invalid negative canvas width and height are given "-1 -1"', () => {
        const input = '-1 -1'
        expect(isValidCanvasCommand(input)).to.be.false
      })

      it('should fail if invalid dimensions given "A A"', () => {
        const input = 'A A'
        expect(isValidCanvasCommand(input)).to.be.false
      })

      it('should fail if only one dimension is given "1"', () => {
        const input = '1'
        expect(isValidCanvasCommand(input)).to.be.false
      })

      it('should fail if extra whitespace is present "5 5 "', () => {
        const input = '5 5 '
        expect(isValidCanvasCommand(input)).to.be.false
      })

      it('should fail if invalid character is given "5 #"', () => {
        const input = '5 #'
        expect(isValidCanvasCommand(input)).to.be.false
      })
    })

    describe ('isValidRoverCommands', () => {
      it('should pass valid rover command ["1 2 N", "LRM"]', () => {
        const input = ['1 2 N', 'LRM']
        expect(isValidRoverCommands(input)).to.be.true
      })

      it('should pass valid rover command ["0 0 N", "LRM"]', () => {
        const input = ['0 0 N', 'LRM']
        expect(isValidRoverCommands(input)).to.be.true
      })

      it('should fail if starting position command is missing ["", "LRM"]', () => {
        const input = ['', 'LRM']
        expect(isValidRoverCommands(input)).to.be.false
      })

      it('should pass even if movements command string is empty ["1 1 N", ""]', () => {
        const input = ['1 1 N', '']
        expect(isValidRoverCommands(input)).to.be.true
      })

      it('should pass valid command with more than one set of rovers ["1 1 N", "LLLL", "1 1 N", "LLLL"]', () => {
        const input = ['1 1 N', 'LLLL', '1 1 N', 'LLLL']
        expect(isValidRoverCommands(input)).to.be.true
      })

      it('should pass all directions ["1 1 N", "LLLL", "1 1 E", "LLLL", "1 1 S", "LLLL", "1 1 W", "LLLL"]', () => {
        const input = ['1 1 N', 'LLLL', '1 1 E', 'LLLL', '1 1 S', 'LLLL', '1 1 W', 'LLLL']
        expect(isValidRoverCommands(input)).to.be.true
      })

      it('should pass all movement commands L, R, M ["1 1 N", "LLLL", "1 1 N", "RRRR", "1 1 N", "MMMM", "1 1 N", "LRM"]', () => {
        const input = ['1 1 N', 'LLLL', '1 1 N', 'RRRR', '1 1 N', 'MMMM', '1 1 W', 'LRM']
        expect(isValidRoverCommands(input)).to.be.true
      })

      it('should fail invalid starting position ["-1 1 N", "LRM"]', () => {
        const input = ['-1 1 N', 'LRM']
        expect(isValidRoverCommands(input)).to.be.false
      })

      it('should fail invalid start position ["1 -1 N", "LRM"]', () => {
        const input = ['1 -1 N', 'LRM']
        expect(isValidRoverCommands(input)).to.be.false
      })

      it('should fail invalid start position ["1 1 A", "LRM"]', () => {
        const input = ['1 1 A', 'LRM']
        expect(isValidRoverCommands(input)).to.be.false
      })

      it('should fail invalid movement commands ["1 1 N", "ALRM"]', () => {
        const input = ['1 1 N', 'ALRM']
        expect(isValidRoverCommands(input)).to.be.false
      })
    })

    describe ('isValidRoverPositions', () => {
      it('should pass if all rovers are placed within canvas constraints', () => {
        const canvasSizeCommandString = '5 5'

        const roverCommandStrings1 = '1 1 E\nLRM'
        expect(isValidRoverPositions(canvasSizeCommandString, roverCommandStrings1)).to.be.true

        const roverCommandStrings2 = '0 5 N\nLRM'
        expect(isValidRoverPositions(canvasSizeCommandString, roverCommandStrings2)).to.be.true

        const roverCommandStrings3 = '5 0 N\nLRM'
        expect(isValidRoverPositions(canvasSizeCommandString, roverCommandStrings3)).to.be.true

        const roverCommandStrings4 = '5 5 W\nLRM'
        expect(isValidRoverPositions(canvasSizeCommandString, roverCommandStrings4)).to.be.true

        const roverCommandStrings5 = '0 0 N\nLRM'
        expect(isValidRoverPositions(canvasSizeCommandString, roverCommandStrings5)).to.be.true
      })

      it('should fail if any rover is placed outside of canvas constraints', () => {
        const canvasSizeCommandString = '5 5'
        const roverCommandStrings = '6 5 E\nLRM\n3 4 N\nLRM\n5 5 W\nLRM\n0 0 N\nLRM'
        expect(isValidRoverPositions(canvasSizeCommandString, roverCommandStrings)).to.be.false
      })

      it('should validate multiple rover placements', () => {
        const canvasSizeCommandString = '5 5'
        const roverCommandStrings = '1 5 E\nLRM\n3 4 N\nLRM\n5 5 W\nLRM\n0 0 N\nLRM'
        expect(isValidRoverPositions(canvasSizeCommandString, roverCommandStrings)).to.be.true
      })
    })
  })

  describe('parseInput', () => {
    it('should parse a valid command string into the expected data object', () => {
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
    it('should stringify valid data object into expected output string', () => {
      const input = [
        { position: { x: 1, y: 2 }, direction: 'N', moves: 'LMLMLMLMM' },
        { position: { x: 3, y: 3 }, direction: 'E', moves: 'MMRMMRMRRM' }
      ]
      const expectedOutput = '1 2 N\n3 3 E\n'
  
      expect(stringifyOutput(input)).to.equal(expectedOutput)
    })
  })

  describe('changeDirection', () => {
    it('should handle all direction changes correctly', () => {
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
    it('should handle forward moves correctly if within canvas constraints', () => {
      const currentXY = { x: 1, y: 1 }
      const constraintsXY = { x: 2, y: 2 }
  
      expect(moveForward(currentXY, constraintsXY, 'N')).to.deep.equal({x: 1, y: 2})
      expect(moveForward(currentXY, constraintsXY, 'E')).to.deep.equal({x: 2, y: 1})
      expect(moveForward(currentXY, constraintsXY, 'S')).to.deep.equal({x: 1, y: 0})
      expect(moveForward(currentXY, constraintsXY, 'W')).to.deep.equal({x: 0, y: 1})
    })
  
    it('should remain in the same position if move would exceed canvas constraints', () => {
      const constraintsXY = { x: 2, y: 2 }
  
      expect(moveForward({x: 2, y: 2}, constraintsXY, 'N')).to.deep.equal({x: 2, y: 2})
      expect(moveForward({x: 2, y: 2}, constraintsXY, 'E')).to.deep.equal({x: 2, y: 2})
      expect(moveForward({x: 0, y: 0}, constraintsXY, 'S')).to.deep.equal({x: 0, y: 0})
      expect(moveForward({x: 0, y: 0}, constraintsXY, 'W')).to.deep.equal({x: 0, y: 0})
    })
  })
})
