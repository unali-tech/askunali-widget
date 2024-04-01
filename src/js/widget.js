// my-library.js
(function() {
  // Check if the target div exists
  var targetDiv = document.getElementById('askunali');
  if (!targetDiv) return;

  // Create the widget HTML
  var widgetHTML = `
    <div id="askunali-widget" class="askunali-content">
      <div class="askunali-content-wrapper">
        <h1 class="askunali-title">ASK US <br>ANYTHING</h1>
        <span class="askunali-subtitle">Ask about classes. Ask about nutrition, health and wellness. </span>

        <div class="askunali-question-input-container">
          <img src="magnifying_glass.svg" class="askunali-question-icon">
          <div contenteditable="true" class="askunali-question-input-area" data-placeholder="Ask question here" id="askunali-question_input_div"></div>
          <input type="hidden" id="askunali-question_input">
        </div>
        <button id="askunali-submit_button" class="askunali-submit-button">Ask ></button>

        <div class="askunali-question-output-container">
          <img src="rag-answer-icon.png" class="askunali-question-output-icon">
          <div class="askunali-rag-answer-placeholder">View answer here.</div>
          <div id="askunali-rag-answer"></div>
        </div>
      </div>
    </div>
  `;

  // Replace the target div with the widget HTML
  targetDiv.outerHTML = widgetHTML;
})();