'use strict';

module.exports = function mixin(target) {
    var arg, key,
        len = arguments.length,
        i = 1;

    for (; i < len; i++) {
        arg = arguments[i];

        if (!arg) {
            continue;
        }

        for (key in arg) {
            // istanbul ignore else
            if (arg.hasOwnProperty(key)) {
                target[key] = arg[key];
            }
        }
    }

    return target;
}
