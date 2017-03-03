'use strict';
const gulp = require('gulp');
const concat = require('gulp-concat'); // Склейка файлов
const sass = require('gulp-sass');

var paths = {
  scripts: [ 'public/modules/common/main.js', 'public/modules/**/*.js'],
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
    /*gulp.watch(paths.scripts, gulp.parallel('js'));
    gulp.watch(paths.scss, gulp.parallel('sass'));*/

	gulp.watch(paths.scripts, ['js']);
    gulp.watch(paths.scss, ['sass']);    
    
});

gulp.task('getLibs', function() {
    return new Promise(function(resolve, reject) {
	    gulp.src(['node_modules/bootstrap/dist/**/*'])
	        .pipe(gulp.dest('public/libs/bootstrap'))
		
		gulp.src(['node_modules/font-awesome/css/font-awesome.min.css', 'node_modules/font-awesome/fonts/*'], {base:"./node_modules/font-awesome"})
	        .pipe(gulp.dest('public/libs/font-awesome'))
		
		gulp.src(['node_modules/angular-aria/angular-aria.js'], {base:"./node_modules/angular-aria"})
	        .pipe(gulp.dest('public/libs'))
		
		gulp.src(['node_modules/angular-animate/angular-animate.js'], {base:"./node_modules/angular-animate"})
	        .pipe(gulp.dest('public/libs'))

	    gulp.src(['node_modules/angular-messages/angular-messages.js'], {base:"./node_modules/angular-messages"})
	        .pipe(gulp.dest('public/libs'))
	    
	    gulp.src(['node_modules/angular-material/*'], {base:"./node_modules/angular-material"})
	        .pipe(gulp.dest('public/libs/angular-material'))


		resolve();
	});
        
});