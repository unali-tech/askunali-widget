async function fetchAnswer(question) {
  const config = getConfig();
  const cacheKey = `answer_${question}`;

  // Check if the answer is already downloaded
  const cachedAnswer = localStorage.getItem(cacheKey);
  if (cachedAnswer) {
    console.log('Using cached answer');
    return JSON.parse(cachedAnswer);
  }

  try {
    const response = await fetch('https://rag-api-e0qu.onrender.com/ask_question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question: question,
        api_key: config.apiKey
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Store the answer in localStorage
    localStorage.setItem(cacheKey, JSON.stringify(data));

    return data;
  } catch (error) {
    console.error('Error in fetchAnswer:', error);
    throw error;
  }
}

async function fetchSuggestedQuestions(apiKey) {
  try {
    const response = await fetch(`https://xybo-itpz-j8ne.p7.xano.io/api:pfjomY_8/get_suggested_questions?widget_api_key=${apiKey}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in fetchSuggestedQuestions:', error);
    throw error;
  }
}

