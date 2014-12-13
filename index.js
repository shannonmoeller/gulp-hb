'use strict';

var glob = require('glob'),
	glob2base = require('glob2base'),
	hb = require('handlebars'),
	map = require('map-stream'),
	mixIn = require('mout/object/mixIn'),
	path = require('path');

function req(file) {
	delete require.cache[require.resolve(file.path)];
	return require(file.path);
}

function _getFiles(list, src) {
	var matches = glob.Glob(src, {
			sync: true
		}),
		base = glob2base(matches),
		files = matches.found.map(function(file) {
			return {
				base: base,
				relative: path.relative(base, file),
				path: path.join(process.cwd(), file)
			};
		});

	return list.concat(files);
}

function getFiles(src) {
	return [].concat(src).reduce(_getFiles, []);
}

function getName(file) {
	var basename = path.basename(file.path, path.extname(file.path)),
		dirname = path.dirname(file.relative);

	return path.join(dirname, basename);
}

function registerData(data, file) {
	return mixIn(data, req(file));
}

function registerHelper(hb, file) {
	var helper = req(file),
		name = getName(file);

	if (!helper) {
		return hb;
	}

	if (typeof helper.register === 'function') {
		helper.register(hb);
		return hb;
	}

	if (typeof helper === 'function') {
		hb.registerHelper(name, helper);
		return hb;
	}

	hb.registerHelper(helper);

	return hb;
}

function registerPartial(hb, file) {
	var partial = req(file),
		name = getName(file);

	if (!partial) {
		return hb;
	}

	if (typeof partial.register === 'function') {
		partial.register(hb);
		return hb;
	}

	if (typeof partial === 'function') {
		hb.registerPartial(name, partial);
		return hb;
	}

	hb.registerPartial(partial);

	return hb;
}

module.exports = function (options) {
	options = options || {};

	var data = {},
		includeFile = options.file;

	if (includeFile === undefined) {
		includeFile = true;
	}

	if (options.data) {
		getFiles(options.data).reduce(registerData, data);
	}

	if (options.helpers) {
		getFiles(options.helpers).reduce(registerHelper, hb);
	}

	if (options.partials) {
		getFiles(options.partials).reduce(registerPartial, hb);
	}

	return map(function (file, cb) {
		var locals = Object.create(data),
			template = hb.compile(file.contents.toString());

		if (includeFile) {
			locals.file = file;
		}

		file.contents = new Buffer(template(locals));

		cb(null, file);
	});
};
