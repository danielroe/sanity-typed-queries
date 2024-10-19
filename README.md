<h1 align="center">🔤 sanity-typed-queries</h1>
<p align="center">A typed query generator for Sanity</p>

<p align="center">
<a href="https://npmjs.com/package/sanity-typed-queries">
    <img alt="" src="https://img.shields.io/npm/v/sanity-typed-queries/latest.svg?style=flat-square">
</a>
<a href="https://bundlephobia.com/result?p=sanity-typed-queries">
    <img alt="" src="https://img.shields.io/bundlephobia/minzip/sanity-typed-queries?style=flat-square">
</a>
<a href="https://npmjs.com/package/sanity-typed-queries">
    <img alt="" src="https://img.shields.io/npm/dt/sanity-typed-queries.svg?style=flat-square">
</a>
<a href="https://lgtm.com/projects/g/danielroe/sanity-typed-queries">
    <img alt="" src="https://img.shields.io/lgtm/alerts/github/danielroe/sanity-typed-queries?style=flat-square">
</a>
<a href="https://lgtm.com/projects/g/danielroe/sanity-typed-queries">
    <img alt="" src="https://img.shields.io/lgtm/grade/javascript/github/danielroe/sanity-typed-queries?style=flat-square">
</a>
<a href="https://david-dm.org/danielroe/sanity-typed-queries">
    <img alt="" src="https://img.shields.io/david/danielroe/sanity-typed-queries.svg?style=flat-square">
</a>
<a href="https://codecov.io/gh/danielroe/sanity-typed-queries">
    <img alt="" src="https://img.shields.io/codecov/c/github/danielroe/sanity-typed-queries.svg?style=flat-square">
</a>
</p>

> A zero-dependency schema generator and query builder that is fully-typed and works in JavaScript and TypeScript.

## Features

- 📚 **Documentation:** Sanity documentation appears as you type.
- 💪 **TypeScript**: Written in TypeScript.

## Progress

- [x] Fully typed schema builder
- [x] Query builder (working with string, boolean, number), ordering, projections
- [x] Inferred type of arrays
- [x] Support for object types with subfields
- [x] Custom mappings (`"prop": my.prop`)
- [x] Resolving image and file types
- [x] Resolving custom object/document types
- [ ] Distinguish object/document types within valid field types
- [ ] Additional query filters
- [ ] Querying multiple types of document

Help and contributions are welcome.

## Quick Start

First install `sanity-typed-queries`:

```bash
yarn add sanity-typed-queries

# or npm

npm install sanity-typed-queries --save
```

### Schema definition

Now you will need to generate your Sanity schema documents using the schema builder. You will get documentation as you type, and enforced compliance with Sanity's schema builder, such as being able to see validation rules applicable to the type of field you are creating, and so on.

`schema/author.js`:

```ts
import { defineDocument } from 'sanity-typed-queries'

const { document } = defineDocument('author', {
  name: {
    type: 'string',
    validation: Rule => Rule.required(),
  },
  biography: {
    type: 'text',
    rows: 4,
  },
  yearOfBirth: {
    type: 'number',
  },
})

export default document
```

This is equivalent to defining the following schema:

```ts
export default {
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'biography',
      title: 'Biography',
      type: 'text',
      rows: 4,
    },
    {
      name: 'yearOfBirth',
      title: 'Year Of Birth',
      type: 'number',
    },
  ],
}
```

### Query builder

> For more documentation, see [this GROQ/query builder cheat sheet](https://github.com/danielroe/sanity-typed-queries/blob/master/docs/cheat-sheet.md).

You can also export a query builder from the same file.

```ts
import { defineDocument } from 'sanity-typed-queries'

const { document, builder } = defineDocument('author', {
  // ...
})

// Export your query builder for use elsewhere
export { builder }
export default document
```

You can use this builder elsewhere to generate the appropriate types and GROQ queries. For example:

```ts
import { builder as authorBuilder } from './cms/schema/author.js'

const [query, type] = authorBuilder.pick('name').first().use()

// *[_type == 'author'][0].name
const queryString = query

// string
type AuthorName = typeof type
```

If you're using the Sanity client, you might use it like this:

```ts
import sanityClient from '@sanity/client'
import { author } from './cms/schema/author.js'

const [query, type] = author.pick('name').first().use()

const client = sanityClient(config)
// Promise<string>
const result = client.fetch<typeof type>(query)
```

### Custom types

You can export utility objects or documents for reference within other schemas.

`schema/tag.js`:

```ts
import { defineObject } from 'sanity-typed-queries'

const { tag, object } = defineObject('tag', {
  // ...
})

export { tag }
export default object
```

Then you can pass that when defining documents that reference it.

`schema/author.js`:

```ts
import { defineObject } from 'sanity-typed-queries'
import { tag } from './tag'

const { builder, document } = defineDocument(
  'author',
  {
    tag: {
      type: 'tag',
    },
  },
  [tag]
)

export default document
```

## Inspirations

Projects I've found helpful are:

- [`sanity-query-helper`](https://github.com/staccx/sanity-query-helper)

## Contributors

This has been developed to suit my needs but additional use cases and contributions are very welcome.

## License

[MIT License](./LICENSE) - Copyright &copy; Daniel Roe
