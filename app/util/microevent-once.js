(function() {
  'use strict';

  var MicroEvent = window.MicroEvent;

  MicroEvent.prototype.once = function(eventName, listener) {
    var self = this;

    function callback() {
      var args = [].slice.call(arguments);
      listener.apply(self, args);

      setTimeout(function() {
        self.unbind(eventName, callback);
      });
    }

    self.bind(eventName, callback);
  };

  // ---- copy/paste begin ----
  MicroEvent.mixin  = function(destObject){
    var props = ['bind', 'unbind', 'trigger', 'once'];
    for(var i = 0; i < props.length; i ++){
      if( typeof destObject === 'function' ){
        destObject.prototype[props[i]]  = MicroEvent.prototype[props[i]];
      }else{
        destObject[props[i]] = MicroEvent.prototype[props[i]];
      }
    }
  };
  // ---- copy/paste end ----


}());
