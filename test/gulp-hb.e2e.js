'use strict';

var hb = require('../index'),
	expect = require('expect.js'),
	map = require('map-stream'),
	fs = require('fs'),
	vs = require('vinyl-fs'),

	config = {
		data: __dirname + '/fixtures/data/**/*.{js,json}',
		helpers: __dirname + '/fixtures/helpers/**/*.js',
		partials: __dirname + '/fixtures/partials/**/*.hbs',
		templates: __dirname + '/fixtures/templates/'
	};

describe('gulp-hb e2e', function () {
	var count;

	function toEqualExpected(file, cb) {
		count++;

		var expected = file.path.replace('fixtures\/templates', 'expected');
		expect(file.contents.toString()).to.be(fs.readFileSync(expected, 'utf8'));
		cb(null, file);
	}

	beforeEach(function () {
		count = 0;
	});

	it('should render handlebars files', function (done) {
		vs.src(config.templates + 'none.html')
			.pipe(hb())
			.pipe(map(toEqualExpected))
			.on('error', done)
			.on('end', function () {
				expect(count).to.be(1);
				done();
			});
	});

	it('should render handlebars files with explicit context', function (done) {
		vs.src(config.templates + 'data.html')
			.pipe(hb({
				context: { foo: { title: 'Foo' }, bar: { title: 'Bar' } }
			}))
			.pipe(map(toEqualExpected))
			.on('error', done)
			.on('end', function () {
				expect(count).to.be(1);
				done();
			});
	});

	it('should render handlebars files with data', function (done) {
		vs.src(config.templates + 'data.html')
			.pipe(hb({
				data: config.data
			}))
			.pipe(map(toEqualExpected))
			.on('error', done)
			.on('end', function () {
				expect(count).to.be(1);
				done();
			});
	});

	it('should render handlebars files with helpers', function (done) {
		vs.src(config.templates + 'helpers.html')
			.pipe(hb({
				helpers: config.helpers
			}))
			.pipe(map(toEqualExpected))
			.on('error', done)
			.on('end', function () {
				expect(count).to.be(1);
				done();
			});
	});

	it('should render handlebars files with partials', function (done) {
		vs.src(config.templates + 'partials.html')
			.pipe(hb({
				partials: config.partials
			}))
			.pipe(map(toEqualExpected))
			.on('error', done)
			.on('end', function () {
				expect(count).to.be(1);
				done();
			});
	});

	it('should render handlebars files with all the things', function (done) {
		vs.src(config.templates + 'all.html')
			.pipe(hb({
				file: false,
				data: config.data,
				helpers: config.helpers,
				partials: config.partials
			}))
			.pipe(map(toEqualExpected))
			.on('error', done)
			.on('end', function () {
				expect(count).to.be(1);
				done();
			});
	});
});
