import type { EmailTemplate } from '@/types'

export const productShowcaseTemplate: EmailTemplate = {
  id: 'preset-HQ1WG77RxaOGP_5hsSZWi',
  name: 'Product Showcase',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  settings: {
    backgroundColor: '#f9fafb',
    contentWidth: 600,
    fontFamily: 'Arial, sans-serif',
    fontSize: 14,
    fontColor: '#374151',
    lineHeight: 1.6,
    defaultBorderRadius: '8px',
    defaultBorderStyle: 'solid',
    defaultBorderWidth: '0px',
    primaryColor: '#059669',
    secondaryColor: '#047857',
  },
  blocks: [
    {
      id: 'ps-hero',
      type: 'hero',
      props: {
        height: '220px',
        line1Text: 'Introducing Our Latest Product',
        line1FontSize: '40px',
        line1Color: '#ffffff',
        line2Text: 'Innovation meets simplicity',
        line2FontSize: '18px',
        line2Color: '#d1fae5',
        backgroundColor: '#059669',
        padding: '0px',
      },
    },
    {
      id: 'ps-spacer-1',
      type: 'divider',
      props: {
        borderWidth: '0px',
        height: '32px',
      },
    },
    {
      id: 'ps-overview',
      type: 'text',
      props: {
        content:
          "<h2>Why You'll Love It</h2><p>Our newest product combines cutting-edge technology with elegant design. Built with your needs in mind, it delivers powerful features in a simple, intuitive package.</p>",
        align: 'left',
        padding: '0px 32px',
      },
    },
    {
      id: 'ps-spacer-2',
      type: 'divider',
      props: {
        borderWidth: '0px',
        height: '24px',
      },
    },
    {
      id: 'ps-features',
      type: 'columns',
      props: {
        columns: 3,
        columnWidths: '33,33,34',
        columnBlocks: [
          [
            {
              id: 'ps-feat1',
              type: 'text',
              props: {
                content:
                  '<h4 style="margin-top: 0;">⚡ Fast</h4><p>Lightning-quick performance that keeps up.</p>',
                align: 'center',
                padding: '16px 8px',
                borderWidth: '1px',
              },
            },
          ],
          [
            {
              id: 'ps-feat2',
              type: 'text',
              props: {
                content:
                  '<h4 style="margin-top: 0;">🔒 Secure</h4><p>Enterprise-grade security protects your data.</p>',
                align: 'center',
                padding: '16px 8px',
                borderWidth: '1px',
              },
            },
          ],
          [
            {
              id: 'ps-feat3',
              type: 'text',
              props: {
                content:
                  '<h4 style="margin-top: 0;">🎯 Intuitive</h4><p>Simple design that anyone can master instantly.</p>',
                align: 'center',
                padding: '16px 8px',
                borderWidth: '1px',
              },
            },
          ],
        ],
      },
    },
    {
      id: 'ps-spacer-3',
      type: 'divider',
      props: {
        borderWidth: '0px',
        height: '32px',
      },
    },
    {
      id: 'ps-cta-primary',
      type: 'button',
      props: {
        buttonText: 'Shop Now',
        href: 'https://...',
        align: 'center',
        padding: '16px 0px',
        text: 'Click here',
      },
    },
    {
      id: 'ps-footer',
      type: 'text',
      props: {
        content:
          '<p style="font-size: 12px;">Questions? <a href="mailto:support@example.com">Contact our team</a></p>',
        align: 'center',
        padding: '24px 32px 32px',
      },
    },
  ],
  isPreset: false,
}
