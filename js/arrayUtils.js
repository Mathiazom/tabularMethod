
/**
 * Generates array of all ordered combinations of the given elements,
 * at combination lengths within [1,elements.length].
 * @param  {array} elements
 * @return {array}
 */
function getAllElementCombinations(elements){

  let combinations = [];

  for(let i = 1;i<elements.length;i++){

    let indexCombinations = getAllIndexCombinations(elements.length, i);

    for(indexCombination of indexCombinations){

      let combination = [];

      for(index of indexCombination){

        combination.push(elements[index]);

      }

      combinations.push(combination);

    }

  }

  return combinations;

}



/**
 * Generates array of all ordered number combinations within
 * range [1, totalIndices] of a given length, and without repetition.
 * This is performed using recursion.
 * @param  {number} totalIndices
 * @param  {number} length
 * @return {array}
 */
function getAllIndexCombinations(totalIndices, length){

  let combinations = [];

  if(length == 1){

    for(let i = 0;i<totalIndices;i++){

      combinations.push([i]);

    }

    return combinations;

  }

  let preCombinations = getAllIndexCombinations(totalIndices, length-1);

  for(let i = 0;i<totalIndices;i++){

    for(preCombination of preCombinations){

      if(preCombination.includes(i)){
        continue;
      }

      let potentialCombination = preCombination.concat(i).sort();

      if(!arrayContainsArray(combinations, potentialCombination)){
        combinations.push(potentialCombination);
      }


    }

  }

  return combinations;

}

/**
  Searches through a given array to find the index pointing the the second array
  @param a the array to search through
  @param b the array to search for. The index, if found,
  will point to this array inside @param a
*/
function getIndexOfArrayInArray(a, b){

  for(let i = 0;i<b.length;i++){

    if(arraysEqual(b[i], a)){
      return i;
    }

  }

  return -1;

}


function arrayContainsArray(a, b){

  return getIndexOfArrayInArray(b, a) != -1;

}


function arrayIsSubsetOfArray(a,b){

  for(el of a){
    if(!b.includes(el)){
      return false;
    }
  }

  return true;

}


function arraysEqual(a, b) {

  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  
  return true;

}
