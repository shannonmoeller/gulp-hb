'use strict';

module.exports = function lower(str) {
	if (str == null) {
		return '';
	}

	return String(str).toLowerCase();
};
