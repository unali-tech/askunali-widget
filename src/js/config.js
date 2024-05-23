const askUnaliDefaultConfig = {
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

function getConfig() {
  const userConfig = window.askUnaliConfig || {};
  return {
    ...askUnaliDefaultConfig,
    ...userConfig,
  };
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
}


function updateApiKey(newApiKey) {
  window.askUnaliConfig = {
    ...window.askUnaliConfig,
    apiKey: newApiKey,
  };
  resetWidget();
}
