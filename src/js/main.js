(function (global, factory) {
  if (global.AskUnaliWidget) {
    return;
  }

  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, 
   global.AskUnaliWidget = factory());
})(this, (function () {
  'use strict';

  function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    document.head.appendChild(script);
  }

  function loadAmplitude() {
    loadScript('https://cdn.amplitude.com/libs/analytics-browser-2.11.1-min.js.gz', function() {
      loadScript('https://cdn.amplitude.com/libs/plugin-session-replay-browser-1.8.0-min.js.gz', function() {
        window.amplitude.add(window.sessionReplay.plugin({sampleRate: 1}));
        window.amplitude.init('e324eb1f472c873db23c567f3f37be38', {
          "serverZone": "EU",
          "autocapture": {"elementInteractions": true}
        });
      });
    });
  }

  function loadAnimationStyles() {
    const extraStyles = document.createElement('style');
    extraStyles.innerHTML = window.askUnaliAnimationStyles;
    document.head.appendChild(extraStyles);
  }  

  async function init(config) {
    config = config || window.askUnaliConfig;
    const widgetHTML = `{{WIDGET_HTML}}`;
    const targetDiv = document.getElementById('askunali');
  
    if (!targetDiv) {
      console.warn('Could not find the target div for the widget.');
      return;
    }
  
    targetDiv.innerHTML = widgetHTML;
  
    const widgetElement = document.getElementById('askunali-widget');
    widgetElement.classList.add('hidden');
  
    const finalConfig = await getConfig(config);
    window.askUnaliFinalConfig = finalConfig;
  
    applyStyles(finalConfig.styles);

    const locale = window.askUnaliTranslations[finalConfig.language] || window.askUnaliTranslations.en;
  
    initWidget(finalConfig, locale);
    loadAnimationStyles();
    loadAmplitude(); // Load and initialize Amplitude
  
    // Ensure the styles are applied before revealing the widget
    requestAnimationFrame(() => {
      widgetElement.classList.remove('hidden');
    });
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