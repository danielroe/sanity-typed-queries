import { describe, expect } from 'vitest'
import {
  capitalise,
  createProxy,
  inArray,
  quoteIfString,
  splitStringByCase,
} from '../src/utils'

describe('utils', () => {
  it('splits schema names correctly', () => {
    expect(splitStringByCase('testCMS')).toEqual('Test CMS')
    expect(splitStringByCase('testCMSToday')).toEqual('Test CMS Today')
  })

  it('capitalises names correctly', () => {
    expect(capitalise('johnson')).toEqual('Johnson')
  })

  it('wraps array correctly', () => {
    expect(inArray('a')).toEqual(['a'])
    expect(inArray(['a'])).toEqual(['a'])
  })

  it('creates proxy accessor', () => {
    expect(createProxy([]).a.thing.use()).toBe('a.thing')
    expect(createProxy([]).a.thing.resolve('another').thing.use()).toBe(
      'a.thing->another.thing',
    )

    expect(
      createProxy([]).a.thing.resolve('another').thing.use('default'),
    ).toBe('coalesce(a.thing->another.thing,"default")')
    expect(createProxy([]).a.thing.resolve('another').thing.use(true)).toBe(
      'coalesce(a.thing->another.thing,true)',
    )
  })
  it('wraps strings correctly', () => {
    expect(quoteIfString(true)).toEqual('true')
    expect(quoteIfString(21)).toEqual('21')
    expect(quoteIfString('true')).toEqual('"true"')
  })
})
