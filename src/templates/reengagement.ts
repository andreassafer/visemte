import type { EmailTemplate } from '@/types'

export const reengagementTemplate: EmailTemplate = {
  id: 'preset-reengagement',
  name: 'Re-engagement',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  settings: {
    backgroundColor: '#f1f5f9',
    contentWidth: 600,
    fontFamily: 'Arial, sans-serif',
    fontSize: 14,
    fontColor: '#1e293b',
    lineHeight: 1.6,
  },
  blocks: [
    // ── Hero ────────────────────────────────────────────────────────────────
    {
      id: 're-1',
      type: 'hero',
      props: {
        src: '',
        height: '220px',
        backgroundColor: '#7c3aed',
        backgroundPosition: 'center center',
        textAlign: 'center',
        line1Text: 'We miss you! 💜',
        line1Color: '#ffffff',
        line1FontSize: '38px',
        line2Text: 'It\'s been a while – here\'s what\'s new.',
        line2Color: '#ddd6fe',
        line2FontSize: '17px',
        padding: '44px 25px',
        sectionBg: '#7c3aed',
        borderRadius: '0px',
      },
    },
    // ── Spacer ───────────────────────────────────────────────────────────────
    {
      id: 're-2',
      type: 'divider',
      props: { borderWidth: '0px', height: '20px', sectionBg: '#ffffff' },
    },
    // ── Body text ─────────────────────────────────────────────────────────────
    {
      id: 're-3',
      type: 'text',
      props: {
        content:
          '<p style="margin:0 0 12px;font-size:18px;font-weight:bold;color:#1e293b;">Hey there 👋</p><p style="margin:0;line-height:1.7;color:#475569;">We noticed you haven\'t been around for a while, and we completely understand – life gets busy! But we\'ve been hard at work adding new features and improvements that we think you\'ll love. Come back and see what\'s changed.</p>',
        align: 'left',
        color: '#475569',
        fontSize: '15px',
        padding: '24px 30px 16px',
        sectionBg: '#ffffff',
        borderRadius: '0px',
      },
    },
    // ── What's new ───────────────────────────────────────────────────────────
    {
      id: 're-4',
      type: 'divider',
      props: {
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#e2e8f0',
        padding: '4px 30px',
        sectionBg: '#ffffff',
        text: 'What\'s New',
      },
    },
    // ── 2-column features ────────────────────────────────────────────────────
    {
      id: 're-5',
      type: 'columns',
      props: {
        columns: 2,
        gap: '0px',
        padding: '16px 24px 20px',
        sectionBg: '#ffffff',
        columnBlocks: [
          [
            {
              id: 're-5-col1',
              type: 'text',
              props: {
                content:
                  '<p style="margin:0 0 6px;font-size:22px;">✨</p><p style="margin:0 0 6px;font-size:14px;font-weight:bold;color:#1e293b;">New Dashboard</p><p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">A completely redesigned overview with all your key metrics at a glance.</p>',
                align: 'center',
                color: '#64748b',
                fontSize: '13px',
                padding: '16px 10px',
                sectionBg: '#faf5ff',
                borderRadius: '8px',
              },
            },
          ],
          [
            {
              id: 're-5-col2',
              type: 'text',
              props: {
                content:
                  '<p style="margin:0 0 6px;font-size:22px;">🚀</p><p style="margin:0 0 6px;font-size:14px;font-weight:bold;color:#1e293b;">Faster Performance</p><p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">Everything loads up to 3× faster than before – we optimized everything.</p>',
                align: 'center',
                color: '#64748b',
                fontSize: '13px',
                padding: '16px 10px',
                sectionBg: '#faf5ff',
                borderRadius: '8px',
              },
            },
          ],
        ],
      },
    },
    // ── Special offer ─────────────────────────────────────────────────────────
    {
      id: 're-6',
      type: 'text',
      props: {
        content:
          '<p style="margin:0 0 10px;font-size:15px;font-weight:bold;color:#1e293b;">🎁 A little gift for coming back</p><p style="margin:0 0 12px;line-height:1.6;color:#475569;font-size:14px;">As a thank-you for giving us another chance, we\'d like to offer you an exclusive discount on your next month.</p><p style="margin:0;display:inline-block;background:#7c3aed;color:#ffffff;font-size:18px;font-weight:bold;letter-spacing:4px;padding:8px 24px;border-radius:6px;">WELCOME50</p>',
        align: 'center',
        color: '#475569',
        fontSize: '14px',
        padding: '20px 30px',
        sectionBg: '#faf5ff',
        borderRadius: '0px',
      },
    },
    // ── CTA ───────────────────────────────────────────────────────────────────
    {
      id: 're-7',
      type: 'button',
      props: {
        text: 'Come Back & Explore →',
        href: '#',
        align: 'center',
        backgroundColor: '#7c3aed',
        color: '#ffffff',
        fontSize: '15px',
        padding: '20px 30px 28px',
        innerPadding: '13px 40px',
        borderRadius: '6px',
        sectionBg: '#ffffff',
      },
    },
    // ── Quote ─────────────────────────────────────────────────────────────────
    {
      id: 're-8',
      type: 'quote',
      props: {
        text: 'Every new beginning comes from some other beginning\'s end.',
        author: '— Seneca',
        accentColor: '#7c3aed',
        textColor: '#1e293b',
        authorColor: '#94a3b8',
        fontStyle: 'italic',
        align: 'center',
        padding: '8px 30px 20px',
        sectionBg: '#ffffff',
        bgColor: '#faf5ff',
      },
    },
    // ── Divider ───────────────────────────────────────────────────────────────
    {
      id: 're-9',
      type: 'divider',
      props: {
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#e2e8f0',
        padding: '4px 30px',
        sectionBg: '#ffffff',
        text: '',
      },
    },
    // ── Social ───────────────────────────────────────────────────────────────
    {
      id: 're-10',
      type: 'social',
      props: {
        align: 'center',
        padding: '14px 25px',
        networks: 'facebook,twitter,instagram,linkedin',
        iconSize: '26',
        sectionBg: '#ffffff',
      },
    },
    // ── Footer ───────────────────────────────────────────────────────────────
    {
      id: 're-11',
      type: 'text',
      props: {
        content:
          '<p style="margin:0;">© 2026 Acme Corp · <a href="#" style="color:#94a3b8;text-decoration:none;">Unsubscribe</a> · <a href="#" style="color:#94a3b8;text-decoration:none;">Manage Preferences</a></p>',
        align: 'center',
        color: '#94a3b8',
        fontSize: '12px',
        padding: '8px 25px 20px',
        sectionBg: '#ffffff',
        borderRadius: '0px',
      },
    },
  ],
}
