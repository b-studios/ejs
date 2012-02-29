var Treeview = function(dom) {
  
  var data;

   function escape(str) {
     return str.replace(/[<>\n]/g, function(found) { 
       switch(found) {
         case '<':  return '&lt;';
         case '>':  return '&gt;';
         case '\n': return '\\n';
       } 
     });
   }

  dom = $(dom);

  function toHtml(node) {
    if(typeof node == 'undefined') return "";

    var html = $("<li>", {
      'class': node[0]
    })
    
    html.append($('<span>', {
      'class': 'type',
      'html': node[0],
      'click': function(evt) {
          var node = $(this).parent('li');
          
          node.toggleClass('collapsed');

          if(evt.ctrlKey)
            node.hasClass('collapsed') ? node.find('li').addClass('collapsed')
                                       : node.find('li').removeClass('collapsed');
        } 
      })
    );

    
    // Attributes
    var attributes = $('<dl>', {
      'class': 'attributes'
    });

    $(Object.getOwnPropertyNames(node[1])).each(function(i, key) {
      attributes.append($('<dt>', { html: key }))
  
      var val = node[1][key];

      switch(typeof val) {
        case 'number':
          attributes.append($('<dd>', { 
            'class': 'number',
            'html': val
          })) 
          break;
        case 'string':
          attributes.append($('<dd>', { 
            'class': 'string',
            'html': '"' + escape(val) + '"'
          }))
          break;
        case 'boolean':
          attributes.append($('<dd>', { 
            'class': 'boolean',
            'html': val? "true" :"false"
          }))
          break;
      }

      
    });
    
    if(attributes.children().size() != 0)
      html.append(attributes)

    // Children
    var children = $('<ul>', {
      'class': 'children'
    });
  
    $([].slice.call(node, 2)).each(function(i, child) {
      children.append(toHtml(child));
    })
  
    html.append(children);
    return html;
  }

  return { 
    show: function(jsonml) {
      if(jsonml !== data) {
        data = jsonml;
        dom.empty().append(toHtml(jsonml));
      }
      return this;
    },

    collapse: function() {
      dom.find('li').addClass('collapsed');
      return this;
    },

    uncollapse: function() {
      dom.find('li').removeClass('collapsed');
      return this;
    }
  }
}
