import { packApiUrl } from '../config'
import { getToken } from '@/utils/local-storage'

// 获取运行环境对应网关
// 本地调试接口地址
// const baseURL:string='http://xxxxxx'
// 封装公共请求方法

function request<T = unknown>(url: string, method: 'GET' | 'POST' | undefined, data?: object | any) {
  return new Promise<T>((resolve, reject) => {
    let header: any
    if (getToken() !== undefined && getToken() !== '') {
      header = {
        'content-type': 'application/json',
        'authentication': getToken(),
      }
    }
    else {
      header = {
        'content-type': 'application/json',
      }
    }

    uni.request({
      url: packApiUrl(url),
      method,
      data,
      header,
      success(res: any) {
        if (res.statusCode === 200) {
          resolve(res.data)
        }
        else if (res.statusCode === 401) {
          // 未登录或登录过期
          //      removeToken()
          //      removeUserInfo()
          // removeAuthInfo()
          // removeQRCode()
          // uni.showModal({
          //   title: '提示',
          //   content: '当前未登录，是否登录',
          //   success: function (res) {
          //     if (res.confirm) {
          //       uni.navigateTo({
          //         url: '/pagesOther/src/login/index'
          //       });
          //     } else if(res.cancel) {
          //       uni.navigateBack({
          //         delta: 1
          //       });
          //     }
          //   }
          // });
          reject(res.data)
        }
        else {
          // 其他异常
          // uni.showToast({
          //   title: res.data.msg,
          //   icon: "none",
          // });
          reject(res.data)
        }
      },
      fail(err) {
        // 请求失败
        uni.showToast({
          title: '无法连接到服务器',
          icon: 'none',
        })
        reject(err)
      },
    })
  })
}
export { request }
