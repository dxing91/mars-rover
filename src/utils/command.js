export function isValidInput(input) {
  const commandsArray = input.split('\n')
  const [canvasSizeCommandString, ...roverCommandStrings] = commandsArray

  return isValidCanvasCommand(canvasSizeCommandString)
    && isValidRoverCommands(roverCommandStrings)
    && isValidRoverPositions(canvasSizeCommandString, roverCommandStrings)
}

function isValidCanvasCommand(canvasSizeCommandString) {
  const canvasSizeRegex = /^[1-9]\d* [1-9]\d*$/
  return canvasSizeRegex.test(canvasSizeCommandString)
}

function isValidRoverCommands(roverCommandStrings) {
  const roverPositionRegex = /^\d+ \d+ (N|E|W|S)$/
  const roverMovesRegex = /^(L|R|M)+$/
  for (let i = 0, length = roverCommandStrings.length; i < length; i = i + 2) {
    if (!roverPositionRegex.test(roverCommandStrings[i]) || !roverMovesRegex.test(roverCommandStrings[i + 1])) {
      return false
    }
  }
  return true
}

function isValidRoverPositions(canvasSizeCommandString, roverCommandStrings) {
  const [ constraintX, constraintY ] = canvasSizeCommandString.split(' ').map(s => parseInt(s))
  for (let i = 0, length = roverCommandStrings.length; i < length; i = i + 2) {
    const [ roverX, roverY ] = roverCommandStrings[i].split(' ').slice(0, 2).map(s => parseInt(s))
    if (roverX > constraintX || roverX < 0 || roverY > constraintY || roverY < 0) {
      return false
    }
  }
  return true
}

export function parseInput(commandString) {
  const commandsArray = commandString.split('\n')
  const [canvasCommandString, ...roverCommandStrings] = commandsArray

  const canvasSizeArray = canvasCommandString.split(' ').map(s => parseInt(s))
  const canvasSize = { x: canvasSizeArray[0], y: canvasSizeArray[1] }

  const rovers = []
  for (let i = 0, length = roverCommandStrings.length; i < length; i = i + 2) {
    const start = roverCommandStrings[i].split(' ')
    rovers.push({
      position: { x: parseInt(start[0]), y: parseInt(start[1]) },
      direction: start[2],
      moves: roverCommandStrings[i + 1]
    })
  }

  return { canvasSize, rovers }
}

export function stringifyOutput(rovers) {
  return rovers.map(rover => `${rover.position.x} ${rover.position.y} ${rover.direction}\n`).join('')
}

export function changeDirection(currentDirection, turnDirection) {
  const directions = ['N', 'E', 'S', 'W']
  const currentIndex = directions.indexOf(currentDirection)

  switch (turnDirection) {
    case 'R':
      return currentIndex === 3 ? directions[0] : directions[currentIndex + 1]
    case 'L':
      return currentIndex === 0 ? directions[3] : directions[currentIndex - 1]
    default:
      return currentDirection
  }
}

export function moveForward(currentXY, constraintsXY, direction) {
  switch (direction) {
    case 'N':
      return currentXY.y + 1 > constraintsXY.y ? currentXY : { x: currentXY.x, y: currentXY.y + 1 }
    case 'E':
      return currentXY.x + 1 > constraintsXY.x ? currentXY : { x: currentXY.x + 1, y: currentXY.y }
    case 'S':
      return currentXY.y - 1 < 0 ? currentXY : { x: currentXY.x, y: currentXY.y - 1 }
    case 'W':
      return currentXY.x - 1 < 0 ? currentXY : { x: currentXY.x - 1, y: currentXY.y }
    default:
      return currentXY
  }
}
