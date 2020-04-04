import groq from 'groq'

import { defineDocument } from '../src'

const { builder } = defineDocument('typeOfDocument', {
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
  description: {
    type: 'text',
    rows: 2,
    validation: Rule => Rule.required(),
  },
})

describe('query builder', () => {
  test('can specify the first document', () => {
    expect(builder.first().use()[0]).toBe(groq`*[_type == 'typeOfDocument'][0]`)
  })
  test('can choose attributes to project', () => {
    expect(builder.pick('description').use()[0]).toBe(
      groq`*[_type == 'typeOfDocument'].description`
    )
    expect(builder.pick(['description']).use()[0]).toBe(
      groq`*[_type == 'typeOfDocument'] { description }`
    )
  })
  test('can limit results', () => {
    expect(builder.select(0, 2).use()[0]).toBe(
      groq`*[_type == 'typeOfDocument'][0..2]`
    )
    expect(builder.select(0, 2, true).use()[0]).toBe(
      groq`*[_type == 'typeOfDocument'][0...2]`
    )
  })
  test('can order results', () => {
    expect(builder.orderBy('postcode', 'desc').use()[0]).toBe(
      groq`*[_type == 'typeOfDocument'] | order(postcode desc)`
    )
    expect(builder.pick(['_type']).orderBy('_type').use()[0]).toBe(
      groq`*[_type == 'typeOfDocument'] { _type } | order(_type asc)`
    )
    expect(
      builder.orderBy('_type').orderBy('_id').pick(['_type']).use()[0]
    ).toBe(
      groq`*[_type == 'typeOfDocument'] { _type } | order(_type asc, _id asc)`
    )
  })

  test('can generate mappings using object', () => {
    expect(
      builder
        .map({
          test: 'anything',
        })
        .pick(['test'])
        .use()[0]
    ).toBe(groq`*[_type == 'typeOfDocument'] { "test": anything }`)
  })

  test('can generate mappings using helper', () => {
    expect(
      builder
        .map(r => ({ mappedItem: r._type.use() }))
        .pick(['mappedItem'])
        .use()[0]
    ).toBe(groq`*[_type == 'typeOfDocument'] { "mappedItem": _type }`)
    expect(
      builder
        .map(r => ({ mappedItem: r._type.use() }))
        .pick('mappedItem')
        .use()[0]
    ).toBe(groq`*[_type == 'typeOfDocument']._type`)
    expect(
      builder
        .map(r => ({ mappedItem: r._type.use() }))
        .pick('mappedItem')
        .first()
        .use()[0]
    ).toBe(groq`*[_type == 'typeOfDocument'][0]._type`)
  })
  test('can use custom mappings', () => {
    expect(
      builder
        .map({ mappedItem: 'customMap->resolve.thing' })
        .pick(['mappedItem'])
        .use()[0]
    ).toBe(
      groq`*[_type == 'typeOfDocument'] { "mappedItem": customMap->resolve.thing }`
    )
    expect(
      builder.map({ mappedItem: 'customMap->resolve.thing' }).use()[0]
    ).toBe(
      groq`*[_type == 'typeOfDocument'] { ..., "mappedItem": customMap->resolve.thing }`
    )
  })

  test('can resolve items using helper', () => {
    expect(
      builder
        .map(r => ({ mappedItem: r.picture.asset.resolve('assetId').use() }))
        .pick(['mappedItem'])
        .use()[0]
    ).toBe(
      groq`*[_type == 'typeOfDocument'] { "mappedItem": picture.asset->assetId }`
    )
  })
})
