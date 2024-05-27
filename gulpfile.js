var gulp = require('gulp');
var inlineCss = require('gulp-inline-css');
var htmlmin = require('gulp-htmlmin');
var replace = require('gulp-replace');
var fs = require('fs');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var order = require('gulp-order');
var inlineSource = require('gulp-inline-source');

gulp.task('inline-css', function() {
    var cssContent = fs.readFileSync('./src/css/widget.css', 'utf8');
    return gulp.src('./src/html/widget.html')
        .pipe(replace('{{STYLES}}', cssContent))
        .pipe(inlineCss({
            applyStyleTags: true,
            applyLinkTags: true,
            removeStyleTags: false,
            removeLinkTags: true,
            preserveMediaQueries: true
        }))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeOptionalTags: true,
            minifyJS: true,
            minifyCSS: true
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('inline-source', function() {
    return gulp.src('./dist/widget.html')
        .pipe(inlineSource())
        .pipe(gulp.dest('dist'));
});

gulp.task('inject-html', function() {
    var widgetHTML = fs.readFileSync('./dist/widget.html', 'utf8');
    widgetHTML = widgetHTML.replace(/`/g, '\\`');
    widgetHTML = JSON.stringify(widgetHTML).slice(1, -1);
    return gulp.src('./src/js/main.js')
        .pipe(replace('{{WIDGET_HTML}}', widgetHTML))
        .pipe(gulp.dest('dist/js')); 
});

gulp.task('bundle-js', function() {
    return gulp.src([
      './src/js/config.js',
      './src/js/utils.js',
      './src/js/api.js',
      './src/js/animation.js',
      './src/js/custom-styles.js',
      './src/js/dom.js',
      './dist/js/main.js'
    ])
    .pipe(order([
      'config.js',
      'utils.js',
      'api.js',
      'animation.js',
      'custom-styles.js',
      'dom.js',
      'main.js'
    ]))
    .pipe(concat('widget.min.js', {newLine: ';'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
  });  
  

gulp.task('clean', function() {
    return gulp.src(['dist/widget.html', 'dist/js'], {read: false, allowEmpty: true})
        .pipe(clean());
});

gulp.task('copy-widget', function() {
    return gulp.src('./dist/widget.min.js')
        .pipe(gulp.dest('../expert_portal_reboot/public/'))
        .pipe(gulp.dest('./test/'));
});

gulp.task('default', gulp.series('inline-css', 'inline-source', 'inject-html', 'bundle-js', 'clean', 'copy-widget'));
