/**
 * Contains solutions for Day 10
 * Puzzle Description: https://adventofcode.com/2023/day/10
 */


/**
 * Seems like a normal enough array traversal type problem
 * Find the length of the loop and halve it.
 * 
 * something like: while (currentCoords !== 'S') 
 * 
 * keep moving along the pipe and incrementing the counter
 * 
 * return length / 2
 * 
 * We have to find the coordinates of the S as well. so that's like the preamble
 * 
 * this seems too easy , there's gotta be a catch
 * 
 * pseudo code
 * 
 * ** Find S coordinates **
 * double for loop i,j. 
 *    if S, save coords and break out of loop
 * Just going to hardcode this actually
 * 
 * ** Navigate Pipe **
 * let length = 1
 * while currentCoords don't point to 'S'
 *    nextCoords = findNextPipe currentCoords, prevCoords
 *    prevCoords = currentCoords
 *    currentCoords = nextCoords 
 *    length++
 * 
 * return length / 2
 * 
 * ** findNextPipe func **
 * current pipe type and prevCoords tells you which will be the next coordinates
 * return nextCoords
 * 
 * find next pipe function will be the difficult part
 * No need to search deltas becaues the pipe type will dictacte the next coordinates. There's only two
 * possible coordinates for the next pipe. the prevCoordinates will be given, so get the two next coordinates and
 * only use the ones that aren't the previous.
 * 
 * the map can be the deltas 
 * so I for example, would equate to [[-1, 0], [1, 0]] to indicate one above and one below
 * It appears they can't make diagonals either so there'll always be a 0
 * that means they can be encoded more easily: the only options are -10, 0-1, 10, 01
 * 
 * just hardcode S location since it won't change
 * 
 * Finished p1. 8.5ms isn't good enough, there must be a more efficient way. Happy with the 
 * solution so far but definitely my worst performing so far.
 * It's honestly really surprising because it's only about 7k iterations that should be nearly
 * instantaneous, or at least more so than 8.5ms lol.
 * 
 * I'm guessing there's some inefficiencies in the way I'm handling getNextPipe.
 * I'm converting arrays to stringss and filtering an array.
 * Maybe I could do a dual key type thing. the key could the pipe type + prevCoordDeltas as a string
 * and return an array so I can avoid all that stuff. Seems like a decent bit of work and
 * I'd be pissed if it only shaved off a couple ms. It should be 1ms or less
 * 
 * p2 is ridiculous. I've seen this exact problem before though and there's definitely a trick
 * something like counting borders.
 * 
 * maybe counting borders above and to the right or something like that. 
 * OOOOOOOOOO
 * OS------7O
 * O|F----7|O
 * O||OOOO||O
 * O||OOOO||O
 * O|L-7F-J|O
 * O|II||II|O
 * OL--JL--JO
 * OOOOOOOOOO
 * 
 * In this example, if your number of border crossings is even, you're outside
 * if it's odd, you're inside
 * 
 * I wonder if the horizontal borders have any bearing? I suppose it'll never land on a horizontal border
 * Looks like the same rule applies - maybe it's just general
 * 
 * OF----7F7F7F7F-7OOOO
 * O|F--7||||||||FJOOOO
 * O||OFJ||||||||L7OOOO
 * FJL7L7LJLJ||LJIL-7OO
 * L--JOL7IIILJS7F-7L7O
 * OOOOF-JIIF7FJ|L7L7L7
 * OOOOL7IF7||L7|IL7L7|
 * OOOOO|FJLJ|FJ|F7|OLJ
 * OOOOFJL-7O||O||||OOO
 * OOOOL---JOLJOLJLJOOO
 * 
 * let's check here
 * here, it looks like only even numbers. maybe there's ageneraliztion that can be made
 * 
 * maybe corners should only count as half. let's check both again
 * That doesn't work. but I think maybe corners have to cancel each other out
 * 
 * in fact this is kinda reminding me of the one that checks if pairs of brackest are correcct
 * using a stack.
 * 
 * The question is how to match corners.
 * 
 * 
 * I got some help from reddit and indeed the corners are part of it. 
 * you can't just cancel out any corners though. U shape corners can be cancel and S shaped
 * ones act as a border
 * also something I missed, - borders don't count either soyou just ignore
 * everything except for | and S shaped borders.
 * Doesn't really need a stack or anything like the bracket checking, you're just keeping
 * of the last corner you ran into for the next time you run into a corner
 * to check whether it's U or S shaped
 * then you reset it to null.
 * 
 * Pseudo code
 * 
 * ** Get coordinates of all pipe positions **
 * repurpose p1 to create a set of coordinates. add to set using String([y, x]) to make
 * it easier to check if the piece is part of the pipe
 * 
 * ** Find area inside pipe **
 * area = 0
 * isInside = false
 * lastCornerType = null
 * for each line
 *    for each character
 *        if character === .
 *            area += isInside ? 1 : 0
 *         else if pipePositions.has(String([i,j]))
 *            switch character
 *                case: |
 *                  isInside = !isInside
 *                case: F
 *                  if lastCornerType
 *                      if S
 *                         isInside = !isInside
 *                   else
 *                      lastCornerType = F
 *                do rest of corner cases
 * 
 * return area
 *            
 *            
 * S is a (-) in this case so make sure to account for that
 * This didn't work for some reason but it's also fairly slow. 
 * I found on Reddit to use pick's theorem in combination with shoelace forumla. 
 * Pick's calculates A which is the area ofa polygon
 * by using I as the number of interior points and B as the number of coordinates on the border
 * We're intereste in I, so we need to refactor the equation to get I = A - B/2 + 1
 * 
 * Since we have B but not A, we can use shoelace formula to get A just by using a list of vertices
 * or the list of corner pipes, in clockwise order. using this we can use the shoelace formula
 * to get A, and plug that into our formula above.
 * 
 * To save time I just had chatgpt write these out for me and it really impressed me. I didn't
 * make much changes to the code provided.
 */

