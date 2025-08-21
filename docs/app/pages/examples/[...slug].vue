<script setup lang="ts">
const route = useRoute()
const colorMode = useColorMode()
const appConfig = useAppConfig()

const name = route.params.slug?.[0]

if (route.query.theme) {
  colorMode.preference = route.query.theme === 'light' ? 'light' : 'dark'
}
if (route.query.neutral) {
  appConfig.ui.colors.neutral = route.query.neutral as string
}
if (route.query.primary) {
  appConfig.ui.colors.primary = route.query.primary as string
}
</script>

<template>
  <div
    class="min-h-screen w-full flex overflow-auto"
    :class="route.query.centered === 'true' ? 'items-center justify-center' : 'items-start justify-center'"
  >
    <component
      :is="name"
      v-bind="route.query"
      :class="route.query.centered === 'true' ? '' : 'w-full'"
    />
  </div>
</template>
