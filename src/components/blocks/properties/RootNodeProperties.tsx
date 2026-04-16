import { useTranslation } from 'react-i18next'
import { FormField, Select, Textarea, CollapsibleSection } from '@/components/ui'
import { PaddingSelect } from '@/components/ui'
import { ColorSelect } from '@/components/ui'
import { useTemplateStore, useActiveTemplate } from '@/store'

const BORDER_WIDTH_OPTIONS = ['0px', '1px', '2px', '3px', '4px']
const BORDER_RADIUS_OPTIONS = ['0px','2px','4px','6px','8px','10px','12px','9999px']
const BORDER_STYLES = ['solid', 'dashed', 'dotted']

export function RootNodeProperties() {
  const { t } = useTranslation()
  const { updateSettings } = useTemplateStore()
  const { settings } = useActiveTemplate()

  const resetTooltip = t('editor.properties.resetToDefaults')
  const paddingBasePx = parseInt(settings.padding ?? '2px', 10)

  return (
    <div className="flex flex-col gap-2">

      {/* Allgemeines */}
      <CollapsibleSection
        label={t('editor.properties.general')}
        onReset={() => updateSettings({ bodyPadding: undefined, bodyInnerPadding: undefined, customCss: undefined })}
        tooltip={resetTooltip}
      >
        <FormField label={t('editor.properties.outerPadding')} htmlFor="root-bodypadding">
          <PaddingSelect
            id="root-bodypadding"
            value={settings.bodyPadding ?? ''}
            basePx={paddingBasePx}
            onChange={(e) => updateSettings({ bodyPadding: e.target.value || undefined })}
          />
        </FormField>

        <FormField label={t('editor.properties.innerPadding')} htmlFor="root-innerpadding">
          <PaddingSelect
            id="root-innerpadding"
            value={settings.bodyInnerPadding ?? ''}
            basePx={paddingBasePx}
            onChange={(e) => updateSettings({ bodyInnerPadding: e.target.value || undefined })}
          />
        </FormField>

        <FormField label={t('editor.properties.customCss')} htmlFor="root-css">
          <Textarea
            id="root-css"
            value={settings.customCss ?? ''}
            onChange={(e) => updateSettings({ customCss: e.target.value || undefined })}
            placeholder=""
            rows={4}
            spellCheck={false}
            style={{ fontFamily: 'monospace', fontSize: '12px' }}
          />
        </FormField>
      </CollapsibleSection>

      {/* Rahmen */}
      <CollapsibleSection
        label={t('editor.properties.sectionBorder')}
        onReset={() => updateSettings({ bodyBorderWidth: undefined, bodyBorderStyle: undefined, bodyBorderColor: undefined, bodyBorderRadius: undefined })}
        tooltip={resetTooltip}
      >
        <FormField label={t('editor.properties.borderWidth')} htmlFor="root-borderwidth">
          <Select
            id="root-borderwidth"
            value={settings.bodyBorderWidth ?? '0px'}
            onChange={(e) => updateSettings({ bodyBorderWidth: e.target.value === '0px' ? undefined : e.target.value })}
          >
            {BORDER_WIDTH_OPTIONS.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </Select>
        </FormField>

        <FormField label={t('editor.properties.borderStyle')} htmlFor="root-borderstyle">
          <Select
            id="root-borderstyle"
            value={settings.bodyBorderStyle ?? 'solid'}
            onChange={(e) => updateSettings({ bodyBorderStyle: e.target.value })}
          >
            {BORDER_STYLES.map((v) => (
              <option key={v} value={v}>{t(`editor.properties.borderStyle${v.charAt(0).toUpperCase() + v.slice(1)}`)}</option>
            ))}
          </Select>
        </FormField>

        <FormField label={t('editor.properties.borderColorFull')} htmlFor="root-bordercolor">
          <ColorSelect
            id="root-bordercolor"
            value={settings.bodyBorderColor ?? 'borderColor'}
            onChange={(v) => updateSettings({ bodyBorderColor: v })}
          />
        </FormField>

        <FormField label={t('editor.properties.borderRadius')} htmlFor="root-borderradius">
          <Select
            id="root-borderradius"
            value={settings.bodyBorderRadius ?? '0px'}
            onChange={(e) => updateSettings({ bodyBorderRadius: e.target.value === '0px' ? undefined : e.target.value })}
          >
            {BORDER_RADIUS_OPTIONS.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </Select>
        </FormField>
      </CollapsibleSection>

      {/* Hintergrund */}
      <CollapsibleSection
        label={t('editor.properties.sectionBg')}
        onReset={() => updateSettings({ bodyBackgroundColor: undefined })}
        tooltip={resetTooltip}
      >
        <FormField label={t('editor.properties.backgroundColorFull')} htmlFor="root-bgcolor">
          <ColorSelect
            id="root-bgcolor"
            value={settings.bodyBackgroundColor ?? 'pageColor'}
            onChange={(v) => updateSettings({ bodyBackgroundColor: v })}
          />
        </FormField>
      </CollapsibleSection>

    </div>
  )
}
