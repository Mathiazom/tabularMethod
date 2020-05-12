
function sanitizeMinTermsInput(input){

  let inputValue = input.value;

  let sanitized = inputValue
        .replace(/[^\d,]/g, "") // Removes all characters except digit and comma
        .replace(/,+/g,',') // Removes any excessive commas
        .replace(/,\s*$/g, "") // Removes any trailing comma
        .replace(/^,\s*/g, "") // Removes any leading comma
  ;

  input.value = sanitized;

}

function getMintermsFromInput(input){

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

  let input = document.getElementById('min_terms_input');

  sanitizeMinTermsInput(input);

  let minTerms = getMintermsFromInput(input.value);

  let minimalCoverage = getMinimalCoverage(minTerms);

  let resultString = getMinTermCoverageString(minimalCoverage, minTerms);

  displayResult(resultString);

}
