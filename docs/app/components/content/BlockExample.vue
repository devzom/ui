<script setup lang="ts">
import { camelCase } from 'scule'
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import type { TabsItem } from '@nuxt/ui'

const props = withDefaults(defineProps<{
  name: string
  /**
   * Whether to format the code with Prettier
   * @defaultValue false
   */
  prettier?: boolean
  /**
   * Custom height for the iframe container
   * @defaultValue '500px'
   */
  height?: string
  /**
   * Whether to collapse the code block
   * @defaultValue false
   */
  collapse?: boolean
  /**
   * Whether to show the source code
   * @defaultValue true
   */
  source?: boolean
  /**
   * A list of line numbers to highlight in the code block
   */
  highlights?: number[]
  /**
   * Whether to center the example content
   * @defaultValue true
   */
  centered?: boolean
}>(), {
  source: true,
  height: '500px',
  centered: true
})

const { $prettier } = useNuxtApp()
const camelName = camelCase(props.name)

const data = await fetchComponentExample(camelName)

const code = computed(() => {
  let code = ''

  if (props.collapse) {
    code += `::code-collapse
`
  }

  code += `\`\`\`vue${props.highlights?.length ? `{${props.highlights.join('-')}}` : ''}
${data?.code ?? ''}
\`\`\``

  if (props.collapse) {
    code += `
::`
  }

  return code
})

const { data: ast } = await useAsyncData(`block-example-${camelName}`, async () => {
  if (!props.prettier) {
    return parseMarkdown(code.value)
  }

  let formatted = ''
  try {
    formatted = await $prettier.format(code.value, {
      trailingComma: 'none',
      semi: false,
      singleQuote: true,
      printWidth: 100
    })
  } catch {
    formatted = code.value
  }

  return parseMarkdown(formatted)
}, { watch: [code] })

const items = [
  {
    label: 'Preview',
    slot: 'preview' as const
  },
  {
    label: 'Code',
    slot: 'code' as const
  }
] satisfies TabsItem[]

// Fullscreen functionality - available for integration

const openFullscreen = () => {
  const url = `/examples/${props.name}?centered=${props.centered}`
  window.open(url, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes')
}
</script>

<template>
  <div class="my-6 border border-muted overflow-hidden" :style="{ height: props.height }">
    <UTabs
      :items="items"
      class="size-full gap-0"
      variant="link"
      :ui="{ content: 'size-full' }"
    >
      <template #preview>
        <SplitterGroup
          :id="`splitter-${camelName}`"
          direction="horizontal"
        >
          <SplitterPanel
            :id="`splitter-${camelName}-panel-1`"
            :default-size="70"
            :min-size="30"
            class="overflow-hidden"
          >
            <iframe
              :src="`/examples/${name}?centered=${centered}`"
              class="w-full h-full border-0"
            />
          </SplitterPanel>
          <SplitterResizeHandle
            :id="`splitter-${camelName}-handle`"
            class="group w-4 flex items-center justify-center"
          >
            <div class="w-1 h-8 group-hover:h-16 bg-elevated transition-all rounded-full" />
          </SplitterResizeHandle>

          <SplitterPanel
            :id="`splitter-${camelName}-panel-2`"
            :default-size="0"
            :min-size="0"
          />
        </SplitterGroup>
      </template>

      <template #code>
        <div
          v-if="source"
          class="overflow-y-auto mt-[1px] h-full"
          :style="{ maxHeight: `calc(${props.height} - 40px)` }"
        >
          <MDCRenderer v-if="ast" :body="ast.body" :data="ast.data" class="*:my-0 *:*:border-none *:*:rounded-none" />
        </div>
      </template>

      <template #list-trailing>
        <div class="ml-2 flex items-center gap-2">
          <span class="text-muted text-sm">
            |
          </span>

          <UTooltip
            text="Open in fullscreen"
            :delay-duration="0"
            :content="{
              side: 'top'
            }"
          >
            <UButton
              variant="ghost"
              size="sm"
              square
              color="neutral"
              icon="i-lucide-maximize"
              @click="openFullscreen"
            />
          </UTooltip>
        </div>
      </template>
    </UTabs>
  </div>
</template>
