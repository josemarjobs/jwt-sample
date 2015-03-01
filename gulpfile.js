var gulp = require('gulp'),
  gutil = require('gulp-util'),
  webserver = require('gulp-webserver');

gulp.task('js', function() {
  gulp.src('public/**/*')
});

gulp.task('html', function() {
  gulp.src('public/*.html')
});

gulp.task('css', function() {
  gulp.src('public/css/*.css')
});

gulp.task('watch', function() {
  gulp.watch('public/**/*', ['js']);
  gulp.watch('public/css/*.css', ['css']);
  gulp.watch(['public/*.html',
    'public/views/*.html'], ['html']);
});

gulp.task('webserver', function() {
  gulp.src('public/')
    .pipe(webserver({
      livereload: true,
      open: true
    }));
});

gulp.task('default', ['watch', 'html', 'js', 'css', 'webserver']);
