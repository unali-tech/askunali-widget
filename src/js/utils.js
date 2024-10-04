function highlightText(text, highlights) {
  highlights.forEach(highlight => {
    const regex = new RegExp(`\\b${highlight}\\b`, 'gi');
    text = text.replace(regex, `<a href="#" class="askunali-ingredient-link" style="color: #3366CC;">${highlight}</a>`);
  });
  return text;
}

function createElement(tag, className, content) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (content) {
    element.innerHTML = content;
  }
  return element;
}

function typeText(element, text, onComplete, typingSpeed = 30) {
  let index = 0;

  function typeNextChar() {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
      setTimeout(typeNextChar, typingSpeed);
    } else {
      if (onComplete) {
        onComplete();
      }
    }
  }

  typeNextChar();
}


function appendElement(parent, child) {
  parent.appendChild(child);
}

function removeElement(element) {
  element.parentNode.removeChild(element);
}

function showElement(element, displayType = 'flex') {
  element.style.display = displayType;
}

function hideElement(element) {
  element.style.display = 'none';
}

function getTimestamp() {
  return Date.now();
}

function formatTime(time) {
  return time.toFixed(2) + ' ms';
}

function applyStyles(styles) {
  if (!styles) {
    console.warn('Widget styles not found.');
    return;
  }

  const {
    border_color,
    border_radius,
    question_font_color,
    question_background_color,
    answer_font_color,
    answer_background_color,
    suggestion_background_color,
    icon_color,
  } = styles;

  const widget = document.getElementById('askunali-widget');
  if (border_color) {
    widget.style.setProperty('--color-border', border_color);
  }

  const returnButton = document.getElementById('askunali-return-button');
  const dosageButton = document.getElementById('askunali-dosage-button');
  const sideEffectsButton = document.getElementById('askunali-side-effects-button');
  if (border_radius !== undefined) {
    returnButton.style.borderRadius = `${border_radius}px`;
    dosageButton.style.borderRadius = `${border_radius}px`;
    sideEffectsButton.style.borderRadius = `${border_radius}px`;
  }
  if (suggestion_background_color) {
    returnButton.style.backgroundColor = suggestion_background_color;
    dosageButton.style.backgroundColor = suggestion_background_color;
    sideEffectsButton.style.backgroundColor = suggestion_background_color;
  }
  if (border_color) {
    returnButton.style.borderColor = border_color;
    dosageButton.style.borderColor = border_color;
    sideEffectsButton.style.borderColor = border_color;
  }

  const questionInputContainer = document.querySelector('.askunali-question-input-container');
  if (question_font_color) {
    questionInputContainer.style.color = question_font_color;
  }
  if (question_background_color) {
    questionInputContainer.style.backgroundColor = question_background_color;
  }
  if (border_radius !== undefined) {
    questionInputContainer.style.borderRadius = `${border_radius}px`;
  }

  const questionOutputContainer = document.querySelector('.askunali-question-output-container');
  if (answer_font_color) {
    questionOutputContainer.style.color = answer_font_color;
  }
  questionOutputContainer.style.border = 'none'

  const questionIcon = document.querySelector('.askunali-question-icon');
  if (icon_color) {
    questionIcon.querySelector('circle').style.stroke = icon_color;
    questionIcon.querySelector('path').style.stroke = icon_color;
  }

  const questionOutputIcon = document.getElementById('askunali-question-output-icon');
  if (icon_color) {
    questionOutputIcon.querySelectorAll('circle')[1].style.fill = icon_color;
    questionOutputIcon.querySelectorAll('path').forEach(path => {
      path.style.fill = icon_color;
    });
  }

  const clearButtonImage = document.getElementById('askunali-clear-button-image');
  if (icon_color) {
    clearButtonImage.querySelector('path').style.fill = icon_color;
  }
}

function applyQuestionOutputStyles(styles) {
  const {
    border_color,
    border_radius,
    answer_background_color,
  } = styles;
  
  const questionOutputContainer = document.querySelector('.askunali-question-output-container');
  if (border_color) {
    questionOutputContainer.style.border = `1px solid ${border_color}`;
    questionOutputContainer.style.borderBottom = 'none';
  }
  if (answer_background_color) {
    questionOutputContainer.style.backgroundColor = answer_background_color;
  }
  if (border_radius !== undefined) {
    questionOutputContainer.style.borderRadius = `${border_radius}px ${border_radius}px 0 0`;
  }

  const questionOutputContainerBottom = document.querySelector('.askunali-question-output-container-bottom');
  if (answer_background_color) {
    questionOutputContainerBottom.style.backgroundColor = answer_background_color;
  }
  if (border_color) {
    questionOutputContainerBottom.style.border = `1px solid ${border_color}`;
    questionOutputContainerBottom.style.borderTop = 'none';
  }
  if (border_radius !== undefined) {
    questionOutputContainerBottom.style.borderRadius = `0 0 ${border_radius}px ${border_radius}px`;
    questionOutputContainerBottom.style.height = `${border_radius}px`;
  }
}