// set prototype
Object.prototype.proto = function(base){ 
  
  // it's a constructor
  if(typeof this === 'function')
    this.prototype = base;
  
  else
    this.__proto__ = base; 
 
  return this; 
}

Object.prototype.extend = function(obj) {

  for(var key in obj) {
    if(obj.hasOwnProperty(key)) {
      this[key] = obj[key];    
    }
  }

  return this;
}

// stubs
Object.define_class  = function() {}
Object.define_module = function() {}
