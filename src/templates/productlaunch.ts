import type { EmailTemplate } from '@/types'

export const productLaunchTemplate: EmailTemplate = {
  id: 'preset-productlaunch',
  name: 'Product Launch',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  settings: {
    backgroundColor: '#f9fafb',
    contentWidth: 600,
    fontFamily: 'Arial, sans-serif',
    fontSize: 14,
    fontColor: '#111827',
    lineHeight: 1.6,
  },
  blocks: [
    // ── Navbar ──────────────────────────────────────────────────────────────
    {
      id: 'pl-1',
      type: 'navbar',
      props: {
        linkCount: '3',
        link1Text: 'Features',
        link1Href: '#',
        link2Text: 'Pricing',
        link2Href: '#',
        link3Text: 'Docs',
        link3Href: '#',
        align: 'center',
        color: '#059669',
        fontSize: '14px',
        separator: ' · ',
        padding: '14px 25px',
        sectionBg: '#ffffff',
      },
    },
    // ── Hero ────────────────────────────────────────────────────────────────
    {
      id: 'pl-2',
      type: 'hero',
      props: {
        src: '',
        height: '280px',
        backgroundColor: '#064e3b',
        backgroundPosition: 'center center',
        textAlign: 'center',
        line1Text: '🚀 Introducing Spark 3.0',
        line1Color: '#ffffff',
        line1FontSize: '38px',
        line2Text: 'The fastest way to build, ship, and scale.',
        line2Color: '#6ee7b7',
        line2FontSize: '18px',
        padding: '52px 25px',
        sectionBg: '#064e3b',
        borderRadius: '0px',
      },
    },
    // ── Tagline ───────────────────────────────────────────────────────────────
    {
      id: 'pl-3',
      type: 'text',
      props: {
        content:
          '<p style="margin:0 0 10px;font-size:20px;font-weight:bold;color:#111827;">Everything you need, finally in one place.</p><p style="margin:0;line-height:1.7;color:#4b5563;">After months of building and listening to your feedback, we\'re thrilled to launch Spark 3.0. It\'s faster, smarter, and packed with features that will transform the way your team works.</p>',
        align: 'left',
        color: '#4b5563',
        fontSize: '15px',
        padding: '28px 30px 16px',
        sectionBg: '#ffffff',
        borderRadius: '0px',
      },
    },
    // ── Feature highlights ───────────────────────────────────────────────────
    {
      id: 'pl-4',
      type: 'columns',
      props: {
        columns: 2,
        gap: '0px',
        padding: '4px 24px 16px',
        sectionBg: '#ffffff',
        columnBlocks: [
          [
            {
              id: 'pl-4-col1',
              type: 'text',
              props: {
                content:
                  '<p style="margin:0 0 6px;font-size:15px;font-weight:bold;color:#111827;">⚡ 10× Faster Builds</p><p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">Our new Rust-based compiler cuts build times dramatically so you spend less time waiting.</p>',
                align: 'left',
                color: '#6b7280',
                fontSize: '13px',
                padding: '14px 12px',
                sectionBg: '#f0fdf4',
                borderRadius: '8px',
              },
            },
          ],
          [
            {
              id: 'pl-4-col2',
              type: 'text',
              props: {
                content:
                  '<p style="margin:0 0 6px;font-size:15px;font-weight:bold;color:#111827;">🧠 AI Code Review</p><p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">Integrated AI flags bugs and suggests improvements before your code ever hits production.</p>',
                align: 'left',
                color: '#6b7280',
                fontSize: '13px',
                padding: '14px 12px',
                sectionBg: '#f0fdf4',
                borderRadius: '8px',
              },
            },
          ],
        ],
      },
    },
    {
      id: 'pl-5',
      type: 'columns',
      props: {
        columns: 2,
        gap: '0px',
        padding: '0px 24px 24px',
        sectionBg: '#ffffff',
        columnBlocks: [
          [
            {
              id: 'pl-5-col1',
              type: 'text',
              props: {
                content:
                  '<p style="margin:0 0 6px;font-size:15px;font-weight:bold;color:#111827;">🔒 Zero-Config Security</p><p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">End-to-end encryption and role-based access control enabled out of the box.</p>',
                align: 'left',
                color: '#6b7280',
                fontSize: '13px',
                padding: '14px 12px',
                sectionBg: '#f0fdf4',
                borderRadius: '8px',
              },
            },
          ],
          [
            {
              id: 'pl-5-col2',
              type: 'text',
              props: {
                content:
                  '<p style="margin:0 0 6px;font-size:15px;font-weight:bold;color:#111827;">📊 Real-Time Analytics</p><p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">Live dashboards show you exactly what\'s happening in your app as it happens.</p>',
                align: 'left',
                color: '#6b7280',
                fontSize: '13px',
                padding: '14px 12px',
                sectionBg: '#f0fdf4',
                borderRadius: '8px',
              },
            },
          ],
        ],
      },
    },
    // ── Video placeholder ─────────────────────────────────────────────────────
    {
      id: 'pl-6',
      type: 'video',
      props: {
        src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnailSrc: '',
        alt: 'Spark 3.0 demo video',
        align: 'center',
        borderRadius: '8px',
        padding: '8px 30px 24px',
        sectionBg: '#ffffff',
      },
    },
    // ── Quote ─────────────────────────────────────────────────────────────────
    {
      id: 'pl-7',
      type: 'quote',
      props: {
        text: 'Spark 3.0 cut our deployment time in half. It\'s the tool we\'ve been waiting for.',
        author: '— Jamie Torres, Lead Engineer at Stripe',
        accentColor: '#059669',
        textColor: '#111827',
        authorColor: '#9ca3af',
        fontStyle: 'italic',
        align: 'center',
        padding: '8px 30px 24px',
        sectionBg: '#ffffff',
        bgColor: '#f0fdf4',
      },
    },
    // ── CTA ───────────────────────────────────────────────────────────────────
    {
      id: 'pl-8',
      type: 'button',
      props: {
        text: 'Try Spark 3.0 for Free →',
        href: '#',
        align: 'center',
        backgroundColor: '#059669',
        color: '#ffffff',
        fontSize: '15px',
        padding: '8px 30px 8px',
        innerPadding: '14px 40px',
        borderRadius: '6px',
        sectionBg: '#ffffff',
      },
    },
    // ── Subtext ───────────────────────────────────────────────────────────────
    {
      id: 'pl-9',
      type: 'text',
      props: {
        content: '<p style="margin:0;">No credit card required · Free 14-day trial · Cancel anytime</p>',
        align: 'center',
        color: '#9ca3af',
        fontSize: '12px',
        padding: '6px 25px 28px',
        sectionBg: '#ffffff',
        borderRadius: '0px',
      },
    },
    // ── Divider ───────────────────────────────────────────────────────────────
    {
      id: 'pl-10',
      type: 'divider',
      props: {
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#e5e7eb',
        padding: '4px 30px',
        sectionBg: '#ffffff',
        text: '',
      },
    },
    // ── Social ───────────────────────────────────────────────────────────────
    {
      id: 'pl-11',
      type: 'social',
      props: {
        align: 'center',
        padding: '14px 25px',
        networks: 'twitter,github,linkedin',
        iconSize: '26',
        sectionBg: '#ffffff',
      },
    },
    // ── Footer ───────────────────────────────────────────────────────────────
    {
      id: 'pl-12',
      type: 'text',
      props: {
        content:
          '<p style="margin:0;">© 2026 Spark Inc. · 456 Market Street · San Francisco, CA 94105 · <a href="#" style="color:#94a3b8;text-decoration:none;">Unsubscribe</a></p>',
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
