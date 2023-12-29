/**
 * Contains solutions for Day 7
 * Puzzle Description: https://adventofcode.com/2023/day/7
 */

const sampleInput = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`


const cardRanks = {
  'A': 13,
  'K': 12,
  'Q': 11,
  'J': 10,
  'T': 9,
  '9': 8,
  '8': 7,
  '7': 6,
  '6': 5,
  '5': 4,
  '4': 3,
  '3': 2,
  '2': 1
}

const handTypeRanks = {
  '5': 7,
  '4': 6,
  'fh': 5,
  '3': 4,
  '2p': 3,
  '1': 1,
  '0': 0
}

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ input, lines }) => {
  // your code here
  // input = sampleInput
  // lines = sampleInput.split('\n')


  const handInfo = lines.map(line => {

    let handType;
    let handTypeScore;
    const cardCount = new Map()
    const [hand, wager] = line.split(' ')
    for (let card of hand) {
      if (!cardCount.has(card)) {
        cardCount.set(card, 0)
      }
      cardCount.set(card, cardCount.get(card) + 1)
    }

    const counts = Array.from(cardCount.values())
    switch (counts.length) {
      case 1:
        handType = '5'
        handTypeScore = 7
        break;
      case 2:
        if (counts.includes(4)) {
          handType = '4'
          handTypeScore = 6
        } else {
          handType = 'fh'
          handTypeScore = 5
        }
        break;
      case 3:
        if (counts.includes(3)) {
          handType = '3'
          handTypeScore = 4
        } else {
          handType = '2p'
          handTypeScore = 3
        }
        break;
      case 4:
        handType = '1'
        handTypeScore = 2
        break;
      case 5:
        handType = '0'
        handTypeScore = 1
        break;
    }

    return {
      hand,
      cardCount,
      handType,
      handTypeScore,
      wager,
    }
  })



  handInfo.sort( (handA, handB) => {
    if (handA.handTypeScore !== handB.handTypeScore) {
      return handA.handTypeScore - handB.handTypeScore
    } else {
      for (let i = 0; i < 5; i++) {
        if (handA.hand[i] !== handB.hand[i]) {
          return cardRanks[handA.hand[i]] - cardRanks[handB.hand[i]]
        }
      }
    }
  })

  return handInfo.reduce( (sum, {wager}, i) => sum + (Number(wager) * (i + 1)), 0)
  
  /**
   * Add cards in hand to map represnting count of cards
   * 5:  55555: { 5: 5 }    
   * 4:  55554: { 5: 4, 4: 1 }
   * FH: 55533: { 5: 3, 3: 2 }
   * 3:  55512: { 5: 3, 1: 1, 2: 1 }
   * 2P: 55331: { 5: 2, 3: 2, 1: 1 }
   * 1:  55123: { 5: 2, 3: 1, 2: 1, 1: 1 }
   * 0:  54321: { 5: 1, 4: 1, 3: 1, 2: 1, 1: 1 }
   * 
   * extract count values and sort by max
   * 
   * 5:  [5]
   * 4:  [4, 1]
   * FH: [3, 2]
   * 3:  [3, 1, 1]
   * 2p: [2, 2, 1]
   * 1:  [2, 1, 1, 1]
   * 0:  [1, 1, 1, 1, 1]
   * 
   * so if length is 1, it's 5, if length is 2, it's 4 or 4h, easily checked by first value
   * if length is 3 it's 3 or 2p again check first value
   * 4 length is 1 and 5 length is 0. So a switch statement that has two conditional
   * sub cases.
   * 
   * Then we compare hands by rank - for each rank we have to go one by one until
   * one hand or the other has a higher card rank and that one gets the higher rank
   * 
   * I'm guessing you'll want a system where you can evaluate each card simultaneously
   * something like stepping through each card and assigning a rank as it goes?
   * That can't be possible. what if each starting is the same, then each is ranked the same
   * 
   * Ok. There's 1000 hands. 
   */


  return 1
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
