
/**
 * Determines the minimal coverage of the boolean function
 * represented by the given minterms.
 * @param  {array} minTerms [minterms of boolean function]
 * @return {array}          [minimal coverage (array of implicants)]
 */
function getMinimalCoverage(minTerms){

  if(minTerms.length == 0){
    return false;
  }

  let bitLength = getMinimumBitLength(minTerms);

  let primeImplicants = getPrimeImplicants(minTerms, bitLength);

  let essensialPrimeImplicants = getEssensialPrimeImplicants(primeImplicants);

  let essensialCoverage = getCoverageOf(essensialPrimeImplicants);

  let remainingMinTerms = minTerms.filter(function(minTerm){
    return !essensialCoverage.includes(minTerm);
  });

  if(remainingMinTerms.length == 0){
    return essensialPrimeImplicants;
  }

  let potentialHelperImplicants = primeImplicants.filter(function(primeImplicant){
    return !essensialPrimeImplicants.includes(primeImplicant);
  })

  let potentialExtraCovers = getAllElementCombinations(potentialHelperImplicants).filter(function(combination){
    return arrayIsSubsetOfArray(remainingMinTerms, getCoverageOf(combination));
  });

  let cheapestExtraCover = getCheapestMintermCoverage(potentialExtraCovers, bitLength);

  return essensialPrimeImplicants.concat(cheapestExtraCover);

}

/**
 * Returns the cheapest of the given minterm covers, determined by
 * {@link getMinTermCoverCost}.
 * @param  {array}  covers     [covers to find cheapest of]
 * @param  {number} bitLength  [required bit length of minterms]
 * @return {array}             [cheapest cover]
 */
function getCheapestMintermCoverage(covers, bitLength){

  let lowestCoverCost = bitLength*(2**bitLength);
  let cheapestCover;

  for(cover of covers){

    let coverCost = getMinTermCoverCost(cover, bitLength);

    if(coverCost < lowestCoverCost){

      lowestCoverCost = coverCost;

      cheapestCover = cover;

    }

  }

  return cheapestCover;

}

/**
 * Returns the number of literals required for the given cover.
 * @param  {array}  minTermCover [an array of implicants]
 * @param  {number} bitLength    [required bit length of minterms]
 * @return {number}              [total minterm cost]
 */
function getMinTermCoverCost(minTermCover, bitLength){

  let cost = 0;

  for(implicant of minTermCover){

    cost += (bitLength-implicant.length+1);

  }

  return cost;

}

/**
 * Returns the minimum required bit length to represent all the given
 * minterms in binary. This is simply the bit length of the largest minterm.
 * @param  {array} minTerms [array of minterms (numbers)]
 * @return {number}         [bit length of largest minterm]
 */
function getMinimumBitLength(minTerms){

  let largestMinTerm = minTerms.reduce(function(a,b){
    return Math.max(a,b);
  })

  return getBinary(largestMinTerm).length;

}

/**
 * Returns the minterms covered by the given prime implicants
 * @param  {array} primeImplicants [array of prime implicants]
 * @return {array}                 [asc. sorted array of minterms (numbers)]
 */
function getCoverageOf(primeImplicants){

  let coveredMinTerms = [];

  for(primeImplicant of primeImplicants){

    for(minTerm of primeImplicant){

      if(!coveredMinTerms.includes(minTerm)){

        coveredMinTerms.push(minTerm);

      }

    }

  }

  return coveredMinTerms.sort((a,b) => a-b);

}

/**
 * Returns the prime terms that cover a minterm not covered by any other of
 * the given prime terms.
 * @param  {array} primeImplicants [array of prime implicants]
 * @return {array}                 [array of essensial prime implicants]
 */
function getEssensialPrimeImplicants(primeImplicants){

  let minTermCoverage = {};

  for(let i = 0;i<primeImplicants.length;i++){

    let primeImplicant = primeImplicants[i];

    for(minTerm of primeImplicant){

      if(!(minTerm in minTermCoverage)){
        minTermCoverage[minTerm] = [];
      }

      minTermCoverage[minTerm].push(i);

    }

  }

  let essensialPrimeImplicants = [];
  let addedEssensialPrimeImplicants = [];

  for(minTerm of Object.keys(minTermCoverage)){

    let coverage = minTermCoverage[minTerm];

    if(coverage.length == 1 && !addedEssensialPrimeImplicants.includes(coverage[0])){
      essensialPrimeImplicants.push(primeImplicants[coverage[0]]);
      addedEssensialPrimeImplicants.push(coverage[0]);
    }

  }

  return essensialPrimeImplicants;

}

