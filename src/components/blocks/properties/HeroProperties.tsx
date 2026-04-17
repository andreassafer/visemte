import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FormField,
  Input,
  Select,
  InheritSelect,
  Textarea,
  ColorSelect,
  FontSizeSelect,
  PaddingSelect,
  CollapsibleSection,
  FormatButtons,
} from '@/components/ui'
import { Button } from '@/components/ui'
import { compressAndConvert } from '@/utils'
import { useActiveTemplate } from '@/store'
import type { EmailBlock } from '@/types'

interface Props {
  block: EmailBlock
  onChange: (props: Partial<Record<string, unknown>>) => void
}

const DEFAULT_GENERAL = { outerPadding: '', innerPadding: '+4', css: '' }
const DEFAULT_BORDER = {
  secBorderRadius: '',
  secBorderWidth: '',
  secBorderStyle: '',
  secBorderColor: 'borderColor',
}
const DEFAULT_DESIGN = { height: '200px', textAlign: 'center', verticalAlign: 'middle' }
const DEFAULT_BACKGROUND_IMG = { src: '', backgroundPosition: 'center center' }
const DEFAULT_BACKGROUND = { sectionBg: 'backgroundColor' }
const DEFAULT_LINE1_CONTENT = { line1Text: '' }
const DEFAULT_LINE2_CONTENT = { line2Text: '' }
const DEFAULT_LINE1_FONT = {
  line1FontFamily: '',
  line1FontSize: '+18',
  line1FontStyle: '',
  line1Color: 'fontColor',
}
const DEFAULT_LINE2_FONT = {
  line2FontFamily: '',
  line2FontSize: '+4',
  line2FontStyle: '',
  line2Color: 'fontColor',
}

