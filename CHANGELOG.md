

## [0.9.1](https://github.com/danielroe/sanity-typed-queries/compare/0.9.0...0.9.1) (2022-10-10)

## [0.9.0](https://github.com/danielroe/sanity-typed-queries/compare/0.8.1...0.9.0) (2022-10-07)


### ⚠ BREAKING CHANGES

* mark return type for custom fields as optional (#294)

### Bug Fixes

* mark return type for custom fields as optional ([#294](https://github.com/danielroe/sanity-typed-queries/issues/294)) ([3f34410](https://github.com/danielroe/sanity-typed-queries/commit/3f344107a1bb61c05cefc9392ce5a9ca0d7a4c14))
* **types:** resolve arrays correctly with multi-property resolver ([#295](https://github.com/danielroe/sanity-typed-queries/issues/295)) ([a422167](https://github.com/danielroe/sanity-typed-queries/commit/a4221674b999dd072d77a0ecab555f1b8db592b4))
* updated custom validator typing ([#231](https://github.com/danielroe/sanity-typed-queries/issues/231)) ([9774605](https://github.com/danielroe/sanity-typed-queries/commit/977460568256557e94a189e53bf0f766748f127f))

undefined

### [0.8.1](https://github.com/danielroe/sanity-typed-queries/compare/0.8.0...0.8.1) (2022-02-28)

## [0.8.0](https://github.com/danielroe/sanity-typed-queries/compare/0.7.5...0.8.0) (2022-02-28)


### Features

* strict string typings ([#227](https://github.com/danielroe/sanity-typed-queries/issues/227)) ([ced678d](https://github.com/danielroe/sanity-typed-queries/commit/ced678d79b9a7c4805481cf3d6faf59bfe5a1ee3))
* subquery support ([#169](https://github.com/danielroe/sanity-typed-queries/issues/169)) ([d2a7069](https://github.com/danielroe/sanity-typed-queries/commit/d2a70690f0bfd2f9ddbcd203e3c32dd0dc8975c2))


### Bug Fixes

* Key missing array ([#170](https://github.com/danielroe/sanity-typed-queries/issues/170)) ([a5a3494](https://github.com/danielroe/sanity-typed-queries/commit/a5a3494f1746368fdec6c5d95c690575b6a41c69))### [0.7.5](https://github.com/danielroe/sanity-typed-queries/compare/0.7.4...0.7.5) (2021-02-09)

### [0.7.4](https://github.com/danielroe/sanity-typed-queries/compare/0.7.3...0.7.4) (2021-02-09)


### Bug Fixes

* basic filter typing ([#157](https://github.com/danielroe/sanity-typed-queries/issues/157)) ([1fa747b](https://github.com/danielroe/sanity-typed-queries/commit/1fa747baf78ffab62eee8441289aaf0844e3552f))

### [0.7.3](https://github.com/danielroe/sanity-typed-queries/compare/0.7.2...0.7.3) (2020-09-30)


### Bug Fixes

* use json config ([52be08f](https://github.com/danielroe/sanity-typed-queries/commit/52be08f548d1744b66ba80f9012b0488f866eccb))

### [0.7.2](https://github.com/danielroe/sanity-typed-queries/compare/0.7.1...0.7.2) (2020-09-30)


### Bug Fixes

* produce `es2015` build correctly ([6211056](https://github.com/danielroe/sanity-typed-queries/commit/621105667c4146334c7f9d2873881d1480af1dff)), closes [#95](https://github.com/danielroe/sanity-typed-queries/issues/95)

### [0.7.1](https://github.com/danielroe/sanity-typed-queries/compare/0.7.0...0.7.1) (2020-09-30)


### Bug Fixes

* remove es build to fix [#95](https://github.com/danielroe/sanity-typed-queries/issues/95) ([eb0a94e](https://github.com/danielroe/sanity-typed-queries/commit/eb0a94e852cf4f61b76bbb9875a40e6a07f0836c))

## [0.7.0](https://github.com/danielroe/sanity-typed-queries/compare/0.6.11...0.7.0) (2020-09-26)


### Features

* add ability for additional custom filters ([fd8fc38](https://github.com/danielroe/sanity-typed-queries/commit/fd8fc387819804e2fce893c7185dd2f412a6dea3)), closes [#93](https://github.com/danielroe/sanity-typed-queries/issues/93)

### [0.6.11](https://github.com/danielroe/sanity-typed-queries/compare/0.6.10...0.6.11) (2020-07-03)


### Bug Fixes

* target es2015 to fix `@sanity/cli` builds ([4059596](https://github.com/danielroe/sanity-typed-queries/commit/4059596ecc92cd6593c3395979524e646fb4b0db))

### [0.6.10](https://github.com/danielroe/sanity-typed-queries/compare/0.6.9...0.6.10) (2020-06-27)

### [0.6.9](https://github.com/danielroe/sanity-typed-queries/compare/0.6.8...0.6.9) (2020-06-27)

### [0.6.8](https://github.com/danielroe/sanity-typed-queries/compare/0.6.7...0.6.8) (2020-06-23)

### [0.6.7](https://github.com/danielroe/sanity-typed-queries/compare/0.6.6...0.6.7) (2020-05-08)


### Bug Fixes

* type for annotations was wrongly changed ([f941e57](https://github.com/danielroe/sanity-typed-queries/commit/f941e57c34d0d93b79901c0b79cb9aded13e0bd0)), closes [#35](https://github.com/danielroe/sanity-typed-queries/issues/35)

### [0.6.6](https://github.com/danielroe/sanity-typed-queries/compare/0.6.5...0.6.6) (2020-05-07)


### Bug Fixes

* correct type for marks in block field ([1817eee](https://github.com/danielroe/sanity-typed-queries/commit/1817eee30f8f3265228421593fb02b5812238d7f)), closes [#35](https://github.com/danielroe/sanity-typed-queries/issues/35)

### [0.6.5](https://github.com/danielroe/sanity-typed-queries/compare/0.6.4...0.6.5) (2020-05-06)


### Bug Fixes

* run babel on umd build ([fd7b271](https://github.com/danielroe/sanity-typed-queries/commit/fd7b271a13eec3ffc635fc596b37074e4acaa258))
* transpile all builds ([0107bc1](https://github.com/danielroe/sanity-typed-queries/commit/0107bc1289f800ef0f09d261ded2b91c7f2acccb))

### [0.6.4](https://github.com/danielroe/sanity-typed-queries/compare/0.6.3...0.6.4) (2020-05-05)

### [0.6.3](https://github.com/danielroe/sanity-typed-queries/compare/0.6.2...0.6.3) (2020-05-02)


### Bug Fixes

* remove iife build ([1376386](https://github.com/danielroe/sanity-typed-queries/commit/137638670268feafb9310fb9be45b14bacb67740))

### [0.6.2](https://github.com/danielroe/sanity-typed-queries/compare/0.6.1...0.6.2) (2020-04-29)

### [0.6.1](https://github.com/danielroe/sanity-typed-queries/compare/0.6.0...0.6.1) (2020-04-26)


### Bug Fixes

* add missing parts of schema type ([7a48412](https://github.com/danielroe/sanity-typed-queries/commit/7a4841237e5dd2d99be10d457a0952e59e702928))

## [0.6.0](https://github.com/danielroe/sanity-typed-queries/compare/0.5.1...0.6.0) (2020-04-26)


### Features

* correctly resolve references to documents ([9c1a5c0](https://github.com/danielroe/sanity-typed-queries/commit/9c1a5c04a991b64f08d94f0bd538ed688931acb8))


### Bug Fixes

* correctly label select parameter as exclusive, not inclusive ([176c82a](https://github.com/danielroe/sanity-typed-queries/commit/176c82aa233596cc7030a080c5ff39431bb57132))

### [0.5.1](https://github.com/danielroe/sanity-typed-queries/compare/0.5.0...0.5.1) (2020-04-05)


### Features

* support coalesce, count and array projections ([da8718c](https://github.com/danielroe/sanity-typed-queries/commit/da8718c28cdd2034f77a3f2aa70b54e8d6070987))


### Bug Fixes

* move groq query selection *after* order ([3f758a0](https://github.com/danielroe/sanity-typed-queries/commit/3f758a0520e3bb09d7db1e4ae0bb4ff38237162d))

## [0.5.0](https://github.com/danielroe/sanity-typed-queries/compare/0.4.1...0.5.0) (2020-04-05)


### Features

* allow custom object and document types ([e9cfbd0](https://github.com/danielroe/sanity-typed-queries/commit/e9cfbd0268c871aea7ae07129d29e38d51351deb))

### [0.4.1](https://github.com/danielroe/sanity-typed-queries/compare/0.4.0...0.4.1) (2020-04-04)


### Features

* add support for resolving image and file types ([f0f79b7](https://github.com/danielroe/sanity-typed-queries/commit/f0f79b790a2f0532a0d64d3a9039088d74e2134c))


### Bug Fixes

* handle custom mappings without explicit projection ([008bcb2](https://github.com/danielroe/sanity-typed-queries/commit/008bcb2a7871f20c338ed052cb97855c1c75b0bb))

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