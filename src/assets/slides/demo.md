---
title: web-ppt 演示
theme: dark
---

# Vue + Markdown PPT

```yaml
layout: cover
```

用 **Markdown** 写内容，*自动分页* 变成演示文稿。

<!-- notes: 这是开场页！先自我介绍，然后快速演示键盘方向键切换幻灯片的效果。 -->

- 键盘左右方向键切换
- 鼠标滚轮切换
- 右侧圆点导航
- 底部进度条

# 为什么用 Markdown？

普通的 `.md` 文件，直接变成演示文稿。

<!-- notes: 强调「写作即演示」——用 Markdown 写作时无需关心排版，天然的结构化内容可以直接用于演示。 -->

> **写作即演示**
> 专注内容本身，不被排版打扰。

- *无需* 拖拽布局
- *无需* 点击菜单
- 天然版本控制（Git 友好）

# 分页规则

用 `# H1` 标题触发新页面，每个标题开启一页：

```markdown
# 第一页标题
内容...

# 第二页标题
内容...
```

也支持 `---` 水平线作为备用分隔符。

# 技术栈

核心依赖极其轻量：

| 包 | 用途 |
|---|---|
| `marked` | Markdown → HTML |
| `front-matter` | 解析 frontmatter |
| `Vue 3` | 响应式渲染 |
| `Pinia` | 状态管理 |

# 布局系统

```yaml
layout: two-col
```

## 多种布局适配不同场景

### 左侧：内容说明
`cover` — 封面布局，大标题居中，适合演讲开场

`default` — 默认单栏，适合普通内容页

### 右侧：代码示例

````
---
layout: cover
---
# 封面标题

---
layout: two-col
---

## 左侧标题
左侧内容

右侧内容

---
layout: blank
---

任意 HTML/CSS 内容自由定位
````

---

## 四种布局说明

| 布局 | 用途 | 适用场景 |
|:---|:---|:---|
| `cover` | 封面页 | 大标题 + 副标题居中 |
| `default` | 默认单栏 | 普通内容页 |
| `two-col` | 双栏 | 左右分栏对比/左右结构 |
| `blank` | 空白布局 | 自由定位、自定义样式 |

每页可通过 frontmatter 独立配置布局、背景色、过渡动画。

# 代码演示

支持语法高亮，直接写代码块即可：

```typescript
// TypeScript 代码示例
interface Slide {
  title: string
  content: string
  layout: 'cover' | 'default'
}

function createSlide(data: Slide): Slide {
  return { ...data, layout: data.layout ?? 'default' }
}
```

```bash
# 终端命令示例
pnpm add vue router pinia
pnpm dev
pnpm build
```

```python
# Python 片段
def fibonacci(n: int) -> list[int]:
    a, b = 0, 1
    result = []
    while a < n:
        result.append(a)
        a, b = b, a + b
    return result
```

# 图片展示

支持本地图片和远程图片：

![Vue Logo](https://vuejs.org/images/logo.png)

本地图片语法：
```markdown
![描述](./assets/image.png)
```

# 富文本样式

### 文字强调

**粗体文字** / *斜体文字* / ~~删除线~~

`行内代码` / ==高亮标记== / <u>下划线</u>

### 颜色标签

<span style="color:#41b883">Vue 绿</span> ·
<span style="color:#ff6b6b">警告红</span> ·
<span style="color:#ffd93d">提示黄</span>

### 任务列表

- [x] Markdown 解析
- [x] 键盘导航
- [x] 进度条
- [ ] 布局系统
- [ ] 导出 PDF

# 表格示例

| 功能 | 状态 | 优先级 |
|:---|:---:|---:|
| 基础翻页 | ✅ 完成 | 🔴 高 |
| 代码高亮 | ✅ 完成 | 🔴 高 |
| 双栏布局 | 🚧 进行中 | 🟡 中 |
| PDF 导出 | ⏳ 待开发 | 🟢 低 |

# 引用与提示

> **💡 提示**
> 按 `F` 键可以进入全屏演示模式

> **⚠️ 注意**
> 移动端建议使用手势滑动切换页面

# 数学与图表

支持行内公式：爱因斯坦的质能方程 $E = mc^2$

块级公式：

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

# 谢谢观看

**感谢使用 web-ppt**

- 📦 开源项目，欢迎贡献
- 📝 用 Markdown 专注内容创作
- 🎨 样式可定制，主题可扩展

[GitHub 主页](https://github.com) · [文档](https://vuejs.org)

