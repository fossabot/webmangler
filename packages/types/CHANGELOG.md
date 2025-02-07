# Changelog

All notable changes to the _WebMangler Types_ project will be documented in this
file.

The format is based on [Keep a Changelog], and this project adheres to [Semantic
Versioning].

## [Unreleased]

- BREAKING: Require plugins to specify a character set. ([#274])
- BREAKING: Use `Collection` type in `WebManglerOptions`. ([#306])
- Export `Collection` type definition. ([#306])
- Export `ReadonlyCollection` type definition. ([#311])
- Make fields of mangler expression option types `readonly`. ([#314])

## [0.1.25] - 2022-01-29

- Use `ReadonlyMap` type to force immutable `Map`s in implementations. ([#248])

## [0.1.24] - 2021-10-30

- Export `MangleExpression` options type definitions. ([#185])

## [0.1.23] - 2021-07-14

- Extract _Webmangler Core_ types into this package. ([#136])

[#136]: https://github.com/ericcornelissen/webmangler/pull/136
[#185]: https://github.com/ericcornelissen/webmangler/pull/185
[#248]: https://github.com/ericcornelissen/webmangler/pull/248
[#274]: https://github.com/ericcornelissen/webmangler/pull/274
[#306]: https://github.com/ericcornelissen/webmangler/pull/306
[#311]: https://github.com/ericcornelissen/webmangler/pull/311
[#314]: https://github.com/ericcornelissen/webmangler/pull/314
[keep a changelog]: https://keepachangelog.com/en/1.0.0/ "Keep a CHANGELOG"
[semantic versioning]: https://semver.org/spec/v2.0.0.html "Semantic versioning"
