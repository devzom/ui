<template>
  <div class="relative">
    <UMain>
      <div aria-hidden="true" class="hidden lg:block absolute z-[-1] border-x border-default inset-0 mx-4 sm:mx-6 lg:mx-8" />
      <UContainer>
        <UPage>
          <slot />
        </UPage>
      </UContainer>
    </UMain>
  </div>
</template>
