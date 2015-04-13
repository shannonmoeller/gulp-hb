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

	it('should render handlebars files with object options', function (done) {
		vs.src(config.templates + 'objects.html')
			.pipe(hb({
				file: false,
				data: {
					foo: require('./fixtures/data/foo'),
					bar: require('./fixtures/data/bar.json'),
					users: require('./fixtures/data/users.json')
				},
				helpers: {
					lower: require('./fixtures/helpers/lower'),
					upper: require('./fixtures/helpers/upper'),
					'flow-when': require('./fixtures/helpers/flow/when')
				},
				partials: {
					'components/item': require('./fixtures/partials/components/item.hbs')
				}
			}))
			.pipe(map(toEqualExpected))
			.on('error', done)
			.on('end', function () {
				expect(count).to.be(1);
				done();
			});
	});

	it('should render handlebars files with function options', function (done) {
		vs.src(config.templates + 'functions.html')
			.pipe(hb({
				file: false,
				data: function () {
					return config.data;
				},
				helpers: function () {
					return {
						lower: require('./fixtures/helpers/lower'),
						upper: require('./fixtures/helpers/upper'),
						'flow-when': require('./fixtures/helpers/flow/when')
					};
				},
				partials: function () {
					return config.partials;
				}
			}))
			.pipe(map(toEqualExpected))
			.on('error', done)
			.on('end', function () {
				expect(count).to.be(1);
				done();
			});
	});

	it('should allow context to be modified on a per-file basis', function (done) {
		vs.src(config.templates + 'dataEach.html')
			.pipe(hb({
				data: config.data,
				helpers: config.helpers,
				partials: config.partials,
				dataEach: function (context, file) {
					count++;

					expect(context.file).to.be(file);
					expect(context.foo.title).to.be('Foo');

					context.bar = {
						title: 'Qux'
					};

					return context;
				}
			}))
			.pipe(map(toEqualExpected))
			.on('error', done)
			.on('end', function () {
				expect(count).to.be(2);
				done();
			});
	});
});
