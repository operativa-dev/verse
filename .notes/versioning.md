---
author: Ben Janecke
---

# Versioning Strategy

Since `@operativa/verse` acts as a combined gateway to (nearly) all Verse
functionality, its version should reflect that by having all `minor` version
bumps to its internal dependencies applied to itself as well. This allows the
`@operativa/verse` package to reflect all backwards-compatible functionality
changes for the _system as a whole_.

We've currently configured https://github.com/atlassian/changesets to bump
internal dependency changes using `patch` which is _probably_ the more correct
thing to do in that situation since the _technically correct_ thing would result
in constant `major` version bumps, but in the case of `@operativa/verse`, we
want to instead receive any `minor` version bumps.

# Examples

In my mind, here's how versioning should look (assume all packages starting at
`1.0.0`):

1. Internal dependency adds backwards-compatible functionality

- `@operativa/verse` adds a new `useCoolThing` export
  - `@operativa/verse@1.0.0` -> `@operativa/verse@1.1.0` (`minor`)
- `@operativa/verse@1.0.0` -> `@operativa/verse@1.1.0` (`minor`) to reflect the
  added _system-level_ functionality

2. Multiple internal dependencies add backwards-compatible functionality

- `@operativa/verse` adds a new `useCoolThing` export
  - `@operativa/verse@1.0.0` -> `@operativa/verse@1.1.0` (`minor`)
- `@operativa/verse` adds a new `AccordionCoolestItem` export
  - `@operativa/verse@1.0.0` -> `@operativa/verse@1.1.0` (`minor`)
- `@operativa/verse@1.0.0` -> `@operativa/verse@1.1.0` (`minor`) to reflect the
  added _system-level_ functionality

3. Internal dependency adds bug fix

- `@operativa/verse` fixes a bug with `useCoolThing`
  - `@operativa/verse@1.0.0` -> `@operativa/verse@1.0.1` (`patch`)
- `@operativa/verse@1.0.0` -> `@operativa/verse@1.0.1` (`patch`) to reflect the
  _system-level_ bug fix

4. Multiple internal dependencies add bug fixes

- `@operativa/verse` fixes a bug with `useCoolThing`
  - `@operativa/verse@1.0.0` -> `@operativa/verse@1.0.1` (`patch`)
- `@operativa/verse` fixes a bug with `useAccordionItem`
  - `@operativa/verse@1.0.0` -> `@operativa/verse@1.0.1` (`patch`)
- `@operativa/verse@1.0.0` -> `@operativa/verse@1.0.1` (`patch`) to reflect the
  _system-level_ bug fixes

5. Internal dependencies add backwards-compatible functionality **and** bug
   fixes

- `@operativa/verse` fixes a bug with `useCoolThing`
  - `@operativa/verse@1.0.0` -> `@operativa/verse@1.0.1` (`patch`)
- `@operativa/verse` adds a new `AccordionCoolestItem` export
  - `@operativa/verse@1.0.0` -> `@operativa/verse@1.1.0` (`minor`)
- `@operativa/verse@1.0.0` -> `@operativa/verse@1.1.1` (`minor` and `patch`) to
  reflect **maximum** version bump of all _system-level_ changes (I believe this
  is the automatic `changesets` behavior, but I need to test that; see
  https://github.com/atlassian/changesets/blob/master/docs/decisions.md#how-changesets-are-combined
  for more info)

6. New package is published

- `@operativa/verse` is created
  - `@operativa/verse@1.0.0` to reflect start of new package
- `@operativa/verse@1.0.0` -> `@operativa/verse@1.1.0` (`minor`) to reflect the
  added _system-level_ functionality

# How?

I think we have two possible solutions:

- Include `@operativa/verse` in all changeset files matching the version bump of
  the dependent package. This requires manual effort, but allows us to fully
  control the process.
- Build our own customized release plan. I'm not sure `changesets` supports this
  yet and need to investigate, but it would allow us to automate this so we
  don't have to always include `@operativa/verse` bumps in our changeset files.
