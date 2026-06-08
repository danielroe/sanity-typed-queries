import { defineConfig } from 'tsdown'

export default defineConfig({
  dts: { oxc: true },
  format: ['esm', 'cjs'],
  exports: {
    devExports: true,
    customExports: (exports, { isPublish }) => {
      if (!isPublish)
        return exports
      return {
        ...exports,
        '.': {
          types: {
            import: './dist/index.d.mts',
            require: './dist/index.d.cts',
          },
          import: './dist/index.mjs',
          require: './dist/index.cjs',
        },
      }
    },
  },
})
