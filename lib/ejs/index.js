require('../ometa');

var fs         = require('fs'),
    es5        = require('../es5'),
    parser     = require('./grammars/ejs_parser.ojs'),
    translator = require('./grammars/ejs_translator.ojs');

var ejs = module.exports = {
  
  nodes:      require('./nodes.js'),
    
  parser:     parser,
  translator: translator,
  generator:  es5.translator,
  
  parse:      parser.parse,
  translate:  translator.translate,
  generate:   es5.translate,

  compile: function(input) {
    return es5.translate(
             ejs.translate(
               ejs.parse(input)));
  }
}

// register new file-extension
// inspired by https://github.com/jashkenas/coffee-script/blob/master/lib/coffee-script/coffee-script.js
require.extensions['.ejs'] = function(module, filename) {
  var ejs_code = fs.readFileSync(filename, 'utf8');
  var js_code  = ejs.compile(ejs_code);
  return module._compile(js_code, filename);
};
