# web-ppt

用 Markdown 写内容，自动生成 PPT 风格的演示文稿。基于 Vue 3 + Vite 构建，支持代码高亮、KaTeX 数学公式、图片展示。

## 功能特性

- 📝 **Markdown 驱动** — 用熟悉的 Markdown 语法写幻灯片
- ⌨️ **键盘导航** — 左右方向键切换页面
- 🖱️ **滚轮/触摸** — 鼠标滚轮或触摸板滑动切换
- 🎨 **代码高亮** — 基于 highlight.js，支持 TypeScript / Bash / Python 等
- 📐 **数学公式** — 基于 KaTeX，支持行内 `$...$` 和块级 `$$...$$`
- 🖼️ **图片展示** — 支持本地图片和远程图片
- 📄 **PDF 导出** — 支持将演示文稿导出为 PDF（开发中）

## 分页规则

用 `# H1` 标题触发新页面，每个 H1 标题开启一页：

```markdown
# 第一页标题
内容...

# 第二页标题
内容...
```

也支持 `---` 水平线作为备用分隔符。

## 快速开始

### 前置条件

- Node.js >= 20.19.0 或 >= 22.12.0
- pnpm

### 安装依赖

```sh
pnpm install
```

### 启动开发服务器

```sh
pnpm dev
```

访问 `http://localhost:5173` 查看效果。

### 构建生产版本

```sh
pnpm build
```

构建产物在 `dist/` 目录下。

### 预览生产版本

```sh
pnpm preview
```

## 加载自定义 Markdown 文件

将 `.md` 文件放入 `public/` 目录，然后通过 URL 参数指定：

```
http://localhost:5173/?md=my-talk.md
```

也支持远程 URL：

```
http://localhost:5173/?md=https://example.com/slides.md
```

不传 `?md=` 参数时，默认使用内置的 `demo.md`。

## 技术栈

| 包 | 用途 |
|---|---|
| `marked` | Markdown → HTML |
| `front-matter` | 解析 frontmatter |
| `highlight.js` | 代码语法高亮 |
| `katex` | 数学公式渲染 |
| `Vue 3` | 响应式渲染 |
| `Pinia` | 状态管理 |
| `Vite` | 构建工具 |

## 项目结构

```
src/
  assets/slides/     # Markdown 幻灯片文件
  components/        # Vue 组件（SlideItem / PresentationView / NavDots / ProgressBar）
  composables/       # 组合式函数（useSlideParser / useSlideNav / useMdLoader）
  stores/            # Pinia 状态管理（slideStore）
  views/             # 页面视图（HomeView）
```

## GitHub Pages 部署

推送到 `main` 分支后，GitHub Actions 自动构建并部署到 GitHub Pages：

```
https://<username>.github.io/web-ppt/
```

部署配置文件：`.github/workflows/deploy.yml`

## 开发计划

- [x] Markdown 解析
- [x] 键盘/滚轮导航
- [x] 进度条
- [x] 代码高亮
- [x] 数学公式渲染
- [ ] 布局系统（cover / two-col / blank）
- [ ] 主题定制
- [ ] PDF 导出
- [ ] 过渡动画

## License

MIT
