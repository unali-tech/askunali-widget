window.askUnaliAnimationStyles = `
  #askunali-widget .askunali-question-input-area::before {
    content: attr(data-placeholder);
    display: block;
    color: var(--question-font-color, rgba(19, 19, 19, 0.4));
    background-color: var(--question-background-color, transparent);
  } 

  #askunali-widget .askunali-question-input-area:focus::before {
    content: none;
  }

  #askunali-widget .askunali-question-input-area.not-empty::before {
    display: none;
  }

  @media screen and (max-width: 1000px) {
    :root {
      --widget-max-width: 340px;
    }

    #askunali-widget #askunali-question-input-container {
      height: 60px;
      font-size: 16px;
    }

    #askunali-widget .askunali-question-output-container {
      padding-left: 0px !important;
    }

    #askunali-widget .askunali-utility-button {
      min-width: 0px !important;
    }

    #askunali-widget #askunali-question-suggestions-container {
      margin-left: 20px !important;
    }

    #askunali-widget .askunali-question-suggestion {
      max-width: 100% !important;
      height: 40px !important;
      font-size: 15px !important;
    }

    #askunali-widget #askunali-answer {
      margin-left: 25px !important;
      padding-top: 15px !important;
    }

    #askunali-widget .askunali-utility-buttons-container {
      margin-left: 25px !important;
    }

    #askunali-widget .askunali-question-output-container-bottom {
      padding-left: 25px !important;  
    }

    #askunali-widget #askunali-shopping-container {
      margin-left: 25px !important;
    }
      
    #askunali-widget #askunali-question-output-icon {
      display: none;
      left: 20px !important;
    }

    #askunali-widget #askunali-processing-text {
      margin-left: 65px !important;
    }

    #askunali-widget #askunali-shopping-cart-description {
      font-size: 14px !important;
      font-weight: 600;
    }
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