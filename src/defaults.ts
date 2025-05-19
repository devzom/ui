import icons from './theme/icons'

import { pick } from './runtime/utils'

export const getDefaultUiConfig = (colors?: string[]) => ({
  colors: pick({
    primary: 'green',
    secondary: 'blue',
    success: 'green',
    info: 'blue',
    warning: 'yellow',
    error: 'red',
    neutral: 'slate'
  }, [...(colors || []), 'neutral' as any]),
  icons,
  csp: {
    nonce: ''
  }
})

export const defaultOptions = {
  prefix: 'U',
  fonts: true,
  colorMode: true,
  theme: {
    colors: undefined,
    transitions: true
  },
  csp: {
    nonce: ''
  }
}

export const resolveColors = (colors?: string[]) => {
  return colors?.length
    ? [...new Set(['primary', ...colors])]
    : ['primary', 'secondary', 'success', 'info', 'warning', 'error']
}
