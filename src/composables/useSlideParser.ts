import { marked, Renderer } from 'marked'
import fm from 'front-matter'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import type { SlideData, SlideFrontmatter, PresentationMeta } from '@/types/slide'

// Custom Renderer: code highlighting
const renderer = new Renderer()
renderer.code = function ({ text, lang }: { text: string; lang?: string }): string {
  const safeLang = lang ?? ''
  if (safeLang && hljs.getLanguage(safeLang)) {
    const result = hljs.highlight(text, { language: safeLang })
    return `<pre><code class="hljs language-${safeLang}">${result.value}</code></pre>`
  }
  const result = hljs.highlightAuto(text)
  return `<pre><code class="hljs">${result.value}</code></pre>`
}
marked.use({ renderer })

/**
 * Render KaTeX formulas in HTML string.
 * Scans char by char, skips content inside <pre>/<code> tags.
 */
function renderMathInHtml(html: string): string {
  let out = ''
  let i = 0
  const len = html.length

  while (i < len) {
    // HTML tag: copy as-is
    if (html[i] === '<') {
      const closeIdx = html.indexOf('>', i)
      if (closeIdx === -1) { out += html.substring(i); break }
      const tag = html.substring(i, closeIdx + 1)
      const preMatch = tag.match(/^<(pre|code)\b/i)
      if (preMatch) {
        const tagName = (preMatch[1] ?? 'pre').toLowerCase()
        const endTag = `</${tagName}>`
        const endIdx = html.indexOf(endTag, closeIdx + 1)
        if (endIdx !== -1) {
          const full = html.substring(i, endIdx + endTag.length)
          out += full
          i = endIdx + endTag.length
          continue
        }
      }
      out += tag
      i = closeIdx + 1
      continue
    }

    // $ sign: try to match formula
    if (html[i] === '$') {
      // Block $$
      if (i + 1 < len && html[i + 1] === '$') {
        const end = html.indexOf('$$', i + 2)
        if (end !== -1) {
          const expr = html.substring(i + 2, end)
          try {
            const rendered = katex.renderToString(expr.trim(), { displayMode: true, throwOnError: false })
            out += `<div class="katex-block">${rendered}</div>`
          } catch {
            out += `$$${expr}$$`
          }
          i = end + 2
          continue
        }
      }

      // Inline $...$
      const end = html.indexOf('$', i + 1)
      if (end !== -1) {
        const inner = html.substring(i + 1, end)
        if (inner.length > 0 && !inner.includes('\n') && !inner.includes('$')) {
          try {
            out += katex.renderToString(inner.trim(), { displayMode: false, throwOnError: false })
            i = end + 1
            continue
          } catch { /* ignore, output as-is */ }
        }
      }
    }

    // Normal character
    out += html[i]
    i++
  }

  return out
}

// Split markdown into slide blocks by H1 or ---
// Tracks code fences (```) to avoid mis-splitting code blocks
function splitIntoBlocks(raw: string): string[] {
  const lines = raw.split('\n')
  const blocks: string[] = []
  let current: string[] = []
  let inCodeBlock = false

  for (const line of lines) {
    // Detect code fence: toggle inCodeBlock state
    if (/^`{3,}/.test(line)) {
      inCodeBlock = !inCodeBlock
    }

    const isH1 = !inCodeBlock && /^#(?!#)\s/.test(line)
    const isSeparator = !inCodeBlock && /^-{3,}$/.test(line.trim())

    if ((isH1 || isSeparator) && current.join('\n').trim().length > 0) {
      blocks.push(current.join('\n'))
      current = []
    }

    if (!isSeparator) {
      current.push(line)
    }
  }

  if (current.join('\n').trim().length > 0) {
    blocks.push(current.join('\n'))
  }

  return blocks
}

function extractTitle(md: string): string {
  const match = md.match(/^#\s+(.+)/m)
  return match ? (match[1] ?? '') : ''
}

/**
 * Extract speaker notes from `<!-- notes: ... -->` HTML comments.
 * Supports single-line and multi-line comments.
 * Removes notes comments from markdown body (they won't render on the slide).
 */
function extractNotes(body: string): { notes: string | undefined; cleanBody: string } {
  const noteContents: string[] = []
  const cleanBody = body.replace(/<!--([\s\S]*?)-->/gi, (match, content: string) => {
    const trimmed = content.trim()
    // Detect "notes" or "note" at the start of the comment (case-insensitive)
    if (/^notes?\b/i.test(trimmed)) {
      const noteText = trimmed.replace(/^notes?\s*:?\s*/i, '').trim()
      if (noteText) noteContents.push(noteText)
      return ''
    }
    // Keep non-notes HTML comments (marked will pass them through)
    return match
  })

  const notes = noteContents.length > 0 ? noteContents.join('\n\n') : undefined
  const trimmed = cleanBody.trim()
  return { notes, cleanBody: trimmed || body }
}

function parseBlock(raw: string, index: number): SlideData {
  const { attributes, body } = fm(raw)
  const frontmatter = attributes as SlideFrontmatter
  const { notes, cleanBody } = extractNotes(body)
  const title = extractTitle(cleanBody)
  const html = renderMathInHtml(marked.parse(cleanBody) as string)

  return { index, title, html, frontmatter, rawMarkdown: raw, notes }
}

export function parseMarkdown(rawContent: string): {
  slides: SlideData[]
  meta: PresentationMeta
} {
  const { attributes: globalMeta, body } = fm(rawContent)
  const blocks = splitIntoBlocks(body)
  const slides = blocks.map((block, i) => parseBlock(block, i))

  return { slides, meta: globalMeta as PresentationMeta }
}
