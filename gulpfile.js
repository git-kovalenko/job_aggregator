'use strict';
const gulp = require('gulp');
const concat = require('gulp-concat'); // Склейка файлов

var paths = {
  scripts: ['./public/scripts/**/*.js', '!./public/scripts/libs/**/*.js', '!./public/scripts/index.js'],
  images: 'client/img/**/*'
};

gulp.task('js', function() {
    return new Promise(function(resolve, reject) {
	    gulp.src(paths.scripts)
	        .pipe(concat('index.js')) 
	        .pipe(gulp.dest('./public/scripts'))
		resolve();
	});
        
});

gulp.task('watch', function() {
    gulp.watch(paths.scripts, gulp.series('js'));
    
});