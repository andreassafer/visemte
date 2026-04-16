const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
])
const INDENT = '  '

export function formatHtml(raw: string): string {
  let out = ''
  let depth = 0
  let i = 0

  const push = (s: string) => {
    const t = s.trim()
    if (t) out += INDENT.repeat(depth) + t + '\n'
  }

  while (i < raw.length) {
    if (/\s/.test(raw[i]!)) { i++; continue }

    if (raw[i] !== '<') {
      const end = raw.indexOf('<', i)
      const j = end === -1 ? raw.length : end
      push(raw.slice(i, j))
      i = j
      continue
    }

    // comment (including conditional)
    if (raw.startsWith('<!--', i)) {
      const end = raw.indexOf('-->', i + 4)
      const j = end === -1 ? raw.length : end + 3
      push(raw.slice(i, j))
      i = j
      continue
    }

    // DOCTYPE / declarations
    if (raw.startsWith('<!', i)) {
      const end = raw.indexOf('>', i)
      const j = end === -1 ? raw.length : end + 1
      push(raw.slice(i, j))
      i = j
      continue
    }

    // closing tag
    if (raw.startsWith('</', i)) {
      const end = raw.indexOf('>', i)
      const j = end === -1 ? raw.length : end + 1
      depth = Math.max(0, depth - 1)
      push(raw.slice(i, j).replace(/\s+/g, ' '))
      i = j
      continue
    }

    // <style> / <script>: preserve inner content as raw lines
    const rawTagMatch = raw.slice(i).match(/^<(style|script)(\s[^>]*)?>/)
    if (rawTagMatch) {
      push(rawTagMatch[0].replace(/\s+/g, ' '))
      depth++
      const afterOpen = i + rawTagMatch[0].length
      const tagName = rawTagMatch[1]!
      const closeRe = new RegExp(`</${tagName}\\s*>`, 'i')
      const rest = raw.slice(afterOpen)
      const closeMatch = rest.match(closeRe)
      if (closeMatch) {
        const content = rest.slice(0, closeMatch.index).trim()
        for (const line of content.split('\n')) push(line)
        depth--
        push(`</${tagName}>`)
        i = afterOpen + closeMatch.index! + closeMatch[0].length
      } else {
        i = afterOpen
      }
      continue
    }

    // regular opening / self-closing tag
    const end = raw.indexOf('>', i)
    const j = end === -1 ? raw.length : end + 1
    const tag = raw.slice(i, j).replace(/\s+/g, ' ')
    const nameMatch = tag.match(/^<([\w-]+)/)
    const tagName = nameMatch ? nameMatch[1]!.toLowerCase() : ''
    const isSelfClose = tag.endsWith('/>') || VOID_TAGS.has(tagName)
    push(tag)
    if (!isSelfClose) depth++
    i = j
  }

  return out.trimEnd()
}
