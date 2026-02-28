# 减肥追踪 (Weight Loss Tracker)

一个全栈式体重管理与健康追踪应用，帮助用户记录饮食、运动和体重变化，科学管理身材。

## ✨ 功能特性

- **📊 数据仪表盘**
  - 实时查看今日体重、摄入热量与消耗热量
  - 可视化体重变化趋势图表
  - 每日记录摘要

- **🍽️ 饮食记录**
  - 支持早餐、午餐、晚餐及加餐记录
  - 自动统计每日总摄入热量
  - 便捷的食物添加与管理

- **🏃 运动追踪**
  - 记录多种运动类型（跑步、游泳、骑行等）
  - 自动统计每日总消耗热量
  - 运动时长与强度管理

- **🔐 用户系统**
  - 安全的注册与登录流程（支持邮箱/手机号）
  - JWT 身份验证与会话管理
  - 个人资料管理

- **🔍 SEO 优化**
  - 动态 Meta 标签管理（Title, Description, Keywords）
  - 自动化生成 `robots.txt` 和 `sitemap.xml`
  - 针对不同路由的 SEO 策略配置

## 🛠️ 技术栈

### 前端 (Client)
- **框架**: [React 18](https://react.dev/)
- **构建工具**: [Vite](https://vitejs.dev/)
- **路由**: [React Router v6](https://reactrouter.com/)
- **样式**: [TailwindCSS](https://tailwindcss.com/)
- **图表**: [Recharts](https://recharts.org/)
- **部署**: 阿里云 OSS (Aliyun Object Storage Service)

### 后端 (Server)
- **运行时**: [Node.js](https://nodejs.org/)
- **框架**: [Express](https://expressjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **数据库**: SQLite (开发环境) / 可无缝切换至 PostgreSQL/MySQL
- **认证**: JSON Web Tokens (JWT) + bcryptjs

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0

### 1. 克隆项目
```bash
git clone <repository-url>
cd weight-loss
```

### 2. 安装依赖

**服务端依赖**
```bash
cd server
npm install
```

**客户端依赖**
```bash
cd ../client
npm install
```

### 3. 环境配置

**服务端配置** (`server/.env`)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-change-me"
PORT=3000
```

**客户端配置** (`client/.env`)
```env
# API 地址
VITE_API_BASE_URL="http://localhost:3000/api"

# 部署与 SEO 配置 (可选，仅部署时需要)
SITE_URL="https://your-domain.com"
OSS_REGION="oss-cn-hangzhou"
OSS_ACCESS_KEY_ID="your-access-key-id"
OSS_ACCESS_KEY_SECRET="your-access-key-secret"
OSS_BUCKET="your-bucket-name"
```

### 4. 启动开发环境

建议开启两个终端窗口分别启动前后端：

**启动后端**
```bash
cd server
# 初始化数据库并启动
npm run dev
```

**启动前端**
```bash
cd client
npm run dev
```

访问 `http://localhost:5173` 即可开始使用。

## 📦 部署指南

### 客户端部署
客户端支持一键构建并上传至阿里云 OSS，同时自动生成 SEO 文件。

```bash
cd client
npm run deploy
```
> 该命令会执行构建、生成 `robots.txt`/`sitemap.xml` 并上传所有静态资源到配置的 OSS Bucket。

### 服务端部署
服务端启动脚本包含自动迁移逻辑：

```bash
cd server
npm start
```
> `npm start` 会依次执行：
> 1. `prisma migrate deploy`: 应用最新的数据库迁移
> 2. `prisma generate`: 生成 Prisma Client
> 3. `node index.js`: 启动服务

## 📂 目录结构

```
weight-loss/
├── client/                 # 前端项目
│   ├── src/
│   │   ├── components/     # 通用组件
│   │   ├── context/        # React Context (Auth等)
│   │   ├── pages/          # 页面组件 (Dashboard, Diet, Exercise...)
│   │   └── utils/          # 工具函数
│   ├── scripts/            # 部署脚本
│   └── public/             # 静态资源
├── server/                 # 后端项目
│   ├── prisma/             # 数据库模型与迁移
│   ├── routes/             # API 路由
│   ├── middleware/         # 中间件 (Auth)
│   └── index.js            # 入口文件
└── README.md               # 项目文档
```

## 📄 许可证

MIT License
