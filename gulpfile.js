'use strict';

var gulp = require('gulp');
let uglify = require('gulp-uglify-es').default;
let rename = require("gulp-rename");

gulp.task('copy', function() {
    return gulp.src('./src/js/*.js')
        .pipe(gulp.dest('./dist'));
});

// Gulp task to minify JavaScript files
gulp.task('uglify', function() {
    return gulp.src('./src/js/*.js')
        .pipe(rename("bchess.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'))
});
