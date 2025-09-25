<script setup lang="ts">
import { upperName } from '../../nuxt/app/utils'
import { useRoute } from 'vue-router'
import { reactive } from 'vue'

const route = useRoute()
const appConfig = useAppConfig()

appConfig.toaster = reactive({
  position: 'bottom-right' as const,
  expand: true,
  duration: 5000
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

const items = computed(() => [{ label: 'Home', to: '/' }, { label: 'Components', to: '/components/accordion', active: route.path.startsWith('/components/') }])
const groups = computed(() => [{ id: 'links', items: items.value }, { id: 'components', label: 'Components', items: components }])

provide('components', components)
</script>

<template>
  <UApp :toaster="appConfig.toaster">
    <UDashboardGroup unit="rem" storage="local">
      <UDashboardSidebar class="bg-elevated/25">
        <template #header>
          <RouterLink to="/" class="text-highlighted">
            <Logo class="h-5 w-auto" />
          </RouterLink>

          <div class="flex items-center ms-auto">
            <ThemeDropdown />

            <UColorModeButton />
          </div>
        </template>

        <UDashboardSearchButton />

        <UNavigationMenu :items="items" orientation="vertical" />

        <template v-if="route.path.startsWith('/components/')">
          <USeparator type="dashed" />

          <UNavigationMenu :items="components" orientation="vertical" />
        </template>
      </UDashboardSidebar>

      <UDashboardPanel :ui="{ body: ['justify-center items-center', route.path.startsWith('/components') && 'mt-16'] }">
        <template #body>
          <Suspense>
            <RouterView />
          </Suspense>
        </template>
      </UDashboardPanel>

      <UDashboardSearch :groups="groups" />
    </UDashboardGroup>
  </UApp>
</template>
