import { getCurrentUserAuthCompany, getPersonalAuthentication, userAuthInfo } from '@/api/index'
import { getUserInfo, removeAuthInfo, setAuthInfo } from '@/utils/local-storage'

export default function getProveInfo(type: boolean) {
  const userInfo = getUserInfo()
  // 获取认证状态
  const getAuthState = async () => {
    const res: any = await userAuthInfo()
    if (res.success) {
      if (res.data.authStatus === 0) {
        // console.log('待提交')
        removeAuthInfo()
      }
      else if (res.data.authStatus === 1) {
        // console.log('认证通过')
        if (res.data.authType === 1) {
          getPersonalAuth(res.data.authStatus, res.data.authType)
        }
        else {
          getCompanyAuth(res.data.authStatus, res.data.authType)
        }
      }
      else if (res.data.authStatus === 2) {
        // console.log('待审核')
        if (res.data.authType === 1) {
          const auth: any = {
            authStatus: res.data.authStatus,
            authType: res.data.authType,
          }
          setAuthInfo(auth)
        }
        else {
          const auth: any = {
            authStatus: res.data.authStatus,
            authType: res.data.authType,
          }
          setAuthInfo(auth)
        }
      }
      else if (res.data.authStatus === -1) {
        // console.log('认证失败')
        removeAuthInfo()
      }
    }
    else {
      uni.showToast({
        icon: 'none',
        title: res.msg,
      })
    }
  }

  // 获取个人认证
  const getPersonalAuth = async (zt: number, lx: number) => {
    const res: any = await getPersonalAuthentication({
      id: userInfo.id,
    })
    if (res.success) {
      if (type) {
        uni.showModal({
          title: '个人认证成功',
          showCancel: false,
        })
      }
      res.data.authStatus = zt
      res.data.authType = lx
      setAuthInfo(res.data)
    }
    else {
      uni.showToast({
        icon: 'none',
        title: res.msg,
      })
    }
  }
  // 获取企业认证
  const getCompanyAuth = async (zt: number, lx: number) => {
    const res: any = await getCurrentUserAuthCompany()
    if (res.success) {
      if (type) {
        uni.showModal({
          title: '企业认证成功',
          showCancel: false,
        })
      }
      res.data.authStatus = zt
      res.data.authType = lx
      setAuthInfo(res.data)
    }
    else {
      uni.showToast({
        icon: 'none',
        title: res.msg,
      })
    }
  }

  getAuthState()
}
