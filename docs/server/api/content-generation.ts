import { gateway } from '@ai-sdk/gateway'
import { generateObject } from 'ai'
import { getComponentSchema } from '~~/shared/utils'
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
        statusMessage: `No schema found for component: ${componentName}`
      })
    }

    const systemPrompt = createSystemPrompt(componentName)
    const userPrompt = `${prompt}\n\nPlease generate appropriate content for a ${componentName} component.`

    const result = await generateObject({
      model: gateway('openai/gpt-4o-mini'),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
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

function createSystemPrompt(componentName: string): string {
  return `You are an expert UI/UX designer and developer. Generate realistic, useful, and contextually appropriate content for Nuxt UI components.

Instructions:
- Generate content that matches the user's prompt and use case
- Use clear, descriptive labels and meaningful text
- Choose appropriate colors, variants, and sizes based on semantic meaning
- For icons, use Lucide icons with the format: i-lucide-icon-name
- Keep content concise but informative
- Ensure all generated data is realistic and would be genuinely useful in a real application
- If generating arrays/lists, create 3-5 items unless otherwise specified
- Use professional, modern language appropriate for web applications

Component: ${componentName}
Generate content that fits the schema requirements and the user's specific request.`
}
