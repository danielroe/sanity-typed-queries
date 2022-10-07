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
} from 'sanity-typed-queries'

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
    expectTypeOf(array).toEqualTypeOf<string[] | undefined>()

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
    expectTypeOf(keyedArray).toEqualTypeOf<KeyedArrayValue | undefined>()

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

    expectTypeOf(blockArray).toEqualTypeOf<Block[] | undefined>()

    /**
     * 'block'
     */
    const block = defineDocument('blockExample', {
      test: { type: 'block' },
    })
      .builder.pick('test')
      .first()
      .use()[1]
    expectTypeOf(block).toEqualTypeOf<Block | undefined>()

    /**
     * 'boolean'
     */
    const boolean = defineDocument('booleanExample', {
      test: { type: 'boolean' },
    })
      .builder.pick('test')
      .first()
      .use()[1]
    expectTypeOf(boolean).toEqualTypeOf<boolean | undefined>()

    /**
     * 'date'
     */
    const date = defineDocument('dateExample', {
      test: { type: 'date' },
    })
      .builder.pick('test')
      .first()
      .use()[1]
    expectTypeOf(date).toEqualTypeOf<string | undefined>()

    /**
     * 'datetime'
     */
    const datetime = defineDocument('datetimeExample', {
      test: { type: 'datetime' },
    })
      .builder.pick('test')
      .first()
      .use()[1]
    expectTypeOf(datetime).toEqualTypeOf<string | undefined>()

    /**
     * 'string'
     */
    const string = defineDocument('stringExample', {
      test: { type: 'string' },
    })
      .builder.pick('test')
      .first()
      .use()[1]
    expectTypeOf(string).toEqualTypeOf<string | undefined>()

    /**
     * enum like string example
     */
    enum AllowedStringValues {
      FOO = 'foo',
      BAR = 'bar',
    }
    const enumString = defineDocument('enumStringExample', {
      test: {
        type: 'string',
        options: { list: [AllowedStringValues.FOO, AllowedStringValues.BAR] },
      },
    })
      .builder.pick('test')
      .first()
      .use()[1]
    expectTypeOf(enumString).toEqualTypeOf<AllowedStringValues | undefined>()

    /**
     * 'text'
     */
    const text = defineDocument('textExample', {
      test: { type: 'text' },
    })
      .builder.pick('test')
      .first()
      .use()[1]
    expectTypeOf(text).toEqualTypeOf<string | undefined>()

    /**
     * 'url'
     */
    const url = defineDocument('urlExample', { test: { type: 'url' } })
      .builder.pick('test')
      .first()
      .use()[1]
    expectTypeOf(url).toEqualTypeOf<string | undefined>()

    /**
     * 'file'
     */
    const file = defineDocument('fileExample', {
      test: { type: 'file' },
    })
      .builder.pick('test')
      .first()
      .use()[1]
    expectTypeOf(file).toEqualTypeOf<File | undefined>()

    /**
     * 'geopoint'
     */
    const geopoint = defineDocument('geopointExample', {
      test: { type: 'geopoint' },
    })
      .builder.pick('test')
      .first()
      .use()[1]
    expectTypeOf(geopoint).toEqualTypeOf<Geopoint | undefined>()

    /**
     * 'image'
     */
    const image = defineDocument('imageExample', {
      test: { type: 'image' },
    })
      .builder.pick('test')
      .first()
      .use()[1]
    expectTypeOf(image).toEqualTypeOf<
      (Image & Record<string, any>) | undefined
    >()

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
      (Image & { bob: string | undefined }) | undefined
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
    expectTypeOf(number).toEqualTypeOf<number | undefined>()

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
      NonNullable<typeof reference>[typeof to]['_type']
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
    expectTypeOf(slug).toEqualTypeOf<Slug | undefined>()

    expect(true).toBeTruthy()
  })
})
