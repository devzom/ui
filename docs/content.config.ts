import { defineCollection, property } from '@nuxt/content'
import { z } from 'zod'

const Image = z.object({
  src: z.string(),
  alt: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional()
})

const DualModeImage = z.object({
  light: z.string(),
  dark: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  alt: z.string().optional()
})

const Button = property(z.object({})).inherit('@nuxt/ui/components/Button.vue')

const BaseSection = z.object({
  title: z.string(),
  description: z.string()
})

const Feature = z.object({
  title: z.string(),
  description: z.string().optional(),
  icon: z.string(),
  to: z.string().optional()
})

const TitleIconFeature = z.object({
  title: z.string(),
  icon: z.string()
})

const PageSection = BaseSection.extend({
  links: z.array(Button).optional(),
  features: z.array(Feature).optional()
})

export const collections = {
  docs: defineCollection({
    type: 'page',
    source: [{
      include: 'docs/**/*'
    }],
    schema: z.object({
      category: z.enum(['layout', 'form', 'element', 'navigation', 'data', 'overlay', 'dashboard', 'page', 'ai', 'color-mode', 'i18n']).optional(),
      framework: z.enum(['nuxt', 'vue']).optional(),
      navigation: z.object({
        title: z.string().optional()
      }),
      links: z.array(z.object({
        label: z.string(),
        icon: z.string(),
        avatar: z.object({
          src: z.string(),
          alt: z.string()
        }).optional(),
        to: z.string(),
        target: z.string().optional()
      }))
    })
  }),
  index: defineCollection({
    type: 'page',
    source: 'index.yml',
    schema: z.object({
      title: z.string(),
      description: z.string(),
      hero: BaseSection.extend({
        links: z.array(Button),
        features: z.array(Feature)
      }),
      features: z.array(Feature),
      design_system: PageSection.extend({
        code: z.string()
      }),
      component_customization: PageSection.extend({
        code: z.string()
      }),
      templates: PageSection,
      community: PageSection
    })
  }),
  figma: defineCollection({
    type: 'page',
    source: 'figma.yml',
    schema: z.object({
      title: z.string(),
      description: z.string(),
      headline: z.string().optional(),
      hero: BaseSection.extend({
        image: z.string(),
        links: z.array(Button).optional()
      }),
      features1: z.object({
        features: z.array(Feature)
      }),
      cta1: BaseSection.optional(),
      section1: BaseSection.extend({
        reverse: z.boolean().optional(),
        features: z.array(TitleIconFeature).optional(),
        tabs: z.array(z.object({
          label: z.string(),
          src: z.string(),
          width: z.number().optional(),
          height: z.number().optional(),
          alt: z.string().optional()
        })).optional(),
        links: z.array(Button).optional()
      }),
      section2: BaseSection.extend({
        features: z.array(TitleIconFeature).optional(),
        image: Image,
        links: z.array(Button).optional()
      }),
      section3: BaseSection.extend({
        reverse: z.boolean().optional(),
        features: z.array(TitleIconFeature).optional(),
        image: Image,
        links: z.array(Button).optional()
      }),
      features2: z.object({
        features: z.array(Feature)
      }),
      section4: BaseSection.extend({
        links: z.array(Button).optional(),
        steps: z.array(z.object({
          title: z.string(),
          description: z.string(),
          to: z.string().optional(),
          target: z.string().optional(),
          image: Image
        }))
      }),
      customers: z.object({
        title: z.string(),
        items: z.array(z.object({
          src: z.string(),
          alt: z.string()
        }))
      }),
      faq: z.object({
        title: z.string(),
        description: z.string(),
        items: z.array(z.object({
          label: z.string(),
          content: z.string(),
          defaultOpen: z.boolean().optional()
        }))
      })
    })
  }),
  showcase: defineCollection({
    type: 'page',
    source: 'showcase.yml',
    schema: z.object({
      title: z.string(),
      description: z.string(),
      navigation: z.boolean().optional(),
      hero: BaseSection.extend({
        links: z.array(Button).optional()
      }),
      items: z.array(z.object({
        name: z.string(),
        url: z.string(),
        screenshotUrl: z.string().optional(),
        screenshotOptions: z.object({
          delay: z.number()
        }).optional()
      }))
    })
  }),
  templates: defineCollection({
    type: 'page',
    source: 'templates.yml',
    schema: z.object({
      title: z.string(),
      description: z.string(),
      navigation: z.boolean().optional(),
      links: z.array(Button),
      hero: BaseSection,
      templates: z.array(
        property(z.object({})).inherit('@nuxt/ui/components/PageSection.vue')
      )
    })
  })
}
