import type { EmailTemplate, EmailBlock, TemplateSettings } from '@/types'
import { resolveRelativeFontSize } from './fontSizeOffset'
import { resolveRelativePadding } from './paddingOffset'
import i18n from '@/i18n'

// Collected preview CSS (cleared on each templateToMjml call)
const _previewCss = new Map<string, string>() // cls → css rule(s)

function sanitizeCls(s: string) { return s.replace(/[^a-zA-Z0-9]/g, '') }

/** Returns the effective default section padding, respecting bodyInnerPadding relative offset. */
function getDefaultSectionPadding(settings?: TemplateSettings): string {
  const basePx = parseInt(settings?.padding ?? '2px', 10)
  return resolveRelativePadding(settings?.bodyInnerPadding, basePx) ?? settings?.padding ?? '2px'
}

function resolveColor(value: string | undefined, settings?: TemplateSettings): string {
  if (!value) return ''
  // Already a hex or rgb color
  if (value.startsWith('#') || value.startsWith('rgb')) return value

  // Try to resolve from settings if it's a variable name
  if (settings) {
    const resolved = settings[value as keyof TemplateSettings]
    if (typeof resolved === 'string' && (resolved.startsWith('#') || resolved.startsWith('rgb'))) {
      return resolved
    }
  }

  // If we reach here, it's not a valid color - return empty string instead of the variable name
  // This prevents invalid MJML attributes like background-color="pageColor"
  return ''
}

