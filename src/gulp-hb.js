'use strict';

var assign = require('object-assign');
var columns = require('cli-columns');
var gutil = require('gulp-util');
var handlebars = require('handlebars');
var handlebarsWax = require('handlebars-wax');
var through = require('through2');

function logKeys(file, pairs) {
	var buf = [];
	var options = {
		width: process.stdout.columns - 12
	};

	pairs.forEach(function (pair) {
		var key = pair[0];
		var value = pair[1] || '';

		if (typeof value !== 'string') {
			value = columns(Object.keys(value), options);
		}

		buf.push(gutil.colors.grey('    ' + key + ':'));
		buf.push(value.replace(/^/gm, '      '));
	});

	console.log('  ' + gutil.colors.green(file.relative));
	console.log(buf.join('\n'));
	console.log();
}

function gulpHb(options) {
	var defaults = {
		cwd: process.cwd(),
		bustCache: true,
		debug: false,
		file: false
	};

	options = assign(defaults, options);

	// Handlebars

	var debug = Number(options.debug) || 0;
	var hb = gulpHb.handlebars.create();
	var wax = handlebarsWax(hb, options);

	// set { debug: 2 } to propagate flag to node-glob
	options.debug = debug < 2;

	if (options.partials) {
		wax.partials(options.partials);
	}

	if (options.helpers) {
		wax.helpers(options.helpers);
	}

	if (options.decorators) {
		wax.decorators(options.decorators);
	}

	if (options.data) {
		wax.data(options.data);
	}

	// Stream

	var stream = through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-hb', 'Streaming not supported.'));
			return;
		}

		try {
			var data = assign({}, file.data);
			var template = wax.compile(file.contents.toString());

			if (options.file) {
				data.file = file;
			}

			if (debug) {
				logKeys(file, [
					['context', wax.context],
					['data', file.data],
					['decorators', hb.decorators],
					['helpers', hb.helpers],
					['partials', hb.partials]
				]);
			}

			file.contents = new Buffer(template(data));

			this.push(file);
		} catch (error) {
			this.emit('error', new gutil.PluginError('gulp-hb', error, {
				file: file,
				fileName: file.path,
				showStack: true
			}));
		}

		cb();
	});

	// Proxy

	stream.partials = function () {
		wax.partials.apply(wax, arguments);
		return stream;
	};

	stream.helpers = function () {
		wax.helpers.apply(wax, arguments);
		return stream;
	};

	stream.decorators = function () {
		wax.decorators.apply(wax, arguments);
		return stream;
	};

	stream.data = function () {
		wax.data.apply(wax, arguments);
		return stream;
	};

	return stream;
}

module.exports = gulpHb;
module.exports.handlebars = handlebars;
