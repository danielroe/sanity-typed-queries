import groq from 'groq'
import { defineDocument, defineFields } from 'sanity-typed-queries'
import { describe, expect, it } from 'vitest'

const { author } = defineDocument('author', {
  name: {
    type: 'string',
    validation: Rule => Rule.required(),
  },
})
const { builder } = defineDocument(
  'typeOfDocument',
  {
    name: {
      type: 'string',
      validation: Rule => Rule.required(),
    },
    postcode: {
      type: 'string',
      validation: Rule => Rule.required(),
    },
    cost: {
      type: 'number',
    },
    picture: {
      type: 'image',
    },
    tags: {
      type: 'array',
      of: [{ type: 'string' }],
    },
    objects: {
      type: 'array',
      of: [
        {
          type: 'object',
          fields: defineFields({
            title: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
          }),
        },
      ],
    },
    refs: {
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'author' }] }],
    },
    description: {
      type: 'text',
      rows: 2,
      validation: Rule => Rule.required(),
    },
  },
  [author],
)

describe('query builder', () => {
  it('can specify the first document', () => {
    expect(builder.first().use()[0]).toBe(
      groq`*[_type == 'typeOfDocument'] [0]`,
    )
  })
  it('can filter results', () => {
    expect(builder.filter('_id == "testid"').first().use()[0]).toBe(
      groq`*[_type == 'typeOfDocument' && _id == "testid"] [0]`,
    )
    expect(
      builder.filter('_id == "testid" || defined(id)').first().use()[0],
    ).toBe(
      groq`*[_type == 'typeOfDocument' && (_id == "testid" || defined(id))] [0]`,
    )
  })
  it('can choose attributes to project', () => {
    expect(builder.pick('description').use()[0]).toBe(
      groq`*[_type == 'typeOfDocument'].description`,
    )
    expect(builder.pick(['description']).use()[0]).toBe(
      groq`*[_type == 'typeOfDocument'] { description }`,
    )
  })
  it('can limit results', () => {
    expect(builder.select(0, 2).use()[0]).toBe(
      groq`*[_type == 'typeOfDocument'] [0..2]`,
    )
    expect(builder.select(0, 2, true).use()[0]).toBe(
      groq`*[_type == 'typeOfDocument'] [0...2]`,
    )
  })
  it('can order results', () => {
    expect(builder.orderBy('postcode', 'desc').use()[0]).toBe(
      groq`*[_type == 'typeOfDocument'] | order(postcode desc)`,
    )
    expect(builder.pick(['_type']).orderBy('_type').use()[0]).toBe(
      groq`*[_type == 'typeOfDocument'] | order(_type asc) { _type }`,
    )
    expect(
      builder.orderBy('_type').orderBy('_id').pick(['_type']).use()[0],
    ).toBe(
      groq`*[_type == 'typeOfDocument'] | order(_type asc, _id asc) { _type }`,
    )
    expect(
      builder
        .orderBy('_type')
        .orderBy('_id')
        .pick(['_type'])
        .select(0, 10)
        .use()[0],
    ).toBe(
      groq`*[_type == 'typeOfDocument'] | order(_type asc, _id asc) [0..10] { _type }`,
    )
  })

  it('can generate mappings using object', () => {
    expect(
      builder
        .map({
          test: 'anything',
        })
        .pick(['test'])
        .use()[0],
    ).toBe(groq`*[_type == 'typeOfDocument'] { "test": anything }`)
  })

  it('can generate mappings using helper', () => {
    expect(
      builder
        .map(r => ({ mappedItem: r._type.use() }))
        .pick(['mappedItem'])
        .use()[0],
    ).toBe(groq`*[_type == 'typeOfDocument'] { "mappedItem": _type }`)
    expect(
      builder
        .map(r => ({ mappedItem: r._type.use() }))
        .pick('mappedItem')
        .use()[0],
    ).toBe(groq`*[_type == 'typeOfDocument']._type`)
    expect(
      builder
        .map(r => ({ mappedItem: r._type.use() }))
        .pick('mappedItem')
        .first()
        .use()[0],
    ).toBe(groq`*[_type == 'typeOfDocument'] [0]._type`)
  })
  it('can use custom mappings', () => {
    expect(
      builder
        .map({ mappedItem: 'customMap->resolve.thing' })
        .pick(['mappedItem'])
        .use()[0],
    ).toBe(
      groq`*[_type == 'typeOfDocument'] { "mappedItem": customMap->resolve.thing }`,
    )
    expect(
      builder.map({ mappedItem: 'customMap->resolve.thing' }).use()[0],
    ).toBe(
      groq`*[_type == 'typeOfDocument'] { ..., "mappedItem": customMap->resolve.thing }`,
    )
  })

  it('can resolve items using helper', () => {
    expect(
      builder
        .map(r => ({ mappedItem: r.picture.asset.resolve('assetId').use() }))
        .pick(['mappedItem'])
        .use()[0],
    ).toBe(
      groq`*[_type == 'typeOfDocument'] { "mappedItem": picture.asset->assetId }`,
    )
  })

  it('can resolve items with a further projection', () => {
    expect(
      builder
        .map(r => ({
          mappedItem: r.picture.asset.resolve(['assetId', 'url']).use(),
        }))
        .pick(['mappedItem'])
        .use()[0],
    ).toBe(
      groq`*[_type == 'typeOfDocument'] { "mappedItem": picture.asset->{assetId, url} }`,
    )
  })

  it('can pick fields within an array', () => {
    expect(
      builder
        .map(r => ({
          fields: r.objects.pick('title').use(),
        }))
        .pick(['fields'])
        .use()[0],
    ).toBe(groq`*[_type == 'typeOfDocument'] { "fields": objects[].title }`)
    expect(
      builder
        .map(r => ({
          fields: r.objects.pick(['title', 'description']).use(),
        }))
        .pick(['fields'])
        .use()[0],
    ).toBe(
      groq`*[_type == 'typeOfDocument'] { "fields": objects[]{title, description} }`,
    )
  })

  it('can resolve documents within an array', () => {
    expect(
      builder.map(r => ({ fields: r.refs.resolveIn('name').use() })).use()[0],
    ).toBe(`*[_type == 'typeOfDocument'] { ..., "fields": refs[]->name }`)

    expect(
      builder
        .map(r => ({ fields: r.refs.resolveIn(['name', '_type']).use() }))
        .use()[0],
    ).toBe(
      `*[_type == 'typeOfDocument'] { ..., "fields": refs[]->{name, _type} }`,
    )
  })

  it('can count items', () => {
    expect(builder.map(r => ({ itemCount: r.tags.count() })).use()[0]).toBe(
      `*[_type == 'typeOfDocument'] { ..., "itemCount": count(tags) }`,
    )
  })

  it('can use default values', () => {
    expect(
      builder.map(r => ({ defaultCost: r.cost.use(21.99) })).use()[0],
    ).toBe(
      `*[_type == 'typeOfDocument'] { ..., "defaultCost": coalesce(cost,21.99) }`,
    )
  })

  it('can use subqueries', () => {
    expect(
      builder
        .subquery({
          children: builder.use(),
        })
        .use()[0],
    ).toBe(
      `*[_type == 'typeOfDocument'] { ..., "children": *[_type == 'typeOfDocument'] }`,
    )
  })
})
