<script setup lang="ts">
// import { createReusableTemplate, refDebounced } from '@vueuse/core'
import { createReusableTemplate } from '@vueuse/core'
import type { User } from '~/types'

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()
const toast = useToast()

const open = ref(false)
const searchTerm = ref('')
// const searchTermDebounced = refDebounced(searchTerm, 200)
const selected = ref([])
const commandPalette = useTemplateRef('commandPalette')

const { data: _users, status } = await useFetch('https://jsonplaceholder.typicode.com/users', {
  // params: { q: searchTermDebounced },
  transform: (data: User[]) => {
    return data?.map(user => ({ id: user.id, label: user.name, suffix: user.email, avatar: { src: `https://i.pravatar.cc/120?img=${user.id}` } })) || []
  },
  lazy: true
})

const loading = ref(false)

const groups = computed(() => [{
  id: 'actions',
  items: [{
    label: 'Add new file',
    suffix: 'Create a new file in the current directory or workspace.',
    icon: 'i-lucide-file-plus',
    loading: loading.value,
    onSelect(e: Event) {
      e.preventDefault()

      toast.add({ title: 'New file added!' })

      loading.value = true

      setTimeout(() => {
        loading.value = false
      }, 2000)
    },
    kbds: ['meta', 'N']
  }, {
    label: 'Add new folder',
    suffix: 'Create a new folder in the current directory or workspace.',
    icon: 'i-lucide-folder-plus',
    onSelect(e: Event) {
      e.preventDefault()

      toast.add({ title: 'New folder added!' })
    },
    kbds: ['meta', 'F']
  }, {
    label: 'Add hashtag',
    suffix: 'Add a hashtag to the current item.',
    icon: 'i-lucide-hash',
    onSelect(e: Event) {
      e.preventDefault()

      toast.add({ title: 'Hashtag added!' })
    },
    kbds: ['meta', 'H']
  }, {
    label: 'Add label',
    suffix: 'Add a label to the current item.',
    icon: 'i-lucide-tag',
    onSelect(e: Event) {
      e.preventDefault()

      toast.add({ title: 'Label added!' })
    },
    kbds: ['meta', 'L']
  }, {
    label: 'Set Wallpaper',
    suffix: 'Choose from beautiful wallpaper collection.',
    icon: 'i-lucide-image',
    view: 'wallpaper',
    placeholder: 'Search wallpapers...'
  }, {
    label: 'More actions',
    placeholder: 'Search actions...',
    children: [{
      label: 'Create new file',
      suffix: 'Create a new file in the current directory or workspace.',
      icon: 'i-lucide-file-plus',
      onSelect(e: Event) {
        e.preventDefault()

        toast.add({ title: 'New file added!' })
      }
    }, {
      label: 'Create new folder',
      suffix: 'Create a new folder in the current directory or workspace.',
      icon: 'i-lucide-folder-plus',
      onSelect(e: Event) {
        e.preventDefault()

        toast.add({ title: 'New folder added!' })
      }
    }, {
      label: 'Share',
      placeholder: 'Search share options...',
      icon: 'i-lucide-share',
      children: [{
        label: 'Share with everyone',
        suffix: 'Share with everyone in the current directory or workspace.',
        icon: 'i-lucide-share',
        onSelect(e: Event) {
          e.preventDefault()

          toast.add({ title: 'Shared with everyone!' })
        }
      }, {
        label: 'Share with team',
        suffix: 'Share with the team in the current directory or workspace.',
        icon: 'i-lucide-users',
        onSelect(e: Event) {
          e.preventDefault()

          toast.add({ title: 'Shared with team!' })
        }
      }]
    }]
  }]
}])

const labels = [{
  label: 'bug',
  chip: {
    color: 'error' as const
  }
}, {
  label: 'feature',
  chip: {
    color: 'success' as const
  }
}, {
  label: 'enhancement',
  chip: {
    color: 'info' as const
  }
}]
const label = ref()

