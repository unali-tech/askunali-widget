var gulp = require('gulp');
var inlineCss = require('gulp-inline-css');
var htmlmin = require('gulp-htmlmin');
var minify = require('gulp-minify');
var replace = require('gulp-replace');
var fs = require('fs');
var clean = require('gulp-clean');

gulp.task('inline-css', function() {
    return gulp.src('./src/html/widget.html')
        .pipe(inlineCss({
            applyStyleTags: true,
            applyLinkTags: true,
            removeStyleTags: true,
            removeLinkTags: true
        }))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'));
});

gulp.task('inject-html', function() {
  var widgetHTML = fs.readFileSync('./dist/widget.html', 'utf8');
  widgetHTML = widgetHTML.replace(/`/g, '\\`').replace(/\$/g, '\\$');
  widgetHTML = widgetHTML.replace(/\n/g, '');
  return gulp.src('./src/js/widget.js')
      .pipe(replace('/*HTML_CONTENT*/', `\`${widgetHTML}\``))
      .pipe(minify())
      .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
  return gulp.src(['dist/widget.html', 'dist/widget.js'], {read: false})
      .pipe(clean());
});

gulp.task('default', gulp.series('inline-css', 'inject-html', 'clean'));