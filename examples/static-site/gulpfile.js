'use strict';

var gulp = require('gulp'),
	base = { base: './src/' };

gulp.task('default', ['html']);

gulp.task('html', function () {
	var data = require('gulp-data'),
		fm = require('gulp-front-matter'),
		hb = require('gulp-hb');

	function getJSON(file) {
		try {
			return require(file.path.replace('.html', '.json'));
		}
		catch (e) {
			return {};
		}
	}

	return gulp
		.src('./src/**/*.html', base)
		.pipe(data(getJSON))
		.pipe(fm({ property: 'meta' }))
		.pipe(hb({
			debug: true,
			data: './src/data/**.js',
			helpers: './node_modules/handlebars-layouts/index.js',
			partials: './src/partials/**.hbs'
		}))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('publish', ['default'], function () {
	var ghPages = require('gulp-gh-pages');

	return gulp
		.src('./dist/**/*')
		.pipe(ghPages());
});
