function startLoadingAnimation() {
  const svg = document.getElementById('askunali-question-output-icon');
  svg.classList.add('animate-svg');
  setTimeout(() => {
    svg.classList.add('rotate');
  }, 100);
}

function stopLoadingAnimation() {
  const svg = document.getElementById('askunali-question-output-icon');
  svg.classList.remove('rotate');
  svg.classList.remove('animate-svg');
  setTimeout(() => {
    svg.querySelectorAll('g[class^="outer-donut-"] > g').forEach(donut => {
      donut.style.transform = 'translate(0, 0)';
    });
  }, 0);
}

function typeText(element, text, onComplete) {
  let currentText = '';
  let index = 0;
  const typingSpeed = 20;

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
