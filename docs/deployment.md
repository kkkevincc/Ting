# 简历编辑器部署文档

## 系统要求

- Node.js 18.0 或更高版本
- npm 或 pnpm 包管理器
- 现代浏览器支持（Chrome 90+, Firefox 88+, Safari 14+, Edge 90+）

## 本地开发环境设置

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

开发服务器将在 http://localhost:5173 启动

### 3. 构建生产版本

```bash
npm run build
```

构建文件将输出到 `dist/` 目录

## 生产环境部署

### Vercel 部署（推荐）

1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量（如果需要）
3. 自动部署触发：每次推送到 main 分支

### 静态网站部署

1. 构建项目：
```bash
npm run build
```

2. 将 `dist/` 目录中的文件上传到您的静态网站托管服务：
   - Netlify
   - GitHub Pages
   - 阿里云 OSS
   - 腾讯云 COS

### Docker 部署（可选）

创建 `Dockerfile`：

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

构建并运行：
```bash
docker build -t resume-editor .
docker run -p 80:80 resume-editor
```

## 环境变量配置

创建 `.env` 文件：

```bash
# 可选：如果需要后端 API 支持
VITE_API_URL=https://your-api-url.com

# PDF 生成配置
VITE_PDF_GENERATION_TIMEOUT=3000
VITE_MAX_FILE_SIZE=10485760
```

## 性能优化

### 构建优化

项目已配置 Vite 构建优化：
- 代码分割
- 压缩和混淆
- 图片优化
- CSS 提取

### CDN 配置

建议在生产环境中使用 CDN 加速静态资源：
- 将构建文件上传到 CDN
- 配置适当的缓存策略
- 启用 Gzip/Brotli 压缩

### 监控和分析

建议添加性能监控：
- Google Analytics
- 百度统计
- 自定义性能指标

## 浏览器兼容性

### 支持的浏览器

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- iOS Safari 14+
- Android Chrome 90+

### 降级处理

对于不支持现代特性的浏览器：
- 提供基本的 HTML 功能
- 显示浏览器升级提示
- 确保核心功能可用

## 安全考虑

### 内容安全策略 (CSP)

建议配置 CSP 头：
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;
```

### HTTPS 配置

确保所有资源通过 HTTPS 加载：
- 配置 SSL/TLS 证书
- 强制 HTTPS 重定向
- 配置 HSTS 头

## 故障排除

### 常见问题

1. **PDF 生成失败**
   - 检查浏览器权限
   - 确保所有字体正确加载
   - 验证 html2canvas 配置

2. **响应式布局问题**
   - 检查 Tailwind CSS 配置
   - 验证媒体查询断点
   - 测试不同设备尺寸

3. **构建错误**
   - 清理 node_modules 并重新安装
   - 检查 TypeScript 配置
   - 验证依赖版本兼容性

### 调试工具

- 浏览器开发者工具
- React DevTools
- Redux DevTools (如果使用)
- 性能分析工具

## 更新和维护

### 依赖更新

定期检查并更新依赖：
```bash
npm update
npm audit fix
```

### 备份策略

- 定期备份源代码
- 备份构建配置
- 文档化自定义配置

### 监控和日志

设置应用监控：
- 错误日志收集
- 性能指标监控
- 用户行为分析

## 支持

如遇到问题，请检查：
1. 浏览器控制台错误
2. 网络请求状态
3. 构建日志信息
4. 文档中的故障排除部分