var gulp = require('gulp'),
    fs = require('fs'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    shell = require('gulp-shell');

gulp.task('default', function () {
    gulp.watch('./static/scss/**/*.scss', ['sass']);
});

gulp.task('sass', function () {
    gulp.src('./static/scss/*.scss')
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./static/css'));
});

gulp.task('build', ['sass'], shell.task([
    'mkdir -p public/javascripts',
    'mkdir -p public/stylesheets',
    'jspm bundle-sfx static/js/builder/bootstrap public/javascripts/app.js',
    'cp -r ./static/css/* public/stylesheets/'
]));

gulp.task('build-quiz', shell.task([
    'jspm bundle-sfx static/js/quizzes/bootstrap conf/quiz-app.js'
]));

gulp.task('watch-build', function () {
    gulp.watch(['./static/scss/**/*.scss', './static/js/**/*.*'], ['build']);
});
