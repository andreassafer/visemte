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
  FormatButtons,
} from '@/components/ui'
import { useActiveTemplate } from '@/store'
import type { EmailBlock } from '@/types'

interface Props {
  block: EmailBlock
  onChange: (props: Partial<Record<string, unknown>>) => void
}

const DEFAULT_GENERAL = { css: '', outerPadding: '', innerPadding: '+4' }
const DEFAULT_BORDER = {
  borderWidth: '',
  borderStyle: '',
  borderColor: 'borderColor',
  borderRadius: '',
}
const DEFAULT_BACKGROUND = { sectionBg: 'backgroundColor' }
const DEFAULT_FONT_QUOTE = {
  fontFamily: '',
  fontSize: '',
  fontStyle: 'italic',
  textColor: 'fontColor',
}
const DEFAULT_FONT_AUTHOR = {
  authorFontFamily: '',
  authorFontSize: '',
  authorFontStyle: '',
  authorColor: 'fontColor',
}
const DEFAULT_QUOTE_STATIC = { text: '' }
const DEFAULT_AUTHOR_STATIC = { authorPrefix: '—', author: '' }
const DEFAULT_DESIGN = { align: 'left' }
const DEFAULT_QUOTE_SIGN = { quoteStyle: 'quotes', accentColor: 'primaryColor' }

