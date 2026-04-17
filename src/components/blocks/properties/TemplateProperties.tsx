import { useTranslation } from 'react-i18next'
import { FormField, Input, Select, ColorInput, Textarea, CollapsibleSection } from '@/components/ui'
import { useTemplateStore, useActiveTemplate } from '@/store'
import { DEFAULT_TEMPLATE_SETTINGS } from '@/constants'

const DEFAULT_GENERAL = {
  contentWidth: DEFAULT_TEMPLATE_SETTINGS.contentWidth,
  customCss: undefined,
}

const DEFAULT_CONTENT = {
  padding: DEFAULT_TEMPLATE_SETTINGS.padding,
  lineHeight: DEFAULT_TEMPLATE_SETTINGS.lineHeight,
}

const DEFAULT_BORDER = {
  defaultBorderWidth: DEFAULT_TEMPLATE_SETTINGS.defaultBorderWidth,
  defaultBorderStyle: DEFAULT_TEMPLATE_SETTINGS.defaultBorderStyle,
  defaultBorderRadius: DEFAULT_TEMPLATE_SETTINGS.defaultBorderRadius,
}

const DEFAULT_FONT = {
  fontFamily: DEFAULT_TEMPLATE_SETTINGS.fontFamily,
  fontSize: DEFAULT_TEMPLATE_SETTINGS.fontSize,
  fontStyle: 'normal',
}

const DEFAULT_COLORS = {
  pageColor: DEFAULT_TEMPLATE_SETTINGS.pageColor,
  fontColor: DEFAULT_TEMPLATE_SETTINGS.fontColor,
  backgroundColor: DEFAULT_TEMPLATE_SETTINGS.backgroundColor,
  borderColor: DEFAULT_TEMPLATE_SETTINGS.borderColor,
  primaryColor: DEFAULT_TEMPLATE_SETTINGS.primaryColor,
  secondaryColor: DEFAULT_TEMPLATE_SETTINGS.secondaryColor,
  alternativeColor: DEFAULT_TEMPLATE_SETTINGS.alternativeColor,
  designColor: DEFAULT_TEMPLATE_SETTINGS.designColor,
  brandColor: DEFAULT_TEMPLATE_SETTINGS.brandColor,
}

