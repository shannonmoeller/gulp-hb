import path from 'path';
import {Stream} from 'stream';
import gutil from 'gulp-util';
import test from 'ava';
import gulpHb from '../src/gulp-hb';

test.cb('should not render null', t => {
	const stream = gulpHb();

	stream.on('data', file => {
		t.is(file.contents, null);
		t.end();
	});

	stream.write(new gutil.File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'fixture.js'),
		contents: null
	}));
});

test.cb('should not render a stream', t => {
	const stream = gulpHb();

	stream.on('error', error => {
		t.is(error.message, 'Streaming not supported.');
		t.end();
	});

	stream.write(new gutil.File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'fixture.js'),
		contents: new Stream()
	}));
});

test.cb('should not render an invalid template', t => {
	const stream = gulpHb();

	stream.on('error', error => {
		t.is(error.message.slice(0, 11), 'Parse error');
		t.end();
	});

	stream.write(new gutil.File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'fixture.js'),
		contents: new Buffer('{{>>> derp <<<}}')
	}));
});

test.cb('should render a template', t => {
	const stream = gulpHb();

	stream.on('data', file => {
		t.is(file.contents.toString(), 'hello');
		t.end();
	});

	stream.write(new gutil.File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'fixture.js'),
		contents: new Buffer('hello')
	}));
});

test.cb('should render a template with file', t => {
	const stream = gulpHb();

	stream.on('data', file => {
		t.is(file.contents.toString(), 'hello fixture/fixture.html');
		t.end();
	});

	stream.write(new gutil.File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'fixture.html'),
		contents: new Buffer('hello {{@file.relative}}')
	}));
});

test.cb('should use file data', t => {
	const stream = gulpHb();

	stream.on('data', file => {
		t.is(file.contents.toString(), 'bar');
		t.end();
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

test.cb('should use registered data', t => {
	const stream = gulpHb({
		data: {
			foo: 'fooA'
		}
	});

	stream.data({
		bar: 'barA'
	});

	stream.on('data', file => {
		t.is(file.contents.toString(), 'fooA barA');
		t.end();
	});

	stream.write(new gutil.File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'fixture.js'),
		contents: new Buffer('{{foo}} {{bar}}')
	}));
});

test.cb('should use registered partial', t => {
	const stream = gulpHb({
		partials: {
			foo: '<div>foo</div>'
		}
	});

	stream.partials({
		bar: '<div>bar</div>'
	});

	stream.on('data', file => {
		t.is(file.contents.toString(), '<div>foo</div> <div>bar</div>');
		t.end();
	});

	stream.write(new gutil.File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'fixture.js'),
		contents: new Buffer('{{> foo}} {{> bar}}')
	}));
});

test.cb('should use registered helper', t => {
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
		t.is(file.contents.toString(), 'fooA barB');
		t.end();
	});

	stream.write(new gutil.File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'fixture.js'),
		contents: new Buffer('{{foo "A"}} {{bar "B"}}')
	}));
});

test.cb('should use registered decorator', t => {
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
		t.is(file.contents.toString(), 'fooB barB');
		t.end();
	});

	stream.write(new gutil.File({
		base: __dirname,
		path: path.join(__dirname, 'fixture', 'fixture.js'),
		contents: new Buffer('{{* foo}}{{* bar}}{{fooA}} {{barA}}')
	}));
});

test.cb('should display debug info', t => {
	t.plan(3);

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
		t.is(file.contents.toString(), 'howdy world');
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

	setImmediate(t.end);
});
