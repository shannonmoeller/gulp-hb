'use strict';

var hb = require('handlebars'),
	logger = require('./util/logger'),
	registrar = require('handlebars-registrar'),
	requireGlob = require('require-glob'),
	through = require('through2');

/**
 * A sane static Handlebars Gulp plugin.
 *
 * @type {Function}
 * @param {Object} options Plugin options.
 * @param {String} options.cwd Current working directory. Defaults to `process.cwd()`.
 * @param {Object|String|Array.<String>|Function} options.data One or more glob strings matching data files.
 * @param {Function(Object,Vinyl):Object} options.dataEach Pre-render hook to modify the context on a per-file basis.
 * @param {Boolean} options.debug Whether to log data, helpers, and partials.
 * @param {Object|String|Array.<String>|Function} options.helpers One or more glob strings matching helpers.
 * @param {Object|String|Array.<String>|Function} options.partials One or more glob strings matching partials.
 * @param {Boolean} options.file Whether to include the file object in the data passed to the template.
 * @return {Stream}
 */
module.exports = function (options) {
	options = options || {};

	var data,
		cwd = options.cwd || process.cwd(),
		includeFile = options.file;

	// Pass file data to handlebars by default
	if (includeFile == null) {
		includeFile = true;
	}

	// Find and merge all data
	if (options.data) {
		data = requireGlob.sync(options.data, {
			cwd: cwd
		});
	}

	// Find and register all helpers and partials
	registrar(hb, {
		cwd: cwd,
		helpers: options.helpers,
		partials: options.partials
	});

	// Stream it. Stream it good.
	return through.obj(function (file, enc, cb) {
		var context = Object.create(data || {}),
			template = hb.compile(file.contents.toString());

		if (includeFile) {
			context.file = file;
		}

		if (typeof options.dataEach === 'function') {
			context = options.dataEach(context, file);
		}

		if (options.debug) {
			logger.file(file.path.replace(file.base, ''));
			logger.keys('     data', data);
			logger.keys('  context', context);
			logger.keys('  helpers', hb.helpers);
			logger.keys(' partials', hb.partials);
		}

		file.contents = new Buffer(template(context));

		cb(null, file);
	});
};
