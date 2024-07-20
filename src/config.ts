// 系统信息
export const SYSTEM_INFO = uni.getSystemInfoSync()

// 测试地址
export const HOST = 'https://smton.net'
// export const HOST = 'http://47.109.129.34:8091'
// 生产地址
// export const HOST = "https://nanhua.smton.net/";
// 后端地址
// export const HOST = "https://33be-61-166-218-40.ngrok-free.app";

// 小程序秘钥
export const appSecret = '2aec1883cbfd58e6623397070c2fc712'

// APPID
export const APPID = 'wxb96df3c15a65ff2f'

// api服务器
export const API_HOST = SYSTEM_INFO.uniPlatform === 'web' ? '' : HOST

// api服务代理路径
export const API_PROXY = SYSTEM_INFO.uniPlatform === 'web' ? '/api' : ''

// 组装接口url
export const packApiUrl = (url: string) => {
  if (url.startsWith('http'))
    return url

  else return `${API_HOST}${API_PROXY}${url}`
}
