/**
 * Contains solutions for Day 8
 * Puzzle Description: https://adventofcode.com/2023/day/8
 */


const example1 = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`

const example2 = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`

/**
 * Is this a binary search tree? Seems like an obvious that each node has a left and right child and the instructions
 * are literally left and right.
 * 
 * So make a BST from the nodes, then binary search for ZZZ, counting each node used? 
 * 
 * Ok BST is sorted based on rules, so these rules I assume would act like the rules used to sort numbers.
 * The sort uses a conditional to decide which is an acceptable left and right child etc.
 * 
 * Maybe best to try out the example first
 * 
 *                          AAA
 *                         /    \
 *                       BBB    BBB
 *                    /     \   /   \
 *                  AAA   ZZZ  AAA  ZZZ
 *                BBB  BBB 
 * 
 * Ok yeah it's not a bst. this is a graph. The Left Right stuff is a red herring probably. Graphs don't have LR
 * It's a graph that looks like a BST. Maybe... Maybe similar setup or something. 
 * like, Node {
 *    id: AAA
 *    left: BBB
 *    right: BBB
 * }
 * 
 * so then for example 2 you have nodes AAA, BBB, ZZZ.
 * 
 * So that makes traversal easier, but idk. Doesn't seem efficient and I think there's a trick to it.
 * pseudocode
 * 
 * create nodes
 * 
 * sum = 0
 * 
 * currentNode = AAA
 * 
 * while currrentNode isn't ZZZ
 *    currentNode = currentNode[directions[sum % directions.length]]
 *    sum++
 * 
 * return sum
 * 
 * 
 * 
 * That's I think the naïve approach. There must be a better way though, I'm certain. Let's do a quick big o analysis
 * 
 * at least n for time and space complexity, creating a new node for each item. I think for space complexity that's it
 * for time, that's hard to figure out as it could potentially just be an infinite loop. If assume that
 * an answer will exist, how to calculate big O? would be like, some formula of length of LR inputs and number of nodes. 
 * N*M? so just N basically. because it only grows at the rate of N. But is there a way it could be a factor of N? I don't think so
 * 
 * I think this is good for now. Feels like there is a trick. Is there a way to encode the LR inputs to arrive at the correct line?
 * There's no way to tell which line the direction L or R for the first node will be so no.
 * 
 * What about finding patterns in the LR inputs? like LLR or RRL or LRLR - if we find a pattern, is there any benefit to be had?
 * I don't think so. 
 * 
 * Wait, there's something from dynamic programming - caching. So like, the combination of direction and id of node will always result
 * in the same thing - in the example, L+AAA=BBB. caching that may have some benefit in the future. on current problem I see no 
 * benefit. I think the benefit would be from longer combinations, so this is kinda like sudoku solver or things like that
 * where you're saving an encoding of the path you've taken thus far. some kinda backtracking maybe.
 * the trade off with the cache is extra space of course, and it could add time and space complexity without ever actually retrieving
 * anything from the cache in the first place.
 * 
 * So how would we detect if a cache hit would take place? is there a general rule we can apply?
 * there's the graph loop detection stuff
 * 
 * But if it detects a loop, that would guarantee an infinite loop no? because we will end back where we were?
 * or the LR inputs would differ probably at the end of the loop - for LRLR and a loop encoding like LAB RBC LCD where only three 
 * nodes are in the loop, it would start on RD(x). so we exit the loop. say x points to A now. the direction we're on is L so the loops goes again
 * Ok in this case we stuck in an infinite loop. If the LR input is LRLRR, then when we get to A, we go to RA(x), which could also be a loop
 * but if we're caching all loops discovered, then that would be added to the cache.
 * 
 * but it's not guaranteed that a loop would be an infinite loop. so this type of caching could be useful
 * 
 * It would just be a Map with the encoding as the key. Now only for loops, or encoding entire path?
 * if we encode A.L=B, that doesn't benefit. If we encode A.L=B.R=C then oh shit, that doesn't help
 * with this type of caching, we still have to ensure that the following LR inputs match would we'd had before
 * so it'd be like a map of maps
 * the first set of keys is the LR inputs or set of LR inputs? FUck, would we be creating a Trie of LR inputs where the value at each level
 * is its own cache? 
 * 
 * something like LRTrie = {
 *    direction: L
 *    cachedInputs: Map(A, C)
 *    L: LRTrie
 *    R: LRTrie
 * }
 * 
 * Ok, so then there's the question of how we decide oh yeah, we have up to that input in the trie, without just making the entire program too
 * complex
 * 
 * Ok maybe we do a double for loop, i and j. we just keep incrementing j until we don't have a cachedInput for that combination of LR in the trie
 * if we do have a trie node for that level, we then check the cached input. if it exists, we jump to that section and make sure
 * that we jump the correct number of spots forward in the LR instructions. 
 * 
 * 
 * Caching
 * Trie
 * Dynamic programming
 * Memoization
 * Graph cycles
 *  
 * So what about making a trie at the beginning that represents the entire LR input. 
 * Or maybe just a linked list that loops so I can just loop around whenever I want
 *  
 * Then each node on the list can be be a cache on its own with the value pointing to a location
 *  
 * Si one of the big questions with this Andi think the reason a cache is complex and may require some 
 * dynamic programming solution is the question of retrieving from the cache. 
 * How do we know WHEN we can retrieve? How do we know it’s a match. 
 * A trie can make that easier and it doesn’t waste complexity because it terminates soon as there’s no match.
 * But that’s just as efficient or actually far less efficient than just traversing the nodes in their own.
 * We will still end up iterating over every item that we wanted to bypass using the cache in the first place lol
 *  
 * So caching would require an encoding that doesn’t require any further traversal. 
 * Is that even possible though? If the only information we have without further traversal is the direction input and 
 * the current node then we can’t look ahead without ruining efficiency. Is looking behind going to have any benefit? 
 * I don’t think so.
 *  
 * So I see no reason to implement caching on this iteration of the problem
 *  
 * Now the question of how to make the nodes. Because we’re connecting the left and right nodes by reference, 
 * the node needs to exist. And of course when we construct that child node, we need to connect it to more nodes and so on. 
 * So they all need to be constructed before hand and then connect.
 * What about just a map? Like a map with AAA as the key and then another map as thr l and r. Or an object. Or just an array.
 * Ok I think a simple map is the best because it should be just as performant as a tree. 
 * If we make the tree, we need a map anyway so we can handle storing references to the nodes created so we're just doubling our efforts
 *  
 * pesudo code for map solution
 * new map
 * For each line
 * 	  Add key and array with keys if it’s children
 *  
 * Set currentKey to AAA
 * Set sum to 0
 * While currentKey isn’t ZZZ
 * 	  Get current LR input
 * 	  Map.get(currentKey)[LRinput]
 * 	  Sum++
 * Return sum
 * 
 * so I did 4 iterations and the fastest is a map that maps to an array, wile first transforming the L and R
 * to  0 and 1 respectively. This is about 75% faster than the others
 * the others are a set of sets which I believes is just a ton of overhead
 * 
 * objects of objects also slower most likey due to same overhead, though i don't know
 * why an array would have so much significantly less than objects and Maps.
 * 
 * The other also has to iterate over the origina LRInput but that's not remotely where the bottleneck is
 * the bottleneck is retrieving the new currentKey - this requires retreiving from the map and then retrieving from array
 * 
 * I want to try one last one that's using an object instead of a map
 * that just barely edges out by like 100 microseconds
 * 
 * 
 * Ok level 2 is nothing like i expected. 
 * Not sure how to optimize this, it's pretty complex. 
 * I think I'll create the node object same aas before, and just add the nodes that end in A into an array
 * 
 * Then I guess I'll loop through the array, overwriting what's in it until the entire array is values that end in Z, counting each time I complete the loop
 * 
 * it's infinite looping. apparently that's a terrible solution
 * There's apparently a better way of doing it that I'm not thinking about
 * 
 * in the sample, there's a recursion - (XXX) = XXX, XXX. So once key goes to one of these
 * it ends up looping over itself constantly
 * 
 * ok this one is math again. I was kinda on the track but I discarded
 * the idea too soon. Something like finding least common denominator
 * or multiple or wwhatever of all the results. so just run level 1
 * code for each key, and from those answers you can find the results
 * apparently if you just run it, it's not nearly as efficient cuz you're waiting
 * for them all to line up. Will get the answers and then do somet more thinking
 * so I'm not just copying the answer.
 * 
 * 
 * Ok I cheated. it's the LCM (Least common multiple).
 * I've got the array of results mapped. Now I just find the least common multiple
 * Let's reasion about as to why that is. I'm a little confused as to how
 * 
 * Oh I see i see. I was thinking of least common factor or denominator or whatever
 * I was thinking it was going to be smaller. a multiple is anything that is divisible
 * by your number. so multiples of 4 are 4, 8, 12, 18, etc.
 * So basically I find the smallest number that is divisble by all of the nubmers in the array
 * 
 * LCM calculation is actually pretty involved. Maybe it will do better
 * to calculate a running lcm - so once you have 2 values, you get the lcm of those
 * 2 values. something like currentLCM. then every new value you get, you return the new LCM
 * 
 * Ok so I used some prior art but I think that's fine. on to the next
 */

