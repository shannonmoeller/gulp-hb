'use strict';

var glob = require('glob'),
    hb = require('handlebars'),
    map = require('map-stream'),
    mixIn = require('mout/object/mixIn'),
    path = require('path');

function req(file) {
    return require(path.join(process.cwd(), file));
}

function _getFiles(list, src) {
    return list.concat(glob.sync(src));
}

function getFiles(src) {
    return [].concat(src).reduce(_getFiles, []);
}

function getName(file) {
    return path.basename(file).replace(path.extname(file), '');
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
    var data = {};

    options = options || {};
    getFiles(options.data).reduce(registerData, data);
    getFiles(options.helpers).reduce(registerHelper, hb);
    getFiles(options.partials).reduce(registerPartial, hb);

    return map(function (file, cb) {
        var template = hb.compile(file.contents.toString());
        file.contents = new Buffer(template(data));
        cb(null, file);
    });
};
