import { getComponentMeta } from 'nuxt-component-meta/parser'
import { propsToJsonSchema } from 'nuxt-component-meta/utils'
import { jsonSchemaToZod } from 'json-schema-to-zod'
import { gateway } from '@ai-sdk/gateway'
import { generateObject } from 'ai'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  try {
    const { prompt, componentName } = await readValidatedBody(event, z.object({
      prompt: z.string(),
      componentName: z.string()
    }).parse)

    const schema = getComponentSchema(componentName)

    if (!schema) {
      throw createError({
        statusCode: 400,
        statusMessage: `Component ${componentName} not supported`
      })
    }

    const systemPrompt = `You are an expert content generator specialized in populating component properties with realistic, meaningful data.

Rules:
- NEVER use HTML tags in text content (no <p>, <strong>, <li>, <ul>, etc.)
- ONLY use plain text for all content fields
- ONLY generate properties that exist in the provided schema
- DO NOT invent new properties or keys
- Generate ONLY the exact structure required by the schema

LUCIDE ICONS - USE ONLY EXISTING ICONS:
- Use format: i-lucide-[icon-name]
- Common icons that EXIST: i-lucide-home, i-lucide-user, i-lucide-settings, i-lucide-mail, i-lucide-phone, i-lucide-briefcase, i-lucide-code, i-lucide-palette, i-lucide-camera, i-lucide-map-pin, i-lucide-clock, i-lucide-star, i-lucide-heart, i-lucide-shield, i-lucide-globe, i-lucide-folder, i-lucide-file, i-lucide-image, i-lucide-music, i-lucide-video, i-lucide-download, i-lucide-upload, i-lucide-search, i-lucide-plus, i-lucide-minus, i-lucide-check, i-lucide-x, i-lucide-arrow-right, i-lucide-arrow-left, i-lucide-chevron-right, i-lucide-chevron-down
- DO NOT invent icons like "i-lucide-tools", "i-lucide-design", etc.
- When in doubt, use common icons like i-lucide-folder, i-lucide-file, or i-lucide-star

CONTENT GUIDELINES:
- Generate content that matches the user's prompt and use case
- Use clear, descriptive labels and meaningful text
- Keep content concise but informative
- Ensure all generated data is realistic and would be genuinely useful in a real application
- If generating arrays/lists, create 3-5 items unless otherwise specified
- If generating links, use '#' as the source
- Use professional, modern language appropriate for web applications

Component: ${componentName}
Generate ONLY the exact structure required by the schema. Do not add extra properties.`

    const result = await generateObject({
      model: gateway('openai/gpt-4.1-nano'),
      system: systemPrompt,
      prompt: `${prompt}. Generate content for a ${componentName} component.`,
      temperature: 0.3,
      schema
    })

    return result.object
  } catch (error) {
    console.error('AI generation error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error during AI generation'
    })
  }
})

const AI_PROPS = [
  'items',
  'description',
  'title',
  'label',
  'text'
]

export function getComponentSchema(componentName: string): z.ZodType<any> | null {
  try {
    const meta = getComponentMeta(`src/runtime/components/${componentName}.vue`)

    if (!meta?.props) return null

    const filteredProps = Object.values(meta.props).filter((prop: any) => AI_PROPS.includes(prop.name))
    if (filteredProps.length === 0) return null

    const jsonSchema = propsToJsonSchema(filteredProps)
    const zodString = jsonSchemaToZod(jsonSchema)
    return eval(zodString)
  } catch {
    return null
  }
}
