var gulp = require('gulp'),
	plumber = require('gulp-plumber'),
	paths = {
		gulp: './gulpfile.js',
		src: './index.js',
		test: './test/**/*.{e2e,spec}.js'
	};

gulp.task('default', ['test']);

gulp.task('lint', function () {
	var eslint = require('gulp-eslint');

	return gulp
		.src([paths.gulp, paths.src, paths.test])
		.pipe(eslint())
		.pipe(eslint.format());
});

gulp.task('cover', function () {
	var istanbul = require('gulp-istanbul');

	return gulp
		.src(paths.src)
		.pipe(istanbul())
		.pipe(istanbul.hookRequire());
});

gulp.task('test', ['lint', 'cover'], function () {
	var istanbul = require('gulp-istanbul'),
		mocha = require('gulp-mocha');

	return gulp
		.src(paths.test)
		.pipe(plumber())
		.pipe(mocha({ reporter: 'spec' }))
		.pipe(istanbul.writeReports());
});

gulp.task('watch', function () {
	gulp.watch([paths.src, paths.test], ['test']);
});
