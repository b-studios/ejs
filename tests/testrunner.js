// repeat a string
function repeat(str, times) {
  return Array(times+1).join(str);
}

function run(tests, action) {

  var failed = {},
      success = {};

  for(input in tests) {
    if(tests.hasOwnProperty(input)) {
    
      //try {  
        var expectation = tests[input];
      
        var start   = new Date(),
            result  = action(input),
            elapsed = new Date() - start; 

        if(result !== expectation)
          failed[input] = {
            expected: expectation,
            got: result,
            time: elapsed
          };

        else
          success[input] = { 
            expected: expectation,
            time: elapsed
          };
      /*} catch(e) {
        console.error("Error while testing: ", input, "Message:", e);
      }*/
    }
  }

  return {
    success: success,
    failed: failed
  }
}

function report(name, results, opts) {
  
  // print name:
  console.log("\n"+name);
  console.log(repeat("=", name.length));

  if(opts.show_success) {

    console.log("Tests successful:")
    console.log("-----------------")
    for(var test in results.success) {
      if(results.success.hasOwnProperty(test)) {
        var result = results.success[test];
        console.log(" ", test, "  (" + result.time + "ms)");
      } 
    }

  }

  console.log("\nTests failed:")
  console.log("-------------")
  for(var test in results.failed) {
    if(results.failed.hasOwnProperty(test)) {
      var result = results.failed[test];
      console.error(" ", test);
      console.log("    expected:'" + result.expected + "'")
      console.log("    got:     '" + result.got      + "'")
      console.log("\n")
    } 
  }
}

module.exports = {
  run: run,
  report: report,
  run_and_report: function(name, tests, action, opts) { 
    report(name, 
      run(tests, action), opts) 
  }
}
