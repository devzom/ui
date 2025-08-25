<template>
  <div class="relative">
    <UMain>
      <UPage>
        <UContainer class="relative">
          <div class="absolute inset-x-0 top-0 h-full border-x border-default mx-4 sm:mx-6 lg:mx-8" />
          <slot />
        </UContainer>
      </UPage>
    </UMain>
  </div>
</template>
