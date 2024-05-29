async function initWidget() {
  const config = window.askUnaliFinalConfig;
  const questionInput = document.getElementById('askunali-question_input_div');
  const questionInputContainer = document.querySelector('.askunali-question-input-container');
  const answerContainer = document.getElementById('askunali-answer');
  const sourcesList = document.getElementById('askunali-sources');
  const linkElement = document.getElementById('askunali-link');
  const returnButton = document.getElementById('askunali-return-button');
  const shoppingContainer = document.getElementById('askunali-shopping-container');
  const shoppingLinks = document.getElementById('askunali-shopping-links');
  const suggestionContainer = document.getElementById('askunali-question-suggestions-container');
  const clearButtonImage = document.getElementById('askunali-clear-button-image');
  const clearButtonContainer = document.getElementById('askunali-clear-button-container');

  let originalAnswer = '';

  questionInput.addEventListener('input', handleQuestionInput);
  questionInput.addEventListener('keydown', handleQuestionKeydown);
  questionInputContainer.addEventListener('click', handleQuestionContainerClick);
  questionInput.addEventListener('mousedown', handleQuestionMousedown);
  returnButton.addEventListener('click', handleReturnClick);
  suggestionContainer.addEventListener('click', handleSuggestionClick);
  clearButtonContainer.addEventListener('click', handleClearButtonClick);

  try {
    const [suggestedQuestions, widgetStyles] = await Promise.all([
      fetchSuggestedQuestions(config.apiKey),
      fetchWidgetStyles(config.apiKey)
    ]);
    displaySuggestedQuestions(suggestedQuestions);
    applyStyles(widgetStyles);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  

  function handleQuestionInput() {
    if (questionInput.textContent.trim().length > 0) {
      questionInput.classList.add('not-empty');
      showElement(clearButtonImage);
    } else {
      questionInput.classList.remove('not-empty');
      hideElement(clearButtonImage);
    }
  }

  function handleSuggestionClick(event) {
    if (event.target.classList.contains('askunali-question-suggestion')) {
      const suggestedQuestion = event.target.textContent;
      questionInput.textContent = suggestedQuestion;
      questionInput.classList.add('not-empty');
      showElement(clearButtonImage);
      handleQuestionSubmit();
    }
  }

  function handleClearButtonClick() {
    questionInput.textContent = '';
    questionInput.classList.remove('not-empty');
    hideElement(clearButtonImage);
    questionInput.focus();
  }

  function handleQuestionKeydown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleQuestionSubmit();
    }
  }

  function handleQuestionContainerClick(event) {
    if (document.activeElement !== questionInput) {
      questionInput.focus();
      if (questionInput.textContent.length > 0) {
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(questionInput);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }

  function handleQuestionMousedown(event) {
    if (document.activeElement !== questionInput) {
      event.preventDefault();
      questionInput.focus();
    }
  }

  function handleQuestionSubmit() {
    const question = questionInput.textContent.trim();
    if (question !== '') {
      clearAnswer();
      startLoadingAnimation();
  
      // Hide the suggestion container
      suggestionContainer.style.display = 'none';

      // Get the config and styles
      const { styles } = window.askUnaliFinalConfig;
      const { border_radius } = styles;

      // Apply styles to the question output container
      applyQuestionOutputStyles(styles);
        
      console.log(border_radius)
      // Modify the styles of the output container
      const outputContainer = document.querySelector('.askunali-question-output-container');
      outputContainer.style.border = '1px solid var(--color-border)';
      outputContainer.style.borderBottom = 'none';
      outputContainer.style.setProperty('border-radius', `${border_radius}px ${border_radius}px 0 0`);

      // Modify the styles of the bottom container
      const bottomContainer = document.querySelector('.askunali-question-output-container-bottom');
      bottomContainer.style.height = `${border_radius}px`;
      bottomContainer.style.border = '1px solid var(--color-border)';
      bottomContainer.style.borderTop = 'none';
      bottomContainer.style.setProperty('border-radius', `0 0 ${border_radius}px ${border_radius}px`);

  
      const startTime = getTimestamp();
      console.log('Start time:', startTime);
  
      fetchAnswer(question)
        .then(data => {
          const endTime = getTimestamp();
          console.log('End time:', endTime);
          console.log('Response time:', formatTime(endTime - startTime));
  
          stopLoadingAnimation();
          displayAnswer(data);
        })
        .catch(error => {
          console.error('Error:', error);
  
          stopLoadingAnimation();
          displayErrorMessage();
        });
    }
  }  

  function displayAnswer(data) {
    const answerType = data.type;
    const answer = data.answer;
    const ingredients = data.ingredients_data;
    const activities = data.activities_data;
    const shoppingData = data.shopping_data;
  
    if (answerType === 'enhanced') {
      displayEnhancedAnswer(answer, ingredients, activities, () => {
        displaySources(ingredients, activities);
        displayShoppingLinks(shoppingData);
        answerContainer.addEventListener('click', (event) => handleIngredientClick(event, ingredients, activities));
      });
    } else {
      typeText(answerContainer, answer);
    }
  }
  
  function displayEnhancedAnswer(answer, ingredients, activities, onComplete) {
    const names = [...ingredients.map(item => item.ingredient_name), ...activities.map(item => item.activity_name)];
    let currentText = '';
    let index = 0;
    const typingSpeed = 20;
  
    function type() {
      if (index < answer.length) {
        const currentChar = answer.charAt(index);
        currentText += currentChar;
        answerContainer.innerHTML = highlightText(currentText, names);
        index++;
        setTimeout(type, typingSpeed);
      } else {
        originalAnswer = answerContainer.innerHTML;
        
        const outputContainerBottom = document.querySelector('.askunali-question-output-container-bottom');
        outputContainerBottom.style.border = '1px solid var(--color-border)';
        outputContainerBottom.style.height = 'auto';

        onComplete();
      }
    }
  
    type();
  }
  
  

  function displaySources(ingredients, activities) {
    const totalSources = ingredients.length + activities.length;
  
    if (totalSources > 0) {
      const sourcesText = 'Sources: ';
      typeText(sourcesList, sourcesText, () => {
        appendSourceLinks(ingredients, activities);
        showElement(sourcesList);
      });
    }
  }
  
  function appendSourceLinks(ingredients, activities) {
    let count = 1;
  
    ingredients.forEach(item => {
      const sourceLink = createElement('a', 'askunali-sources-count', count.toString());
      sourceLink.href = item.paper_url;
      sourceLink.target = '_blank';
      appendElement(sourcesList, sourceLink);
      count++;
    });
  
    activities.forEach(item => {
      const sourceLink = createElement('a', 'askunali-sources-count', count.toString());
      sourceLink.href = item.paper_url;
      sourceLink.target = '_blank';
      appendElement(sourcesList, sourceLink);
      count++;
    });
  
    showElement(linkElement);
  }

  function displayShoppingLinks(shoppingData) {
    if (shoppingData.activities.length > 0 || shoppingData.ingredients.length > 0) {
      shoppingData.activities.forEach(item => {
        const shoppingLink = createElement('a', 'askunali-shopping-container-count', item.display_name);
        shoppingLink.href = item.link;
        shoppingLink.target = '_blank';
        shoppingLink.style.display = 'flex';
        appendElement(shoppingLinks, shoppingLink);
      });
      showElement(shoppingContainer);
    }
  }

  function displayErrorMessage() {
    answerContainer.textContent = 'Oops! Something went wrong. Please try again later.';
  }

  function handleIngredientClick(event, ingredients, activities) {
    if (event.target.classList.contains('askunali-ingredient-link')) {
      event.preventDefault();
      const ingredientName = event.target.textContent;
      const ingredient = [...ingredients, ...activities].find(item => item.ingredient_name === ingredientName || item.activity_name === ingredientName);
      if (ingredient) {
        answerContainer.innerHTML = ingredient.paper_summary;
        showElement(returnButton);
        hideElement(shoppingContainer);
      }
    }
  }  

  function handleReturnClick() {
    answerContainer.innerHTML = originalAnswer;
    hideElement(returnButton);
    
    if (shoppingLinks.children.length > 0) {
      showElement(shoppingContainer);
    }
  }
}

function displaySuggestedQuestions(questions) {
  const suggestionContainer = document.getElementById('askunali-question-suggestions-container');
  suggestionContainer.innerHTML = '';

  if (questions) {
    questions.forEach(question => {
      const suggestionElement = createElement('div', 'askunali-question-suggestion', question);
      appendElement(suggestionContainer, suggestionElement);
    });
  }
}

