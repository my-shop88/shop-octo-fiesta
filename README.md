# 云商后端服务

基于 Node.js + Express 的电商后端服务，集成微信支付、支付宝、快递100物流API。

## 功能特性

- **用户认证**：JWT token 认证，支持注册/登录/密码修改
- **订单管理**：完整的订单生命周期管理
- **支付集成**：
  - 微信支付（JSAPI）
  - 支付宝（网页支付）
- **物流集成**：
  - 快递100下单
  - 物流轨迹查询
  - 实时推送订阅

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，填入实际的API密钥
```

### 3. 启动服务

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

服务启动后访问 http://localhost:3000/api/health 检查状态。

## API 文档

### 用户接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/user/register | 用户注册 |
| POST | /api/user/login | 用户登录 |
| GET | /api/user/profile | 获取用户信息（需认证） |
| PUT | /api/user/profile | 更新用户信息（需认证） |
| PUT | /api/user/password | 修改密码（需认证） |

### 订单接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/order/create | 创建订单 |
| GET | /api/order/:orderId | 查询订单详情 |
| PUT | /api/order/:orderId/status | 更新订单状态 |
| GET | /api/order/user/:userId | 获取用户订单列表 |
| POST | /api/order/:orderId/cancel | 取消订单 |

### 支付接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/pay/wechat/create | 创建微信支付订单 |
| POST | /api/pay/wechat/notify | 微信支付回调 |
| POST | /api/pay/alipay/create | 创建支付宝订单 |
| POST | /api/pay/alipay/notify | 支付宝回调 |

### 物流接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/shipping/carriers | 获取支持的快递公司 |
| POST | /api/shipping/create | 创建物流订单 |
| GET | /api/shipping/track/:number | 查询物流轨迹 |
| POST | /api/shipping/subscribe | 订阅物流推送 |
| POST | /api/shipping/kuaidi100/callback | 快递100回调 |

## 数据库配置

执行 `database.sql` 创建数据库和表结构：

```bash
mysql -u root -p < database.sql
```

## 支付配置

### 微信支付

1. 申请微信支付商户号
2. 在商户平台获取 API 密钥
3. 配置回调域名

### 支付宝

1. 申请支付宝开放平台应用
2. 生成 RSA2 密钥对
3. 配置应用公钥和支付宝公钥

## 物流配置

### 快递100

1. 注册快递100企业账号
2. 获取授权 KEY 和 CUSTOMER ID
3. 配置回调地址用于接收物流推送

## 项目结构

```
server/
├── server.js          # 服务入口
├── package.json       # 项目配置
├── .env.example       # 环境变量模板
├── database.sql       # 数据库结构
├── README.md          # 说明文档
└── routes/
    ├── user.js        # 用户路由
    ├── order.js       # 订单路由
    ├── pay.js         # 支付路由
    └── shipping.js    # 物流路由
```

## 注意事项

1. 生产环境务必修改 JWT_SECRET 为强密码
2. 回调地址需要配置为可公网访问的 HTTPS 地址
3. 支付和物流的测试环境需要单独申请
4. 建议使用 PM2 部署生产环境

## 技术栈

- Node.js 18+
- Express 4.x
- MySQL 8.0
- JWT 认证
- 快递100 API
- 微信支付 API
- 支付宝开放平台 API

## License

MIT
