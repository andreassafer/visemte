export { newsletterTemplate } from './newsletter'
export { promotionalTemplate } from './promotional'
export { welcomeTemplate } from './welcome'
export { eventTemplate } from './event'
export { productLaunchTemplate } from './productlaunch'
export { reengagementTemplate } from './reengagement'
export { orderConfirmationTemplate } from './orderconfirmation'

import { newsletterTemplate } from './newsletter'
import { promotionalTemplate } from './promotional'
import { welcomeTemplate } from './welcome'
import { eventTemplate } from './event'
import { productLaunchTemplate } from './productlaunch'
import { reengagementTemplate } from './reengagement'
import { orderConfirmationTemplate } from './orderconfirmation'
import type { EmailTemplate } from '@/types'

export const PRESET_TEMPLATES: EmailTemplate[] = [
  newsletterTemplate,
  welcomeTemplate,
  promotionalTemplate,
  eventTemplate,
  productLaunchTemplate,
  reengagementTemplate,
  orderConfirmationTemplate,
]
