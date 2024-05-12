(function() {
  var config = window.askUnaliConfig || {};

  if (!config.apiKey) {
    console.warn('No API key provided. Requests will be limited.');
    config.apiKey = 'default';
  }

  var targetDiv = document.getElementById('askunali');
  if (!targetDiv) return;

  var widgetHTML = `{{WIDGET_HTML}}`;

  targetDiv.outerHTML = widgetHTML;

  function addScript() {
    const editableDiv = document.getElementById('askunali-question_input_div');

    const questionInputContainer = document.querySelector('.askunali-question-input-container');
    const placeholder = document.querySelector('.askunali-answer-placeholder');

    window.askUnaliUpdateApiKey = function(newApiKey) {
      config.apiKey = newApiKey;
    };

    function updatePlaceholder() {
      if (editableDiv.textContent.trim().length > 0) {
        editableDiv.classList.add('not-empty');
      } else {
        editableDiv.classList.remove('not-empty');
      }
    }

    editableDiv.addEventListener('blur', function() {
      updatePlaceholder();
    });

    editableDiv.addEventListener('input', updatePlaceholder);

    updatePlaceholder();

    questionInputContainer.addEventListener('click', function(event) {
      if (document.activeElement !== editableDiv) {
        editableDiv.focus();
        if (editableDiv.textContent.length > 0) {
          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(editableDiv);
          range.collapse(false);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    });

    editableDiv.addEventListener('mousedown', function(event) {
      if (document.activeElement !== editableDiv) {
        event.preventDefault();
        editableDiv.focus();
      }
    });

    var style = document.createElement('style');

    if(config.styles) {

      if(config.styles.borderColor) {
        style.innerHTML += `
          .askunali-question-input-container, 
          .askunali-question-output-container {
            border: 1px solid ${config.styles.borderColor} !important;
          }
        `;
      }

      if(config.styles.borderRadius) {
        style.innerHTML += `
          .askunali-question-input-container,
          .askunali-question-output-container {
            border-radius: ${config.styles.borderRadius} !important;  
          }
        `;
      }

      if(config.styles.questionBox) {
        if(config.styles.questionBox.backgroundColor) {
          style.innerHTML += `
            .askunali-question-input-container {
              background-color: ${config.styles.questionBox.backgroundColor} !important;
            }
          `;
        }
        if(config.styles.questionBox.fontColor) {
          style.innerHTML += `
            .askunali-question-input-container {
              color: ${config.styles.questionBox.fontColor} !important;
            }
          `;
        }
      }

      if(config.styles.answerBox) {
        if(config.styles.answerBox.backgroundColor) {
          style.innerHTML += `
            .askunali-question-output-container {
              background-color: ${config.styles.answerBox.backgroundColor} !important;
            }
          `;
        }
        if(config.styles.answerBox.fontColor) {
          style.innerHTML += `
            .askunali-question-output-container {
              color: ${config.styles.answerBox.fontColor} !important;
            }
          `;
        }
      }

    }

    style.innerHTML += `
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
    `;

    style.innerHTML += `
      @keyframes moveDonut1 {
        0% {
          transform: translate(0, 0);
        }
        100% {
          transform: translate(0.5px, calc(-1 * 0.5px));
        }
      }

      @keyframes moveDonut2 {
        0% {
          transform: translate(0, 0);
        }
        100% {
          transform: translate(0.5px, 0.5px);
        }
      }

      @keyframes moveDonut3 {
        0% {
          transform: translate(0, 0);
        }
        100% {
          transform: translate(calc(-1 * 0.5px), 0.5px);
        }
      }

      @keyframes moveDonut4 {
        0% {
          transform: translate(0, 0);
        }
        100% {
          transform: translate(calc(-1 * 0.5px), calc(-1 * 0.5px));
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
    `
    document.head.appendChild(style);

    editableDiv.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        submitQuestion();
      }
    });

    function clearAnswer() {
      const answerBox = document.getElementById('askunali-answer');
      const placeholder = document.querySelector('.askunali-answer-placeholder');
      const separator = document.getElementById('askunali-separator');
      const sources = document.getElementById('askunali-sources');
      const link = document.getElementById('askunali-link');
      const shoppingContainer = document.getElementById('askunali-shopping-container');
      const shoppingLinks = document.getElementById('askunali-shopping-links');
    
      answerBox.textContent = '';
      placeholder.style.display = 'block';
      separator.style.display = 'none';
      sources.style.display = 'none';
      sources.textContent = '';
      link.style.display = 'none';
      shoppingContainer.style.display = 'none';
      shoppingLinks.innerHTML = '';
    }    
    
    function submitQuestion() {
      const question = editableDiv.textContent.trim();
      if (question !== '') {
        clearAnswer()

        const svg = document.getElementById('askunali-question-output-icon');
        svg.classList.add('animate-svg');
        setTimeout(() => {
          svg.classList.add('rotate');
        }, 100);

        const startTime = performance.now();
        console.log('Start time:', startTime);

        fetch('https://rag-api-e0qu.onrender.com/ask_question', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            question: question,
            api_key: config.apiKey
          })
        })
        .then(response => response.json())
        .then(data => {
          const endTime = performance.now();
          console.log('End time:', endTime);
          console.log('Response time:', endTime - startTime, 'ms');
          svg.classList.remove('rotate');
          svg.classList.remove('animate-svg');
          setTimeout(() => {
            svg.querySelectorAll('g[class^="outer-donut-"] > g').forEach(donut => {
              donut.style.transform = 'translate(0, 0)';
            });
          }, 0);

          const answerBox = document.getElementById('askunali-answer');
          placeholder.style.display = 'none';
          answerBox.textContent = '';
    
          let currentText = '';
          let index = 0;
          const typingSpeed = 20;

          const answerType = data.type;

          // if the type is "basic" or "error", we justt type the answer with no additional element
          // if the type is "enhanced", we keep the flow as it is
    
          function typeAnswer() {
            if (index < data.answer.length) {
              const currentChar = data.answer.charAt(index);
              currentText += currentChar;

              if (answerType === 'enhanced') {
                answerBox.innerHTML = highlightIngredients(currentText);
              } else {
                answerBox.textContent = currentText;
              }

              index++;
              setTimeout(typeAnswer, typingSpeed);
            } else {
              if (answerType === 'enhanced') {
                showAdditionalElements();
              }
            }
          }
          
          function highlightIngredients(text) {
            const ingredients = data.ingredients_data.map(item => item.ingredient_name);
            const activities = data.activities_data.map(item => item.activity_name);
            const names = [...ingredients, ...activities];
          
            names.forEach(name => {
              const regex = new RegExp(`\\b${name}\\b`, 'gi');
              text = text.replace(regex, `<a href="#" class="askunali-ingredient-link" style="color: #3366CC;">${name}</a>`);
            });
          
            return text;
          }
          
          function showAdditionalElements() {
            const separator = document.getElementById('askunali-separator');
            const sources = document.getElementById('askunali-sources');
            const link = document.getElementById('askunali-link');
          
            // If data.shopping_data.activities or data.shopping_data.ingredients is not empty
            if (data.shopping_data.activities.length > 0 || data.shopping_data.ingredients.length > 0) {
              appendShoppingContainer();
            }
          
            setTimeout(() => {
              separator.style.display = 'block';
            }, 500);
          
            setTimeout(() => {
              sources.style.display = 'flex';
              typeLink();
              typeSourcesText();
            }, 1000);
          }

          function appendShoppingContainer() {
            const shoppingContainer = document.getElementById('askunali-shopping-container');
            shoppingContainer.style.display = 'flex';
          
            const shoppingItems = data.shopping_data.activities;
          
            let shoppingIndex = 0;
            const appendDelay = 200;
          
            function appendNextShoppingLink() {
              if (shoppingIndex < shoppingItems.length) {
                const item = shoppingItems[shoppingIndex];
                const shoppingLink = document.createElement('a');
                shoppingLink.classList.add('askunali-shopping-container-count');
                shoppingLink.href = item.link;
                shoppingLink.target = '_blank';
                shoppingLink.textContent = item.display_name;
                shoppingLink.style.cssText = `
                  border: 1px solid #004695;
                  color: #303840;
                  border-radius: 20px;
                  padding: 5px 15px;
                  display: inline-flex;
                  justify-content: center;
                  align-items: center;
                  margin-left: 8px;
                  font-size: 16px;
                  cursor: pointer;
                `;
                shoppingContainer.appendChild(shoppingLink);
                shoppingIndex++;
                setTimeout(appendNextShoppingLink, appendDelay);
              }
            }
          
            appendNextShoppingLink();
          }
          
          
          function typeSourcesText() {
            const sourcesContainer = document.getElementById('askunali-sources');
            const totalSources = data.ingredients_data.length + data.activities_data.length;
          
            if (totalSources > 0) {
              let sourcesText = 'Sources: ';
              let sourcesIndex = 0;
              const typingSpeed = 30;
          
              function typeNextChar() {
                if (sourcesIndex < sourcesText.length) {
                  sourcesContainer.innerHTML += sourcesText.charAt(sourcesIndex);
                  sourcesIndex++;
                  setTimeout(typeNextChar, typingSpeed);
                } else {
                  appendSourceLinks();
                }
              }
          
              typeNextChar();
            }
          }
          
          
          function appendSourceLinks() {
            const sourcesContainer = document.getElementById('askunali-sources');
            const sourceItems = [...data.ingredients_data, ...data.activities_data];
            let sourceIndex = 0;
            const appendDelay = 50;
          
            function appendNextSourceLink() {
              if (sourceIndex < sourceItems.length) {
                const item = sourceItems[sourceIndex];
                const sourceLink = document.createElement('a');
                sourceLink.classList.add('askunali-sources-count');
                sourceLink.href = item.paper_url;
                sourceLink.target = '_blank';
                sourceLink.textContent = sourceIndex + 1;
                sourceLink.style.cssText = `
                  border: 1px solid #004695;
                  color: #004695;
                  border-radius: 50%;
                  width: 22px;
                  height: 22px;
                  display: inline-flex;
                  justify-content: center;
                  align-items: center;
                  margin-left: 8px;
                  font-size: 14px;
                  cursor: pointer;
                `;
                sourcesContainer.appendChild(sourceLink);
                sourceIndex++;
                setTimeout(appendNextSourceLink, appendDelay);
              }
            }
          
            appendNextSourceLink();
          }
          
          function typeLink() {
            const link = document.getElementById('askunali-link');
            link.style.cssText = `
              display: flex;
              align-items: 
              text-decoration: underline;
              color: #303840;
              font-size: 14px;
            
              position: absolute;
              bottom: 10px;
              right: 20px;
            `;
          }
          
          
          function updateSourcesCount() {
            const sourcesCount = document.getElementById('askunali-sources-count');
            const totalSources = data.ingredients_data.length + data.activities_data.length;
            sourcesCount.textContent = totalSources;
          }
          
          answerBox.addEventListener('click', function(event) {
            if (event.target.classList.contains('askunali-ingredient-link')) {
              event.preventDefault();
              const name = event.target.textContent;
              const item = [...data.ingredients_data, ...data.activities_data].find(
                item => item.ingredient_name === name || item.activity_name === name
              );
              if (item) {
                const originalAnswer = answerBox.innerHTML;
                answerBox.innerHTML = item.paper_summary;
                showReturnButton(originalAnswer);
              }
            }
          });
          
          function showReturnButton(originalAnswer) {
            const returnButton = document.getElementById('askunali-return-button');
            returnButton.style.display = 'block';
            returnButton.onclick = function() {
              answerBox.innerHTML = originalAnswer;
              returnButton.style.display = 'none';
            };
          }
    
          typeAnswer();
        })
        .catch(error => {
          console.error('Error:', error);

          svg.classList.remove('rotate');
          svg.classList.remove('animate-svg');
          setTimeout(() => {
            svg.querySelectorAll('g[class^="outer-donut-"] > g').forEach(donut => {
              donut.style.transform = 'translate(0, 0)';
            });
          }, 0);
        });
      }
    }
  }

  addScript();
})();