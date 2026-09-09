App({
  // 全局数据，任意页面通过 getApp().globalData 访问
  globalData: {
    userInfo: null,
    logs: []
  },

  onLaunch() {
    // 小程序启动时执行一次，适合做初始化：读缓存、埋点、检查更新
    const logs = wx.getStorageSync('logs') || []
    this.globalData.logs = logs
  },

  onShow() {
    // 每次小程序从后台切到前台都会触发
  }
})
