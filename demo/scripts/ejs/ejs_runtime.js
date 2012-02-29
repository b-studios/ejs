// set prototype
Object.proto = function(obj, base){ 
  
  // it's a constructor
  if(typeof obj === 'function')
    obj.prototype = base;
  
  else
    obj.__proto__ = base; 
 
  return obj; 
}

Object.extend = function(obj1, obj2) {

  for(var key in obj2) {
    if(obj2.hasOwnProperty(key)) {
      obj1[key] = obj2[key];    
    }
  }
  return obj1;
}	

/**
 * Mootools
 *
Object.define_class = function(name, desc) {
  var klass  = desc.spec,
      parent = desc.get_parent();

  if(parent)
    klass.Extends = parent;

  klass.initialize = desc['constructor'];
  desc.set_class(new Class(klass));
}
*/

/**
 * Joose
 *
Object.define_class = function(name, desc) {
  var klass  = { methods: desc.spec },
      parent = desc.get_parent();

  if(parent)
    klass.isa = parent;

  klass.initialize = desc['constructor'];
  Class(name, klass);
}*/


/**
 * jQuery.create
 */
Object.define_class = function(name, desc) {

  var klass  = desc.spec;

  if(parent)
    klass.extend = desc.parent_name;

  klass.initialize = desc['constructor'];
  jQuery.create(name, klass);
}

Object.define_module = function() {}
