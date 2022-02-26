import { describe, it, expect } from 'vitest'
import { expectTypeOf } from 'expect-type'

import {
  defineDocument,
  defineFields,
  defineObject,
  Block,
  File,
  Geopoint,
  Image,
  Slug,
  to,
} from '../../lib'

describe('field types', () => {
  it('are defined', () => {
    /**
     * 'array'
     */
    const array = defineDocument('arrayExample', {
      test: { type: 'array', of: [{ type: 'string' }] },
    })
      .builder.pick('test')
      .first()
      .use()[1]
    expectTypeOf(array).toEqualTypeOf<string[]>()

    /** Keyed array exmaple */
    type KeyedArrayValue = (Record<string, any> & {
      _key: string
    })[]
    const keyedArray = defineDocument('arrayExample', {
      test: { type: 'array', of: [{ type: 'object' }] },
    })
      .builder.pick('test')
      .first()
      .use()[1]
    expectTypeOf(keyedArray).toEqualTypeOf<KeyedArrayValue>()

    defineDocument('failingArrayExample', {
      // @ts-expect-error
      test: { type: 'array' },
    })

    const blockArray = defineDocument('arrayExample', {
      tagline: {
        type: 'array',
        of: [
          {
            type: 'block',
            lists: [],
            styles: [{ title: 'Normal', value: 'normal' }],
          },
        ],
        validation: Rule => Rule.required(),
      },
    })
      .builder.pick('tagline')
      .first()
      .use()[1]

    expectTypeOf(blockArray).toEqualTypeOf<Block[]>()

    /**
     * 'block'
     */
    const block = defineDocument('blockExample', {
      test: { type: 'block' },
    })
      .builder.pick('test')
      .first()
      .use()[1]
    expectTypeOf(block).toEqualTypeOf<Block>()

    /**
     * 'boolean'
     */
    const boolean = defineDocument('booleanExample', {
      test: { type: 'boolean' },
    })
      .builder.pick('test')
      .first()
      .use()[1]
    expectTypeOf(boolean).toEqualTypeOf<boolean>()

    /**
     * 'date'
     */
    const date = defineDocument('dateExample', {
      test: { type: 'date' },
    })
      .builder.pick('test')
      .first()
      .use()[1]
    expectTypeOf(date).toEqualTypeOf<string>()

    /**
     * 'datetime'
     */
    const datetime = defineDocument('datetimeExample', {
      test: { type: 'datetime' },
    })
      .builder.pick('test')
      .first()
      .use()[1]
    expectTypeOf(datetime).toEqualTypeOf<string>()

    /**
     * 'string'
     */
    const string = defineDocument('stringExample', {
      test: { type: 'string' },
    })
      .builder.pick('test')
      .first()
      .use()[1]
    expectTypeOf(string).toEqualTypeOf<string>()

    /**
     * 'text'
     */
    const text = defineDocument('textExample', {
      test: { type: 'text' },
    })
      .builder.pick('test')
      .first()
      .use()[1]
    expectTypeOf(text).toEqualTypeOf<string>()

    /**
     * 'url'
     */
    const url = defineDocument('urlExample', { test: { type: 'url' } })
      .builder.pick('test')
      .first()
      .use()[1]
    expectTypeOf(url).toEqualTypeOf<string>()

    /**
     * 'file'
     */
    const file = defineDocument('fileExample', {
      test: { type: 'file' },
    })
      .builder.pick('test')
      .first()
      .use()[1]
    expectTypeOf(file).toEqualTypeOf<File>()

    /**
     * 'geopoint'
     */
    const geopoint = defineDocument('geopointExample', {
      test: { type: 'geopoint' },
    })
      .builder.pick('test')
      .first()
      .use()[1]
    expectTypeOf(geopoint).toEqualTypeOf<Geopoint>()

    /**
     * 'image'
     */
    const image = defineDocument('imageExample', {
      test: { type: 'image' },
    })
      .builder.pick('test')
      .first()
      .use()[1]
    expectTypeOf(image).toEqualTypeOf<Image & Record<string, any>>()

    const imageWithFields = defineDocument('imageExample', {
      test: {
        type: 'image',
        fields: defineFields({ bob: { type: 'string' } }),
      },
    })
      .builder.pick('test')
      .first()
      .use()[1]
    expectTypeOf(imageWithFields).toEqualTypeOf<
      Image & { bob: string | undefined }
    >()

    /**
     * 'number'
     */
    const number = defineDocument('numberExample', {
      test: { type: 'number' },
    })
      .builder.pick('test')
      .first()
      .use()[1]
    expectTypeOf(number).toEqualTypeOf<number>()

    /**
     * 'reference'
     */
    defineDocument('failingReferenceExample', {
      // @ts-expect-error
      test: { type: 'reference' },
    })

    const { anotherDoc } = defineDocument('anotherDoc', {
      title: {
        type: 'string',
      },
    })
    const { anotherObject } = defineObject('anotherObject', {
      kind: {
        type: 'number',
      },
    })
    const reference = defineDocument(
      'referenceExample',
      {
        test: { type: 'reference', to: [{ type: 'anotherDoc' }] },
      },
      [anotherDoc, anotherObject]
    )
      .builder.pick('test')
      .first()
      .use()[1]

    expectTypeOf<
      typeof reference[typeof to]['_type']
    >().toEqualTypeOf<'anotherDoc'>()

    /**
     * 'slug'
     */
    const slug = defineDocument('slugExample', {
      test: { type: 'slug' },
    })
      .builder.pick('test')
      .first()
      .use()[1]
    expectTypeOf(slug).toEqualTypeOf<Slug>()

    expect(true).toBeTruthy()
  })
})
