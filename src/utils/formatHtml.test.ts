import { describe, it, expect } from 'vitest'
import { formatHtml } from './formatHtml'

describe('formatHtml', () => {
  it('returns empty string for empty input', () => {
    expect(formatHtml('')).toBe('')
  })

  it('indents nested elements', () => {
    const out = formatHtml('<div><p>Hello</p></div>')
    expect(out).toContain('  <p>')
    expect(out).toContain('  </p>')
  })

  it('decreases indent on closing tags', () => {
    const out = formatHtml('<div><span>x</span></div>')
    const lines = out.split('\n').filter(Boolean)
    expect(lines[0]).toBe('<div>')
    expect(lines[lines.length - 1]).toBe('</div>')
  })

  it('does not indent void tags', () => {
    const out = formatHtml('<div><br></div>')
    expect(out).toContain('  <br>')
  })

  it('handles self-closing tags without incrementing depth', () => {
    const out = formatHtml('<div><img src="x" /></div>')
    const lines = out.split('\n').filter(Boolean)
    expect(lines[lines.length - 1]).toBe('</div>')
  })

  it('preserves DOCTYPE declaration', () => {
    const out = formatHtml('<!DOCTYPE html><html></html>')
    expect(out).toContain('<!DOCTYPE html>')
  })

  it('preserves HTML comments', () => {
    const out = formatHtml('<div><!-- a comment --></div>')
    expect(out).toContain('<!-- a comment -->')
  })

  it('preserves conditional comments', () => {
    const out = formatHtml('<!--[if mso]><table><tr><td></td></tr></table><![endif]-->')
    expect(out).toContain('<!--[if mso]>')
  })

  it('collapses multiple whitespace in tags to single space', () => {
    const out = formatHtml('<div   class="foo"   id="bar"></div>')
    expect(out).toContain('<div class="foo" id="bar">')
  })

  it('trims leading/trailing whitespace from output', () => {
    const out = formatHtml('  <div></div>  ')
    expect(out).toBe('<div>\n</div>')
  })

  it('handles text nodes between elements', () => {
    const out = formatHtml('<p>Hello World</p>')
    expect(out).toContain('Hello World')
  })

  it('handles deeply nested elements', () => {
    const out = formatHtml('<a><b><c><d>x</d></c></b></a>')
    const lines = out.split('\n').filter(Boolean)
    expect(lines[3]).toBe('      <d>')
    expect(lines[4]).toBe('        x')
  })

  it('preserves style block content with indentation', () => {
    const out = formatHtml('<style>body { color: red; }</style>')
    expect(out).toContain('body { color: red; }')
  })

  it('handles multiple top-level elements', () => {
    const out = formatHtml('<div></div><div></div>')
    const lines = out.split('\n').filter(Boolean)
    expect(lines.filter((l) => l.trim() === '<div>')).toHaveLength(2)
  })

  it('handles void tags: area, base, br, col, embed, hr, img, input, link, meta, param, source, track, wbr', () => {
    const voids = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']
    for (const tag of voids) {
      const out = formatHtml(`<div><${tag}></div>`)
      const lines = out.split('\n').filter(Boolean)
      expect(lines[lines.length - 1]).toBe('</div>')
    }
  })
})
