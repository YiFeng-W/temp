import { defineConfig, transformerDirectives, transformerVariantGroup } from 'unocss'
import { presetMini, transformerWh } from '@bryce-loskie/unocss-preset-mini'

const iconCollection: Record<string, string> = {

}

export default defineConfig({
  presets: [
    presetMini({
      iconCollection: {
        banna: iconCollection,
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
    transformerWh,
  ],
  theme: {
    colors: {
      primary: '#2BAE85',
    },
  },
})
