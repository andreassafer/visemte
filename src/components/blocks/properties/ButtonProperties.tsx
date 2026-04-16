import { useTranslation } from 'react-i18next'
import { FormField, Input, Select, InheritSelect, Textarea, ColorSelect, FontSizeSelect, PaddingSelect, CollapsibleSection } from '@/components/ui'
import { useActiveTemplate } from '@/store'
import type { EmailBlock } from '@/types'

interface Props {
  block: EmailBlock
  onChange: (props: Partial<Record<string, unknown>>) => void
}

const DEFAULT_GENERAL    = { outerPadding: '', secInnerPadding: '+4', css: '' }
const DEFAULT_BORDER     = { secBorderRadius: '', secBorderWidth: '', secBorderStyle: '', secBorderColor: 'borderColor' }
const DEFAULT_CONTENT_STATIC = { href: 'https://...' }
const DEFAULT_DESIGN     = { align: 'center', backgroundColor: 'primaryColor', borderRadius: '8px', innerPadding: '12px 24px' }
const DEFAULT_BACKGROUND = { sectionBg: 'backgroundColor' }
const DEFAULT_FONT       = { color: 'pageColor', fontFamily: '', fontSize: '', fontStyle: '' }

export function ButtonProperties({ block, onChange }: Props) {
  const { t } = useTranslation()
  const { settings } = useActiveTemplate()
  const basePx = settings.fontSize ?? 14
  const paddingBasePx = parseInt(settings.padding ?? '4px', 10)
  const p = block.props as Record<string, string>
  const resetTooltip = t('editor.properties.resetToDefaults')

  return (
    <div className="flex flex-col gap-2">

      {/* General */}
      <CollapsibleSection label={t('editor.properties.sectionGeneral')} onReset={() => onChange(DEFAULT_GENERAL)} tooltip={resetTooltip} defaultOpen={false}>

        <FormField label={t('editor.properties.outerPadding')} htmlFor="btn-sectionpadding">
          <PaddingSelect
            id="btn-sectionpadding"
            value={p['outerPadding'] || ''}
            basePx={paddingBasePx}
            onChange={(e) => onChange({ outerPadding: e.target.value })}
          />
        </FormField>

        <FormField label={t('editor.properties.innerPadding')} htmlFor="btn-sec-innerpadding">
          <PaddingSelect
            id="btn-sec-innerpadding"
            value={p['secInnerPadding'] ?? ''}
            basePx={paddingBasePx}
            onChange={(e) => onChange({ secInnerPadding: e.target.value })}
          />
        </FormField>

        <FormField label={t('editor.properties.css')} htmlFor="button-css">
          <Textarea
            id="button-css"
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

        <FormField label={t('editor.properties.borderWidth')} htmlFor="btn-sec-borderwidth">
          <Select
            id="btn-sec-borderwidth"
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

        <FormField label={t('editor.properties.borderStyle')} htmlFor="btn-sec-borderstyle">
          <Select
            id="btn-sec-borderstyle"
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

        <FormField label={t('editor.properties.borderColorFull')} htmlFor="btn-sec-bordercolor">
          <ColorSelect
            id="btn-sec-bordercolor"
            value={String(p['secBorderColor'] ?? 'borderColor')}
            onChange={(v) => onChange({ secBorderColor: v || undefined })}
          />
        </FormField>

        <FormField label={t('editor.properties.borderRadius')} htmlFor="btn-sec-borderradius">
          <Select
            id="btn-sec-borderradius"
            value={p['secBorderRadius'] || settings.defaultBorderRadius || '0px'}
            onChange={(e) => onChange({ secBorderRadius: e.target.value })}
          >
            {(['0px', '2px', '4px', '6px', '8px', '10px', '12px', '9999px'] as const).map((v) => {
              const isGlobal = !p['secBorderRadius'] && (settings.defaultBorderRadius || '0px') === v
              const label = isGlobal ? `${t('common.global')} (${v})` : v
              return <option key={v} value={v}>{label}</option>
            })}
          </Select>
        </FormField>
      </CollapsibleSection>

      {/* Hintergrund */}
      <CollapsibleSection label={t('editor.properties.sectionBg')} onReset={() => onChange(DEFAULT_BACKGROUND)} tooltip={resetTooltip} defaultOpen={false}>

        <FormField label={t('editor.properties.sectionBackground')} htmlFor="btn-sectionbg">
          <ColorSelect
            id="btn-sectionbg"
            value={String(p['sectionBg'] ?? '')}
            onChange={(v) => onChange({ sectionBg: v || undefined })}
          />
        </FormField>
      </CollapsibleSection>

      {/* Font */}
      <CollapsibleSection label={t('editor.properties.sectionFont')} onReset={() => onChange(DEFAULT_FONT)} tooltip={resetTooltip} defaultOpen={false}>

        <FormField label={t('editor.properties.fontFamily')} htmlFor="btn-fontfamily">
          <InheritSelect
            id="btn-fontfamily"
            value={p['fontFamily'] ?? ''}
            onChange={(e) => onChange({ fontFamily: e.target.value })}
          >
            <option value="Arial, sans-serif">Arial</option>
            <option value="'Helvetica Neue', Helvetica, sans-serif">Helvetica</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="'Times New Roman', serif">Times New Roman</option>
            <option value="'Courier New', monospace">Courier New</option>
            <option value="Verdana, sans-serif">Verdana</option>
          </InheritSelect>
        </FormField>

        <FormField label={t('editor.properties.fontSize')} htmlFor="btn-fontsize">
          <FontSizeSelect
            id="btn-fontsize"
            value={p['fontSize'] ?? ''}
            basePx={basePx}
            onChange={(e) => onChange({ fontSize: e.target.value })}
          />
        </FormField>

        <FormField label={t('editor.properties.fontStyle')} htmlFor="btn-fontstyle">
          <InheritSelect
            id="btn-fontstyle"
            value={p['fontStyle'] ?? ''}
            onChange={(e) => onChange({ fontStyle: e.target.value })}
          >
            <option value="normal">{t('editor.properties.normal')}</option>
            <option value="bold">{t('editor.properties.bold')}</option>
            <option value="italic">{t('editor.properties.italic')}</option>
          </InheritSelect>
        </FormField>

        <FormField label={t('editor.properties.fontColorFull')} htmlFor="btn-color">
          <ColorSelect
            id="btn-color"
            value={String(p['color'] ?? '')}
            onChange={(v) => onChange({ color: v || undefined })}
          />
        </FormField>
      </CollapsibleSection>

      {/* Design */}
      <CollapsibleSection label={t('editor.properties.sectionDesign')} onReset={() => onChange(DEFAULT_DESIGN)} tooltip={resetTooltip} defaultOpen={false}>

        <FormField label={t('editor.properties.innerPadding')} htmlFor="btn-innerpadding">
          <Select
            id="btn-innerpadding"
            value={p['innerPadding'] ?? '12px 24px'}
            onChange={(e) => onChange({ innerPadding: e.target.value })}
          >
            {['4px 8px', '6px 12px', '8px 16px', '10px 20px', '12px 24px', '14px 28px', '16px 32px', '20px 40px'].map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </Select>
        </FormField>

        <FormField label={t('editor.properties.backgroundColorFull')} htmlFor="btn-bg">
          <ColorSelect
            id="btn-bg"
            value={String(p['backgroundColor'] ?? 'primaryColor')}
            onChange={(v) => onChange({ backgroundColor: v })}
          />
        </FormField>

        <FormField label={t('editor.properties.borderRadius')} htmlFor="btn-radius">
          <Select
            id="btn-radius"
            value={p['borderRadius'] ?? '8px'}
            onChange={(e) => onChange({ borderRadius: e.target.value })}
          >
            {['0px', '2px', '4px', '6px', '8px', '10px', '12px', '9999px'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </FormField>

        <FormField label={t('editor.properties.horizontalAlign')} htmlFor="btn-align">
          <Select
            id="btn-align"
            value={p['align'] ?? 'center'}
            onChange={(e) => onChange({ align: e.target.value })}
          >
            <option value="left">{t('editor.properties.left')}</option>
            <option value="center">{t('editor.properties.center')}</option>
            <option value="right">{t('editor.properties.right')}</option>
          </Select>
        </FormField>
      </CollapsibleSection>

      {/* Inhalt */}
      <CollapsibleSection label={t('editor.properties.sectionContent')} onReset={() => onChange({ ...DEFAULT_CONTENT_STATIC, text: t('editor.properties.buttonTextPlaceholder') })} tooltip={resetTooltip}>

        <FormField label={t('editor.properties.buttonText')} htmlFor="btn-text">
          <Input
            id="btn-text"
            type="text"
            value={p['text'] ?? ''}
            onChange={(e) => onChange({ text: e.target.value })}
          />
        </FormField>

        <FormField label={t('editor.properties.href')} htmlFor="btn-href">
          <Input
            id="btn-href"
            type="url"
            value={p['href'] ?? 'https://...'}
            onChange={(e) => onChange({ href: e.target.value })}
          />
        </FormField>
      </CollapsibleSection>


    </div>
  )
}
