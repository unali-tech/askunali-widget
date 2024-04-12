(function() {
  var config = window.askUnaliConfig || {};

  if(!config.apiKey) {
    console.error('No API key provided');
    return;
  }

  var targetDiv = document.getElementById('askunali');
  if (!targetDiv) return;

  var widgetHTML = `{{WIDGET_HTML}}`;

  targetDiv.outerHTML = widgetHTML;

  function addScript() {
    const editableDiv = document.getElementById('askunali-question_input_div');

    const questionInputContainer = document.querySelector('.askunali-question-input-container');
    const placeholder = document.querySelector('.askunali-rag-answer-placeholder');

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
    document.head.appendChild(style);

    editableDiv.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        submitQuestion();
      }
    });
    
    function submitQuestion() {
      const question = editableDiv.textContent.trim();
      if (question !== '') {
        fetch('https://unalihealth.com/ask_question', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
          },
          body: JSON.stringify({ question: question })
        })
        .then(response => response.json())
        .then(data => {
          const answerBox = document.getElementById('askunali-rag-answer');
          placeholder.style.display = 'none';
          answerBox.textContent = '';
    
          let currentText = '';
          let index = 0;
          const typingSpeed = 20;
    
          function typeAnswer() {
            if (index < data.answer.length) {
              currentText += data.answer.charAt(index);
              answerBox.textContent = currentText;
              index++;
              setTimeout(typeAnswer, typingSpeed);
            }
          }
    
          typeAnswer();
        })
        .catch(error => {
          console.error('Error:', error);
        });
      }
    }    
  }

  addScript();
})();