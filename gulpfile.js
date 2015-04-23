var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    shell = require('gulp-shell');

gulp.task('default', function () {
    gulp.watch('scss/**/*.scss', ['sass']);
});

gulp.task('sass', function () {
    gulp.src('./scss/*.scss')
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./css'));
});

gulp.task('build', ['sass'], shell.task([
    'rm -Rf target',
    'mkdir target',
    'jspm bundle-sfx lib/bootstrap target/app.js',
    'cp -r ./css target/',
    'cp build.html target/index.html'
]));
