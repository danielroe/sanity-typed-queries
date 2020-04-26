export function capitalise(text: string) {
  return text[0].toUpperCase() + text.slice(1)
}

export function splitStringByCase(text: string) {
  return capitalise(
    text
      .replace(/[A-Z]+[a-z]/g, h =>
        h.length > 2
          ? h.slice(0, -2) + ' ' + capitalise(h.slice(-2).toLowerCase())
          : Array(h).join(' ')
      )
      .replace(/[a-z][A-Z]+/g, h => `${h[0]} ${h.slice(1)}`)
  )
}

export function inArray<A>(items: A | A[]) {
  return Array.isArray(items) ? items : [items]
}

export function quoteIfString<A>(potentialString: A) {
  return typeof potentialString === 'string'
    ? `"${potentialString}"`
    : `${potentialString}`
}

export const createProxy: (path: string[]) => any = (path: string[]) =>
  new Proxy(path, {
    get(target, prop: string) {
      switch (prop) {
        case 'use':
          return (defaultValue?: any) => {
            const path = target
              .join('.')
              .replace(/\.->/g, '->')
              .replace(/\.\[\]/g, '[]')
            if (defaultValue === undefined) return path

            return `coalesce(${path},${quoteIfString(defaultValue)})`
          }

        case 'resolveIn':
          return (attr: string | string[]) => {
            const wrappedAttributes = Array.isArray(attr)
              ? `{${attr.join(', ')}}`
              : attr
            return createProxy([...target, `[]->${wrappedAttributes}`])
          }

        case 'resolve':
          return (attr: string | string[]) => {
            const wrappedAttributes = Array.isArray(attr)
              ? `{${attr.join(', ')}}`
              : attr
            return createProxy([...target, `->${wrappedAttributes}`])
          }

        case 'pick':
          return (attr: string | string[]) => {
            const wrappedAttributes = Array.isArray(attr)
              ? `{${attr.join(', ')}}`
              : `.${attr}`
            return createProxy([...target, `[]${wrappedAttributes}`])
          }

        case 'count':
          return () => `count(${path})`

        default:
          return createProxy([...target, prop])
      }
    },
  })
