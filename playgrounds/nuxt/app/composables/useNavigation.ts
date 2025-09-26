import { upperName } from '../utils'

function isTruthy<T>(value?: T | undefined | null | false): value is T {
  return !!value
}

export const useNavigation = (vue?: boolean) => {
  const appConfig = useAppConfig()

  const components = [
    'accordion',
    'alert',
    'auth-form',
    'avatar',
    'badge',
    'banner',
    'blog-post',
    'breadcrumb',
    'button',
    'calendar',
    'card',
    'carousel',
    'changelog-version',
    'checkbox-group',
    'checkbox',
    'chip',
    'collapsible',
    'color-mode',
    'color-picker',
    'command-palette',
    !vue && 'content-navigation',
    !vue && 'content-surround',
    !vue && 'content-toc',
    'context-menu',
    'drawer',
    'dropdown-menu',
    'error',
    'field-group',
    'file-upload',
    'footer',
    'form-field',
    'form',
    'header',
    'input-menu',
    'input-number',
    'input-tags',
    'input',
    'kbd',
    'link',
    'locale',
    'marquee',
    'modal',
    'navigation-menu',
    'page-anchors',
    'page-card',
    'page-cta',
    'page-feature',
    'page-header',
    'page-hero',
    'page-links',
    'page-logos',
    'page-section',
    'pagination',
    'pin-input',
    'popover',
    'pricing-plan',
    'pricing-table',
    'progress',
    'radio-group',
    'select-menu',
    'select',
    'separator',
    'shortcuts',
    'skeleton',
    'slideover',
    'slider',
    'stepper',
    'switch',
    'table',
    'tabs',
    'textarea',
    'timeline',
    'toast',
    'tooltip',
    'tree',
    'user'
  ].filter(isTruthy).map(component => ({ label: upperName(component), icon: 'i-lucide-box', to: `/components/${component}` }))

  const items = [{ label: 'Home', icon: 'i-lucide-home', to: '/' }, !vue && { label: 'Chat', icon: 'i-lucide-message-circle', to: '/chat' }].filter(isTruthy)
  const groups = computed(() => [
    { id: 'links', items },
    { id: 'components', label: 'Components', items: components },
    {
      id: 'dir',
      label: 'Direction',
      items: [{
        label: 'LTR',
        icon: 'i-lucide-arrow-right',
        active: appConfig.dir === 'ltr',
        onSelect: () => appConfig.dir = 'ltr'
      }, {
        label: 'RTL',
        icon: 'i-lucide-arrow-left',
        active: appConfig.dir === 'rtl',
        onSelect: () => appConfig.dir = 'rtl'
      }]
    }
  ])

  return {
    components,
    groups,
    items
  }
}
