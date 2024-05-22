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

function showElement(element) {
  element.style.display = 'flex';
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
