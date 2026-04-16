import type { EmailTemplate } from '@/types'

export const eventTemplate: EmailTemplate = {
  id: 'preset-event',
  name: 'Event Invitation',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  settings: {
    backgroundColor: '#f8f5ff',
    contentWidth: 600,
    fontFamily: 'Arial, sans-serif',
    fontSize: 14,
    fontColor: '#1e1b4b',
    lineHeight: 1.6,
  },
  blocks: [
    // ── Hero ────────────────────────────────────────────────────────────────
    {
      id: 'evt-1',
      type: 'hero',
      props: {
        src: '',
        height: '260px',
        backgroundColor: '#4f46e5',
        backgroundPosition: 'center center',
        textAlign: 'center',
        line1Text: 'You\'re Invited 🎉',
        line1Color: '#ffffff',
        line1FontSize: '40px',
        line2Text: 'Annual Tech Summit 2026',
        line2Color: '#c7d2fe',
        line2FontSize: '20px',
        padding: '48px 25px',
        sectionBg: '#4f46e5',
        borderRadius: '0px',
      },
    },
    // ── Date / Location row ──────────────────────────────────────────────────
    {
      id: 'evt-2',
      type: 'columns',
      props: {
        columns: 2,
        gap: '0px',
        padding: '20px 24px 8px',
        sectionBg: '#ffffff',
        columnBlocks: [
          [
            {
              id: 'evt-2-col1',
              type: 'text',
              props: {
                content:
                  '<p style="margin:0 0 4px;font-size:11px;color:#6366f1;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">📅 Date & Time</p><p style="margin:0;font-size:15px;font-weight:bold;color:#1e1b4b;">June 14, 2026</p><p style="margin:0;font-size:13px;color:#64748b;">9:00 AM – 6:00 PM (EST)</p>',
                align: 'left',
                color: '#64748b',
                fontSize: '13px',
                padding: '14px 16px',
                sectionBg: '#f5f3ff',
                borderRadius: '8px',
              },
            },
          ],
          [
            {
              id: 'evt-2-col2',
              type: 'text',
              props: {
                content:
                  '<p style="margin:0 0 4px;font-size:11px;color:#6366f1;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">📍 Location</p><p style="margin:0;font-size:15px;font-weight:bold;color:#1e1b4b;">Javits Center</p><p style="margin:0;font-size:13px;color:#64748b;">New York, NY 10001</p>',
                align: 'left',
                color: '#64748b',
                fontSize: '13px',
                padding: '14px 16px',
                sectionBg: '#f5f3ff',
                borderRadius: '8px',
              },
            },
          ],
        ],
      },
    },
    // ── Intro text ───────────────────────────────────────────────────────────
    {
      id: 'evt-3',
      type: 'text',
      props: {
        content:
          '<p style="margin:0 0 12px;font-size:17px;font-weight:bold;color:#1e1b4b;">Join us for a day of innovation</p><p style="margin:0;line-height:1.7;color:#475569;">We\'re bringing together the brightest minds in tech for a full day of talks, workshops, and networking. Discover the latest trends, learn from industry leaders, and connect with thousands of professionals who share your passion for technology.</p>',
        align: 'left',
        color: '#475569',
        fontSize: '15px',
        padding: '24px 30px 16px',
        sectionBg: '#ffffff',
        borderRadius: '0px',
      },
    },
    // ── Countdown ────────────────────────────────────────────────────────────
    {
      id: 'evt-4',
      type: 'countdown',
      props: {
        targetDate: '2026-06-14T09:00:00',
        labelDays: 'Days',
        labelHours: 'Hours',
        labelMinutes: 'Minutes',
        labelSeconds: 'Seconds',
        bgColor: '#4f46e5',
        textColor: '#ffffff',
        labelColor: '#a5b4fc',
        fontSize: '32px',
        labelFontSize: '11px',
        align: 'center',
        padding: '8px 25px 20px',
        sectionBg: '#ffffff',
      },
    },
    // ── Speakers heading ─────────────────────────────────────────────────────
    {
      id: 'evt-5',
      type: 'divider',
      props: {
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#e0e7ff',
        padding: '4px 30px',
        sectionBg: '#ffffff',
        text: 'Featured Speakers',
      },
    },
    // ── 3 speakers ───────────────────────────────────────────────────────────
    {
      id: 'evt-6',
      type: 'columns',
      props: {
        columns: 3,
        gap: '0px',
        padding: '16px 24px 24px',
        sectionBg: '#ffffff',
        columnBlocks: [
          [
            {
              id: 'evt-6-col1',
              type: 'text',
              props: {
                content:
                  '<p style="margin:0 0 6px;font-size:14px;font-weight:bold;color:#1e1b4b;">Sarah Chen</p><p style="margin:0 0 4px;font-size:12px;color:#6366f1;font-weight:bold;">CEO, NovaTech</p><p style="margin:0;font-size:12px;color:#64748b;line-height:1.5;">The Future of AI in Enterprise</p>',
                align: 'center',
                color: '#64748b',
                fontSize: '12px',
                padding: '14px 8px',
                sectionBg: '#f5f3ff',
                borderRadius: '8px',
              },
            },
          ],
          [
            {
              id: 'evt-6-col2',
              type: 'text',
              props: {
                content:
                  '<p style="margin:0 0 6px;font-size:14px;font-weight:bold;color:#1e1b4b;">Marcus Webb</p><p style="margin:0 0 4px;font-size:12px;color:#6366f1;font-weight:bold;">CTO, CloudBase</p><p style="margin:0;font-size:12px;color:#64748b;line-height:1.5;">Scaling Systems to One Billion Users</p>',
                align: 'center',
                color: '#64748b',
                fontSize: '12px',
                padding: '14px 8px',
                sectionBg: '#f5f3ff',
                borderRadius: '8px',
              },
            },
          ],
          [
            {
              id: 'evt-6-col3',
              type: 'text',
              props: {
                content:
                  '<p style="margin:0 0 6px;font-size:14px;font-weight:bold;color:#1e1b4b;">Priya Nair</p><p style="margin:0 0 4px;font-size:12px;color:#6366f1;font-weight:bold;">Head of Design, Figma</p><p style="margin:0;font-size:12px;color:#64748b;line-height:1.5;">Design Systems That Scale</p>',
                align: 'center',
                color: '#64748b',
                fontSize: '12px',
                padding: '14px 8px',
                sectionBg: '#f5f3ff',
                borderRadius: '8px',
              },
            },
          ],
        ],
      },
    },
    // ── FAQ ───────────────────────────────────────────────────────────────────
    {
      id: 'evt-7',
      type: 'accordion',
      props: {
        itemCount: '3',
        question1: 'Is the event free to attend?',
        answer1: 'General admission is free. VIP passes with exclusive workshops and networking dinners are available for $199.',
        question2: 'Will sessions be recorded?',
        answer2: 'Yes! All main-stage talks will be recorded and made available to registered attendees within 48 hours after the event.',
        question3: 'How do I get there?',
        answer3: 'The Javits Center is easily accessible by subway (A, C, E lines to 34th St – Hudson Yards). Parking is available on-site.',
        questionColor: '#1e1b4b',
        answerColor: '#64748b',
        borderColor: '#e0e7ff',
        bgColor: '#f5f3ff',
        padding: '8px 30px 20px',
        sectionBg: '#ffffff',
      },
    },
    // ── CTA button ───────────────────────────────────────────────────────────
    {
      id: 'evt-8',
      type: 'button',
      props: {
        text: 'Reserve My Spot →',
        href: '#',
        align: 'center',
        backgroundColor: '#4f46e5',
        color: '#ffffff',
        fontSize: '15px',
        padding: '8px 30px 28px',
        innerPadding: '14px 40px',
        borderRadius: '50px',
        sectionBg: '#ffffff',
      },
    },
    // ── Divider ───────────────────────────────────────────────────────────────
    {
      id: 'evt-9',
      type: 'divider',
      props: {
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#e0e7ff',
        padding: '4px 30px',
        sectionBg: '#ffffff',
        text: '',
      },
    },
    // ── Social ───────────────────────────────────────────────────────────────
    {
      id: 'evt-10',
      type: 'social',
      props: {
        align: 'center',
        padding: '14px 25px',
        networks: 'twitter,linkedin,youtube',
        iconSize: '26',
        sectionBg: '#ffffff',
      },
    },
    // ── Footer ───────────────────────────────────────────────────────────────
    {
      id: 'evt-11',
      type: 'text',
      props: {
        content:
          '<p style="margin:0;">© 2026 Tech Summit · Javits Center, New York · <a href="#" style="color:#a5b4fc;text-decoration:none;">Unsubscribe</a></p>',
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
