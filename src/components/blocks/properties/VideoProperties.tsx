import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FormField,
  Input,
  Select,
  Textarea,
  PaddingSelect,
  ColorSelect,
  CollapsibleSection,
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
  borderWidth: '',
  borderStyle: '',
  borderColor: 'borderColor',
}
const DEFAULT_BACKGROUND = { sectionBg: 'backgroundColor' }
const DEFAULT_CONTENT = { src: '', thumbnailSrc: '', alt: '', showPlayButton: 'true' }

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  )
  return match?.[1] ?? null
}

export function VideoProperties({ block, onChange }: Props) {
  const { t } = useTranslation()
  const { settings } = useActiveTemplate()
  const paddingBasePx = parseInt(settings.padding ?? '4px', 10)
  const p = block.props as Record<string, string>
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const resetTooltip = t('editor.properties.resetToDefaults')

  const handleVideoUrlChange = async (url: string) => {
    const ytId = extractYouTubeId(url)
    const updates: Record<string, unknown> = { src: url }
    const currentThumb = p['thumbnailSrc'] ?? ''
    const isManualUpload = currentThumb.startsWith('data:')
    if (!isManualUpload) {
      if (ytId) {
        try {
          const thumbUrl = `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
          const res = await fetch(thumbUrl)
          const blob = await res.blob()
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onload = () => {
              resolve(reader.result as string)
            }
            reader.readAsDataURL(blob)
          })
          updates.thumbnailSrc = base64
        } catch {
          updates.thumbnailSrc = ''
        }
      } else if (!url) {
        updates.thumbnailSrc = ''
      }
    }
    onChange(updates)
  }

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      const base64 = await compressAndConvert(file)
      onChange({ thumbnailSrc: base64 })
    } finally {
      setUploading(false)
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
        <FormField label={t('editor.properties.outerPadding')} htmlFor="vid-sectionpadding">
          <PaddingSelect
            id="vid-sectionpadding"
            value={p['outerPadding'] || ''}
            basePx={paddingBasePx}
            onChange={(e) => {
              onChange({ outerPadding: e.target.value })
            }}
          />
        </FormField>

        <FormField label={t('editor.properties.innerPadding')} htmlFor="vid-innerpadding">
          <PaddingSelect
            id="vid-innerpadding"
            value={p['innerPadding'] ?? ''}
            basePx={paddingBasePx}
            onChange={(e) => {
              onChange({ innerPadding: e.target.value })
            }}
          />
        </FormField>

        <FormField label={t('editor.properties.css')} htmlFor="video-css">
          <Textarea
            id="video-css"
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
        <FormField label={t('editor.properties.borderWidth')} htmlFor="vid-borderwidth">
          <Select
            id="vid-borderwidth"
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

        <FormField label={t('editor.properties.borderStyle')} htmlFor="vid-borderstyle">
          <Select
            id="vid-borderstyle"
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

        <FormField label={t('editor.properties.borderColorFull')} htmlFor="vid-bordercolor">
          <ColorSelect
            id="vid-bordercolor"
            value={String(p['borderColor'] ?? 'borderColor')}
            onChange={(v) => {
              onChange({ borderColor: v || undefined })
            }}
          />
        </FormField>

        <FormField label={t('editor.properties.borderRadius')} htmlFor="vid-sec-borderradius">
          <Select
            id="vid-sec-borderradius"
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
        <FormField label={t('editor.properties.sectionBackground')} htmlFor="vid-sectionbg">
          <ColorSelect
            id="vid-sectionbg"
            value={String(p['sectionBg'] ?? '')}
            onChange={(v) => {
              onChange({ sectionBg: v || undefined })
            }}
          />
        </FormField>
      </CollapsibleSection>

      {/* Inhalt */}
      <CollapsibleSection
        label={t('editor.properties.sectionContent')}
        onReset={() => {
          onChange(DEFAULT_CONTENT)
        }}
        tooltip={resetTooltip}
      >
        <FormField label={t('editor.properties.videoUrl')} htmlFor="vid-src">
          <Input
            id="vid-src"
            type="text"
            value={p['src'] ?? ''}
            onChange={(e) => void handleVideoUrlChange(e.target.value)}
            placeholder="https://..."
          />
        </FormField>

        <FormField label={t('editor.properties.poster')} htmlFor="vid-thumbnail">
          <Input
            id="vid-thumbnail"
            type="text"
            value={p['thumbnailSrc'] ?? ''}
            onChange={(e) => {
              onChange({ thumbnailSrc: e.target.value })
            }}
            placeholder={t('editor.properties.srcPlaceholder')}
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

        <FormField label={t('editor.properties.alt')} htmlFor="vid-alt">
          <Input
            id="vid-alt"
            type="text"
            value={p['alt'] ?? ''}
            onChange={(e) => {
              onChange({ alt: e.target.value })
            }}
            placeholder={t('editor.properties.altPlaceholder')}
          />
        </FormField>

        <FormField label={t('editor.properties.playButton')} htmlFor="vid-playbutton">
          <Select
            id="vid-playbutton"
            value={p['showPlayButton'] ?? 'true'}
            onChange={(e) => {
              onChange({ showPlayButton: e.target.value })
            }}
          >
            <option value="false">—</option>
            <option value="true">{t('editor.properties.show')}</option>
          </Select>
        </FormField>
      </CollapsibleSection>
    </div>
  )
}
