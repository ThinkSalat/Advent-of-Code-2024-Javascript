/**
 * Contains solutions for Day 4
 * Puzzle Description: https://adventofcode.com/2023/day/4
 */

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ input, lines }) => {

  const scratchCardInfo = lines.map( line => {
    const [cardInfo, numbers] = line.split(':')
    let [winningNumbers, scratchedNumbers] = numbers.split(' | ')
    winningNumbers = new Set(winningNumbers.split(' '))
    scratchedNumbers = new Set(scratchedNumbers.split(' '))
    winningNumbers.delete('')
    winningNumbers.delete(' ')
    scratchedNumbers.delete(' ')
    scratchedNumbers.delete('')
  
    let score = 0;
    [...winningNumbers].forEach( num => {
      if (scratchedNumbers.has(num)) {
        if (score === 0) {
          score = 1
        } else {
          score *= 2
        }
      }
    });
  
    return {
      cardNumber: Number(cardInfo.slice(4).trim()),
      winningNumbers,
      scratchedNumbers,
      score,
    }
  })
  
  let total = 0
  
  scratchCardInfo.forEach( ({ score }) => total += score)
  
  return total
};

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = ({ input, lines }) => {


  const scratchCardInfo = lines.map(line => {
    const [cardInfo, numbers] = line.split(':')
    let [winningNumbers, scratchedNumbers] = numbers.split(' | ')
    winningNumbers = new Set(winningNumbers.split(' '))
    scratchedNumbers = new Set(scratchedNumbers.split(' '))
    winningNumbers.delete('')
    winningNumbers.delete(' ')
    scratchedNumbers.delete(' ')
    scratchedNumbers.delete('')

    let score = 0;
    [...winningNumbers].forEach(num => {
      if (scratchedNumbers.has(num)) {
        score++
      }
    });

    return {
      numCards: 1,
      score,
    }
  })

  scratchCardInfo.forEach(({ numCards, score }, i) => {
    for (let j = i + 1; j < score + i + 1; j++) {
      scratchCardInfo[j].numCards += numCards
    }
  })

  return scratchCardInfo.reduce((sum, { numCards }) => sum + numCards, 0)
};
