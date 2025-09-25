<script setup lang="ts">
import { upperName } from '~/utils'

const route = useRoute()
const appConfig = useAppConfig()

useHead({
  title: 'Nuxt UI - Playground'
})

const components = [
  'accordion',
  'alert',
  'avatar',
  'badge',
  'breadcrumb',
  'button',
  'card',
  'calendar',
  'carousel',
  'checkbox',
  'checkbox-group',
  'chip',
  'collapsible',
  'color-picker',
  'context-menu',
  'command-palette',
  'drawer',
  'dropdown-menu',
  'field-group',
  'file-upload',
  'form',
  'form-field',
  'input',
  'input-menu',
  'input-number',
  'input-tags',
  'kbd',
  'link',
  'modal',
  'navigation-menu',
  'pagination',
  'pin-input',
  'popover',
  'progress',
  'radio-group',
  'select',
  'select-menu',
  'separator',
  'shortcuts',
  'skeleton',
  'slideover',
  'slider',
  'stepper',
  'switch',
  'tabs',
  'table',
  'textarea',
  'timeline',
  'toast',
  'tooltip',
  'tree'
].map(component => ({ label: upperName(component), to: `/components/${component}` }))

const items = [{ label: 'Home', to: '/' }, { label: 'Chat', to: '/chat' }]
const groups = [{ id: 'links', items }, { id: 'components', label: 'Components', items: components }]

provide('components', components)
</script>

<template>
  <UApp :toaster="appConfig.toaster">
    <UDashboardGroup unit="rem">
      <UDashboardSidebar class="bg-elevated/25">
        <template #header>
          <NuxtLink to="/" class="text-highlighted">
            <Logo class="h-5 w-auto" />
          </NuxtLink>

          <div class="flex items-center ms-auto">
            <ThemeDropdown />

            <UColorModeButton />
          </div>
        </template>

        <UDashboardSearchButton />

        <UNavigationMenu :items="items" orientation="vertical" />

        <USeparator type="dashed" />

        <UNavigationMenu :items="components" orientation="vertical" />
      </UDashboardSidebar>

      <UDashboardPanel :ui="{ body: ['justify-center items-center', route.path.startsWith('/components') && 'mt-16'] }">
        <template #body>
          <NuxtPage />
        </template>
      </UDashboardPanel>

      <UDashboardSearch :groups="groups" />
    </UDashboardGroup>
  </UApp>
</template>
