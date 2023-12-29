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
  '2': 1,
  'J': 0,
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



  handInfo.sort((handA, handB) => {
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

  return handInfo.reduce((sum, { wager }, i) => sum + (Number(wager) * (i + 1)), 0)

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

  /**
   * The hand can now contain jokers. This makes it super complicated. Idk. I think though, that the presence of a joker should just be a arithmetic
   * problem. Maybe an encoding of the hand, with the joker equals ???
   * 
   * 5555j = 4 of a kind. with joker 5, so one rank up
   * 555jj = 3 of a kind. with jokers it's 5.
   * 5554j = 3 of a kind. with joker it's four of a kind (any 3 of a kind that has one joker will be 4 of a kind. full house is one rank less)
   * 5544j = 2 pair. with joker it's a full house.
   * 5543j = a pair. with joker it's two pair
   * 554jj = pair. with two jokers, it's 4 of a kind.
   * 
   * how about reverse:
   * jjjjj = 5 
   * jjjj5 = 5
   * jjj54 = 4
   * jj543 = 3
   * jj554 = 4
   * j
   * 
   * let's test a hypothesis - if there's jokers, always add them to the most common card
   * 
   * ie: 5554j - make j a 5 for 4 of a kind.
   * full house and two pair make it more complicated
   * 
   * 5544j = in this case it's a full house either way
   * 554jj = well in this case you add to the most common for 4 of a kind
   * two pair. if you can make two pair, you can make 3 of a kind. 
   * 
   * yeah I think you always just add the jokers to the most common card
   * 
   * This solution isn't working. There must be some edge case that I'm missing.
   * 
   * I was missing the set of 5 jokers "JJJJJ". Previous implementation didn't take that into account
   * 
   */
  // input = sampleInput
  // lines = sampleInput.split('\n')
  const handInfo = lines.map(line => {

    let handType;
    let handTypeScore;
    let cardCount = new Map()
    const [hand, wager] = line.split(' ')

    let numJokers = 0
    let highestCardCount = 0
    let highestCardType = null
    let prevCardCount = 0

    for (let card of hand) {
      if (card === 'J') {
        numJokers++
      } else {
        if (!cardCount.has(card)) {
          cardCount.set(card, 0)
        }
        prevCardCount = cardCount.get(card)
        cardCount.set(card, prevCardCount + 1)
        if (prevCardCount + 1 > highestCardCount) {
          highestCardCount = prevCardCount + 1
          highestCardType = card
        }
      }
    }

    cardCount.set(highestCardType, highestCardCount + numJokers)

    if (hand === 'JJJJJ') {
      cardCount = new Map([['J', 5]])
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



  handInfo.sort((handA, handB) => {
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

  return handInfo.reduce((sum, { wager }, i) => sum + (Number(wager) * (i + 1)), 0)

};
