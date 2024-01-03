/**
 * Contains solutions for Day 11
 * Puzzle Description: https://adventofcode.com/2023/day/11
 */

/** 
 * Part 1 doesn't seem too bad. 
 * Aside from the "expansion" stuff, finding the distance between the coordinates is easy. Basic arithmetic
 * because going diagonally still requires you to make horizontal and vertical movements, it doesn't save any time at all
 * maybe p2 would require testing diagonally but I don't see that making much of a difference
 * 
 * so basically just grab the coordinates and then do the arithmetic to find distance. that's easy
 * 
 * Now for the expansion, it seems similarly easy, just some artihmetic to account for the additional space.
 * 
 * Will have to check if we're crossing the expansion which is easy enough. an expansion will just be the row or column
 * number of the empty space. if we cross it, we add additional length to the distance.
 * 
 * Basically just test if the row is between the row coordinates and same for columns. 
 * 
 * The question is if simply adding 2 extra length per expansion is sufficient
 * 
 * Actually I think you just add 1 per crossing.
 *    v  v  v
 *  ...#......
 *  .......#..
 *  #.........
 * >..........<
 *  ......#...
 *  .#........
 *  .........#
 * >..........<
 *  .......#..
 *  #...#.....
 *    ^  ^  ^
 * 
 * ....1........
 * .........2...
 * 3............
 * .............
 * .............
 * ........4....
 * .5...........
 * ............6
 * .............
 * .............
 * .........7...
 * 8....9.......
 *
 * let's look at distance between 8,9 and 1,2.
 * 8 and 9 are on the same row. There's a column between them. since they're on the same row, there's no possible way
 * before expansion the distance between 8 and 9 is 3
 * after expansion, there's 1 empty column between them and the distance is 4
 * 
 * 1 and 2 are similar but they're on separate rows and columns so we'll have to account for expansion bothw ays
 * however between them there is only one empty column.
 * the distance before expansion is 4, and after, it's 5.
 * 
 * SO far so good. Now let's check between 3 and 4. these have 2 empty columns and one empty row, so accoding to the current
 * hypothesis, the original distance should be augmented by 3
 * before distance: 7
 * after distance: 10
 * 
 * Ok so the hypothesis holds. I can see no reason why this wouldn't generalize to others
 * 
 * So the basics are out of the way. We need to identify all galaxy coordinates, then create all their pairings
 * This can be done simultaneously with a single run through. we'll create an array to hold all pairings
 * each element in this array will be an array, that holds two arrays of coordinates. so 3 arrays deep lol
 * 
 * [
 *  pairing 1 and 2
 *  [[1, 2], [3, 4]]
 *  pairing 1 and 3
 *  [[1, 2], [4, 5]]
 * ]
 * 
 * then just map over it.
 * 
 * Will also need to keep track of all empty columns and rows - these will be represented by numbers as well.
 * I think this can actually be interpolated just from the list of all galaxy coordinates. any number not represented
 * by the coordinates will be an empty column or row. find the difference set for x and y coordinates basically
 * 
 * might be best to just chuck all coordinates into an array
 * map over array simultaneously creating sets of missing numbers 
 * 
 * 
 * oh you know what, maybe just assume it's an empty row or column UNLESS there's a galaxy represented on that column or row
 * in this case, you would take the original distance, assume all are empty and double it, then subtract the number of
 * rows/columns that are within that range.
 * 
 * pseudo code
 * 
 * for each line, colIdx
 *    for each char, rowIdx
 *        if galaxy
 *          galaxyCoords.push([colIdx, rowIdx])
 *          nonEmptyRows.add(rowIdx)
 *          nonEmptyCols.add(colIdx)
 *    
 * let totalDistance = 0  
 * for each galaxyCoord
 *    for each galaxyCoord.slice(1)
 *      verticalDistance = (Math.abs(x - x1) * 2) - findGalaxiesBetween(x, x1, nonEmptyCols)
 *      horizontalDistance = (Math.abs(x - x1) * 2) - findGalaxiesBetween(x, x1, nonEmptyRows)
 *      totalDistance += verticalDistance + horizontalDistance
 * 
 * return totalDistance
 * 
 * Huh so actually there's only 9 empty rows and 8 empty columns.
 * Better to do original - instead of doubling, make sets of empty rows and columns and check any between.
 * This might be the trick for this problem - how best to check. maybe a sorted list of empty rows and columns?
 * Looks like best is to just iterate through the empty set and check each oneto see if it's 
 * in between the two galaxies
 * 
 * so back to best way to create the array of empty columns and rows
 * 
 * Ok part 2, instead of adding 1 for each empty space, you add a million.
 * Should be exactly the same except just adding 1 million for eah empty one
 */

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ input, lines }) => {
  const nonEmptyCols = new Set()
  const nonEmptyRows = new Set()
  const emptyRows = []
  const emptyCols = []
  const galaxyCoords = []

  lines.forEach((row, rowIdx) => {
    row.split('').forEach((space, colIdx) => {
      if (space === '#') {
        galaxyCoords.push([rowIdx, colIdx])
        nonEmptyCols.add(colIdx)
        nonEmptyRows.add(rowIdx)
      }
    })
  })

  for (let i = 0; i < 140; i++) {
    if (!nonEmptyCols.has(i)) {
      emptyCols.push(i)
    }
    if (!nonEmptyRows.has(i)) {
      emptyRows.push(i)
    }
  }

  let totalDistance = 0
  galaxyCoords.forEach(([gRowA, gColA], galaxyIdx) => {
    galaxyCoords.slice(galaxyIdx).forEach(([gRowB, gColB]) => {
      let rowDiff = Math.abs(gRowA - gRowB)
      let colDiff = Math.abs(gColA - gColB)
      emptyRows.forEach(emptyRowIdx => {
        if (Math.min(gRowA, gRowB) < emptyRowIdx && emptyRowIdx < Math.max(gRowA, gRowB)) {
          rowDiff++
        }
      })
      emptyCols.forEach(emptyColIdx => {
        if (Math.min(gColA, gColB) < emptyColIdx && emptyColIdx < Math.max(gColA, gColB)) {
          colDiff++
        }
      })
      totalDistance += rowDiff + colDiff
    })
  })

  return totalDistance
};

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = ({ input, lines }) => {

  const nonEmptyCols = new Set()
  const nonEmptyRows = new Set()
  const emptyRows = []
  const emptyCols = []
  const galaxyCoords = []

  lines.forEach((row, rowIdx) => {
    row.split('').forEach((space, colIdx) => {
      if (space === '#') {
        galaxyCoords.push([rowIdx, colIdx])
        nonEmptyCols.add(colIdx)
        nonEmptyRows.add(rowIdx)
      }
    })
  })

  for (let i = 0; i < 140; i++) {
    if (!nonEmptyCols.has(i)) {
      emptyCols.push(i)
    }
    if (!nonEmptyRows.has(i)) {
      emptyRows.push(i)
    }
  }

  let totalDistance = 0
  galaxyCoords.forEach(([gRowA, gColA], galaxyIdx) => {
    galaxyCoords.slice(galaxyIdx).forEach(([gRowB, gColB]) => {
      let rowDiff = Math.abs(gRowA - gRowB)
      let colDiff = Math.abs(gColA - gColB)
      emptyRows.forEach(emptyRowIdx => {
        if (Math.min(gRowA, gRowB) < emptyRowIdx && emptyRowIdx < Math.max(gRowA, gRowB)) {
          rowDiff += 1000000
        }
      })
      emptyCols.forEach(emptyColIdx => {
        if (Math.min(gColA, gColB) < emptyColIdx && emptyColIdx < Math.max(gColA, gColB)) {
          colDiff += 1000000
        }
      })
      totalDistance += rowDiff + colDiff
    })
  })

  return totalDistance
};
