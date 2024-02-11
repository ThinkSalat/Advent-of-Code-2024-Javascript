/**
 * Contains solutions for Day 12
 * Puzzle Description: https://adventofcode.com/2023/day/12
 */

/**
 * This has me thinking about combinations or permutations
 * there's 1000 lines, and the lines have from 2 and 6 groupings of working springs
 * It shouldn't be too bad then. we're essentially dividing the line into parts
 * and runnig a recursive algorithm to count the permutations possible.
 * 
 * ???.### 1,1,3 - 1 arrangement
 * .??..??...?##. 1,1,3 - 4 arrangements
 * ?#?#?#?#?#?#?#? 1,3,1,6 - 1 arrangement
 * ????.#...#... 4,1,1 - 1 arrangement
 * ????.######..#####. 1,6,5 - 4 arrangements
 * ?###???????? 3,2,1 - 10 arrangements
 *
 * right right right, this is a classic recursive algorithm similar to combinations or permutations
 * luckily the input size is very limited so even factorial time isn't that bad here
 * 
 * basic idea, base case will be 1 grouping. you will split the problem up
 * by getting the number of possibilities for the first (or maybe last) grouping
 * and adding that to the number of possibilities of the truncated line and groupings minus the 
 * one you already counted
 * 
 * findNumArrangments (line, groupings):
 *    if groupings.length == 0
 *        return 0
 *    ** get number of possibilities of first grouping
 *    return num + findNumArrangements(line.slice(xxx), groupings.slice(1))
 * 
 * It'll resemble something like this I believe.
 * 
 * The really tricky part is deciding which input to add and how to decide where to cut
 * off the line for the recursive call.
 * 
 * Also maybe the return is not correct here because the first example only has one possibility
 * then again, after filling in the first possibility, it's not possible to fill in the second or third
 * so those would both return 0
 * 
 * For example you have 3 questions marks in the  first example. there are two ways that the first 
 * grouping can fit into it. so already that approach doesn't work. what about naïve
 * 
 * it fits in the first ? so you take the first ? and then add a . or something? and then do the rest?
 * so then you have ?.### 1, 3
 * you take the one and return the rest
 * now you have ### and 3 and what now. you just return 0 because there's no ? or you return
 * one because there's what? should I return options that are more than one? no, because that
 * leaves each grouping as 0.
 * 
 * let's look at the most complex option they give
 * 
 * ?###???????? 3,2,1
 * .###.##.#...
 * .###.##..#..
 * .###.##...#.
 * .###.##....#
 * .###..##.#..
 * .###..##..#.
 * .###..##...#
 * .###...##.#.
 * .###...##..#
 * .###....##.#
 * 
 * Oh wow looking at that pattern is making me think of the previous puzzle
 * rather it looks just like the way you create the pairings of galaxy coordinates using
 * coordPairs.forEach (pair, i)
 *    coordPairs.slice(i).forEach(pair)
 * 
 * This produces the same kind of results as the last two groupings (2,1)
 * here it is without the first grouping
 * 
 * ##.#...
 * ##..#..
 * ##...#.
 * ##....#
 * .##.#..
 * .##..#.
 * .##...#
 * ..##.#.
 * ..##..#
 * ...##.#
 * 
 * ok. so what this is doing is taking the 2 and adding one .
 * so it creates a unit of "##." and keeps moving it one index to the left until 
 * it's not possible to create the last grouping
 * 
 * So maybe it's iterating along the line in chunks the size of the first grouping + 1
 * to account for the space between groupings
 * if it's invalid it just skips ahead. if it can create the grouping,
 * it checks if it's able to validly create the other groupings.
 * 
 * something like a for loop
 *    isPossible? line.slice(chunk)
 *       check other possibel groupings line.slice(chunk), groupings.slice(1)
 * 
 * 
 * Something that last example gives away as well:
 * if you have a grouping that matches, that grouping cannot be changed. the first grouping
 * is of 3, so it already exists. that makes it impossible to add to or modify without
 * the input being invalid so it can safely be disregarded
 * 
 * Gonna have to figure out the math to add up the possibilities for each line
 * Oh dude I think it's just multiplication? 
 * is that possible? try it with the last line maybe
 * 
 * works with the first line
 * 
 * wait so basically do the loop that chunks the first grouping only
 * for each chunk that's the size of the first grouping the, if it's valid for that chunk
 * you then multiply that times the result of a recursive call on the remainging line and
 * groupings
 * 
 * you then add all these up.
 * 
 * So like this
 * 
 * sum = 0
 * 
 * base case (might be better way)
 *    if only one group
 *        return number valid chunks
 * 
 * for chunks the size of group1 + 1
 *    if chunk is valid
 *      sum += recCall(truncated line, truncated groupings)
 * 
 * return sum
 * 
 * so then in main body
 * 
 * return lines.reduce( (sum, line) => recCall(...line.split(' ')), 0)
 * 
 * this is just the basicformat though, still gotta figure out 
 * how to deal with existing groupins and stuff
 * One thing that may help: there will be exactly the sum of all groupings number of springs
 * this means that wherever one or more springs exist, they must be part of a grouping
 * 
 * groupings must be separated by at least one .
 * 
 * One thing to improve efficiency, and keep groupings within the range of possibilities
 * is to sum the leftover groupings, and add 1 extra for each grouping, and terminate the 
 * for loop there
 * 
 * for (let i = 0; i < sumGroups - sizeGrouping; i++) {
 *    for (let j = i + sizeGrouping; j < sumGroups; j++) {
 *      check if the slice i..j is a valid group
 *    }
 * }
 * 
 * You can terminate early if the chunk you grabbed isn't valid.
 * 
 * Ok so on to the validity check: 
 * One thing about the chunking stuff here is that it won't disqualify if the number of
 * springs is more than the input.
 * 
 * Is it safe to discard this concern? if any chunks are invalid the entire input is invalid
 * and it's safe to assume all inputs are valid in this case
 * 
 * actually I think it's really easy, if the chunk includes a ".", it's invalid
 * otherwise it's valid! any combination of # and ? will equal a valid input
 * 
 * so just !line.slice(i,j).includes('.')
 * 
 * 
 * also if I find a valid chunk, do I skip the next character in the line when
 * passing the inputs to the next recursion call? Need to account for fact
 * that groupings must be separate by at least one .
 * 
 * if line is ???.### 1,1,3 - 1 arrangement
 * if we're on the second chunk, that's the second ?
 * we pass to recursive call (?.###, [1, 3])
 * 
 * None are valid so it will return 0.
 * 
 * the first chunk is only one that works. 1 is valid then we pass in 
 *  rec(?.###, [1, 3]), skipping the second ?
 * this finds the first chunk as valid and passes in rec(###, [3])
 * which returns 1.
 * 
 * I think base case will just be checking for empty group array and returning 1
 * Got to figure out the multiplicative aspect
 * 
 */
