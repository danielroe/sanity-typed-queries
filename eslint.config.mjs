// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu().append({
  files: ['test/**'],
  rules: {
    'ts/ban-ts-comment': 'off',
    'unused-imports/no-unused-vars': 'off',
  },
})
