## [0.4.0](https://github.com/danielroe/sanity-typed-queries/compare/0.3.1...0.4.0) (2020-04-03)


### ⚠ BREAKING CHANGES

* No longer compatible with IE11
* `createSchema` is now `defineDocument` with an additional helper (`defineFields`) for defining fields within a document

### Features

* add support for object types with subfields ([f6e968e](https://github.com/danielroe/sanity-typed-queries/commit/f6e968e35dae1eaf1a6dd363c7d4b75af2988165))
* feat: allow custom mappings (`"prop": my.prop`) ([048ab1e](https://github.com/danielroe/sanity-typed-queries/commit/048ab1e545d0b95fb3851860318128ea93659b2d))


### Bug Fixes

* don't modify query builder instance ([5e71d4e](https://github.com/danielroe/sanity-typed-queries/commit/5e71d4e85fefb97cd4ec3e03e0b57528271746e7))
* more precisely define custom sanity types ([6e6b423](https://github.com/danielroe/sanity-typed-queries/commit/6e6b423636671e0ba1bba96a59878e44b4633e2a))
* remove references to dummy custom fields ([d925ff1](https://github.com/danielroe/sanity-typed-queries/commit/d925ff13cbb0462f246ff0128fe2253a808fc09d))
* type blocks as BlockType[] not BlockType[][] ([51bfe9a](https://github.com/danielroe/sanity-typed-queries/commit/51bfe9a7afb122226340a2c7cbfbd05b44f58e6f))

### [0.3.1](https://github.com/danielroe/sanity-typed-queries/compare/0.3.0...0.3.1) (2020-04-01)


### Bug Fixes

* target commonjs ([5aba4da](https://github.com/danielroe/sanity-typed-queries/commit/5aba4da302c46433ab4b788cab255f2b547b743c))

## [0.3.0](https://github.com/danielroe/sanity-typed-queries/compare/0.2.0...0.3.0) (2020-04-01)


### Features

* infer correct types of arrays ([fd75b5c](https://github.com/danielroe/sanity-typed-queries/commit/fd75b5c0b109af69d4ffb94dcb799c03c6a99757))

## 0.2.0 (2020-03-31)


### ⚠ BREAKING CHANGES

* The return type of `.use()` has changed.

### Bug Fixes

* compile to es5 ([bf4a9c9](https://github.com/danielroe/sanity-typed-queries/commit/bf4a9c9a5a05fa88e5c2803853ddc59e62d5c232))


### Code Refactoring

* adjust return type of use() for flexibility ([d78c742](https://github.com/danielroe/sanity-typed-queries/commit/d78c742ae325a006a6ce100a1da2b1271b0d4912))

