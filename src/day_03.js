/**
 * Contains solutions for Day 3
 * Puzzle Description: https://adventofcode.com/2023/day/3
 */

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ input, lines }) => {

  const symbols = new Set(['*', '#', '-', '+', '@', '%', '&', '=', '$', '/'])
  const numbers = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'])
  let sum = 0;

  const checkForAdjacentSymbols = (i, j) => {

    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        if (symbols.has(lines[i + x]?.[j + y])) {
          return true
        }
      }
    }

    return false
  }

  // walk through lines with two indexes,i and j, which will be what grabs the number
  // for each digit, check if any of the surrounding characters is a symbol.
  // Will keep a bool that tracks if a number has adjacent symbols or not.
  // adds to the sum if the bool is true when it reaches the next character that isn't a number, or the end of the line
  // If the number is already adjacent, can skip checking for adjacent symbols.

  let adjacentSymbol = false;

  // I think this doesn't need the nested loops, probably just a way to maintain the first index of the current number
  lines.forEach((line, colIdx) => {
    for (let i = 0; i < line.length; i++) {
      // Only continue into j loop if in a number
      if (!numbers.has(line[i])) {
        continue;
      }

      // Check if the first digit is adjacent to a symbol
      if (checkForAdjacentSymbols(colIdx, i)) {
        adjacentSymbol = true
      }

      // Allow 1 past last index because slice is not inclusive
      for (let j = i + 1; j < line.length + 1; j++) {

        // assume number. If not, add the number to the sum if we found a symbol adjacent to one of the digits
        if (!numbers.has(line[j])) {
          if (adjacentSymbol) {
            sum += Number(line.slice(i, j))
          }

          // if we've reached the end of the number, we need to break out of this inner loop
          // we also want to set i equal to j
          i = j;
          adjacentSymbol = false;
          break;
          // Only check for adjacent symbols if we're still on numbers
        } else if (!adjacentSymbol && checkForAdjacentSymbols(colIdx, j)) {
          adjacentSymbol = true
        }
      }

    }

  })

  return sum
};

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = ({ input, lines }) => {

  let sum = 0
  const gearCoordinates = {}
  let adjacentGearCoordinates = new Set()

  const getAdjacentGearCoordinates = (colIdx, rowIdx) => {
    const coords = []
    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        if (lines[colIdx + x]?.[rowIdx + y] === '*') {
          coords.push(`${colIdx + x},${rowIdx + y}`)
        }
      }
    }
    return coords
  }

  //I think this time it'll be best to avoid the nested for loops and instead just do a single loop and keep track of startingIndex.
  lines.forEach( (line, colIdx) => {
    let numFirstIdx = null

    // Needs to extend one past last index of the line because slice is not inclusive.
    for (let rowIdx = 0; rowIdx < line.length + 1; rowIdx++) {
      if (isNaN(line[rowIdx])) {
        if (numFirstIdx !== null) {
          // reached last digit of number. Add to gearCoords and stuff
          adjacentGearCoordinates.forEach( coords => {
            gearCoordinates[coords] ||= {}
            gearCoordinates[coords][`${colIdx},${numFirstIdx}`] = Number(line.slice(numFirstIdx, rowIdx))
          })
          // reset adjacent gears
          adjacentGearCoordinates = new Set()
          numFirstIdx = null;

        }

        continue;
      } else {
        if (numFirstIdx === null) {
          numFirstIdx = rowIdx
        }
        adjacentGearCoordinates = new Set([...adjacentGearCoordinates, ...getAdjacentGearCoordinates(colIdx, rowIdx)])
      }
    }
  })

  Object.entries(gearCoordinates).forEach( ([_gearCoordinates, adjacentNumbers]) => {
    const numbers = Object.values(adjacentNumbers)
    if (numbers.length === 2){
      sum += numbers[0] * numbers[1]
    }
  })

  return sum
};
