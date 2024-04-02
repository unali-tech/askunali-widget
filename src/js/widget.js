// my-library.js
(function() {
  // Check if the target div exists
  var targetDiv = document.getElementById('askunali');
  if (!targetDiv) return;

  // Create the widget HTML
  var widgetHTML = `
    
  `;

  // Replace the target div with the widget HTML
  targetDiv.outerHTML = widgetHTML;
})();
