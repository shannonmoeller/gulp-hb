'use strict';

var hb,
	expect = require('expect'),
	fs = require('fs'),
	vinylFs = require('vinyl-fs'),

	config = {
		data: __dirname + '/fixtures/data/**/*.{js,json}',
		helpers: __dirname + '/fixtures/helpers/**/*.js',
		partials: __dirname + '/fixtures/partials/**/*.hbs',
		fixtures: __dirname + '/fixtures/templates/',
		expected: __dirname + '/expected/templates/'
	};

describe('gulp-hb e2e', function () {
	function testWithFile(filename, plugin, done) {
		var fixture = config.fixtures + filename,
			expected = config.expected + filename;

		function expectFile(file) {
			expect(String(file.contents)).toBe(String(fs.readFileSync(expected)));
			done();
		}

		vinylFs
			.src(fixture)
			.pipe(plugin)
			.on('data', expectFile)
			.on('error', done);
	}

	beforeEach(function () {
		// Delete
		delete require.cache[require.resolve('handlebars')];
		delete require.cache[require.resolve('../index')];

		// Reload
		require('handlebars');
		hb = require('../index');
	});

	it('should render handlebars files with no options', function (done) {
		testWithFile('none.html', hb(), done);
	});

	it('should render handlebars files with empty options', function (done) {
		testWithFile('none.html', hb({}), done);
	});

	it('should render handlebars files with data', function (done) {
		testWithFile('data.html', hb({ data: config.data }), done);
	});

	it('should render handlebars files with helpers', function (done) {
		testWithFile('helpers.html', hb({ helpers: config.helpers }), done);
	});

	it('should render handlebars files with partials', function (done) {
		testWithFile('partials.html', hb({ partials: config.partials }), done);
	});

	it('should render handlebars files with all the things', function (done) {
		var options = {
			file: false,
			data: config.data,
			helpers: config.helpers,
			partials: config.partials
		};

		testWithFile('all.html', hb(options), done);
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

		testWithFile('objects.html', hb(options), done);
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

		testWithFile('objects.html', hb(options), done);
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

		testWithFile('dataEach.html', hb(options), done);
	});
});