export function QuoteProperties({ block, onChange }: Props) {
  const { t } = useTranslation()
  const { settings } = useActiveTemplate()
  const basePx = settings.fontSize ?? 14
  const paddingBasePx = parseInt(settings.padding ?? '4px', 10)
  const p = block.props as Record<string, string>
  const resetTooltip = t('editor.properties.resetToDefaults')

  return (
    <div className="flex flex-col gap-2">
      {/* Allgemeines */}
      <CollapsibleSection
        label={t('editor.properties.general')}
        onReset={() => {
          onChange(DEFAULT_GENERAL)
        }}
        tooltip={resetTooltip}
        defaultOpen={false}
      >
        <FormField label={t('editor.properties.outerPadding')} htmlFor="qt-sectionpadding-gen">
          <PaddingSelect
            id="qt-sectionpadding-gen"
            value={p['outerPadding'] || ''}
            basePx={paddingBasePx}
            onChange={(e) => {
              onChange({ outerPadding: e.target.value })
            }}
          />
        </FormField>

        <FormField label={t('editor.properties.innerPadding')} htmlFor="qt-innerpadding">
          <PaddingSelect
            id="qt-innerpadding"
            value={p['innerPadding'] ?? ''}
            basePx={paddingBasePx}
            onChange={(e) => {
              onChange({ innerPadding: e.target.value })
            }}
          />
        </FormField>

        <FormField label={t('editor.properties.css')} htmlFor="quote-css">
          <Textarea
            id="quote-css"
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
        <FormField label={t('editor.properties.borderWidth')} htmlFor="qt-borderwidth">
          <Select
            id="qt-borderwidth"
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

        <FormField label={t('editor.properties.borderStyle')} htmlFor="qt-borderstyle">
          <Select
            id="qt-borderstyle"
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

        <FormField label={t('editor.properties.borderColorFull')} htmlFor="qt-bordercolor">
          <ColorSelect
            id="qt-bordercolor"
            value={String(p['borderColor'] ?? 'borderColor')}
            onChange={(v) => {
              onChange({ borderColor: v || undefined })
            }}
          />
        </FormField>

        <FormField label={t('editor.properties.borderRadius')} htmlFor="qt-borderradius">
          <Select
            id="qt-borderradius"
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
        <FormField label={t('editor.properties.sectionBackground')} htmlFor="qt-sectionbg-gen">
          <ColorSelect
            id="qt-sectionbg-gen"
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
          label={t('editor.blocks.quote')}
          onReset={() => {
            onChange(DEFAULT_FONT_QUOTE)
          }}
          tooltip={resetTooltip}
          noToggle
        >
          <FormField label={t('editor.properties.fontFamily')} htmlFor="qt-fontfamily">
            <InheritSelect
              id="qt-fontfamily"
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

          <FormField label={t('editor.properties.fontSize')} htmlFor="qt-fontsize">
            <FontSizeSelect
              id="qt-fontsize"
              value={p['fontSize'] ?? ''}
              basePx={basePx}
              onChange={(e) => {
                onChange({ fontSize: e.target.value })
              }}
            />
          </FormField>

          <FormField label={t('editor.properties.fontStyle')} htmlFor="qt-fontstyle">
            <InheritSelect
              id="qt-fontstyle"
              value={p['fontStyle'] ?? 'italic'}
              onChange={(e) => {
                onChange({ fontStyle: e.target.value })
              }}
            >
              <option value="normal">{t('editor.properties.normal')}</option>
              <option value="bold">{t('editor.properties.bold')}</option>
              <option value="italic">{t('editor.properties.italic')}</option>
            </InheritSelect>
          </FormField>

          <FormField label={t('editor.properties.fontColorFull')} htmlFor="qt-textcolor">
            <ColorSelect
              id="qt-textcolor"
              value={String(p['textColor'] ?? 'fontColor')}
              onChange={(v) => {
                onChange({ textColor: v })
              }}
            />
          </FormField>
        </CollapsibleSection>

        <CollapsibleSection
          label={t('editor.properties.sectionAuthor')}
          onReset={() => {
            onChange(DEFAULT_FONT_AUTHOR)
          }}
          tooltip={resetTooltip}
          noToggle
        >
          <FormField label={t('editor.properties.fontFamily')} htmlFor="qt-authorfontfamily">
            <InheritSelect
              id="qt-authorfontfamily"
              value={p['authorFontFamily'] ?? ''}
              onChange={(e) => {
                onChange({ authorFontFamily: e.target.value })
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

          <FormField label={t('editor.properties.fontSize')} htmlFor="qt-authorfontsize">
            <FontSizeSelect
              id="qt-authorfontsize"
              value={p['authorFontSize'] ?? ''}
              basePx={basePx}
              onChange={(e) => {
                onChange({ authorFontSize: e.target.value })
              }}
            />
          </FormField>

          <FormField label={t('editor.properties.fontStyle')} htmlFor="qt-authorfontstyle">
            <InheritSelect
              id="qt-authorfontstyle"
              value={p['authorFontStyle'] ?? ''}
              onChange={(e) => {
                onChange({ authorFontStyle: e.target.value })
              }}
            >
              <option value="normal">{t('editor.properties.normal')}</option>
              <option value="bold">{t('editor.properties.bold')}</option>
              <option value="italic">{t('editor.properties.italic')}</option>
            </InheritSelect>
          </FormField>

          <FormField label={t('editor.properties.fontColorFull')} htmlFor="qt-authorcolor">
            <ColorSelect
              id="qt-authorcolor"
              value={String(p['authorColor'] ?? '')}
              onChange={(v) => {
                onChange({ authorColor: v || undefined })
              }}
            />
          </FormField>
        </CollapsibleSection>
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
        <FormField label={t('editor.properties.align')} htmlFor="qt-align">
          <Select
            id="qt-align"
            value={p['align'] ?? 'left'}
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

      {/* Zitat */}
      <CollapsibleSection label={t('editor.properties.sectionContent')}>
        {/* Zitatszeichen */}
        <CollapsibleSection
          label={t('editor.properties.quoteSign')}
          onReset={() => {
            onChange(DEFAULT_QUOTE_SIGN)
          }}
          tooltip={resetTooltip}
          noToggle
        >
          <FormField label={t('editor.properties.quoteStyle')} htmlFor="qt-quotestyle">
            <Select
              id="qt-quotestyle"
              value={p['quoteStyle'] ?? 'quotes'}
              onChange={(e) => {
                onChange({ quoteStyle: e.target.value })
              }}
            >
              <option value="quotes">{t('editor.properties.quoteStyleQuotes')}</option>
              <option value="none">{t('editor.properties.quoteStyleNone')}</option>
            </Select>
          </FormField>

          <FormField label={t('editor.properties.quoteSignColor')} htmlFor="qt-accent">
            <ColorSelect
              id="qt-accent"
              value={String(p['accentColor'] ?? 'primaryColor')}
              onChange={(v) => {
                onChange({ accentColor: v })
              }}
            />
          </FormField>
        </CollapsibleSection>

        {/* Zitat */}
        <CollapsibleSection
          label={t('editor.blocks.quote')}
          onReset={() => {
            onChange({ ...DEFAULT_QUOTE_STATIC, text: t('editor.properties.quotePlaceholder') })
          }}
          tooltip={resetTooltip}
          noToggle
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label
                htmlFor="qt-text"
                className="text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {t('editor.properties.quoteText')}
              </label>
              <FormatButtons
                id="qt-text"
                onWrap={(v) => {
                  onChange({ text: v })
                }}
              />
            </div>
            <Textarea
              id="qt-text"
              value={p['text'] ?? ''}
              onChange={(e) => {
                onChange({ text: e.target.value })
              }}
              rows={2}
            />
          </div>
        </CollapsibleSection>

        {/* Autor */}
        <CollapsibleSection
          label={t('editor.properties.sectionAuthor')}
          onReset={() => {
            onChange({ ...DEFAULT_AUTHOR_STATIC, author: t('editor.properties.authorPlaceholder') })
          }}
          tooltip={resetTooltip}
          noToggle
        >
          <FormField label={t('editor.properties.authorPrefix')} htmlFor="qt-authorprefix">
            <Select
              id="qt-authorprefix"
              value={p['authorPrefix'] ?? '—'}
              onChange={(e) => {
                onChange({ authorPrefix: e.target.value })
              }}
            >
              <option value="—">— ({t('editor.properties.authorPrefixEmDash')})</option>
              <option value="–">– ({t('editor.properties.authorPrefixEnDash')})</option>
              <option value="~">~ ({t('editor.properties.authorPrefixTilde')})</option>
            </Select>
          </FormField>

          <FormField label={t('editor.properties.author')} htmlFor="qt-author">
            <Input
              id="qt-author"
              type="text"
              value={p['author'] ?? ''}
              onChange={(e) => {
                onChange({ author: e.target.value })
              }}
            />
          </FormField>
        </CollapsibleSection>
      </CollapsibleSection>
    </div>
  )
}
