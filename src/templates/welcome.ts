import type { EmailTemplate } from '@/types'

export const welcomeTemplate: EmailTemplate = {
  id: 'preset-welcome',
  name: 'Welcome Email',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  settings: {
    backgroundColor: '#f0f4f8',
    contentWidth: 600,
    fontFamily: 'Arial, sans-serif',
    fontSize: 14,
    fontColor: '#1e293b',
    lineHeight: 1.6,
  },
  blocks: [
    // ── Hero ────────────────────────────────────────────────────────────────
    {
      id: 'wlc-1',
      type: 'hero',
      props: {
        src: '',
        height: '240px',
        backgroundColor: '#1e40af',
        backgroundPosition: 'center center',
        textAlign: 'center',
        line1Text: 'Welcome! 👋',
        line1Color: '#ffffff',
        line1FontSize: '40px',
        line2Text: 'We\'re thrilled to have you on board.',
        line2Color: '#bfdbfe',
        line2FontSize: '18px',
        padding: '44px 25px',
        sectionBg: '#1e40af',
        borderRadius: '0px',
      },
    },
    // ── Spacer ───────────────────────────────────────────────────────────────
    {
      id: 'wlc-2',
      type: 'divider',
      props: { borderWidth: '0px', height: '24px', sectionBg: '#ffffff' },
    },
    // ── Welcome text ─────────────────────────────────────────────────────────
    {
      id: 'wlc-3',
      type: 'text',
      props: {
        content:
          '<p style="margin:0 0 12px;font-size:18px;font-weight:bold;color:#0f172a;">Welcome to our community!</p><p style="margin:0;line-height:1.7;color:#475569;">We\'re so excited to have you here. Your account has been successfully created and you can dive in right away. Explore all the features, customize your profile, and reach out to our team any time – we\'re always happy to help.</p>',
        align: 'left',
        color: '#475569',
        fontSize: '15px',
        padding: '24px 30px 20px',
        sectionBg: '#ffffff',
        borderRadius: '0px',
      },
    },
    // ── 3-step columns ───────────────────────────────────────────────────────
    {
      id: 'wlc-4',
      type: 'columns',
      props: {
        columns: 3,
        gap: '0px',
        padding: '8px 24px 20px',
        sectionBg: '#ffffff',
        columnBlocks: [
          [
            {
              id: 'wlc-4-col1',
              type: 'text',
              props: {
                content:
                  '<p style="margin:0 0 8px;width:36px;height:36px;line-height:36px;text-align:center;background:#1e40af;color:#fff;border-radius:50%;font-size:16px;font-weight:bold;display:inline-block;">1</p><p style="margin:0 0 6px;font-size:14px;font-weight:bold;color:#0f172a;">Complete your profile</p><p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">Add your name, profile photo, and contact details.</p>',
                align: 'center',
                color: '#64748b',
                fontSize: '13px',
                padding: '16px 10px',
                sectionBg: '#f8fafc',
                borderRadius: '8px',
              },
            },
          ],
          [
            {
              id: 'wlc-4-col2',
              type: 'text',
              props: {
                content:
                  '<p style="margin:0 0 8px;width:36px;height:36px;line-height:36px;text-align:center;background:#1e40af;color:#fff;border-radius:50%;font-size:16px;font-weight:bold;display:inline-block;">2</p><p style="margin:0 0 6px;font-size:14px;font-weight:bold;color:#0f172a;">Adjust your settings</p><p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">Choose your preferred language, timezone, and notifications.</p>',
                align: 'center',
                color: '#64748b',
                fontSize: '13px',
                padding: '16px 10px',
                sectionBg: '#f8fafc',
                borderRadius: '8px',
              },
            },
          ],
          [
            {
              id: 'wlc-4-col3',
              type: 'text',
              props: {
                content:
                  '<p style="margin:0 0 8px;width:36px;height:36px;line-height:36px;text-align:center;background:#1e40af;color:#fff;border-radius:50%;font-size:16px;font-weight:bold;display:inline-block;">3</p><p style="margin:0 0 6px;font-size:14px;font-weight:bold;color:#0f172a;">Get started!</p><p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">Explore all the features and launch your first project today.</p>',
                align: 'center',
                color: '#64748b',
                fontSize: '13px',
                padding: '16px 10px',
                sectionBg: '#f8fafc',
                borderRadius: '8px',
              },
            },
          ],
        ],
      },
    },
    // ── Spacer ───────────────────────────────────────────────────────────────
    {
      id: 'wlc-5',
      type: 'divider',
      props: { borderWidth: '0px', height: '8px', sectionBg: '#ffffff' },
    },
    // ── CTA button ───────────────────────────────────────────────────────────
    {
      id: 'wlc-6',
      type: 'button',
      props: {
        text: 'Get Started',
        href: '#',
        align: 'center',
        backgroundColor: '#1e40af',
        color: '#ffffff',
        fontSize: '15px',
        padding: '8px 30px 28px',
        innerPadding: '13px 36px',
        borderRadius: '6px',
        sectionBg: '#ffffff',
      },
    },
    // ── Divider ───────────────────────────────────────────────────────────────
    {
      id: 'wlc-7',
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
    // ── Quote ─────────────────────────────────────────────────────────────────
    {
      id: 'wlc-8',
      type: 'quote',
      props: {
        text: 'Well begun is half done.',
        author: '— Aristotle',
        accentColor: '#1e40af',
        textColor: '#1e293b',
        authorColor: '#94a3b8',
        fontStyle: 'italic',
        align: 'center',
        padding: '20px 30px',
        sectionBg: '#ffffff',
        bgColor: '#eff6ff',
      },
    },
    // ── Divider ───────────────────────────────────────────────────────────────
    {
      id: 'wlc-9',
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
      id: 'wlc-10',
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
      id: 'wlc-11',
      type: 'text',
      props: {
        content:
          '<p style="margin:0;">© 2026 Acme Corp · Questions? <a href="mailto:hello@acme.com" style="color:#94a3b8;text-decoration:none;">hello@acme.com</a> · <a href="#" style="color:#94a3b8;text-decoration:none;">Unsubscribe</a></p>',
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
