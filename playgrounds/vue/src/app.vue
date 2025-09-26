<script setup lang="ts">
import { reactive } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const appConfig = useAppConfig()
const { components, groups, items } = useNavigation()

appConfig.toaster = reactive({
  position: 'bottom-right' as const,
  expand: true,
  duration: 5000
})

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

        <USeparator type="dashed" />

        <UNavigationMenu :items="components" orientation="vertical" />
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