const wallpapers = [
  {
    id: 1,
    name: 'red_distortion_1',
    gradient: 'from-red-500 via-orange-500 to-pink-500',
    category: 'Abstract',
    featured: true
  },
  {
    id: 2,
    name: 'blue_distortion_1',
    gradient: 'from-blue-600 via-purple-600 to-indigo-600',
    category: 'Abstract',
    featured: true
  },
  {
    id: 3,
    name: 'mono_dark_distortion_1',
    gradient: 'from-gray-900 via-gray-700 to-gray-800',
    category: 'Monochrome',
    featured: false
  },
  {
    id: 4,
    name: 'chromatic_dark_1',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    category: 'Chromatic',
    featured: true
  },
  {
    id: 5,
    name: 'red_distortion_2',
    gradient: 'from-rose-600 via-red-600 to-orange-600',
    category: 'Abstract',
    featured: false
  },
  {
    id: 6,
    name: 'purple_cosmic_1',
    gradient: 'from-violet-700 via-purple-700 to-fuchsia-700',
    category: 'Cosmic',
    featured: true
  },
  {
    id: 7,
    name: 'golden_sunset_1',
    gradient: 'from-yellow-500 via-orange-500 to-red-500',
    category: 'Nature',
    featured: false
  },
  {
    id: 8,
    name: 'ocean_deep_1',
    gradient: 'from-blue-800 via-blue-900 to-indigo-900',
    category: 'Nature',
    featured: true
  },
  {
    id: 9,
    name: 'mono_light_distortion_1',
    gradient: 'from-gray-200 via-gray-300 to-gray-400',
    category: 'Monochrome',
    featured: false
  },
  {
    id: 10,
    name: 'green_matrix_1',
    gradient: 'from-green-800 via-emerald-700 to-teal-700',
    category: 'Chromatic',
    featured: false
  },
  {
    id: 11,
    name: 'pink_dreams_1',
    gradient: 'from-pink-500 via-rose-500 to-purple-500',
    category: 'Abstract',
    featured: true
  },
  {
    id: 12,
    name: 'midnight_blue_1',
    gradient: 'from-slate-900 via-blue-900 to-indigo-900',
    category: 'Nature',
    featured: false
  }
]

const filteredWallpapers = computed(() => {
  let filtered = wallpapers

  // Filter by search term
  if (searchTerm.value.trim()) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(w =>
      w.name.toLowerCase().includes(search)
      || w.category.toLowerCase().includes(search)
    )
  }

  return filtered
})

function setWallpaper(wallpaper: any) {
  toast.add({
    title: `Wallpaper set to ${wallpaper.name}!`,
    description: 'Your desktop wallpaper has been updated.',
    icon: 'i-lucide-image'
  })
}

// function onSelect(item: typeof groups.value[number]['items'][number]) {
function onSelect(item: any) {
  console.log('Selected', item)
}

defineShortcuts({
  meta_k: () => open.value = !open.value,
  meta_shift_a: {
    usingInput: true,
    handler: () => {
      commandPalette.value?.openView('askAI')
    }
  },
  ...extractShortcuts(groups.value)
})
</script>

<template>
  <DefineTemplate>
    <UCommandPalette
      ref="commandPalette"
      v-model="selected"
      v-model:search-term="searchTerm"
      :loading="status === 'pending'"
      :groups="groups"
      :fuse="{
        fuseOptions: {
          includeMatches: true
        }
      }"
      multiple
      class="sm:max-h-80"
      @update:model-value="onSelect"
    >
      <template #wallpaper>
        <div class="flex-1 overflow-y-auto p-6">
          <div class="grid grid-cols-4 gap-4">
            <div
              v-for="wallpaper in filteredWallpapers"
              :key="wallpaper.id"
              class="group relative cursor-pointer"
              @click="setWallpaper(wallpaper)"
            >
              <div
                class="aspect-video rounded-lg bg-gradient-to-br shadow-lg ring-1 ring-black/5"
                :class="wallpaper.gradient"
              />
              <div class="mt-2 px-1">
                <div class="flex items-center gap-2">
                  <h3 class="text-sm font-medium text-highlighted truncate">
                    {{ wallpaper.name }}
                  </h3>
                  <UChip
                    v-if="wallpaper.featured"
                    label="★"
                    size="xs"
                    color="primary"
                    class="shrink-0"
                  />
                </div>
                <p class="text-xs text-dimmed">
                  {{ wallpaper.category }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #askAI>
        <div class="flex flex-col items-center justify-center gap-4 p-6">
          <UIcon name="i-lucide-sparkles" class="size-8 text-primary" />
          <span class="text-lg font-semibold text-highlighted">
            Ask me anything...
          </span>
        </div>
      </template>
    </UCommandPalette>
  </DefineTemplate>

  <div class="flex-1 flex flex-col gap-12 w-full max-w-lg">
    <div class="flex items-center justify-between gap-2 mt-[58px]">
      <UModal v-model:open="open">
        <UButton label="Open modal" color="neutral" variant="outline" />

        <template #content>
          <ReuseTemplate :close="true" @update:open="open = $event" />
        </template>
      </UModal>

      <UDrawer should-scale-background>
        <UButton label="Open drawer" color="neutral" variant="outline" />

        <template #content>
          <ReuseTemplate class="border-t border-default mt-4" />
        </template>
      </UDrawer>

      <UPopover :content="{ side: 'right', align: 'start' }">
        <UButton label="Select label (popover)" color="neutral" variant="outline" />

        <template #content>
          <UCommandPalette v-model="label" placeholder="Search labels..." :groups="[{ id: 'labels', items: labels }]" :ui="{ input: '[&>input]:h-8 [&>input]:text-sm' }" />
        </template>
      </UPopover>
    </div>

    <UCard :ui="{ body: '!p-0' }">
      <ReuseTemplate />
    </UCard>
  </div>
</template>
