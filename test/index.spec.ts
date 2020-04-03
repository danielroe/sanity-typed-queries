import { defineDocument } from '../src'
import { capitalise, splitStringByCase } from '../src/utils'
import { defineFields } from '../src/extractor'

const { document, builder } = defineDocument('typeOfDocument', {
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
  description: {
    type: 'text',
    rows: 2,
    validation: Rule => Rule.required(),
  },
})

describe('schema creator', () => {
  test('generates correct schema fields for document', () => {
    expect(document).toMatchSnapshot()
  })

  test('generates correct schema fields when fields are defined', () => {
    expect(defineFields({ field1: { type: 'string' } })).toMatchSnapshot()
  })

  test('generates correct queries', () => {
    expect(builder.first().use()[0]).toMatchSnapshot()
    expect(builder.pick('description').use()[0]).toMatchSnapshot()
    expect(builder.pick(['description']).use()[0]).toMatchSnapshot()
    expect(builder.select(0, 2).use()[0]).toMatchSnapshot()
    expect(builder.select(0, 2, true).use()[0]).toMatchSnapshot()
    expect(builder.orderBy('postcode', 'desc').use()[0]).toMatchSnapshot()
    expect(builder.pick(['_type']).orderBy('_type').use()[0]).toMatchSnapshot()
  })

  test('generates custom mappings correctly', () => {
    expect(
      builder
        .map(r => ({ mappedItem: r._type.use() }))
        .pick(['mappedItem'])
        .use()[0]
    ).toMatchSnapshot()
    expect(
      builder
        .map(r => ({ mappedItem: r._type.use() }))
        .pick('mappedItem')
        .use()[0]
    ).toMatchSnapshot()
    expect(
      builder
        .map(r => ({ mappedItem: r._type.use() }))
        .pick('mappedItem')
        .first()
        .use()[0]
    ).toMatchSnapshot()
    expect(
      builder
        .map({ mappedItem: 'customMap->resolve.thing' })
        .pick(['mappedItem'])
        .use()[0]
    ).toMatchSnapshot()
  })
})

describe('utils', () => {
  test('splits schema names correctly', () => {
    expect(splitStringByCase('testCMS')).toEqual('Test CMS')
    expect(splitStringByCase('testCMSToday')).toEqual('Test CMS Today')
  })

  test('capitalises names correctly', () => {
    expect(capitalise('johnson')).toEqual('Johnson')
  })
})
