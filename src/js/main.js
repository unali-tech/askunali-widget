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
    const isLocalhost = window.location.hostname === 'localhost';
    const isNgrok = window.location.hostname.includes('ngrok');
  
    if (isLocalhost || isNgrok) {
      console.log('Skipping Amplitude load on localhost or ngrok.');
      // Create a dummy amplitude object with a no-op track method
      window.amplitude = {
        track: function () {
          // No operation performed
        }
      };
      return;
    }
  
    loadScript('https://cdn.amplitude.com/libs/analytics-browser-2.11.1-min.js.gz', function() {
      window.amplitude.init('e324eb1f472c873db23c567f3f37be38', {
        "serverZone": "EU",
        "autocapture": false
      });
  
      window.amplitude.track('App Opened');
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

    // Track 'Session Ended' event when the user leaves the page
    window.addEventListener('beforeunload', () => {
      window.amplitude.track('Session Ended');
    });
  }

  function updateApiKey(newApiKey) {
    window.askUnaliConfig = {
      ...window.askUnaliConfig,
      apiKey: newApiKey,
    };
  
    resetWidget();
  
    AskUnaliWidget.init(window.askUnaliConfig);
  }

  return {
    init: init,
    updateApiKey: updateApiKey,
    resetWidget: resetWidget,
  };
}));