/**
 * Returns the prime implicants of the given minterms.
 * @param  {array}  minTerms  [array of minterms (numbers)]
 * @param  {number} bitLength [required bit length of minterms]
 * @return {array}            [array of prime implicants (lists)]
 */
function getPrimeImplicants(minTerms, bitLength){

  // Array of minterms represented by one-dimensional implicants
  let trivialMinTermImplicants = [];

  for(minTerm of minTerms){
    trivialMinTermImplicants.push([minTerm]);
  }

  return getNextLevelImplicants(trivialMinTermImplicants, [], bitLength);

}

/**
 * Recursive function that determines the next-level implicants
 * @param  {array}  implicants              [array of implicants]
 * @param  {array}  allImplicants           [array of all generated implicants]
 * @param  {number} bitLength               [required bit length of minterms]
 * @return {array}                          [array of next-level implicants]
 */
function getNextLevelImplicants(implicants, allImplicants, bitLength){

  let nextLevelImplicants = [];

  let implicantOneCountGroups = getOneCountImplicantGroups(implicants, bitLength);

  // Highest level implicants will never have any higher-level neighbours
  //allImplicants = allImplicants.concat(implicantOneCountGroups[implicantOneCountGroups.length-1]);

  for(let i = 0; i<implicantOneCountGroups.length - 1;i++){

    let implicantGroup = implicantOneCountGroups[i];

    let nextImplicantGroup = implicantOneCountGroups[i+1];

    for(implicant of implicantGroup){

      let neighbourImplicants = getImplicantNeighbours(implicant, nextImplicantGroup, bitLength);

      if(neighbourImplicants.length == 0){
        continue;
      }

      for(neighbourImplicant of neighbourImplicants){

        let concatImplicant = implicant.concat(neighbourImplicant);
        concatImplicant.sort((a,b) => a-b);

        if(!arrayContainsArray(nextLevelImplicants, concatImplicant)){
          nextLevelImplicants.push(concatImplicant);
        }

      }

    }

  }

  if(nextLevelImplicants.length == 0){
    // Reduce implicants to implicants not covered by higher level implicants
    return getNonRedundantImplicantsOf(allImplicants);
  }

  for(nextLevelImplicant of nextLevelImplicants){
    if(!arrayContainsArray(allImplicants, nextLevelImplicant)){
      allImplicants.push(nextLevelImplicant);
    }
  }

  return getNextLevelImplicants(nextLevelImplicants, allImplicants, bitLength);

}


function getNonRedundantImplicantsOf(implicants){

  let nonRedundant = [];

  for(implicant of implicants){

    let covered = false;

    for(let i = 0;i<implicants.length;i++){
      if(!arraysEqual(implicant, implicants[i]) && arrayIsSubsetOfArray(implicant, implicants[i])){
        covered = true;
      }
    }

    if(!covered){
      nonRedundant.push(implicant);
    }

  }

  return nonRedundant;

}

/**
 * Generates a two-dimensional array dividing the given implicants into
 * "one-count" groups. An implicant with a total of i 1-bits will be placed
 * in the array at index i in the returned array.
 * @param  {array}  implicants [implicants to group]
 * @param  {number} bitLength  [required bit length of minterms]
 * @return {array}             [array of implicant-groups]
 */
function getOneCountImplicantGroups(implicants, bitLength){

  let implicantsToGroup = [...implicants];

  let implicantGroups = new Array(bitLength+1).fill(0).map(() => new Array());

  while(implicantsToGroup.length > 0){

    let implicant = implicantsToGroup.pop();

    let oneCount = getOneCount(getImplicantString(implicant, bitLength));

    implicantGroups[oneCount].push(implicant);

  }

  // Remove empty one-groups
  implicantGroups = implicantGroups.filter(function(a){
    return a.length > 0;
  })

  return implicantGroups;

}

/**
 * Returns the implicants, among the given candidate implicants, that are
 * only one bit different from the given implicant.
 * @param  {array}  implicant           [implicant to find neighbours of]
 * @param  {array}  candidateImplicants [implicants to check for neighbourliness]
 * @param  {number} bitLength           [required bit length of minterms]
 * @return {array}                      [neighbour implicants]
 */
function getImplicantNeighbours(implicant, candidateImplicants, bitLength){

  let neighbours = [];

  let implicantString = getImplicantString(implicant, bitLength);

  for(candidateImplicant of candidateImplicants){

    let candImplicantString = getImplicantString(candidateImplicant, bitLength);

    let diffCount = 0;

    for(let b = 0;b<candImplicantString.length;b++){

      if(candImplicantString[b] != implicantString[b]){

        diffCount++;

        if(diffCount > 1){
          break;
        }

      }

    }

    // Only neighbour if total bit difference is 1
    if(diffCount != 1){
      continue;
    }

    neighbours.push(candidateImplicant);

  }

  return neighbours;

}