const example1 = `.??..??...?##. 1,1,3
`
const example2 = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`

class RecursiveIdentifier {
  static counter = 1;

  constructor(inputString) {
    this._id = RecursiveIdentifier.counter++;
    this.inputString = inputString;
  }
  id() {
    return `rid: ${this._id}`
  }
}

const getNumValidArrangments = (line, groups) => {
  const recId = new RecursiveIdentifier(line)
  console.log(recId.id(), 'running', line, groups)
  if (groups.length === 0) {
    console.log(recId.id(), 'enter basecase')
    return 1
  }

  const sumGroups = groups.slice(1).reduce((sum, num) => sum + num, 0) + groups.length - 1
  const terminationIdx = line.length - sumGroups - groups[0] + 1
  let total = 1
  let recursionResult;
  for (let i = 0; i < terminationIdx; i++) {
    let j = i + groups[0]
    console.log(recId.id(), { i, j, sumGroups, inputLength: line.length, lastIndex: line.length - sumGroups, slice: line.slice(i, j) })
    if (!line.slice(i, j).includes('.')) {
      console.log(recId.id(), `Found Valid ${line.slice(i, j)}. entering recursive step`)
      recursionResult = getNumValidArrangments(line.slice(j + 1), groups.slice(1))
      console.log(recId.id(), { recursionResult })
      if (recursionResult) {
        total *= recursionResult
      }
    }
  }

  return total
}

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ input, lines }) => {
  lines = example2.split('\n')
  lines = [example1]
  return lines.reduce((sum, line) => {
    const [inputLine, groupingsStr] = line.split(' ')
    return sum + getNumValidArrangments(inputLine, groupingsStr.split(',').map(Number))
  }, 0)
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
