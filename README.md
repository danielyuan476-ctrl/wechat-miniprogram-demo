# 微信小程序学习项目

原生微信小程序骨架，用于学习小程序核心机制（页面四件套、setData 数据流、生命周期）。

## 快速开始

### 1. 安装微信开发者工具

下载稳定版（Stable Build）：
https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

### 2. 导入项目

1. 打开开发者工具，扫码登录
2. 选择「小程序」→ 点 `+` → **导入项目**
3. 目录选择本仓库根目录
4. AppID 填自己的（或点「测试号」）
5. 点「导入」

### 3. 替换 AppID

`project.config.json` 中的 `appid` 字段替换为你自己的 AppID。
测试号申请：https://mp.weixin.qq.com/wxamp/sandbox

## 项目结构

```
.
├── app.json                    ★ 入口配置：页面注册、tabBar、全局窗口样式
├── app.js                      全局逻辑与 globalData
├── app.wxss                    全局样式（rpx 单位，屏宽恒为 750rpx）
├── sitemap.json                微信搜索索引规则
├── project.config.json         项目配置（含 AppID），提交版本库
├── project.private.config.json 个人本地配置，已 gitignore
│
├── pages/                      页面目录，每个子目录为一个页面
│   ├── index/                  首页：计数器、列表渲染、原生 API 示例
│   │   ├── index.wxml          结构（类比 HTML）
│   │   ├── index.wxss          样式（类比 CSS，页面级作用域）
│   │   ├── index.js            逻辑与数据
│   │   └── index.json          页面配置，覆盖 app.json 全局项
│   └── logs/                   日志页：本地缓存、tabBar 页面跳转示例
│
├── components/                 自定义组件（待用）
└── utils/
    └── request.js              wx.request 的 Promise 封装，含 loading / 401 / 错误处理
```

## 核心机制

小程序采用**双线程架构**：逻辑层（JSCore，跑 `.js`）与渲染层（WebView，跑 `.wxml`/`.wxss`）相互隔离，
通信必须经过微信原生层。因此：

- **逻辑层没有 DOM 和 `window`**，无法直接操作节点
- **修改数据必须调用 `setData`**，直接赋值 `this.data.x = 1` 不会触发渲染
- **事件传参通过 `data-*` 属性**，从 `e.currentTarget.dataset` 读取，**值均为字符串**，需自行转换类型

```js
// ❌ 界面不会更新
this.data.count = 1

// ✅ 正确写法
this.setData({ count: 1 })
```

`setData` 是跨线程通信，有性能成本：不要在循环中调用，只传变化的字段。

## 生命周期

| 层级 | 方法 | 触发时机 |
| --- | --- | --- |
| App | `onLaunch` | 小程序启动，全局仅一次 |
| App | `onShow` | 每次从后台切到前台 |
| App | `onHide` | 切换到后台 |
| Page | `onLoad` | 页面加载，仅一次。取路由参数、拉首屏数据 |
| Page | `onShow` | 每次页面显示，含从其他页面返回。适合刷新数据 |
| Page | `onReady` | 首次渲染完成，此后才可操作节点 |

注意 `App.onShow` 与 `Page.onShow` 同名但语义不同：前者是整个小程序进入前台，
后者是该页面显示（小程序内部切页不触发前者）。

## 与常规前端的对照

| 概念 | 常规前端 | 微信小程序 |
| --- | --- | --- |
| 路由配置 | `router.js` | `app.json` 的 `pages` 数组 |
| 模板标签 | `div` / `span` | `view` / `text` |
| 状态更新 | `ref.value = x` / `setState` | `this.setData({})` |
| 样式单位 | `px` / `rem` | `rpx` |
| 全局状态 | Pinia / Redux | `getApp().globalData` |
| HTTP 请求 | `fetch` / `axios` | `wx.request`（需配置域名白名单） |
| 本地存储 | `localStorage` | `wx.setStorageSync` |
| DOM 操作 | 直接操作 | 不支持 |

## 平台限制

开发前需知晓的硬性约束：

- **主包体积 ≤ 2MB**，分包总计 ≤ 20MB
- **网络请求仅支持 HTTPS**，且域名须在公众平台配置白名单（每月限改 5 次）
- **页面栈最多 10 层**，`wx.navigateTo` 超出后失败
- **tabBar 页面间跳转必须用 `wx.switchTab`**，用 `navigateTo` 会静默失败
- 用户昵称头像自 2022 年起收紧，需用户主动填写
- 获取手机号需企业主体认证

开发阶段可在开发者工具中关闭「校验合法域名」以跳过白名单限制（本项目已在配置中关闭 `urlCheck`）。

## 网络请求

`utils/request.js` 已封装 Promise 版请求，统一处理 loading、token 注入与错误提示。
使用前修改其中的 `BASE_URL`：

```js
const { get, post } = require('../../utils/request')

const data = await get('/todos')
await post('/todos', { text: '新任务' })
```

## 发布流程

需正式 AppID（测试号无法上传）。

1. 开发者工具点「上传」，填版本号与备注
2. 登录 https://mp.weixin.qq.com → 管理 → 版本管理
3. 找到开发版本，先设为「体验版」用真机验证
4. 确认无误后「提交审核」，需准确填写服务类目；若需登录须提供测试账号
5. 审核通过（通常 1–7 天）后点「发布」，可选全量或分阶段灰度发布

## 参考

- 官方文档：https://developers.weixin.qq.com/miniprogram/dev/framework/
- API 索引：https://developers.weixin.qq.com/miniprogram/dev/api/
- 运营规范：https://developers.weixin.qq.com/miniprogram/product/

注意：中文技术社区存在大量过期教程（如 `wx.getUserInfo`、`wx.getSystemInfoSync` 均已废弃），
以官方文档为准。
