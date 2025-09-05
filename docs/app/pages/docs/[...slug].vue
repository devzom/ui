<script setup lang="ts">
import { kebabCase } from 'scule'
import type { ContentNavigationItem } from '@nuxt/content'
import { mapContentNavigation } from '@nuxt/ui/utils/content'
import { findPageBreadcrumb } from '@nuxt/content/utils'
import { motion } from 'motion-v'
import { useWindowScroll } from '@vueuse/core'

const route = useRoute()
const { framework } = useSharedData()

definePageMeta({
  layout: 'docs'
})

const { data: page } = await useAsyncData(kebabCase(route.path), () => queryCollection('docs').path(route.path).first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

// Update the framework if the page has different one
watch(page, () => {
  if (page.value?.framework && page.value?.framework !== framework.value) {
    framework.value = page.value?.framework as string
  }
}, { immediate: true })

const { data: surround } = await useAsyncData(`${kebabCase(route.path)}-surround`, () => {
  return queryCollectionItemSurroundings('docs', route.path, {
    fields: ['description']
  }).orWhere(group => group.where('framework', '=', framework.value).where('framework', 'IS NULL'))
}, {
  watch: [framework]
})

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const breadcrumb = computed(() => mapContentNavigation(findPageBreadcrumb(navigation?.value, page.value?.path, { indexAsChild: true })).map(({ icon, ...link }) => link))

if (!import.meta.prerender) {
  // Redirect to the correct framework version if the page is not the current framework
  watch(framework, () => {
    if (page.value?.framework && page.value?.framework !== framework.value) {
      if (route.path.endsWith(`/${page.value?.framework}`)) {
        navigateTo(`${route.path.split('/').slice(0, -1).join('/')}/${framework.value}`)
      } else {
        navigateTo(`/docs/getting-started`)
      }
    }
  })
}

const title = page.value?.seo?.title ? page.value.seo.title : page.value?.navigation?.title ? page.value.navigation.title : page.value?.title
const prefix = page.value?.path.includes('components/') || page.value?.path.includes('composables/') ? 'Vue ' : ''
const suffix = page.value?.path.includes('components/') ? 'Component ' : page.value?.path.includes('composables/') ? 'Composable ' : ''
const description = page.value?.seo?.description ? page.value.seo.description : page.value?.description

useSeoMeta({
  titleTemplate: `${prefix}%s ${suffix}- Nuxt UI ${page.value?.framework === 'vue' ? ' for Vue' : ''}`,
  title,
  ogTitle: `${prefix}${title} ${suffix}- Nuxt UI ${page.value?.framework === 'vue' ? ' for Vue' : ''}`,
  description,
  ogDescription: description
})

if (route.path.startsWith('/docs/components/')) {
  defineOgImageComponent('OgImageComponent', {
    title: page.value.title,
    description: page.value.description,
    component: (route.params.slug as string[]).pop() as string
  })
} else {
  defineOgImageComponent('Docs', {
    title: page.value.title,
    description: page.value.description,
    headline: breadcrumb.value?.[breadcrumb.value.length - 1]?.label || 'Nuxt UI',
    framework: page.value?.framework
  })
}

const communityLinks = computed(() => [{
  icon: 'i-lucide-file-pen',
  label: 'Edit this page',
  to: `https://github.com/nuxt/ui/edit/v4/docs/content/${page?.value?.stem}.md`,
  target: '_blank'
}, {
  icon: 'i-lucide-star',
  label: 'Star on GitHub',
  to: `https://github.com/nuxt/ui`,
  target: '_blank'
}])

const { y: scrollY } = useWindowScroll({ behavior: 'smooth' })

function scrollToTop() {
  scrollY.value = 0
}

const showScrollToTop = computed(() => {
  if (import.meta.server) return false

  const documentHeight = document.documentElement.scrollHeight - window.innerHeight
  const scrollPercentage = (scrollY.value / documentHeight) * 100

  return scrollPercentage > 15
})
</script>

<template>
  <UPage v-if="page">
    <UPageHeader :title="page.title">
      <template #headline>
        <UBreadcrumb :items="breadcrumb" />
      </template>

      <template #description>
        <MDC v-if="page.description" :value="page.description" unwrap="p" :cache-key="`${kebabCase(route.path)}-description`" />
      </template>

      <template #links>
        <UButton
          v-for="link in page.links"
          :key="link.label"
          color="neutral"
          variant="outline"
          :target="link.to.startsWith('http') ? '_blank' : undefined"
          v-bind="link"
        >
          <template v-if="link.avatar" #leading>
            <UAvatar v-bind="link.avatar" size="2xs" :alt="`${link.label} avatar`" />
          </template>
        </UButton>
        <PageHeaderLinks />
      </template>
    </UPageHeader>

    <UPageBody>
      <ContentRenderer v-if="page.body" :value="page" />

      <USeparator v-if="surround?.filter(Boolean).length" />

      <UContentSurround :surround="(surround as any)" />
    </UPageBody>

    <template v-if="page?.body?.toc?.links?.length" #right>
      <UContentToc :links="page.body.toc.links" class="z-[2]">
        <template #bottom>
          <USeparator v-if="page.body?.toc?.links?.length" type="dashed" />

          <UPageLinks title="Community" :links="communityLinks" />

          <USeparator type="dashed" />

          <div>
            <motion.div
              class="space-y-4"
              :animate="{
                height: showScrollToTop ? 'auto' : 0,
                marginBottom: showScrollToTop ? '16px' : '0px',
                opacity: showScrollToTop ? 1 : 0,
                y: showScrollToTop ? 0 : -10
              }"
              :initial="{
                height: 0,
                marginBottom: '0px',
                opacity: 0,
                y: -10
              }"
              :transition="{ duration: 0.25, ease: 'easeInOut' }"
              :style="{
                overflow: 'hidden',
                willChange: 'transform'
              }"
            >
              <UButton
                icon="i-lucide-circle-arrow-up"
                color="neutral"
                variant="outline"
                size="sm"
                class="w-full"
                label="Back to top"
                @click="scrollToTop"
              />

              <USeparator type="dashed" />
            </motion.div>

            <AdsCarbon />
          </div>
        </template>
      </UContentToc>
    </template>
  </UPage>
</template>
