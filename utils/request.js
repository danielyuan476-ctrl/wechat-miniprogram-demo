// wx.request 是回调式 API，实际项目统一封装成 Promise，并集中处理鉴权和错误
const BASE_URL = 'https://example.com/api' // TODO: 替换为你的后端地址

function request({ url, method = 'GET', data = {}, showLoading = true }) {
  return new Promise((resolve, reject) => {
    if (showLoading) wx.showLoading({ title: '加载中', mask: true })

    wx.request({
      url: BASE_URL + url,
      method,
      data,
      header: {
        'content-type': 'application/json',
        // 登录态一般放在 header 里，从缓存读取
        Authorization: wx.getStorageSync('token') || ''
      },
      success(res) {
        // HTTP 层成功后，还要判断业务状态码
        if (res.statusCode === 200) {
          resolve(res.data)
        } else if (res.statusCode === 401) {
          wx.removeStorageSync('token')
          wx.showToast({ title: '登录已过期', icon: 'none' })
          reject(res)
        } else {
          wx.showToast({ title: `请求失败 ${res.statusCode}`, icon: 'none' })
          reject(res)
        }
      },
      fail(err) {
        wx.showToast({ title: '网络异常', icon: 'none' })
        reject(err)
      },
      complete() {
        if (showLoading) wx.hideLoading()
      }
    })
  })
}

module.exports = {
  get: (url, data, opts) => request({ url, method: 'GET', data, ...opts }),
  post: (url, data, opts) => request({ url, method: 'POST', data, ...opts })
}
