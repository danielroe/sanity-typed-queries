import { describe, test, expect } from 'vitest'
import { defineFields, defineDocument, defineObject } from '../src/extractor'

describe('schema creator', () => {
  test('generates correct schema fields for document', () => {
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

    expect(document).toMatchSnapshot()
  })

  test('generates correct schema fields for object', () => {
    const { object } = defineObject('myObject', {
      name: {
        type: 'string',
        validation: Rule => Rule.required(),
      },
    })

    expect(object).toMatchSnapshot()
  })

  test('generates correct schema fields when fields are defined', () => {
    expect(defineFields({ field1: { type: 'string' } })).toMatchSnapshot()
  })
})
