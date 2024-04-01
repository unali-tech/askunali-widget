var gulp = require('gulp');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var inlineSource = require('gulp-inline-source');

gulp.task('minify-js', function() {
  return gulp.src('src/js/*.js')
    .pipe(uglify())
    .pipe(concat('widget.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('minify-css', function() {
  return gulp.src('src/css/*.css')
    .pipe(cleanCSS())
    .pipe(concat('widget.css'))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('inline-source', function() {
  return gulp.src('dist/js/widget.js')
    .pipe(inlineSource())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('default', gulp.series('minify-js', 'minify-css', 'inline-source'));