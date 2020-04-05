import { expectType, expectError } from 'tsd'

import { defineDocument } from '../../src'
import { defineFields, defineObject } from '../../src/extractor'

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
expectType<Array<string | number>>(d[0].tags)

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

const mapper = defineDocument('author', {
  num: {
    type: 'number',
    validation: Rule => Rule.required(),
  },
  test: {
    type: 'string',
  },
  testObject: {
    type: 'object',
    fields: defineFields({ subfield: { type: 'string' } }),
    validation: Rule => Rule.required(),
  },
}).builder

const h = mapper.pick(['test', 'testObject']).use()[1]
expectType<{ test: string; testObject: { subfield: string | undefined } }[]>(h)

const i = mapper
  .map(r => ({ test: r.num.use(), bagel: r.testObject.use() }))
  .pick(['test', 'num'])
  .use()[1]
expectType<{ test: number; num: number }[]>(i)

const j = mapper
  .map(r => ({ test: r.num.use(), bagel: r.testObject.use() }))
  .pick(['test', 'bagel'])
  .use()[1]
expectType<{ test: number; bagel: { subfield: string | undefined } }[]>(j)

const k = mapper
  .map(r => ({ test: r.num.use(), bagel: r.testObject.use() }))
  .pick('bagel')
  .use()[1]
expectType<{ subfield: string | undefined }[]>(k)

const l = mapper
  .map(r => ({ test: r.num.use(), bagel: r.testObject.use() }))
  .pick('bagel')
  .first()
  .use()[1]
expectType<{ subfield: string | undefined }>(l)

const m = mapper
  .map(r => ({ test: r.num.use(), bagel: r.testObject.use() }))
  .first()
  .use()[1]

expectType<{ subfield: string | undefined }>(m.bagel)

const resolver = defineDocument('author', {
  image: {
    type: 'image',
  },
}).builder

const resolvedId = resolver
  .map(r => ({ testImage: r.image.asset.resolve('assetId').use() }))
  .pick('testImage')
  .first()
  .use()[1]
expectType<string>(resolvedId)

const { tag } = defineObject('tag', {
  title: {
    type: 'number',
  },
})
const { smile } = defineObject('smile', {
  title: {
    type: 'string',
  },
})

const objectBuilder = defineDocument(
  'author',
  {
    num: {
      type: 'smile',
      validation: Rule => Rule.required(),
    },
    bing: {
      type: 'reference',
      to: [{ type: 'tag' }],
    },
    more: {
      type: 'array',
      of: [{ type: 'string' }],
    },
    tagArray: {
      type: 'array',
      of: [{ type: 'tag' }],
    },
  },
  [smile, tag]
).builder

expectType<string>(objectBuilder.pick('num').first().use()[1].title)
expectType<number>(
  objectBuilder
    .map(h => ({ bingTitle: h.bing.resolve('title').use() }))
    .first()
    .use()[1].bingTitle
)
expectType<number>(
  objectBuilder
    .map(h => ({ count: h.more.count() }))
    .first()
    .use()[1].count
)

expectType<'author'>(
  objectBuilder
    .map(h => ({ count: h.tagArray.pick(['_type', 'title']) }))
    .first()
    .use()[1]._type
)