function blockToMjml(block: EmailBlock, settings?: TemplateSettings, insideColumn = false, colAlign?: string): string {
  const p = block.props as Record<string, string>

  switch (block.type) {
    case 'text': {
      const effectiveAlign = colAlign ?? p['align'] ?? 'left'
      const basePx = settings?.fontSize ?? 14
      const resolvedFontSize = resolveRelativeFontSize(p['fontSize'], basePx)
      const textAttrsCommon = [
        `align="${effectiveAlign}"`,
        resolveColor(p['color'], settings) ? `color="${resolveColor(p['color'], settings)}"` : '',
        resolvedFontSize ? `font-size="${resolvedFontSize}"` : '',
        p['fontFamily'] ? `font-family="${p['fontFamily']}"` : '',
        p['fontStyle'] === 'bold'   ? `font-weight="bold"`   : '',
        p['fontStyle'] === 'italic' ? `font-style="italic"` : '',
      ].filter(Boolean).join(' ')
      const paddingBasePx = parseInt(settings?.padding ?? '4px', 10)
      const resolvedInnerPadding = resolveRelativePadding(p['innerPadding'], paddingBasePx) ?? settings?.padding ?? '4px'
      if (insideColumn) {
        const widthStyle = p['width'] && p['width'] !== '100%' ? `width:${p['width']}` : ''
        const alignMargin = widthStyle
          ? (effectiveAlign === 'right' ? 'margin-left:auto;margin-right:0'
            : effectiveAlign === 'center' ? 'margin:0 auto'
            : 'margin-left:0;margin-right:auto')
          : ''
        const txtBr = p['borderRadius'] || settings?.defaultBorderRadius || ''
        const txtBw = p['borderWidth'] || settings?.defaultBorderWidth || ''
        const txtBs = p['borderStyle'] || settings?.defaultBorderStyle || 'solid'
        const txtBc = resolveColor(p['borderColor'], settings) || '#e5e7eb'
        const resolvedOuterPadding = resolveRelativePadding(p['outerPadding'], paddingBasePx) ?? settings?.padding ?? '4px'
        const outerStyle = [
          `padding:${resolvedOuterPadding}`,
          'box-sizing:border-box',
        ].join(';')
        const innerStyle = [
          resolveColor(p['sectionBg'], settings) ? `background-color:${resolveColor(p['sectionBg'], settings)}` : '',
          txtBr && txtBr !== '0px' ? `border-radius:${txtBr}` : '',
          txtBw ? `border:${txtBw} ${txtBs} ${txtBc}` : '',
          `padding:${resolvedInnerPadding}`,
          `text-align:${effectiveAlign}`,
          resolveColor(p['color'], settings) ? `color:${resolveColor(p['color'], settings)}` : '',
          `font-size:${resolveRelativeFontSize(p['fontSize'], paddingBasePx) ?? `${settings?.fontSize ?? 14}px`}`,
          settings?.fontFamily ? `font-family:${settings.fontFamily}` : '',
          widthStyle,
          alignMargin,
        ].filter(Boolean).join(';')
        const txtSanitizedId = block.id.replace(/[^a-zA-Z0-9]/g, '')
        return `<div class="blk-${txtSanitizedId}" style="${outerStyle}"><div style="${innerStyle}">${p['content'] ?? ''}</div></div>`
      }
      // Standalone — match in-column rendering (inner div handles bg, radius, padding)
      const standaloneInnerStyle = [
        resolveColor(p['sectionBg'], settings) ? `background-color:${resolveColor(p['sectionBg'], settings)}` : '',
        p['borderRadius'] && p['borderRadius'] !== '0px' ? `border-radius:${p['borderRadius']}` : '',
        `padding:${resolvedInnerPadding}`,
        `text-align:${effectiveAlign}`,
      ].filter(Boolean).join(';')
      return `<mj-text ${textAttrsCommon} padding="${getDefaultSectionPadding(settings)}"><div style="${standaloneInnerStyle}">${p['content'] ?? ''}</div></mj-text>`
    }

    case 'image': {
      const width = p['width'] ?? '100%'
      const imgSrc = p['src'] || (() => {
        const phColor = settings?.fontColor ?? '#000000'
        const ph = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="80" viewBox="0 0 600 80"><rect x="1" y="1" width="598" height="78" fill="none" stroke="${phColor}" stroke-width="1.5" stroke-dasharray="6 4" stroke-opacity="0.25"/><g transform="translate(300,40)" stroke="${phColor}" stroke-width="1.5" fill="none" opacity="0.4"><rect x="-12" y="-12" width="24" height="24" rx="2"/><circle cx="-4.5" cy="-4.5" r="2"/><path d="m12 4-6.5-6.5L-12 12"/></g></svg>`
        return `data:image/svg+xml;base64,${btoa(ph)}`
      })()
      if (insideColumn) {
        const imgBg = resolveColor(p['sectionBg'], settings)
        const imgBr = p['borderRadius'] || settings?.defaultBorderRadius || ''
        const imgBw = p['borderWidth'] || settings?.defaultBorderWidth || ''
        const imgBs = p['borderStyle'] || settings?.defaultBorderStyle || 'solid'
        const imgBc = resolveColor(p['borderColor'], settings) || '#e5e7eb'
        const imgPaddingBasePx = parseInt(settings?.padding ?? '4px', 10)
        const imgInnerPad = resolveRelativePadding(p['innerPadding'], imgPaddingBasePx) ?? '0'
        const imgOuterPad = resolveRelativePadding(p['outerPadding'], imgPaddingBasePx) ?? settings?.padding ?? '4px'
        const outerStyle = `padding:${imgOuterPad};box-sizing:border-box`
        const containerStyle = [
          imgBg ? `background-color:${imgBg}` : '',
          imgBr && imgBr !== '0px' ? `border-radius:${imgBr};overflow:hidden` : '',
          imgBw ? `border:${imgBw} ${imgBs} ${imgBc}` : '',
          imgInnerPad && imgInnerPad !== '0' ? `padding:${imgInnerPad}` : '',
          `text-align:${p['align'] ?? 'center'}`,
        ].filter(Boolean).join(';')
        const imgBrStyle = p['imgBorderRadius'] && p['imgBorderRadius'] !== '0px' ? `border-radius:${p['imgBorderRadius']};` : ''

        // Placeholder colors (matching outside-column style)
        const phColor = settings?.fontColor ?? '#000000'
        const r = parseInt(phColor.slice(1, 3), 16) || 0
        const g = parseInt(phColor.slice(3, 5), 16) || 0
        const b = parseInt(phColor.slice(5, 7), 16) || 0
        const borderClr = `rgba(${r},${g},${b},0.25)`
        const iconClr = `rgba(${r},${g},${b},0.4)`

        const imgContent = p['src']
          ? (() => {
              const imgWidthStyle = width && !width.includes('%') ? `width:${width};max-width:100%` : 'max-width:100%;width:100%'
              return `<img src="${imgSrc}" alt="${p['alt'] ?? ''}" style="${imgWidthStyle};height:auto;display:block;margin:0 auto;${imgBrStyle}" />`
            })()
          : `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;height:80px;border:1px dashed ${borderClr};border-radius:${p['imgBorderRadius'] ?? '0px'};color:${iconClr};font-size:11px;gap:6px;box-sizing:border-box"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg></div>`
        const imgSanitizedId = block.id.replace(/[^a-zA-Z0-9]/g, '')
        return `<div class="blk-${imgSanitizedId}" style="${outerStyle}"><div style="${containerStyle}">${imgContent}</div></div>`
      }
      return `<mj-image
        src="${imgSrc}"
        alt="${p['alt'] ?? ''}"
        align="${colAlign ?? p['align'] ?? 'center'}"
        ${width && !width.includes('%') ? `width="${width}"` : ''}
        ${p['imgBorderRadius'] && p['imgBorderRadius'] !== '0px' ? `border-radius="${p['imgBorderRadius']}"` : ''}
        padding="0"
      />`
    }

    case 'button': {
      const basePx = settings?.fontSize ?? 14
      const resolvedFontSize = resolveRelativeFontSize(p['fontSize'], basePx) ?? `${basePx}px`
      const btnBorder = p['borderWidth'] && resolveColor(p['borderColor'], settings) ? `${p['borderWidth']} ${p['borderStyle'] || 'solid'} ${resolveColor(p['borderColor'], settings)}` : 'none'
      if (insideColumn) {
        const btnBg = resolveColor(p['sectionBg'], settings)
        const btnSecBr = p['secBorderRadius'] || settings?.defaultBorderRadius || ''
        const btnSecBw = p['secBorderWidth'] || settings?.defaultBorderWidth || ''
        const btnSecBs = p['secBorderStyle'] || settings?.defaultBorderStyle || 'solid'
        const btnSecBc = resolveColor(p['secBorderColor'], settings) || '#e5e7eb'
        const btnPaddingBasePx = parseInt(settings?.padding ?? '4px', 10)
        const btnOuterPad = resolveRelativePadding(p['outerPadding'], btnPaddingBasePx) ?? settings?.padding ?? '4px'
        const btnSecInnerPad = resolveRelativePadding(p['secInnerPadding'], btnPaddingBasePx) ?? settings?.padding ?? '4px'
        const btnBgColor = resolveColor(p['backgroundColor'], settings) || '#3b82f6'
        const btnTextColor = resolveColor(p['color'], settings) || '#ffffff'
        const btnRadius = p['borderRadius'] ?? '3px'
        const btnPadding = resolveRelativePadding(p['padding'], btnPaddingBasePx) ?? '12px 24px'
        const btnAlign = p['align'] ?? 'center'
        const outerStyle = `padding:${btnOuterPad};box-sizing:border-box`
        const containerStyle = [
          btnBg ? `background-color:${btnBg}` : '',
          btnSecBr && btnSecBr !== '0px' ? `border-radius:${btnSecBr};overflow:hidden` : '',
          btnSecBw ? `border:${btnSecBw} ${btnSecBs} ${btnSecBc}` : '',
          btnSecInnerPad ? `padding:${btnSecInnerPad}` : '',
          `text-align:${btnAlign}`,
        ].filter(Boolean).join(';')
        const btnAnchorStyle = [
          'display:inline-block',
          `background:${btnBgColor}`,
          `color:${btnTextColor}`,
          `border-radius:${btnRadius}`,
          `padding:${btnPadding}`,
          btnBorder !== 'none' ? `border:${btnBorder}` : '',
          `font-family:${(p['fontFamily'] as string | undefined) ?? 'Arial, sans-serif'}`,
          `font-size:${resolvedFontSize}`,
          'text-decoration:none',
          'line-height:1.2',
          p['fontStyle'] === 'bold' ? 'font-weight:bold' : '',
          p['fontStyle'] === 'italic' ? 'font-style:italic' : '',
        ].filter(Boolean).join(';')
        const btnSanitizedId = block.id.replace(/[^a-zA-Z0-9]/g, '')
        return `<div class="blk-${btnSanitizedId}" style="${outerStyle}"><div style="${containerStyle}"><a href="${p['href'] ?? '#'}" style="${btnAnchorStyle}">${p['text'] ?? 'Klicken Sie hier'}</a></div></div>`
      }
      const btnPaddingBasePx = parseInt(settings?.padding ?? '4px', 10)
      const resolvedBtnInnerPadding = resolveRelativePadding(p['innerPadding'], btnPaddingBasePx) ?? '12px 24px'
      return `<mj-button
        href="${p['href'] ?? '#'}"
        align="${colAlign ?? p['align'] ?? 'center'}"
        background-color="${resolveColor(p['backgroundColor'], settings) || '#3b82f6'}"
        color="${resolveColor(p['color'], settings) || '#ffffff'}"
        font-size="${resolvedFontSize}"
        ${p['fontFamily'] ? `font-family="${p['fontFamily']}"` : ''}
        ${p['fontStyle'] === 'bold'   ? `font-weight="bold"`   : ''}
        ${p['fontStyle'] === 'italic' ? `font-style="italic"` : ''}
        padding="0"
        inner-padding="${resolvedBtnInnerPadding}"
        border-radius="${p['borderRadius'] ?? '3px'}"
        border="${btnBorder}"
      >${p['text'] ?? 'Klicken Sie hier'}</mj-button>`
    }

    case 'divider': {
      // Line-specific keys (renamed) with fallback to old keys for backward compat
      const lineBorderWidth = p['lineBorderWidth'] || p['borderWidth'] || '1px'
      const lineBorderStyle = p['lineBorderStyle'] || p['borderStyle'] || 'solid'
      const lineBorderColor = resolveColor(p['lineBorderColor'] ?? p['borderColor'], settings) || '#e5e7eb'
      const dividerText = p['text'] ?? ''
      if (insideColumn) {
        const divBg = resolveColor(p['sectionBg'], settings)
        const divBr = p['secBorderRadius'] || settings?.defaultBorderRadius || ''
        const divBw = p['secBorderWidth'] || settings?.defaultBorderWidth || ''
        const divBs = p['secBorderStyle'] || settings?.defaultBorderStyle || 'solid'
        const divBc = resolveColor(p['secBorderColor'], settings) || '#e5e7eb'
        const divPaddingBasePx = parseInt(settings?.padding ?? '4px', 10)
        const divInnerPad = resolveRelativePadding(p['innerPadding'], divPaddingBasePx) ?? settings?.padding ?? '4px'
        const divOuterPad = resolveRelativePadding(p['outerPadding'], divPaddingBasePx) ?? settings?.padding ?? '4px'
        const outerStyle = `padding:${divOuterPad};box-sizing:border-box`
        const containerStyle = [
          divBg ? `background-color:${divBg}` : '',
          divBr && divBr !== '0px' ? `border-radius:${divBr}` : '',
          divBw ? `border:${divBw} ${divBs} ${divBc}` : '',
          divInnerPad ? `padding:${divInnerPad}` : '',
        ].filter(Boolean).join(';')
        const lineStyle = `border-top:${lineBorderWidth} ${lineBorderStyle} ${lineBorderColor};vertical-align:middle;`
        const lineContent = dividerText
          ? `<table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td style="${lineStyle}width:40%;"> </td><td style="text-align:center;padding:0 10px;white-space:nowrap;vertical-align:middle;">${dividerText}</td><td style="${lineStyle}width:40%;"> </td></tr></tbody></table>`
          : `<div style="${lineStyle}margin:0;"> </div>`
        const divSanitizedId = block.id.replace(/[^a-zA-Z0-9]/g, '')
        return `<div class="blk-${divSanitizedId}" style="${outerStyle}"><div style="${containerStyle}">${lineContent}</div></div>`
      }
      if (dividerText) {
        const lineStyle = `border-top:${lineBorderWidth} ${lineBorderStyle} ${lineBorderColor};vertical-align:middle;`
        return `<mj-text padding="0"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td style="${lineStyle}width:40%;"> </td><td style="text-align:center;padding:0 10px;white-space:nowrap;vertical-align:middle;">${dividerText}</td><td style="${lineStyle}width:40%;"> </td></tr></tbody></table></mj-text>`
      }
      return `<mj-divider border-width="${lineBorderWidth}" border-style="${lineBorderStyle}" border-color="${lineBorderColor}" padding="0" />`
    }

    case 'columns': {
      const count = Math.min(Math.max(Number(p['columns'] ?? 2), 1), 3)
      const columnBlocks = (block.props['columnBlocks'] as EmailBlock[][] | undefined) ?? []
      const sectionBg = resolveColor(p['sectionBg'], settings)
      const rawWidths = p['columnWidths'] ?? ''
      const widthRatios = rawWidths ? String(rawWidths).split(',').map(Number) : null
      const colPropsArr = (Array.isArray(p['columnProps']) ? p['columnProps'] : []) as Record<string, string>[]

      // Only render enabled (visible) columns
      const enabledIndices = Array.from({ length: count }, (_, i) => i)
        .filter(i => (colPropsArr[i] ?? {})['disabled'] !== 'true')
      const enabledCount = enabledIndices.length
      const enabledWidthRatiosRaw = widthRatios ? enabledIndices.map(i => widthRatios[i] ?? 1) : null
      const enabledTotalRatio = enabledWidthRatiosRaw
        ? enabledWidthRatiosRaw.reduce((a, b) => a + b, 0)
        : enabledCount

      // Build table rows for columns
      const colCells: string[] = []
      for (let ei = 0; ei < enabledCount; ei++) {
        const i = enabledIndices[ei]!
        const cp = colPropsArr[i] ?? {}
        const children = (columnBlocks[i] ?? []).filter((cb) =>
          ['text', 'image', 'button', 'divider'].includes(cb.type),
        )
        const colHAlign = cp['align'] as string | undefined
        const isEmpty = children.length === 0

        // Cell content
        const childContent = (() => {
          if (!isEmpty) return children.map((cb) => blockToMjml(cb, settings, true, colHAlign)).join('\n')
          // Placeholder for empty column with dashed border frame (like image block)
          const phColor = settings?.fontColor ?? '#000000'
          const r = parseInt(phColor.slice(1, 3), 16) || 0
          const g = parseInt(phColor.slice(3, 5), 16) || 0
          const b = parseInt(phColor.slice(5, 7), 16) || 0
          const borderClr = `rgba(${r},${g},${b},0.25)`
          const iconClr = `rgba(${r},${g},${b},0.4)`
          const colNum = cp['col'] ? Number(cp['col']) : i + 1
          return `<div style="position:relative;height:100%;min-height:120px;margin:4px;border:1.5px dashed ${borderClr};border-radius:2px;box-sizing:border-box;"><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);line-height:0;"><svg width="22" height="30" viewBox="0 0 22 30" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="20" height="28" rx="2.5" stroke="${iconClr}" stroke-width="1.5"/><text x="11" y="18" text-anchor="middle" font-family="sans-serif" font-size="11" fill="${iconClr}">${colNum}</text></svg></div></div>`
        })()

        // Cell styling
        const rawColBg = cp['backgroundColor'] as string
        const bg = !isEmpty && rawColBg && rawColBg !== 'backgroundColor' ? resolveColor(rawColBg, settings) : ''
        const colBrStr = cp['borderRadius'] ?? ''
        const colBw = cp['borderWidth'] || ''
        const colBs = cp['borderStyle'] || 'solid'
        const colBc = resolveColor(cp['borderColor'], settings) || '#e5e7eb'
        const colPad = cp['padding'] || '0px'

        // Calculate cell width
        const cellWidth = enabledWidthRatiosRaw
          ? (enabledWidthRatiosRaw[ei] ?? 0) / enabledTotalRatio * 100
          : 100 / enabledCount

        const cellStyleParts = [
          `padding:${colPad}`,
          `vertical-align:top`,
          `height:1px`,
          bg ? `background-color:${bg}` : '',
          colBw ? `border:${colBw} ${colBs} ${colBc}` : '',
          colBrStr && colBrStr !== '0px' ? `border-radius:${colBrStr}` : '',
        ].filter(Boolean).join(';')

        // Wrap content in a flex container for full height stretching
        const wrappedContent = `<div style="display:flex;flex-direction:column;height:100%;">${childContent}</div>`

        const sanitizedBlockId = block.id.replace(/[^a-zA-Z0-9]/g, '')
        const colCellClass = `col${sanitizedBlockId.slice(0, 10)}i${i}`
        colCells.push(
          `<td width="${cellWidth.toFixed(1)}%" class="${colCellClass}" style="${cellStyleParts}">${wrappedContent}</td>`,
        )
      }

      // Render simple table structure without extra styling
      const sanitizedId = block.id.replace(/[^a-zA-Z0-9]/g, '')
      const sectionBgAttr = sectionBg ? ` background-color="${sectionBg}"` : ''

      // Add responsive CSS for mobile
      const responsiveCss = enabledIndices
        .map((i) => `.col${sanitizedId.slice(0, 10)}i${i}`)
        .join(', ')

      const colCls = `col${sanitizedId.slice(0, 10)}`
      const colChildSelectors = enabledIndices.map((i) => `.${colCls}i${i} > div`).join(',')
      const colBlockSelectors = enabledIndices.map((i) => `.${colCls}i${i} > div > [class^="blk-"]`).join(',')
      const colBlockInnerSelectors = enabledIndices.map((i) => `.${colCls}i${i} > div > [class^="blk-"] > div`).join(',')
      _previewCss.set(`col-children-${sanitizedId}`,
        `${colChildSelectors} { min-height: 100%; }
         ${colBlockSelectors} { flex: 1; display: flex; flex-direction: column; }
         ${colBlockInnerSelectors} { flex: 1; }`)

      if (responsiveCss) {
        _previewCss.set(`col-responsive-${sanitizedId}`,
          `@media only screen and (max-width: 480px) {
            .blk-${sanitizedId} table, .blk-${sanitizedId} tr { display: block !important; width: 100% !important; }
            ${responsiveCss} { display: block !important; width: 100% !important; height: auto !important; }
            ${colChildSelectors} { height: auto !important; min-height: unset !important; }
          }`)
      }

      return `<mj-section padding="0"${sectionBgAttr} css-class="blk-${sanitizedId}"><mj-column padding="0"><mj-text padding="0"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;"><tr>${colCells.join('')}</tr></table></mj-text></mj-column></mj-section>`
    }

    case 'hero': {
      const heroHeight = p['height'] ?? '200px'
      const heroSrc = p['src'] ?? ''
      const heroBg = resolveColor(p['backgroundColor'], settings) || settings?.backgroundColor || '#1e3a5f'
      const bgPos = p['backgroundPosition'] ?? 'center center'
      const textAlign = p['textAlign'] ?? 'center'
      const basePx = settings?.fontSize ?? 14

      // Border (matching other blocks - using sec* prefix like button/divider)
      const heroBw = p['secBorderWidth'] || settings?.defaultBorderWidth || ''
      const heroBs = p['secBorderStyle'] || settings?.defaultBorderStyle || 'solid'
      const heroBc = resolveColor(p['secBorderColor'], settings) || '#e5e7eb'
      const heroBorderAttr = heroBw ? ` border="${heroBw} ${heroBs} ${heroBc}"` : ''
      const heroBrVal = p['secBorderRadius'] || settings?.defaultBorderRadius || '0px'
      const heroBorderRadiusAttr = heroBrVal && heroBrVal !== '0px' ? ` border-radius="${heroBrVal}"` : ''

      // Padding (matching other blocks)
      const heroPaddingBasePx = parseInt(settings?.padding ?? '4px', 10)
      const heroOuterPad = resolveRelativePadding(p['outerPadding'], heroPaddingBasePx) ?? getDefaultSectionPadding(settings)
      const heroInnerPad = resolveRelativePadding(p['innerPadding'], heroPaddingBasePx) ?? settings?.padding ?? '4px'

      const line1Style = p['line1FontStyle'] || settings?.fontStyle || ''
      const resolvedLine1FontSize = resolveRelativeFontSize(p['line1FontSize'], basePx, 40) ?? `${Math.round(basePx * 2)}px`
      const line1Attrs = [
        `color="${resolveColor(p['line1Color'], settings) || settings?.fontColor || '#333333'}"`,
        `font-size="${resolvedLine1FontSize}"`,
        p['line1FontFamily'] ? `font-family="${p['line1FontFamily']}"` : '',
        line1Style === 'bold'   ? `font-weight="bold"`   : '',
        line1Style === 'italic' ? `font-style="italic"` : '',
        `align="${textAlign}"`,
        `padding="0 0 12px 0"`,
      ].filter(Boolean).join(' ')

      const resolvedLine2FontSize = resolveRelativeFontSize(p['line2FontSize'], basePx) ?? `${basePx}px`
      const line2Attrs = [
        `color="${resolveColor(p['line2Color'], settings) || settings?.fontColor || '#333333'}"`,
        `font-size="${resolvedLine2FontSize}"`,
        p['line2FontFamily'] ? `font-family="${p['line2FontFamily']}"` : '',
        p['line2FontStyle'] === 'bold' ? `font-weight="bold"` : '',
        p['line2FontStyle'] === 'italic' ? `font-style="italic"` : '',
        `align="${textAlign}"`,
        `padding="0"`,
      ].filter(Boolean).join(' ')

      const heroLines = [
        p['line1Text'] ? `<mj-text ${line1Attrs}>${p['line1Text']}</mj-text>` : '',
        p['line2Text'] ? `<mj-text ${line2Attrs}>${p['line2Text']}</mj-text>` : '',
      ].filter(Boolean).join('\n') || `<mj-text padding="0"> </mj-text>`

      const heroValign = p['verticalAlign'] ?? 'middle'

      // CSS: background-image on the column (mj-column has no background-url attr),
      // plus min-height and vertical-align enforcement
      const heroCls = `hero-${sanitizeCls(block.id)}`
      const bgImgCss = heroSrc
        ? `.${heroCls}{background-image:url('${heroSrc}')!important;background-position:${bgPos}!important;background-size:cover!important;background-repeat:no-repeat!important;background-attachment:fixed!important;border-radius:${heroBrVal}!important;overflow:hidden!important;}.${heroCls}>table{overflow:hidden!important;border-radius:${heroBrVal}!important;}.${heroCls}>table>tbody>tr>td{background-image:url('${heroSrc}')!important;background-position:${bgPos}!important;background-size:cover!important;background-repeat:no-repeat!important;overflow:hidden!important;border-radius:${heroBrVal}!important;}`
        : ''
      _previewCss.set(heroCls, [
        bgImgCss,
        `.${heroCls}>table{min-height:${heroHeight}!important;}`,
        `.${heroCls}>table>tbody>tr>td{min-height:${heroHeight}!important;vertical-align:${heroValign}!important;}`,
      ].filter(Boolean).join(''))

      return `<mj-section padding="${heroOuterPad}" css-class="blk-${sanitizeCls(block.id)}">
  <mj-column background-color="${heroBg}" padding="${heroInnerPad}" vertical-align="${heroValign}"${heroBorderAttr}${heroBorderRadiusAttr} css-class="${heroCls}">
${heroLines}
  </mj-column>
</mj-section>`
    }

    case 'social': {
      const ICON_COLORS_MJML: Record<string, string> = {
        facebook: '#1877F2', twitter: '#000000', instagram: '#E1306C', linkedin: '#0A66C2',
        youtube: '#FF0000', tiktok: '#010101', pinterest: '#E60023', discord: '#5865F2',
        telegram: '#2CA5E0', whatsapp: '#25D366', email: '#6b7280', phone: '#6b7280',
        globe: '#6b7280', github: '#181717', rss: '#F26522',
        star: '#f59e0b', trophy: '#f59e0b', crown: '#f59e0b', diamond: '#60a5fa',
        heart: '#ef4444', fire: '#f97316', sparkle: '#a78bfa', check: '#22c55e',
        number1: '#6b7280', number2: '#6b7280', number3: '#6b7280', question: '#6b7280', exclamation: '#6b7280',
      }
      const ICON_SVGS_MJML: Record<string, string> = {
        facebook: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 48 48" fill="FILL"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.514c-1.491 0-1.956.93-1.956 1.887v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>',
        twitter: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 48 48" fill="FILL"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L2.25 2.25h6.978l4.255 5.623L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>',
        instagram: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 48 48" fill="FILL"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>',
        linkedin: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 48 48" fill="FILL"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
        youtube: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 48 48" fill="FILL"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
        tiktok: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 48 48" fill="FILL"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.79a8.18 8.18 0 0 0 4.78 1.52V6.85a4.85 4.85 0 0 1-1.01-.16z"/></svg>',
        pinterest: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 48 48" fill="FILL"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>',
        discord: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 48 48" fill="FILL"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>',
        telegram: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 48 48" fill="FILL"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>',
        whatsapp: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 48 48" fill="FILL"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>',
        email: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 48 48" fill="FILL"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>',
        phone: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 48 48" fill="FILL"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>',
        globe: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 48 48" fill="FILL"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>',
        github: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 48 48" fill="FILL"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
        rss:         '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 48 48" fill="FILL"><path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/></svg>',
        star:        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 48 48" fill="FILL"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>',
        trophy:      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 48 48" fill="FILL"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm7 8c-1.65 0-3-1.35-3-3V5h6v8c0 1.65-1.35 3-3 3zm5-5.18V7h2v1c0 1.3-.84 2.4-2 2.82z"/></svg>',
        crown:       '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 48 48" fill="FILL"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm0 2h14v2H5v-2z"/></svg>',
        diamond:     '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 48 48" fill="FILL"><path d="M12 2L2 8l10 14L22 8z"/></svg>',
        heart:       '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 48 48" fill="FILL"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
        fire:        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 48 48" fill="FILL"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/></svg>',
        sparkle:     '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 48 48" fill="FILL"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>',
        check:       '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 48 48" fill="FILL"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
        number1:     '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 48 48"><text x="12" y="18.5" text-anchor="middle" fill="FILL" font-size="19" font-weight="bold" font-family="Arial,sans-serif">1</text></svg>',
        number2:     '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 48 48"><text x="12" y="18.5" text-anchor="middle" fill="FILL" font-size="19" font-weight="bold" font-family="Arial,sans-serif">2</text></svg>',
        number3:     '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 48 48"><text x="12" y="18.5" text-anchor="middle" fill="FILL" font-size="19" font-weight="bold" font-family="Arial,sans-serif">3</text></svg>',
        question:    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 48 48"><text x="12" y="18.5" text-anchor="middle" fill="FILL" font-size="19" font-weight="bold" font-family="Arial,sans-serif">?</text></svg>',
        exclamation: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 48 48"><text x="12" y="18.5" text-anchor="middle" fill="FILL" font-size="19" font-weight="bold" font-family="Arial,sans-serif">!</text></svg>',
      }
      const iconSize = p['iconSize'] ?? '28'
      const iconSizePx = `${iconSize}px`
      const DEFAULT_TYPES = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok', 'pinterest']

      // Support both `networks` string prop (new API) and `icon1Type`/`icon2Type` props (UI API)
      let elements: string
      if (p['networks'] !== undefined) {
        const networkList = p['networks'] ? p['networks'].split(',').map((s) => s.trim()).filter(Boolean) : ['facebook', 'twitter', 'instagram']
        elements = networkList.map((netName) => {
          const bgColor = ICON_COLORS_MJML[netName] ?? '#6b7280'
          const svgTemplate = ICON_SVGS_MJML[netName]
          const svgStr = svgTemplate ? svgTemplate.replace('FILL', '#ffffff') : ''
          const src = svgStr ? `data:image/svg+xml;base64,${btoa(svgStr)}` : ''
          return `<mj-social-element name="${netName}"${src ? ` src="${src}"` : ''} background-color="${bgColor}" href="#" icon-size="${iconSizePx}" padding="4px 8px" border-radius="4px"></mj-social-element>`
        }).join('\n')
      } else {
        const iconCount = Math.min(Math.max(Number(p['iconCount'] ?? 3), 1), 7)
        elements = Array.from({ length: iconCount }, (_, i) => {
          const n = i + 1
          const type = p[`icon${n}Type`] ?? DEFAULT_TYPES[i]
          const href = p[`icon${n}Href`] ?? ''
          const shape = p[`icon${n}Shape`] ?? 'rounded'
          const noBackground = shape === 'none'
          const bgColor = noBackground
            ? 'transparent'
            : (resolveColor(p[`icon${n}Bg`], settings) || settings?.fontColor || (ICON_COLORS_MJML[type] ?? '#6b7280'))
          const iconColor = resolveColor(p[`icon${n}Color`], settings) || (noBackground ? (ICON_COLORS_MJML[type] ?? '#6b7280') : '#ffffff')
          const svgTemplate = ICON_SVGS_MJML[type]
          const svgStr = svgTemplate ? svgTemplate.replace('FILL', iconColor) : ''
          const src = svgStr ? `data:image/svg+xml;base64,${btoa(svgStr)}` : ''
          const borderRadius = { square: '0px', rounded: '4px', circle: '100px' }[shape] ?? '4px'
          return `<mj-social-element name="${type}"${src ? ` src="${src}"` : ''} background-color="${bgColor}" href="${href || '#'}" icon-size="${iconSizePx}" padding="4px 8px" border-radius="${borderRadius}"></mj-social-element>`
        }).filter(Boolean).join('\n')
      }
      const socialBg = resolveColor(p['sectionBg'], settings) ? ` background-color="${resolveColor(p['sectionBg'], settings)}"` : ''
      const socialBr = p['borderRadius'] || settings?.defaultBorderRadius || '4px'
      const socialBrAttr = socialBr && socialBr !== '0px' ? ` border-radius="${socialBr}"` : ''
      const socialBw = p['borderWidth'] || settings?.defaultBorderWidth || ''
      const socialBs = p['borderStyle'] || settings?.defaultBorderStyle || 'solid'
      const socialBc = resolveColor(p['borderColor'], settings) || '#e5e7eb'
      const socialBorderAttr = socialBw ? ` border="${socialBw} ${socialBs} ${socialBc}"` : ''
      const paddingBasePx = parseInt(settings?.padding ?? '4px', 10)
      const socialInnerPadding = resolveRelativePadding(p['innerPadding'], paddingBasePx) ?? settings?.padding ?? '4px'
      return `<mj-section padding="${resolveRelativePadding(p['outerPadding'], paddingBasePx) ?? getDefaultSectionPadding(settings)}" css-class="blk-${sanitizeCls(block.id)}">\n<mj-column${socialBg}${socialBrAttr}${socialBorderAttr} padding="${socialInnerPadding}">\n<mj-social align="${p['align'] ?? 'center'}" padding="0" icon-size="${iconSizePx}">\n${elements}\n</mj-social>\n</mj-column>\n</mj-section>`
    }

    case 'navbar': {
      const count = Math.min(Math.max(Number(p['linkCount'] ?? 3), 1), 6)
      const separator = p['separator'] ?? ' | '
      const linkColor = resolveColor(p['color'], settings) || settings?.fontColor || '#374151'
      const links = Array.from({ length: count })
        .map((_, i) => {
          const text = p[`link${i + 1}Text`] || `Link ${i + 1}`
          const href = p[`link${i + 1}Href`] || '#'
          return `<a href="${href}" class="navbar-link" style="color:${linkColor};text-decoration:none;">${text}</a>`
        })
        .join(`<span style="color:${linkColor};opacity:0.4;">${separator}</span>`)
      const basePx = settings?.fontSize ?? 14
      const resolvedFontSize = resolveRelativeFontSize(p['fontSize'], basePx)
      const textAttrs = [
        resolvedFontSize ? `font-size="${resolvedFontSize}"` : '',
        p['fontFamily'] ? `font-family="${p['fontFamily']}"` : '',
        p['fontStyle'] === 'bold' ? `font-weight="bold"` : '',
        p['fontStyle'] === 'italic' ? `font-style="italic"` : '',
      ].filter(Boolean).join(' ')
      const navBg = resolveColor(p['sectionBg'], settings) ? ` background-color="${resolveColor(p['sectionBg'], settings)}"` : ''
      const navBr = p['borderRadius'] || settings?.defaultBorderRadius || '4px'
      const navBrAttr = navBr && navBr !== '0px' ? ` border-radius="${navBr}"` : ''
      const navBw = p['borderWidth'] || settings?.defaultBorderWidth || ''
      const navBs = p['borderStyle'] || settings?.defaultBorderStyle || 'solid'
      const navBc = resolveColor(p['borderColor'], settings) || '#e5e7eb'
      const navBorderAttr = navBw ? ` border="${navBw} ${navBs} ${navBc}"` : ''
      const paddingBasePx = parseInt(settings?.padding ?? '4px', 10)
      const navInnerPadding = resolveRelativePadding(p['innerPadding'], paddingBasePx) ?? settings?.padding ?? '4px'
      return `<mj-section padding="${resolveRelativePadding(p['outerPadding'], paddingBasePx) ?? getDefaultSectionPadding(settings)}" css-class="blk-${sanitizeCls(block.id)}">\n<mj-column${navBg}${navBrAttr}${navBorderAttr} padding="${navInnerPadding}">\n<mj-text align="${p['align'] ?? 'center'}" ${textAttrs} padding="0">${links}</mj-text>\n</mj-column>\n</mj-section>`
    }

    case 'video': {
      const vidSrc = p['src'] ?? ''
      const thumbSrc = p['thumbnailSrc'] ?? ''
      const showPlayButton = (p['showPlayButton'] ?? 'false') === 'true'
      const paddingBasePx = parseInt(settings?.padding ?? '4px', 10)
      const outerPadding = resolveRelativePadding(p['outerPadding'], paddingBasePx) ?? getDefaultSectionPadding(settings)
      const vidBorderRadius = p['borderRadius'] && p['borderRadius'] !== '0px' ? ` border-radius="${p['borderRadius']}"` : ''
      const phColor = settings?.fontColor ?? '#000000'

      const placeholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="160" viewBox="0 0 600 160"><rect x="1" y="1" width="598" height="158" fill="none" stroke="${phColor}" stroke-width="1.5" stroke-dasharray="6 4" stroke-opacity="0.25"/><polygon points="291,65 321,80 291,95" fill="${phColor}" opacity="0.4"/></svg>`

      const compositeSvg = thumbSrc && showPlayButton
        ? `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="338" viewBox="0 0 600 338"><image href="${thumbSrc}" width="600" height="338" preserveAspectRatio="xMidYMid slice"/><circle cx="300" cy="169" r="32" fill="rgba(0,0,0,0.5)"/><polygon points="292,153 316,169 292,185" fill="white"/></svg>`
        : null
      const imgSrc = compositeSvg
        ? `data:image/svg+xml;base64,${btoa(compositeSvg)}`
        : thumbSrc || `data:image/svg+xml;base64,${btoa(placeholderSvg)}`
      const imgTag = `<mj-image
        src="${imgSrc}"
        alt="${p['alt'] ?? ''}"
        align="${p['align'] ?? 'center'}"
        ${vidSrc ? `href="${vidSrc}"` : ''}
        ${vidBorderRadius ? `border-radius="${p['borderRadius']}"` : ''}
        padding="0"
      />`
      const vidColBg = resolveColor(p['sectionBg'], settings) ? ` background-color="${resolveColor(p['sectionBg'], settings)}"` : ''
      const vidSecBr = p['secBorderRadius'] || settings?.defaultBorderRadius || '4px'
      const vidSecBrAttr = vidSecBr && vidSecBr !== '0px' ? ` border-radius="${vidSecBr}"` : ''
      const vidSecBw = p['secBorderWidth'] || settings?.defaultBorderWidth || ''
      const vidSecBs = p['secBorderStyle'] || settings?.defaultBorderStyle || 'solid'
      const vidSecBc = resolveColor(p['secBorderColor'], settings) || '#e5e7eb'
      const vidSecBorderAttr = vidSecBw ? ` border="${vidSecBw} ${vidSecBs} ${vidSecBc}"` : ''
      const vidInnerPadding = resolveRelativePadding(p['innerPadding'], paddingBasePx) ?? settings?.padding ?? '4px'
      return `<mj-section padding="${outerPadding}" css-class="blk-${sanitizeCls(block.id)}">\n<mj-column${vidColBg}${vidSecBrAttr}${vidSecBorderAttr} padding="${vidInnerPadding}">\n${imgTag}\n</mj-column>\n</mj-section>`
    }

    case 'countdown': {
      const cdBg = resolveColor(p['sectionBg'], settings) ? ` background-color="${resolveColor(p['sectionBg'], settings)}"` : ''
      const targetDate = p['targetDate'] ?? ''
      let cdDays = 0, cdHours = 0, cdMins = 0, cdSecs = 0
      if (targetDate) {
        const diff = Math.max(0, new Date(targetDate).getTime() - Date.now())
        const totalSecs = Math.floor(diff / 1000)
        cdDays  = Math.floor(totalSecs / 86400)
        cdHours = Math.floor((totalSecs % 86400) / 3600)
        cdMins  = Math.floor((totalSecs % 3600) / 60)
        cdSecs  = totalSecs % 60
      }
      const bgColor    = resolveColor(p['bgColor'], settings)    || '#3b82f6'
      const textColor  = resolveColor(p['textColor'], settings)  || '#ffffff'
      const labelColor = resolveColor(p['labelColor'], settings) || settings?.fontColor || '#6b7280'
      const basePx = settings?.fontSize ?? 14
      const fontSize   = resolveRelativeFontSize(p['fontSize'], basePx, 40) ?? `${basePx * 2}px`
      const labelFontSize = resolveRelativeFontSize(p['labelFontSize'], basePx) ?? `${basePx}px`
      const cdFontFamily      = p['fontFamily']      ? `font-family:${p['fontFamily']};`      : ''
      const cdLabelFontFamily = p['labelFontFamily'] ? `font-family:${p['labelFontFamily']};` : ''
      const cdFontStyleRaw    = p['fontStyle'] ?? 'bold'
      const cdFontWeight      = cdFontStyleRaw === 'bold' ? 'bold' : 'normal'
      const cdFontStyle       = cdFontStyleRaw === 'italic' ? 'italic' : 'normal'
      const cdLabelStyleRaw   = p['labelFontStyle'] ?? ''
      const cdLabelWeight     = cdLabelStyleRaw === 'bold' ? 'bold' : 'normal'
      const cdLabelStyle      = cdLabelStyleRaw === 'italic' ? 'italic' : 'normal'
      const pad2 = (n: number) => String(n).padStart(2, '0')
      const cdAlign = p['align'] ?? 'center'
      // cdPadding intentionally unused – padding handled via outerPadding/innerPadding
      const showSeconds = (p['showSeconds'] ?? 'true') === 'true'
      const unitLabels = [
        { value: pad2(cdDays),  label: p['labelDays']    ?? 'Days' },
        { value: pad2(cdHours), label: p['labelHours']   ?? 'Hours' },
        { value: pad2(cdMins),  label: p['labelMinutes'] ?? 'Minutes' },
        ...(showSeconds ? [{ value: pad2(cdSecs), label: p['labelSeconds'] ?? 'Seconds' }] : []),
      ]
      const cells = unitLabels.map(({ value, label }) =>
        `<td align="center" style="padding:0 6px;">
          <div style="background-color:${bgColor};border-radius:6px;color:${textColor};font-size:${fontSize};${cdFontFamily}font-weight:${cdFontWeight};font-style:${cdFontStyle};line-height:55px;text-align:center;width:55px;height:55px;">${value}</div>
          <div style="color:${labelColor};font-size:${labelFontSize};${cdLabelFontFamily}font-weight:${cdLabelWeight};font-style:${cdLabelStyle};text-align:center;padding-top:4px;">${label}</div>
        </td>`
      ).join('\n')
      const innerTable = `<table align="${cdAlign}" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>${cells}</tr></table>`
      const paddingBasePx = parseInt(settings?.padding ?? '4px', 10)
      const cdBr = p['borderRadius'] || settings?.defaultBorderRadius || '4px'
      const cdBrAttr = cdBr && cdBr !== '0px' ? ` border-radius="${cdBr}"` : ''
      const cdBw = p['borderWidth'] || settings?.defaultBorderWidth || ''
      const cdBs = p['borderStyle'] || settings?.defaultBorderStyle || 'solid'
      const cdBc = resolveColor(p['borderColor'], settings) || '#e5e7eb'
      const cdBorderAttr = cdBw ? ` border="${cdBw} ${cdBs} ${cdBc}"` : ''
      const cdInnerPadding = resolveRelativePadding(p['innerPadding'], paddingBasePx) ?? settings?.padding ?? '4px'
      return `<mj-section padding="${resolveRelativePadding(p['outerPadding'], paddingBasePx) ?? getDefaultSectionPadding(settings)}" css-class="blk-${sanitizeCls(block.id)}"><mj-column${cdBg}${cdBrAttr}${cdBorderAttr} padding="${cdInnerPadding}"><mj-text align="${cdAlign}" padding="0">${innerTable}</mj-text></mj-column></mj-section>`
    }

    case 'accordion': {
      const accColBg = resolveColor(p['sectionBg'], settings) ? ` background-color="${resolveColor(p['sectionBg'], settings)}"` : ''
      // Support `items` JSON prop (array of {question, answer}) alongside the faqN* UI prop API
      let accItems: { question: string; answer: string }[]
      if (p['items'] !== undefined) {
        try {
          accItems = JSON.parse(p['items'])
        } catch {
          accItems = []
        }
      } else {
        const accCount = Math.min(Math.max(Number(p['faqCount'] ?? 3), 1), 8)
        accItems = Array.from({ length: accCount }, (_, i) => ({
          question: p[`faq${i + 1}Question`] || `${i18n.t('editor.blocks.accordionQuestion')} ${i + 1}`,
          answer: p[`faq${i + 1}Answer`] || `${i18n.t('editor.blocks.accordionAnswer')} ${i + 1}`,
        }))
      }
      const basePx  = settings?.fontSize ?? 14
      const qColor   = resolveColor(p['color'], settings) || '#1f2937'
      const aColor   = resolveColor(p['answerColor'], settings) || '#1f2937'
      const qFSize   = resolveRelativeFontSize(p['fontSize'], basePx)
      const aFSize   = resolveRelativeFontSize(p['answerFontSize'], basePx)
      const qFontFamily      = p['fontFamily'] || settings?.fontFamily || ''
      const aFontFamily      = p['answerFontFamily'] || settings?.fontFamily || ''
      const qFontStyle       = p['questionFontStyle'] || ''
      const aFontStyle       = p['answerFontStyle']   || ''
      const fontFamilyAttr   = qFontFamily ? ` font-family="${qFontFamily}"` : ''
      const aFontFamilyAttr  = aFontFamily ? ` font-family="${aFontFamily}"` : ''
      const qFontStyleAttr   = qFontStyle === 'italic' ? ' font-style="italic"' : ''
      const aFontWeightAttr  = aFontStyle === 'bold'   ? ' font-weight="bold"'  : ''
      const aFontStyleAttr   = aFontStyle === 'italic' ? ' font-style="italic"' : ''
      // Use renamed accordionBorderColor with fallback to old borderColor key for separator
      const bdrColor = resolveColor(p['accordionBorderColor'] ?? p['borderColor'], settings) || '#e5e7eb'
      const bdrWidth = p['accordionBorderWidth'] ?? '1px'
      const bdrStyle = p['accordionBorderStyle'] ?? 'solid'
      const accPaddingBasePx = parseInt(settings?.padding ?? '4px', 10)
      const accPad  = resolveRelativePadding(p['padding'], accPaddingBasePx) ?? settings?.padding ?? '4px'
      const padParts = accPad.split(' ')
      const vPad = padParts[0]
      const hPad = padParts.length >= 2 ? padParts[1] : padParts[0]
      const divider = `<mj-divider border-width="${bdrWidth}" border-style="${bdrStyle}" border-color="${bdrColor}" padding="0 ${hPad}" />`
      const itemsMjml = accItems.map((item, i) => {
        const isLast = i === accItems.length - 1
        return `<mj-text padding="${accPad}" color="${qColor}"${qFSize ? ` font-size="${qFSize}"` : ''}${fontFamilyAttr}${qFontStyle === 'bold' ? ' font-weight="bold"' : ''}${qFontStyleAttr}>${item.question}</mj-text>
<mj-text padding="0 ${hPad} ${vPad}" color="${aColor}"${aFSize ? ` font-size="${aFSize}"` : ''}${aFontFamilyAttr}${aFontWeightAttr}${aFontStyleAttr}>${item.answer}</mj-text>
${isLast ? '' : divider}`
      }).join('\n')
      const paddingBasePx = parseInt(settings?.padding ?? '4px', 10)
      const accBr = p['borderRadius'] || settings?.defaultBorderRadius || '4px'
      const accBrAttr = accBr && accBr !== '0px' ? ` border-radius="${accBr}"` : ''
      const accBw = p['borderWidth'] || settings?.defaultBorderWidth || ''
      const accBs = p['borderStyle'] || settings?.defaultBorderStyle || 'solid'
      const accBc = resolveColor(p['borderColor'], settings) || '#e5e7eb'
      const accBorderAttr = accBw ? ` border="${accBw} ${accBs} ${accBc}"` : ''
      return `<mj-section padding="${resolveRelativePadding(p['outerPadding'], paddingBasePx) ?? getDefaultSectionPadding(settings)}" css-class="blk-${sanitizeCls(block.id)}">\n<mj-column padding="0"${accColBg}${accBrAttr}${accBorderAttr}>\n${itemsMjml}\n</mj-column>\n</mj-section>`
    }

    case 'quote': {
      const accentColor  = resolveColor(p['accentColor'], settings)  || '#3b82f6'
      const textColor    = resolveColor(p['textColor'], settings)    || '#374151'
      const authorColor     = resolveColor(p['authorColor'], settings)  || '#9ca3af'
      const basePx = settings?.fontSize ?? 14
      const authorFontSize  = resolveRelativeFontSize(p['authorFontSize'], basePx) ?? `${basePx}px`
      const authorFontStyleRaw = p['authorFontStyle'] || 'normal'
      const authorFontStyle    = authorFontStyleRaw === 'bold' ? 'normal' : authorFontStyleRaw
      const authorFontWeight   = authorFontStyleRaw === 'bold' ? 'bold' : 'normal'
      const fontStyleRaw = p['fontStyle'] ?? 'italic'
      const fontStyle    = fontStyleRaw === 'bold' ? 'normal' : fontStyleRaw
      const fontWeight   = fontStyleRaw === 'bold' ? 'bold' : 'normal'
      // qtPad intentionally unused – padding handled via outerPadding/innerPadding
      const colBgAttr       = resolveColor(p['sectionBg'], settings) ? ` background-color="${resolveColor(p['sectionBg'], settings)}"` : ''
      const align      = p['align']      ?? 'left'
      const quoteStyle = p['quoteStyle'] ?? 'quotes'
      const authorPrefix = p['authorPrefix'] ?? '—'
      const authorText = p['author'] ? `${authorPrefix} ${p['author']}` : ''
      const fontFamily       = p['fontFamily']       || ''
      const authorFontFamily = p['authorFontFamily'] || ''
      const authorStyle = `color:${authorColor};font-size:${authorFontSize};font-style:${authorFontStyle};font-weight:${authorFontWeight};${authorFontFamily ? `font-family:${authorFontFamily};` : ''}text-align:${align};`
      const resolvedFontSize = resolveRelativeFontSize(p['fontSize'], basePx)
      const textBase = `color:${textColor};${resolvedFontSize ? `font-size:${resolvedFontSize};` : ''}${fontFamily ? `font-family:${fontFamily};` : ''}font-style:${fontStyle};font-weight:${fontWeight};line-height:1.6;text-align:${align};`

      let table: string
      if (quoteStyle === 'quotes') {
        if (authorText) {
          const quoteTd = `<td width="40" rowspan="2" style="font-size:52px;color:${accentColor};line-height:1;padding:0;text-align:center;vertical-align:middle;">&ldquo;</td>`
          const textTdQ = `<td style="padding:0 0 4px 0;${textBase}">${p['text'] ?? ''}</td>`
          const authorTdQ = `<td style="padding:0;${authorStyle}">${authorText}</td>`
          table = `<table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;"><tr>${quoteTd}${textTdQ}</tr><tr>${authorTdQ}</tr></table>`
        } else {
          const quoteTd = `<td width="40" style="font-size:52px;color:${accentColor};line-height:1;padding:0;text-align:center;vertical-align:middle;">&ldquo;</td>`
          const textTdQ = `<td style="padding:0;${textBase}vertical-align:middle;">${p['text'] ?? ''}</td>`
          table = `<table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;"><tr>${quoteTd}${textTdQ}</tr></table>`
        }
      } else {
        // none
        const authorRow = authorText ? `<tr><td style="padding:0;${authorStyle}">${authorText}</td></tr>` : ''
        table = `<table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;"><tr><td style="padding:${authorText ? '0 0 4px 0' : '0'};${textBase}">${p['text'] ?? ''}</td></tr>${authorRow}</table>`
      }
      const paddingBasePx = parseInt(settings?.padding ?? '4px', 10)
      const qtBr = p['borderRadius'] || settings?.defaultBorderRadius || '4px'
      const qtBrAttr = qtBr && qtBr !== '0px' ? ` border-radius="${qtBr}"` : ''
      const qtBw = p['borderWidth'] || settings?.defaultBorderWidth || ''
      const qtBs = p['borderStyle'] || settings?.defaultBorderStyle || 'solid'
      const qtBc = resolveColor(p['borderColor'], settings) || '#e5e7eb'
      const qtBorderAttr = qtBw ? ` border="${qtBw} ${qtBs} ${qtBc}"` : ''
      const qtInnerPadding = resolveRelativePadding(p['innerPadding'], paddingBasePx) ?? settings?.padding ?? '4px'
      return `<mj-section padding="${resolveRelativePadding(p['outerPadding'], paddingBasePx) ?? getDefaultSectionPadding(settings)}" css-class="blk-${sanitizeCls(block.id)}">
<mj-column padding="${qtInnerPadding}"${colBgAttr}${qtBrAttr}${qtBorderAttr}>
  <mj-text padding="0">${table}</mj-text>
</mj-column>
</mj-section>`
    }

    default:
      return ''
  }
}

