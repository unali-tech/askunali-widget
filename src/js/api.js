async function fetchAnswer(question) {
  const config = window.askUnaliFinalConfig;

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

    return data;
  } catch (error) {
    console.error('Error in fetchAnswer:', error);
    throw error;
  }
}

async function fetchAnswer(question) {
  const config = window.askUnaliFinalConfig;
  const isLocalhost = window.location.hostname === 'localhost';

  const apiUrl = isLocalhost 
    ? 'https://rag-api-test-latest.onrender.com/ask_question' 
    : 'https://rag-api-e0qu.onrender.com/ask_question';

  try {
    const response = await fetch(apiUrl, {
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
    return data;
  } catch (error) {
    console.error('Error in fetchAnswer:', error);
    throw error;
  }
}

async function fetchSuggestedQuestions(apiKey) {
  const defaultQuestions = [
    'How to manage knee pain?',
    'Is ginseng good for energy?',
    'Can acupuncture help with migraine?',
    'Type of yoga for anxiety?',
    'Child constipation, what to do?',
    'What is AskUnali?'
  ];

  const isLocalhost = window.location.hostname === 'localhost';
  if (isLocalhost) {
    return defaultQuestions;
  }

  try {
    const response = await fetch(`https://xybo-itpz-j8ne.p7.xano.io/api:pfjomY_8/get_suggested_questions?widget_api_key=${apiKey}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return defaultQuestions;
    }

    const data = await response.json();

    if (!Array.isArray(data.suggested_questions)) {
      console.error('Unexpected response format from fetchSuggestedQuestions API.');
      return defaultQuestions;
    }

    return data.suggested_questions;
  } catch (error) {
    console.error('Error in fetchSuggestedQuestions:', error);
    return defaultQuestions;
  }
}

async function fetchWidgetStyles(apiKey) {
  const isLocalhost = window.location.hostname === 'localhost';
  if (isLocalhost) {
    return {};
  }

  try {
    const response = await fetch(`https://xybo-itpz-j8ne.p7.xano.io/api:pfjomY_8/get_styles?widget_api_key=${apiKey}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return {};
    }

    const data = await response.json();
    return {
      styles: {
        border_color: data.border_color,
        border_radius: data.border_radius,
        question_font_color: data.question_font_color,
        question_background_color: data.question_background_color,
        answer_font_color: data.answer_font_color,
        answer_background_color: data.answer_background_color,
        suggestion_background_color: data.suggestion_background_color,
        icon_color: data.icon_color
      },
      language: data.language.toLowerCase()
    };
    
  } catch (error) {
    console.error('Error in fetchWidgetStyles:', error);
    return {};
  }
}
