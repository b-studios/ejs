// extend es5 nodes
ejs.nodes = Object.create(es5.nodes);

// prepare node-registry
var register = function(type) {

  var nodetype = jsonml.factory.apply(null, arguments);
  
  // register new nodetype
  ejs.nodes[type] = nodetype;
};


/**
 * Lambda
 * ------
 * A shorthand version of a function expression.
 *
 * Example usage:
 * instead of writing `function(){}` you may write `{||}` and
 * instead of writing `function(arg){ return arg*2; }` you may write `{|arg| arg*2; }`
 *
 * To provide backward-compatibility implicit returns are only enabled for lambdas
 *
 * @argument [FunctionArgs] args
 * @argument [BlockStmt] body It's an AST-node and hence looks like: `[#BlockStmt, {}, child1, ...]`
 */
register('LambdaExpr');


/**
 * FunctionArgs with rest-parameter
 * --------------------------------
 * TODO implement
 * 
 * Representation:
 *     [#FunctionArgs, { rest: "r"}, ...Expressions]
 * 
 * Call like:
 *     ES5Builder.FunctionArgs(...args).rest("r");
 */
register("FunctionArgs", { rest: undefined }, function(args) {
  this.appendAll(args);
});


register('SliceExpr');

register('ExtendExpr');

register('PrototypeExpr');

/**
 * Example usage:
 *    var foo = "foo #{bar} baz";
 */
register('StringExpr', {}, function(parts) {

  // if it's a simple string, then immediately convert it, to clean the AST
  if(parts.length == 1 && parts[0][0] == 'String')
      return parts[0]

  this.appendAll(parts)
});

register('ScopeExpr');


/**
 * Class
 * -----
 */
register('ClassStmt', { 
  name: undefined, 
  parent: undefined

}, function(name, parent, sections, props, constr) {
  this.name(name)
      .parent(parent)
      .append(sections, props, constr);
});

register('DebugStmt');

register('ModuleStmt', { name: undefined }, function(name, impl) {
  this.name(name)
      .append(impl);
});

register('ForOfStmt');

