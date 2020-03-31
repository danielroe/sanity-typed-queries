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
