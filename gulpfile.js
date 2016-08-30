var gulp = require('gulp');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');

var path = 'public/dashboard/stylesheets';

gulp.task('compress', function () {
    gulp.src([path + '/*.css', '!' + path + '/*.min.css'])
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path));
});