const gcd = (a, b) => a ? gcd(b % a, a) : b;

const lcm = (a, b) => a * b / gcd(a, b);

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ input, lines }) => {

  const lrInput = Array.from(lines[0]).map(l => l === 'L' ? 0 : 1)
  const lrInputLength = lrInput.length

  const nodes = lines.slice(2).reduce((obj, line) => {
    obj[line.slice(0, 3)] = [line.slice(7, 10), line.slice(12, 15)]

    return obj
  }, {})

  let sum = 0
  let currentKey = 'AAA'

  while (currentKey !== 'ZZZ') {
    currentKey = nodes[currentKey][lrInput[sum % lrInputLength]]
    sum++
  }

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
  const lrInput = Array.from(lines[0]).map(l => l === 'L' ? 0 : 1)
  const lrInputLength = lrInput.length

  const keys = []
  const nodes = lines.slice(2).reduce((obj, line) => {
    const key = line.slice(0, 3)
    obj[key] = [line.slice(7, 10), line.slice(12, 15)]

    if (key[2] === 'A') {
      keys.push(key)
    }

    return obj
  }, {})

  const mappedKeys = keys.map( key => {
      let sum = 0
    
      while (key.at(-1) !== 'Z') {
        key = nodes[key][lrInput[sum % lrInputLength]]
        sum++
      }
      return sum
  })

  return mappedKeys.reduce(lcm)
};
