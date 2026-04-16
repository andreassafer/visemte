import { useTranslation } from 'react-i18next'
import { FormField, Select, Textarea, ColorSelect, FontSizeSelect, PaddingSelect, InheritSelect, CollapsibleSection, FormatButtons } from '@/components/ui'
import { Button } from '@/components/ui'
import { useActiveTemplate } from '@/store'
import type { EmailBlock } from '@/types'

interface Props {
  block: EmailBlock
  onChange: (props: Partial<Record<string, unknown>>) => void
}

const DEFAULT_GENERAL    = { outerPadding: '', padding: '+4', css: '' }
const DEFAULT_BORDER     = { borderWidth: '', borderStyle: '', borderColor: 'borderColor', borderRadius: '' }
const DEFAULT_BACKGROUND = { sectionBg: 'backgroundColor' }
const DEFAULT_FONT_QUESTION = { fontFamily: '', fontSize: '', questionFontStyle: 'bold', color: 'fontColor' }
const DEFAULT_FONT_ANSWER   = { answerFontFamily: '', answerFontSize: '', answerFontStyle: '', answerColor: 'fontColor' }
const DEFAULT_SEPARATOR  = { accordionBorderWidth: '1px', accordionBorderColor: 'borderColor', accordionBorderStyle: 'solid' }

const MAX_ITEMS = 8

