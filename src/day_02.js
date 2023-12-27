/**
 * Contains solutions for Day 2
 * Puzzle Description: https://adventofcode.com/2023/day/2
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

  const gemAmounts = {
    red: 12,
    green: 13,
    blue: 14,
  }

  lines.forEach(line => {
    const [gameInfo, handfulInfo] = line.split(':');
    const [_, gameNumber] = gameInfo.split(' ');
    const handfuls = handfulInfo.split(';');

    let isImpossible = false
    handfuls.forEach(handful => {
      const gems = handful.split(',')
      gems.forEach(gem => {
        const [numberGems, color] = gem.trim().split(' ')
        if (Number(numberGems) > gemAmounts[color]) {
          isImpossible = true
        }
      })
    })

    if (!isImpossible) {
      sum += Number(gameNumber)
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
  let sum = 0;

  lines.forEach(line => {
    let maxColors = {
      red: 1,
      green: 1,
      blue: 1,
    }

    const [_, handfulInfo] = line.split(':');
    const handfuls = handfulInfo.split(';');

    handfuls.forEach(handful => {
      const gems = handful.split(',')
      gems.forEach(gem => {
        const [numberGems, color] = gem.trim().split(' ')

        maxColors[color] = Math.max(numberGems, maxColors[color])

      })
    })

    sum += maxColors.red * maxColors.green * maxColors.blue
  })

  return sum
};
