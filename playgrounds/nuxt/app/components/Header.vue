<template>
  <UHeader>
    <template #title>
      <Logo class="w-auto h-6 shrink-0" />
    </template>

    <template #right>
      <UColorModeButton />

      <UButton
        to="https://github.com/nuxt/ui"
        target="_blank"
        icon="i-simple-icons-github"
        aria-label="GitHub"
        color="neutral"
        variant="ghost"
      />
    </template>
  </UHeader>
</template>
