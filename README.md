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
            helpers: './src/assets/helpers/*.js',
            partials: './src/assets/partials/**/*.hbs'
        }))
        .pipe(gulp.dest('./web/'));
});
```

## API

### `hb([options])`

Returns a Gulp-compatible transform stream that compiles handlebars templates to static output.

## Options

### `bustCache` `{Boolean}` (default: `false`)

Whether to force a reload of data, helpers, and partials by deleting them from the cache. Useful inside watch tasks.

### `cwd` `{String}`

Current working directory. Defaults to `process.cwd()`.

### `data` `{String|Array.<String>|Object|Function}`

A glob string matching data files, an array of glob strings, an object literal, or a function returning any of these. Globbed data files are merged into an object structure which mirrors the directory structure and file names.

```js
data: './src/assets/data/**/*.{js,json}'
```

```js
data: [
    './package.json',
    './src/assets/data/**/*.{js,json}'
]
```

```js
data: {
    pkg: require('./package.json'),
    foo: 'bar'
}
```

### `dataEach` `{Function(Object,Vinyl):Object}`

A pre-render hook to modify the context object being passed to the handlebars template on a per-file basis.

```js
dataEach: function (context, file) {
    context.foo = bar;
    return context;
}
```

### `debug` `{Boolean}` (default: `false`)

Whether to log the helper names, partial names, and root property names for each file as they are rendered.

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

### `helpers` `{String|Array.<String>|Object|Function}`

A glob string matching helper files, an array of glob strings, an [object of helpers](http://handlebarsjs.com/reference.html#base-registerHelper), or a function returning any of these. Globbed helper files are JavaScript files that define one or more helpers.

```js
helpers: './src/assets/helpers/**/*.js'
```

```js
helpers: [
    './node_modules/handlebars-layouts/index.js',
    './src/assets/helpers/**/*.js'
]
```

```js
helpers: {
    lower: function (text) {
        return String(text).toLowerCase();
    },

    upper: function (text) {
        return String(text).toUpperCase();
    }
}
```

When including helpers using globs, modules may export a single helper function. Each helper will be named according to the file path and name without the extension. So a helper with a path of `string/upper.js` will be named `string-upper`. Note that path separators are replaced with hyphens to avoid having to use [square brackets](http://handlebarsjs.com/expressions.html#basic-blocks).

```js
// lower.js
module.exports = function (text) {
    return String(text).toLowerCase();
};
```

Helpers may also export an object of named functions.

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

If you need a reference to the handlebars instance inside of a helper, you may expose a factory `register` method.

```js
// helpers.js
module.exports.regsiter = function (handlebars) {
    handlebars.registerHelper('link', function(text, url) {
        text = handlebars.Utils.escapeExpression(text);
        url  = handlebars.Utils.escapeExpression(url);
        
        var result = '<a href="' + url + '">' + text + '</a>';
        
        return new handlebars.SafeString(result);
    });
};
```

### `partials` `{String|Array.<String>|Object|Function}`

A glob string matching partial files, an array of glob strings, an [object of partials](http://handlebarsjs.com/reference.html#base-registerPartial), or a function returning any of these. Globbed partial files are either standalone Handlebars files, or JavaScript files that define one or more helpers.

```js
partials: './src/assets/partials/**/*.{hbs,js}'
```

```js
partials: [
    './src/assets/vendor/some-theme/partials/**/*.hbs',
    './src/assets/partials/**/*.hbs'
]
```

```js
partials: {
    link: '<a href="{{url}}">{{text}}</a>',
    people: '<ul>{{#people}}<li>{{> link}}</li>{{/people}}</ul>'
}
```

When including paritals using globs, partials may be standalone handlebars files. Each partial will be named according to the file path and name without the extension. So a partial with a path of `component/link.hbs` will be named `component/link`.

```handlebars
{{!-- link.hbs --}}
<a href="{{url}}">{{text}}</a>
```

Partials may also be modules that export an object of named partials.

```js
// partials.js
module.exports = {
    link: '<a href="{{url}}">{{text}}</a>',
    people: '<ul>{{#people}}<li>{{> link}}</li>{{/people}}</ul>'
};
```

If you need a reference to the handlebars instance when defining a partial, you may expose a factory `register` method.

```js
// partials.js
module.exports.regsiter = function (handlebars) {
    handlebars.registerPartial({
        item: '<li>{{label}}</li>',
        link: '<a href="{{url}}">{{label}}</a>'
    });
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
