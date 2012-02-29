module.exports = {

  // Numeric Literals
  "var foo = 0x444"                        : "var foo=0x444",
  "var foo = 444"                          : "var foo=444",
  "var foo = 0.578e5"                      : "var foo=0.578e5",
  "10e-2 + 20e-2"                          : "10e-2 + 20e-2",

  // escaped characters
  '"\\u1234"'                              : '"\\u1234"',
  '"\\x44"'                                : '"\\x44"',
  '"\\n"'                                  : '"\\n"',
  'var multiline = "Foo \\\n escaped"'     : 'var multiline="Foo \\\n escaped"',

  // Force Curly Braces
  "if(true) do_it(); else dont();"         : "if(true){do_it()}else{dont()}",
  "if(true){do_it()} else{dont()}"         : "if(true){do_it()}else{dont()}",
  "while(true) do_it();"                   : "while(true){do_it()}",
  "while(true){do_it()}"                   : "while(true){do_it()}",
  "do { it() } while(true);"               : "do{it()}while(true)",
  "for(;;) do_it()"                        : "for(;;){do_it()}",
  "for(;;) {do_it()}"                      : "for(;;){do_it()}",
  "for(var i=0,len=arr.length;i<len;i++) {do_it()}": 
    "for(var i=0,len=arr.length;i < len;i++){do_it()}",

  "if(true) { do_it() }"                   : "if(true){do_it()}",

  "if(true) do_it();"                      : "if(true){do_it()}",

  // Array literals
  "[]"                                     : "[]",
  "[1]"                                    : "[1]",
  "[1,2,3]"                                : "[1,2,3]",
  "[[]]"                                   : "[[]]",
  "[foo(), bar[2], baz.bam]"               : "[foo(),bar[2],baz.bam]",

  // Object literals
  'var f = { get foo() { return this.foo } }': 
    'var f={get foo(){return this.foo}}',

  "for(var i in arr) {}"                   : "for(var i in arr){}",

  

  // member, call and new expressions
  "foo"                                    : "foo",
  "foo.bar"                                : "foo.bar",
  "foo.bar()"                              : "foo.bar()",
  "bar()"                                  : "bar()",
  "bar()()"                                : "bar()()",
  "foo.bar().baz"                          : "foo.bar().baz",
  "foo().bar"                              : "foo().bar",
  "new Foo()"                              : "new Foo()",
  "new foo.bar.Baz()"                      : "new foo.bar.Baz()",
  "new Foo"                                : "new Foo",
  "new new Foo"                            : "new new Foo",
  "new foo().bar"                          : "new foo().bar",
  "new function(){}"                       : "new function(){}",


  "with(foo.bar) do_it();"                 : "with(foo.bar){do_it()}",

  "try{this} catch(e){me} finally{done}"   : "try{this}catch(e){me}finally{done}",
  "try{this} finally{done}"                : "try{this}finally{done}",
  "try{this} catch(e){me}"                 : "try{this}catch(e){me}",

  "function Sum(a, b, c){return a+b+c}"    : "function Sum(a,b,c){return a + b + c}",

  "function Sum ( a, b, c ) { return }"    : "function Sum(a,b,c){return }",

  "!--jQuery.readyWait"                    : "! --jQuery.readyWait",
  
  "var foo = \"undefined\""                : "var foo=\"undefined\""

}


