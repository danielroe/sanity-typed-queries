import { expectTypeOf } from 'expect-type'
import { defineDocument, defineFields, defineObject } from '../../lib'

describe('builder types', () => {
  it('are defined', () => {
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
    expectTypeOf(a).toEqualTypeOf<string[]>()

    const b = builder.first().pick('description').use()[1]
    expectTypeOf(b).toEqualTypeOf<string>()

    const c = builder.pick('description').first().use()[1]
    expectTypeOf(c).toEqualTypeOf<string>()

    const type = builder.pick('tags').first().use()[1]
    expectTypeOf(type).toEqualTypeOf<Array<string | number>>()

    const d = builder.use()[1]
    expectTypeOf<typeof d[number]['tags']>().toEqualTypeOf<
      Array<string | number>
    >()

    const e = builder.pick('_updatedAt').first().use()[1]
    expectTypeOf(e).toEqualTypeOf<string>()

    const f = builder.pick(['_type', 'name']).first().use()[1]
    expectTypeOf(f).toEqualTypeOf<{ _type: 'author'; name: string }>()

    const filterType = defineDocument('test', { title: { type: 'string' } }).builder.filter('').use()[1][0]
    expectTypeOf(filterType).toEqualTypeOf<{ title: string; }>()

    // @ts-expect-error
    expectTypeOf(builder.pick('nothere'))

    const { builder: testObj } = defineDocument('author', {
      testObject: {
        type: 'object',
        fields: defineFields({ subfield: { type: 'string' } }),
        validation: Rule => Rule.required(),
      },
    })
    const g = testObj.pick('testObject').first().use()[1]
    expectTypeOf(g).toEqualTypeOf<{ subfield: string | undefined }>()

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
    expectTypeOf(h).toEqualTypeOf<
      { test: string; testObject: { subfield: string | undefined } }[]
    >()

    const i = mapper
      .map(r => ({ test: r.num.use(), bagel: r.testObject.use() }))
      .pick(['test', 'num'])
      .use()[1]
    expectTypeOf(i).toEqualTypeOf<{ test: number; num: number }[]>()

    const j = mapper
      .map(r => ({ test: r.num.use(), bagel: r.testObject.use() }))
      .pick(['test', 'bagel'])
      .use()[1]
    expectTypeOf(j).toEqualTypeOf<
      { test: number; bagel: { subfield: string | undefined } }[]
    >()

    const k = mapper
      .map(r => ({ test: r.num.use(), bagel: r.testObject.use() }))
      .pick('bagel')
      .use()[1]
    expectTypeOf(k).toEqualTypeOf<{ subfield: string | undefined }[]>()

    const l = mapper
      .map(r => ({ test: r.num.use(), bagel: r.testObject.use() }))
      .pick('bagel')
      .first()
      .use()[1]
    expectTypeOf(l).toEqualTypeOf<{ subfield: string | undefined }>()

    const m = mapper
      .map(r => ({ test: r.num.use(), bagel: r.testObject.use() }))
      .first()
      .use()[1]

    expectTypeOf<typeof m['bagel']>().toEqualTypeOf<{
      subfield: string | undefined
    }>()

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
    expectTypeOf(resolvedId).toEqualTypeOf<string>()

    const { tag } = defineDocument('tag', {
      title: {
        type: 'number',
      },
    })
    const { smile } = defineObject('smile', {
      title: {
        type: 'string',
      },
    })

    const { builder: objectBuilder, author } = defineDocument(
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
          of: [{ type: 'smile' }],
        },
      },
      [smile, tag]
    )

    defineDocument(
      'test',
      // @ts-expect-error
      { false: { type: 'reference', to: [{ type: 'smile' }] } },
      [tag, smile]
    )

    defineDocument(
      'test',
      // @ts-expect-error
      { false: { type: 'array', of: [{ type: 'tag' }] } },
      [tag, smile]
    )

    const inter = objectBuilder.pick('num').first().use()[1]
    expectTypeOf<typeof inter['title']>().toEqualTypeOf<string>()
    const inter2 = objectBuilder
      .map(h => ({ bingTitle: h.bing.resolve('title').use() }))
      .first()
      .use()[1]
    expectTypeOf<typeof inter2['bingTitle']>().toEqualTypeOf<number>()
    const inter3 = objectBuilder
      .map(h => ({ count: h.more.count() }))
      .first()
      .use()[1]
    expectTypeOf<typeof inter3['count']>().toEqualTypeOf<number>()

    const inter4 = objectBuilder
      .map(h => ({ count: h.tagArray.pick(['_type', 'title']).use() }))
      .first()
      .use()[1]
    expectTypeOf<typeof inter4['_type']>().toEqualTypeOf<'author'>()

    const referenceBuilder = defineDocument(
      'novel',
      {
        authors: {
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'author' }] }],
        },
      },
      [author]
    ).builder

    expectTypeOf(
      referenceBuilder
        .map(r => ({ fields: r.authors.resolveIn('more').use() }))
        .pick('fields')
        .first()
        .use()[1]
    ).toEqualTypeOf<string[][]>()

    expect(true).toBeTruthy()
  })
})
