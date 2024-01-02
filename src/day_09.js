/**
 * Contains solutions for Day 9
 * Puzzle Description: https://adventofcode.com/2023/day/9
 */

/**
 * Oh god this is dynamic programming. I will probably need help for this one
 * 
 * Looks like a pyramid almost. 
 * 
 * So this clearly cannot be brute forced. though the brute force method I don't
 * think would be too inefficient. At most, you'll create a new array for each
 * item in the original array
 * 
 * so while this is dynamic programming almost certainly, there's an elemnt of math
 * that I think will come into play.
 * 
 * I'm wondering about caching here too - all lines are the same length. 
 * 
 * Where and how though. I think this is recursive
 * 
 * base case will be everyhting in the array is 0.
 * 
 * then we map to the differences between inputs. and pass that into the recursive
 * step.
 * 
 * after checking the base case, we can check and see if we've had that same
 * sequence of differences before and if so, we'll retrieve from cache
 * 
 * but wtf are we retreiving from cache. 
 * 
 * Also interesting - idk about tail call recursion but is it possible to do
 * when your result has to be like, the  result of the  recursion plus a number?
 * 
 * Like, we have the recursive formula, but the actual answer we want is a number from the sequence
 * 
 * I know this exact type of algorithm and formula is a common one.
 * 
 * This also of course reminds of fibionacci. 
 * 
 * OH I know how the memoization would work. The encoding would result in the next number in the series, which lets you trickle up again
 * From the example
 * 10  13  16  21  30  45  68
 *   3   3   5   9  15  23
 *     0   2   4   6   8
 *       2   2   2   2
 *         0   0   0
 *         
 * In this case, the line 3 3 5 9 15 *23* (23 is result of the series 3 3 5 9 15), encodes to "3,3,5,9,15": 23
 * That way when we come across this line, we skip the bottom lines and immediately know the next part of the series is 23
 * 
 * ANOTHER THING: When we finish finding the end of the series, we need to encode and memoize that series as well as no doubt the answers to some
 * will end up being part of the series of other.
 * 
 * So the memoization step of the above example would be as follows 
 * 
 * input: 10 13 16 21 30 45
 * check cache: doesn't exist
 * calculate differences to get 3 3 5 9 15
 * recursively call this function with this new input
 * check cache: exists! return 23
 * 
 * add result of recursive call (23) to the last number of input
 * add 10.13.16.21.30 to cache with result of 23 + 45
 * return 23 + 45
 * 
 * essentially we just run this as a reduce function
 * return input reduce (sum, series) => recursiveFun(series) + sum
 * default value 0
 * 
 * wait you don't need to encode the series. just keep the spaces lol. the string itself is the key
 * 
 * then just .join(' ') on the array to encode
 * 
 * DUH this is so dumb. the recrusive function wants to return
 * both an array and the last number of the array.
 * 
 * WAIT ok here's the fibonacci similarity
 * you return 
 * 
 * series.last + recFunc(series).last
 * 
 * Wait no of course not DUH that's the same problem.
 * 
 * maybe just series.last + recfunc
 * 
 * So it always returns number? 
 * 
 * 
 * Duh ok so you want two funcitons in one basically but ugh this is dumb
 * 
 * ok. one function will return the continuation of the series
 * 
 * so func1 returns number
 * 
 * func2 returns series.
 * 
 * ok so maybe func1 returns a number, and does func2 recursively until you get
 * that number, caching along the way
 * 
 * right so the question is where to do the caching and retrieval 
 * cuz my first instinct is series: number (next in series)
 * but to do it this way requires doing series: difference series
 * 
 * but maybe i can do the memoization in the func1 somehow
 * 
 * I think I'm overcomplicating. No one is doing caching just very basic
 * recursion
 */

const example = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`

const getNextInSeries = series => {
  if (new Set(series).size === 1) {
    return series[0]
  }

  const diffSeries = series.slice(1).map((num, i) => num - series[i])
  const diff = getNextInSeries(diffSeries)
  const answer =  series.at(-1) + diff
  return answer
}

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ input, lines }) => {
  return lines.reduce((sum, series) => sum + getNextInSeries(series.split(' ').map(Number)), 0)
};

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = ({ input, lines }) => {
  return lines.reduce((sum, series) => sum + getNextInSeries(series.split(' ').map(Number).reverse()), 0)
};
