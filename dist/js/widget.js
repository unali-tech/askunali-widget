!function(){var s=document.getElementById("askunali");s&&(s.outerHTML=`
    <style inline src="../css/widget.css"></style>
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
  `)}();