EJS - Enhanced JS / Example JS
==============================
This software is a playground to develop compiled JavaScript language extensions. 
It is based on the [OMeta/JS parser generator](https://github.com/alexwarth/ometa-js).
If you have any questions, dont hestitate to contact me.

You can try the new syntax at the [online demonstration](https://b-studios.github.com/ejs).

Usage
-----
### OMeta/JS Package #
The OMeta/JS implementation can be used standalone without all other packages.

    // @file some-ometa-file.ojs
    ometa MyGrammar {
     // implementation
    }
    module.exports = MyGrammar // yes, it is a node module

If you wish to include an OMeta grammar into a project you just have to load OMeta first.

    // @file another-file.js
    require('./lib/ometa');
    var grammar = require('./some-ometa-file.ojs');
    
The file will automatically be compiled to JavaScript and the grammar object is returned.

### ES5 Parser and Translator #
The ES5Parser can be used to analyze a piece of code.

    // @file anaylzer.js
    var es5 = require('./lib/es5');
    var tree = es5.parse('var foo = 4');

The tree also can be translated back to JavaScript:

    es5.translate(tree); //=> var foo=4

The tree consists of nodes, which are defined in `lib/es5/nodes.js`. Node constructors can
be used to create a tree by hand.

    var _ = es5.nodes;
    var tree = _.Program(_.VarDeclStmt([_.VarBinding(_.Id("foo"), _.Number(4))]))
    es5.translate(tree); //=> var foo=4

A combined method `compile` can be used to perform parsing and translation at the same time:

    es5.compile('var foo = 4'); //=> var foo=4


### EJS Language Extensions #
The example implementation can be found in the folder `lib/ejs`. The extension can be used
the same way as the es5-package.

One simple example is the extension `loop {}` which simple desugars to `for(;;){}`. 
This statement can be compiled to JavaScript by calling:

    // @file some-compiler.js
    var ejs = require('./lib/ejs');
    var ejs_tree = ejs.parse("loop {}");
    var es5_tree = ejs.translate(ejs_tree);
    var code = ejs.generate(es5_tree); // this is equivalent to `es5.translate`
    //=> for(;;) {}

Again there is a combined method `compile`

    var code = ejs.compile("loop {}"); //=> for(;;) {}
    
But the ejs-package can also be used like the ometa-package:

    // @file adder.ejs
    module.exports = {|a,b| a + b }

    // @file some-other-file.js
    require('./lib/ejs');
    var adder = require('./adder.ejs');
    adder(4, 2); //=> 6

In addition a small command line wrapper `ejs` can be used.

    // @file some-file.ejs
    !{
      console.log("Hello World.");
    }

On console type

    > ./ejs some-files.ejs
    Hello World

Example Extensions
==================
The implementation of the example extensions is divided into three parts:

1. The parsing frontend (`./lib/ejs/grammars/ejs_parser.ojs`)
2. The node-types (`./lib/ejs/nodes.js`)
3. The translator (`./lib/ejs/grammars/ejs_translator.ojs`)

To name just a few extensions:


Scope Forcing Operator
----------------------
Since JavaScript only supports function-scoping the force scoping operator creates an
anonymous function and immediately executes it:

*EJS*
    !{ var foo = 4 }

*JavaScript*
    (function() { var foo = 4 })()

Of course, this can be used for revealing modules:

    var mod = !{
      // ...
      return something;
    }

String Substitution
-------------------
This one is adopted from Ruby to interpolate expressions into strings:

*EJS*
    var foo = "Hello #{name}"

*JavaScript*
    var foo = ["Hello ", name].join('');


Lambda Expressions
------------------
Since the function keyword can be annoying some time, a shorter (again Ruby-like) syntax
is introduced:

*EJS*
    var foo = {|a,b| a + b }

*JavaScript*
    var foo = function(a, b) { return a + b }

Also a new way to call functions has been added:

*EJS*
    $.getJSON("something.php") {|data| console.log(data) }

*JavaScript*
    $.getJSON("something.php", function(data) { console.log(data) });


Classes
-------
There is a specialty about classes: A runtime-mapping is performed to allow a late binding
of the desired class-implementation:

*EJS*
    class Person {
      name: "Anonymous"
      say_hello: {|| "Hello my name is #{this.name}" }
    }

*JavaScript*
    Object.define_class("Person", {
      parent_name: undefined,
      get_parent: function() {
        return
      },
      set_class: function(__class__) {
        Person = __class__
      },
      constructor: undefined,
      sections: {},
      spec: {
        name: "Anonymous",
        say_hello: function() {
          return ["Hello my name is ", this.name].join("")
        }
      }
    });

For instance a binding to the Mootools class system could look like:

    Object.define_class = function(name, desc) {
      var klass  = desc.spec,
          parent = desc.get_parent();

      if(parent)
        klass.Extends = parent;

      klass.initialize = desc.constructor;
      desc.set_class(new Class(klass));
    }


Foreign Projects and Sources
============================
The following projects have been used to realize (or inspired) this toolkit.

For the Compilation Framework
-----------------------------
- [OMeta/JS](https://github.com/alexwarth/ometa-js) by Alessandro Warth (parser Generator and basic foundation for `ES5Parser` and `ES5Translator`)
- [Node.js](http://nodejs.org/) by Joyent, Inc (runtime environment)
- [es-lab](http://code.google.com/p/es-lab) by Tom Van Cutsem and others  (unicode-categories)
- [esprima](http://www.esprima.org/) by Ariya Hidayat (used some tests)

For the Demo-Page
-----------------
- [jQuery](http://jquery.com/) by John Resig
- [jsconsole](http://jsconsole.com/) by Remy Sharp
- [jsbeautifier](http://jsbeautifier.org/)
- [prettify](http://code.google.com/p/google-code-prettify/)
- [Sass](http://sass-lang.com/)

Other Inspiration
-----------------
- [es-lab](http://code.google.com/p/es-lab) - they use JsonML as AST-structure
- [CofeeScript](http://coffeescript.org/) - always a great source of inspiration when it comes to transpiling
- [JsonML](http://jsonml.org/) - a great data-format
