
window.onload = function(){

  console.log(arraysEqual(
    getMinimalCoverage([5,7,11,12,27,29], [14,20,21,22,23]), // Actual value
    [[5,7,21,23],[11,27],[12,14],[21,29]]                    // Expected value
  ));

  console.log(arraysEqual(
    getMinimalCoverage([1,3,4,5], []), // Actual value
    [[1,3],[4,5]]                      // Expected value
  ));

  console.log(arraysEqual(
    getMinimalCoverage([0,1,5,7,8,10,12,13,14,15], []), // Actual value
    [[5,7,13,15],[8,10,12,14],[0,1]]                    // Expected value
  ));

}

function sanitizeTermsInput(input){

  let inputValue = input.value;

  let sanitized = inputValue
        .replace(/[^\d,]/g, "") // Removes all characters except digit and comma
        .replace(/,+/g,',') // Removes any excessive commas
        .replace(/,\s*$/g, "") // Removes any trailing comma
        .replace(/^,\s*/g, "") // Removes any leading comma
  ;

  input.value = sanitized;

}

function getTermsFromInput(input){

  if(input == ""){
    return [];
  }

  return input.split(",").map((num) => parseInt(num));

}

function displayResult(result){

  document.getElementById("minimal_coverage_result").innerHTML = result;
  document.getElementById("result_section").classList.remove("hide");

}

function resetResult(){

  document.getElementById("minimal_coverage_result").innerHTML = "";
  document.getElementById("result_section").classList.add("hide");

}


/**
 * Uses the tabular method to find minimal coverage of the boolean function
 * represented by the user-provided minterms.
 * The result is then displayed to the user.
 */
function displayMinimalCoverageOfInput(){

  let minTermsInput = document.getElementById('min_terms_input');
  sanitizeTermsInput(minTermsInput);

  let dontCareTermsInput = document.getElementById('dont_care_terms_input');
  sanitizeTermsInput(dontCareTermsInput);

  let minTerms = getTermsFromInput(minTermsInput.value);
  let dontCareTerms = getTermsFromInput(dontCareTermsInput.value);

  let minimalCoverage = getMinimalCoverage(minTerms, dontCareTerms);

  let resultString = getMinTermCoverageString(minimalCoverage, minTerms);

  displayResult(resultString);

}
