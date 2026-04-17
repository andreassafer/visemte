import { describe, it, expect, beforeEach } from 'vitest'
import {
  saveTemplate,
  loadTemplate,
  listTemplates,
  deleteTemplate,
  savePreset,
  listPresets,
  deletePreset,
  initPresets,
} from './localStorage'
import type { EmailTemplate } from '@/types'

const makeTemplate = (id: string, name = 'Test'): EmailTemplate => ({
  id,
  name,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  settings: {
    backgroundColor: '#ffffff',
    contentWidth: 600,
    fontFamily: 'Arial',
    fontSize: 14,
    fontColor: '#000000',
    lineHeight: 1.5,
  },
  blocks: [],
})

beforeEach(() => {
  localStorage.clear()
})

// ── Templates ────────────────────────────────────────────────────────────────

describe('saveTemplate / listTemplates', () => {
  it('saves and retrieves a template', () => {
    const tpl = makeTemplate('t1', 'Newsletter')
    saveTemplate(tpl)
    expect(listTemplates()).toHaveLength(1)
    expect(listTemplates()[0].name).toBe('Newsletter')
  })

  it('updates an existing template with the same id', () => {
    saveTemplate(makeTemplate('t1', 'Original'))
    saveTemplate(makeTemplate('t1', 'Updated'))
    const all = listTemplates()
    expect(all).toHaveLength(1)
    expect(all[0].name).toBe('Updated')
  })

  it('stores multiple templates', () => {
    saveTemplate(makeTemplate('t1'))
    saveTemplate(makeTemplate('t2'))
    expect(listTemplates()).toHaveLength(2)
  })

  it('returns empty array when nothing is stored', () => {
    expect(listTemplates()).toEqual([])
  })

  it('returns empty array when localStorage contains invalid JSON', () => {
    localStorage.setItem('visemte-templates', 'not-json')
    expect(listTemplates()).toEqual([])
  })
})

describe('loadTemplate', () => {
  it('returns the template with the matching id', () => {
    saveTemplate(makeTemplate('t1', 'My Template'))
    const found = loadTemplate('t1')
    expect(found).not.toBeNull()
    expect(found!.name).toBe('My Template')
  })

  it('returns null when id does not exist', () => {
    expect(loadTemplate('nonexistent')).toBeNull()
  })
})

describe('deleteTemplate', () => {
  it('removes the template with the matching id', () => {
    saveTemplate(makeTemplate('t1'))
    saveTemplate(makeTemplate('t2'))
    deleteTemplate('t1')
    const all = listTemplates()
    expect(all).toHaveLength(1)
    expect(all[0].id).toBe('t2')
  })

  it('does nothing if id does not exist', () => {
    saveTemplate(makeTemplate('t1'))
    deleteTemplate('nonexistent')
    expect(listTemplates()).toHaveLength(1)
  })
})

// ── Presets ──────────────────────────────────────────────────────────────────

describe('savePreset / listPresets', () => {
  it('saves and retrieves a preset', () => {
    savePreset(makeTemplate('p1', 'Welcome'))
    expect(listPresets()).toHaveLength(1)
    expect(listPresets()[0].name).toBe('Welcome')
  })

  it('updates an existing preset with the same id', () => {
    savePreset(makeTemplate('p1', 'Old Name'))
    savePreset(makeTemplate('p1', 'New Name'))
    expect(listPresets()).toHaveLength(1)
    expect(listPresets()[0].name).toBe('New Name')
  })

  it('returns empty array when nothing is stored', () => {
    expect(listPresets()).toEqual([])
  })

  it('returns empty array when localStorage contains invalid JSON', () => {
    localStorage.setItem('visemte-presets', 'bad-json')
    expect(listPresets()).toEqual([])
  })
})

describe('deletePreset', () => {
  it('removes the preset with the matching id', () => {
    savePreset(makeTemplate('p1'))
    savePreset(makeTemplate('p2'))
    deletePreset('p1')
    expect(listPresets()).toHaveLength(1)
    expect(listPresets()[0].id).toBe('p2')
  })
})

describe('initPresets', () => {
  it('seeds presets when storage is empty', () => {
    initPresets([makeTemplate('p1', 'Default')])
    expect(listPresets()).toHaveLength(1)
  })

  it('does not re-seed if all defaults are already present', () => {
    initPresets([makeTemplate('p1', 'Default')])
    initPresets([makeTemplate('p1', 'Default')])
    expect(listPresets()).toHaveLength(1)
  })

  it('adds only new presets that are not already stored', () => {
    savePreset(makeTemplate('p1', 'Existing'))
    initPresets([makeTemplate('p1', 'Default'), makeTemplate('p2', 'New')])
    const presets = listPresets()
    expect(presets).toHaveLength(2)
    expect(presets.find((p) => p.id === 'p1')!.name).toBe('Existing')
    expect(presets.find((p) => p.id === 'p2')!.name).toBe('New')
  })
})
