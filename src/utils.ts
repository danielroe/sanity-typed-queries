export function capitalise(text: string) {
  return text[0].toUpperCase() + text.slice(1)
}

const UC_RE = /[A-Z]/
export function splitStringByCase(text: string) {
  let output = ''
  let index = 0
  for (const char of text) {
    const lastChar = index ? text[index - 1] : ''
    const nextChar = text[index + 1]
    if (
      UC_RE.test(char) &&
      (!UC_RE.test(lastChar) || (nextChar && !UC_RE.test(nextChar)))
    ) {
      output += ' '
    }
    output += char
    index++
  }
  return capitalise(output)
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
