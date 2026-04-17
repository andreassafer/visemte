import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FormField,
  Select,
  Input,
  Textarea,
  Tooltip,
  ColorSelect,
  PaddingSelect,
  CollapsibleSection,
} from '@/components/ui'
import { Button } from '@/components/ui'
import { IconSvg } from '@/components/blocks/Icons'
import { useActiveTemplate } from '@/store'
import { DEFAULT_TEMPLATE_SETTINGS } from '@/constants'
import type { EmailBlock } from '@/types'

interface Props {
  block: EmailBlock
  onChange: (props: Partial<Record<string, unknown>>) => void
}

export const ICON_OPTIONS: { value: string; label: string; labelKey?: string }[] = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'X (Twitter)' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'pinterest', label: 'Pinterest' },
  { value: 'discord', label: 'Discord' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'Email', labelKey: 'editor.properties.iconLabelEmail' },
  { value: 'phone', label: 'Phone', labelKey: 'editor.properties.iconLabelPhone' },
  { value: 'globe', label: 'Website', labelKey: 'editor.properties.iconLabelGlobe' },
  { value: 'github', label: 'GitHub' },
  { value: 'rss', label: 'RSS' },
  { value: 'star', label: 'Star', labelKey: 'editor.properties.iconLabelStar' },
  { value: 'trophy', label: 'Trophy', labelKey: 'editor.properties.iconLabelTrophy' },
  { value: 'crown', label: 'Crown', labelKey: 'editor.properties.iconLabelCrown' },
  { value: 'diamond', label: 'Diamond', labelKey: 'editor.properties.iconLabelDiamond' },
  { value: 'heart', label: 'Heart', labelKey: 'editor.properties.iconLabelHeart' },
  { value: 'fire', label: 'Fire', labelKey: 'editor.properties.iconLabelFire' },
  { value: 'sparkle', label: 'Sparkle', labelKey: 'editor.properties.iconLabelSparkle' },
  { value: 'check', label: 'Check', labelKey: 'editor.properties.iconLabelCheck' },
  { value: 'number1', label: '1' },
  { value: 'number2', label: '2' },
  { value: 'number3', label: '3' },
  { value: 'question', label: '?' },
  { value: 'exclamation', label: '!' },
]

const DEFAULT_ICON_DEFAULTS: Record<number, string> = {
  1: 'facebook',
  2: 'twitter',
  3: 'instagram',
  4: 'linkedin',
  5: 'youtube',
  6: 'tiktok',
  7: 'pinterest',
}

const DEFAULT_GENERAL = { outerPadding: '', innerPadding: '+4', css: '' }
const DEFAULT_BORDER = {
  borderWidth: '',
  borderStyle: '',
  borderColor: 'borderColor',
  borderRadius: '',
}
const DEFAULT_DESIGN = { align: 'center', iconSize: '28' }
const DEFAULT_BACKGROUND = { sectionBg: 'backgroundColor' }

const NEUTRAL = '#6b7280'

function IconSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const opt = ICON_OPTIONS.find((o) => o.value === value)
  const label = opt ? (opt.labelKey ? t(opt.labelKey) : opt.label) : value
  const resolveLabel = (o: (typeof ICON_OPTIONS)[number]) => (o.labelKey ? t(o.labelKey) : o.label)

  useEffect(() => {
    if (!open) return
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => {
      document.removeEventListener('mousedown', handle)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v)
        }}
        className="flex w-full items-center gap-2 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1.5 text-left text-xs hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
      >
        <span style={{ color: NEUTRAL, flexShrink: 0, display: 'flex' }}>
          <IconSvg type={value} size={14} />
        </span>
        <span className="flex-1 text-gray-700 dark:text-gray-300">{label}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="flex-shrink-0 text-gray-400"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg p-1.5">
          <div className="flex flex-wrap gap-1.5">
            {ICON_OPTIONS.map((opt) => (
              <Tooltip key={opt.value} label={resolveLabel(opt)} side="bottom">
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value)
                    setOpen(false)
                  }}
                  aria-label={resolveLabel(opt)}
                  aria-pressed={value === opt.value}
                  className={`flex items-center justify-center rounded border transition-all ${
                    value === opt.value
                      ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  style={{ width: 28, height: 28, flexShrink: 0, color: NEUTRAL }}
                >
                  <IconSvg type={opt.value} size={15} />
                </button>
              </Tooltip>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const ICON_COLOR_KEYS = [
  'pageColor',
  'fontColor',
  'backgroundColor',
  'borderColor',
  'primaryColor',
  'secondaryColor',
  'alternativeColor',
  'designColor',
  'brandColor',
] as const

function IconColorSelect({
  id,
  value,
  onChange,
}: {
  id: string
  value: string
  onChange: (v: string) => void
}) {
  const { t } = useTranslation()
  const { settings } = useActiveTemplate()
  const resolvedHex = ICON_COLOR_KEYS.includes(value as (typeof ICON_COLOR_KEYS)[number])
    ? ((settings[value as keyof typeof settings] as string | undefined) ??
      (DEFAULT_TEMPLATE_SETTINGS[value as keyof typeof DEFAULT_TEMPLATE_SETTINGS] as
        | string
        | undefined) ??
      '')
    : ''
  return (
    <div className="flex items-center gap-2">
      <span
        className="h-5 w-5 shrink-0 rounded border border-gray-300 dark:border-gray-600"
        style={{ backgroundColor: resolvedHex || 'transparent' }}
      />
      <select
        id={id}
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
        }}
        className="flex-1 rounded border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
      >
        {ICON_COLOR_KEYS.map((key) => (
          <option key={key} value={key}>
            {t(`editor.properties.${key}`)}
          </option>
        ))}
      </select>
    </div>
  )
}

export function SocialProperties({ block, onChange }: Props) {
  const { t } = useTranslation()
  const { settings } = useActiveTemplate()
  const paddingBasePx = parseInt(settings.padding ?? '4px', 10)
  const p = block.props as Record<string, string>
  const resetTooltip = t('editor.properties.resetToDefaults')

  const iconCount = Math.min(Math.max(Number(p['iconCount'] ?? 3), 1), 7)

  const deleteIcon = (i: number) => {
    const newProps: Record<string, unknown> = { iconCount: String(iconCount - 1) }
    for (let j = i; j < iconCount - 1; j++) {
      newProps[`icon${j + 1}Type`] =
        p[`icon${j + 2}Type`] ?? DEFAULT_ICON_DEFAULTS[j + 2] ?? 'facebook'
      newProps[`icon${j + 1}Href`] = p[`icon${j + 2}Href`] ?? ''
      newProps[`icon${j + 1}Color`] = p[`icon${j + 2}Color`] ?? 'pageColor'
      newProps[`icon${j + 1}Shape`] = p[`icon${j + 2}Shape`] ?? 'rounded'
      newProps[`icon${j + 1}Bg`] = p[`icon${j + 2}Bg`] ?? 'fontColor'
    }
    newProps[`icon${iconCount}Type`] = DEFAULT_ICON_DEFAULTS[iconCount] ?? 'facebook'
    newProps[`icon${iconCount}Href`] = ''
    newProps[`icon${iconCount}Color`] = 'pageColor'
    newProps[`icon${iconCount}Shape`] = 'rounded'
    newProps[`icon${iconCount}Bg`] = 'fontColor'
    onChange(newProps)
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Allgemeines */}
      <CollapsibleSection
        label={t('editor.properties.sectionGeneral')}
        onReset={() => {
          onChange(DEFAULT_GENERAL)
        }}
        tooltip={resetTooltip}
        defaultOpen={false}
      >
        <FormField label={t('editor.properties.outerPadding')} htmlFor="social-sectionpadding">
          <PaddingSelect
            id="social-sectionpadding"
            value={p['outerPadding'] || ''}
            basePx={paddingBasePx}
            onChange={(e) => {
              onChange({ outerPadding: e.target.value })
            }}
          />
        </FormField>

        <FormField label={t('editor.properties.innerPadding')} htmlFor="social-innerpadding">
          <PaddingSelect
            id="social-innerpadding"
            value={p['innerPadding'] ?? ''}
            basePx={paddingBasePx}
            onChange={(e) => {
              onChange({ innerPadding: e.target.value })
            }}
          />
        </FormField>

        <FormField label={t('editor.properties.css')} htmlFor="social-css">
          <Textarea
            id="social-css"
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
        <FormField label={t('editor.properties.borderWidth')} htmlFor="social-borderwidth">
          <Select
            id="social-borderwidth"
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

        <FormField label={t('editor.properties.borderStyle')} htmlFor="social-borderstyle">
          <Select
            id="social-borderstyle"
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

        <FormField label={t('editor.properties.borderColorFull')} htmlFor="social-bordercolor">
          <ColorSelect
            id="social-bordercolor"
            value={String(p['borderColor'] ?? 'borderColor')}
            onChange={(v) => {
              onChange({ borderColor: v || undefined })
            }}
          />
        </FormField>

        <FormField label={t('editor.properties.borderRadius')} htmlFor="social-borderradius">
          <Select
            id="social-borderradius"
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
        <FormField label={t('editor.properties.sectionBackground')} htmlFor="social-sectionbg">
          <ColorSelect
            id="social-sectionbg"
            value={String(p['sectionBg'] ?? '')}
            onChange={(v) => {
              onChange({ sectionBg: v || undefined })
            }}
          />
        </FormField>
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
        <FormField label={t('editor.properties.iconSize')} htmlFor="social-size">
          <Select
            id="social-size"
            value={p['iconSize'] ?? '28'}
            onChange={(e) => {
              onChange({ iconSize: e.target.value })
            }}
          >
            {['24', '28', '32', '36'].map((s) => (
              <option key={s} value={s}>
                {s}px
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label={t('editor.properties.horizontalAlign')} htmlFor="social-align">
          <Select
            id="social-align"
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
        {Array.from({ length: iconCount }).map((_, i) => {
          const n = i + 1
          return (
            <CollapsibleSection
              key={i}
              label={t('editor.properties.iconNumber', { n })}
              onDelete={
                iconCount > 1
                  ? () => {
                      deleteIcon(i)
                    }
                  : undefined
              }
              deleteTooltip={iconCount > 1 ? t('editor.tree.deleteBlock') : undefined}
              onReset={() => {
                onChange({
                  [`icon${n}Type`]: DEFAULT_ICON_DEFAULTS[n] ?? 'facebook',
                  [`icon${n}Href`]: '',
                  [`icon${n}Color`]: 'pageColor',
                  [`icon${n}Shape`]: 'rounded',
                  [`icon${n}Bg`]: 'fontColor',
                })
              }}
              tooltip={resetTooltip}
              noToggle
            >
              <FormField label={t('editor.properties.graphic')} htmlFor={`social-icon${n}-type`}>
                <IconSelect
                  value={p[`icon${n}Type`] ?? DEFAULT_ICON_DEFAULTS[n] ?? 'facebook'}
                  onChange={(v) => {
                    onChange({ [`icon${n}Type`]: v })
                  }}
                />
              </FormField>

              <FormField
                label={t('editor.properties.graphicColor')}
                htmlFor={`social-icon${n}-color`}
              >
                <IconColorSelect
                  id={`social-icon${n}-color`}
                  value={p[`icon${n}Color`] ?? 'pageColor'}
                  onChange={(v) => {
                    onChange({ [`icon${n}Color`]: v })
                  }}
                />
              </FormField>

              <FormField
                label={t('editor.properties.iconBackground')}
                htmlFor={`social-icon${n}-shape`}
              >
                <Select
                  id={`social-icon${n}-shape`}
                  value={p[`icon${n}Shape`] ?? 'rounded'}
                  onChange={(e) => {
                    onChange({ [`icon${n}Shape`]: e.target.value })
                  }}
                >
                  <option value="none">{t('editor.properties.shapeNone')}</option>
                  <option value="square">{t('editor.properties.shapeSquare')}</option>
                  <option value="rounded">{t('editor.properties.shapeRounded')}</option>
                  <option value="circle">{t('editor.properties.shapeCircle')}</option>
                </Select>
              </FormField>

              <FormField
                label={t('editor.properties.backgroundColorFull')}
                htmlFor={`social-icon${n}-bg`}
              >
                <ColorSelect
                  id={`social-icon${n}-bg`}
                  value={String(p[`icon${n}Bg`] ?? 'fontColor')}
                  onChange={(v) => {
                    onChange({ [`icon${n}Bg`]: v || undefined })
                  }}
                />
              </FormField>

              <FormField label={t('editor.properties.url')} htmlFor={`social-icon${n}-href`}>
                <Input
                  id={`social-icon${n}-href`}
                  type="text"
                  value={p[`icon${n}Href`] ?? ''}
                  placeholder="https://..."
                  onChange={(e) => {
                    onChange({ [`icon${n}Href`]: e.target.value })
                  }}
                />
              </FormField>
            </CollapsibleSection>
          )
        })}
        {iconCount < 7 && (
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => {
              onChange({ iconCount: String(iconCount + 1) })
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
            {t('editor.properties.addIcon')}
          </Button>
        )}
      </CollapsibleSection>
    </div>
  )
}
