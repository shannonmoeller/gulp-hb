'use strict';

var gutil = require('gulp-util');

module.exports = {
	file: function (name) {
		gutil.log(
			'Rendering \'' +
			gutil.colors.cyan(name) +
			'\' with...'
		);
	},

	keys: function (label, obj) {
		obj = obj || {};

		var keys = Object
			.keys(obj)
			.sort()
			.join(' ');

		gutil.log(
			gutil.colors.magenta(label),
			gutil.colors.grey('->'),
			gutil.colors.green.bold(keys)
		);
	}
};
