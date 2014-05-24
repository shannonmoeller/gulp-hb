# gulp-hb

A sane static Handlebars Gulp plugin. Think [Assemble](http://assemble.io/), but with a lot less [Jekyll](http://jekyllrb.com/) baggage.

[![NPM version](https://badge.fury.io/js/gulp-hb.png)](http://badge.fury.io/js/gulp-hb)
[![Build Status](https://travis-ci.org/shannonmoeller/gulp-hb.png?branch=master)](https://travis-ci.org/shannonmoeller/gulp-hb)
[![Coverage Status](https://coveralls.io/repos/shannonmoeller/gulp-hb/badge.png?branch=master)](https://coveralls.io/r/shannonmoeller/gulp-hb?branch=master)
[![Dependency Status](https://david-dm.org/shannonmoeller/gulp-hb.png?theme=shields.io)](https://david-dm.org/shannonmoeller/gulp-hb)

## Install

With [Node.js](http://nodejs.org):

    $ npm install gulp-hb

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

## Test

```
$ npm test
```

## Compatibility

Tested to work in the following environments:

- Node (0.10)

Using:

- [Travis](https://travis-ci.org/shannonmoeller/gulp-hb)

## License

MIT
