/// <reference types="vite/client" />

declare module '*.vue' {
  import type { Component } from 'vue'

  const component: Component
  export default component
}

declare module 'uview-plus' {
  import type { Plugin } from 'vue'

  interface $u {
    toast: any
  }

  global {
    interface Uni {
      $u: $u
    }
  }

  const uviewPlus: Plugin
  export default uviewPlus
}
