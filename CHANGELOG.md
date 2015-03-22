## 2.0.0

Breaking changes:

- Data globbing was updated to use `require-glob`. This introduced a subtle, but significant change. The data object passed into templates will now contain keys based on the paths to data files. Previously, all data objects would be merged into a single object. See the [`require-glob`][reqglob] README for more information about the new behavior.

[reqglob]: http://github.com/shannonmoeller/require-glob
