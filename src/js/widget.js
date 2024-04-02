(function() {
  var targetDiv = document.getElementById('askunali');
  if (!targetDiv) return;

  var widgetHTML = `{{WIDGET_HTML}}`;

  targetDiv.outerHTML = widgetHTML;
})();