jsonml.JsonMLWalker = (function(OMeta) {

  var JsonMLWalker=OMeta.inherit({_grammarName: "JsonMLWalker",
  "walk":function(){var ans,t,prop,n,cs,u;return this._or((function(){return (function(){t=this._apply("undefined");return this.handle_undefined()}).call(this)}),(function(){return (function(){n=this._lookahead((function(){return this._apply("anything")}));this._form((function(){return u=this._apply("undefined")}));return this.handle_undefined(n)}).call(this)}),(function(){return (function(){n=this._lookahead((function(){return this._apply("anything")}));this._form((function(){return (function(){t=this._apply("anything");prop=this._apply("anything");return ans=this._applyWithArgs("walk",t,n)}).call(this)}));return ans}).call(this)}),(function(){return (function(){this._pred((! this["force_rules"]));n=this._lookahead((function(){return this._apply("anything")}));this._form((function(){return (function(){t=this._apply("anything");prop=this._apply("anything");return cs=this._many((function(){return this._apply("walk")}))}).call(this)}));return this.replace_children(n,cs)}).call(this)}),(function(){return (function(){t=this._apply("string");this._pred(((typeof this[t]) === "function"));return this._applyWithArgs("apply",t)}).call(this)}))},
  "walkType":function(){var t;return (function(){t=this._apply("anything");this._lookahead((function(){return this._applyWithArgs("hasType",t)}));return this._apply("walk")}).call(this)},
  "hasType":function(){var t,n;return (function(){t=this._apply("anything");n=this._apply("anything");this._pred(n.hasType(t));return n}).call(this)}});(JsonMLWalker["replace_children"]=(function (obj,children){obj.splice((2),obj["length"]);obj["push"].apply(obj,children);return obj}));(JsonMLWalker["handle_undefined"]=(function (){if((arguments["length"] === (1))){return [undefined]}else{return undefined}}));(JsonMLWalker["force_rules"]=false);

  return JsonMLWalker;

})(OMeta);
