<script setup lang="ts">
const logoElement = ref()
const { copy } = useClipboard()
const toast = useToast()

const copyLogo = () => {
  if (logoElement.value) {
    copy(logoElement.value.$el.outerHTML)
    toast.add({
      title: 'Logo copied as SVG',
      description: 'You can now paste it into your project',
      icon: 'i-lucide-circle-check',
      color: 'success'
    })
  }
}

const logoContextMenuItems = [
  [{
    label: 'Copy logo as SVG',
    icon: 'i-simple-icons-nuxtdotjs',
    onSelect() {
      copyLogo()
    }
  }],
  [{
    label: 'Browse design kit',
    icon: 'i-lucide-shapes',
    to: 'https://nuxt.com/design-kit',
    target: '_blank'
  }]
]
</script>

<template>
  <UContextMenu :items="logoContextMenuItems">
    <NuxtLink
      to="/"
      class="flex items-end gap-2 font-bold text-xl text-highlighted min-w-0 focus-visible:outline-primary shrink-0"
      aria-label="Nuxt UI"
    >
      <Logo ref="logoElement" class="w-auto h-6 shrink-0" />
    </NuxtLink>
  </UContextMenu>
</template>
