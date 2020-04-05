import {
  splitStringByCase,
  capitalise,
  inArray,
  createProxy,
  quoteIfString,
} from '../src/utils'

describe('utils', () => {
  test('splits schema names correctly', () => {
    expect(splitStringByCase('testCMS')).toEqual('Test CMS')
    expect(splitStringByCase('testCMSToday')).toEqual('Test CMS Today')
  })

  test('capitalises names correctly', () => {
    expect(capitalise('johnson')).toEqual('Johnson')
  })

  test('wraps array correctly', () => {
    expect(inArray('a')).toEqual(['a'])
    expect(inArray(['a'])).toEqual(['a'])
  })

  test('creates proxy accessor', () => {
    expect(createProxy([]).a.thing.use()).toBe('a.thing')
    expect(createProxy([]).a.thing.resolve('another').thing.use()).toBe(
      'a.thing->another.thing'
    )

    expect(
      createProxy([]).a.thing.resolve('another').thing.use('default')
    ).toBe('coalesce(a.thing->another.thing,"default")')
    expect(createProxy([]).a.thing.resolve('another').thing.use(true)).toBe(
      'coalesce(a.thing->another.thing,true)'
    )
  })
  test('wraps strings correctly', () => {
    expect(quoteIfString(true)).toEqual('true')
    expect(quoteIfString(21)).toEqual('21')
    expect(quoteIfString('true')).toEqual('"true"')
  })
})
