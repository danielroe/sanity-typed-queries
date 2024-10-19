import {
  defineDocument,
  defineFields,
  defineObject,
} from 'sanity-typed-queries'
import { describe, expect, it } from 'vitest'

describe('schema creator', () => {
  it('generates correct schema fields for document', () => {
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

  it('generates correct schema fields for object', () => {
    const { object } = defineObject('myObject', {
      name: {
        type: 'string',
        validation: Rule => Rule.required(),
      },
    })

    expect(object).toMatchSnapshot()
  })

  it('generates correct schema fields when fields are defined', () => {
    expect(defineFields({ field1: { type: 'string' } })).toMatchSnapshot()
  })
})
