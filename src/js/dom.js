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
  const dosageButton = document.getElementById('askunali-dosage-button');
  const sideEffectsButton = document.getElementById('askunali-side-effects-button');
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
  dosageButton.textContent = locale.dosageButton;
  sideEffectsButton.textContent = locale.sideEffectsButton;
  sourcesPlaceholderText.textContent = locale.footerPlaceholder;

  questionInput.addEventListener('input', handleQuestionInput);
  questionInput.addEventListener('keydown', handleQuestionKeydown);
  questionInputContainer.addEventListener('click', handleQuestionContainerClick);
  questionInput.addEventListener('mousedown', handleQuestionMousedown);
  returnButton.addEventListener('click', handleReturnClick);
  dosageButton.addEventListener('click', handleDosageClick);
  sideEffectsButton.addEventListener('click', handleSideEffectsClick);
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
      window.amplitude.track('Question Asked', { questionText: question });
  
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
    const shoppingData = data.shopping_data;
    console.log('Shopping data:', shoppingData);

    const bottomContainer = document.getElementById('askunali-bottom-container');

    window.amplitude.track('Chat Message Received', { answerType: answerType, answerText: answer, shoppingData: shoppingData });
  
    if (answerType === 'enhanced') {
      displayEnhancedAnswer(answer, ingredients, () => {
        displaySources(ingredients);
        displayShoppingLinks(shoppingData);
        answerContainer.addEventListener('click', (event) => handleIngredientOrActivityClick(event, ingredients));
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
  
  function displayEnhancedAnswer(answer, ingredients, onComplete) {
    const bottomContainer = document.getElementById('askunali-bottom-container');
    bottomContainer.style.justifyContent = 'space-between';
    bottomContainer.style.padding = '';

    const names = ingredients.map(item => item.ingredient_name);
    let currentText = '';
    let index = 0;
    const typingSpeed = 7; // Adjust this value to control the typing speed (milliseconds per character)
    let lastTime = Date.now();

    function type() {
        const now = Date.now();
        const elapsed = now - lastTime;

        if (elapsed > typingSpeed) {
            if (index < answer.length) {
                const currentChar = answer.charAt(index);
                currentText += currentChar;
                answerContainer.innerHTML = highlightText(currentText, names);
                index++;
                lastTime = now;
            } else {
                originalAnswer = answerContainer.innerHTML;

                const outputContainerBottom = document.querySelector('.askunali-question-output-container-bottom');
                outputContainerBottom.style.border = '1px solid var(--color-border)';
                outputContainerBottom.style.height = 'auto';

                onComplete();
                return; // Stop the animation loop
            }
        }

        requestAnimationFrame(type);
    }

    // Use setInterval to keep track of time even when the tab is inactive
    setInterval(() => {
        if (index < answer.length) {
            const now = Date.now();
            const elapsed = now - lastTime;

            if (elapsed > typingSpeed) {
                const currentChar = answer.charAt(index);
                currentText += currentChar;
                answerContainer.innerHTML = highlightText(currentText, names);
                index++;
                lastTime = now;
            }
        }
    }, typingSpeed);

    requestAnimationFrame(type);
  }
  

  function displaySources(ingredients) {
    const researchPaperIngredients = ingredients.filter(item => item.source === 'research_paper');
    const totalSources = researchPaperIngredients.length;

    sourcesPlaceholder.style.display = 'flex';
    sourcesPlaceholderText.style.display = 'flex';
    sourcesPlaceholderIcon.style.display = 'flex';
    
    if (totalSources > 0) {
      sourcesPlaceholder.style.marginBottom = '10px';
      const sourcesText = 'Sources: ';
      typeText(sourcesList, sourcesText, () => {
        appendSourceLinks(researchPaperIngredients);
        showElement(sourcesList);
      });
    } else {
      sourcesPlaceholder.style.marginBottom = '30px';
    }
  }  
  
  function appendSourceLinks(ingredients) {
    let count = 1;
  
    ingredients.forEach(item => {
      const sourceLink = createElement('a', 'askunali-sources-count', count.toString());
      sourceLink.href = item.paper_url;
      sourceLink.target = '_blank';

      sourceLink.addEventListener('click', () => {
        window.amplitude.track('Research Paper Clicked', { paperUrl: item.paper_url });
      });

      appendElement(sourcesList, sourceLink);
      count++;
    });
  }

  function displayShoppingLinks(shoppingData) {
    // Extract styles from the config object
    const { border_color, border_radius, suggestion_background_color } = config.styles;
  
    let hasShoppingLinks = false;
  
    // Display activities
    if (shoppingData.activities.length > 0) {
      shoppingData.activities.forEach(item => {
        createShoppingLink(item, border_color, border_radius, suggestion_background_color);
      });
      hasShoppingLinks = true;
    }
  
    // Display ingredients
    if (shoppingData.ingredients.length > 0) {
      shoppingData.ingredients.forEach(item => {
        createShoppingLink(item, border_color, border_radius, suggestion_background_color);
      });
      hasShoppingLinks = true;
    }
  
    if (hasShoppingLinks) {
      showElement(shoppingContainer);
    }
  }
  
  function createShoppingLink(item, border_color, border_radius, suggestion_background_color) {
    const shoppingLink = createElement('a', 'askunali-shopping-container-count', item.display_name);
    shoppingLink.href = item.link;
    shoppingLink.target = '_blank';
    shoppingLink.style.display = 'flex';

    shoppingLink.addEventListener('click', () => {
      window.amplitude.track('Product Clicked', { productName: item.display_name });
    });    
    
    // Apply the extracted styles
    shoppingLink.style.borderColor = border_color;
    shoppingLink.style.borderRadius = `${border_radius}px`;
    shoppingLink.style.backgroundColor = suggestion_background_color;
    
    appendElement(shoppingLinks, shoppingLink);
  }
  

  function displayErrorMessage(locale) {
    answerContainer.textContent = locale.errorMessage;
  }  

  function handleIngredientOrActivityClick(event, ingredients) {
    if (event.target.classList.contains('askunali-ingredient-link')) {
        event.preventDefault();
        const clickedName = event.target.textContent;
        const allItems = [...ingredients];
        const matchedItem = allItems.find(item => item.ingredient_name === clickedName);

        if (matchedItem) {
            let summary = '';
            if (matchedItem.source === 'research_paper') {
                summary = matchedItem.paper_summary;
            } else if (matchedItem.source === 'anecdotal') {
                summary = matchedItem.anecdotal_explanation;
            }

            if (summary) {
                answerContainer.innerHTML = summary;

                showElement(returnButton, 'inline-block');

                if (matchedItem.ingredient_name) {
                    // Save the ingredient name in the HTML for later use
                    dosageButton.dataset.ingredientName = matchedItem.ingredient_name;
                    sideEffectsButton.dataset.ingredientName = matchedItem.ingredient_name;
                    showElement(dosageButton, 'inline-block');
                    showElement(sideEffectsButton, 'inline-block');
                } else {
                    hideElement(dosageButton);
                    hideElement(sideEffectsButton);
                }

                hideElement(shoppingContainer);
            }
        }
    }
  }

  function handleReturnClick() {
      answerContainer.innerHTML = originalAnswer;
      hideElement(returnButton);
      hideElement(dosageButton);
      hideElement(sideEffectsButton);

      if (shoppingLinks.children.length > 0) {
          showElement(shoppingContainer);
      }
  }

  function handleDosageClick() {
      const ingredientName = dosageButton.dataset.ingredientName;
      if (ingredientName) {
          const suggestedQuestion = locale.dosageQuestion.replace('[ingredient_name]', ingredientName);
          questionInput.textContent = suggestedQuestion;
          questionInput.classList.add('not-empty');
          showElement(clearButtonImage);
          showElement(questionOutputIcon);
          handleQuestionSubmit();
      }
  }

  function handleSideEffectsClick() {
      const ingredientName = sideEffectsButton.dataset.ingredientName;
      if (ingredientName) {
          const suggestedQuestion = locale.sideEffectsQuestion.replace('[ingredient_name]', ingredientName);
          questionInput.textContent = suggestedQuestion;
          questionInput.classList.add('not-empty');
          showElement(clearButtonImage);
          showElement(questionOutputIcon);
          handleQuestionSubmit();
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
