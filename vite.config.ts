import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import Uni from '@dcloudio/vite-plugin-uni'
import postcssPxToViewport from 'postcss-px-to-viewport'
import type { Plugin } from 'vite'
import UniHelperComponents from '@uni-helper/vite-plugin-uni-components'
import AutoImport from 'unplugin-auto-import/vite'
import UnoCSS from 'unocss/vite'
import { WotResolver } from '@uni-helper/vite-plugin-uni-components/resolvers'

function VitePluginUniPolyfill(): Plugin {
  return {
    name: 'vite-plugin-uni-polyfill',
    transform(code, id) {
      if (!id.endsWith('@dcloudio/uni-mp-vue/dist/vue.runtime.esm.js'))
        return
      code += `
// polyfill for @vueuse/core
export const render = () => {}
export const TransitionGroup = {}
`
      return code
    },
  }
}

export default defineConfig({
  plugins: [
    VitePluginUniPolyfill(),

    // https://github.com/uni-helper/vite-plugin-uni-components
    UniHelperComponents({
      dts: 'src/components.d.ts',
      directoryAsNamespace: false,
      resolvers: [
        WotResolver(),
      ],
    }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'pinia',
        'vue',
        'uni-app',
        {
          from: '@bryce-loskie/utils',
          imports: [
            'to',
            'sleep',
          ],
        },
        {
          from: '@tanstack/vue-query',
          imports: [
            'useQuery',
            'useMutation',
          ],
        },
        {
          from: '@vueuse/core',
          imports: [
            'useVModel',
            'until',
          ],
        },
      ],
      dirs: [
        'src/hooks',
        'src/enum',
        'src/utils',
      ],
      vueTemplate: true,
      dts: 'src/auto-imports.d.ts',
    }),

    UnoCSS(),

    Uni({
      vueOptions: {
        script: {
          defineModel: true,
          propsDestructure: true,
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    host: true,
    port: 8090,
    proxy: {
      '/api': {
        // target: "http://smton.net:8082", // 目标服务
        target: 'https://smton.net', // 目标服务
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "./src/styles/style.scss";',
        javascriptEnabled: true,
      },
    },
    postcss: {
      plugins: [
        postcssPxToViewport({
          unitToConvert: 'rpx', // 要转化的单位
          viewportWidth: 750, // UI设计稿的宽度，如果你的设计稿是375就改成375
          unitPrecision: 6, // 转换后的精度，即小数点位数
          propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
          viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
          fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
          selectorBlackList: ['ignore-'], // 指定不转换为视窗单位的类名，
          minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
          mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
          replace: true, // 是否转换后直接更换属性值
          exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
          landscape: false, // 是否处理横屏情况
        }),
      ],
    },
  },
})
