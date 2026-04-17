import { useTranslation } from 'react-i18next'
import {
  FormField,
  Input,
  Select,
  Textarea,
  ColorSelect,
  FontSizeSelect,
  PaddingSelect,
  InheritSelect,
  CollapsibleSection,
} from '@/components/ui'
import { useActiveTemplate } from '@/store'
import type { EmailBlock } from '@/types'

interface Props {
  block: EmailBlock
  onChange: (props: Partial<Record<string, unknown>>) => void
}

const DEFAULT_GENERAL = { outerPadding: '', innerPadding: '+4', css: '' }
const DEFAULT_BORDER = {
  borderWidth: '',
  borderStyle: '',
  borderColor: 'borderColor',
  borderRadius: '',
}
const DEFAULT_DESIGN = { align: 'center' }
const DEFAULT_CONTENT = { targetDate: '', showSeconds: 'true' }
const DEFAULT_BACKGROUND = { sectionBg: 'backgroundColor' }
const DEFAULT_FONT_COUNTER = {
  fontFamily: '',
  fontSize: '+18',
  fontStyle: 'bold',
  textColor: 'backgroundColor',
}
const DEFAULT_FONT_LABEL = {
  labelFontFamily: '',
  labelFontSize: '-2',
  labelFontStyle: '',
  labelColor: 'fontColor',
}
const DEFAULT_NUMBERS = { bgColor: 'primaryColor' }
export function CountdownProperties({ block, onChange }: Props) {
  const { t } = useTranslation()
  const { settings } = useActiveTemplate()
  const basePx = settings.fontSize ?? 14
  const paddingBasePx = parseInt(settings.padding ?? '4px', 10)
  const p = block.props as Record<string, string>
  const resetTooltip = t('editor.properties.resetToDefaults')
  const defaultLabels = {
    labelDays: t('editor.properties.countdownDays'),
    labelHours: t('editor.properties.countdownHours'),
    labelMinutes: t('editor.properties.countdownMinutes'),
    labelSeconds: t('editor.properties.countdownSeconds'),
  }

  const toLocalInput = (iso: string) => {
    if (!iso) return ''
    try {
      const d = new Date(iso)
      const pad = (n: number) => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
    } catch {
      return ''
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {/* General */}
      <CollapsibleSection
        label={t('editor.properties.sectionGeneral')}
        onReset={() => {
          onChange(DEFAULT_GENERAL)
        }}
        tooltip={resetTooltip}
        defaultOpen={false}
      >
        <FormField label={t('editor.properties.outerPadding')} htmlFor="cd-sectionpadding">
          <PaddingSelect
            id="cd-sectionpadding"
            value={p['outerPadding'] || ''}
            basePx={paddingBasePx}
            onChange={(e) => {
              onChange({ outerPadding: e.target.value })
            }}
          />
        </FormField>

        <FormField label={t('editor.properties.innerPadding')} htmlFor="cd-innerpadding">
          <PaddingSelect
            id="cd-innerpadding"
            value={p['innerPadding'] ?? ''}
            basePx={paddingBasePx}
            onChange={(e) => {
              onChange({ innerPadding: e.target.value })
            }}
          />
        </FormField>

        <FormField label={t('editor.properties.css')} htmlFor="countdown-css">
          <Textarea
            id="countdown-css"
            value={p['css'] ?? ''}
            onChange={(e) => {
              onChange({ css: e.target.value })
            }}
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
        onReset={() => {
          onChange(DEFAULT_BORDER)
        }}
        tooltip={resetTooltip}
        defaultOpen={false}
      >
        <FormField label={t('editor.properties.borderWidth')} htmlFor="cd-borderwidth">
          <Select
            id="cd-borderwidth"
            value={p['borderWidth'] || settings.defaultBorderWidth || '1px'}
            onChange={(e) => {
              onChange({ borderWidth: e.target.value })
            }}
          >
            {(['0px', '1px', '2px', '3px', '4px'] as const).map((v) => {
              const isGlobal = (settings.defaultBorderWidth || '1px') === v
              const label = isGlobal ? `${t('common.global')} (${v})` : v
              return (
                <option key={v} value={v}>
                  {label}
                </option>
              )
            })}
          </Select>
        </FormField>

        <FormField label={t('editor.properties.borderStyle')} htmlFor="cd-borderstyle">
          <Select
            id="cd-borderstyle"
            value={p['borderStyle'] || settings.defaultBorderStyle || 'solid'}
            onChange={(e) => {
              onChange({ borderStyle: e.target.value })
            }}
          >
            {(['solid', 'dashed', 'dotted'] as const).map((v) => {
              const isGlobal = (settings.defaultBorderStyle || 'solid') === v
              const label = isGlobal
                ? `${t('common.global')} (${t(`editor.properties.borderStyle${v.charAt(0).toUpperCase() + v.slice(1)}`)})`
                : t(`editor.properties.borderStyle${v.charAt(0).toUpperCase() + v.slice(1)}`)
              return (
                <option key={v} value={v}>
                  {label}
                </option>
              )
            })}
          </Select>
        </FormField>

        <FormField label={t('editor.properties.borderColorFull')} htmlFor="cd-bordercolor">
          <ColorSelect
            id="cd-bordercolor"
            value={String(p['borderColor'] ?? 'borderColor')}
            onChange={(v) => {
              onChange({ borderColor: v || undefined })
            }}
          />
        </FormField>

        <FormField label={t('editor.properties.borderRadius')} htmlFor="cd-borderradius">
          <Select
            id="cd-borderradius"
            value={p['borderRadius'] || settings.defaultBorderRadius || '0px'}
            onChange={(e) => {
              onChange({ borderRadius: e.target.value })
            }}
          >
            {(['0px', '2px', '4px', '6px', '8px', '10px', '12px', '9999px'] as const).map((v) => {
              const isGlobal = (settings.defaultBorderRadius || '0px') === v
              const label = isGlobal ? `${t('common.global')} (${v})` : v
              return (
                <option key={v} value={v}>
                  {label}
                </option>
              )
            })}
          </Select>
        </FormField>
      </CollapsibleSection>

      {/* Hintergrund */}
      <CollapsibleSection
        label={t('editor.properties.sectionBg')}
        onReset={() => {
          onChange(DEFAULT_BACKGROUND)
        }}
        tooltip={resetTooltip}
        defaultOpen={false}
      >
        <FormField label={t('editor.properties.sectionBackground')} htmlFor="cd-sectionbg">
          <ColorSelect
            id="cd-sectionbg"
            value={String(p['sectionBg'] ?? '')}
            onChange={(v) => {
              onChange({ sectionBg: v || undefined })
            }}
          />
        </FormField>
      </CollapsibleSection>

      {/* Schrift */}
      <CollapsibleSection label={t('editor.properties.sectionFont')} defaultOpen={false}>
        <CollapsibleSection
          label={t('editor.properties.countdownCounter')}
          onReset={() => {
            onChange(DEFAULT_FONT_COUNTER)
          }}
          tooltip={resetTooltip}
          noToggle
        >
          <FormField label={t('editor.properties.fontFamily')} htmlFor="cd-fontfamily">
            <InheritSelect
              id="cd-fontfamily"
              value={p['fontFamily'] ?? ''}
              onChange={(e) => {
                onChange({ fontFamily: e.target.value })
              }}
            >
              <option value="Arial, sans-serif">Arial</option>
              <option value="'Helvetica Neue', Helvetica, sans-serif">Helvetica</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="'Times New Roman', serif">Times New Roman</option>
              <option value="'Courier New', monospace">Courier New</option>
              <option value="Verdana, sans-serif">Verdana</option>
            </InheritSelect>
          </FormField>

          <FormField label={t('editor.properties.fontSize')} htmlFor="cd-fontsize">
            <FontSizeSelect
              id="cd-fontsize"
              value={p['fontSize'] ?? ''}
              basePx={basePx}
              maxPx={40}
              onChange={(e) => {
                onChange({ fontSize: e.target.value })
              }}
            />
          </FormField>

          <FormField label={t('editor.properties.fontStyle')} htmlFor="cd-fontstyle">
            <InheritSelect
              id="cd-fontstyle"
              value={p['fontStyle'] ?? ''}
              onChange={(e) => {
                onChange({ fontStyle: e.target.value })
              }}
            >
              <option value="normal">{t('editor.properties.normal')}</option>
              <option value="bold">{t('editor.properties.bold')}</option>
              <option value="italic">{t('editor.properties.italic')}</option>
            </InheritSelect>
          </FormField>

          <FormField label={t('editor.properties.fontColorFull')} htmlFor="cd-text">
            <ColorSelect
              id="cd-text"
              value={String(p['textColor'] ?? '')}
              onChange={(v) => {
                onChange({ textColor: v || undefined })
              }}
            />
          </FormField>
        </CollapsibleSection>

        <CollapsibleSection
          label={t('editor.properties.sectionLabels')}
          onReset={() => {
            onChange(DEFAULT_FONT_LABEL)
          }}
          tooltip={resetTooltip}
          noToggle
        >
          <FormField label={t('editor.properties.fontFamily')} htmlFor="cd-labelfontfamily">
            <InheritSelect
              id="cd-labelfontfamily"
              value={p['labelFontFamily'] ?? ''}
              onChange={(e) => {
                onChange({ labelFontFamily: e.target.value })
              }}
            >
              <option value="Arial, sans-serif">Arial</option>
              <option value="'Helvetica Neue', Helvetica, sans-serif">Helvetica</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="'Times New Roman', serif">Times New Roman</option>
              <option value="'Courier New', monospace">Courier New</option>
              <option value="Verdana, sans-serif">Verdana</option>
            </InheritSelect>
          </FormField>

          <FormField label={t('editor.properties.fontSize')} htmlFor="cd-labelfontsize">
            <FontSizeSelect
              id="cd-labelfontsize"
              value={p['labelFontSize'] ?? ''}
              basePx={basePx}
              onChange={(e) => {
                onChange({ labelFontSize: e.target.value })
              }}
            />
          </FormField>

          <FormField label={t('editor.properties.fontStyle')} htmlFor="cd-labelfontstyle">
            <InheritSelect
              id="cd-labelfontstyle"
              value={p['labelFontStyle'] ?? ''}
              onChange={(e) => {
                onChange({ labelFontStyle: e.target.value })
              }}
            >
              <option value="normal">{t('editor.properties.normal')}</option>
              <option value="bold">{t('editor.properties.bold')}</option>
              <option value="italic">{t('editor.properties.italic')}</option>
            </InheritSelect>
          </FormField>

          <FormField label={t('editor.properties.fontColorFull')} htmlFor="cd-label">
            <ColorSelect
              id="cd-label"
              value={String(p['labelColor'] ?? '')}
              onChange={(v) => {
                onChange({ labelColor: v || undefined })
              }}
            />
          </FormField>
        </CollapsibleSection>
      </CollapsibleSection>

      {/* Gestaltung */}
      <CollapsibleSection
        label={t('editor.properties.sectionDesign')}
        onReset={() => {
          onChange(DEFAULT_DESIGN)
        }}
        tooltip={resetTooltip}
        defaultOpen={false}
      >
        <FormField label={t('editor.properties.align')} htmlFor="cd-align">
          <Select
            id="cd-align"
            value={p['align'] ?? 'center'}
            onChange={(e) => {
              onChange({ align: e.target.value })
            }}
          >
            <option value="left">{t('editor.properties.left')}</option>
            <option value="center">{t('editor.properties.center')}</option>
            <option value="right">{t('editor.properties.right')}</option>
          </Select>
        </FormField>
      </CollapsibleSection>

      {/* Inhalt */}
      <CollapsibleSection label={t('editor.properties.sectionContent')}>
        <CollapsibleSection
          label={t('editor.properties.countdownCounter')}
          onReset={() => {
            onChange({ ...DEFAULT_NUMBERS, ...DEFAULT_CONTENT })
          }}
          tooltip={resetTooltip}
          noToggle
        >
          <FormField label={t('editor.properties.targetDate')} htmlFor="cd-date">
            <Input
              id="cd-date"
              type="datetime-local"
              value={toLocalInput(p['targetDate'] ?? '')}
              onChange={(e) => {
                onChange({
                  targetDate: e.target.value ? new Date(e.target.value).toISOString() : '',
                })
              }}
            />
          </FormField>

          <label htmlFor="cd-showseconds" className="flex cursor-pointer items-center gap-2">
            <input
              id="cd-showseconds"
              type="checkbox"
              checked={(p['showSeconds'] ?? 'true') === 'true'}
              onChange={(e) => {
                onChange({ showSeconds: e.target.checked ? 'true' : 'false' })
              }}
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600"
            />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {t('editor.properties.showSeconds')}
            </span>
          </label>

          <FormField label={t('editor.properties.backgroundColorFull')} htmlFor="cd-bg">
            <ColorSelect
              id="cd-bg"
              value={String(p['bgColor'] ?? 'primaryColor')}
              onChange={(v) => {
                onChange({ bgColor: v })
              }}
            />
          </FormField>
        </CollapsibleSection>

        <CollapsibleSection
          label={t('editor.properties.sectionLabels')}
          onReset={() => {
            onChange(defaultLabels)
          }}
          tooltip={resetTooltip}
          noToggle
        >
          <FormField label={t('editor.properties.labelDays')} htmlFor="cd-days">
            <Input
              id="cd-days"
              type="text"
              value={p['labelDays'] ?? t('editor.properties.countdownDays')}
              onChange={(e) => {
                onChange({ labelDays: e.target.value })
              }}
            />
          </FormField>

          <FormField label={t('editor.properties.labelHours')} htmlFor="cd-hours">
            <Input
              id="cd-hours"
              type="text"
              value={p['labelHours'] ?? t('editor.properties.countdownHours')}
              onChange={(e) => {
                onChange({ labelHours: e.target.value })
              }}
            />
          </FormField>

          <FormField label={t('editor.properties.labelMinutes')} htmlFor="cd-minutes">
            <Input
              id="cd-minutes"
              type="text"
              value={p['labelMinutes'] ?? t('editor.properties.countdownMinutes')}
              onChange={(e) => {
                onChange({ labelMinutes: e.target.value })
              }}
            />
          </FormField>

          <FormField label={t('editor.properties.labelSeconds')} htmlFor="cd-seconds">
            <Input
              id="cd-seconds"
              type="text"
              value={p['labelSeconds'] ?? t('editor.properties.countdownSeconds')}
              onChange={(e) => {
                onChange({ labelSeconds: e.target.value })
              }}
            />
          </FormField>
        </CollapsibleSection>
      </CollapsibleSection>
    </div>
  )
}
