function loadAnimationStyles() {
  const extraStyles = document.createElement('style');
  extraStyles.innerHTML = `
    #askunali-widget .askunali-question-input-area::before {
      content: attr(data-placeholder);
      display: block;
      color: rgba(19, 19, 19, 0.4);
    }

    #askunali-widget .askunali-question-input-area:focus::before {
      content: none;
    }

    #askunali-widget .askunali-question-input-area.not-empty::before {
      display: none;
    }

    :root {
      --donut-move-distance: 0.5px;
    }

    @keyframes moveDonut1 {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(var(--donut-move-distance), calc(-1 * var(--donut-move-distance)));
      }
    }

    @keyframes moveDonut2 {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(var(--donut-move-distance), var(--donut-move-distance));
      }
    }

    @keyframes moveDonut3 {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(calc(-1 * var(--donut-move-distance)), var(--donut-move-distance));
      }
    }

    @keyframes moveDonut4 {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(calc(-1 * var(--donut-move-distance)), calc(-1 * var(--donut-move-distance)));
      }
    }

    @keyframes rotateSVG {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    .animate-svg .outer-donut-1 > g {
      animation: moveDonut1 0.1s ease-in-out forwards;
    }

    .animate-svg .outer-donut-2 > g {
      animation: moveDonut2 0.1s ease-in-out forwards;
    }

    .animate-svg .outer-donut-3 > g {
      animation: moveDonut3 0.1s ease-in-out forwards;
    }

    .animate-svg .outer-donut-4 > g {
      animation: moveDonut4 0.1s ease-in-out forwards;
    }

    .animate-svg.rotate > g {
      animation: rotateSVG 3s linear infinite;
      transform-origin: center;
    }
  `;
  document.head.appendChild(extraStyles);
}

// flag variable
let widgetInitialized = false;

function init() {
  // Check if the widget has already been initialized
  if (widgetInitialized) {
    return;
  }

  const config = getConfig();

  if (!config.apiKey || config.apiKey === 'init') {
    console.warn('API key is empty or set to "init". Waiting for a valid API key.');
    return;
  }

  const targetDiv = document.getElementById('askunali');
  if (!targetDiv) return;

  const widgetHTML = `{{WIDGET_HTML}}`;
  targetDiv.outerHTML = widgetHTML;

  initWidget();
  loadAnimationStyles();

  window.askUnaliUpdateApiKey = function(newApiKey) {
    if (newApiKey && newApiKey !== 'init') {
      updateApiKey(newApiKey);
      if (!widgetInitialized) {
        init();
      }
    }
  };
  
  window.askUnaliResetWidget = function() {
    resetWidget();
  };

  // flag variable to true after init
  widgetInitialized = true;
}

init();
