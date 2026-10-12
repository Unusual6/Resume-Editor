# Resume Editor

一款纯前端的在线简历编辑器，支持中英文双语、多模板切换、照片上传、拖拽排序、自动保存与 PDF 导出。所有数据在浏览器本地持久化，无需后端服务。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6.svg)
![Vite](https://img.shields.io/badge/Vite-8-646cff.svg)

## ✨ 功能特性

- **实时预览** — 左侧编辑，右侧 A4 尺寸实时预览，所见即所得
- **中英文双语** — 完整的中英文 UI 翻译，一键切换语言
- **多模板** — 4 种精美模板（经典 / 现代 / 极简 / 典雅），适配不同行业和风格
- **照片上传** — 支持照片上传，内置裁剪和拖拽定位功能
- **拖拽排序** — 教育经历、工作经历、项目经验、技能列表均支持拖拽调整顺序
- **自动保存** — 编辑内容 1.5 秒后自动持久化，防止数据丢失（可切换为手动保存）
- **多简历管理** — 支持创建、保存、加载、复制、重命名、删除多份简历
- **PDF 导出** — 一键导出当前简历为 PDF 文件
- ** IndexedDB 照片存储** — 照片数据存入 IndexedDB，避免 localStorage 容量限制
- **零后端依赖** — 纯前端应用，所有数据在浏览器本地存储

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 9+

### 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器（默认端口 5173）
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 19 + TypeScript 5.6 |
| 构建工具 | Vite 8 |
| 样式 | TailwindCSS 3 + PostCSS |
| 拖拽排序 | @dnd-kit/core + @dnd-kit/sortable |
| PDF 导出 | html2canvas + jsPDF |
| 国际化 | react-i18next |
| 数据存储 | localStorage + IndexedDB |

## 📁 项目结构

```
resume/
├── public/                  # 静态资源
├── src/
│   ├── components/          # UI 组件
│   │   ├── sections/        # 简历各模块表单（教育/工作/项目/技能）
│   │   ├── LanguageSwitch.tsx
│   │   ├── PhotoUpload.tsx
│   │   ├── ResumeForm.tsx
│   │   ├── ResumeList.tsx
│   │   ├── ResumePreview.tsx
│   │   ├── SortableList.tsx
│   │   └── TemplateSelector.tsx
│   ├── context/
│   │   └── ResumeContext.tsx   # 全局状态管理 + 自动保存 + IndexedDB
│   ├── i18n/
│   │   ├── index.ts
│   │   ├── zh.ts               # 中文翻译
│   │   └── en.ts               # 英文翻译
│   ├── templates/             # 简历模板组件
│   │   ├── ClassicTemplate.tsx
│   │   ├── ModernTemplate.tsx
│   │   ├── MinimalTemplate.tsx
│   │   └── ElegantTemplate.tsx
│   ├── types/
│   │   └── resume.ts          # TypeScript 类型定义
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🎨 模板一览

| 模板 | 风格 | 适用场景 |
|------|------|----------|
| **Classic** | 海军蓝头部，单栏布局，传统专业风 | 金融、法律、传统行业 |
| **Modern** | 深色侧边栏，双栏布局，技能进度条 | 互联网、科技、设计 |
| **Minimal** | 大量留白，居中对齐，极细线条 | 自由职业、创意行业 |
| **Elegant** | 暗色侧栏，金色点缀，衬线字体 | 高端商务、管理咨询 |

## 🧩 扩展模板

添加新模板只需 4 步：

1. 在 `src/types/resume.ts` 的 `TemplateType` 中添加新值
2. 在 `src/templates/` 下创建新的模板组件
3. 在 `src/components/TemplateSelector.tsx` 中添加缩略图
4. 在 `src/i18n/{zh,en}.ts` 中添加翻译键

## 📄 License

MIT