export function AccordionProperties({ block, onChange }: Props) {
  const { t } = useTranslation()
  const { settings } = useActiveTemplate()
  const basePx = settings.fontSize ?? 14
  const paddingBasePx = parseInt(settings.padding ?? '4px', 10)
  const p = block.props as Record<string, string>
  const count = Math.min(Math.max(Number(p['faqCount'] ?? 3), 1), MAX_ITEMS)
  const resetTooltip = t('editor.properties.resetToDefaults')

  const deleteItem = (i: number) => {
    const newProps: Record<string, unknown> = { faqCount: String(count - 1) }
    for (let j = i; j < count - 1; j++) {
      newProps[`faq${j + 1}Question`] = p[`faq${j + 2}Question`] ?? ''
      newProps[`faq${j + 1}Answer`]   = p[`faq${j + 2}Answer`]   ?? ''
    }
    newProps[`faq${count}Question`] = ''
    newProps[`faq${count}Answer`]   = ''
    onChange(newProps)
  }

  const defaultQuestion = (n: number) => `${t('editor.blocks.accordionQuestion')} ${n}`
  const defaultAnswer   = (n: number) => `${t('editor.blocks.accordionAnswer')} ${n}`

  return (
    <div className="flex flex-col gap-2">

      {/* Allgemeines */}
      <CollapsibleSection label={t('editor.properties.sectionGeneral')} onReset={() => onChange(DEFAULT_GENERAL)} tooltip={resetTooltip} defaultOpen={false}>
        <FormField label={t('editor.properties.outerPadding')} htmlFor="acc-sectionpadding">
          <PaddingSelect
            id="acc-sectionpadding"
            value={p['outerPadding'] || ''}
            basePx={paddingBasePx}
            onChange={(e) => onChange({ outerPadding: e.target.value })}
          />
        </FormField>
        <FormField label={t('editor.properties.innerPadding')} htmlFor="acc-padding">
          <PaddingSelect
            id="acc-padding"
            value={p['padding'] ?? ''}
            basePx={paddingBasePx}
            onChange={(e) => onChange({ padding: e.target.value })}
          />
        </FormField>
        <FormField label={t('editor.properties.css')} htmlFor="accordion-css">
          <Textarea
            id="accordion-css"
            value={p['css'] ?? ''}
            onChange={(e) => onChange({ css: e.target.value })}
            rows={3}
            spellCheck={false}
            style={{ fontFamily: 'monospace', fontSize: '12px' }}
          />
        </FormField>
      </CollapsibleSection>

      {/* Rahmen */}
      <CollapsibleSection label={t('editor.properties.sectionBorder')} onReset={() => onChange(DEFAULT_BORDER)} tooltip={resetTooltip} defaultOpen={false}>
        <FormField label={t('editor.properties.borderWidth')} htmlFor="acc-borderwidth">
          <Select
            id="acc-borderwidth"
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

        <FormField label={t('editor.properties.borderStyle')} htmlFor="acc-borderstyle">
          <Select
            id="acc-borderstyle"
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

        <FormField label={t('editor.properties.borderColorFull')} htmlFor="acc-bordercolor">
          <ColorSelect
            id="acc-bordercolor"
            value={String(p['borderColor'] ?? 'borderColor')}
            onChange={(v) => onChange({ borderColor: v || undefined })}
          />
        </FormField>

        <FormField label={t('editor.properties.borderRadius')} htmlFor="acc-borderradius">
          <Select
            id="acc-borderradius"
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
        <FormField label={t('editor.properties.sectionBackground')} htmlFor="acc-sectionbg">
          <ColorSelect
            id="acc-sectionbg"
            value={String(p['sectionBg'] ?? '')}
            onChange={(v) => onChange({ sectionBg: v || undefined })}
          />
        </FormField>
      </CollapsibleSection>

      {/* Schrift */}
      <CollapsibleSection label={t('editor.properties.sectionFont')} defaultOpen={false}>

        <CollapsibleSection label={t('editor.properties.sectionQuestion')} onReset={() => onChange(DEFAULT_FONT_QUESTION)} tooltip={resetTooltip} noToggle>

          <FormField label={t('editor.properties.fontFamily')} htmlFor="acc-fontfamily">
            <InheritSelect
              id="acc-fontfamily"
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

          <FormField label={t('editor.properties.fontSize')} htmlFor="acc-fontsize">
            <FontSizeSelect
              id="acc-fontsize"
              value={p['fontSize'] ?? ''}
              basePx={basePx}
              onChange={(e) => onChange({ fontSize: e.target.value })}
            />
          </FormField>

          <FormField label={t('editor.properties.fontStyle')} htmlFor="acc-q-fontstyle">
            <InheritSelect
              id="acc-q-fontstyle"
              value={p['questionFontStyle'] ?? ''}
              onChange={(e) => onChange({ questionFontStyle: e.target.value })}
            >
              <option value="normal">{t('editor.properties.normal')}</option>
              <option value="bold">{t('editor.properties.bold')}</option>
              <option value="italic">{t('editor.properties.italic')}</option>
            </InheritSelect>
          </FormField>

          <FormField label={t('editor.properties.fontColorFull')} htmlFor="acc-color">
            <ColorSelect
              id="acc-color"
              value={String(p['color'] ?? 'fontColor')}
              onChange={(v) => onChange({ color: v || undefined })}
            />
          </FormField>
        </CollapsibleSection>

        <CollapsibleSection label={t('editor.properties.sectionAnswer')} onReset={() => onChange(DEFAULT_FONT_ANSWER)} tooltip={resetTooltip} noToggle>

          <FormField label={t('editor.properties.fontFamily')} htmlFor="acc-answer-fontfamily">
            <InheritSelect
              id="acc-answer-fontfamily"
              value={p['answerFontFamily'] ?? ''}
              onChange={(e) => onChange({ answerFontFamily: e.target.value })}
            >
              <option value="Arial, sans-serif">Arial</option>
              <option value="'Helvetica Neue', Helvetica, sans-serif">Helvetica</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="'Times New Roman', serif">Times New Roman</option>
              <option value="'Courier New', monospace">Courier New</option>
              <option value="Verdana, sans-serif">Verdana</option>
            </InheritSelect>
          </FormField>

          <FormField label={t('editor.properties.fontSize')} htmlFor="acc-answer-fontsize">
            <FontSizeSelect
              id="acc-answer-fontsize"
              value={p['answerFontSize'] ?? ''}
              basePx={basePx}
              onChange={(e) => onChange({ answerFontSize: e.target.value })}
            />
          </FormField>

          <FormField label={t('editor.properties.fontStyle')} htmlFor="acc-a-fontstyle">
            <InheritSelect
              id="acc-a-fontstyle"
              value={p['answerFontStyle'] ?? ''}
              onChange={(e) => onChange({ answerFontStyle: e.target.value })}
            >
              <option value="normal">{t('editor.properties.normal')}</option>
              <option value="bold">{t('editor.properties.bold')}</option>
              <option value="italic">{t('editor.properties.italic')}</option>
            </InheritSelect>
          </FormField>

          <FormField label={t('editor.properties.fontColorFull')} htmlFor="acc-answer-color">
            <ColorSelect
              id="acc-answer-color"
              value={String(p['answerColor'] ?? 'fontColor')}
              onChange={(v) => onChange({ answerColor: v || undefined })}
            />
          </FormField>
        </CollapsibleSection>

      </CollapsibleSection>

      {/* Trennlinie */}
      <CollapsibleSection label={t('editor.properties.sectionSeparator')} onReset={() => onChange(DEFAULT_SEPARATOR)} tooltip={resetTooltip} defaultOpen={false}>
        <FormField label={t('editor.properties.lineWidth')} htmlFor="acc-sep-width">
          <Select
            id="acc-sep-width"
            value={p['accordionBorderWidth'] ?? '1px'}
            onChange={(e) => onChange({ accordionBorderWidth: e.target.value })}
          >
            {['0px', '1px', '2px', '3px', '4px', '5px'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </FormField>

        <FormField label={t('editor.properties.lineColor')} htmlFor="acc-sep-color">
          <ColorSelect
            id="acc-sep-color"
            value={String(p['accordionBorderColor'] ?? p['borderColor'] ?? 'borderColor')}
            onChange={(v) => onChange({ accordionBorderColor: v })}
          />
        </FormField>

        <FormField label={t('editor.properties.lineStyle')} htmlFor="acc-sep-style">
          <Select
            id="acc-sep-style"
            value={p['accordionBorderStyle'] ?? 'solid'}
            onChange={(e) => onChange({ accordionBorderStyle: e.target.value })}
          >
            <option value="solid">{t('editor.properties.borderStyleSolid')}</option>
            <option value="dashed">{t('editor.properties.borderStyleDashed')}</option>
            <option value="dotted">{t('editor.properties.borderStyleDotted')}</option>
          </Select>
        </FormField>
      </CollapsibleSection>

      {/* Inhalt */}
      <CollapsibleSection label={t('editor.properties.sectionContent')}>
        {Array.from({ length: count }).map((_, i) => (
          <CollapsibleSection
            key={i}
            label={`${t('editor.properties.item')} ${i + 1}`}
            onDelete={count > 1 ? () => deleteItem(i) : undefined}
            deleteTooltip={count > 1 ? t('editor.tree.deleteBlock') : undefined}
            onReset={() => onChange({ [`faq${i + 1}Question`]: defaultQuestion(i + 1), [`faq${i + 1}Answer`]: defaultAnswer(i + 1) })}
            tooltip={resetTooltip}
            noToggle
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label htmlFor={`acc-q-${i}`} className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('editor.properties.question')}</label>
                <FormatButtons id={`acc-q-${i}`} onWrap={(v) => onChange({ [`faq${i + 1}Question`]: v })} />
              </div>
              <Textarea id={`acc-q-${i}`} value={p[`faq${i + 1}Question`] || defaultQuestion(i + 1)} onChange={(e) => onChange({ [`faq${i + 1}Question`]: e.target.value })} rows={2} />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label htmlFor={`acc-a-${i}`} className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('editor.properties.answer')}</label>
                <FormatButtons id={`acc-a-${i}`} onWrap={(v) => onChange({ [`faq${i + 1}Answer`]: v })} />
              </div>
              <Textarea id={`acc-a-${i}`} value={p[`faq${i + 1}Answer`] || defaultAnswer(i + 1)} onChange={(e) => onChange({ [`faq${i + 1}Answer`]: e.target.value })} rows={2} />
            </div>
          </CollapsibleSection>
        ))}
        {count < MAX_ITEMS && (
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => onChange({ faqCount: String(count + 1) })}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {t('editor.properties.addItem')}
          </Button>
        )}
      </CollapsibleSection>

    </div>
  )
}
