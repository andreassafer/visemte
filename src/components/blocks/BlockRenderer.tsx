import { useTranslation } from 'react-i18next'
import type { EmailBlock } from '@/types'
import { TextBlock } from './TextBlock'
import { ImageBlock } from './ImageBlock'
import { ButtonBlock } from './ButtonBlock'
import { DividerBlock } from './DividerBlock'
import { ColumnsBlock } from './ColumnsBlock'
import { SocialBlock } from './Icons'
import { NavbarBlock } from './NavbarBlock'
import { HeroBlock } from './HeroBlock'
import { VideoBlock } from './VideoBlock'
import { CountdownBlock } from './CountdownBlock'
import { AccordionBlock } from './AccordionBlock'
import { QuoteBlock } from './QuoteBlock'

interface Props {
  block: EmailBlock
}

export function BlockRenderer({ block }: Props) {
  const { t } = useTranslation()
  switch (block.type) {
    case 'text':      return <TextBlock block={block} />
    case 'image':     return <ImageBlock block={block} />
    case 'button':    return <ButtonBlock block={block} />
    case 'divider':   return <DividerBlock block={block} />
    case 'columns':   return <ColumnsBlock block={block} />
    case 'social':    return <SocialBlock block={block} />
    case 'navbar':    return <NavbarBlock block={block} />
    case 'hero':      return <HeroBlock block={block} />
    case 'video':     return <VideoBlock block={block} />
    case 'countdown': return <CountdownBlock block={block} />
    case 'accordion': return <AccordionBlock block={block} />
    case 'quote':      return <QuoteBlock block={block} />
    default:
      return (
        <div className="p-4 text-center text-sm text-gray-400">
          {t('errors.unknownBlockType', { type: block.type })}
        </div>
      )
  }
}
