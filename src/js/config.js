const defaultConfig = {
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
    ...defaultConfig,
    ...userConfig,
  };
}

function updateApiKey(newApiKey) {
  window.askUnaliConfig = {
    ...window.askUnaliConfig,
    apiKey: newApiKey,
  };
  resetWidget();
}

