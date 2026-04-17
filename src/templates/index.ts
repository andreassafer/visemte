export { modernNewsletterTemplate } from './modernNewsletterTemplate'
export { productShowcaseTemplate } from './productShowcaseTemplate'
export { eventInvitationTemplate } from './eventInvitationTemplate'

import { modernNewsletterTemplate } from './modernNewsletterTemplate'
import { productShowcaseTemplate } from './productShowcaseTemplate'
import { eventInvitationTemplate } from './eventInvitationTemplate'
import type { EmailTemplate } from '@/types'

export const PRESET_TEMPLATES: EmailTemplate[] = [
  modernNewsletterTemplate,
  productShowcaseTemplate,
  eventInvitationTemplate,
]
