import { useTranslation } from 'react-i18next'
import { FormField, Select, Textarea, ColorSelect, FontSizeSelect, PaddingSelect, InheritSelect, CollapsibleSection, FormatButtons } from '@/components/ui'
import { useActiveTemplate } from '@/store'
import type { EmailBlock } from '@/types'

interface Props {
  block: EmailBlock
  onChange: (props: Partial<Record<string, unknown>>) => void
}

const DEFAULT_GENERAL    = { outerPadding: '', innerPadding: '+4', css: '' }
const DEFAULT_BORDER     = { borderWidth: '', borderStyle: '', borderColor: 'borderColor', borderRadius: '' }
const DEFAULT_BACKGROUND = { sectionBg: 'backgroundColor' }
const DEFAULT_FONT       = { fontFamily: '', fontSize: '', fontStyle: '', color: 'fontColor' }
const DEFAULT_DESIGN     = { align: 'left' }

export function TextProperties({ block, onChange }: Props) {
  const { t } = useTranslation()
  const { settings } = useActiveTemplate()
  const basePx = settings.fontSize ?? 14
  const paddingBasePx = parseInt(settings.padding ?? '4px', 10)
  const p = block.props as Record<string, string>
  const resetTooltip = t('editor.properties.resetToDefaults')

  return (
    <div className="flex flex-col gap-2">

      {/* General */}
      <CollapsibleSection
        label={t('editor.properties.general')}
        onReset={() => onChange(DEFAULT_GENERAL)}
        tooltip={resetTooltip}
        defaultOpen={false}
      >
        <FormField label={t('editor.properties.outerPadding')} htmlFor="text-sectionpadding">
          <PaddingSelect
            id="text-sectionpadding"
            value={p['outerPadding'] || ''}
            basePx={paddingBasePx}
            onChange={(e) => onChange({ outerPadding: e.target.value })}
          />
        </FormField>

        <FormField label={t('editor.properties.innerPadding')} htmlFor="text-innerpadding">
          <PaddingSelect
            id="text-innerpadding"
            value={p['innerPadding'] ?? p['padding'] ?? ''}
            basePx={paddingBasePx}
            onChange={(e) => onChange({ innerPadding: e.target.value })}
          />
        </FormField>

        <FormField label={t('editor.properties.css')} htmlFor="text-css">
          <Textarea
            id="text-css"
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
      <CollapsibleSection
        label={t('editor.properties.sectionBorder')}
        onReset={() => onChange(DEFAULT_BORDER)}
        tooltip={resetTooltip}
        defaultOpen={false}
      >
        <FormField label={t('editor.properties.borderWidth')} htmlFor="text-borderwidth">
          <Select
            id="text-borderwidth"
            value={p['borderWidth'] || settings.defaultBorderWidth || '1px'}
            onChange={(e) => onChange({ borderWidth: e.target.value })}
          >
            {(['0px', '1px', '2px', '3px', '4px'] as const).map((v) => {
              const isGlobal = !p['borderWidth'] && (settings.defaultBorderWidth || '1px') === v
              const label = isGlobal ? `${t('common.global')} (${v})` : v
              return <option key={v} value={v}>{label}</option>
            })}
          </Select>
        </FormField>

        <FormField label={t('editor.properties.borderStyle')} htmlFor="text-borderstyle">
          <Select
            id="text-borderstyle"
            value={p['borderStyle'] || settings.defaultBorderStyle || 'solid'}
            onChange={(e) => onChange({ borderStyle: e.target.value })}
          >
            {(['solid', 'dashed', 'dotted'] as const).map((v) => {
              const isGlobal = !p['borderStyle'] && (settings.defaultBorderStyle || 'solid') === v
              const label = isGlobal
                ? `${t('common.global')} (${t(`editor.properties.borderStyle${v.charAt(0).toUpperCase() + v.slice(1)}`)})`
                : t(`editor.properties.borderStyle${v.charAt(0).toUpperCase() + v.slice(1)}`)
              return <option key={v} value={v}>{label}</option>
            })}
          </Select>
        </FormField>

        <FormField label={t('editor.properties.borderColorFull')} htmlFor="text-bordercolor">
          <ColorSelect
            id="text-bordercolor"
            value={String(p['borderColor'] ?? 'borderColor')}
            onChange={(v) => onChange({ borderColor: v || undefined })}
          />
        </FormField>

        <FormField label={t('editor.properties.borderRadius')} htmlFor="text-radius">
          <Select
            id="text-radius"
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
      <CollapsibleSection
        label={t('editor.properties.sectionBg')}
        onReset={() => onChange(DEFAULT_BACKGROUND)}
        tooltip={resetTooltip}
        defaultOpen={false}
      >
        <FormField label={t('editor.properties.sectionBackground')} htmlFor="text-sectionbg">
          <ColorSelect
            id="text-sectionbg"
            value={String(p['sectionBg'] ?? '')}
            onChange={(v) => onChange({ sectionBg: v || undefined })}
          />
        </FormField>
      </CollapsibleSection>

      {/* Typography */}
      <CollapsibleSection
        label={t('editor.properties.sectionFont')}
        onReset={() => onChange(DEFAULT_FONT)}
        tooltip={resetTooltip}
        defaultOpen={false}
      >

        <FormField label={t('editor.properties.fontFamily')} htmlFor="text-fontfamily">
          <InheritSelect
            id="text-fontfamily"
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

        <FormField label={t('editor.properties.fontSize')} htmlFor="text-fontsize">
          <FontSizeSelect
            id="text-fontsize"
            value={p['fontSize'] ?? ''}
            basePx={basePx}
            onChange={(e) => onChange({ fontSize: e.target.value })}
          />
        </FormField>

        <FormField label={t('editor.properties.fontStyle')} htmlFor="text-fontstyle">
          <InheritSelect
            id="text-fontstyle"
            value={p['fontStyle'] ?? ''}
            onChange={(e) => onChange({ fontStyle: e.target.value })}
          >
            <option value="normal">{t('editor.properties.normal')}</option>
            <option value="bold">{t('editor.properties.bold')}</option>
            <option value="italic">{t('editor.properties.italic')}</option>
          </InheritSelect>
        </FormField>

        <FormField label={t('editor.properties.fontColorFull')} htmlFor="text-color">
          <ColorSelect
            id="text-color"
            value={String(p['color'] ?? '')}
            onChange={(v) => onChange({ color: v || undefined })}
          />
        </FormField>
      </CollapsibleSection>

      {/* Gestaltung */}
      <CollapsibleSection
        label={t('editor.properties.sectionDesign')}
        onReset={() => onChange(DEFAULT_DESIGN)}
        tooltip={resetTooltip}
        defaultOpen={false}
      >
        <FormField label={t('editor.properties.horizontalAlign')} htmlFor="text-align">
          <Select
            id="text-align"
            value={p['align'] ?? 'left'}
            onChange={(e) => onChange({ align: e.target.value })}
          >
            <option value="left">{t('editor.properties.left')}</option>
            <option value="center">{t('editor.properties.center')}</option>
            <option value="right">{t('editor.properties.right')}</option>
            <option value="justify">{t('editor.properties.justify')}</option>
          </Select>
        </FormField>
      </CollapsibleSection>

      {/* Text */}
      <CollapsibleSection
        label={t('editor.properties.sectionContent')}
        onReset={() => onChange({ content: t('editor.blocks.textPlaceholder') })}
        tooltip={resetTooltip}
      >

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label htmlFor="text-content" className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {t('editor.properties.textHtml')}
            </label>
            <FormatButtons id="text-content" onWrap={(v) => onChange({ content: v.replace(/\n/g, '<br>') })} />
          </div>
          <Textarea
            id="text-content"
            value={(p['content'] ?? '').replace(/<br\s*\/?>/gi, '\n')}
            onChange={(e) => onChange({ content: e.target.value.replace(/\n/g, '<br>') })}
            rows={5}
          />
        </div>
      </CollapsibleSection>

    </div>
  )
}
