import { z } from 'zod'

const BlockTypeSchema = z.enum([
  'text',
  'image',
  'button',
  'divider',

  'columns',
  'social',
  'navbar',
  'hero',
  'video',
  'countdown',
  'accordion',
  'quote',
])

const EmailBlockSchema = z
  .object({
    id: z.string(),
    type: BlockTypeSchema,
    props: z.record(z.string(), z.unknown()),
  })
  .loose()

const TemplateSettingsSchema = z
  .object({
    backgroundColor: z.string(),
    contentWidth: z.number(),
    fontFamily: z.string(),
    fontSize: z.number(),
    fontColor: z.string().optional().default('#000000'),
    lineHeight: z.number().optional().default(1.5),
  })
  .loose()

export const EmailTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  settings: TemplateSettingsSchema,
  blocks: z.array(EmailBlockSchema),
})

export function validateTemplate(data: unknown) {
  return EmailTemplateSchema.safeParse(data)
}
