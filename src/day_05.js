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
 * Explain to my rubber duck:
 * 
 * You're given a bunch of rangers of numbers. These are the seeds, and each seed number will end up corresponding to one location
 * which is also a number. it is a 1:1 relationship, so there can be no overlapping. You can assume that the ranges of seed numbers
 * given to you will have no overlapping numbers.
 * 
 * You're given a set of categories that basically map a seed to it's corresponding location. each category will map you to a number
 * in the next category. Each category is essentially a list of ranges, and you can assume that, per category, there are no
 * overlapping in the ranges.
 * 
 * The goal is to find the smallest location number that can possible result given the numbers of seeds represented by the ranges
 * 
 * considering that the ranges of the seeds reach billions of numbers, it's safe to assume that brute forcing is not a good option.
 * 
 * It's fair to assume that each range of seeds will not be represented as one range of locations, throughout the mapping
 * of the numbers, the seeds will be split up into several locations which can be represented by ranges as well.
 * 
 * 
 * With that said, we have a bunch of ranges, which will get further split up into more ranges. Until eventually, we will have mapped
 * every seed range into it's component location ranges. From there, we will pick the smallest number of the location ranges,
 * which will just be the smallest starting range number.
 * 
 * So say we start with 5 ranges representing ranges of seed numbers. we go through 5 mappings. At each mapping, the ranges
 * get split up into more ranges. So after the first mapping, let's say we have 15 ranges. Then those 15 ranges are further broken
 * down into more ranges. so on and so on until at last we have x location ranges.
 * 
 * let's do a simple example of a single seed range. at first mapping, part of that range will get mapped according to the map.
 * part of it won't. This could be several parts. The maximum number will be something like the number of lines + 1.
 * so the first range of seeds could end up being broken down into numLines * 2 + 1
 * 
 * So we will go through the mappings line by line. Each line is a range, so we will find out which values for each previous range
 * apply to that range, map them according to the map, and add them to a temporary  array which will be used as input for the
 * next category. We will need to keep track of the ranges that are leftover that weren't mapped originally and add those to the
 * temporary array as well.
 * 
 * This is the most difficult part now: how to keep track of the leftovers from the ranges? Once that is figured out, it should 
 * be easy to accomplish. 
 * 
 * Maybe, because we're going through the entire seedRanges array, we push the parts of the currentRange that were not used
 * by the current map to the end of the array. it will be at most two parts because a range will only be able to split a range into
 * two parts. we will have to remove the current range from the array somehow though, because at the end of the current map range
 * it will move to the next map range and from there, run through the seed ranges array again. This will include the original range
 * unless we remove it.
 * 
 * So there's also the question of how we will know that a particular range is to go through to the new category, or is just 
 * leftover mappings. maybe each line, we recompose the array to discard any ranges that have been used.
 * how about each line, we create a new array - if it matches nothing in the map range, add the entire range to the array
 * if it matches some thing, it adds the mapped portion of the range to the new array to be used for the next category,
 * and then adds the leftover ranges from the input range to the array of input ranges to be used in the next line of the same
 * category. Then at the end of the category, we just add concatenate the entire nextLineRangeInputs array to the nextCategorRangeInputs
 * array!
 * 
 * so every comparison will be adding somnething to either the nextCategoryRangeINputs (mapped values) or netLinRangeInputs (unmapped values)
 * If there are any left over unmapped values, they move on to the next category as is. So when we reach the next category
 * we will have a list of mapped value ranges and unmapped ranges but they will all be valid input for that category.
 * 
 * let's put that into pseudo code
 * 
 * map - breaks down into mapLines
 * 
 * nextLineInputs - the inputs that are created from the current inputs ranges being broken down. these are the leftovers after
 * mapping what matches the current line of the map
 * 
 * nextCategoryInputs - this gets the mapped ranges added and at the end of the current category, whatever leftover ranges have not
 * been mapped get added as well. 
 * 
 * currentMapLine = this is the current line of the map
 * 
 * currentLineInputs - these are the inputs that we iterate over for the current line of the map. This begins as the beginning seed
 * range map
 * 
 * map through each line of the map
 * 
 * for each currentMapLine
 *    iterate through the currentLineInputs. 
 *       if part of the currentLineInput range matches the currentMapLine range, map it and add it to the nextCategoryInputs
 *          if any of the currentLineINput range is leftover, add those parts to the nextLineINputs array
 *        if nothing matches, add entire range to the nextLineINputs array
 *        if we reac hthe end of the category, add the nextLineInputs to the end of the nextCategoryInputs and set 
 *            currentLineINputs as the result of that merge.
 *  at the end of the all the maplines, the currentLineInputs array should have all the mapped and unmapped ranges
 *  iterate through that array and mainain a minimum value for each of the starting numbers of the range
 * 
 * 
 * Notes:
 * 
 * dealing with ranges is weird - should the rangeEnd number be inclusive or exclusive? 
 * [1,1] this is the range of just the number 1. [1,2] could also be this range
 * should I keep it to just be rangeStart and rangeLength?
 * From here on, I have the algorithm, but it's dealing with these little things all at once that can be confusing. 
 * I kinda think it might be best to just deal with rangeStart and rangeLength. I don't believe it'll take too much 
 * refactoring.
 * 
 * Part of the reasoning is in dealing with leftover ranges - if the range is length 0 then obviously I don't need it. But what if one of the 
 * leftover ranges is something like rangeStart = 50 and rangeEnd = 50. That could also be included in the original range.
 * 
 */


