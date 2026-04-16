import type { EmailTemplate } from '@/types'

export const newsletterTemplate: EmailTemplate = {
  id: 'preset-newsletter',
  name: 'Newsletter',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  settings: {
    backgroundColor: '#f4f4f4',
    contentWidth: 600,
    fontFamily: 'Arial, sans-serif',
    fontSize: 14,
    fontColor: '#333333',
    lineHeight: 1.5,
  },
  blocks: [
    // ── Navbar ──────────────────────────────────────────────────────────────
    {
      id: 'nl-1',
      type: 'navbar',
      props: {
        linkCount: '3',
        link1Text: 'Home',
        link1Href: '#',
        link2Text: 'Blog',
        link2Href: '#',
        link3Text: 'Contact',
        link3Href: '#',
        align: 'center',
        color: '#1e40af',
        fontSize: '14px',
        separator: ' · ',
        padding: '14px 25px',
        sectionBg: '#ffffff',
      },
    },
    // ── Hero ────────────────────────────────────────────────────────────────
    {
      id: 'nl-2',
      type: 'hero',
      props: {
        src: '',
        height: '280px',
        backgroundColor: '#0f172a',
        backgroundPosition: 'center center',
        textAlign: 'center',
        line1Text: 'Monthly Newsletter',
        line1Color: '#ffffff',
        line1FontSize: '38px',
        line2Text: 'Your monthly roundup of what matters',
        line2Color: '#94a3b8',
        line2FontSize: '17px',
        padding: '48px 25px',
        sectionBg: '#0f172a',
        borderRadius: '0px',
      },
    },
    // ── Intro spacer ────────────────────────────────────────────────────────
    {
      id: 'nl-3',
      type: 'divider',
      props: { borderWidth: '0px', height: '20px', sectionBg: '#ffffff' },
    },
    // ── Section heading ─────────────────────────────────────────────────────
    {
      id: 'nl-4',
      type: 'text',
      props: {
        content: '<p style="margin:0;font-size:22px;font-weight:bold;color:#0f172a;">What\'s New?</p>',
        align: 'left',
        color: '#0f172a',
        fontSize: '22px',
        padding: '24px 30px 8px',
        sectionBg: '#ffffff',
        borderRadius: '0px',
      },
    },
    // ── Intro body text ─────────────────────────────────────────────────────
    {
      id: 'nl-5',
      type: 'text',
      props: {
        content:
          '<p style="margin:0;line-height:1.7;color:#475569;">In this edition, we look back at the most exciting developments of the past four weeks. From new product features and industry news to helpful tips and upcoming events – we\'ve put together everything you need to know. Enjoy the read!</p>',
        align: 'left',
        color: '#475569',
        fontSize: '15px',
        padding: '8px 30px 20px',
        sectionBg: '#ffffff',
        borderRadius: '0px',
      },
    },
    // ── Two-column: image + article teaser ──────────────────────────────────
    {
      id: 'nl-6',
      type: 'columns',
      props: {
        columns: 2,
        gap: '0px',
        padding: '8px 30px 20px',
        sectionBg: '#ffffff',
        columnBlocks: [
          [
            {
              id: 'nl-6-col1-img',
              type: 'image',
              props: {
                src: '',
                alt: 'Article image',
                align: 'center',
                width: '100%',
                borderRadius: '6px',
                padding: '0 8px 0 0',
                sectionBg: '',
              },
            },
          ],
          [
            {
              id: 'nl-6-col2-heading',
              type: 'text',
              props: {
                content:
                  '<p style="margin:0;font-size:16px;font-weight:bold;color:#0f172a;">Product Update: Version 2.5 is Here</p>',
                align: 'left',
                color: '#0f172a',
                fontSize: '16px',
                padding: '0 0 8px 8px',
                sectionBg: '',
                borderRadius: '0px',
              },
            },
            {
              id: 'nl-6-col2-body',
              type: 'text',
              props: {
                content:
                  '<p style="margin:0;line-height:1.6;color:#64748b;font-size:14px;">We\'ve completely redesigned the user interface and added new features that will make your daily workflow significantly easier.</p>',
                align: 'left',
                color: '#64748b',
                fontSize: '14px',
                padding: '0 0 12px 8px',
                sectionBg: '',
                borderRadius: '0px',
              },
            },
            {
              id: 'nl-6-col2-btn',
              type: 'button',
              props: {
                text: 'Read More →',
                href: '#',
                align: 'left',
                backgroundColor: '#1e40af',
                color: '#ffffff',
                fontSize: '13px',
                padding: '0 0 0 8px',
                innerPadding: '9px 20px',
                borderRadius: '4px',
                sectionBg: '',
              },
            },
          ],
        ],
      },
    },
    // ── Divider with label ───────────────────────────────────────────────────
    {
      id: 'nl-7',
      type: 'divider',
      props: {
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#e2e8f0',
        padding: '4px 30px',
        sectionBg: '#ffffff',
        text: 'Highlights',
      },
    },
    // ── Three-column snippets ────────────────────────────────────────────────
    {
      id: 'nl-8',
      type: 'columns',
      props: {
        columns: 3,
        gap: '0px',
        padding: '16px 24px 24px',
        sectionBg: '#ffffff',
        columnBlocks: [
          [
            {
              id: 'nl-8-col1-text',
              type: 'text',
              props: {
                content:
                  '<p style="margin:0 0 6px;font-size:14px;font-weight:bold;color:#0f172a;">📈 Growth</p><p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">Our user base grew by 18% last month – thank you so much for your trust!</p>',
                align: 'left',
                color: '#64748b',
                fontSize: '13px',
                padding: '12px 8px',
                sectionBg: '#f8fafc',
                borderRadius: '6px',
              },
            },
          ],
          [
            {
              id: 'nl-8-col2-text',
              type: 'text',
              props: {
                content:
                  '<p style="margin:0 0 6px;font-size:14px;font-weight:bold;color:#0f172a;">🎙️ Podcast</p><p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">Episode 12 of our podcast is now live – featuring expert Dr. Smith on the future of digital trends.</p>',
                align: 'left',
                color: '#64748b',
                fontSize: '13px',
                padding: '12px 8px',
                sectionBg: '#f8fafc',
                borderRadius: '6px',
              },
            },
          ],
          [
            {
              id: 'nl-8-col3-text',
              type: 'text',
              props: {
                content:
                  '<p style="margin:0 0 6px;font-size:14px;font-weight:bold;color:#0f172a;">📅 Events</p><p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">Join us on May 15th for our free webinar. Spots are limited – register now!</p>',
                align: 'left',
                color: '#64748b',
                fontSize: '13px',
                padding: '12px 8px',
                sectionBg: '#f8fafc',
                borderRadius: '6px',
              },
            },
          ],
        ],
      },
    },
    // ── Spacer ───────────────────────────────────────────────────────────────
    {
      id: 'nl-9',
      type: 'divider',
      props: { borderWidth: '0px', height: '8px', sectionBg: '#ffffff' },
    },
    // ── Social ───────────────────────────────────────────────────────────────
    {
      id: 'nl-10',
      type: 'social',
      props: {
        align: 'center',
        padding: '16px 25px',
        networks: 'facebook,twitter,instagram,linkedin',
        iconSize: '28',
        sectionBg: '#ffffff',
      },
    },
    // ── Footer divider ───────────────────────────────────────────────────────
    {
      id: 'nl-11',
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
    // ── Footer text ──────────────────────────────────────────────────────────
    {
      id: 'nl-12',
      type: 'text',
      props: {
        content:
          '<p style="margin:0;">© 2026 Acme Corp · 123 Main Street · New York, NY 10001 · <a href="#" style="color:#94a3b8;text-decoration:none;">Unsubscribe</a></p>',
        align: 'center',
        color: '#94a3b8',
        fontSize: '12px',
        padding: '25px 10px 20px',
        sectionBg: '#ffffff',
        borderRadius: '0px',
      },
    },
  ],
}
