<template>
  <USeparator icon="i-simple-icons-nuxtdotjs" />

  <UFooter>
    <template #left>
      <p class="text-sm text-muted">
        Copyright © {{ new Date().getFullYear() }}
      </p>
    </template>

    <template #right>
      <UButton
        to="https://github.com/nuxt/ui"
        target="_blank"
        icon="i-simple-icons-github"
        aria-label="GitHub"
        color="neutral"
        variant="ghost"
      />
    </template>
  </UFooter>
</template>
