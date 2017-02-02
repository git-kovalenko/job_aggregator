'use strict';
const gulp = require('gulp');
const concat = require('gulp-concat'); // Склейка файлов
const sass = require('gulp-sass');

var paths = {
  scripts: [ 'public/modules/**/*.js'],
  images: 'public/images/*',
  scss: 'public/styles/scss/*.scss'
};

gulp.task('js', function() {
    return new Promise(function(resolve, reject) {
	    gulp.src(paths.scripts)
	        .pipe(concat('index.js')) 
	        .pipe(gulp.dest('public'))
		resolve();
	});
        
});
gulp.task('sass', function () {
  return gulp.src(paths.scss)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(concat('style.css'))
    // .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('public/styles'));
});

gulp.task('watch', function() {
    gulp.watch(paths.scripts, gulp.parallel('js'));
    gulp.watch(paths.scss, gulp.parallel('sass'));
    
});