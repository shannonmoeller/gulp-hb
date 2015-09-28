## 2.6.4

Bugfix:

- Moved template compilation to after the `dataEach()` call to allow the template to be modified in the `dataEach()` callback.

## 2.5.0

Features:

- Added `parseDataName`, `parseHelperName`, and `parsePartialName` options.

## 2.4.3

Features:

- Cleaned up internals to facilitate cleaner pass-through of options to core dependencies. Exposes more options without having to explicitly support them.
- Exposed handlebars instance.

## 2.4.2

Features:

- Improved error handling.

## 2.4.1

Documentation updates and test correction.

## 2.4.0

Features:

- Switched internals from using `map-stream` to `through2.obj`.
- Added `debug` option.

## 2.3.0

Features:

- Added `dataEach` option to support modifying the context on a per-file basis.

## 2.2.0

Features:

- Added support for defining data, helpers, and partials as objects or maker functions.

## 2.1.1

Bufixes:

- Updated `require-glob` to latest version to improve default handling of data property names.

## 2.0.0

Breaking changes:

- Data globbing was updated to use `require-glob`. This introduced a subtle, but significant change. The data object passed into templates will now contain keys based on the paths to data files. Previously, all data objects would be merged into a single object. See the [`require-glob`][reqglob] README for more information about the new behavior.

[reqglob]: http://github.com/shannonmoeller/require-glob
