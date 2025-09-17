export default {
  slots: {
    base: 'rounded-md',
    overlay: 'fixed inset-0 bg-default/75 backdrop-blur-sm will-change-opacity',
    content: 'fixed inset-0 flex items-center justify-center cursor-zoom-out focus:outline-none',
    zoomedImage: 'w-auto sm:h-full max-w-[90vw] max-h-[90vh] rounded-md'
  },
  variants: {
    zoom: {
      true: 'will-change-transform'
    },
    open: {
      true: ''
    }
  },
  compoundVariants: [{
    zoom: true,
    open: false,
    class: 'cursor-zoom-in'
  }]
}
