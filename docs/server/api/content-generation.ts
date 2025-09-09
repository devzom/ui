import { gateway } from '@ai-sdk/gateway'
import { generateObject } from 'ai'
import { z } from 'zod'

export const maxDuration = 30

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

    const systemPrompt = `You are an expert UI/UX designer and developer. Generate realistic, useful content for Nuxt UI components.

Rules:
- NEVER use HTML tags in text content (no <p>, <strong>, <li>, <ul>, etc.)
- ONLY use plain text for all content fields
- ONLY generate properties that exist in the provided schema
- DO NOT invent new properties or keys
- For icons, use Lucide icons with the format: i-lucide-icon-name
- Keep text content clean and readable without markup

Content Guidelines:
- Generate content that matches the user's prompt and use case
- Use clear, descriptive labels and meaningful text
- Keep content concise but informative
- Ensure all generated data is realistic and would be genuinely useful in a real application
- If generating arrays/lists, create 3-5 items unless otherwise specified
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
