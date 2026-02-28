#!/bin/bash

# 确保脚本在错误时停止
set -e

APP_NAME="weight-loss-server"
# 假设 server 目录就是当前脚本所在目录
SERVER_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🚀 开始部署服务..."
echo "📂 工作目录: $SERVER_DIR"

cd "$SERVER_DIR"

# 1. 安装依赖（可选，如果代码有更新需要）
if [ -f "package.json" ]; then
    echo "📦 安装/更新依赖..."
    npm install
fi

# 2. 数据库迁移与生成
echo "🗄️  处理数据库迁移..."
# 生成 Prisma Client
npx prisma generate
# 执行数据库迁移
npx prisma migrate deploy

# 3. PM2 进程管理
echo "🔄 重启 PM2 服务..."

# 检查 PM2 是否已安装
if ! command -v pm2 &> /dev/null; then
    echo "⚠️  PM2 未安装，正在全局安装..."
    npm install -g pm2
fi

# 检查进程是否存在
if pm2 list | grep -q "$APP_NAME"; then
    echo "♻️  重启现有进程..."
    pm2 reload "$APP_NAME"
else
    echo "🆕 启动新进程..."
    # 注意：这里直接运行 index.js，因为 npm start 可能会包含其他前置命令导致 pm2 无法正确追踪进程
    pm2 start index.js --name "$APP_NAME"
fi

echo "✅ 服务部署完成！"
pm2 save
