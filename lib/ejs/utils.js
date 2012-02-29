var es5 = require('../es5');

// NOTES on Optimization
// =================================
// maybe there is a better way for this. Compile the expression one time and add unique
// placeholder values. These Values could be replaced later on.
//
// There are pros and cons for a replacement-strategy
//
// Note by Stephan: Maybe something like a `printf`-syntax could be helpful:
//    stmt("for(%e;%e;%e) %s", expr, expr, expr, stmt)
//
// This way a parser knows, what it should expect and a replacement can be performed
// later on.
//
// Another way would be the insertion of a unique token like `@repl_1345` and a replace-
// ment map like: { "repl_1345": [Object object], "repl_1346": [Object object], … }
//
// Problems:
// ---------
// We may gain performance by not translating the AST-nodes to String and parsing them
// again later on. But to replace all unique ids we need a second transformation-pass
// (maybe by a special translator). If the inserted code is large compared to the template
// code the benefits overweight the disadvantages.
// If the template-code is larger then the nested AST this method may cause additional
// overhead.
//
// In either way we need to make changes to the parser to allow generic expressions,
// statements or unique-ids.
//
// Big Advantage
// -------------
// The replacement-way could be compiled once, and then be used multiple times for
// replacements. For example the class-template could be used for every class-definition
// after one time compilation and memoization.
function parser_shorthand(rule) {
  return function() {

    var input = [];
    // process input arguments, if they are not string, we have to translate them to code  
    for(var i=0,len=arguments.length;i<len;i++) {
      var arg = arguments[i];
      if(typeof arg !== 'string')
        arg = es5.translate(arg);

      input.push(arg);
    }
    return es5.parser.matchAll(input.join(''), rule)
  }
}

var utils = {
  stmt: parser_shorthand('stmt'),
  expr: parser_shorthand('expr')
}

module.exports = utils;
