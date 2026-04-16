import { useTranslation } from 'react-i18next'
import { FormField, Select, Textarea, ColorSelect, CollapsibleSection } from '@/components/ui'
import type { EmailBlock } from '@/types'

interface Props {
  block: EmailBlock
  onChange: (props: Partial<Record<string, unknown>>) => void
}

const DEFAULT_GENERAL    = { css: '' }
const DEFAULT_BACKGROUND = { sectionBg: 'pageColor' }
const DEFAULT_COL        = { align: 'left', verticalAlign: 'top', backgroundColor: '', borderRadius: '4px', padding: '0px', borderWidth: '', borderColor: 'borderColor', borderStyle: 'solid' }

export function ColumnsProperties({ block, onChange }: Props) {
  const { t } = useTranslation()
  const p = block.props as Record<string, unknown>
  const count = Math.min(Math.max(Number(p['columns'] ?? 2), 1), 3)

  const PRESETS_2 = [
    { value: '50,50',  label: '½ + ½' },
    { value: '33,67',  label: '⅓ + ⅔' },
    { value: '67,33',  label: '⅔ + ⅓' },
    { value: '25,75',  label: '¼ + ¾' },
    { value: '75,25',  label: '¾ + ¼' },
  ]
  const PRESETS_3 = [
    { value: '34,33,33', label: '⅓ + ⅓ + ⅓' },
    { value: '25,50,25', label: '¼ + ½ + ¼' },
    { value: '50,25,25', label: '½ + ¼ + ¼' },
    { value: '25,25,50', label: '¼ + ¼ + ½' },
  ]
  const presets = count === 3 ? PRESETS_3 : PRESETS_2
  const columnWidths = String(p['columnWidths'] ?? '')

  const colPropsArr = (Array.isArray(p['columnProps']) ? p['columnProps'] : []) as Record<string, string>[]

  const handleColumnsChange = (newCount: number) => {
    const current = (p['columnBlocks'] as unknown[][] | undefined) ?? []
    const columnBlocks = Array.from({ length: newCount }, (_, i) => current[i] ?? [])
    const usedCols = new Set(colPropsArr.map((cp) => cp['col']).filter(Boolean))
    const columnProps = Array.from({ length: newCount }, (_, i) => {
      if (colPropsArr[i]) return colPropsArr[i]
      let n = 1
      while (usedCols.has(String(n))) n++
      usedCols.add(String(n))
      return { ...DEFAULT_COL, col: String(n) }
    })
    onChange({ columns: String(newCount), columnBlocks, columnWidths: '', columnProps })
  }

  const resetTooltip = t('editor.properties.resetToDefaults')

  return (
    <div className="flex flex-col gap-2">
      {/* General settings */}
      <CollapsibleSection
        label={t('editor.properties.general')}
        onReset={() => onChange(DEFAULT_GENERAL)}
        tooltip={resetTooltip}
        defaultOpen={false}
      >

        <FormField label={t('editor.properties.css')} htmlFor="columns-css">
          <Textarea
            id="columns-css"
            value={String(p['css'] ?? '')}
            onChange={(e) => onChange({ css: e.target.value })}
            placeholder=""
            rows={3}
            spellCheck={false}
            style={{ fontFamily: 'monospace', fontSize: '12px' }}
          />
        </FormField>
      </CollapsibleSection>

      {/* Hintergrund */}
      <CollapsibleSection
        label={t('editor.properties.sectionBg')}
        onReset={() => onChange(DEFAULT_BACKGROUND)}
        tooltip={resetTooltip}
        defaultOpen={false}
      >

        <FormField label={t('editor.properties.sectionBackground')} htmlFor="col-sectionbg">
          <ColorSelect
            id="col-sectionbg"
            value={String(p['sectionBg'] ?? '')}
            onChange={(v) => onChange({ sectionBg: v || undefined })}
          />
        </FormField>
      </CollapsibleSection>

      {/* Spalten */}
      <CollapsibleSection
        label={t('editor.properties.sectionContent')}
        onReset={() => onChange({ columns: '2', columnWidths: '' })}
        tooltip={resetTooltip}
      >

        <FormField label={t('editor.properties.columnCount')} htmlFor="col-count">
          <Select
            id="col-count"
            value={String(count)}
            onChange={(e) => handleColumnsChange(Number(e.target.value))}
          >
            <option value="1">{t('editor.properties.columns1')}</option>
            <option value="2">{t('editor.properties.columns2')}</option>
            <option value="3">{t('editor.properties.columns3')}</option>
          </Select>
        </FormField>

        {count >= 2 && (
          <FormField label={t('editor.properties.columnWidths')} htmlFor="col-widths">
            <Select
              id="col-widths"
              value={columnWidths}
              onChange={(e) => onChange({ columnWidths: e.target.value })}
            >
              <option value="">{count === 3 ? '⅓ + ⅓ + ⅓' : '½ + ½'}</option>
              {presets.slice(1).map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </Select>
          </FormField>
        )}
      </CollapsibleSection>

    </div>
  )
}
