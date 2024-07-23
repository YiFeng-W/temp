import type { ConfigProviderThemeVars } from 'wot-design-uni'

export {}

declare global {
  export type ThemeVars = ConfigProviderThemeVars

  interface IPagePayload {
    // TODO: set payload props
  }

  export interface IRes<T> {
    success: boolean
    data: T
    msg: string
  }

  interface IListRes<T> {
    success: boolean
    data: {
      list: T[]
    }
    msg: string
  }
}
