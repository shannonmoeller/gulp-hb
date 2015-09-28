# `gulp-hb`

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coveralls-img]][coveralls-url] [![Chat][gitter-img]][gitter-url] [![Tip][amazon-img]][amazon-url]

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

### `hb.handlebars`

Reference to the instance of handlebars being used.

## Options

- [`bustCache` `{Boolean}` (default: `false`)](#bustcache-boolean-default-false)
- [`cwd` `{String}`](#cwd-string)
- [`debug` `{Boolean}` (default: `false`)](#debug-boolean-default-false)
- [`data` `{String|Array.<String>|Object|Function}`](#data-string%7Carraystring%7Cobject%7Cfunction)
  - [`parseDataName` `{Function(Object):String}`](#parsedataname-functionobjectstring)
- [`dataEach` `{Function(Object,Vinyl):Object}`](#dataeach-functionobjectvinylobject)
- [`file` `{Boolean}` (default: `true`)](#file-boolean-default-true)
- [`helpers` `{String|Array.<String>|Object|Function}`](#helpers-string%7Carraystring%7Cobject%7Cfunction)
  - [`parseHelperName` `{Function(Object):String}`](#parsehelpername-functionobjectstring)
- [`partials` `{String|Array.<String>|Object|Function}`](#partials-string%7Carraystring%7Cobject%7Cfunction)
  - [`parsePartialName` `{Function(Object):String}`](#parsepartialname-functionobjectstring)

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

#### `parseDataName` `{Function(Object):String}`

By default, globbed data files are merged into a object structure according to the shortest unique file path without the extension, where path separators determine object nesting. So if you have two data files with the paths `site/meta.js` and `posts/nav.js`, the data object will be equivelent to the following:

```js
{
    site: {
        meta: require('site/meta.js')
    },
    posts: {
        nav: require('posts/nav.js')
    }
}
```

You may optionally provide your own name parser. This is helpful in cases where you may wish to exclude the directory names.

```js
parseDataName: function (file) {
    // this.handlebars <- current handlebars instance
    // file.path       <- full system path with extension
    // file.shortPath  <- shortest unique path without extension
    // file.exports    <- result of requiring the helper

    // Ignore directory names
    return path.basename(file.path);
}
```

### `dataEach` `{Function(Object,Vinyl):Object}`

A pre-render hook to modify the context object being passed to the handlebars template on a per-file basis. May be used to load additional file-specific data.

```js
dataEach: function (context, file) {
    context.foo = 'bar';
    context.meta = require(file.path.replace('.html', '.json'));
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

```handlebars
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

When including helpers using globs, modules may export a single helper function. These helpers will be named by calling `parseHelperName`.

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
module.exports.register = function (handlebars) {
    handlebars.registerHelper('link', function(text, url) {
        text = handlebars.Utils.escapeExpression(text);
        url  = handlebars.Utils.escapeExpression(url);

        var result = '<a href="' + url + '">' + text + '</a>';

        return new handlebars.SafeString(result);
    });
};
```

#### `parseHelperName` `{Function(Object):String}`

By default, standalone helpers will be named according to the shortest unique file path without the extension. So a helper with a path of `string/upper.js` will be named `string-upper`. Note that path separators are replaced with hyphens to avoid having to use [square brackets](http://handlebarsjs.com/expressions.html#basic-blocks). You may optionally provide your own name parser. This is helpful in cases where you may wish to exclude the directory names.

```js
parseHelperName: function (file) {
    // this.handlebars <- current handlebars instance
    // file.path       <- full system path with extension
    // file.shortPath  <- shortest unique path without extension
    // file.exports    <- result of requiring the helper

    // Ignore directory names
    return path.basename(file.path);
}
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

When including paritals using globs, partials may be standalone handlebars files. Each partial will be named by calling `parsePartialName`.

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
module.exports.register = function (handlebars) {
    handlebars.registerPartial({
        item: '<li>{{label}}</li>',
        link: '<a href="{{url}}">{{label}}</a>'
    });
};
```

#### `parsePartialName` `{Function(Object):String}`

By default, standalone partials will be named according to the shortest unique file path without the extension. So a partial with a path of `component/link.hbs` will be named `component/link`. You may optionally provide your own name parser. This is helpful in cases where you may wish to exclude the directory names.

```js
parsePartialName: function (file) {
    // this.handlebars <- current handlebars instance
    // file.path       <- full system path with extension
    // file.shortPath  <- shortest unique path without extension
    // file.exports    <- result of requiring the helper

    // Ignore directory names
    return path.basename(file.shortPath);
}
```

## Contribute

[![Tasks][waffle-img]][waffle-url]

Standards for this project, including tests, code coverage, and semantics are enforced with a build tool. Pull requests must include passing tests with 100% code coverage and no linting errors.

### Test

    $ npm test

----

© 2015 Shannon Moeller <me@shannonmoeller.com>

Licensed under [MIT](http://shannonmoeller.com/mit.txt)

[amazon-img]:    https://img.shields.io/badge/amazon-tip_jar-yellow.svg?style=flat-square
[amazon-url]:    https://www.amazon.com/gp/registry/wishlist/1VQM9ID04YPC5?sort=universal-price
[coveralls-img]: http://img.shields.io/coveralls/shannonmoeller/gulp-hb/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/shannonmoeller/gulp-hb
[downloads-img]: http://img.shields.io/npm/dm/gulp-hb.svg?style=flat-square
[gitter-img]:    http://img.shields.io/badge/gitter-join_chat-1dce73.svg?style=flat-square
[gitter-url]:    https://gitter.im/shannonmoeller/shannonmoeller
[npm-img]:       http://img.shields.io/npm/v/gulp-hb.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/gulp-hb
[travis-img]:    http://img.shields.io/travis/shannonmoeller/gulp-hb.svg?style=flat-square
[travis-url]:    https://travis-ci.org/shannonmoeller/gulp-hb
[waffle-img]:    http://img.shields.io/github/issues/shannonmoeller/gulp-hb.svg?style=flat-square
[waffle-url]:    http://waffle.io/shannonmoeller/gulp-hb
