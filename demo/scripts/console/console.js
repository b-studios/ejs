// Copyright (c) 2010 Remy Sharp, http://jsconsole.com
//  
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//  
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//  
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


var Console = (function(){

  function sortci(a, b) {
    return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
  }

  // custom because I want to be able to introspect native browser objects *and* functions
  function stringify(o, simple, visited) {
    var json = '', i, vi, type = '', parts = [], names = [], circular = false;
    visited = visited || [];
    
    try {
      type = ({}).toString.call(o);
    } catch (e) { // only happens when typeof is protected (...randomly)
      type = '[object Object]';
    }

    // check for circular references
    for (vi = 0; vi < visited.length; vi++) {
      if (o === visited[vi]) {
        circular = true; 
        break;
      }
    }

    if (circular) {
      json = '[circular]';
    } else if (type == '[object String]') {
      json = '"' + o.replace(/"/g, '\\"') + '"';
    } else if (type == '[object Array]') {
      visited.push(o);

      json = '[';
      for (i = 0; i < o.length; i++) {
        parts.push(stringify(o[i], simple, visited));
      }
      json += parts.join(', ') + ']';
      json;
    } else if (type == '[object Object]') {
      visited.push(o);

      json = '{';
      for (i in o) {
        names.push(i);
      }
      names.sort(sortci);
      for (i = 0; i < names.length; i++) {
        parts.push( stringify(names[i], undefined, visited) + ': ' + stringify(o[ names[i] ], simple, visited) );
      }
      json += parts.join(', ') + '}';
    } else if (type == '[object Number]') {
      json = o+'';
    } else if (type == '[object Boolean]') {
      json = o ? 'true' : 'false';
    } else if (type == '[object Function]') {
      json = o.toString();
    } else if (o === null) {
      json = 'null';
    } else if (o === undefined) {
      json = 'undefined';
    } else if (simple == undefined) {
      visited.push(o);

      json = type + '{\n';
      for (i in o) {
        names.push(i);
      }
      names.sort(sortci);
      for (i = 0; i < names.length; i++) {
        try {
          parts.push(names[i] + ': ' + stringify(o[names[i]], true, visited)); // safety from max stack
        } catch (e) {
          if (e.name == 'NS_ERROR_NOT_IMPLEMENTED') {
            // do nothing - not sure it's useful to show this error when the variable is protected
            // parts.push(names[i] + ': NS_ERROR_NOT_IMPLEMENTED');
          }
        }
      }
      json += parts.join(',\n') + '\n}';
    } else {
      try {
        json = o+''; // should look like an object      
      } catch (e) {}
    }
    return json;
  }

  function cleanse(s) {
    return (s||'').replace(/[<&]/g, function (m) { return {'&':'&amp;','<':'&lt;'}[m];});
  }

  function Console(dom) { 

    this.dom = $(dom);

    function prepare(msg, className) {

      var li = document.createElement('li'),
          div = document.createElement('div');

      div.innerHTML = msg;
      prettyPrint([div]);
      li.className = className || 'log';
      li.appendChild(div);
  
      return $(li);
    }
    
    this.log = function() {
      var out = [];
      for(var i =0,len=arguments.length; i<len;i++) {
        out.push(stringify(arguments[i], true));
      }
      this.dom.append(prepare(out.join(' ')));
      this.scroll();
    }
  
    this.error = function() {
      var out = [];
      for(var i =0,len=arguments.length; i<len;i++) {
        out.push(stringify(arguments[i], true));
      }
      this.dom.append(prepare(out.join(' '), 'error'));
      this.scroll();
    }
    
    this.scroll = function() {
      var height = 0;
      this.dom.children().each(function(i, el) { height += $(el).outerHeight(); });
      this.dom.animate({
        'scrollTop': height
      }, 100);
    }
  }

  return Console;

})();
