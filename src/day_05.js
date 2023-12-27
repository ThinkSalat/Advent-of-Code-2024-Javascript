/**
 * Contains solutions for Day 5
 * Puzzle Description: https://adventofcode.com/2023/day/5
 */

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ input, lines }) => {

  const seeds = lines[0].slice(7).split(' ').map(seed => Number(seed))
  let seedsChanged = seeds.map(() => false)
  let currentRange;
  for (let i = 3; i < lines.length; i++) {
    if (!isNaN(lines[i][0])) {
      currentRange = lines[i].split(' ').map(num => Number(num))
      seeds.forEach((seed, j) => {
        if (
          (currentRange[1] <= seed) && (seed < currentRange[1] + currentRange[2])
          && !seedsChanged[j]
        ) {
          seeds[j] = currentRange[0] - currentRange[1] + seed
          seedsChanged[j] = true
        }
      })
    } else {
      seedsChanged = seedsChanged.map(() => false)
    }
  }

 return Math.min(...seeds)
};

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
