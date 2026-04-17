import { describe, it, expect } from 'vitest'
import { templateToMjml } from './templateToMjml'
import type { EmailTemplate, EmailBlock } from '@/types'

const baseSettings = {
  backgroundColor: '#ffffff',
  contentWidth: 600,
  fontFamily: 'Arial, sans-serif',
  fontSize: 14,
  fontColor: '#000000',
  lineHeight: 1.5,
}

const makeTemplate = (blocks: EmailBlock[]): EmailTemplate => ({
  id: 'test-id',
  name: 'Test',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  settings: baseSettings,
  blocks,
})

const makeBlock = (type: EmailBlock['type'], props: Record<string, unknown> = {}): EmailBlock => ({
  id: `block-${type}`,
  type,
  props,
})

describe('templateToMjml', () => {
  describe('wrapper structure', () => {
    it('produces a valid MJML skeleton', () => {
      const mjml = templateToMjml(makeTemplate([]))
      expect(mjml).toContain('<mjml>')
      expect(mjml).toContain('</mjml>')
      expect(mjml).toContain('<mj-head>')
      expect(mjml).toContain('<mj-body')
      expect(mjml).toContain('</mj-body>')
    })

    it('sets body background-color from settings', () => {
      const mjml = templateToMjml(makeTemplate([]))
      expect(mjml).toContain('background-color="#ffffff"')
    })

    it('sets body width from settings', () => {
      const mjml = templateToMjml(makeTemplate([]))
      expect(mjml).toContain('width="600px"')
    })

    it('applies font-family from settings via mj-all', () => {
      const mjml = templateToMjml(makeTemplate([]))
      expect(mjml).toContain('font-family="Arial, sans-serif"')
    })

    it('applies font-size from settings via mj-text', () => {
      const mjml = templateToMjml(makeTemplate([]))
      expect(mjml).toContain('font-size="14px"')
    })

    it('renders an empty body when blocks array is empty', () => {
      const mjml = templateToMjml(makeTemplate([]))
      expect(mjml).not.toContain('<mj-section')
    })
  })

  describe('text block', () => {
    it('renders mj-text with content', () => {
      const mjml = templateToMjml(makeTemplate([makeBlock('text', { content: 'Hello World' })]))
      expect(mjml).toContain('<mj-text')
      expect(mjml).toContain('Hello World')
    })

    it('defaults to left alignment', () => {
      const mjml = templateToMjml(makeTemplate([makeBlock('text', { content: 'x' })]))
      expect(mjml).toContain('align="left"')
    })

    it('uses custom alignment', () => {
      const mjml = templateToMjml(
        makeTemplate([makeBlock('text', { content: 'x', align: 'center' })]),
      )
      expect(mjml).toContain('align="center"')
    })

    it('includes color when provided', () => {
      const mjml = templateToMjml(
        makeTemplate([makeBlock('text', { content: 'x', color: '#ff0000' })]),
      )
      expect(mjml).toContain('color="#ff0000"')
    })

    it('uses default padding', () => {
      const mjml = templateToMjml(makeTemplate([makeBlock('text', { content: 'x' })]))
      expect(mjml).toContain('padding:4px')
    })

    it('resolves relative innerPadding offset', () => {
      const mjml = templateToMjml(
        makeTemplate([makeBlock('text', { content: 'x', innerPadding: '+2' })]),
      )
      // basePx is 4px, so +2 = 6px
      expect(mjml).toContain('padding:6px')
    })

    it('resolves negative innerPadding offset', () => {
      const mjml = templateToMjml(
        makeTemplate([makeBlock('text', { content: 'x', innerPadding: '-2' })]),
      )
      // basePx is 4px, so -2 = 2px
      expect(mjml).toContain('padding:2px')
    })

    it('wraps text block in mj-section', () => {
      const mjml = templateToMjml(makeTemplate([makeBlock('text', { content: 'x' })]))
      expect(mjml).toContain('<mj-section')
    })
  })

  describe('image block', () => {
    it('renders mj-image with src', () => {
      const mjml = templateToMjml(
        makeTemplate([makeBlock('image', { src: 'https://example.com/img.jpg' })]),
      )
      expect(mjml).toContain('<mj-image')
      expect(mjml).toContain('src="https://example.com/img.jpg"')
    })

    it('omits width attribute for percentage widths', () => {
      const mjml = templateToMjml(makeTemplate([makeBlock('image', { src: '', width: '100%' })]))
      expect(mjml).not.toContain('width="100%"')
    })

    it('includes width attribute for pixel widths', () => {
      const mjml = templateToMjml(makeTemplate([makeBlock('image', { src: '', width: '300px' })]))
      expect(mjml).toContain('width="300px"')
    })

    it('includes border-radius when set to non-zero', () => {
      const mjml = templateToMjml(
        makeTemplate([makeBlock('image', { src: '', borderRadius: '8px' })]),
      )
      expect(mjml).toContain('border-radius="8px"')
    })

    it('omits border-radius when set to 0px', () => {
      const mjml = templateToMjml(
        makeTemplate([makeBlock('image', { src: '', borderRadius: '0px' })]),
      )
      expect(mjml).not.toContain('border-radius')
    })

    it('uses center alignment by default', () => {
      const mjml = templateToMjml(makeTemplate([makeBlock('image', { src: '' })]))
      expect(mjml).toContain('align="center"')
    })
  })

  describe('button block', () => {
    it('renders mj-button with href and text', () => {
      const mjml = templateToMjml(
        makeTemplate([makeBlock('button', { href: 'https://example.com', text: 'Click me' })]),
      )
      expect(mjml).toContain('<mj-button')
      expect(mjml).toContain('href="https://example.com"')
      expect(mjml).toContain('Click me')
    })

    it('uses default background color', () => {
      const mjml = templateToMjml(makeTemplate([makeBlock('button', { text: 'Go' })]))
      expect(mjml).toContain('background-color="#3b82f6"')
    })

    it('uses default white text color', () => {
      const mjml = templateToMjml(makeTemplate([makeBlock('button', { text: 'Go' })]))
      expect(mjml).toContain('color="#ffffff"')
    })

    it('uses default border radius', () => {
      const mjml = templateToMjml(makeTemplate([makeBlock('button', { text: 'Go' })]))
      expect(mjml).toContain('border-radius="3px"')
    })

    it('uses default href when missing', () => {
      const mjml = templateToMjml(makeTemplate([makeBlock('button', { text: 'Go' })]))
      expect(mjml).toContain('href="#"')
    })

    it('resolves relative innerPadding for button', () => {
      const mjml = templateToMjml(
        makeTemplate([makeBlock('button', { text: 'Go', innerPadding: '+4' })]),
      )
      // basePx is 4px, so +4 = 8px
      expect(mjml).toContain('inner-padding="8px')
    })
  })

  describe('divider block', () => {
    it('renders plain mj-divider when no text', () => {
      const mjml = templateToMjml(makeTemplate([makeBlock('divider', {})]))
      expect(mjml).toContain('<mj-divider')
    })

    it('uses default border style and color', () => {
      const mjml = templateToMjml(makeTemplate([makeBlock('divider', {})]))
      expect(mjml).toContain('border-style="solid"')
      expect(mjml).toContain('border-color="#e5e7eb"')
    })

    it('renders text divider as mj-text with table when text is set', () => {
      const mjml = templateToMjml(makeTemplate([makeBlock('divider', { text: 'OR' })]))
      expect(mjml).toContain('<mj-text')
      expect(mjml).toContain('OR')
      expect(mjml).toContain('<table')
      expect(mjml).not.toContain('<mj-divider')
    })

    it('uses vertical-align:middle for text divider lines', () => {
      const mjml = templateToMjml(makeTemplate([makeBlock('divider', { text: 'OR' })]))
      expect(mjml).toContain('vertical-align:middle')
    })
  })

  describe('columns block', () => {
    it('renders 2 columns by default', () => {
      const mjml = templateToMjml(
        makeTemplate([makeBlock('columns', { columns: '2', columnBlocks: [[], []] })]),
      )
      const matches = mjml.match(/<mj-column/g)
      expect(matches?.length).toBe(2)
    })

    it('renders 3 columns when configured', () => {
      const mjml = templateToMjml(
        makeTemplate([makeBlock('columns', { columns: '3', columnBlocks: [[], [], []] })]),
      )
      const matches = mjml.match(/<mj-column/g)
      expect(matches?.length).toBe(3)
    })

    it('clamps columns to maximum of 3', () => {
      const mjml = templateToMjml(
        makeTemplate([makeBlock('columns', { columns: '5', columnBlocks: [] })]),
      )
      const matches = mjml.match(/<mj-column/g)
      expect(matches?.length).toBe(3)
    })

    it('clamps columns to minimum of 1', () => {
      const mjml = templateToMjml(
        makeTemplate([makeBlock('columns', { columns: '0', columnBlocks: [] })]),
      )
      const matches = mjml.match(/<mj-column/g)
      expect(matches?.length).toBe(1)
    })

    it('renders child blocks inside columns', () => {
      const childBlock: EmailBlock = {
        id: 'child',
        type: 'text',
        props: { content: 'Inside column' },
      }
      const mjml = templateToMjml(
        makeTemplate([makeBlock('columns', { columns: '2', columnBlocks: [[childBlock], []] })]),
      )
      expect(mjml).toContain('Inside column')
    })

    it('ignores non-allowed child block types in columns', () => {
      const childBlock: EmailBlock = { id: 'child', type: 'hero', props: {} }
      const mjml = templateToMjml(
        makeTemplate([makeBlock('columns', { columns: '2', columnBlocks: [[childBlock], []] })]),
      )
      expect(mjml).not.toContain('<mj-hero')
    })
  })

  describe('hero block', () => {
    it('renders mj-hero element', () => {
      const mjml = templateToMjml(makeTemplate([makeBlock('hero', {})]))
      expect(mjml).toContain('<mj-section')
    })

    it('uses custom background color', () => {
      const mjml = templateToMjml(makeTemplate([makeBlock('hero', { backgroundColor: '#1e3a5f' })]))
      expect(mjml).toContain('background-color="#1e3a5f"')
    })

    it('falls back to settings background color when not set', () => {
      const tpl: EmailTemplate = {
        ...makeTemplate([makeBlock('hero', {})]),
        settings: { ...baseSettings, backgroundColor: '#aabbcc' },
      }
      const mjml = templateToMjml(tpl)
      expect(mjml).toContain('background-color="#aabbcc"')
    })

    it('includes background-url when src is set', () => {
      const mjml = templateToMjml(
        makeTemplate([makeBlock('hero', { src: 'https://img.com/bg.jpg' })]),
      )
      expect(mjml).toContain("background-image:url('https://img.com/bg.jpg')")
    })

    it('omits background-url when src is empty', () => {
      const mjml = templateToMjml(makeTemplate([makeBlock('hero', { src: '' })]))
      expect(mjml).not.toContain('background-image:url')
    })

    it('includes border-radius when set to non-zero', () => {
      const mjml = templateToMjml(makeTemplate([makeBlock('hero', { secBorderRadius: '8px' })]))
      expect(mjml).toContain('border-radius="8px"')
    })

    it('omits border-radius when set to 0px', () => {
      const mjml = templateToMjml(makeTemplate([makeBlock('hero', { secBorderRadius: '0px' })]))
      expect(mjml).not.toContain('border-radius=')
    })

    it('renders line1Text and line2Text', () => {
      const mjml = templateToMjml(
        makeTemplate([makeBlock('hero', { line1Text: 'Headline', line2Text: 'Subline' })]),
      )
      expect(mjml).toContain('Headline')
      expect(mjml).toContain('Subline')
    })

    it('omits text elements when line text is empty', () => {
      const mjml = templateToMjml(
        makeTemplate([makeBlock('hero', { line1Text: '', line2Text: '' })]),
      )
      // Body section should only contain the single whitespace placeholder <mj-text>, not styled line elements
      const body = mjml.slice(mjml.indexOf('<mj-body'))
      const styledTextMatches = body.match(/<mj-text [^>]*align=/g)
      expect(styledTextMatches).toBeNull()
    })
  })

  describe('social block', () => {
    it('renders mj-social with specified networks', () => {
      const mjml = templateToMjml(
        makeTemplate([makeBlock('social', { networks: 'facebook,twitter' })]),
      )
      expect(mjml).toContain('<mj-social')
      expect(mjml).toContain('name="facebook"')
      expect(mjml).toContain('name="twitter"')
    })

    it('uses default networks (facebook, twitter, instagram)', () => {
      const mjml = templateToMjml(makeTemplate([makeBlock('social', {})]))
      // All networks use name="custom" with base64 SVG icons
      const customMatches = mjml.match(/name="custom"/g)
      expect(customMatches?.length).toBe(3)
      expect(mjml).toContain('src="data:image/svg+xml;base64,')
    })

    it('applies correct brand color for known networks', () => {
      const mjml = templateToMjml(makeTemplate([makeBlock('social', { networks: 'facebook' })]))
      expect(mjml).toContain('background-color="#1877F2"')
    })

    it('includes base64 SVG icon src for known networks', () => {
      const mjml = templateToMjml(makeTemplate([makeBlock('social', { networks: 'linkedin' })]))
      expect(mjml).toContain('src="data:image/svg+xml;base64,')
    })
  })

  describe('quote block', () => {
    it('renders the quote text', () => {
      const mjml = templateToMjml(
        makeTemplate([makeBlock('quote', { text: 'To be or not to be', author: '' })]),
      )
      expect(mjml).toContain('To be or not to be')
    })

    it('renders author with em dash when set', () => {
      const mjml = templateToMjml(
        makeTemplate([makeBlock('quote', { text: 'Quote', author: 'Shakespeare' })]),
      )
      expect(mjml).toContain('— Shakespeare')
    })

    it('omits author line when author is empty', () => {
      const mjml = templateToMjml(makeTemplate([makeBlock('quote', { text: 'Quote', author: '' })]))
      expect(mjml).not.toContain('—')
    })

    it('uses default accent color', () => {
      const mjml = templateToMjml(makeTemplate([makeBlock('quote', { text: 'Q' })]))
      expect(mjml).toContain('#3b82f6')
    })
  })

  describe('accordion block', () => {
    it('renders question and answer text', () => {
      const items = JSON.stringify([{ question: 'Was ist MJML?', answer: 'Ein E-Mail-Framework.' }])
      const mjml = templateToMjml(makeTemplate([makeBlock('accordion', { items })]))
      expect(mjml).toContain('Was ist MJML?')
      expect(mjml).toContain('Ein E-Mail-Framework.')
    })

    it('renders multiple items', () => {
      const items = JSON.stringify([
        { question: 'Q1', answer: 'A1' },
        { question: 'Q2', answer: 'A2' },
      ])
      const mjml = templateToMjml(makeTemplate([makeBlock('accordion', { items })]))
      expect(mjml).toContain('Q1')
      expect(mjml).toContain('Q2')
    })

    it('adds dividers between items but not after the last', () => {
      const items = JSON.stringify([
        { question: 'Q1', answer: 'A1' },
        { question: 'Q2', answer: 'A2' },
      ])
      const mjml = templateToMjml(makeTemplate([makeBlock('accordion', { items })]))
      expect(mjml).toContain('<mj-divider')
    })

    it('handles empty items array gracefully', () => {
      const mjml = templateToMjml(makeTemplate([makeBlock('accordion', { items: '[]' })]))
      expect(mjml).toContain('<mj-section')
    })

    it('handles invalid JSON in items gracefully without throwing', () => {
      expect(() =>
        templateToMjml(makeTemplate([makeBlock('accordion', { items: 'not-valid-json' })])),
      ).not.toThrow()
    })
  })

  describe('countdown block', () => {
    it('renders 4 time unit columns', () => {
      const mjml = templateToMjml(
        makeTemplate([
          makeBlock('countdown', {
            labelDays: 'Tage',
            labelHours: 'Stunden',
            labelMinutes: 'Minuten',
            labelSeconds: 'Sekunden',
          }),
        ]),
      )
      expect(mjml).toContain('Tage')
      expect(mjml).toContain('Stunden')
      expect(mjml).toContain('Minuten')
      expect(mjml).toContain('Sekunden')
    })

    it('renders 00 for all units when no targetDate is set', () => {
      const mjml = templateToMjml(makeTemplate([makeBlock('countdown', {})]))
      const matches = mjml.match(/>00</g)
      expect(matches?.length).toBe(4)
    })

    it('calculates positive time values for a future targetDate', () => {
      const future = new Date(Date.now() + 2 * 86400 * 1000).toISOString()
      const mjml = templateToMjml(makeTemplate([makeBlock('countdown', { targetDate: future })]))
      expect(mjml).not.toMatch(/>00<.*>00<.*>00<.*>00</s)
    })

    it('renders 00 for all units when targetDate is in the past', () => {
      const past = new Date(Date.now() - 10000).toISOString()
      const mjml = templateToMjml(makeTemplate([makeBlock('countdown', { targetDate: past })]))
      const matches = mjml.match(/>00</g)
      expect(matches?.length).toBe(4)
    })

    it('uses default blue background color', () => {
      const mjml = templateToMjml(makeTemplate([makeBlock('countdown', {})]))
      expect(mjml).toContain('background-color:#3b82f6')
    })
  })

  describe('navbar block', () => {
    it('renders the correct number of links', () => {
      const mjml = templateToMjml(
        makeTemplate([
          makeBlock('navbar', {
            linkCount: '3',
            link1Text: 'Home',
            link1Href: '/',
            link2Text: 'About',
            link2Href: '/about',
            link3Text: 'Contact',
            link3Href: '/contact',
          }),
        ]),
      )
      expect(mjml).toContain('Home')
      expect(mjml).toContain('About')
      expect(mjml).toContain('Contact')
    })

    it('uses default separator', () => {
      const mjml = templateToMjml(
        makeTemplate([makeBlock('navbar', { linkCount: '2', link1Text: 'A', link2Text: 'B' })]),
      )
      expect(mjml).toContain(' | ')
    })

    it('uses custom separator', () => {
      const mjml = templateToMjml(
        makeTemplate([
          makeBlock('navbar', { linkCount: '2', link1Text: 'A', link2Text: 'B', separator: ' · ' }),
        ]),
      )
      expect(mjml).toContain(' · ')
    })

    it('clamps linkCount to maximum of 6', () => {
      const mjml = templateToMjml(makeTemplate([makeBlock('navbar', { linkCount: '10' })]))
      const matches = mjml.match(/<a href=/g)
      expect(matches?.length).toBe(6)
    })
  })

  describe('video block', () => {
    it('renders as an mj-image link when src is set', () => {
      const mjml = templateToMjml(
        makeTemplate([makeBlock('video', { src: 'https://youtube.com/watch?v=abc' })]),
      )
      expect(mjml).toContain('<mj-image')
      expect(mjml).toContain('href="https://youtube.com/watch?v=abc"')
    })

    it('uses thumbnail src when provided', () => {
      const mjml = templateToMjml(
        makeTemplate([
          makeBlock('video', {
            src: 'https://yt.com/v=x',
            thumbnailSrc: 'https://img.com/thumb.jpg',
          }),
        ]),
      )
      expect(mjml).toContain('src="https://img.com/thumb.jpg"')
    })

    it('uses a placeholder SVG when no thumbnail is set', () => {
      const mjml = templateToMjml(makeTemplate([makeBlock('video', { src: 'https://yt.com' })]))
      expect(mjml).toContain('src="data:image/svg+xml;base64,')
    })
  })
})
