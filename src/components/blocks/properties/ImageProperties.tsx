import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FormField, Input, Select, Textarea, PaddingSelect, ColorSelect, CollapsibleSection } from '@/components/ui'
import { Button } from '@/components/ui'
import { compressAndConvert } from '@/utils'
import { useActiveTemplate } from '@/store'
import type { EmailBlock } from '@/types'

interface Props {
  block: EmailBlock
  onChange: (props: Partial<Record<string, unknown>>) => void
}

const DEFAULT_GENERAL    = { outerPadding: '', innerPadding: '+4', css: '' }
const DEFAULT_BORDER     = { borderWidth: '', borderStyle: '', borderColor: 'borderColor', borderRadius: '' }
const DEFAULT_CONTENT    = { src: '', alt: '' }
const DEFAULT_BACKGROUND = { sectionBg: 'backgroundColor' }

export function ImageProperties({ block, onChange }: Props) {
  const { t } = useTranslation()
  const { settings } = useActiveTemplate()
  const paddingBasePx = parseInt(settings.padding ?? '4px', 10)
  const p = block.props as Record<string, string>
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const resetTooltip = t('editor.properties.resetToDefaults')

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      const base64 = await compressAndConvert(file)
      onChange({ src: base64, alt: file.name })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">

      {/* General */}
      <CollapsibleSection label={t('editor.properties.sectionGeneral')} onReset={() => onChange(DEFAULT_GENERAL)} tooltip={resetTooltip} defaultOpen={false}>

        <FormField label={t('editor.properties.outerPadding')} htmlFor="img-sectionpadding">
          <PaddingSelect
            id="img-sectionpadding"
            value={p['outerPadding'] || ''}
            basePx={paddingBasePx}
            onChange={(e) => onChange({ outerPadding: e.target.value })}
          />
        </FormField>

        <FormField label={t('editor.properties.innerPadding')} htmlFor="img-innerpadding">
          <PaddingSelect
            id="img-innerpadding"
            value={p['innerPadding'] ?? ''}
            basePx={paddingBasePx}
            onChange={(e) => onChange({ innerPadding: e.target.value })}
          />
        </FormField>

        <FormField label={t('editor.properties.css')} htmlFor="image-css">
          <Textarea
            id="image-css"
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

        <FormField label={t('editor.properties.borderWidth')} htmlFor="img-borderwidth">
          <Select
            id="img-borderwidth"
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

        <FormField label={t('editor.properties.borderStyle')} htmlFor="img-borderstyle">
          <Select
            id="img-borderstyle"
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

        <FormField label={t('editor.properties.borderColorFull')} htmlFor="img-bordercolor">
          <ColorSelect
            id="img-bordercolor"
            value={String(p['borderColor'] ?? 'borderColor')}
            onChange={(v) => onChange({ borderColor: v || undefined })}
          />
        </FormField>

        <FormField label={t('editor.properties.borderRadius')} htmlFor="img-borderradius">
          <Select
            id="img-borderradius"
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

        <FormField label={t('editor.properties.sectionBackground')} htmlFor="img-sectionbg">
          <ColorSelect
            id="img-sectionbg"
            value={String(p['sectionBg'] ?? '')}
            onChange={(v) => onChange({ sectionBg: v || undefined })}
          />
        </FormField>
      </CollapsibleSection>

      {/* Inhalt */}
      <CollapsibleSection label={t('editor.properties.sectionContent')} onReset={() => onChange(DEFAULT_CONTENT)} tooltip={resetTooltip}>

        <FormField label={t('editor.properties.src')} htmlFor="img-src">
          <Input
            id="img-src"
            type="text"
            value={p['src'] ?? ''}
            onChange={(e) => onChange({ src: e.target.value })}
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            {uploading ? t('editor.properties.uploading') : t('editor.properties.uploadImage')}
          </Button>
        </div>

        <FormField label={t('editor.properties.alt')} htmlFor="img-alt">
          <Input
            id="img-alt"
            type="text"
            value={p['alt'] ?? ''}
            onChange={(e) => onChange({ alt: e.target.value })}
            placeholder={t('editor.properties.altPlaceholder')}
          />
        </FormField>

      </CollapsibleSection>

    </div>
  )
}
