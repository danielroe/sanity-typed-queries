import typescript from 'rollup-plugin-typescript2'
import babel from '@rollup/plugin-babel'
import pkg from './package.json'

const builds = {
  cjs: {
    output: { file: pkg.main },
  },
  es: { output: { file: pkg.module } },
  umd: {
    output: { file: pkg['umd:main'], name: 'sanityTypedQueries' },
  },
}

export default Object.entries(builds).map(([format, build]) => ({
  input: 'src/index.ts',
  output: [
    {
      format,
      ...build.output,
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    typescript({
      typescript: require('typescript'),
    }),
    babel({ babelHelpers: 'bundled', extensions: ['.js', '.ts'] }),
    ...(build.plugins || []),
  ],
}))
