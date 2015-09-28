'use strict';

var gulp = require('gulp');

gulp.task('default', ['build']);

gulp.task('build', function () {
	var fm = require('gulp-front-matter'),
		nav = require('gulp-nav'),
		hb = require('gulp-hb');

	return gulp
		.src('src/**/*.html')
		.pipe(fm({ property: 'data' }))
		.pipe(nav())
		.pipe(hb({ partials: 'src/partials/**/*.hbs' }))
		.pipe(gulp.dest('dist'));
});
