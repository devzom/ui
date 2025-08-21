<script setup lang="ts">
import { camelCase } from 'scule'
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'

const props = withDefaults(defineProps<{
  name: string
  /**
   * Whether to format the code with Prettier
   * @defaultValue false
   */
  prettier?: boolean
  /**
   * Custom height for the iframe
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
}>(), {
  source: true
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
</script>

<template>
  <div class="size-full" :style="{ height: props.height }">
    <SplitterGroup
      :id="`splitter-${camelName}`"
      direction="horizontal"
      class="size-full"
    >
      <SplitterPanel
        :id="`splitter-${camelName}-panel-1`"
        :default-size="70"
        :min-size="30"
        class="border border-muted rounded-lg overflow-hidden"
      >
        <iframe
          :src="`/examples/${name}`"
          class="size-full"
        />
      </SplitterPanel>
      <SplitterResizeHandle
        :id="`splitter-${camelName}-handle`"
        class="group w-4 flex items-center justify-center"
      >
        <div class="w-1 h-8 group-hover:h-16 bg-muted transition-all rounded-full" />
      </SplitterResizeHandle>

      <SplitterPanel
        :id="`splitter-${camelName}-panel-2`"
        :default-size="0"
        :min-size="0"
      />
    </SplitterGroup>

    <template v-if="source">
      <MDCRenderer v-if="ast" :body="ast.body" :data="ast.data" />
    </template>
  </div>
</template>
