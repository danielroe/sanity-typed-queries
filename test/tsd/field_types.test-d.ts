import { expectType, expectError } from 'tsd'

import { defineDocument } from '../../src'
import { Block, File, Geopoint, Image, Reference, Slug } from '../../src/types'
import { defineFields } from '../../src/extractor'

/**
 * 'array'
 */
const array = defineDocument('arrayExample', {
  test: { type: 'array', of: [{ type: 'string' }] },
})
  .builder.pick('test')
  .first()
  .use()[1]
expectType<string[]>(array)

expectError(
  defineDocument('failingArrayExample', {
    test: { type: 'array' },
  })
)

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

expectType<Block[]>(blockArray)

/**
 * 'block'
 */
const block = defineDocument('blockExample', {
  test: { type: 'block' },
})
  .builder.pick('test')
  .first()
  .use()[1]
expectType<Block>(block)

/**
 * 'boolean'
 */
const boolean = defineDocument('booleanExample', {
  test: { type: 'boolean' },
})
  .builder.pick('test')
  .first()
  .use()[1]
expectType<boolean>(boolean)

/**
 * 'date'
 */
const date = defineDocument('dateExample', {
  test: { type: 'date' },
})
  .builder.pick('test')
  .first()
  .use()[1]
expectType<string>(date)

/**
 * 'datetime'
 */
const datetime = defineDocument('datetimeExample', {
  test: { type: 'datetime' },
})
  .builder.pick('test')
  .first()
  .use()[1]
expectType<string>(datetime)

/**
 * 'string'
 */
const string = defineDocument('stringExample', {
  test: { type: 'string' },
})
  .builder.pick('test')
  .first()
  .use()[1]
expectType<string>(string)

/**
 * 'text'
 */
const text = defineDocument('textExample', {
  test: { type: 'text' },
})
  .builder.pick('test')
  .first()
  .use()[1]
expectType<string>(text)

/**
 * 'url'
 */
const url = defineDocument('urlExample', { test: { type: 'url' } })
  .builder.pick('test')
  .first()
  .use()[1]
expectType<string>(url)

/**
 * 'file'
 */
const file = defineDocument('fileExample', {
  test: { type: 'file' },
})
  .builder.pick('test')
  .first()
  .use()[1]
expectType<File>(file)

/**
 * 'geopoint'
 */
const geopoint = defineDocument('geopointExample', {
  test: { type: 'geopoint' },
})
  .builder.pick('test')
  .first()
  .use()[1]
expectType<Geopoint>(geopoint)

/**
 * 'image'
 */
const image = defineDocument('imageExample', {
  test: { type: 'image' },
})
  .builder.pick('test')
  .first()
  .use()[1]
expectType<Image & Record<string, any>>(image)

const imageWithFields = defineDocument('imageExample', {
  test: { type: 'image', fields: defineFields({ bob: { type: 'string' } }) },
})
  .builder.pick('test')
  .first()
  .use()[1]
expectType<Image & { bob: string | undefined }>(imageWithFields)

/**
 * 'number'
 */
const number = defineDocument('numberExample', {
  test: { type: 'number' },
})
  .builder.pick('test')
  .first()
  .use()[1]
expectType<number>(number)

/**
 * 'reference'
 */
const reference = defineDocument('referenceExample', {
  test: { type: 'reference', to: [{ type: 'customType' }] },
})
  .builder.pick('test')
  .first()
  .use()[1]
expectType<Reference<Record<string, any>>>(reference)

expectError(
  defineDocument('failingReferenceExample', {
    test: { type: 'reference' },
  })
)

/**
 * 'slug'
 */
const slug = defineDocument('slugExample', {
  test: { type: 'slug' },
})
  .builder.pick('test')
  .first()
  .use()[1]
expectType<Slug>(slug)
