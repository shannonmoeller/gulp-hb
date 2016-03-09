import {Stream} from 'stream';
import gutil from 'gulp-util';
import path from 'path';
import test from 'ava';
import gulpHb from '../src/gulp-hb';

test.cb('should not render null', assert => {
	const stream = gulpHb();

	stream.on('data', file => {
		assert.is(file.contents, null);
		assert.end();
	});

	stream.write(new gutil.File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'fixture.js'),
		contents: null
	}));
});

test.cb('should not render a stream', assert => {
	const stream = gulpHb();

	stream.on('error', error => {
		assert.is(error.message, 'Streaming not supported.');
		assert.end();
	});

	stream.write(new gutil.File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'fixture.js'),
		contents: new Stream()
	}));
});

test.cb('should not render an invalid template', assert => {
	const stream = gulpHb();

	stream.on('error', error => {
		assert.is(error.message.slice(0, 11), 'Parse error');
		assert.end();
	});

	stream.write(new gutil.File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'fixture.js'),
		contents: new Buffer('{{>>> derp <<<}}')
	}));
});

test.cb('should render a template', assert => {
	const stream = gulpHb();

	stream.on('data', file => {
		assert.is(file.contents.toString(), 'hello');
		assert.end();
	});

	stream.write(new gutil.File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'fixture.js'),
		contents: new Buffer('hello')
	}));
});

test.cb('should render a template with file', assert => {
	const stream = gulpHb();

	stream.on('data', file => {
		assert.is(file.contents.toString(), 'hello fixture/fixture.html');
		assert.end();
	});

	stream.write(new gutil.File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'fixture.html'),
		contents: new Buffer('hello {{@file.relative}}')
	}));
});

test.cb('should use file data', assert => {
	const stream = gulpHb();

	stream.on('data', file => {
		assert.is(file.contents.toString(), 'bar');
		assert.end();
	});

	var file = new gutil.File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'fixture.js'),
		contents: new Buffer('{{foo}}')
	});

	file.data = {
		foo: 'bar'
	};

	stream.write(file);
});

test.cb('should use registered data', assert => {
	const stream = gulpHb({
		data: {
			foo: 'fooA'
		}
	});

	stream.data({
		bar: 'barA'
	});

	stream.on('data', file => {
		assert.is(file.contents.toString(), 'fooA barA');
		assert.end();
	});

	stream.write(new gutil.File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'fixture.js'),
		contents: new Buffer('{{foo}} {{bar}}')
	}));
});

test.cb('should use registered partial', assert => {
	const stream = gulpHb({
		partials: {
			foo: '<div>foo</div>'
		}
	});

	stream.partials({
		bar: '<div>bar</div>'
	});

	stream.on('data', file => {
		assert.is(file.contents.toString(), '<div>foo</div> <div>bar</div>');
		assert.end();
	});

	stream.write(new gutil.File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'fixture.js'),
		contents: new Buffer('{{> foo}} {{> bar}}')
	}));
});

test.cb('should use registered helper', assert => {
	const stream = gulpHb({
		helpers: {
			foo: function (text) {
				return 'foo' + text;
			}
		}
	});

	stream.helpers({
		bar: function (text) {
			return 'bar' + text;
		}
	});

	stream.on('data', file => {
		assert.is(file.contents.toString(), 'fooA barB');
		assert.end();
	});

	stream.write(new gutil.File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'fixture.js'),
		contents: new Buffer('{{foo "A"}} {{bar "B"}}')
	}));
});

test.cb('should use registered decorator', assert => {
	const stream = gulpHb({
		decorators: {
			foo: function (program) {
				return function (context, options) {
					context.fooA = 'fooB';
					return program(context, options);
				};
			}
		}
	});

	stream.decorators({
		bar: function (program) {
			return function (context, options) {
				context.barA = 'barB';
				return program(context, options);
			};
		}
	});

	stream.on('data', file => {
		assert.is(file.contents.toString(), 'fooB barB');
		assert.end();
	});

	stream.write(new gutil.File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'fixture.js'),
		contents: new Buffer('{{* foo}}{{* bar}}{{fooA}} {{barA}}')
	}));
});

test.cb('should display debug info', assert => {
	assert.plan(3);

	const stream = gulpHb({
		debug: true,
		partials: {
			foo: function () {}
		},
		helpers: {
			bar: function () {}
		},
		decorators: {
			baz: function () {}
		},
		data: {
			greeting: 'hello',
			recipient: 'world'
		}
	});

	stream.on('data', file => {
		assert.is(file.contents.toString(), 'howdy world');
	});

	var fileA = new gutil.File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'a.js'),
		contents: new Buffer('{{greeting}} {{recipient}}')
	});

	fileA.data = {
		greeting: 'howdy',
		a: 'lorem'
	};

	var fileB = new gutil.File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'b.js'),
		contents: new Buffer('{{greeting}} {{recipient}}')
	});

	fileB.data = {
		greeting: 'howdy',
		b: 'ipsum'
	};

	var fileC = new gutil.File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'c.js'),
		contents: new Buffer('howdy world')
	});

	stream.write(fileA);
	stream.write(fileB);
	stream.write(fileC);

	setImmediate(assert.end);
});
