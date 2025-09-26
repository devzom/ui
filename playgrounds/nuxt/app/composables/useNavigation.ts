import { upperName } from '../utils'

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
].map(component => ({ label: upperName(component), icon: 'i-lucide-box', to: `/components/${component}` }))

export const useNavigation = () => {
  const items = [{ label: 'Home', icon: 'i-lucide-home', to: '/' }, { label: 'Chat', icon: 'i-lucide-message-circle', to: '/chat' }]
  const groups = [{ id: 'links', items }, { id: 'components', label: 'Components', items: components }]

  return {
    components,
    groups,
    items
  }
}
