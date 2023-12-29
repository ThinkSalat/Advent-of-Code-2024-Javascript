/**
 * Contains solutions for Day 6
 * Puzzle Description: https://adventofcode.com/2023/day/6
 */

const getNumSolutions = (time, distance) => {
  const discriminant = time * time - 4 * distance;

  const sqrtDiscriminant = Math.sqrt(discriminant);

  // Calculate the floor and ceiling values
  const floorValue = Math.floor((-time + sqrtDiscriminant) / 2);
  const ceilValue = Math.ceil((-time - sqrtDiscriminant) / 2);

  // Calculate the number of solutions within the valid range
  const numSolutions = Math.min(floorValue, time - 1) - ceilValue + 1

  return Math.abs(numSolutions);
}

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ input, lines }) => {
  // lines = ['Time:      7  15   30', 'Distance:  9  40  200']
  const times = lines[0].match(/\d+/g)
  const distance = lines[1].match(/\d+/g)

  let product = 1
  times.forEach((time, i) => {
    product *= getNumSolutions(time, distance[i])
  })

  return product
};

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = ({ input, lines }) => {
  const time = +lines[0].replaceAll(' ', '').split(':')[1]
  const distance = +lines[1].replaceAll(' ', '').split(':')[1]

  return getNumSolutions(time, distance)
};