export function templateToMjml(template: EmailTemplate): string {
  _previewCss.clear()
  const { settings, blocks } = template

  const mobileColStyles = blocks
    .filter((b) => b.type === 'columns')
    .map((b) => {
      const bp = b.props as Record<string, string>
      const gapNum = parseFloat(bp['gap'] ?? '0')
      if (!gapNum) return ''
      const cls = `cg-${b.id.replace(/\W/g, '').slice(0, 12)}`
      return `@media only screen and (max-width:480px){.${cls}{padding-bottom:${gapNum}px!important;}}`
    })
    .filter(Boolean)
    .join('')

  const sectionsHtml = blocks
    .map((block) => {
      if (block.disabled) return ''
      // columns, social, navbar, hero, video, countdown, accordion and quote already return a full mj-section / mj-hero
      if (block.type === 'columns' || block.type === 'social' || block.type === 'navbar' || block.type === 'hero' || block.type === 'video' || block.type === 'countdown' || block.type === 'accordion' || block.type === 'quote') {
        return blockToMjml(block, settings)
      }
      const bp = block.props as Record<string, string>
      // Text blocks with custom width: use a full-width column + inner div with the width/bg.
      // This avoids MJML's responsive CSS (mj-column-per-XX → 100% on mobile) so the
      // percentage is preserved consistently across desktop and mobile previews.
      if (block.type === 'text' && bp['width'] && bp['width'] !== '100%') {
        const effectiveAlign = bp['align'] ?? 'left'
        const txtBr = bp['borderRadius'] || settings?.defaultBorderRadius || '4px'
        const txtBw = bp['borderWidth'] || settings?.defaultBorderWidth || ''
        const txtBs = bp['borderStyle'] || settings?.defaultBorderStyle || 'solid'
        const txtBc = resolveColor(bp['borderColor'], settings) || '#e5e7eb'
        const txtBorder = txtBw ? ` border="${txtBw} ${txtBs} ${txtBc}"` : ''
        const txtBrAttr = txtBr && txtBr !== '0px' ? ` border-radius="${txtBr}"` : ''
        const txtBgAttr = resolveColor(bp['sectionBg'], settings) ? ` background-color="${resolveColor(bp['sectionBg'], settings)}"` : ''
        const innerStyle = [
          `width:${bp['width']}`,
          `padding:${bp['padding'] ?? '25px 10px'}`,
          `text-align:${effectiveAlign}`,
          'margin:0 auto',
        ].filter(Boolean).join(';')
        const textAttrs = [
          `align="${effectiveAlign}"`,
          resolveColor(bp['color'], settings) ? `color="${resolveColor(bp['color'], settings)}"` : '',
          bp['fontSize']   ? `font-size="${bp['fontSize']}"` : '',
          bp['fontFamily'] ? `font-family="${bp['fontFamily']}"` : '',
          bp['fontStyle'] === 'bold'   ? `font-weight="bold"`   : '',
          bp['fontStyle'] === 'italic' ? `font-style="italic"` : '',
        ].filter(Boolean).join(' ')
        const paddingBasePx = parseInt(settings?.padding ?? '4px', 10)
        const txtInnerPadding = resolveRelativePadding(bp['innerPadding'], paddingBasePx) ?? settings?.padding ?? '4px'
        return `<mj-section padding="${resolveRelativePadding(bp['outerPadding'], paddingBasePx) ?? getDefaultSectionPadding(settings)}" css-class="blk-${sanitizeCls(block.id)}">
        <mj-column${txtBgAttr}${txtBrAttr}${txtBorder} padding="${txtInnerPadding}">
          <mj-text ${textAttrs} padding="0"><div style="${innerStyle}">${bp['content'] ?? ''}</div></mj-text>
        </mj-column>
      </mj-section>`
      }
      const paddingBasePx = parseInt(settings?.padding ?? '4px', 10)
      const sectionBgAttr = resolveColor(bp['sectionBg'], settings) ? ` background-color="${resolveColor(bp['sectionBg'], settings)}"` : ''
      // For button: section-level Hintergrund uses sec* prefixed keys to avoid collision with button design fields
      const isButton = block.type === 'button'
      const isDivider = block.type === 'divider'
      const isText = block.type === 'text'
      const brKey = isButton ? (bp['secBorderRadius'] ?? '') : (bp['borderRadius'] ?? '')
      const bwKey = (isButton || isDivider) ? (bp['secBorderWidth'] ?? '') : (bp['borderWidth'] ?? '')
      const bsKey = (isButton || isDivider) ? (bp['secBorderStyle'] ?? '') : (bp['borderStyle'] ?? '')
      const bcKey = (isButton || isDivider) ? (bp['secBorderColor'] ?? 'borderColor') : (bp['borderColor'] ?? 'borderColor')
      // Text blocks: column has no padding (inner div handles it), matching in-column rendering
      const innerPaddingKey = isButton
        ? (resolveRelativePadding(bp['secInnerPadding'], paddingBasePx) ?? settings?.padding ?? '4px')
        : isText ? '0px'
        : (resolveRelativePadding(bp['innerPadding'], paddingBasePx) ?? settings?.padding ?? '4px')
      const br = brKey || settings?.defaultBorderRadius || '4px'
      const sectionRadius = br && br !== '0px' ? ` border-radius="${br}"` : ''
      const bw = bwKey || settings?.defaultBorderWidth || ''
      const bs = bsKey || settings?.defaultBorderStyle || 'solid'
      const bc = resolveColor(bcKey, settings)
      const sectionBorder = bw ? ` border="${bw} ${bs} ${bc}"` : ''
      return `<mj-section padding="${resolveRelativePadding(bp['outerPadding'], paddingBasePx) ?? getDefaultSectionPadding(settings)}" css-class="blk-${sanitizeCls(block.id)}">
        <mj-column${sectionBgAttr}${sectionRadius}${sectionBorder} padding="${innerPaddingKey}">
          ${blockToMjml(block, settings)}
        </mj-column>
      </mj-section>`
    })
    .join('\n')

  // Collect block-level custom CSS (injected last = highest cascade priority)
  for (const block of blocks) {
    const bp = block.props as Record<string, string>
    if (bp['css']?.trim()) {
      const cls = `blk-${sanitizeCls(block.id)}`
      // Add !important to each declaration for maximum priority
      const processed = bp['css'].trim().replace(/\s*(!important)?\s*;/g, ' !important;')
      const finalCss = processed.endsWith('}') ? processed : (processed.endsWith(';') ? processed : processed + ' !important')
      _previewCss.set(`ucss-${block.id}`, `.${cls},.${cls} *{${finalCss}}`)
    }
  }

  // Pre-compute wrapper BEFORE the template literal so _previewCss is fully
  // populated when mj-style is rendered (template literals evaluate left-to-right).
  const globalBasePx = parseInt(settings.padding ?? '2px', 10)
  // Außenabstand: sits OUTSIDE the border → injected as CSS padding on the
  // wrapper's outer <div> (mj-wrapper renders a <div> as outermost element).
  // Using padding (not margin) on the div so it works in table-based email clients.
  // Empty/undefined bodyPadding = use global base (same as -Global- option in UI).
  const resolvedOuterPadding = resolveRelativePadding(settings.bodyPadding, globalBasePx) ?? `${globalBasePx}px`
  // Innenabstand: sits INSIDE the border → mj-wrapper's own padding attribute
  const resolvedInnerPadding = resolveRelativePadding(settings.bodyInnerPadding, globalBasePx) ?? getDefaultSectionPadding(settings)
  const wrapperBgColor = resolveColor(settings.bodyBackgroundColor, settings) || settings.pageColor || settings.backgroundColor || '#ffffff'
  const innerRadiusPx = settings.bodyBorderRadius && settings.bodyBorderRadius !== '0px'
    ? parseInt(settings.bodyBorderRadius, 10)
    : 0
  const outerPaddingPx = parseInt(resolvedOuterPadding, 10)
  // The outer div needs a slightly larger border-radius (innerRadius + outerPadding) so the
  // curved page-color gap aligns visually with the inner border's curve.
  const outerDivRadiusPx = innerRadiusPx > 0 ? innerRadiusPx + outerPaddingPx : 0
  const pageColor = settings.pageColor ?? settings.backgroundColor
  // Always inject outer div CSS; overflow:hidden on a <div> reliably clips table backgrounds
  // to border-radius (unlike overflow:hidden on <td> in Chromium).
  const outerCssParts = [
    resolvedOuterPadding !== '0px' ? `padding:${resolvedOuterPadding}!important;` : '',
    resolvedOuterPadding !== '0px' ? `background-color:${pageColor}!important;` : '',
    outerDivRadiusPx > 0 ? `border-radius:${outerDivRadiusPx}px!important;overflow:hidden!important;` : '',
  ].filter(Boolean).join('')
  if (outerCssParts) {
    _previewCss.set('body-outer-margin', `.body-outer-margin{${outerCssParts}}`)
  } else {
    _previewCss.delete('body-outer-margin')
  }
  // clip-path: inset(0 round Xpx) reliably clips all child content (including nested table
  // backgrounds) to the rounded rectangle — more robust than overflow:hidden on <td> in Chromium.
  if (innerRadiusPx > 0) {
    _previewCss.set('body-wrapper-overflow',
      `.body-outer-margin>table>tbody>tr>td{clip-path:inset(0 round ${settings.bodyBorderRadius})!important;}`)
  } else {
    _previewCss.delete('body-wrapper-overflow')
  }
  const wrapperAttrs = [
    `background-color="${wrapperBgColor}"`,
    `padding="${resolvedInnerPadding}"`,
    `css-class="body-outer-margin"`,
    settings.bodyBorderWidth && settings.bodyBorderWidth !== '0px'
      ? `border="${settings.bodyBorderWidth} ${settings.bodyBorderStyle ?? 'solid'} ${resolveColor(settings.bodyBorderColor, settings) || '#e5e7eb'}"`
      : '',
    innerRadiusPx > 0 ? `border-radius="${settings.bodyBorderRadius}"` : '',
  ].filter(Boolean).join(' ')
  const wrapperHtml = `<mj-wrapper ${wrapperAttrs}>${sectionsHtml}</mj-wrapper>`

  return `<mjml>
  <mj-head>
    <mj-attributes>
      <mj-all font-family="${settings.fontFamily}" />
      <mj-text font-size="${settings.fontSize}px" color="${settings.fontColor ?? '#000000'}" line-height="${settings.lineHeight ?? 1.5}"${settings.fontStyle === 'bold' ? ` font-weight="bold"` : ''}${settings.fontStyle === 'italic' ? ` font-style="italic"` : ''} />
    </mj-attributes>
    <mj-style>.navbar-link:hover { text-decoration: underline !important; }${mobileColStyles}${[..._previewCss.values()].join('')}${(() => { const vars = [settings.primaryColor ? `--primary:${settings.primaryColor}` : '', settings.secondaryColor ? `--secondary:${settings.secondaryColor}` : '', settings.alternativeColor ? `--alternative:${settings.alternativeColor}` : '', settings.designColor ? `--design:${settings.designColor}` : '', settings.brandColor ? `--brand:${settings.brandColor}` : '', settings.borderColor ? `--border:${settings.borderColor}` : ''].filter(Boolean); return vars.length ? `:root{${vars.join(';')}}` : '' })()}${settings.customCss ? `\n${settings.customCss}` : ''}</mj-style>
  </mj-head>
  <mj-body background-color="${settings.pageColor ?? settings.backgroundColor}" width="${settings.contentWidth}px">
    ${wrapperHtml}
  </mj-body>
</mjml>`
}
