var tests = {
  "if(true){do_it()}" : "if(true){do_it()}",


  "nil"                                    : "undefined",

  "foo.bar['baz']"                         : 'foo.bar["baz"]',

  // SEMI-Keywords
  "var not = 4, unless = 6, loop = {||}"   : "var not=4,unless=6,loop=function(){}",
  "var foo = not(foo == bar)"              : "var foo = not(foo == bar)",                // ERROR => `var foo = !(foo == bar)`
  "var bar = not + 4"                      : "var bar = not + 4;",                       // ERROR => `var bar = ! +4`


  // rest
  "var foo = function(first, ...rest) {return rest;}"  : 
    "var foo=function(first){var rest=[].slice.call(arguments,1);\nreturn rest}",

  // EXPRESSIONS

  // LambdaExpr
  "var f={||}"                             : "var f=function(){}",                       // don't return undefined if empty
  "var f={|a|}"                            : "var f=function(a){}", 
  "var f={|a, b, c|}"                      : "var f=function(a,b,c){}", 
  "var f={|| 3}"                           : "var f=function(){return 3}",               // implicitly return expressions
  "var f={|a| a}"                          : "var f=function(a){return a}",
  "var f={|a| a++}"                        : "var f=function(a){return a++}",
  "var f={|a, b| a > b}"                   : "var f=function(a,b){return a > b}",
  'var f={|| "Hello"}'                     : 'var f=function(){return "Hello"}',
  "var f={|| return 4}"                    : "var f=function(){return 4}",               // don't double existing return
  "var f={|| if(true) { foo; } }"          : "var f=function(){if(true){foo}}",          // don't return statements
  "var f={|| while(true) { foo; } }"       : "var f=function(){while(true){foo}}", 

  // implicitly return EJS-Expressions
  'var f={|a| "boo #{a} foo"}': 
    'var f=function(a){return ["boo ",a," foo"].join("")}',

  // LambdaExpr as last argument
  '$.getJSON("/data.php") { |el| return nil; }.foo {|el|  el.bar()}':
    '$.getJSON("/data.php",function(el){return undefined}).foo(function(el){return el.bar()})', 

  '$(".nodes").each {|el| el.awesome() }.foo.member.map("reverse") {|el| el*2 };':
    '$(".nodes").each(function(el){return el.awesome()}).foo.member.map("reverse",function(el){return el * 2})',

  // StringExpr
  'var s=""'                               : 'var s=""',                                 // empty strings stay empty strings
  'var s="something"'                      : 'var s="something"',                        // simple strings stay simple strings
  'var s="#{foo}"'                         : 'var s=[foo].join("")',
  'var s="Hello #{name}"'                  : 'var s=["Hello ",name].join("")',  
  'var s="Hello #{name} and bye"'          : 'var s=["Hello ",name," and bye"].join("")', 
  'var s="Hello #{name} and bye #{name}"'  : 
    'var s=["Hello ",name," and bye ",name].join("")',

  // ScopeExpr
  '!{}'                                    : '(function(){})()',
  '!{var foo = 5; bar(foo)}'               : '(function(){var foo=5;\nbar(foo)})()',

  // SliceExpr
  'foo[1..2]'                              : 'foo.slice(1,2)',
  
  'baz[3 .. $]'                            : 'baz.slice(3)',
  
  'baz[3 .. -2]'                           : 'baz.slice(3,- 2)',
  
  'foo.bar.baz[-3 .. $]'                   : 'foo.bar.baz.slice(- 3)',
  
  'baz()[3 .. $]'                          : 'baz().slice(3)',
  
  // monocular mustage expression
  'foo.bar.{ fou: 4, baz: 9}'              : 'Object.extend(foo.bar,{fou: 4,baz: 9})',

  // additionally as operator
  'foo.bar .= { fou: 4, baz: 9}'           : 'Object.extend(foo.bar,{fou: 4,baz: 9})',

  // TriangleExpression
  'base <| { foo: 4, bar: 5}'              : 'Object.proto({foo: 4,bar: 5},base)',
  // check operator precedence
  'base <| {}.foo'                         : 'Object.proto(function(){},base)',
  // working with other base-types
  'base <| {||}'                           : 'Object.proto(function(){},base)',

  // instance expression
  '@foo'                                   : 'this.foo',
  '@foo.bar'                               : 'this.foo.bar',
  '@foo.bar()'                             : 'this.foo.bar()',


  // STATEMENTS
  
  // LoopStmt
  "loop {}"                                : "for(;;){}",
  "loop { do_it(); }"                      : "for(;;){do_it()}",

  // optional braces for if and unless
  "if foo { do_it() }"                     : "if(foo){do_it()}",
  "unless foo { do_it() }"                 : "if(! (foo)){do_it()}",
  "if foo and bar { do_it() }"             : "if(foo && bar){do_it()}",
  "if true {do_it()} else dont()"          : "if(true){do_it()}else{dont()}",

  // postIf and postUnless
  "do_it() if good"                        : "if(good){do_it()}",
  "do_it() unless good"                    : "if(! (good)){do_it()}",
  "foo().bar + foo unless foo and bar"     : "if(! (foo && bar)){foo().bar + foo}",

  // DebugStmt
  'debug console.log("error");'            : 'if(typeof $DEBUG != "undefined"){console.log("error")}',


  // ModuleStmt
  'module Foo {}'                          : 'Object.define_module("Foo",function(){})',
  'module Foo.bar {}'                      : 'Object.define_module("Foo.bar",function(){})',
  'module Foo { var foo = 5; }'            : 
    'Object.define_module("Foo",function(){var foo=5})', 
  // ForOfStmt
  'for(var foo of arr) console.log(arr[foo])' :
    'for(var foo in arr){if(arr.hasOwnProperty(foo)){console.log(arr[foo])}}',

  'for(var foo, el of arr) console.log(el)' :
    'for(var foo in arr){if(arr.hasOwnProperty(foo)){var el=arr[foo];\nconsole.log(el)}}',

  'for(var foo, el of arr) { console.log(el) }' :
    'for(var foo in arr){if(arr.hasOwnProperty(foo)){var el=arr[foo];\nconsole.log(el)}}',

  'function Foo(obj) { for(var key, prop of obj) { clone[key] = prop } }' :
    'function Foo(obj){for(var key in obj){if(obj.hasOwnProperty(key)){var prop=obj[key];\nclone[key]=prop}}}',

  // ForInStmt - additional behaviour
  'for(var foo, el in arr) console.log(el)' :
    'for(var foo in arr){var el=arr[foo];\nconsole.log(el)}',



  // ClassStmt
  'class Foo {}': 
    'Object.define_class("Foo",{parent_name: undefined,get_parent: function(){return },set_class: function(__class__){Foo=__class__},constructor: undefined,sections: {},spec: {}})',
  
  // inheritance
  'class Foo < Bar {}': 
    'Object.define_class("Foo",{parent_name: "Bar",get_parent: function(){return Bar},set_class: function(__class__){Foo=__class__},constructor: undefined,sections: {},spec: {}})',

  // empty section (Boolean sections)
  'class F { singleton }': 
    'Object.define_class("F",{parent_name: undefined,get_parent: function(){return },set_class: function(__class__){F=__class__},constructor: undefined,sections: {singleton: []},spec: {}})',

   // empty section with braces
  'class F { configs {} }': 
    'Object.define_class("F",{parent_name: undefined,get_parent: function(){return },set_class: function(__class__){F=__class__},constructor: undefined,sections: {configs: []},spec: {}})',

  // section with one value only
  'class F { override "ClassB" }': 
    'Object.define_class("F",{parent_name: undefined,get_parent: function(){return },set_class: function(__class__){F=__class__},constructor: undefined,sections: {override: ["ClassB"]},spec: {}})',
 
  // section with multiple values (inline)
  'class F { conf 1, 2, 3 }': 
    'Object.define_class("F",{parent_name: undefined,get_parent: function(){return },set_class: function(__class__){F=__class__},constructor: undefined,sections: {conf: [1,2,3]},spec: {}})',

  // section with multiple values (multiline)
  'class F { conf 1, \n2, \n3 }': 
    'Object.define_class("F",{parent_name: undefined,get_parent: function(){return },set_class: function(__class__){F=__class__},constructor: undefined,sections: {conf: [1,2,3]},spec: {}})',

  // 2 sections multiline
  'class F { conf 1, \n2 \nmoo }': 
    'Object.define_class("F",{parent_name: undefined,get_parent: function(){return },set_class: function(__class__){F=__class__},constructor: undefined,sections: {conf: [1,2],moo: []},spec: {}})',
  
  // multiple values braced
  'class F { conf {1,2,3} }': 
    'Object.define_class("F",{parent_name: undefined,get_parent: function(){return },set_class: function(__class__){F=__class__},constructor: undefined,sections: {conf: [1,2,3]},spec: {}})',

  // key value braced (comma seperated)
  'class F { conf { foo: 1, bar: 2 } }':
    'Object.define_class("F",{parent_name: undefined,get_parent: function(){return },set_class: function(__class__){F=__class__},constructor: undefined,sections: {conf: {foo: 1,bar: 2}},spec: {}})',

  // key value braced without commas
  'class F { conf { foo: 1\n bar: 2 } }':
    'Object.define_class("F",{parent_name: undefined,get_parent: function(){return },set_class: function(__class__){F=__class__},constructor: undefined,sections: {conf: {foo: 1,bar: 2}},spec: {}})',

  // multiple values with expressions
  'class F { conf { foo.baz["foo"], new bar(), baz } }': 
     'Object.define_class("F",{parent_name: undefined,get_parent: function(){return },set_class: function(__class__){F=__class__},constructor: undefined,sections: {conf: [foo.baz["foo"],new bar(),baz]},spec: {}})',

  // simple properties
  'class F { foo: {} }': 
    'Object.define_class("F",{parent_name: undefined,get_parent: function(){return },set_class: function(__class__){F=__class__},constructor: undefined,sections: {},spec: {foo: {}}})', 
  'class F { foo: "Hello" }': 
    'Object.define_class("F",{parent_name: undefined,get_parent: function(){return },set_class: function(__class__){F=__class__},constructor: undefined,sections: {},spec: {foo: "Hello"}})',
  'class F { foo: {||} }': 
    'Object.define_class("F",{parent_name: undefined,get_parent: function(){return },set_class: function(__class__){F=__class__},constructor: undefined,sections: {},spec: {foo: function(){}}})',

  // sections followed by properties
  'class F { conf 1, \n2 \nmoo \n foo: 42\n bar: {||} }':
    'Object.define_class("F",{parent_name: undefined,get_parent: function(){return },set_class: function(__class__){F=__class__},constructor: undefined,sections: {conf: [1,2],moo: []},spec: {foo: 42,bar: function(){}}})',
}

// Complete class example
/*
tests[(['class Plains.Driver < Plains.Base {',
  'singleton',

  'override "My.life"',

  'something foo, bar, baz',
  
  'configs {}',

  'mixins {',
    'foo: Foo',
    'bar: Bar',
    'boo: function() {}',
  '}',

  'commas {',
    'foo: "bar",',
    'baz: "bam"',
  '}',

  'array { foo, bar, baz }',

  'calculated {',
    'foo.baz["foo"],',
    'new bar().baz,',
    'baz',
  '}',  

  'url: {}',
  'name: "Hallo"',

  'create: function(){}',
  'read: function(){}',
  'update: function(){}',
  'destroy: function(){}',
'}'].join("\n"))] = '';




class Plains.Driver < Plains.Base {
  singleton

  override "My.life"

  something foo, bar, baz
  
  configs {}

  mixins {
    foo: Foo
    bar: Bar
    boo: function() {}
  }

  commas {
    foo: "bar",
    baz: "bam"
  }

  array { foo, bar, baz }

  calculated {
    foo.baz["foo"],
    new bar().baz,
    baz
  }

  url: {}
  name: "Hallo"

  create: function(){}
  read: function(){}
  update: function(){}
  destroy: function(){}
}


*/

module.exports = tests;
