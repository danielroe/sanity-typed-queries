import { defineFields, defineDocument } from '../src/extractor'

const { document } = defineDocument('typeOfDocument', {
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

describe('schema creator', () => {
  test('generates correct schema fields for document', () => {
    expect(document).toMatchSnapshot()
  })

  test('generates correct schema fields when fields are defined', () => {
    expect(defineFields({ field1: { type: 'string' } })).toMatchSnapshot()
  })
})