export function TemplateProperties() {
  const { t } = useTranslation()
  const { setTemplateName, updateSettings } = useTemplateStore()
  const template = useActiveTemplate()
  const s = template.settings
  const resetTooltip = t('editor.properties.resetToDefaults')

  return (
    <div className="flex flex-col gap-2">
      {/* Allgemeines */}
      <CollapsibleSection
        label={t('editor.properties.sectionGeneral')}
        onReset={() => {
          updateSettings(DEFAULT_GENERAL)
        }}
        tooltip={resetTooltip}
      >
        <FormField label={t('editor.properties.name')} htmlFor="tpl-name">
          <Input
            id="tpl-name"
            type="text"
            value={template.name}
            onChange={(e) => {
              setTemplateName(e.target.value)
            }}
            placeholder={t('editor.untitled')}
          />
        </FormField>

        <FormField label={t('editor.properties.contentWidth')} htmlFor="tpl-width">
          <div className="flex items-center gap-2">
            <Input
              id="tpl-width"
              type="number"
              min={320}
              max={800}
              value={s.contentWidth}
              onChange={(e) => {
                updateSettings({ contentWidth: Number(e.target.value) })
              }}
              className="flex-1"
            />
            <span className="text-xs text-gray-400">px</span>
          </div>
        </FormField>

        <FormField label={t('editor.properties.customCss')} htmlFor="tpl-css">
          <Textarea
            id="tpl-css"
            value={s.customCss ?? ''}
            onChange={(e) => {
              updateSettings({ customCss: e.target.value || undefined })
            }}
            placeholder=""
            rows={4}
            spellCheck={false}
            style={{ fontFamily: 'monospace', fontSize: '12px' }}
          />
        </FormField>
      </CollapsibleSection>

      {/* Inhalt */}
      <CollapsibleSection
        label={t('editor.properties.sectionContent')}
        onReset={() => {
          updateSettings(DEFAULT_CONTENT)
        }}
        tooltip={resetTooltip}
      >
        <FormField label={t('editor.properties.defaultPadding')} htmlFor="tpl-padding">
          <Select
            id="tpl-padding"
            value={s.padding ?? '2px'}
            onChange={(e) => {
              updateSettings({ padding: e.target.value })
            }}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
              <option key={v} value={`${v}px`}>
                {v}px
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label={t('editor.properties.lineHeight')} htmlFor="tpl-lineheight">
          <Select
            id="tpl-lineheight"
            value={String(s.lineHeight ?? 1.5)}
            onChange={(e) => {
              updateSettings({ lineHeight: Number(e.target.value) })
            }}
          >
            {[1.0, 1.15, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0].map((v) => (
              <option key={v} value={String(v)}>
                {v.toFixed(2).replace('.', ',')}×
              </option>
            ))}
          </Select>
        </FormField>
      </CollapsibleSection>

      {/* Rahmen – globale Defaults */}
      <CollapsibleSection
        label={t('editor.properties.sectionBorder')}
        onReset={() => {
          updateSettings(DEFAULT_BORDER)
        }}
        tooltip={resetTooltip}
      >
        <FormField label={t('editor.properties.borderWidth')} htmlFor="tpl-borderwidth">
          <Select
            id="tpl-borderwidth"
            value={s.defaultBorderWidth || DEFAULT_TEMPLATE_SETTINGS.defaultBorderWidth!}
            onChange={(e) => {
              updateSettings({ defaultBorderWidth: e.target.value })
            }}
          >
            {(['0px', '1px', '2px', '3px', '4px'] as const).map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label={t('editor.properties.borderStyle')} htmlFor="tpl-borderstyle">
          <Select
            id="tpl-borderstyle"
            value={s.defaultBorderStyle || DEFAULT_TEMPLATE_SETTINGS.defaultBorderStyle!}
            onChange={(e) => {
              updateSettings({ defaultBorderStyle: e.target.value })
            }}
          >
            {(['solid', 'dashed', 'dotted'] as const).map((v) => (
              <option key={v} value={v}>
                {t(`editor.properties.borderStyle${v.charAt(0).toUpperCase() + v.slice(1)}`)}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label={t('editor.properties.borderRadius')} htmlFor="tpl-borderradius">
          <Select
            id="tpl-borderradius"
            value={s.defaultBorderRadius || DEFAULT_TEMPLATE_SETTINGS.defaultBorderRadius!}
            onChange={(e) => {
              updateSettings({ defaultBorderRadius: e.target.value })
            }}
          >
            {(['0px', '2px', '4px', '6px', '8px', '10px', '12px', '9999px'] as const).map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </Select>
        </FormField>
      </CollapsibleSection>

      {/* Schrift */}
      <CollapsibleSection
        label={t('editor.properties.sectionFont')}
        onReset={() => {
          updateSettings(DEFAULT_FONT)
        }}
        tooltip={resetTooltip}
      >
        <FormField label={t('editor.properties.fontFamily')} htmlFor="tpl-font">
          <Select
            id="tpl-font"
            value={s.fontFamily}
            onChange={(e) => {
              updateSettings({ fontFamily: e.target.value })
            }}
          >
            <option value="Arial, sans-serif">Arial</option>
            <option value="'Helvetica Neue', Helvetica, sans-serif">Helvetica</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="'Times New Roman', serif">Times New Roman</option>
            <option value="'Courier New', monospace">Courier New</option>
            <option value="Verdana, sans-serif">Verdana</option>
          </Select>
        </FormField>

        <FormField label={t('editor.properties.fontSize')} htmlFor="tpl-fontsize">
          <Select
            id="tpl-fontsize"
            value={s.fontSize}
            onChange={(e) => {
              updateSettings({ fontSize: Number(e.target.value) })
            }}
          >
            {[10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26].map((v) => (
              <option key={v} value={v}>
                {v}px
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label={t('editor.properties.fontStyle')} htmlFor="tpl-fontstyle">
          <Select
            id="tpl-fontstyle"
            value={s.fontStyle ?? 'normal'}
            onChange={(e) => {
              updateSettings({ fontStyle: e.target.value })
            }}
          >
            <option value="normal">{t('editor.properties.normal')}</option>
            <option value="bold">{t('editor.properties.bold')}</option>
            <option value="italic">{t('editor.properties.italic')}</option>
          </Select>
        </FormField>
      </CollapsibleSection>

      {/* Farben */}
      <CollapsibleSection
        label={t('editor.properties.sectionColors')}
        onReset={() => {
          updateSettings(DEFAULT_COLORS)
        }}
        tooltip={resetTooltip}
      >
        <FormField label={t('editor.properties.pageColor')} htmlFor="tpl-pagecolor">
          <ColorInput
            id="tpl-pagecolor"
            value={s.pageColor ?? '#d9d9d9'}
            onChange={(e) => {
              updateSettings({ pageColor: e.target.value })
            }}
          />
        </FormField>

        <FormField label={t('editor.properties.fontColor')} htmlFor="tpl-fontcolor">
          <ColorInput
            id="tpl-fontcolor"
            value={s.fontColor ?? '#000000'}
            onChange={(e) => {
              updateSettings({ fontColor: e.target.value })
            }}
          />
        </FormField>

        <FormField label={t('editor.properties.backgroundColor')} htmlFor="tpl-bg">
          <ColorInput
            id="tpl-bg"
            value={s.backgroundColor}
            onChange={(e) => {
              updateSettings({ backgroundColor: e.target.value })
            }}
          />
        </FormField>

        <FormField label={t('editor.properties.borderColor')} htmlFor="tpl-bordercolor">
          <ColorInput
            id="tpl-bordercolor"
            value={s.borderColor ?? '#e2e8f0'}
            onChange={(e) => {
              updateSettings({ borderColor: e.target.value })
            }}
          />
        </FormField>

        <FormField label={t('editor.properties.primaryColor')} htmlFor="tpl-primary">
          <ColorInput
            id="tpl-primary"
            value={s.primaryColor ?? '#3b82f6'}
            onChange={(e) => {
              updateSettings({ primaryColor: e.target.value })
            }}
          />
        </FormField>

        <FormField label={t('editor.properties.secondaryColor')} htmlFor="tpl-secondary">
          <ColorInput
            id="tpl-secondary"
            value={s.secondaryColor ?? '#8b5cf6'}
            onChange={(e) => {
              updateSettings({ secondaryColor: e.target.value })
            }}
          />
        </FormField>

        <FormField label={t('editor.properties.alternativeColor')} htmlFor="tpl-alternative">
          <ColorInput
            id="tpl-alternative"
            value={s.alternativeColor ?? '#10b981'}
            onChange={(e) => {
              updateSettings({ alternativeColor: e.target.value })
            }}
          />
        </FormField>

        <FormField label={t('editor.properties.designColor')} htmlFor="tpl-design">
          <ColorInput
            id="tpl-design"
            value={s.designColor ?? '#f59e0b'}
            onChange={(e) => {
              updateSettings({ designColor: e.target.value })
            }}
          />
        </FormField>

        <FormField label={t('editor.properties.brandColor')} htmlFor="tpl-brand">
          <ColorInput
            id="tpl-brand"
            value={s.brandColor ?? '#1e293b'}
            onChange={(e) => {
              updateSettings({ brandColor: e.target.value })
            }}
          />
        </FormField>
      </CollapsibleSection>
    </div>
  )
}
