import { useTranslation } from 'react-i18next'
import { useTemplateStore, useEditorStore, useActiveTemplate } from '@/store'
import { RootNodeProperties } from '@/components/blocks/properties/RootNodeProperties'
import { TextProperties } from '@/components/blocks/properties/TextProperties'
import { ImageProperties } from '@/components/blocks/properties/ImageProperties'
import { ButtonProperties } from '@/components/blocks/properties/ButtonProperties'
import { DividerProperties } from '@/components/blocks/properties/DividerProperties'
import { ColumnsProperties } from '@/components/blocks/properties/ColumnsProperties'
import { SocialProperties } from '@/components/blocks/properties/SocialProperties'
import { NavbarProperties } from '@/components/blocks/properties/NavbarProperties'
import { HeroProperties } from '@/components/blocks/properties/HeroProperties'
import { VideoProperties } from '@/components/blocks/properties/VideoProperties'
import { CountdownProperties } from '@/components/blocks/properties/CountdownProperties'
import { AccordionProperties } from '@/components/blocks/properties/AccordionProperties'
import { QuoteProperties } from '@/components/blocks/properties/QuoteProperties'


export function PropertiesPanel() {
  const { t } = useTranslation()
  const { updateBlock } = useTemplateStore()
  const { selectedBlockId, selectedChildIndex } = useEditorStore()
  const template = useActiveTemplate()

  const selectedBlock = (() => {
    if (!selectedBlockId) return null
    const top = template.blocks.find((b) => b.id === selectedBlockId)
    if (top) return top
    for (const b of template.blocks) {
      if (b.type !== 'columns') continue
      const cols = b.props['columnBlocks'] as import('@/types').EmailBlock[][] | undefined
      if (!cols) continue
      for (const col of cols) {
        const found = col.find((cb) => cb.id === selectedBlockId)
        if (found) return found
      }
    }
    return null
  })()

  const handleChange = (props: Partial<Record<string, unknown>>) => {
    if (!selectedBlock) return
    updateBlock(selectedBlock.id, { props: { ...selectedBlock.props, ...props } })
  }

  return (
    <aside
      className="flex h-full w-72 flex-shrink-0 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
      aria-label={t('editor.properties.title')}
    >
      <div className="flex flex-shrink-0 items-center gap-1.5 bg-gray-100 px-3 py-2.5 dark:bg-gray-800">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0" style={{ color: "var(--accent)" }}>
          <line x1="4" y1="6" x2="20" y2="6" /><circle cx="8" cy="6" r="2" fill="currentColor" stroke="none" />
          <line x1="4" y1="12" x2="20" y2="12" /><circle cx="16" cy="12" r="2" fill="currentColor" stroke="none" />
          <line x1="4" y1="18" x2="20" y2="18" /><circle cx="10" cy="18" r="2" fill="currentColor" stroke="none" />
        </svg>
        <span className="text-sm font-medium" style={{ color: "var(--accent)" }}>{t('settings.title')}</span>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-3">
        {selectedBlockId === '__template__' && !selectedBlock && <RootNodeProperties />}
        {selectedBlock && selectedChildIndex === null && (
          <>
            {selectedBlock.type === 'text'      && <TextProperties      block={selectedBlock} onChange={handleChange} />}
            {selectedBlock.type === 'image'     && <ImageProperties     key={selectedBlock.id} block={selectedBlock} onChange={handleChange} />}
            {selectedBlock.type === 'button'    && <ButtonProperties    block={selectedBlock} onChange={handleChange} />}
            {selectedBlock.type === 'divider'   && <DividerProperties   key={selectedBlock.id} block={selectedBlock} onChange={handleChange} />}
            {selectedBlock.type === 'columns'   && <ColumnsProperties   block={selectedBlock} onChange={handleChange} />}
            {selectedBlock.type === 'social'    && <SocialProperties    block={selectedBlock} onChange={handleChange} />}
            {selectedBlock.type === 'navbar'    && <NavbarProperties    block={selectedBlock} onChange={handleChange} />}
            {selectedBlock.type === 'hero'      && <HeroProperties      block={selectedBlock} onChange={handleChange} />}
            {selectedBlock.type === 'video'     && <VideoProperties     block={selectedBlock} onChange={handleChange} />}
            {selectedBlock.type === 'countdown' && <CountdownProperties block={selectedBlock} onChange={handleChange} />}
            {selectedBlock.type === 'accordion' && <AccordionProperties block={selectedBlock} onChange={handleChange} />}
            {selectedBlock.type === 'quote'      && <QuoteProperties      block={selectedBlock} onChange={handleChange} />}
          </>
        )}
      </div>
    </aside>
  )
}
