/**
 * Contains solutions for Day 1
 * Puzzle Description: https://adventofcode.com/2023/day/1
 */

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ input, lines }) => {
  let sum = 0;

  lines.forEach(line => {
    let first;
    let last;

    for (let i = 0; i < line.length; i++) {
      if (!isNaN(line[i])) {
        if (isNaN(first)) {
          first = line[i]
        }
        last = line[i]
      }
    }
    sum += Number(`${first}${last}`)
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
  let sum = 0;
  const numWordStarts = new Set(['z', 'o', 't', 's', 'e', 'n', 'f'])
  const numWords = new Map([
    ['zero', 0],
    ['one', 1],
    ['two', 2],
    ['three', 3],
    ['four', 4],
    ['five', 5],
    ['six', 6],
    ['seven', 7],
    ['eight', 8],
    ['nine', 9],
  ])


  lines.forEach(line => {
    let first;
    let last;

    let j
    for (let i = 0; i < line.length; i++) {
      if (!isNaN(line[i])) {
        last = line[i]
        if (isNaN(first)) {
          first = line[i]
        }
      } else if (numWordStarts.has(line[i])) {
        for (let j = i + 1; j < i + 6; j++) {
          if (numWords.has(line.slice(i, j))) {
            last = numWords.get(line.slice(i, j))
            if (isNaN(first)) {
              first = numWords.get(line.slice(i, j))
            }
            i = j - 2;
            break;
          }
        }
      }
    }
    sum += Number(`${first}${last}`)
  })

  return sum
};
