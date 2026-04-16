import type { EmailTemplate } from '@/types'

export const orderConfirmationTemplate: EmailTemplate = {
  id: 'preset-orderconfirmation',
  name: 'Order Confirmation',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  settings: {
    backgroundColor: '#f4f4f4',
    contentWidth: 600,
    fontFamily: 'Arial, sans-serif',
    fontSize: 14,
    fontColor: '#111827',
    lineHeight: 1.6,
  },
  blocks: [
    // ── Header ───────────────────────────────────────────────────────────────
    {
      id: 'oc-1',
      type: 'hero',
      props: {
        src: '',
        height: '180px',
        backgroundColor: '#16a34a',
        backgroundPosition: 'center center',
        textAlign: 'center',
        line1Text: '✅ Order Confirmed!',
        line1Color: '#ffffff',
        line1FontSize: '34px',
        line2Text: 'Thank you for your purchase.',
        line2Color: '#bbf7d0',
        line2FontSize: '16px',
        padding: '40px 25px',
        sectionBg: '#16a34a',
        borderRadius: '0px',
      },
    },
    // ── Order info ────────────────────────────────────────────────────────────
    {
      id: 'oc-2',
      type: 'columns',
      props: {
        columns: 2,
        gap: '0px',
        padding: '20px 24px 8px',
        sectionBg: '#ffffff',
        columnBlocks: [
          [
            {
              id: 'oc-2-col1',
              type: 'text',
              props: {
                content:
                  '<p style="margin:0 0 4px;font-size:11px;color:#16a34a;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">Order Number</p><p style="margin:0;font-size:16px;font-weight:bold;color:#111827;">#ORD-20260318</p>',
                align: 'left',
                color: '#111827',
                fontSize: '13px',
                padding: '14px 16px',
                sectionBg: '#f0fdf4',
                borderRadius: '8px',
              },
            },
          ],
          [
            {
              id: 'oc-2-col2',
              type: 'text',
              props: {
                content:
                  '<p style="margin:0 0 4px;font-size:11px;color:#16a34a;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">Estimated Delivery</p><p style="margin:0;font-size:16px;font-weight:bold;color:#111827;">March 22–24, 2026</p>',
                align: 'left',
                color: '#111827',
                fontSize: '13px',
                padding: '14px 16px',
                sectionBg: '#f0fdf4',
                borderRadius: '8px',
              },
            },
          ],
        ],
      },
    },
    // ── Order summary heading ─────────────────────────────────────────────────
    {
      id: 'oc-3',
      type: 'divider',
      props: {
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#e5e7eb',
        padding: '12px 30px 4px',
        sectionBg: '#ffffff',
        text: 'Order Summary',
      },
    },
    // ── Item 1 ────────────────────────────────────────────────────────────────
    {
      id: 'oc-4',
      type: 'columns',
      props: {
        columns: 2,
        gap: '0px',
        padding: '12px 24px 4px',
        sectionBg: '#ffffff',
        columnBlocks: [
          [
            {
              id: 'oc-4-col1',
              type: 'image',
              props: {
                src: '',
                alt: 'Product 1',
                align: 'center',
                width: '100%',
                borderRadius: '6px',
                padding: '0 10px 0 0',
                sectionBg: '',
              },
            },
          ],
          [
            {
              id: 'oc-4-col2',
              type: 'text',
              props: {
                content:
                  '<p style="margin:0 0 4px;font-size:14px;font-weight:bold;color:#111827;">Urban Runner Pro</p><p style="margin:0 0 8px;font-size:13px;color:#6b7280;">Size: 42 · Color: Black</p><p style="margin:0;font-size:15px;font-weight:bold;color:#111827;">$59.99</p>',
                align: 'left',
                color: '#6b7280',
                fontSize: '13px',
                padding: '4px 0 10px 4px',
                sectionBg: '',
                borderRadius: '0px',
              },
            },
          ],
        ],
      },
    },
    // ── Item 2 ────────────────────────────────────────────────────────────────
    {
      id: 'oc-5',
      type: 'columns',
      props: {
        columns: 2,
        gap: '0px',
        padding: '4px 24px 12px',
        sectionBg: '#ffffff',
        columnBlocks: [
          [
            {
              id: 'oc-5-col1',
              type: 'image',
              props: {
                src: '',
                alt: 'Product 2',
                align: 'center',
                width: '100%',
                borderRadius: '6px',
                padding: '0 10px 0 0',
                sectionBg: '',
              },
            },
          ],
          [
            {
              id: 'oc-5-col2',
              type: 'text',
              props: {
                content:
                  '<p style="margin:0 0 4px;font-size:14px;font-weight:bold;color:#111827;">City Pack 30L</p><p style="margin:0 0 8px;font-size:13px;color:#6b7280;">Color: Navy Blue · Qty: 1</p><p style="margin:0;font-size:15px;font-weight:bold;color:#111827;">$44.99</p>',
                align: 'left',
                color: '#6b7280',
                fontSize: '13px',
                padding: '4px 0 10px 4px',
                sectionBg: '',
                borderRadius: '0px',
              },
            },
          ],
        ],
      },
    },
    // ── Totals ────────────────────────────────────────────────────────────────
    {
      id: 'oc-6',
      type: 'text',
      props: {
        content:
          '<table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;color:#6b7280;"><tr><td style="padding:4px 0;">Subtotal</td><td align="right">$104.98</td></tr><tr><td style="padding:4px 0;">Shipping</td><td align="right" style="color:#16a34a;font-weight:bold;">Free</td></tr><tr><td style="padding:8px 0 4px;font-size:15px;font-weight:bold;color:#111827;border-top:1px solid #e5e7eb;">Total</td><td align="right" style="padding:8px 0 4px;font-size:15px;font-weight:bold;color:#111827;border-top:1px solid #e5e7eb;">$104.98</td></tr></table>',
        align: 'left',
        color: '#6b7280',
        fontSize: '13px',
        padding: '8px 30px 20px',
        sectionBg: '#ffffff',
        borderRadius: '0px',
      },
    },
    // ── Shipping address ──────────────────────────────────────────────────────
    {
      id: 'oc-7',
      type: 'divider',
      props: {
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#e5e7eb',
        padding: '4px 30px',
        sectionBg: '#ffffff',
        text: 'Shipping Address',
      },
    },
    {
      id: 'oc-8',
      type: 'text',
      props: {
        content:
          '<p style="margin:0;line-height:1.8;color:#374151;">Jane Doe<br>456 Market Street, Apt 3B<br>San Francisco, CA 94105<br>United States</p>',
        align: 'left',
        color: '#374151',
        fontSize: '14px',
        padding: '12px 30px 24px',
        sectionBg: '#ffffff',
        borderRadius: '0px',
      },
    },
    // ── Track order CTA ───────────────────────────────────────────────────────
    {
      id: 'oc-9',
      type: 'button',
      props: {
        text: 'Track My Order →',
        href: '#',
        align: 'center',
        backgroundColor: '#16a34a',
        color: '#ffffff',
        fontSize: '15px',
        padding: '8px 30px 28px',
        innerPadding: '13px 40px',
        borderRadius: '6px',
        sectionBg: '#ffffff',
      },
    },
    // ── Divider ───────────────────────────────────────────────────────────────
    {
      id: 'oc-10',
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
    // ── Footer ───────────────────────────────────────────────────────────────
    {
      id: 'oc-11',
      type: 'text',
      props: {
        content:
          '<p style="margin:0;">Questions about your order? <a href="mailto:support@acme.com" style="color:#16a34a;text-decoration:none;">Contact Support</a></p><p style="margin:6px 0 0;">© 2026 Acme Corp · <a href="#" style="color:#9ca3af;text-decoration:none;">Unsubscribe</a></p>',
        align: 'center',
        color: '#9ca3af',
        fontSize: '12px',
        padding: '25px 12px 20px',
        sectionBg: '#ffffff',
        borderRadius: '0px',
      },
    },
  ],
}
