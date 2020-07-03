import { PackageOptions } from 'siroc'
import esbuild from 'rollup-plugin-esbuild'

const options: PackageOptions = {
  rollup: {
    plugins: [
      esbuild({
        target: 'es2015',
      }),
    ],
  },
}

export default options