// const day5test = `seeds: 55 13
const day5test = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = ({ input, lines }) => {
  // Uncomment this to test against example code
  // lines = day5test.split('\n')
  // input = day5test

  const seeds = lines[0].slice(7).split(' ').map(seed => Number(seed))
  const maps = input.trim().split('\n\n').slice(1).map(map => map.split('\n').slice(1))

  let seedRanges = []
  for (let i = 0; i < seeds.length; i += 2) {
    seedRanges.push([seeds[i], seeds[i + 1] + seeds[i] - 1])
  }

  // Will push the new seed ranges in here
  let currentLineInputs = seedRanges
  let nextLineInputs = []
  let nextCategoryInputs = []

  maps.forEach((map, categoryIndex) => {
    console.log("START CATEGORY: ", { categoryIndex })
    map.forEach((line, i) => {
      const currentRange = line.split(' ').map(num => Number(num))
      const sourceRangeStart = currentRange[1]
      const sourceRangeEnd = sourceRangeStart + currentRange[2] - 1
      const rangeMapping = currentRange[0] - currentRange[1]

      // console.log("CHECKING LINE: ", line, "WITH THESE INPUTS: ", currentLineInputs)
      // if (categoryIndex === 2 && currentLineInputs.length !== new Set(currentLineInputs.map(a => a[0])).size) {
      //   console.log(
      //     "FOUND DUPLICATE",
      //     { categoryIndex },
      //     currentLineInputs.sort((a, b) => a[0] - b[0])
      //   )
      // }

      currentLineInputs.forEach(([rangeStart, rangeEnd]) => {
        if (
          (sourceRangeStart <= rangeStart && rangeStart < sourceRangeEnd) ||
          (sourceRangeStart <= rangeEnd && rangeEnd < sourceRangeEnd)
        ) {
          const maxStart = Math.max(rangeStart, sourceRangeStart)
          const minEnd = Math.min(rangeEnd, sourceRangeEnd)

          nextCategoryInputs.push([maxStart + rangeMapping, minEnd + rangeMapping])
          console.log("FOUND MATCH IN RANGE", [sourceRangeStart, sourceRangeEnd], [rangeStart, rangeEnd], "THIS MAPS TO: ", [maxStart + rangeMapping, minEnd + rangeMapping])

          if (rangeStart < sourceRangeStart) {
            console.log("FOUND LEFTOVER AT BEGINNING OF RANGE: ", [rangeStart, sourceRangeStart - 1] )
            nextLineInputs.push([rangeStart, sourceRangeStart - 1])
          }

          if (rangeEnd > sourceRangeEnd) {
            console.log("FOUND LEFTOVER AT END OF RANGE: ", [sourceRangeEnd + 1, rangeEnd] )            // maybe add plus one to source range end
            nextLineInputs.push([sourceRangeEnd + 1, rangeEnd])
          }

          if ([rangeStart, maxStart + rangeMapping,].includes(2091507351)) {
            // console.log("DUPLICATING VALUE", {
            //   i,
            //   rangeStart,
            //   maxStart,
            //   mappedRangeStart: maxStart + rangeMapping,
            //   line,
            //   frontLeftoersExist: rangeStart < sourceRangeStart,
            //   frontLeftoverRange: [rangeStart, sourceRangeStart - 1],
            // })
          }
        } else {
          // console.log("NO MATCH FOR THIS RANGE: ", [sourceRangeStart, sourceRangeEnd], [rangeStart, rangeEnd])
          nextLineInputs.push([rangeStart, rangeEnd])
        }
      })

      // console.log("COMPLETED LINE: ", line, "inputs for next line: ", nextLineInputs)
      currentLineInputs = nextLineInputs
      nextLineInputs = []
    })

    console.log("END OF CATEGORY: ", { currentLineInputs, nextCategoryInputs })
    // console.log("END OF CATEGORY: ", { categoryIndex })

    // if (categoryIndex === 2) {
    //   console.log({
    //     leftovers: currentLineInputs.sort((a, b) => a[0] - b[0]),
    //     mappedRanges: nextCategoryInputs.sort((a, b) => a[0] - b[0]),
    //   })
    // }
    currentLineInputs = currentLineInputs.concat(nextCategoryInputs);

    if (currentLineInputs.length !== new Set(currentLineInputs.map(a => a[0])).size) {
      console.log(
        "FOUND DUPLICATE",
        {categoryIndex }
      )
    }

    nextCategoryInputs = []
  })

  // OHHH I think what's happening is that I'm not removing the mapped portion of the range
  // so it's going to the next line on the map, but that part of the range still exists
  // that's why the duplicates are there.
  // No wait, after every, it changes currentLineInputs. It discards
  // the old ones.
  /**
   * Nmm. So try to check what's going onin the end of categroy where
   * the currentLineINputs still has something in it
   * and there's nexxtCategoryINputs. That's to be expected
   * but I think I see the number that gets duplicated here. 
   * dial down and check the math to see why that's happening.
   * Going to try to just remove that particular one input from the input 
   * and see if i get the right answer lol
   * 
   * that's didn't work.
   */

  let endArr = currentLineInputs.map(arr => arr[0]).sort()
  let endSet = new Set(endArr)

  return Math.min(...currentLineInputs.map(arr => arr[0]))
};
