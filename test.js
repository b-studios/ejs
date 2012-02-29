#!/usr/local/bin/node
var opts = {
  show_success: false
}

var start = new Date();
var tester = require('./tests/testrunner.js');

var es5    = require('./lib/es5'),
    ejs    = require('./lib/ejs');

var loading = new Date() - start;

var tests = {
  es5: require('./tests/es5.js'),
  ejs: require('./tests/ejs.js'),
  esprima: require('./tests/esprima_tests.js')
}

// Run Tests

tester.run_and_report("ES5-Tests", tests.es5, function(input) {
  return es5.compile(input)
}, opts);

tester.run_and_report("Eprima-Tests", tests.esprima, function(input) {
  return es5.compile(input)
}, opts);

tester.run_and_report("EJS-Tests", tests.ejs, function(input) {
  return ejs.compile(input)
}, opts);

tester.run_and_report("EJS-Compatibility", tests.es5, function(input) {
  return ejs.compile(input)
}, opts);

tester.run_and_report("EJS-Compatibility", tests.esprima, function(input) {
  return ejs.compile(input)
}, opts);

console.log("\n\nloading: ", loading, "ms");
console.log("total:   ", new Date() - start, "ms");

