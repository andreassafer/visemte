import { useTranslation } from 'react-i18next'
import { FormField, Select, Textarea, ColorSelect, PaddingSelect, CollapsibleSection } from '@/components/ui'
import { useActiveTemplate } from '@/store'
import type { EmailBlock } from '@/types'

interface Props {
  block: EmailBlock
  onChange: (props: Partial<Record<string, unknown>>) => void
}

const DEFAULT_GENERAL    = { outerPadding: '', innerPadding: '+4', css: '' }
const DEFAULT_BORDER     = { borderRadius: '', secBorderWidth: '', secBorderStyle: '', secBorderColor: 'borderColor' }
const DEFAULT_BACKGROUND = { sectionBg: 'backgroundColor' }
const DEFAULT_CONTENT    = { lineBorderWidth: '1px', lineBorderColor: 'borderColor', lineBorderStyle: 'solid' }

export function DividerProperties({ block, onChange }: Props) {
  const { t } = useTranslation()
  const { settings } = useActiveTemplate()
  const paddingBasePx = parseInt(settings.padding ?? '4px', 10)
  const p = block.props as Record<string, string>
  const resetTooltip = t('editor.properties.resetToDefaults')

  return (
    <div className="flex flex-col gap-2">

      {/* Allgemeines */}
      <CollapsibleSection label={t('editor.properties.general')} onReset={() => onChange(DEFAULT_GENERAL)} tooltip={resetTooltip} defaultOpen={false}>

        <FormField label={t('editor.properties.outerPadding')} htmlFor="div-sectionpadding">
          <PaddingSelect
            id="div-sectionpadding"
            value={p['outerPadding'] || ''}
            basePx={paddingBasePx}
            onChange={(e) => onChange({ outerPadding: e.target.value })}
          />
        </FormField>

        <FormField label={t('editor.properties.innerPadding')} htmlFor="div-innerpadding">
          <PaddingSelect
            id="div-innerpadding"
            value={p['innerPadding'] ?? ''}
            basePx={paddingBasePx}
            onChange={(e) => onChange({ innerPadding: e.target.value })}
          />
        </FormField>

        <FormField label={t('editor.properties.css')} htmlFor="divider-css">
          <Textarea
            id="divider-css"
            value={p['css'] ?? ''}
            onChange={(e) => onChange({ css: e.target.value })}
            placeholder=""
            rows={3}
            spellCheck={false}
            style={{ fontFamily: 'monospace', fontSize: '12px' }}
          />
        </FormField>
      </CollapsibleSection>

      {/* Rahmen */}
      <CollapsibleSection label={t('editor.properties.sectionBorder')} onReset={() => onChange(DEFAULT_BORDER)} tooltip={resetTooltip} defaultOpen={false}>

        <FormField label={t('editor.properties.borderWidth')} htmlFor="div-sec-borderwidth">
          <Select
            id="div-sec-borderwidth"
            value={p['secBorderWidth'] || settings.defaultBorderWidth || '1px'}
            onChange={(e) => onChange({ secBorderWidth: e.target.value })}
          >
            {(['0px', '1px', '2px', '3px', '4px'] as const).map((v) => {
              const isGlobal = !p['secBorderWidth'] && (settings.defaultBorderWidth || '1px') === v
              const label = isGlobal ? `${t('common.global')} (${v})` : v
              return <option key={v} value={v}>{label}</option>
            })}
          </Select>
        </FormField>

        <FormField label={t('editor.properties.borderStyle')} htmlFor="div-sec-borderstyle">
          <Select
            id="div-sec-borderstyle"
            value={p['secBorderStyle'] || settings.defaultBorderStyle || 'solid'}
            onChange={(e) => onChange({ secBorderStyle: e.target.value })}
          >
            {(['solid', 'dashed', 'dotted'] as const).map((v) => {
              const isGlobal = !p['secBorderStyle'] && (settings.defaultBorderStyle || 'solid') === v
              const label = isGlobal
                ? `${t('common.global')} (${t(`editor.properties.borderStyle${v.charAt(0).toUpperCase() + v.slice(1)}`)})`
                : t(`editor.properties.borderStyle${v.charAt(0).toUpperCase() + v.slice(1)}`)
              return <option key={v} value={v}>{label}</option>
            })}
          </Select>
        </FormField>

        <FormField label={t('editor.properties.borderColorFull')} htmlFor="div-sec-bordercolor">
          <ColorSelect
            id="div-sec-bordercolor"
            value={String(p['secBorderColor'] ?? 'borderColor')}
            onChange={(v) => onChange({ secBorderColor: v || undefined })}
          />
        </FormField>

        <FormField label={t('editor.properties.borderRadius')} htmlFor="div-borderradius">
          <Select
            id="div-borderradius"
            value={p['borderRadius'] || settings.defaultBorderRadius || '0px'}
            onChange={(e) => onChange({ borderRadius: e.target.value })}
          >
            {(['0px', '2px', '4px', '6px', '8px', '10px', '12px', '9999px'] as const).map((v) => {
              const isGlobal = !p['borderRadius'] && (settings.defaultBorderRadius || '0px') === v
              const label = isGlobal ? `${t('common.global')} (${v})` : v
              return <option key={v} value={v}>{label}</option>
            })}
          </Select>
        </FormField>
      </CollapsibleSection>

      {/* Hintergrund */}
      <CollapsibleSection label={t('editor.properties.sectionBg')} onReset={() => onChange(DEFAULT_BACKGROUND)} tooltip={resetTooltip} defaultOpen={false}>

        <FormField label={t('editor.properties.sectionBackground')} htmlFor="div-sectionbg">
          <ColorSelect
            id="div-sectionbg"
            value={String(p['sectionBg'] ?? '')}
            onChange={(v) => onChange({ sectionBg: v || undefined })}
          />
        </FormField>
      </CollapsibleSection>

      {/* Inhalt */}
      <CollapsibleSection label={t('editor.properties.sectionSeparator')} onReset={() => onChange(DEFAULT_CONTENT)} tooltip={resetTooltip}>

        <FormField label={t('editor.properties.lineWidth')} htmlFor="div-linewidth">
          <Select
            id="div-linewidth"
            value={p['lineBorderWidth'] ?? p['borderWidth'] ?? '1px'}
            onChange={(e) => onChange({ lineBorderWidth: e.target.value })}
          >
            {['0px', '1px', '2px', '3px', '4px', '5px'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </FormField>

        <FormField label={t('editor.properties.lineColor')} htmlFor="div-linecolor">
          <ColorSelect
            id="div-linecolor"
            value={String(p['lineBorderColor'] ?? p['borderColor'] ?? 'borderColor')}
            onChange={(v) => onChange({ lineBorderColor: v })}
          />
        </FormField>

        <FormField label={t('editor.properties.lineStyle')} htmlFor="div-linestyle">
          <Select
            id="div-linestyle"
            value={p['lineBorderStyle'] ?? p['borderStyle'] ?? 'solid'}
            onChange={(e) => onChange({ lineBorderStyle: e.target.value })}
          >
            <option value="solid">{t('editor.properties.borderStyleSolid')}</option>
            <option value="dashed">{t('editor.properties.borderStyleDashed')}</option>
            <option value="dotted">{t('editor.properties.borderStyleDotted')}</option>
          </Select>
        </FormField>
      </CollapsibleSection>

    </div>
  )
}
