var gutil = require('gulp-util'),
	handlebars = require('handlebars'),
	logger = require('./util/logger'),
	mixin = require('./util/mixin'),
	registrar = require('handlebars-registrar'),
	requireGlob = require('require-glob'),
	through = require('through2');

/**
 * A sane static Handlebars Gulp plugin.
 *
 * @type {Function}
 * @param {Object=} options Plugin options.
 * @param {Boolean=} options.bustCache Whether to force the reload of modules by deleting them from the cache.
 * @param {String=} options.cwd Current working directory. Defaults to `process.cwd()`.
 * @param {Object|String|Array.<String>|Function=} options.data One or more glob strings matching data files.
 * @param {Function(Object,Vinyl):Object=} options.dataEach Pre-render hook to modify the context on a per-file basis.
 * @param {Boolean=} options.debug Whether to log data, helpers, and partials.
 * @param {Function=} options.parseDataName Custom name generator for data keys.
 * @param {Function=} options.dataReducer Custom reducer for building the data object.
 * @param {Object|String|Array.<String>|Function=} options.helpers One or more glob strings matching helpers.
 * @param {Function=} options.parseHelperName Custom name generator for helpers.
 * @param {Function=} options.helpersReducer Custom reducer for registering helpers.
 * @param {Object|String|Array.<String>|Function=} options.partials One or more glob strings matching partials.
 * @param {Function=} options.parsePartialName Custom name generator for partials.
 * @param {Function=} options.partialsReducer Custom reducer for registering partials.
 * @param {Boolean=} options.file Whether to include the file object in the data passed to the template.
 * @return {Stream}
 */
function hb(options) {
	options = options || {};

	var data = options.data,
		dataEach = options.dataEach,
		debug = options.debug,
		includeFile = options.file;

	// Default to `true`
	if (includeFile == null) {
		includeFile = true;
	}

	// Generate data
	if (data) {
		options.keygen = options.parseDataName;
		options.reducer = options.dataReducer;
		data = requireGlob.sync(data, options);
	}

	// Register helpers and partials
	registrar(hb.handlebars, options);

	// Stream it
	return through.obj(function (file, enc, cb) {
		var context, template,
			hbs = hb.handlebars;

		try {
			context = mixin({}, data);

			if (includeFile) {
				context.file = file;
			}

			if (typeof dataEach === 'function') {
				context = dataEach(context, file);
			}

			if (debug) {
				logger.file(file.path.replace(file.base, ''));
				logger.keys('     data', data);
				logger.keys('  context', context);
				logger.keys('  helpers', hbs.helpers);
				logger.keys(' partials', hbs.partials);
			}

			template = hbs.compile(String(file.contents));
			file.contents = new Buffer(template(context));

			this.push(file);
			cb();
		}
		catch (err) {
			cb(new gutil.PluginError('gulp-hb', err, {
				stack: err.stack,
				showStack: true
			}));
		}
	});
}

/**
 * Expose handlebars.
 *
 * @property handlebars
 * @type {Object}
 * @static
 */
hb.handlebars = handlebars;

module.exports = hb;
