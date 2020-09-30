import { defineSirocConfig } from 'siroc'

export default defineSirocConfig({
  rollup: {
    esbuildOptions: {
      target: 'es2015',
    },
  },
})
