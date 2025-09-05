<script setup lang="ts">
import { motion, AnimatePresence } from 'motion-v'
import { hasComponentSchema } from '~~/shared/utils'

interface Props {
  /** The component name (e.g., 'accordion', 'page-card') */
  componentName: string
}

interface AIGeneratedContent {
  [key: string]: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  generated: [content: AIGeneratedContent]
}>()

const SURFACE_WIDTH = 320
const SURFACE_HEIGHT = 160

const isAIPromptOpen = ref(false)
const aiPrompt = ref('')
const isGenerating = ref(false)
const aiError = ref<string | null>(null)

const surfaceRef = ref<HTMLElement>()
const textareaRef = ref<any>()

const supportsAI = computed(() => hasComponentSchema(props.componentName))

function toggleSurface() {
  if (isGenerating.value) return

  if (isAIPromptOpen.value) {
    closeSurface()
  } else {
    openSurface()
  }
}

function openSurface() {
  isAIPromptOpen.value = true
  nextTick(() => {
    if (textareaRef.value?.$el) {
      textareaRef.value.$el.focus()
    }
  })
}

function closeSurface() {
  isAIPromptOpen.value = false
  aiPrompt.value = ''
  aiError.value = null
  if (textareaRef.value?.$el) {
    textareaRef.value.$el.blur()
  }
}

async function generateWithAI() {
  if (!aiPrompt.value.trim() || !supportsAI.value || isGenerating.value) return

  const promptToSend = aiPrompt.value.trim()

  closeSurface()
  isGenerating.value = true
  aiError.value = null

  try {
    const result = await $fetch('/api/content-generation', {
      method: 'POST',
      body: {
        prompt: promptToSend,
        componentName: props.componentName.toLowerCase()
      }
    })

    if (result) {
      emit('generated', result)
    }
  } catch (error) {
    console.error('AI generation error:', error)
    const errorMessage = 'An error occurred while generating content. Please try again.'
    openSurface()
    aiError.value = errorMessage
  } finally {
    isGenerating.value = false
  }
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeSurface()
  }
  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault()
    generateWithAI()
  }
}

onClickOutside(surfaceRef, closeSurface)
</script>

<template>
  <div class="absolute top-0 right-0">
    <UButton
      v-if="supportsAI"
      color="neutral"
      variant="link"
      size="xs"
      :disabled="isGenerating"
      :loading="isGenerating"
      class="rounded-br-none rounded-tl-none group/shimmer"
      @click="toggleSurface"
    >
      <template #leading>
        <div v-if="!isGenerating" class="text-muted duration-300 group-hover/shimmer:text-highlighted size-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="relative lucide lucide-sparkles"
            aria-hidden="true"
          >
            <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
            <path d="M20 2v4" />
            <path d="M22 4h-4" />
            <circle cx="4" cy="20" r="2" />
          </svg>
        </div>
        <UIcon v-else name="i-lucide-loader-circle" class="animate-spin" />
      </template>

      <span class="relative z-10 transition-colors duration-300 text-muted">
        Generate with AI
        <span
          class="absolute inset-0 bg-clip-text bg-inverted text-transparent opacity-0 group-hover/shimmer:opacity-100 group-hover/shimmer:animate-shimmer-once transition-opacity duration-200"
          style="background-image:linear-gradient(90deg, transparent calc(50% - 40px), #12A594, #E93D82, #FFB224, transparent calc(50% + 40px));background-size:200% 100%;background-position:-50% center"
        >
          Generate with AI
        </span>
      </span>
    </UButton>

    <AnimatePresence>
      <motion.div
        v-if="isAIPromptOpen"
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
        <form
          class="p-4 h-full flex flex-col gap-3"
          @submit.prevent="generateWithAI"
        >
          <motion.div
            class="flex flex-col gap-3 h-full"
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
            :exit="{ opacity: 0 }"
            :transition="{ delay: 0.1 }"
          >
            <div>
              <UTextarea
                ref="textareaRef"
                v-model="aiPrompt"
                autofocus
                placeholder="Describe the content you want to generate..."
                :rows="4"
                class="resize-none size-full"
                @keydown="handleKeyDown"
              />
            </div>

            <UAlert
              v-if="aiError"
              color="error"
              variant="soft"
              :description="aiError"
            />

            <div class="flex gap-2 justify-end">
              <UButton
                variant="outline"
                label="Cancel"
                size="xs"
                @click="closeSurface"
              />
              <UButton
                :disabled="!aiPrompt.trim() || isGenerating"
                :loading="isGenerating"
                label="Submit"
                size="xs"
                type="submit"
              />
            </div>
          </motion.div>
        </form>
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