const PREV_COORDS = [16, 36]
const START_COORDS = [16, 37]
const NEXT_COORDS = [16, 38]

/**
 * 
    | is a vertical pipe connecting north and south.
    - is a horizontal pipe connecting east and west.
    L is a 90-degree bend connecting north and east.
    J is a 90-degree bend connecting north and west.
    7 is a 90-degree bend connecting south and west.
    F is a 90-degree bend connecting south and east.
    . is ground; there is no pipe in this tile.
    S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.

 */

const example = `7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ`

const NEXT_PIPES = {
  '|': [[-1, 0], [1, 0]],
  '-': [[0, -1], [0, 1]],
  'L': [[-1, 0], [0, 1]],
  'J': [[-1, 0], [0, -1]],
  '7': [[0, -1], [1, 0]],
  'F': [[0, 1], [1, 0]],
}

function calculatePolygonArea(vertices) {
  const n = vertices.length;
  
  let A = 0;

  for (let i = 0; i < n - 1; i++) {
    A += (vertices[i][0] * vertices[i + 1][1]) - (vertices[i + 1][0] * vertices[i][1]);
  }

  A += (vertices[n - 1][0] * vertices[0][1]) - (vertices[0][0] * vertices[n - 1][1]);

  A = Math.abs(A) / 2;

  return A;
}

function calculateInteriorPoints(A, B) {
  const interiorPoints = A - Math.floor(B / 2) + 1;
  return interiorPoints;
}

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ input, lines }) => {
  let currentCoords = NEXT_COORDS
  let prevCoords = START_COORDS
  let nextCoords;
  let length = 1

  const findNextPipe = () => {
    const currentPipeType = lines[currentCoords[0]][currentCoords[1]]
    const nextCoordCandidates = NEXT_PIPES[currentPipeType]
    const prevCoordDeltas = [prevCoords[0] - currentCoords[0], prevCoords[1] - currentCoords[1]]

    const nextCoordDeltas = nextCoordCandidates
      .find(candidate => String(candidate) !== String(prevCoordDeltas))

    return [nextCoordDeltas[0] + currentCoords[0], nextCoordDeltas[1] + currentCoords[1]]
  }


  while (lines[currentCoords[0]][currentCoords[1]] !== 'S') {
    nextCoords = findNextPipe()
    prevCoords = currentCoords
    currentCoords = nextCoords
    length++
  }

  return length / 2

};

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = ({ input, lines }) => {
  let currentCoords = NEXT_COORDS
  let prevCoords = START_COORDS
  let nextCoords;
  let numBorders = 1
  const vertices = []

  const findNextPipe = () => {
    const currentPipeType = lines[currentCoords[0]][currentCoords[1]]
    const nextCoordCandidates = NEXT_PIPES[currentPipeType]
    const prevCoordDeltas = [prevCoords[0] - currentCoords[0], prevCoords[1] - currentCoords[1]]

    const nextCoordDeltas = nextCoordCandidates
      .find(candidate => String(candidate) !== String(prevCoordDeltas))

    return [nextCoordDeltas[0] + currentCoords[0], nextCoordDeltas[1] + currentCoords[1]]
  }


  while (lines[currentCoords[0]][currentCoords[1]] !== 'S') {
    if (['F', 'J', 'L', '7'].includes(lines[currentCoords[0]][currentCoords[1]])) {
      vertices.push(currentCoords)
    }
    nextCoords = findNextPipe()
    prevCoords = currentCoords
    currentCoords = nextCoords
    numBorders++
  }

  const interiorPoints = calculateInteriorPoints(calculatePolygonArea(vertices), numBorders);
  
  return interiorPoints
};