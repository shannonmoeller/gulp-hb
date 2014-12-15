# `gulp-hb`

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coveralls-img]][coveralls-url]

A sane static Handlebars Gulp plugin. Think [Assemble](http://assemble.io/), but with a lot less [Jekyll](http://jekyllrb.com/) baggage.

## Install

    $ npm install --save-dev gulp-hb

## API

### `hb([options])`

Returns a Gulp-compatible transform stream that compiles handlebars templates to static output.

## Options

### `data` _`String|Array.<String>`_

Glob string or array of glob strings matching data files. You can't use object literals here. Because, don't.

### `file` _`Boolean`_ (default: true)

Whether to include the file object in the data passed to the template. Particularly useful when paired with [`gulp-front-matter`](https://github.com/lmtm/gulp-front-matter) for example.

```js
var gulp = require('gulp'),
    frontMatter = require('gulp-front-matter'),
    hb = require('gulp-hb');

gulp.task('default', function () {
    gulp.src('src/{,posts/}**/*.html')
        .pipe(frontMatter())
        .pipe(hb())
        .pipe(gulp.dest('./web/'));
});
```

```html
---
title: Hello World
---
<h1>{{file.frontMatter.title}}</h1>
```

### `helpers` _`String|Array.<String>`_

Glob string or array of glob strings matching helper files. Helper files are JavaScript files that define one or more helpers.

As a single helper function (helper will be named according to the filename):

```js
// lower.js
module.exports = function (text) {
    return String(text).toLowerCase();
};
```

As an object of helper functions:

```js
// helpers.js
module.exports = {
    lower: function (text) {
        return String(text).toLowerCase();
    },

    upper: function (text) {
        return String(text).toUpperCase();
    }
};
```

As an Assemble registrar:

```js
// assemble.js
module.exports.register = function (Handlebars) {
    Handlebars.registerHelper('lower', function (text) {
        return String(text).toLowerCase();
    });
};
```

### `partials` _`String|Array.<String>`_

Glob string or array of glob strings matching partial files. Partial files are either standalone Handlebars files, or JavaScript files that define one or more helpers.

As a standalone Handlebars file:

```handlebars
{{! link.hbs }}
<a href="{{url}}">{{text}}</a>
```

As a precompiled partials JavaScript file:

```js
// partials.js
var Handlebars = ...
templates['link'] = template({...
```

As an object of partials:

```js
// partials.js
module.exports = {
    link: '<a href="{{url}}">{{text}}</a>',
    people: '<ul>{{#people}}<li>{{> link}}</li>{{/people}}</ul>'
};
```

As an Assemble registrar:

```js
// assemble.js
module.exports.register = function (Handlebars) {
    Handlebars.registerPartial('link', '<a href="{{url}}">{{text}}</a>');
    Handlebars.registerPartial('people', '<ul>{{#people}}<li>{{> link}}</li>{{/people}}</ul>');
};
```

## Example

```js
var gulp = require('gulp');
var hb = require('gulp-hb');

gulp.task('default', function () {
    return gulp
        .src('./src/{,posts/}*.html')
        .pipe(hb({
            data: './src/assets/data/**/*.{js,json}',
            helpers: [
                './node_modules/handlebars-layouts',
                './node_modules/handlebars-helpers/lib/helpers/helpers-{dates,math}.js'
                './src/assets/helpers/*.js'
            ],
            partials: [
                './src/assets/partials/**/*.hbs'
            ]
        }))
        .pipe(gulp.dest('./web/'));
});
```

## Contribute

[![Tasks][waffle-img]][waffle-url] [![Chat][gitter-img]][gitter-url] [![Tip][gittip-img]][gittip-url]

Standards for this project, including tests, code coverage, and semantics are enforced with a build tool. Pull requests must include passing tests with 100% code coverage and no linting errors.

### Test

    $ gulp test

----

© 2014 Shannon Moeller <me@shannonmoeller.com>

Licensed under [MIT](http://shannonmoeller.com/mit.txt)

[coveralls-img]: http://img.shields.io/coveralls/shannonmoeller/gulp-hb/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/shannonmoeller/gulp-hb
[downloads-img]: http://img.shields.io/npm/dm/gulp-hb.svg?style=flat-square
[gitter-img]:    http://img.shields.io/badge/chat-shannonmoeller/gulp-hb-blue.svg?style=flat-square
[gitter-url]:    https://gitter.im/shannonmoeller/gulp-hb
[gittip-img]:    http://img.shields.io/gittip/shannonmoeller.svg?style=flat-square
[gittip-url]:    https://www.gittip.com/shannonmoeller
[npm-img]:       http://img.shields.io/npm/v/gulp-hb.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/gulp-hb
[travis-img]:    http://img.shields.io/travis/shannonmoeller/gulp-hb.svg?style=flat-square
[travis-url]:    https://travis-ci.org/shannonmoeller/gulp-hb
[waffle-img]:    http://img.shields.io/github/issues/shannonmoeller/gulp-hb.svg?style=flat-square
[waffle-url]:    http://waffle.io/shannonmoeller/gulp-hb
