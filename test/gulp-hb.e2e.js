'use strict';

var hb = require('../index'),
	expect = require('expect.js'),
	map = require('map-stream'),
	fs = require('fs'),
	vs = require('vinyl-fs');

describe('hb e2e', function () {
	var count;

	function toEqualExpected(file, cb) {
		count++;

		var expected = file.path.replace('fixtures', 'expected');
		expect(file.contents.toString()).to.be(fs.readFileSync(expected, 'utf8'));
		cb(null, file);
	}

	it('should render handlebars files', function (done) {
		count = 0;

		vs.src(__dirname + '/simple/fixtures/**/*.html')
			.pipe(hb())
			.pipe(map(toEqualExpected))
			.on('error', done)
			.on('end', function () {
				expect(count).to.be(0);
				done();
			});
	});

	it('should render handlebars files with data', function (done) {
		count = 0;

		vs.src(__dirname + '/data/fixtures/**/*.html')
			.pipe(hb({ data: '' }))
			.pipe(map(toEqualExpected))
			.on('error', done)
			.on('end', function () {
				expect(count).to.be(0);
				done();
			});
	});

	it('should render handlebars files with helpers', function (done) {
		count = 0;

		vs.src(__dirname + '/helpers/fixtures/**/*.html')
			.pipe(hb({ helpers: '' }))
			.pipe(map(toEqualExpected))
			.on('error', done)
			.on('end', function () {
				expect(count).to.be(0);
				done();
			});
	});

	it('should render handlebars files with partials', function (done) {
		count = 0;

		vs.src(__dirname + '/partials/fixtures/**/*.html')
			.pipe(hb({ partials: '' }))
			.pipe(map(toEqualExpected))
			.on('error', done)
			.on('end', function () {
				expect(count).to.be(0);
				done();
			});
	});

	it('should render handlebars files with all the things', function (done) {
		count = 0;

		vs.src(__dirname + '/all/fixtures/**/*.html')
			.pipe(hb({
				data: '',
				helpers: '',
				partials: ''
			}))
			.pipe(map(toEqualExpected))
			.on('error', done)
			.on('end', function () {
				expect(count).to.be(0);
				done();
			});
	});
});
