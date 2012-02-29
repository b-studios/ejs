/*!
 *
 * Copyright (C) 2011 by Jonathan Brachthäuser (http://b-studios.de)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
 * associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, 
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or 
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT 
 * NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
 * DAMAGES OR OTHERLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT 
 * OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 */
(function($, globals) {

  /**
   * @function $.resolve
   * Resolves the given name, starting at the global context. If the repair-option is choosen, all
   * missing nodes are inserted as blank objects.
   * 
   * @param [String] name The path to resolve
   * @param [Boolean] repair If you wish to automatically repair missing nodes and insert {} instead
   * 
   * @return [Object] The resolved Object
   */
  if(!$.isFunction($.resolve))
    $.resolve = function(name, repair) {
      
      if($.type(name) !== 'string') return name;      

      var curr = globals;
      $.each(name.split('.'), function(i,part) {
        if(curr[part] === undefined && !repair) 
          throw "cannot resolve part '" + part + "' of '" + name + "'";
      
        else if(curr[part] === undefined && !!repair)
          curr[part] = {};

        curr = curr[part];
      });
      return curr;
    };

  if(!$.isFunction($.define))

    /**
     * @function $.define
     * Defines `name` as `obj` and therefore requires `$.resolve`
     * 
     * @param [String] name The name or path where to save `obj` under
     * @param [Object] obj The object you wish to save
     * 
     * @return [Object] Just returns `obj` after saving
     */
    $.define = function(name, obj) {
      var last = name.lastIndexOf('.'),
          scope = globals;
      
      if(last != -1) {
        scope = $.resolve(name.substring(0,last), true);
        name = name.substring(last+1, name.length);
      }
      scope[name] = obj;
      return obj;    
    }


  if(!$.isFunction($.sym))

    /**
     * @function $.sym
     * Adds support for globally unique symbols (like in ruby)
     * 
     * @param [String] sym The name of the symbol 
     * 
     * @return [Symbol] A unique symbol
     */
    $.sym = (function() {
      
      function symbols(sym) {
        if($.type(sym) === 'string' && symbols[sym] === undefined)
          return symbols[sym] = { toString: function() { return ':' + sym; }};
        else
          return symbols[sym];
      }

      return symbols;
    })();

  // proxy type to work with jquery create
  var old_type = $.type;
  $.type = function(obj) {
    
    if(!!obj && !!obj.klass)
      return obj.klass.toString();
    
    return old_type(obj);    
  };


  if(!$.isFunction($.create))
    
    /**
     * @function $.create
     *
     * Creates a new class, which can be initialized - more information see README.md
     */      
    $.create = function(name, specs) {
      
      var self = {
        initialize: specs.initialize || function() {
          this.initParent.apply(this, arguments);
        }
      };
      
      // stores the prototype
      var proto;
      
      // stores the class
      var klass; 
      
      // the klass's superclass
      var superclass = $.resolve(specs.extend);
      
      // the constructor of the klass
      var constructor = function() {
              
        var instance = this;
        
        // 1. Apply Mixins
        klass.applyAsMixin(instance);    
        
        // 2. Apply own properties and instance methods
        $.extend(true, instance, self, {
          
          // used for inspection
          klass: klass,
      
          // add initializeParent to instance
          initParent: function() {
          
            if($.isFunction(proto.initialize)) {
              delete instance.initParent; // prevent endless recursion (why should we call it multiple times)??
              proto.initialize.apply(instance, arguments);
            }
          }
        });
           
        // 3. Call initialize (check for global symbol dont_initialize first)
        //    If a constructor is called within the inheritance chain, we don't want
        //    to initialize the class automatically
        if(arguments[0] !== $.sym('dont_initialize'))       
          self.initialize.apply(instance, arguments);          

      };
      
      // if we wan't to share the prototype we create it only once per class
      // This way each instance of klass will have the same prototype, which results in 
      // faster initialization, but may conflict in some situations
      //
      // WARNING: only turn this on, if you know, what you are doing.
      if(!!specs.share_prototype) {
        proto = superclass && new superclass($.sym('dont_initialize')) || Object;
        klass = constructor;
        klass.prototype = proto;
        
      // default: No sharing of the prototype-instance, so we need to wrap the constructor
      // and create the prototype each time klass is instantiated
      } else {
        klass = function() {            
          proto = superclass && new superclass($.sym('dont_initialize')) || Object;
          
          function helper(args) {
            constructor.apply(this, args);
          }
          helper.prototype = proto;
          return new helper(arguments);
        };
      }
      
      //
      // now extend our klass with statics and some builtin-functions
      //
      $.extend(klass, specs.statics, {
        
        // Takes a string or an array or undefined and returns an array of resolved mixins
        mixins: $.map(($.type(specs.mixins) === 'string')? [specs.mixins] : specs.mixins || [], 
          function(mixin) { return $.resolve(mixin); }),

        // save reference to superclass
        superclass: superclass,
        
        toString: function() { return name; },

        applyAsMixin: function(obj) {
          $.extend(true, obj, self);
          
          // if this klass has mixins, they have to be applied recursive
          $.each(klass.mixins, function(i, mixin) {
            
            if($.isFunction(mixin.applyAsMixin))
              mixin.applyAsMixin(obj);
            
            // we want to mixin a regular object, so copy manually
            else
              $.extend(true, obj, mixin);
          });
        },
        
        // allow access to the instance specification
        specification: self
      });
      
      // After saving some properties in klass, delete them from the instance-template
      $.each(['initialize', 'mixins', 'extend', 'statics'], function(i, key) {
          delete specs[key];      
      });
      
      // apply given specification to instance-specification (without the keys deleted above)
      $.extend(self, specs);      

      // resolve name and define name as klass
      $.define(name, klass);
      
      //
      // fire callbacks
      //
      if($.isFunction(klass.initialized))
        klass.initialized();
      
      if(klass.superclass && $.isFunction(klass.superclass.extended))
        klass.superclass.extended(klass);
        
      return klass;
    }   

})(jQuery, this);
