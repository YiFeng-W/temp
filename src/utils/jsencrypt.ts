import JSEncrypt from 'jsencrypt'

const publicKey = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0bKf6WopjsMtJNvBvg/ZPSDeboYBV+YqkTpLBagjHPAug9dgfoaV6cilbpgD/4WK2fqI1g+DiK2yzjPHz9ZlLRMrV94T2fqdzKGU4IYni3NmgHNgNwKMF0kj3xI9o6krUnyuavWOh2s2ohvSbwkx+dnm0vGGchCmbJUFuODER5x0vhHaUruzcCn/PQyLmtoRqRKm7ozBCF9mYHK5Poo34PzbHJq1mgylbqW54LdzRkETknaAXWfj/bNren4p7ZdiRinQv9wza4KQfsUZeuMg6s4rM6e1c2wmidBso3aYdvQX5BrgvrVas6blhpXjXNB4cU/ZX/2Yk4+m2UjQTioVAwIDAQAB`
const privateKey = ``

// 加密
export function encrypt(txt: string) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}

// 解密
export function decrypt(txt: string) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey) // 设置私钥
  return encryptor.decrypt(txt) // 对数据进行解密
}
