(function() {
  'use strict';

  function TabPreselector(hash) {
    this.activateTab(hash);
  }

  TabPreselector.prototype.activateTab = function(selector) {
    if (tabExists(selector)) activateTab(selector);

    function tabExists(selector) {
      return tab(selector).length > 0;
    }

    function activateTab(selector) {
      tab(selector).tab('show') ;
    }

    function tab(selector) {
      return jQuery('.nav-tabs a[href="' + selector + '"]');
    }
  };

  window.TabPreselector = TabPreselector;

}());
