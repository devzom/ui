export function useHeaderLinks() {
  const route = useRoute()

  return computed(() => [{
    label: 'Docs',
    icon: 'i-lucide-square-play',
    to: '/docs',
    active: route.path.startsWith('/docs/')
  }, {
    label: 'Blocks',
    icon: 'i-lucide-blocks',
    to: '/blocks',
    active: route.path.startsWith('/blocks/')
  }, {
    label: 'Figma',
    icon: 'i-simple-icons-figma',
    to: '/figma'
  }, {
    icon: 'i-lucide-panels-top-left',
    label: 'Templates',
    to: '/templates'
  }, {
    label: 'Community',
    icon: 'i-lucide-users',
    children: [{
      label: 'Showcase',
      description: 'Discover amazing projects built with Nuxt UI.',
      icon: 'i-lucide-presentation',
      to: '/showcase'
    }, {
      label: 'Devtools Integration',
      description: 'Integrate Nuxt UI with Nuxt Devtools with Compodium.',
      icon: 'i-lucide-code',
      to: 'https://github.com/romhml/compodium',
      target: '_blank'
    }, {
      label: 'Raycast Extension',
      description: 'Access Nuxt UI components without leaving your editor.',
      icon: 'i-simple-icons-raycast',
      to: 'https://www.raycast.com/HugoRCD/nuxt',
      target: '_blank'
    }, {
      label: 'Figma to Code',
      description: 'Convert Figma designs to Nuxt UI code.',
      icon: 'i-simple-icons-figma',
      to: 'https://github.com/Justineo/tempad-dev-plugin-nuxt-ui',
      target: '_blank'
    }]
  }, {
    label: 'Releases',
    icon: 'i-lucide-rocket',
    to: 'https://github.com/nuxt/ui/releases',
    target: '_blank'
  }])
}
