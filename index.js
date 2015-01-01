'use strict';

var globs = require('globs'),
	hb = require('handlebars'),
	map = require('map-stream'),
	mixin = require('mtil/object/mixin'),
	registrar = require('handlebars-registrar');

function appendData(data, file) {
	// Clear cached module, if any
	delete require.cache[require.resolve(file)];

	// Add object properties to data object
	return mixin(data, require(file));
}

/**
 * A sane static Handlebars Gulp plugin.
 *
 * @type {Function}
 * @param {Object} options Plugin options.
 * @param {String|Array.<String>} options.data One or more glob strings matching data files.
 * @param {String|Array.<String>} options.helpers One or more glob strings matching helpers.
 * @param {String|Array.<String>} options.partials One or more glob strings matching partials.
 * @param {Boolean} options.file Whether to include the file object in the data passed to the template.
 * @return {Stream}
 */
module.exports = function (options) {
	options = options || {};

	var data = {},
		includeFile = options.file;

	// Default to true
	if (includeFile == null) {
		includeFile = true;
	}

	// Find and merge all of the data
	if (options.data) {
		globs.sync(options.data).reduce(appendData, data);
	}

	// Find and register all of the helpers and partials
	registrar(hb, {
		helpers: options.helpers,
		partials: options.partials
	});

	// Stream it. Stream it good
	return map(function (file, cb) {
		var context = Object.create(data),
			template = hb.compile(file.contents.toString());

		if (includeFile) {
			context.file = file;
		}

		file.contents = new Buffer(template(context));

		cb(null, file);
	});
};
