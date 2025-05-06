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

      <div aria-hidden="true" class="hidden lg:block absolute z-[-1] border-x border-default inset-0 mx-4 sm:mx-6 lg:mx-8" />

      <template #title>
        <MDC :value="page.title" unwrap="p" cache-key="pro-templates-hero-title" />
      </template>

      <template #description>
        <MDC :value="page.description" unwrap="p" cache-key="pro-templates-hero-description" />
      </template>
    </UPageHero>

    <UPageBody class="mt-0 lg:border-t border-default">
      <UContainer>
        <UBlogPosts orientation="vertical" class="!gap-0">
          <UBlogPost
            v-for="(article, index) in posts"
            :key="article.path"
            :to="article.path"
            :title="article.title"
            :description="article.description"
            :image="{
              src: article.image,
              width: (index === 0 ? 672 : 437),
              height: (index === 0 ? 378 : 246),
              alt: `${article.title} image`
            }"
            :authors="article.authors?.map(author => ({ ...author, avatar: { ...author.avatar, alt: `${author.name} avatar` } }))"
            :badge="{ label: article.category, color: 'primary', variant: 'subtle' }"
            orientation="horizontal"
            class="ring-0 border border-t-0 border-default rounded-none"
          />
        </UBlogPosts>
      </UContainer>
    </UPageBody>
  </div>
</template>
