import { useTranslation } from 'react-i18next'
import {
  FormField,
  Select,
  Input,
  Textarea,
  ColorSelect,
  FontSizeSelect,
  PaddingSelect,
  InheritSelect,
  CollapsibleSection,
} from '@/components/ui'
import { Button } from '@/components/ui'
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
const DEFAULT_FONT = { fontFamily: '', fontSize: '', fontStyle: '', color: 'fontColor' }
const DEFAULT_DESIGN = { separator: ' | ', align: 'center' }
const DEFAULT_BACKGROUND = { sectionBg: 'backgroundColor' }

export function NavbarProperties({ block, onChange }: Props) {
  const { t } = useTranslation()
  const { settings } = useActiveTemplate()
  const basePx = settings.fontSize ?? 14
  const paddingBasePx = parseInt(settings.padding ?? '4px', 10)
  const p = block.props as Record<string, string>
  const count = Math.min(Math.max(Number(p['linkCount'] ?? 3), 1), 6)
  const resetTooltip = t('editor.properties.resetToDefaults')

  const deleteLink = (i: number) => {
    const newProps: Record<string, unknown> = { linkCount: String(count - 1) }
    for (let j = i; j < count - 1; j++) {
      newProps[`link${j + 1}Text`] = p[`link${j + 2}Text`] ?? ''
      newProps[`link${j + 1}Href`] = p[`link${j + 2}Href`] ?? 'https://...'
    }
    newProps[`link${count}Text`] = ''
    newProps[`link${count}Href`] = 'https://...'
    onChange(newProps)
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
        <FormField label={t('editor.properties.outerPadding')} htmlFor="nav-sectionpadding">
          <PaddingSelect
            id="nav-sectionpadding"
            value={p['outerPadding'] || ''}
            basePx={paddingBasePx}
            onChange={(e) => {
              onChange({ outerPadding: e.target.value })
            }}
          />
        </FormField>

        <FormField label={t('editor.properties.innerPadding')} htmlFor="nav-innerpadding">
          <PaddingSelect
            id="nav-innerpadding"
            value={p['innerPadding'] ?? ''}
            basePx={paddingBasePx}
            onChange={(e) => {
              onChange({ innerPadding: e.target.value })
            }}
          />
        </FormField>

        <FormField label={t('editor.properties.css')} htmlFor="navbar-css">
          <Textarea
            id="navbar-css"
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
        <FormField label={t('editor.properties.borderWidth')} htmlFor="nav-borderwidth">
          <Select
            id="nav-borderwidth"
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

        <FormField label={t('editor.properties.borderStyle')} htmlFor="nav-borderstyle">
          <Select
            id="nav-borderstyle"
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

        <FormField label={t('editor.properties.borderColorFull')} htmlFor="nav-bordercolor">
          <ColorSelect
            id="nav-bordercolor"
            value={String(p['borderColor'] ?? 'borderColor')}
            onChange={(v) => {
              onChange({ borderColor: v || undefined })
            }}
          />
        </FormField>

        <FormField label={t('editor.properties.borderRadius')} htmlFor="nav-borderradius">
          <Select
            id="nav-borderradius"
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
        <FormField label={t('editor.properties.sectionBackground')} htmlFor="nav-sectionbg">
          <ColorSelect
            id="nav-sectionbg"
            value={String(p['sectionBg'] ?? '')}
            onChange={(v) => {
              onChange({ sectionBg: v || undefined })
            }}
          />
        </FormField>
      </CollapsibleSection>

      {/* Schrift */}
      <CollapsibleSection
        label={t('editor.properties.sectionFont')}
        onReset={() => {
          onChange(DEFAULT_FONT)
        }}
        tooltip={resetTooltip}
        defaultOpen={false}
      >
        <FormField label={t('editor.properties.fontFamily')} htmlFor="nav-fontfamily">
          <InheritSelect
            id="nav-fontfamily"
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

        <FormField label={t('editor.properties.fontSize')} htmlFor="nav-fontsize">
          <FontSizeSelect
            id="nav-fontsize"
            value={p['fontSize'] ?? ''}
            basePx={basePx}
            onChange={(e) => {
              onChange({ fontSize: e.target.value })
            }}
          />
        </FormField>

        <FormField label={t('editor.properties.fontStyle')} htmlFor="nav-fontstyle">
          <InheritSelect
            id="nav-fontstyle"
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

        <FormField label={t('editor.properties.fontColorFull')} htmlFor="nav-color">
          <ColorSelect
            id="nav-color"
            value={String(p['color'] ?? '')}
            onChange={(v) => {
              onChange({ color: v || undefined })
            }}
          />
        </FormField>
      </CollapsibleSection>

      {/* Design */}
      <CollapsibleSection
        label={t('editor.properties.sectionDesign')}
        onReset={() => {
          onChange(DEFAULT_DESIGN)
        }}
        tooltip={resetTooltip}
        defaultOpen={false}
      >
        <FormField label={t('editor.properties.separator')} htmlFor="nav-separator">
          <Select
            id="nav-separator"
            value={p['separator'] ?? ' | '}
            onChange={(e) => {
              onChange({ separator: e.target.value })
            }}
          >
            <option value="  "> {t('editor.properties.separatorSpace')}</option>
            <option value=" | "> | </option>
            <option value=" · "> · </option>
            <option value=" – "> – </option>
          </Select>
        </FormField>

        <FormField label={t('editor.properties.horizontalAlign')} htmlFor="nav-align">
          <Select
            id="nav-align"
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
        {Array.from({ length: count }).map((_, i) => (
          <CollapsibleSection
            key={i}
            label={t('editor.properties.linkNumber', { n: i + 1 })}
            onDelete={
              count > 1
                ? () => {
                    deleteLink(i)
                  }
                : undefined
            }
            deleteTooltip={count > 1 ? t('editor.tree.deleteBlock') : undefined}
            onReset={() => {
              onChange({ [`link${i + 1}Text`]: '', [`link${i + 1}Href`]: 'https://...' })
            }}
            tooltip={resetTooltip}
            noToggle
          >
            <FormField label={t('editor.properties.linkText')} htmlFor={`nav-link${i + 1}-text`}>
              <Input
                id={`nav-link${i + 1}-text`}
                type="text"
                value={p[`link${i + 1}Text`] ?? ''}
                onChange={(e) => {
                  onChange({ [`link${i + 1}Text`]: e.target.value })
                }}
              />
            </FormField>
            <FormField label={t('editor.properties.url')} htmlFor={`nav-link${i + 1}-href`}>
              <Input
                id={`nav-link${i + 1}-href`}
                type="url"
                value={p[`link${i + 1}Href`] ?? 'https://...'}
                onChange={(e) => {
                  onChange({ [`link${i + 1}Href`]: e.target.value })
                }}
              />
            </FormField>
          </CollapsibleSection>
        ))}
        {count < 6 && (
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => {
              onChange({ linkCount: String(count + 1) })
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {t('editor.properties.addLink')}
          </Button>
        )}
      </CollapsibleSection>
    </div>
  )
}
