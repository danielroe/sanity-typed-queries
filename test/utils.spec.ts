import { splitStringByCase, capitalise } from '../src/utils'

describe('utils', () => {
  test('splits schema names correctly', () => {
    expect(splitStringByCase('testCMS')).toEqual('Test CMS')
    expect(splitStringByCase('testCMSToday')).toEqual('Test CMS Today')
  })

  test('capitalises names correctly', () => {
    expect(capitalise('johnson')).toEqual('Johnson')
  })
})
