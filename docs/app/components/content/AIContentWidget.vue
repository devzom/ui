<script lang="ts">
export interface AIConfig {
  /** Placeholder text for the AI prompt input */
  placeholder?: string
  /** Custom label for the button */
  buttonLabel?: string
}

export interface AIContentWidgetProps {
  /** The component name (e.g., 'accordion', 'page-card') */
  componentName: string
  /** AI configuration - true to enable with defaults, object to customize */
  ai?: boolean | AIConfig
}

export interface AIContentWidgetEmits {
  generated: [content: AIContentWidgetEmits]
}
</script>

<script setup lang="ts">
import { motion, AnimatePresence } from 'motion-v'
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

const props = withDefaults(defineProps<AIContentWidgetProps>(), {
  ai: false
})

const emit = defineEmits<{
  generated: [content: AIContentWidgetEmits]
}>()

const SURFACE_WIDTH = 320
const SURFACE_HEIGHT = 160

const schema = z.object({
  prompt: z.string()
})

type Schema = z.output<typeof schema>

const open = ref(false)
const state = reactive({
  prompt: ''
})

const isGenerating = ref(false)
const surfaceRef = ref<HTMLElement>()
const textareaRef = ref<any>()

function toggleSurface() {
  if (open.value) {
    closeSurface()
  } else {
    openSurface()
  }
}

function openSurface() {
  open.value = true
  nextTick(() => {
    if (textareaRef.value?.$el) {
      textareaRef.value.$el.focus()
    }
  })
}

function closeSurface() {
  open.value = false
  state.prompt = ''
  if (textareaRef.value?.$el) {
    textareaRef.value.$el.blur()
  }
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  closeSurface()
  try {
    isGenerating.value = true
    const result = await $fetch('/api/content-generation', {
      method: 'POST',
      body: {
        prompt: event.data.prompt,
        componentName: props.componentName
      }
    })

    if (result) {
      emit('generated', result)
    }
  } catch (error) {
    console.error('AI generation error:', error)
  } finally {
    isGenerating.value = false
  }
}

onClickOutside(surfaceRef, closeSurface)
</script>

<template>
  <div v-if="ai" class="absolute top-0 right-0 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <UButton
      color="neutral"
      variant="link"
      size="xs"
      :disabled="isGenerating"
      :loading="isGenerating"
      class="bg-default rounded-br-none rounded-tl-none group/shimmer"
      @click="toggleSurface"
    >
      <template #leading>
        <div v-if="!isGenerating" class="text-muted duration-300 group-hover/shimmer:text-highlighted size-3">
          <UIcon name="i-lucide-sparkles" />
        </div>
        <UIcon v-else name="i-lucide-loader-circle" class="animate-spin" />
      </template>

      <span class="relative z-10 transition-colors duration-300 text-muted">
        {{ typeof ai === 'object' && ai.buttonLabel ? ai.buttonLabel : 'Generate with AI' }}
        <span
          class="absolute inset-0 bg-clip-text bg-inverted text-transparent opacity-0 group-hover/shimmer:opacity-100 group-hover/shimmer:animate-shimmer-once transition-opacity duration-200"
          style="background-image:linear-gradient(90deg, transparent calc(50% - 40px), #12A594, #E93D82, #FFB224, transparent calc(50% + 40px));background-size:200% 100%;background-position:-50% center"
        >
          {{ typeof ai === 'object' && ai.buttonLabel ? ai.buttonLabel : 'Generate with AI' }}
        </span>
      </span>
    </UButton>

    <AnimatePresence>
      <motion.div
        v-if="open"
        key="surface"
        ref="surfaceRef"
        class="absolute top-full right-0.5 bg-default border border-default shadow-2xl overflow-hidden z-50"
        :initial="{
          opacity: 0,
          scale: 0.8,
          width: 100,
          height: 44,
          borderRadius: '10px 0px 10px 10px'
        }"
        :animate="{
          opacity: 1,
          scale: 1,
          width: SURFACE_WIDTH,
          height: SURFACE_HEIGHT,
          borderRadius: '10px 0px 10px 10px'
        }"
        :exit="{
          opacity: 0,
          scale: 0.8,
          width: 100,
          height: 44,
          borderRadius: '10px 0px 10px 10px'
        }"
        :transition="{
          type: 'spring' as const,
          stiffness: 400,
          damping: 30,
          mass: 0.8
        }"
      >
        <UForm
          :state="state"
          :schema="schema"
          :validate-on="[]"
          class="p-4 h-full flex flex-col gap-3"
          @submit="onSubmit"
        >
          <motion.div
            class="flex flex-col gap-3 h-full"
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
            :exit="{ opacity: 0 }"
            :transition="{ delay: 0.1 }"
          >
            <UFormField name="prompt">
              <UTextarea
                ref="textareaRef"
                v-model="state.prompt"
                required
                autofocus
                :placeholder="typeof ai === 'object' && ai.placeholder ? ai.placeholder : 'Describe the content you want to generate...'"
                :rows="4"
                class="resize-none size-full"
                @keydown.escape="closeSurface"
              />
            </UFormField>

            <div class="flex gap-2 justify-end">
              <UButton
                variant="outline"
                label="Cancel"
                size="xs"
                @click="closeSurface"
              />
              <UButton
                label="Submit"
                size="xs"
                type="submit"
              />
            </div>
          </motion.div>
        </UForm>
      </motion.div>
    </AnimatePresence>
  </div>
</template>

<style>
@keyframes shimmer {
  0% {
    background-position: 100%
  }

  to {
    background-position: -50%
  }
}

.group\/shimmer:hover .group-hover\/shimmer\:animate-shimmer-once {
  animation: shimmer 0.8s ease-in-out forwards
}
</style>
