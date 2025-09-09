import { getComponentMeta } from 'nuxt-component-meta/parser'
import { propsToJsonSchema } from 'nuxt-component-meta/utils'
import { jsonSchemaToZod } from 'json-schema-to-zod'
import type { z } from 'zod'

const AI_PROPS = ['items', 'description', 'title', 'label', 'content', 'text', 'name']

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

export function hasComponentSchema(componentName: string): boolean {
  return getComponentSchema(componentName) !== null
}
