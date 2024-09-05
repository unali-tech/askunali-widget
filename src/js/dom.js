async function initWidget(config, locale) {
  const questionInput = document.getElementById('askunali-question_input_div');
  const questionInputContainer = document.querySelector('.askunali-question-input-container');
  const answerContainer = document.getElementById('askunali-answer');
  const sourcesList = document.getElementById('askunali-sources');
  const sourcesPlaceholder = document.getElementById('askunali-sources-placeholder');
  const sourcesPlaceholderText = document.getElementById('askunali-sources-placeholder-text');
  const sourcesPlaceholderIcon = document.getElementById('askunali-sources-placeholder-icon');
  const linkElement = document.getElementById('askunali-link');
  const returnButton = document.getElementById('askunali-return-button');
  const shoppingContainer = document.getElementById('askunali-shopping-container');
  const shoppingLinks = document.getElementById('askunali-shopping-links');
  const shoppingDescription = document.getElementById('askunali-shopping-cart-description');
  const suggestionContainer = document.getElementById('askunali-question-suggestions-container');
  const clearButtonImage = document.getElementById('askunali-clear-button-image');
  const clearButtonContainer = document.getElementById('askunali-clear-button-container');
  const questionOutputIcon = document.getElementById('askunali-question-output-icon');

  let originalAnswer = '';

  questionInput.setAttribute('data-placeholder', locale.placeholder);
  shoppingDescription.textContent = locale.shoppingCartDescription;
  returnButton.textContent = locale.returnButton;
  sourcesPlaceholderText.textContent = locale.footerPlaceholder;

  questionInput.addEventListener('input', handleQuestionInput);
  questionInput.addEventListener('keydown', handleQuestionKeydown);
  questionInputContainer.addEventListener('click', handleQuestionContainerClick);
  questionInput.addEventListener('mousedown', handleQuestionMousedown);
  returnButton.addEventListener('click', handleReturnClick);
  suggestionContainer.addEventListener('click', handleSuggestionClick);
  clearButtonContainer.addEventListener('click', handleClearButtonClick);

  displaySuggestedQuestions(config.suggestedQuestions, config.styles);

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
      showElement(questionOutputIcon);
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
  
      // Apply styles to the question output container
      applyQuestionOutputStyles(config.styles);
  
      // Modify the styles of the output container
      const outputContainer = document.querySelector('.askunali-question-output-container');
      outputContainer.style.border = '1px solid var(--color-border)';
      outputContainer.style.borderBottom = 'none';
      outputContainer.style.setProperty('border-radius', `${config.styles.border_radius}px ${config.styles.border_radius}px 0 0`);
      outputContainer.style.paddingLeft = `70px`;
      outputContainer.style.paddingTop = `30px`;
      outputContainer.style.paddingRight = `35px`;
      outputContainer.style.marginTop = `15px`;
  
      // Modify the styles of the bottom container
      const bottomContainer = document.querySelector('.askunali-question-output-container-bottom');
      bottomContainer.style.height = `${config.styles.border_radius}px`;
      bottomContainer.style.border = '1px solid var(--color-border)';
      bottomContainer.style.borderTop = 'none';
      bottomContainer.style.setProperty('border-radius', `0 0 ${config.styles.border_radius}px ${config.styles.border_radius}px`);
  

      // Modify the styles of the question suggestions
      const suggestions = document.querySelectorAll('.askunali-question-suggestion');
      // we just need to apply the proper border color
      for (let i = 0; i < suggestions.length; i++) {
        suggestions[i].style.borderColor = config.styles.border_color;
      }

      // Add media query styles
      const style = document.createElement('style');
      style.innerHTML = `
        @media screen and (max-width: 1900px) {
          #askunali-bottom-container {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `;
      document.head.appendChild(style);
  
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
          displayErrorMessage(locale);
        });
    }
  }   

  function displayAnswer(data) {
    const answerType = data.type;
    const answer = data.answer;
    const ingredients = data.ingredients_data;
    const activities = data.activities_data;
    const shoppingData = data.shopping_data;

    const bottomContainer = document.getElementById('askunali-bottom-container');
  
    if (answerType === 'enhanced') {
      displayEnhancedAnswer(answer, ingredients, activities, () => {
        displaySources(ingredients, activities);
        displayShoppingLinks(shoppingData);
        answerContainer.addEventListener('click', (event) => handleIngredientClick(event, ingredients, activities));
      });
    } else {
      typeText(answerContainer, answer, showBasicFooter);
      bottomContainer.style.justifyContent = 'flex-end';
      bottomContainer.style.padding = '10px 0';
    }    
  }

  function showBasicFooter() {
    sourcesPlaceholder.style.display = 'flex';
    sourcesPlaceholderText.style.display = 'flex';
    sourcesPlaceholderIcon.style.display = 'flex';

    const outputContainerBottom = document.querySelector('.askunali-question-output-container-bottom');
    outputContainerBottom.style.border = '1px solid var(--color-border)';
    outputContainerBottom.style.height = 'auto';
  }
  
  function displayEnhancedAnswer(answer, ingredients, activities, onComplete) {
    const bottomContainer = document.getElementById('askunali-bottom-container');
    bottomContainer.style.justifyContent = 'space-between';
    bottomContainer.style.padding = '';

    const names = [...ingredients.map(item => item.ingredient_name), ...activities.map(item => item.activity_name)];
    let currentText = '';
    let index = 0;
    const typingSpeed = 10;
  
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
    const researchPaperIngredients = ingredients.filter(item => item.source === 'research_paper');
    const researchPaperActivities = activities.filter(item => item.source === 'research_paper');
    const totalSources = researchPaperIngredients.length + researchPaperActivities.length;

    sourcesPlaceholder.style.display = 'flex';
    sourcesPlaceholderText.style.display = 'flex';
    sourcesPlaceholderIcon.style.display = 'flex';
  
    if (totalSources > 0) {
      const sourcesText = 'Sources: ';
      typeText(sourcesList, sourcesText, () => {
        appendSourceLinks(researchPaperIngredients, researchPaperActivities);
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
  }
  function displayShoppingLinks(shoppingData) {
    // Extract styles from the config object
    const { border_color, border_radius, suggestion_background_color } = config.styles;
  
    if (shoppingData.activities.length > 0 || shoppingData.ingredients.length > 0) {
      shoppingData.activities.forEach(item => {
        const shoppingLink = createElement('a', 'askunali-shopping-container-count', item.display_name);
        shoppingLink.href = item.link;
        shoppingLink.target = '_blank';
        shoppingLink.style.display = 'flex';
        
        // Apply the extracted styles
        shoppingLink.style.borderColor = border_color;
        shoppingLink.style.borderRadius = `${border_radius}px`;
        shoppingLink.style.backgroundColor = suggestion_background_color;
        
        appendElement(shoppingLinks, shoppingLink);
      });
      showElement(shoppingContainer);
    }
  }

  function displayErrorMessage(locale) {
    answerContainer.textContent = locale.errorMessage;
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

function displaySuggestedQuestions(questions, styles) {
  const suggestionContainer = document.getElementById('askunali-question-suggestions-container');
  suggestionContainer.innerHTML = '';

  const { border_color, border_radius, suggestion_background_color } = styles;

  if (questions) {
    const maxQuestions = window.innerWidth < 900 ? 3 : questions.length;

    questions.slice(0, maxQuestions).forEach(question => {
      const suggestionElement = createElement('div', 'askunali-question-suggestion', question);
      
      suggestionElement.style.borderColor = border_color;
      suggestionElement.style.borderRadius = `${border_radius}px`;
      suggestionElement.style.backgroundColor = suggestion_background_color;
      
      appendElement(suggestionContainer, suggestionElement);
    });
  }
}
