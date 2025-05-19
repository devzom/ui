import icons from './theme/icons'

import { pick } from './runtime/utils'

export const getDefaultUiConfig = (colors?: string[], csp?: { nonce?: string }) => ({
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
  csp: csp || {
    nonce: '',
    scriptNonce: ''
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
    nonce: '',
    scriptNonce: ''
  }
}

export const resolveColors = (colors?: string[]) => {
  return colors?.length
    ? [...new Set(['primary', ...colors])]
    : ['primary', 'secondary', 'success', 'info', 'warning', 'error']
}
