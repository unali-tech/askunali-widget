let dotsInterval;

function startLoadingAnimation() {
  const svg = document.getElementById('askunali-question-output-icon');
  svg.style.display = 'flex';
  
  const processingText = document.getElementById('askunali-processing-text');
  const language = window.askUnaliFinalConfig.language || 'en';
  const processingTranslation = window.askUnaliTranslations[language].processing;

  // Set the initial text with the correct translation
  processingText.textContent = processingTranslation;
  processingText.style.display = 'inline-block';

  svg.classList.add('animate-svg');
  setTimeout(() => {
    svg.classList.add('rotate');
  }, 100);

  let dots = 0;
  dotsInterval = setInterval(() => {
    dots = (dots + 1) % 4;
    processingText.textContent = processingTranslation + '.'.repeat(dots);
  }, 500);
}


function stopLoadingAnimation() {
  const svg = document.getElementById('askunali-question-output-icon');
  const processingText = document.getElementById('askunali-processing-text');
  svg.classList.remove('rotate');
  svg.classList.remove('animate-svg');
  clearInterval(dotsInterval);

  processingText.innerHTML = 'AskUnali';
  processingText.style.display = 'inline-block';

  setTimeout(() => {
    svg.querySelectorAll('g[class^="outer-donut-"] > g').forEach(donut => {
      donut.style.transform = 'translate(0, 0)';
    });
  }, 0);
}


function typeText(element, text, onComplete) {
  let currentText = '';
  let index = 0;
  const typingSpeed = 10;

  function type() {
    if (index < text.length) {
      const currentChar = text.charAt(index);
      currentText += currentChar;
      element.innerHTML = currentText;
      index++;
      setTimeout(type, typingSpeed);
    } else {
      if (onComplete) {
        onComplete();
      }
    }
  }

  type();
}


function fadeIn(element, duration, onComplete) {
  element.style.opacity = 0;
  element.style.display = 'block';

  let opacity = 0;
  const interval = 10;
  const increment = interval / duration;

  function fade() {
    opacity += increment;
    element.style.opacity = opacity;

    if (opacity < 1) {
      setTimeout(fade, interval);
    } else {
      onComplete();
    }
  }

  fade();
}
