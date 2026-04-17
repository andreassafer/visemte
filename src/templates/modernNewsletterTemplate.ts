import type { EmailTemplate } from '@/types'

export const modernNewsletterTemplate: EmailTemplate = {
  id: 'preset-V0OA47P7j5-ppjUtI_DXL',
  name: 'Modern Newsletter',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  settings: {
    backgroundColor: '#ffffff',
    contentWidth: 600,
    fontFamily: 'Arial, sans-serif',
    fontSize: 14,
    fontColor: '#333333',
    lineHeight: 1.6,
    defaultBorderRadius: '8px',
    defaultBorderStyle: 'solid',
    defaultBorderWidth: '0px',
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
  },
  blocks: [
    {
      id: 'mnl-hero',
      type: 'hero',
      props: {
        height: '200px',
        line1Text: "What's New This Month",
        line1FontSize: '36px',
        line1Color: '#ffffff',
        line2Text: 'Stay updated with the latest insights and updates',
        line2FontSize: '16px',
        line2Color: '#e0e7ff',
        backgroundColor: '#2563eb',
        padding: '0px',
      },
    },
    {
      id: 'mnl-spacer-1',
      type: 'divider',
      props: {
        borderWidth: '0px',
        height: '32px',
      },
    },
    {
      id: 'mnl-content',
      type: 'text',
      props: {
        content:
          "<h2>Featured Story</h2><p>Discover what's happening in our community. This month we're excited to share some incredible developments and innovations that are shaping our future.</p>",
        align: 'left',
        padding: '0px 32px',
      },
    },
    {
      id: 'mnl-spacer-2',
      type: 'divider',
      props: {
        borderWidth: '0px',
        height: '24px',
      },
    },
    {
      id: 'mnl-highlights',
      type: 'columns',
      props: {
        columns: 2,
        columnWidths: '50,50',
        columnBlocks: [
          [
            {
              id: 'mnl-col1-text',
              type: 'text',
              props: {
                content:
                  "<h3>Insight 1</h3><p>Explore the first key development that's making an impact.</p>",
                align: 'left',
                padding: '16px 0px',
                borderWidth: '1px',
                innerPadding: '+4',
              },
            },
          ],
          [
            {
              id: 'mnl-col2-text',
              type: 'text',
              props: {
                content:
                  "<h3>Insight 2</h3><p>Learn about the second major initiative we're launching.</p>",
                align: 'left',
                padding: '16px 0px',
                borderWidth: '1px',
                innerPadding: '+4',
              },
            },
          ],
        ],
      },
    },
    {
      id: 'mnl-spacer-3',
      type: 'divider',
      props: {
        borderWidth: '0px',
        height: '32px',
      },
    },
    {
      id: 'mnl-cta',
      type: 'button',
      props: {
        buttonText: 'Read Full Newsletter',
        href: 'https://...',
        align: 'center',
        padding: '16px 0px',
        text: 'Click here',
      },
    },
    {
      id: 'mnl-spacer-4',
      type: 'divider',
      props: {
        borderWidth: '0px',
        height: '32px',
      },
    },
    {
      id: 'mnl-footer',
      type: 'text',
      props: {
        content: '<p style="font-size: 12px;">© 2026 Your Company. All rights reserved.</p>',
        align: 'center',
        padding: '24px 32px 32px',
      },
    },
  ],
  isPreset: false,
}
