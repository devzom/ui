<script setup lang="ts">
import { kebabCase } from 'scule'

definePageMeta({
  layout: 'blocks'
})

const route = useRoute()

const { data: page } = await useAsyncData(kebabCase(route.path), () => queryCollection('blocks').path(route.path).first())

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found'
  })
}

useSeoMeta({
  title: page.value.title,
  ogTitle: `${page.value.title} - Nuxt UI`,
  description: page.value.description,
  ogDescription: page.value.description
})
</script>

<template>
  <UPage v-if="page">
    <UPageBody>
      <ContentRenderer v-if="page.body" :value="page" />
    </UPageBody>
  </UPage>
</template>
