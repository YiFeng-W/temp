const share = {
  title: '璟橡',
  path: '/pages/index/index', // 全局分享的路径，比如 首页
  textcolor: 'white',
  background: {
    backgroundColor: '#0E76FF',
  },
  imageUrl: 'https://smton.net/image/logo.png',
}

export const shareMixin = {
  onShareAppMessage() {
    return share
  },
  onShareTimeline() {
    return share
  },
}
