(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, 
   global.AskUnaliWidget = global.AskUnaliWidget || factory());
})(this, (function () {
  'use strict';

  function loadAnimationStyles() {
    const extraStyles = document.createElement('style');
    extraStyles.innerHTML = animationStyles;
    document.head.appendChild(extraStyles);
  }

  function init(config) {
    const widgetHTML = `{{WIDGET_HTML}}`;
    const targetDiv = document.getElementById('askunali');

    if (!targetDiv) {
      console.warn('Could not find the target div for the widget.');
      return;
    }

    targetDiv.innerHTML = widgetHTML;

    initWidget(config);
    loadAnimationStyles();
  }

  function updateApiKey(newApiKey) {
    window.askUnaliConfig = {
      ...window.askUnaliConfig,
      apiKey: newApiKey,
    };
    resetWidget();
  }

  return {
    init: init,
    updateApiKey: updateApiKey,
    resetWidget: resetWidget,
  };
}));
