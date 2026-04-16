import { describe, it, expect } from 'vitest'
import { validateTemplate } from './templateValidation'

const validSettings = {
  backgroundColor: '#ffffff',
  contentWidth: 600,
  fontFamily: 'Arial, sans-serif',
  fontSize: 14,
  fontColor: '#000000',
  lineHeight: 1.5,
}

const validTemplate = {
  id: 'abc123',
  name: 'Test Template',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  settings: validSettings,
  blocks: [],
}

describe('validateTemplate', () => {
  it('accepts a valid template with no blocks', () => {
    expect(validateTemplate(validTemplate).success).toBe(true)
  })

  it('accepts all 12 valid block types', () => {
    const types = [
      'text', 'image', 'button', 'divider', 'columns',
      'social', 'navbar', 'hero', 'video', 'countdown', 'accordion', 'quote',
    ]
    const result = validateTemplate({
      ...validTemplate,
      blocks: types.map((type, i) => ({ id: `block-${i}`, type, props: {} })),
    })
    expect(result.success).toBe(true)
  })

  it('accepts blocks with arbitrary props', () => {
    const result = validateTemplate({
      ...validTemplate,
      blocks: [{ id: 'b1', type: 'text', props: { content: 'Hello', fontSize: '16px', align: 'center' } }],
    })
    expect(result.success).toBe(true)
  })

  it('rejects an unknown block type', () => {
    const result = validateTemplate({
      ...validTemplate,
      blocks: [{ id: 'b1', type: 'unknown', props: {} }],
    })
    expect(result.success).toBe(false)
  })

  it('rejects a template missing id', () => {
    const { id: _, ...noId } = validTemplate
    expect(validateTemplate(noId).success).toBe(false)
  })

  it('rejects a template missing name', () => {
    const { name: _, ...noName } = validTemplate
    expect(validateTemplate(noName).success).toBe(false)
  })

  it('rejects a template missing settings', () => {
    const { settings: _, ...noSettings } = validTemplate
    expect(validateTemplate(noSettings).success).toBe(false)
  })

  it('rejects settings with wrong types', () => {
    expect(validateTemplate({ ...validTemplate, settings: { ...validSettings, contentWidth: 'wide' } }).success).toBe(false)
    expect(validateTemplate({ ...validTemplate, settings: { ...validSettings, fontSize: 'big' } }).success).toBe(false)
  })

  it('provides default fontColor (#000000) when omitted', () => {
    const { fontColor: _, ...minSettings } = validSettings
    const result = validateTemplate({ ...validTemplate, settings: minSettings })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.settings.fontColor).toBe('#000000')
  })

  it('provides default lineHeight (1.5) when omitted', () => {
    const { lineHeight: _, ...minSettings } = validSettings
    const result = validateTemplate({ ...validTemplate, settings: minSettings })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.settings.lineHeight).toBe(1.5)
  })

  it('rejects null', () => {
    expect(validateTemplate(null).success).toBe(false)
  })

  it('rejects a plain string', () => {
    expect(validateTemplate('not-a-template').success).toBe(false)
  })

  it('rejects a number', () => {
    expect(validateTemplate(42).success).toBe(false)
  })

  it('rejects blocks array with a missing block id', () => {
    const result = validateTemplate({
      ...validTemplate,
      blocks: [{ type: 'text', props: {} }],
    })
    expect(result.success).toBe(false)
  })

  it('rejects blocks array with non-object entries', () => {
    const result = validateTemplate({
      ...validTemplate,
      blocks: ['not-a-block'],
    })
    expect(result.success).toBe(false)
  })
})
