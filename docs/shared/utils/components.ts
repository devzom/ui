import { z } from 'zod'

const componentSchemas = {
  accordion: z.object({
    items: z.array(
      z.object({
        label: z.string().describe('The title/header of the accordion item'),
        content: z.string().describe('The main content text for this accordion section'),
        icon: z.string().optional().describe('Optional icon name (e.g., i-lucide-user)')
      })
    ).describe('Array of accordion items to display')
  }),

  alert: z.object({
    title: z.string().describe('The alert title'),
    description: z.string().describe('The alert description/content'),
    color: z.enum(['primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral']).optional().describe('Alert color theme'),
    variant: z.enum(['solid', 'outline', 'soft', 'subtle']).optional().describe('Alert visual variant'),
    icon: z.string().optional().describe('Optional icon name for the alert')
  })
} as const

/**
 * Get the schema for a specific component by name
 */
export function getComponentSchema(componentName: string) {
  const normalizedName = componentName.replace(/^U/, '').toLowerCase()
  return componentSchemas[normalizedName as keyof typeof componentSchemas] || null
}

/**
 * Check if a component has an AI schema defined
 */
export function hasComponentSchema(componentName: string): boolean {
  const normalizedName = componentName.replace(/^U/, '').toLowerCase()
  return normalizedName in componentSchemas
}

/**
 * Get available component names with schemas
 */
export function getAvailableComponents(): string[] {
  return Object.keys(componentSchemas)
}
