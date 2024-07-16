// 缓存Token
const TokenKey = 'Token'
export function setToken(token: any) {
  return uni.setStorageSync(TokenKey, token)
}

export function getToken() {
  return uni.getStorageSync(TokenKey)
}

export function removeToken() {
  return uni.removeStorageSync(TokenKey)
}

// 缓存用户信息
const userInfo = 'userInfo'
export function setUserInfo(e: any) {
  return uni.setStorageSync(userInfo, e)
}

export function getUserInfo() {
  return uni.getStorageSync(userInfo)
}

export function removeUserInfo() {
  return uni.removeStorageSync(userInfo)
}

// 缓存二维码
const QRCode = 'QRCode'
export function setQRCode(e: any) {
  return uni.setStorageSync(QRCode, e)
}

export function getQRCode() {
  return uni.getStorageSync(QRCode)
}

export function removeQRCode() {
  return uni.removeStorageSync(QRCode)
}

// 缓存认证信息
const authInfo = 'authenticationInfo'
export function setAuthInfo(e: any) {
  return uni.setStorageSync(authInfo, e)
}

export function getAuthInfo() {
  return uni.getStorageSync(authInfo)
}

export function removeAuthInfo() {
  return uni.removeStorageSync(authInfo)
}

// 根字体大小
const fontSize = 'fontSize'
export function setFontSize(e: any) {
  return uni.setStorageSync(fontSize, e)
}

export function getFontSize() {
  return uni.getStorageSync(fontSize)
}

export function removeFontSize() {
  return uni.removeStorageSync(fontSize)
}
