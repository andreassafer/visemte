import type { EmailTemplate } from '@/types'

export const promotionalTemplate: EmailTemplate = {
  id: 'preset-promotional',
  name: 'Sale',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  settings: {
    backgroundColor: '#0f172a',
    contentWidth: 600,
    fontFamily: 'Arial, sans-serif',
    fontSize: 14,
    fontColor: '#e0e0e0',
    lineHeight: 1.5,
  },
  blocks: [
    // ── Hero ────────────────────────────────────────────────────────────────
    {
      id: 'promo-1',
      type: 'hero',
      props: {
        src: '',
        height: '260px',
        backgroundColor: '#0f172a',
        backgroundPosition: 'center center',
        textAlign: 'center',
        line1Text: 'SUMMER SALE 🔥',
        line1Color: '#ffffff',
        line1FontSize: '42px',
        line2Text: 'Up to 50% off everything – for a limited time only!',
        line2Color: '#94a3b8',
        line2FontSize: '18px',
        padding: '48px 25px',
        sectionBg: '#0f172a',
        borderRadius: '0px',
      },
    },
    // ── Countdown ────────────────────────────────────────────────────────────
    {
      id: 'promo-2',
      type: 'countdown',
      props: {
        targetDate: '2025-09-30T23:59:59',
        labelDays: 'Days',
        labelHours: 'Hours',
        labelMinutes: 'Minutes',
        labelSeconds: 'Seconds',
        bgColor: '#e94560',
        textColor: '#ffffff',
        labelColor: '#fecaca',
        fontSize: '34px',
        labelFontSize: '11px',
        align: 'center',
        padding: '20px 25px',
        sectionBg: '#0f172a',
      },
    },
    // ── Promo code ───────────────────────────────────────────────────────────
    {
      id: 'promo-3',
      type: 'text',
      props: {
        content:
          '<p style="margin:0 0 8px;color:#94a3b8;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Your exclusive discount code</p><p style="margin:0;display:inline-block;background:#e94560;color:#ffffff;font-size:20px;font-weight:bold;letter-spacing:5px;padding:10px 28px;border-radius:6px;">SUMMER50</p>',
        align: 'center',
        color: '#ffffff',
        fontSize: '14px',
        padding: '24px 25px 16px',
        sectionBg: '#0f172a',
        borderRadius: '0px',
      },
    },
    // ── Spacer ───────────────────────────────────────────────────────────────
    {
      id: 'promo-4',
      type: 'divider',
      props: { borderWidth: '0px', height: '8px', sectionBg: '#0f172a' },
    },
    // ── Product row 1 ────────────────────────────────────────────────────────
    {
      id: 'promo-5',
      type: 'columns',
      props: {
        columns: 2,
        gap: '0px',
        padding: '8px 24px',
        sectionBg: '#0f172a',
        columnBlocks: [
          [
            {
              id: 'promo-5-col1-img',
              type: 'image',
              props: {
                src: '',
                alt: 'Product image sneakers',
                align: 'center',
                width: '100%',
                borderRadius: '8px',
                padding: '0 8px 0 0',
                sectionBg: '',
              },
            },
          ],
          [
            {
              id: 'promo-5-col2-text',
              type: 'text',
              props: {
                content:
                  '<p style="margin:0 0 4px;font-size:11px;color:#e94560;letter-spacing:2px;text-transform:uppercase;font-weight:bold;">Bestseller</p><p style="margin:0 0 8px;font-size:16px;font-weight:bold;color:#f1f5f9;">Urban Runner Pro</p><p style="margin:0 0 10px;font-size:13px;color:#94a3b8;line-height:1.5;">Lightweight running shoes with an ergonomic sole – perfect for the city and the trail.</p><p style="margin:0;"><span style="font-size:13px;color:#64748b;text-decoration:line-through;">$119.99</span>&nbsp;<span style="font-size:20px;font-weight:bold;color:#e94560;">$59.99</span></p>',
                align: 'left',
                color: '#f1f5f9',
                fontSize: '14px',
                padding: '0 0 10px 12px',
                sectionBg: '',
                borderRadius: '0px',
              },
            },
            {
              id: 'promo-5-col2-btn',
              type: 'button',
              props: {
                text: 'Shop Now →',
                href: '#',
                align: 'left',
                backgroundColor: '#e94560',
                color: '#ffffff',
                fontSize: '13px',
                padding: '0 0 0 12px',
                innerPadding: '9px 22px',
                borderRadius: '50px',
                sectionBg: '',
              },
            },
          ],
        ],
      },
    },
    // ── Product row 2 ────────────────────────────────────────────────────────
    {
      id: 'promo-6',
      type: 'columns',
      props: {
        columns: 2,
        gap: '0px',
        padding: '12px 24px 8px',
        sectionBg: '#0f172a',
        columnBlocks: [
          [
            {
              id: 'promo-6-col1-img',
              type: 'image',
              props: {
                src: '',
                alt: 'Product image backpack',
                align: 'center',
                width: '100%',
                borderRadius: '8px',
                padding: '0 8px 0 0',
                sectionBg: '',
              },
            },
          ],
          [
            {
              id: 'promo-6-col2-text',
              type: 'text',
              props: {
                content:
                  '<p style="margin:0 0 4px;font-size:11px;color:#e94560;letter-spacing:2px;text-transform:uppercase;font-weight:bold;">New Arrival</p><p style="margin:0 0 8px;font-size:16px;font-weight:bold;color:#f1f5f9;">City Pack 30L</p><p style="margin:0 0 10px;font-size:13px;color:#94a3b8;line-height:1.5;">Water-resistant daypack with laptop compartment and ergonomic shoulder straps.</p><p style="margin:0;"><span style="font-size:13px;color:#64748b;text-decoration:line-through;">$89.99</span>&nbsp;<span style="font-size:20px;font-weight:bold;color:#e94560;">$44.99</span></p>',
                align: 'left',
                color: '#f1f5f9',
                fontSize: '14px',
                padding: '0 0 10px 12px',
                sectionBg: '',
                borderRadius: '0px',
              },
            },
            {
              id: 'promo-6-col2-btn',
              type: 'button',
              props: {
                text: 'Shop Now →',
                href: '#',
                align: 'left',
                backgroundColor: '#e94560',
                color: '#ffffff',
                fontSize: '13px',
                padding: '0 0 0 12px',
                innerPadding: '9px 22px',
                borderRadius: '50px',
                sectionBg: '',
              },
            },
          ],
        ],
      },
    },
    // ── All offers CTA ───────────────────────────────────────────────────────
    {
      id: 'promo-7',
      type: 'button',
      props: {
        text: 'View All Offers',
        href: '#',
        align: 'center',
        backgroundColor: '#e94560',
        color: '#ffffff',
        fontSize: '15px',
        padding: '20px 25px 8px',
        innerPadding: '14px 48px',
        borderRadius: '50px',
        sectionBg: '#0f172a',
      },
    },
    // ── Dark divider ──────────────────────────────────────────────────────────
    {
      id: 'promo-8',
      type: 'divider',
      props: {
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#1e293b',
        padding: '20px 30px 8px',
        sectionBg: '#0f172a',
        text: '',
      },
    },
    // ── Disclaimer ────────────────────────────────────────────────────────────
    {
      id: 'promo-9',
      type: 'text',
      props: {
        content:
          '<p style="margin:0;">*Offer valid until September 30, 2025. Cannot be combined with other discounts. While stocks last.</p>',
        align: 'center',
        color: '#475569',
        fontSize: '11px',
        padding: '8px 25px 12px',
        sectionBg: '#0f172a',
        borderRadius: '0px',
      },
    },
    // ── Social ───────────────────────────────────────────────────────────────
    {
      id: 'promo-10',
      type: 'social',
      props: {
        align: 'center',
        padding: '8px 25px 12px',
        networks: 'facebook,twitter,instagram,tiktok',
        iconSize: '26',
        sectionBg: '#0f172a',
      },
    },
    // ── Footer ───────────────────────────────────────────────────────────────
    {
      id: 'promo-11',
      type: 'text',
      props: {
        content:
          '<p style="margin:0;">© 2026 Acme Corp · 123 Main Street · New York, NY 10001 · <a href="#" style="color:#475569;text-decoration:none;">Unsubscribe</a></p>',
        align: 'center',
        color: '#475569',
        fontSize: '12px',
        padding: '4px 25px 20px',
        sectionBg: '#0f172a',
        borderRadius: '0px',
      },
    },
  ],
}
