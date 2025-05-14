<script setup lang="ts">
import type { FormError } from '@nuxt/ui'

const state = reactive({
  email: undefined,
  password: undefined
})

const form = useTemplateRef('form')

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.email) errors.push({ name: 'email', message: 'Required' })
  if (!state.password) errors.push({ name: 'password', message: 'Required' })
  return errors
}
</script>

<template>
  <UForm ref="form" :validate="validate" :state="state" class="space-y-4">
    <UFormField
      label="Email"
      name="email"
      :ui="{
        error: 'data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_200ms_ease-in]'
      }"
    >
      <UInput v-model="state.email" />
    </UFormField>

    <UFormField
      label="Password"
      name="password"
      :ui="{
        error: 'data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_200ms_ease-in]'
      }"
    >
      <UInput v-model="state.password" type="password" />
    </UFormField>

    <div class="flex gap-2">
      <UButton label="Submit" type="submit" color="neutral" />

      <UButton label="Clear" color="neutral" variant="outline" @click="form?.clear()" />
    </div>
  </UForm>
</template>
