Page({
  data: {
    logs: []
  },

  onShow() {
    // 每次进入页面都重新读缓存，保证数据最新
    this.setData({ logs: wx.getStorageSync('logs') || [] })
  },

  onSave() {
    const logs = this.data.logs.slice()
    logs.unshift(new Date().toLocaleString())
    wx.setStorageSync('logs', logs)
    this.setData({ logs })
  },

  goIndex() {
    // 目标是 tabBar 页面，只能用 switchTab
    wx.switchTab({ url: '/pages/index/index' })
  }
})
