import { useTranslation } from 'react-i18next'
import { useActiveTemplate } from '@/store'
import { DEFAULT_TEMPLATE_SETTINGS } from '@/constants'

const COLOR_KEYS = [
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

type ColorKey = (typeof COLOR_KEYS)[number]

interface Props {
  id: string
  value: string
  onChange: (value: string) => void
}

export function ColorSelect({ id, value, onChange }: Props) {
  const { t } = useTranslation()
  const { settings } = useActiveTemplate()

  const resolvedHex = COLOR_KEYS.includes(value as ColorKey)
    ? ((settings[value as keyof typeof settings] as string | undefined) ??
      (DEFAULT_TEMPLATE_SETTINGS[value as keyof typeof DEFAULT_TEMPLATE_SETTINGS] as
        | string
        | undefined) ??
      '')
    : value.startsWith('#') || value.startsWith('rgb')
      ? value
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
        className="flex-1 rounded border border-gray-200 bg-white px-2 py-1 text-sm text-gray-800 outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_2px_var(--accent-ring)] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
      >
        {COLOR_KEYS.map((key) => (
          <option key={key} value={key}>
            {t(`editor.properties.${key}`)}
          </option>
        ))}
      </select>
    </div>
  )
}
