'use strict';

var gulp = require('gulp'),
	paths = {
		gulp: './gulpfile.js',
		src: './index.js',
		test: './test/**/*Spec.js'
	};

gulp.task('default', ['lint', 'test']);

gulp.task('lint', function () {
	var jscs = require('gulp-jscs'),
		jshint = require('gulp-jshint');

	return gulp
		.src([paths.gulp, paths.src, paths.test])
		.pipe(jscs())
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('cover', function () {
	var istanbul = require('gulp-istanbul');

	return gulp
		.src(paths.src)
		.pipe(istanbul());
});

gulp.task('test', ['cover'], function () {
	var istanbul = require('gulp-istanbul'),
		jasmine = require('gulp-jasmine');

	return gulp
		.src(paths.test)
		.pipe(jasmine({ verbose: true }))
		.pipe(istanbul.writeReports());
});
