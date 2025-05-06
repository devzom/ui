<script setup lang="ts">
// @ts-expect-error yaml is not typed
import page from '.blog.yml'

const { data: posts } = await useAsyncData('blogs', () =>
  queryCollection('blog').order('date', 'DESC').all()
)

useSeoMeta({
  titleTemplate: `%s`,
  title: page.title,
  description: page.description,
  ogTitle: `${page.title}`,
  ogDescription: page.description
})

/* defineOgImageComponent('Docs', {
  headline: 'Blog',
  title: page.title,
  description: page.description
}) */
</script>

<template>
  <div v-if="page" class="relative">
    <UPageHero :links="page.links" :ui="{ container: 'relative' }">
      <LazyStarsBg />

      <div aria-hidden="true" class="absolute z-[-1] border-x border-default inset-0 mx-4 sm:mx-6 lg:mx-8" />

      <template #title>
        <MDC :value="page.title" unwrap="p" cache-key="pro-templates-hero-title" />
      </template>

      <template #description>
        <MDC :value="page.description" unwrap="p" cache-key="pro-templates-hero-description" />
      </template>
    </UPageHero>

    <UPageBody class="!my-0 !py-0 border-y border-default">
      <UContainer>
        <UBlogPosts orientation="vertical" class="!gap-0">
          <div
            v-for="article in posts"
            :key="article.path"
            class="group"
          >
            <UBlogPost
              :to="article.path"
              :title="article.title"
              :description="article.description"
              :image="{
                src: article.image,
                width: 437,
                height: 246,
                alt: `${article.title} image`
              }"
              :authors="article.authors?.map(author => ({ ...author, avatar: { ...author.avatar, alt: `${author.name} avatar` } }))"
              :badge="{ label: article.category, color: 'primary', variant: 'subtle' }"
              orientation="horizontal"
              class="ring-0 border group-first:border-t-0 group-last:border-b-0 border-default rounded-none"
            />
            <div class="h-6 bg-muted/20 group-last:hidden border-x border-default" />
          </div>
        </UBlogPosts>
      </UContainer>
    </UPageBody>
    <UContainer class="relative h-24">
      <div aria-hidden="true" class="absolute z-[-1] border-x border-default inset-0 mx-4 sm:mx-6 lg:mx-8" />
    </UContainer>
  </div>
</template>
