import type { EmailTemplate } from '@/types'

export const eventInvitationTemplate: EmailTemplate = {
  id: 'preset-ew9cqvgxcxjxh5yAc9oFI',
  name: 'Event Invitation',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  settings: {
    backgroundColor: '#faf5ff',
    contentWidth: 600,
    fontFamily: 'Arial, sans-serif',
    fontSize: 14,
    fontColor: '#374151',
    lineHeight: 1.6,
    defaultBorderRadius: '8px',
    defaultBorderStyle: 'solid',
    defaultBorderWidth: '0px',
    primaryColor: '#7c3aed',
    secondaryColor: '#6d28d9',
  },
  blocks: [
    {
      id: 'ei-hero',
      type: 'hero',
      props: {
        height: '240px',
        line1Text: "You're Invited! 🎉",
        line1FontSize: '44px',
        line1Color: '#ffffff',
        line2Text: 'Join us for an unforgettable experience',
        line2FontSize: '18px',
        line2Color: '#ede9fe',
        backgroundColor: '#7c3aed',
        padding: '0px',
      },
    },
    {
      id: 'ei-spacer-1',
      type: 'divider',
      props: {
        borderWidth: '0px',
        height: '32px',
      },
    },
    {
      id: 'ei-details',
      type: 'text',
      props: {
        content:
          '<h2 style="margin-top: 0;">Event Details</h2><table style="width: 100%;><tr><td style="padding: 8px 0;"><strong>📅 Date:</strong></td><td style="padding: 8px 0;">June 15, 2026</td></tr><tr><td style="padding: 8px 0;"><strong>⏰ Time:</strong></td><td style="padding: 8px 0;">2:00 PM – 6:00 PM</td></tr><tr><td style="padding: 8px 0;"><strong>📍 Location:</strong></td><td style="padding: 8px 0;">Grand Ballroom, Downtown</td></tr></table>',
        align: 'left',
        padding: '0px 32px',
        borderWidth: '1px',
        borderStyle: 'dotted',
        borderColor: 'borderColor',
        innerPadding: '+4',
      },
    },
    {
      id: 'ei-spacer-2',
      type: 'divider',
      props: {
        borderWidth: '0px',
        height: '24px',
      },
    },
    {
      id: 'ei-description',
      type: 'text',
      props: {
        content:
          '<p>We\'re thrilled to invite you to our exclusive event! This is an incredible opportunity to network with industry leaders, discover cutting-edge innovations, and celebrate together.</p><p><strong>What to expect:</strong></p><ul style="margin: 8px 0; padding-left: 20px;"><li>Inspiring keynote speeches</li><li>Networking opportunities</li><li>Premium refreshments</li><li>Exclusive giveaways</li></ul>',
        align: 'left',
        padding: '0px 32px',
      },
    },
    {
      id: 'ei-spacer-3',
      type: 'divider',
      props: {
        borderWidth: '0px',
        height: '32px',
      },
    },
    {
      id: 'ei-cta',
      type: 'button',
      props: {
        buttonText: 'Confirm Attendance',
        href: 'https://...',
        align: 'center',
        padding: '16px 0px',
        text: 'Click here',
      },
    },
    {
      id: 'ei-spacer-4',
      type: 'divider',
      props: {
        borderWidth: '0px',
        height: '24px',
      },
    },
    {
      id: 'ei-info',
      type: 'text',
      props: {
        content:
          '<p style="font-size: 13px; color: #666;">Have questions? Reply to this email or visit <a href="#" style="color: #7c3aed;">our event page</a> for more details.</p><p style="font-size: 12px; color: #999;">Looking forward to seeing you there!</p>',
        align: 'center',
        padding: '16px 32px 32px',
      },
    },
  ],
  isPreset: false,
}
