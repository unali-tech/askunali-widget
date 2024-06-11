if (typeof window.askUnaliDefaultConfig === 'undefined') {
  window.askUnaliDefaultConfig = {
    apiKey: 'default',
    styles: {
      borderColor: null,
      borderRadius: null,
      questionBox: {
        backgroundColor: null,
        fontColor: null,
      },
      answerBox: {
        backgroundColor: null,
        fontColor: null,
      },
    },
  };
}


async function getConfig(userConfig) {
  const defaultConfig = {
    apiKey: 'default',
    styles: {
      border_color: '#D0DDE8',
      border_radius: '4px',
      question_font_color: 'inherit',
      question_background_color: 'white',
      answer_font_color: 'inherit',
      answer_background_color: 'transparent',
      suggestion_background_color: '#f9fbff',
      icon_color: 'rgb(48, 56, 64);',
    },
    language: 'en',
    suggestedQuestions: []
  };

  const scriptTagStyles = userConfig.styles || {};

  let apiStyles = {};
  let apiLanguage = defaultConfig.language;
  try {
    const apiResponse = await fetchWidgetStyles(userConfig.apiKey);
    apiStyles = apiResponse.styles || {};
    apiLanguage = apiResponse.language || defaultConfig.language;
  } catch (error) {
    console.error('Error fetching widget styles from API:', error);
  }


  let suggestedQuestions = [];
  try {
    suggestedQuestions = await fetchSuggestedQuestions(userConfig.apiKey);
  } catch (error) {
    console.error('Error fetching suggested questions:', error);
  }

  const mergedStyles = {
    ...defaultConfig.styles,
    ...apiStyles,
    ...scriptTagStyles,
  };

  const finalConfig = {
    ...defaultConfig,
    ...userConfig,
    styles: mergedStyles,
    language: apiLanguage,
    suggestedQuestions: suggestedQuestions
  };

  return finalConfig;
}


function clearAnswer() {
  const answerContainer = document.getElementById('askunali-answer');
  const sourcesList = document.getElementById('askunali-sources');
  const linkElement = document.getElementById('askunali-link');
  const returnButton = document.getElementById('askunali-return-button');
  const shoppingContainer = document.getElementById('askunali-shopping-container');
  const shoppingLinks = document.getElementById('askunali-shopping-links');

  if (answerContainer) {
    answerContainer.innerHTML = '';
  }
  if (sourcesList) {
    hideElement(sourcesList);
  }
  if (linkElement) {
    hideElement(linkElement);
  }
  if (returnButton) {
    hideElement(returnButton);
  }
  if (shoppingContainer) {
    hideElement(shoppingContainer);
  }
  if (shoppingLinks) {
    shoppingLinks.innerHTML = '';
  }
}

function resetWidget() {
  const questionInput = document.getElementById('askunali-question_input_div');
  if (questionInput) {
    questionInput.textContent = '';
    questionInput.classList.remove('not-empty');
  }

  clearAnswer();

  // Show the suggestion container
  const suggestionContainer = document.getElementById('askunali-question-suggestions-container');
  if (suggestionContainer) {
    suggestionContainer.style.display = 'block';
  }

  // Reset the styles of the output container
  const outputContainer = document.querySelector('.askunali-question-output-container');
  if (outputContainer) {
    outputContainer.style.border = '1px solid #D0DDE8';
    outputContainer.style.borderBottom = '1px solid #D0DDE8';
    outputContainer.style.borderRadius = '4px';
  }

  // Reset the styles of the bottom container
  const bottomContainer = document.querySelector('.askunali-question-output-container-bottom');
  if (bottomContainer) {
    bottomContainer.style.height = 'auto';
    bottomContainer.style.border = 'none';
    bottomContainer.style.borderRadius = '0';
  }
}



function updateApiKey(newApiKey) {
  window.askUnaliConfig = {
    ...window.askUnaliConfig,
    apiKey: newApiKey,
  };
  resetWidget();
}
