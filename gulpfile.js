var gulp = require('gulp'),
    fs = require('fs'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    shell = require('gulp-shell'),
    s3 = require('gulp-s3');

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

gulp.task('deploy', ['build'], function () {
    var aws = JSON.parse(fs.readFileSync('./aws.json'));
    
    gulp.src('./target/**')
        .pipe(s3(aws));
});
