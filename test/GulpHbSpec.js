'use strict';

var hb = require('../index'),
    map = require('map-stream'),
    fs = require('fs'),
    vs = require('vinyl-fs');

describe('hb', function () {
    var toEqualExpected = function (file, cb) {
        var expected = file.path.replace('fixtures', 'expected');
        expect(file.contents.toString()).toEqual(fs.readFileSync(expected, 'utf8'));
        cb(null, file);
    };

    it('should render handlebars files', function (done) {
        vs.src(__dirname + '/simple/fixtures/**/*.html')
            .pipe(hb())
            .pipe(map(toEqualExpected))
            .on('end', done);
    });

    it('should render handlebars files with data', function (done) {
        vs.src(__dirname + '/data/fixtures/**/*.html')
            .pipe(hb({ data: '' }))
            .pipe(map(toEqualExpected))
            .on('end', done);
    });

    it('should render handlebars files with helpers', function (done) {
        vs.src(__dirname + '/helpers/fixtures/**/*.html')
            .pipe(hb({ helpers: '' }))
            .pipe(map(toEqualExpected))
            .on('end', done);
    });

    it('should render handlebars files with partials', function (done) {
        vs.src(__dirname + '/partials/fixtures/**/*.html')
            .pipe(hb({ partials: '' }))
            .pipe(map(toEqualExpected))
            .on('end', done);
    });

    it('should render handlebars files with all the things', function (done) {
        vs.src(__dirname + '/all/fixtures/**/*.html')
            .pipe(hb({
                data: '',
                helpers: '',
                partials: ''
            }))
            .pipe(map(toEqualExpected))
            .on('end', done);
    });
});
