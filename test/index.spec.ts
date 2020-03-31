import { createSchema } from '../src'
import { capitalise, splitStringByCase } from '../src/utils'

function gen() {
  return createSchema('typeOfDocument', {
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
}
const resultType = gen()

describe('schema creator', () => {
  test('generates correct schema fields for document', () => {
    expect(resultType.document).toMatchSnapshot()
  })

  test('generates correct queries', () => {
    expect(gen().builder.first().use()[0]()).toMatchSnapshot()
    expect(gen().builder.pick('description').use()[0]()).toMatchSnapshot()
    expect(gen().builder.pick(['description']).use()[0]()).toMatchSnapshot()
    expect(gen().builder.select(0, 2).use()[0]()).toMatchSnapshot()
    expect(gen().builder.select(0, 2, true).use()[0]()).toMatchSnapshot()
    expect(
      gen().builder.orderBy('postcode', 'desc').use()[0]()
    ).toMatchSnapshot()
    expect(
      gen().builder.pick(['_type']).orderBy('_type').use()[0]()
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