/**
 * Determines the number of 1's in the given string
 * @param  {string} s [string to be searched]
 * @return {number}   [number of 1's in s]
 */
function getOneCount(s){

  return (s.match(/1/g) || []).length;

}

/**
 * Returns the string representation of the given implicant
 * @param  {array}  implicant [array of minterms]
 * @param  {number} bitLength [description]
 * @return {string}           [string representation of implicant]
 */
function getImplicantString(implicant, bitLength){
  if(implicant.length == 1){
    return getPaddedBinary(implicant[0], bitLength);
  }

  if(implicant.length % 2 != 0){
    throw "Odd number of minterms: " + implicant;
  }

  let minTermStrings = [];

  for(minTerm of implicant){

    minTermStrings.push(getPaddedBinary(minTerm, bitLength));

  }

  return getCombinedImplicantStrings(minTermStrings, bitLength);

}

/**
 * Returns the combination of the given implicant strings.
 * This is performed by recursively combining pairs of strings until
 * everything is combined into one string.
 * @param  {array}  implicantStrings [string representations of implicants]
 * @param  {number} bitLength        [required bit length of minterms]
 * @return {string}                  [string representation of combination]
 */
function getCombinedImplicantStrings(implicantStrings, bitLength){

  let combined = [];

  for(let i = 0;i<implicantStrings.length;i+=2){

    let pairString = getCombinedImplicantStringsPair(
      implicantStrings[i],
      implicantStrings[i+1]
    );

    combined.push(pairString);

  }

  if(combined.length == 1){
    return combined.toString();
  }

  return getCombinedImplicantStrings(combined, bitLength);

}

/**
 * Combines two neighbouring implicant strings into a common implicant string.
 * @param  {string} implicantA [string representation of implicant]
 * @param  {string} implicantB [string representation of implicant]
 * @return {string}            [string representation of combination]
 */
function getCombinedImplicantStringsPair(implicantA, implicantB){

  let combined = implicantA;

  for(let i = 0;i<implicantA.length;i++){

    let aBit = implicantA[i];
    let bBit = implicantB[i];

    if(aBit != bBit){

      if(aBit != "0" && aBit != "1" || bBit != "0" && bBit != "1"){
        throw "Cannot combine non-binary bits"
      }

      combined = implicantA.substr(0,i) + "-" + implicantA.substr(i+1);
    }

  }

  return combined;

}

/**
 * Returns the binary string representation of the given number, padded with
 * extra 0's to conform to given length requirement.
 * @param  {number} n      [number]
 * @param  {number} length [length of binary string]
 * @return {string}        [binary string]
 */
function getPaddedBinary(n, length){

  let binary = getBinary(n);

  if(binary.length > length){
    throw "Requested binary length was too small for " + n + " : " + length;
  }

  return binary.padStart(length,"0");

}

/**
 * Returns the binary string representation of the given number,
 * with minimal length.
 * @param  {number} n [number]
 * @return {string}   [binary string]
 */
function getBinary(n){

  return n.toString(2);

}

/**
 * Returns the string representation of a given minterm coverage
 * @param  {array}  coverage [array of implicants covering minterms]
 * @param  {array}  minTerms [array of covered minterms]
 * @return {string}          [string representation of cover]
 */
function getMinTermCoverageString(coverage, minTerms){

  if(!coverage){
    return "False";
  }

  let resultString = "";

  let bitLength = getMinimumBitLength(minTerms);

  if(2**bitLength == minTerms.length){
    return "True";
  }

  for(implicant of coverage){

    let implicantString = getImplicantString(implicant, bitLength);

    let letterizedImplicantString = getLetterizedImplicantString(implicantString);

    resultString += letterizedImplicantString + " + ";

  }

  // Remove trailing " + "
  return resultString.substring(0,resultString.length-2);

}


/**
 * Returns letter representation of a given implicant string.
 * Every letter represents a position (A -> 0, B -> 1, C -> 2 etc.).
 * '0' is replaced with the positions letter and a negation bar
 * '1' is replaced with the positions letter
 * '-' is removed
 * @param  {string} implicantString
 * @return {string}                 [letterized implicant string]
 */
function getLetterizedImplicantString(implicantString){

  let letterized = "";

  for(let i = 0;i<implicantString.length;i++){

    switch (implicantString[i]) {
      case "0":
        letterized += String.fromCharCode(65+i) + "&#x0305;"; // Negation bar
        break;
      case "1":
        letterized += String.fromCharCode(65+i);
        break;
      // Ignore don't care symbol '-'
    }
  }

  return letterized;

}
