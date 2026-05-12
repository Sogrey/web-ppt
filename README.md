# web-ppt

用 **Markdown** 写幻灯片，自动生成演示文稿。告别 PowerPoint，专注内容本身。

> 写 Markdown → 打开浏览器 → 开始演示

![Node.js](https://img.shields.io/badge/Node.js-22+-green) ![Vue 3](https://img.shields.io/badge/Vue-3-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 特色介绍

### 🎯 极简工作流

用任意编辑器写 Markdown，无需安装任何软件。天然版本控制（Git 友好），可以直接在 GitHub / VS Code 中预览 `.md` 文件。

### 📦 开箱即用

- `# H1` 自动分页，无需手动切页
- 代码高亮、数学公式、图片——Markdown 原生支持什么，就展示什么
- 四种内置布局（封面、默认、双栏、空白），一行 YAML 配置切换

### 🖥️ 演示体验

- **全屏模式** — 按 `F` 键，沉浸式演示
- **演讲者备注** — 按 `S` 键，仅自己可见的提示内容
- **PDF 导出** — 按 `P` 键，通过浏览器打印生成多页 PDF
- **URL 分享** — `/#/3` 直接跳转到指定页码
- **拖拽打开** — 直接将本地 `.md` 文件拖入页面即可加载
- **智能滚动** — 长内容页支持内部滚动，滚动到边界后自动翻页

### 🎨 深度定制

- CSS 变量主题系统，修改几个颜色值即可换肤
- 每页支持独立背景色和布局
- 全部源码开源，可自由改造

---

## 快速开始

### 安装

```sh
git clone https://github.com/Sogrey/web-ppt.git
cd web-ppt
pnpm install
```

### 开发

```sh
pnpm dev
# 访问 http://localhost:5173
```

### 构建

```sh
pnpm build
# 产物在 dist/ 目录
```

---

## 使用方法

### 1. 写 Markdown

在 `src/assets/slides/` 下新建 `.md` 文件，或放入 `public/` 目录通过 URL 参数加载。

每个 `# H1` 标题自动变成一页幻灯片：

```markdown
# 第一页标题

内容...

# 第二页标题

内容...
```

> 也支持 `---` 水平线作为分页符（与 `#` 等效）

### 2. 指定 Markdown 文件

**拖拽打开** — 直接将本地 `.md` 文件拖入浏览器页面即可加载

**本地文件** — 将 `.md` 放入 `public/` 目录：

```
http://localhost:5173/?md=my-talk.md
```

**远程文件**：

```
http://localhost:5173/?md=https://example.com/slides.md
```

**默认文件** — 不传参数时自动加载 `public/demo.md`

### 3. 配置每页样式（可选）

在幻灯片顶部加 YAML frontmatter：

```markdown
---
layout: cover # cover | default | two-col | blank
background: '#0B0D0F' # 背景色
label: '01 / 介绍' # 左上角页签
---

# 标题
```

### 4. 添加演讲者备注

在页面内容末尾加 HTML 注释，按 `S` 键查看：

```markdown
# Vue 3 核心概念

内容...

<!-- notes: 重点讲 Composition API，对比 Options API -->
```

### 5. 演示快捷键

| 快捷键                | 功能       |
| --------------------- | ---------- |
| `←` `→` / 空格 / 回车 | 切换幻灯片 |
| `F`                   | 全屏演示   |
| `S`                   | 演讲者备注 |
| `P`                   | 导出 PDF   |

分享时带上页码：`https://yoursite.com/#/3` 打开直接跳到第 3 页。

---

## 功能一览

| 功能         | 说明                                 |
| ------------ | ------------------------------------ |
| `# H1` 分页  | 每个 H1 标题自动分页                 |
| `---` 分页   | 水平线也可作为分页符                 |
| 代码高亮     | highlight.js，支持 TS/Bash/Python 等 |
| 数学公式     | KaTeX，行内 `$x$` 和块级 `$$...$$`   |
| 图片         | 支持本地和远程图片                   |
| 四种布局     | cover / default / two-col / blank    |
| 自定义背景色 | 每页独立背景色                       |
| 键盘导航     | 方向键 / 空格 / 回车，直接翻页       |
| 滚轮导航     | 长内容页先滚动到底再翻页             |
| 触摸滑动     | 触摸板左右滑动切换                   |
| 拖拽打开     | 拖入本地 `.md` 文件直接加载          |
| 全屏模式     | F 键或按钮进入全屏                   |
| 演讲者备注   | S 键呼出，HTML 注释语法              |
| PDF 导出     | P 键或按钮，浏览器打印生成           |
| URL 分享     | `/#/N` 直接跳转指定页                |
| CSS 主题     | CSS 变量，任意换肤                   |
| GitHub Pages | CI/CD 自动部署                       |

---

## 技术栈

| 包             | 用途                    |
| -------------- | ----------------------- |
| `marked`       | Markdown → HTML         |
| `front-matter` | 解析 frontmatter 元数据 |
| `highlight.js` | 代码语法高亮            |
| `katex`        | 数学公式渲染            |
| `Vue 3`        | 组件化响应式 UI         |
| `Pinia`        | 状态管理                |
| `Vite`         | 极速构建工具            |

---

## 项目结构

```
web-ppt/
├── public/               # 静态文件（放自定义 .md，包括 demo.md）
├── src/
│   ├── assets/
│   │   └── styles/        # CSS（theme.css / print.css）
│   ├── components/
│   │   ├── PresentationView.vue  # 主容器
│   │   ├── SlideItem.vue         # 单页幻灯片
│   │   ├── NavDots.vue           # 右侧导航圆点
│   │   ├── ProgressBar.vue       # 底部进度条
│   │   └── SpeakerNotes.vue      # 演讲者备注面板
│   ├── composables/
│   │   ├── useSlideParser.ts     # Markdown 解析
│   │   ├── useSlideNav.ts        # 导航交互
│   │   └── useMdLoader.ts        # 文件加载
│   ├── stores/
│   │   └── slideStore.ts         # Pinia 状态管理
│   ├── types/
│   │   └── slide.ts             # 类型定义
│   └── views/
│       └── HomeView.vue          # 首页入口
└── .github/workflows/
    └── deploy.yml          # GitHub Pages 自动部署
```

---

## 部署

推送到 `main` 分支后，GitHub Actions 自动构建并部署到 GitHub Pages：

```
https://Sogrey.github.io/web-ppt/
```

---

## License

MIT
