import { expectType, expectError } from 'tsd'

import { createSchema } from '../../src'
import { Block, File, Geopoint, Image, Reference, Slug } from '../../src/types'

/**
 * 'array'
 */
const array = createSchema('arrayExample', {
  test: { type: 'array', of: [{ type: 'string' }] },
})
  .builder.pick('test')
  .first()
  .use()[1]
expectType<string[]>(array)

expectError(
  createSchema('failingArrayExample', {
    test: { type: 'array' },
  })
)

/**
 * 'block'
 */
const block = createSchema('blockExample', {
  test: { type: 'block' },
})
  .builder.pick('test')
  .first()
  .use()[1]
expectType<Block>(block)

/**
 * 'boolean'
 */
const boolean = createSchema('booleanExample', {
  test: { type: 'boolean' },
})
  .builder.pick('test')
  .first()
  .use()[1]
expectType<boolean>(boolean)

/**
 * 'date'
 */
const date = createSchema('dateExample', {
  test: { type: 'date' },
})
  .builder.pick('test')
  .first()
  .use()[1]
expectType<string>(date)

/**
 * 'datetime'
 */
const datetime = createSchema('datetimeExample', {
  test: { type: 'datetime' },
})
  .builder.pick('test')
  .first()
  .use()[1]
expectType<string>(datetime)

/**
 * 'string'
 */
const string = createSchema('stringExample', {
  test: { type: 'string' },
})
  .builder.pick('test')
  .first()
  .use()[1]
expectType<string>(string)

/**
 * 'text'
 */
const text = createSchema('textExample', {
  test: { type: 'text' },
})
  .builder.pick('test')
  .first()
  .use()[1]
expectType<string>(text)

/**
 * 'url'
 */
const url = createSchema('urlExample', { test: { type: 'url' } })
  .builder.pick('test')
  .first()
  .use()[1]
expectType<string>(url)

/**
 * 'file'
 */
const file = createSchema('fileExample', {
  test: { type: 'file' },
})
  .builder.pick('test')
  .first()
  .use()[1]
expectType<File>(file)

/**
 * 'geopoint'
 */
const geopoint = createSchema('geopointExample', {
  test: { type: 'geopoint' },
})
  .builder.pick('test')
  .first()
  .use()[1]
expectType<Geopoint>(geopoint)

/**
 * 'image'
 */
const image = createSchema('imageExample', {
  test: { type: 'image' },
})
  .builder.pick('test')
  .first()
  .use()[1]
expectType<Image>(image)

/**
 * 'number'
 */
const number = createSchema('numberExample', {
  test: { type: 'number' },
})
  .builder.pick('test')
  .first()
  .use()[1]
expectType<number>(number)

/**
 * 'reference'
 */
const reference = createSchema('referenceExample', {
  test: { type: 'reference', to: [{ type: 'customType' }] },
})
  .builder.pick('test')
  .first()
  .use()[1]
expectType<Reference>(reference)

expectError(
  createSchema('failingRferenceExample', {
    test: { type: 'reference' },
  })
)

/**
 * 'slug'
 */
const slug = createSchema('slugExample', {
  test: { type: 'slug' },
})
  .builder.pick('test')
  .first()
  .use()[1]
expectType<Slug>(slug)
