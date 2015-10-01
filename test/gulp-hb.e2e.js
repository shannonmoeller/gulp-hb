/* eslint-env mocha */

var hb = require('../index'),
	handlebars = require('handlebars'),
	expect = require('expect'),
	fs = require('fs'),
	path = require('path'),
	vinylFs = require('vinyl-fs'),

	config = {
		data: path.join(__dirname, '/fixtures/data/**/*.{js,json}'),
		helpers: path.join(__dirname, '/fixtures/helpers/**/*.js'),
		partials: path.join(__dirname, '/fixtures/partials/**/*.hbs'),
		fixtures: path.join(__dirname, '/fixtures/templates/'),
		expected: path.join(__dirname, '/expected/templates/')
	};

describe('gulp-hb e2e', function () {
	function testWithFile(filename, options, done) {
		var fixture = config.fixtures + filename,
			expected = config.expected + filename;

		function expectFile(file) {
			expect(String(file.contents)).toBe(String(fs.readFileSync(expected)));
			done();
		}

		function expectError(err) {
			expect(err.plugin).toBe('gulp-hb');
			expect(err.message).toContain('derp');
			done();
		}

		vinylFs
			.src(fixture)
			.pipe(hb(options))
			.on('data', expectFile)
			.on('error', expectError);
	}

	beforeEach(function () {
		// Reset Handlebars instance.
		hb.handlebars = handlebars.create();
	});

	it('should render handlebars files with no options', function (done) {
		testWithFile('none.html', null, done);
	});

	it('should render handlebars files with empty options', function (done) {
		testWithFile('none.html', {}, done);
	});

	it('should render handlebars files with data', function (done) {
		testWithFile('data.html', { data: config.data }, done);
	});

	it('should render handlebars files with helpers', function (done) {
		testWithFile('helpers.html', { helpers: config.helpers }, done);
	});

	it('should render handlebars files with partials', function (done) {
		testWithFile('partials.html', { partials: config.partials }, done);
	});

	it('should render handlebars files with all the things', function (done) {
		var options = {
			file: false,
			data: config.data,
			helpers: config.helpers,
			partials: config.partials
		};

		testWithFile('all.html', options, done);
	});

	it('should render handlebars files with object options', function (done) {
		var options = {
			file: false,
			data: {
				foo: { title: 'Foo' },
				bar: { title: 'Bar' },
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
		};

		testWithFile('objects.html', options, done);
	});

	it('should render handlebars files with function options', function (done) {
		var options = {
			file: false,
			data: function () {
				return {
					foo: { title: 'Foo' },
					bar: { title: 'Bar' },
					users: require('./fixtures/data/users.json')
				};
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
		};

		testWithFile('functions.html', options, done);
	});

	it('should allow context to be modified on a per-file basis', function (done) {
		var options = {
			debug: true,
			data: config.data,
			helpers: config.helpers,
			partials: config.partials,
			dataEach: function (context, file) {
				expect(context.file).toBe(file);
				expect(context.foo.title).toBe('Foo');

				context.bar = { title: 'Qux' };
				return context;
			}
		};

		testWithFile('dataEach.html', options, done);
	});

	it('should handle errors', function (done) {
		testWithFile('error.html', hb(), done);
	});
});
