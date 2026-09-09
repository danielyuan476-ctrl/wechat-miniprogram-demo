Page({
  // data 是页面初始状态，只能通过 setData 修改，直接赋值不会触发渲染
  data: {
    title: '你好',
    count: 0,
    deviceInfo: '',
    todos: [
      { id: 1, text: '跑通开发者工具预览', done: true },
      { id: 2, text: '注册小程序账号拿 AppID', done: false },
      { id: 3, text: '接一个真实接口', done: false }
    ]
  },

  onLoad() {
    // 页面首次加载，只执行一次。适合取参数、拉初始数据
  },

  onShow() {
    // 每次页面显示都触发，包括从其他页面返回。适合刷新数据
  },

  // 事件对象 e 里的 e.currentTarget.dataset 拿到 wxml 上的 data-* 属性
  // 注意 dataset 的值都是字符串，需要自己转类型
  onAdd(e) {
    const step = Number(e.currentTarget.dataset.step)
    this.data.count = this.data.count + step   // 故意不用 setData
    console.log('count 现在是', this.data.count)
  }
  

  onReset() {
    this.setData({ count: 0 })
  },

  onToggle(e) {
    const id = Number(e.currentTarget.dataset.id)
    const todos = this.data.todos.map(item =>
      item.id === id ? { ...item, done: !item.done } : item
    )
    this.setData({ todos })
  },

  onShowToast() {
    wx.showToast({ title: '这是原生 Toast', icon: 'success' })
  },

  onGetSystemInfo() {
    // wx.getSystemInfoSync 已废弃，新版拆成了 getDeviceInfo / getWindowInfo 等
    const device = wx.getDeviceInfo()
    const win = wx.getWindowInfo()
    this.setData({
      deviceInfo: `${device.brand} ${device.model} · ${win.windowWidth}x${win.windowHeight}`
    })
  }
})
