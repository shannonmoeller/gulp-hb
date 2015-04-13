# `gulp-hb`

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coveralls-img]][coveralls-url] [![Chat][gitter-img]][gitter-url]

A sane static Handlebars Gulp plugin. Think [Assemble](http://assemble.io/), but with a lot less [Jekyll](http://jekyllrb.com/) baggage.

For Grunt, see [grunt-hb](https://github.com/shannonmoeller/grunt-hb). To precompile templates into JavaScript, see [gulp-handlebars](https://github.com/lazd/gulp-handlebars).

## Install

    $ npm install --save-dev gulp-hb

## Example

```js
var gulp = require('gulp'),
    hb = require('gulp-hb');

gulp.task('default', function () {
    return gulp
        .src('./src/{,posts/}*.html')
        .pipe(hb({
            data: './src/assets/data/**/*.{js,json}',
            helpers: [
                './node_modules/handlebars-layouts/index.js',
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

## API

### `hb([options])`

Returns a Gulp-compatible transform stream that compiles handlebars templates to static output.

## Options

### `cwd` `{String}`

Current working directory. Defaults to `process.cwd()`.

### `data` `{Object|String|Array.<String>|Function}`

An object literal, a glob string matching data files, an array of glob strings, or a function returning any of these. Globbed data files are merged into an object structure which mirrors the directory structure and file names.

### `file` `{Boolean}` (default: `true`)

Whether to include the file object in the data passed to the template. Particularly useful when paired with [`gulp-front-matter`](https://github.com/lmtm/gulp-front-matter) or [`gulp-data`](https://github.com/colynb/gulp-data) for example.

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

### `helpers` `{Object|String|Array.<String>|Function}`

An [object of helpers](http://handlebarsjs.com/reference.html#base-registerHelper), a glob string matching helper files, an array of glob strings, or a function returning any of these. Globbed helper files are JavaScript files that define one or more helpers.

As a single helper function (helper will be named according to the filename):

```js
// lower.js
module.exports = function (text) {
    return String(text).toLowerCase();
};
```

When registering an unnamed helper, the helper will be named according to the file path and name without the extension. So a helper with a path of `string/upper.js` will be named `string-upper`. Note that path separators are replaced with hyphens to avoid having to use [square brackets](http://handlebarsjs.com/expressions.html#basic-blocks).

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

### `partials` `{Object|String|Array.<String>|Function}`

An [object of partials](http://handlebarsjs.com/reference.html#base-registerPartial), a glob string matching partial files, an array of glob strings, or a function returning any of these. Globbed partial files are either standalone Handlebars files, or JavaScript files that define one or more helpers.

As a standalone Handlebars file:

```handlebars
{{!-- link.hbs --}}
<a href="{{url}}">{{text}}</a>
```

When registering an unnamed partial, the partial will be named according to the file path and name without the extension. So a partial with a path of `component/link.hbs` will be named `component/link`.

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

## Contribute

[![Tasks][waffle-img]][waffle-url] [![Tip][gittip-img]][gittip-url]

Standards for this project, including tests, code coverage, and semantics are enforced with a build tool. Pull requests must include passing tests with 100% code coverage and no linting errors.

### Test

    $ npm test

----

© 2015 Shannon Moeller <me@shannonmoeller.com>

Licensed under [MIT](http://shannonmoeller.com/mit.txt)

[coveralls-img]: http://img.shields.io/coveralls/shannonmoeller/gulp-hb/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/shannonmoeller/gulp-hb
[downloads-img]: http://img.shields.io/npm/dm/gulp-hb.svg?style=flat-square
[gitter-img]:    http://img.shields.io/badge/gitter-join_chat-1dce73.svg?style=flat-square
[gitter-url]:    https://gitter.im/shannonmoeller/gulp-hb
[gittip-img]:    http://img.shields.io/gittip/shannonmoeller.svg?style=flat-square
[gittip-url]:    https://www.gittip.com/shannonmoeller
[npm-img]:       http://img.shields.io/npm/v/gulp-hb.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/gulp-hb
[travis-img]:    http://img.shields.io/travis/shannonmoeller/gulp-hb.svg?style=flat-square
[travis-url]:    https://travis-ci.org/shannonmoeller/gulp-hb
[waffle-img]:    http://img.shields.io/github/issues/shannonmoeller/gulp-hb.svg?style=flat-square
[waffle-url]:    http://waffle.io/shannonmoeller/gulp-hb