export function HeroProperties({ block, onChange }: Props) {
  const { t } = useTranslation()
  const { settings } = useActiveTemplate()
  const basePx = settings.fontSize ?? 14
  const paddingBasePx = parseInt(settings.padding ?? '4px', 10)
  const p = block.props as Record<string, string>
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const resetTooltip = t('editor.properties.resetToDefaults')

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      const base64 = await compressAndConvert(file)
      onChange({ src: base64 })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {/* General */}
      <CollapsibleSection
        label={t('editor.properties.heroGeneral')}
        onReset={() => {
          onChange(DEFAULT_GENERAL)
        }}
        tooltip={resetTooltip}
        defaultOpen={false}
      >
        <FormField label={t('editor.properties.outerPadding')} htmlFor="hero-sectionpadding">
          <PaddingSelect
            id="hero-sectionpadding"
            value={p['outerPadding'] || ''}
            basePx={paddingBasePx}
            onChange={(e) => {
              onChange({ outerPadding: e.target.value })
            }}
          />
        </FormField>

        <FormField label={t('editor.properties.innerPadding')} htmlFor="hero-innerpadding">
          <PaddingSelect
            id="hero-innerpadding"
            value={p['innerPadding'] ?? ''}
            basePx={paddingBasePx}
            onChange={(e) => {
              onChange({ innerPadding: e.target.value })
            }}
          />
        </FormField>

        <FormField label={t('editor.properties.css')} htmlFor="hero-css">
          <Textarea
            id="hero-css"
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
        <FormField label={t('editor.properties.borderWidth')} htmlFor="hero-borderwidth">
          <Select
            id="hero-borderwidth"
            value={p['secBorderWidth'] || settings.defaultBorderWidth || '1px'}
            onChange={(e) => {
              onChange({ secBorderWidth: e.target.value })
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

        <FormField label={t('editor.properties.borderStyle')} htmlFor="hero-borderstyle">
          <Select
            id="hero-borderstyle"
            value={p['secBorderStyle'] || settings.defaultBorderStyle || 'solid'}
            onChange={(e) => {
              onChange({ secBorderStyle: e.target.value })
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

        <FormField label={t('editor.properties.borderColorFull')} htmlFor="hero-bordercolor">
          <ColorSelect
            id="hero-bordercolor"
            value={String(p['secBorderColor'] ?? 'borderColor')}
            onChange={(v) => {
              onChange({ secBorderColor: v || undefined })
            }}
          />
        </FormField>

        <FormField label={t('editor.properties.borderRadius')} htmlFor="hero-sec-borderradius">
          <Select
            id="hero-sec-borderradius"
            value={p['secBorderRadius'] || settings.defaultBorderRadius || '0px'}
            onChange={(e) => {
              onChange({ secBorderRadius: e.target.value })
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
        <FormField label={t('editor.properties.sectionBackground')} htmlFor="hero-sectionbg">
          <ColorSelect
            id="hero-sectionbg"
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
          label={t('editor.properties.heroLine1')}
          onReset={() => {
            onChange(DEFAULT_LINE1_FONT)
          }}
          tooltip={resetTooltip}
          noToggle
        >
          <FormField label={t('editor.properties.fontFamily')} htmlFor="hero-line1-font">
            <InheritSelect
              id="hero-line1-font"
              value={p['line1FontFamily'] ?? ''}
              onChange={(e) => {
                onChange({ line1FontFamily: e.target.value })
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

          <FormField label={t('editor.properties.fontSize')} htmlFor="hero-line1-size">
            <FontSizeSelect
              id="hero-line1-size"
              value={p['line1FontSize'] ?? ''}
              basePx={basePx}
              maxPx={40}
              onChange={(e) => {
                onChange({ line1FontSize: e.target.value })
              }}
            />
          </FormField>

          <FormField label={t('editor.properties.fontStyle')} htmlFor="hero-line1-fontstyle">
            <InheritSelect
              id="hero-line1-fontstyle"
              value={p['line1FontStyle'] ?? ''}
              onChange={(e) => {
                onChange({ line1FontStyle: e.target.value })
              }}
            >
              <option value="normal">{t('editor.properties.normal')}</option>
              <option value="bold">{t('editor.properties.bold')}</option>
              <option value="italic">{t('editor.properties.italic')}</option>
            </InheritSelect>
          </FormField>

          <FormField label={t('editor.properties.fontColorFull')} htmlFor="hero-line1-color">
            <ColorSelect
              id="hero-line1-color"
              value={String(p['line1Color'] ?? '')}
              onChange={(v) => {
                onChange({ line1Color: v || undefined })
              }}
            />
          </FormField>
        </CollapsibleSection>

        <CollapsibleSection
          label={t('editor.properties.heroLine2')}
          onReset={() => {
            onChange(DEFAULT_LINE2_FONT)
          }}
          tooltip={resetTooltip}
          noToggle
        >
          <FormField label={t('editor.properties.fontFamily')} htmlFor="hero-line2-font">
            <InheritSelect
              id="hero-line2-font"
              value={p['line2FontFamily'] ?? ''}
              onChange={(e) => {
                onChange({ line2FontFamily: e.target.value })
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

          <FormField label={t('editor.properties.fontSize')} htmlFor="hero-line2-size">
            <FontSizeSelect
              id="hero-line2-size"
              value={p['line2FontSize'] ?? ''}
              basePx={basePx}
              onChange={(e) => {
                onChange({ line2FontSize: e.target.value })
              }}
            />
          </FormField>

          <FormField label={t('editor.properties.fontStyle')} htmlFor="hero-line2-fontstyle">
            <InheritSelect
              id="hero-line2-fontstyle"
              value={p['line2FontStyle'] ?? ''}
              onChange={(e) => {
                onChange({ line2FontStyle: e.target.value })
              }}
            >
              <option value="normal">{t('editor.properties.normal')}</option>
              <option value="bold">{t('editor.properties.bold')}</option>
              <option value="italic">{t('editor.properties.italic')}</option>
            </InheritSelect>
          </FormField>

          <FormField label={t('editor.properties.fontColorFull')} htmlFor="hero-line2-color">
            <ColorSelect
              id="hero-line2-color"
              value={String(p['line2Color'] ?? '')}
              onChange={(v) => {
                onChange({ line2Color: v || undefined })
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
        <FormField label={t('editor.properties.height')} htmlFor="hero-height">
          <Select
            id="hero-height"
            value={p['height'] ?? '200px'}
            onChange={(e) => {
              onChange({ height: e.target.value })
            }}
          >
            {['100px', '150px', '200px', '250px', '300px'].map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label={t('editor.properties.horizontalAlign')} htmlFor="hero-align">
          <Select
            id="hero-align"
            value={p['textAlign'] ?? 'center'}
            onChange={(e) => {
              onChange({ textAlign: e.target.value })
            }}
          >
            <option value="left">{t('editor.properties.left')}</option>
            <option value="center">{t('editor.properties.center')}</option>
            <option value="right">{t('editor.properties.right')}</option>
          </Select>
        </FormField>

        <FormField label={t('editor.properties.verticalAlign')} htmlFor="hero-valign">
          <Select
            id="hero-valign"
            value={p['verticalAlign'] ?? 'middle'}
            onChange={(e) => {
              onChange({ verticalAlign: e.target.value })
            }}
          >
            <option value="top">{t('editor.properties.top')}</option>
            <option value="middle">{t('editor.properties.center')}</option>
            <option value="bottom">{t('editor.properties.bottom')}</option>
          </Select>
        </FormField>
      </CollapsibleSection>

      {/* Inhalt */}
      <CollapsibleSection label={t('editor.properties.sectionContent')}>
        <CollapsibleSection
          label={t('editor.properties.backgroundImage')}
          noToggle
          onReset={() => {
            onChange(DEFAULT_BACKGROUND_IMG)
          }}
          tooltip={resetTooltip}
        >
          <FormField label={t('editor.properties.src')} htmlFor="hero-src">
            <Input
              id="hero-src"
              type="text"
              value={p['src'] ?? ''}
              onChange={(e) => {
                onChange({ src: e.target.value })
              }}
              placeholder="https://..."
            />
          </FormField>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) void handleFileUpload(file)
              }}
            />
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
              {uploading ? t('editor.properties.uploading') : t('editor.properties.uploadImage')}
            </Button>
          </div>

          <FormField label={t('editor.properties.backgroundPosition')} htmlFor="hero-bgpos">
            <Select
              id="hero-bgpos"
              value={p['backgroundPosition'] ?? 'center center'}
              onChange={(e) => {
                onChange({ backgroundPosition: e.target.value })
              }}
            >
              <option value="center center">{t('editor.properties.center')}</option>
              <option value="top center">{t('editor.properties.top')}</option>
              <option value="bottom center">{t('editor.properties.bottom')}</option>
              <option value="center left">{t('editor.properties.left')}</option>
              <option value="center right">{t('editor.properties.right')}</option>
            </Select>
          </FormField>
        </CollapsibleSection>

        {/* Line 1 */}
        <CollapsibleSection
          label={t('editor.properties.heroLine1')}
          noToggle
          onReset={() => {
            onChange({
              ...DEFAULT_LINE1_CONTENT,
              line1Text: t('editor.properties.heroHeadlinePlaceholder'),
            })
          }}
          tooltip={resetTooltip}
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label
                htmlFor="hero-line1-text"
                className="text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {t('editor.properties.headline')}
              </label>
              <FormatButtons
                id="hero-line1-text"
                onWrap={(v) => {
                  onChange({ line1Text: v })
                }}
              />
            </div>
            <Textarea
              id="hero-line1-text"
              value={p['line1Text'] ?? ''}
              onChange={(e) => {
                onChange({ line1Text: e.target.value })
              }}
              rows={2}
            />
          </div>
        </CollapsibleSection>

        {/* Line 2 */}
        <CollapsibleSection
          label={t('editor.properties.heroLine2')}
          noToggle
          onReset={() => {
            onChange({
              ...DEFAULT_LINE2_CONTENT,
              line2Text: t('editor.properties.heroSubheadlinePlaceholder'),
            })
          }}
          tooltip={resetTooltip}
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label
                htmlFor="hero-line2-text"
                className="text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {t('editor.properties.subheadline')}
              </label>
              <FormatButtons
                id="hero-line2-text"
                onWrap={(v) => {
                  onChange({ line2Text: v })
                }}
              />
            </div>
            <Textarea
              id="hero-line2-text"
              value={p['line2Text'] ?? ''}
              onChange={(e) => {
                onChange({ line2Text: e.target.value })
              }}
              rows={2}
            />
          </div>
        </CollapsibleSection>
      </CollapsibleSection>
    </div>
  )
}
