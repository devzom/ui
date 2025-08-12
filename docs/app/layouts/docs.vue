<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageChildren } from '@nuxt/content/utils'

const route = useRoute()

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const categories = [{
  id: 'layout',
  title: 'Layout'
}, {
  id: 'element',
  title: 'Element'
}, {
  id: 'form',
  title: 'Form'
}, {
  id: 'data',
  title: 'Data'
}, {
  id: 'navigation',
  title: 'Navigation'
}, {
  id: 'overlay',
  title: 'Overlay'
}, {
  id: 'page',
  title: 'Page'
}, {
  id: 'content',
  title: 'Content'
}, {
  id: 'dashboard',
  title: 'Dashboard'
}, {
  id: 'chat',
  title: 'AI Chat'
}, {
  id: 'color-mode',
  title: 'Color Mode'
}, {
  id: 'i18n',
  title: 'i18n'
}]

function groupChildrenByCategory(items: ContentNavigationItem[]): ContentNavigationItem[] {
  const childrenGroupedByCategory = items.reduce((acc, child) => {
    if (child.category) {
      acc[child.category as string] = [...(acc[child.category as string] || []), child]
    }
    return acc
  }, {} as Record<string, ContentNavigationItem[]>)

  return categories.map(category => ({
    ...category,
    path: `/docs/components`,
    children: childrenGroupedByCategory[category.id]
  }))
}

const children = computed(() => {
  const slug = route.params.slug?.[0]
  const children = findPageChildren(navigation?.value, `/docs/${slug}`, { indexAsChild: true })?.map(child => ({ ...child, icon: undefined }))

  return slug === 'components' ? groupChildrenByCategory(children) : [{ title: 'Overview', path: `/docs/${slug}`, children }]
})
</script>

<template>
  <UMain>
    <UContainer>
      <UPage>
        <template #left>
          <UPageAside>
            <UContentNavigation :navigation="children" variant="link" highlight :ui="{ linkTrailingBadge: 'font-semibold uppercase' }" />
          </UPageAside>
        </template>

        <slot />
      </UPage>
    </UContainer>
  </UMain>
</template>
