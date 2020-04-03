import { expectType, expectError } from 'tsd'

import { defineDocument } from '../../src'
import { defineFields } from '../../src/extractor'

const { builder } = defineDocument('author', {
  name: {
    type: 'string',
    validation: Rule => Rule.required(),
  },
  tags: {
    type: 'array',
    of: [{ type: 'string' }, { type: 'number' }],
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

const a = builder.pick('description').use()[1]
expectType<string[]>(a)

const b = builder.first().pick('description').use()[1]
expectType<string>(b)

const c = builder.pick('description').first().use()[1]
expectType<string>(c)

const type = builder.pick('tags').first().use()[1]
expectType<Array<string | number>>(type)

const d = builder.use()[1]
expectType<
  Array<{
    name: string
    tags: Array<string | number>
    cost: number
    description: string
    _createdAt: string
    _updatedAt: string
    _id: string
    _rev: string
    _type: 'author'
  }>
>(d)

const e = builder.pick('_updatedAt').first().use()[1]
expectType<string>(e)

const f = builder.pick(['_type', 'name']).first().use()[1]
expectType<{ _type: 'author'; name: string }>(f)

expectError(builder.pick('nothere'))

const { builder: testObj } = defineDocument('author', {
  testObject: {
    type: 'object',
    fields: defineFields({ subfield: { type: 'string' } }),
    validation: Rule => Rule.required(),
  },
})
const g = testObj.pick('testObject').first().use()[1]
expectType<{ subfield: string | undefined }>(g)
