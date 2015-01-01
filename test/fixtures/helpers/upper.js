'use strict';

module.exports = function upper(str) {
	if (str == null) {
		return '';
	}

	return String(str).toUpperCase();
};
