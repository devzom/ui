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

const title = page.value?.seo?.title ? page.value.seo.title : page.value?.navigation?.title ? page.value.navigation.title : page.value?.title
const description = page.value?.seo?.description ? page.value.seo.description : page.value?.description

useSeoMeta({
  titleTemplate: '%s - Nuxt UI Blocks',
  title,
  ogTitle: `${title} - Nuxt UI Blocks`,
  description,
  ogDescription: description
})
</script>

<template>
  <UPage v-if="page">
    <UPageBody>
      <ContentRenderer v-if="page.body" :value="page" />
    </UPageBody>
  </UPage>
</template>
