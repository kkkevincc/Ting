# 简历编辑器

一个简洁高效的在线简历制作工具，帮助用户快速创建专业的中文简历。

## 功能特点

✅ **简洁高效**：三步完成简历制作（填写→预览→下载）

✅ **实时预览**：填写信息时实时显示简历效果

✅ **智能排版**：自动调整字体大小和间距，确保美观输出

✅ **PDF生成**：一键生成专业格式的PDF文件

✅ **响应式设计**：支持桌面和移动设备

✅ **中文优化**：专为中文简历设计的模板和布局

## 技术栈

- **前端**：React 18 + TypeScript + Tailwind CSS
- **状态管理**：Zustand
- **PDF生成**：html2canvas + jsPDF
- **路由**：React Router v6
- **构建工具**：Vite

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5175 查看应用

### 构建生产版本

```bash
npm run build
```

## 项目结构

```
src/
├── components/resume/     # 简历相关组件
│   ├── BasicInfoForm.tsx  # 基本信息表单
│   ├── EducationForm.tsx  # 教育背景表单
│   ├── ExperienceForm.tsx # 工作经历表单
│   ├── SkillForm.tsx      # 技能表单
│   ├── ResumeTemplate.tsx # 简历模板
│   └── MobilePreview.tsx  # 移动端预览
├── pages/                 # 页面组件
│   ├── ResumeEditor.tsx   # 编辑页面
│   └── ResumePreview.tsx  # 预览页面
├── stores/               # 状态管理
│   └── resumeStore.ts    # 简历数据状态
├── types/                # TypeScript类型定义
│   └── resume.ts         # 简历数据类型
├── utils/                # 工具函数
│   └── pdfGenerator.ts   # PDF生成工具
└── routes/               # 路由配置
    └── index.tsx         # 路由定义
```

## 核心功能

### 1. 表单输入
- 基本信息：姓名、邮箱、电话、求职意向
- 教育背景：学校、专业、学历、时间、课程
- 实习经历：公司、职位、时间、工作描述
- 个人技能：技能分类和具体技能

### 2. 实时预览
- 左侧填写，右侧实时显示效果
- 响应式设计，支持不同屏幕尺寸
- 移动端优化布局

### 3. PDF生成
- 智能布局算法
- 自动字体缩放
- 智能分页处理
- A4纸张格式优化

### 4. 智能排版
- 根据内容长度自动调整字体大小
- 动态计算行间距保持美观
- 避免段落被分割到不同页面

## 部署

### 静态网站部署

构建项目后，将 `dist/` 目录中的文件上传到静态网站托管服务：

- Vercel（推荐）
- Netlify
- GitHub Pages
- 阿里云 OSS
- 腾讯云 COS

### Docker部署

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- iOS Safari 14+
- Android Chrome 90+

## 文档

- [用户操作手册](docs/user-manual.md)
- [部署文档](docs/deployment.md)
- [产品需求文档](.trae/documents/resume-editor-prd.md)
- [技术架构文档](.trae/documents/resume-editor-technical-architecture.md)

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 许可证

MIT License

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 GitHub Issue
- 发送邮件至项目维护者

---

**祝您使用愉快，求职成功！** 🎉