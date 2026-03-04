<template>
  <div class="post-detail" v-if="post">
    <nav class="post-nav">
      <router-link to="/posts" class="back-btn">← 返回文章列表</router-link>
    </nav>

    <div class="post-container">
      <aside class="toc" v-if="headings.length > 0">
        <h3>目录</h3>
        <ul>
          <li v-for="(heading, index) in headings" :key="index">
            <a :href="`#heading-${index}`" @click.prevent="scrollToHeading(index)">
              {{ heading }}
            </a>
          </li>
        </ul>
      </aside>

      <article class="post-content">
        <h1>{{ post.title }}</h1>
        <p class="meta">
          发布于 {{ post.date }}
          <span v-if="post.updated" class="updated"> · 更新于 {{ post.updated }}</span>
          <span class="views">👁️ {{ viewCount }} 次阅读</span>
          <span v-if="post.tags" class="tags">
            <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
          </span>
        </p>
        <div class="content" v-html="renderedContent"></div>

        <div class="post-footer">
          <div class="nav-buttons">
            <router-link v-if="prevPost" :to="{ name: 'PostDetail', params: { id: prevPost.id } }" class="nav-btn prev">
              ← {{ prevPost.title }}
            </router-link>
            <span v-else></span>
            <router-link v-if="nextPost" :to="{ name: 'PostDetail', params: { id: nextPost.id } }" class="nav-btn next">
              {{ nextPost.title }} →
            </router-link>
          </div>
        </div>
      </article>
    </div>
  </div>
  <div v-else class="not-found">
    <p>文章不存在</p>
    <router-link to="/posts">返回文章列表</router-link>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted } from 'vue'
import { posts } from '../data/posts.js'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import 'highlight.js/styles/github.css'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('css', css)
hljs.registerLanguage('html', xml)

const props = defineProps({
  id: String
})

const post = computed(() => posts.value.find(p => p.id === props.id))

const currentIndex = computed(() => {
  return posts.value.findIndex(p => p.id === props.id)
})

const prevPost = computed(() => {
  if (currentIndex.value < posts.value.length - 1) {
    return posts.value[currentIndex.value + 1]
  }
  return null
})

const nextPost = computed(() => {
  if (currentIndex.value > 0) {
    return posts.value[currentIndex.value - 1]
  }
  return null
})

const headings = computed(() => {
  if (!post.value) return []
  const matches = post.value.content.match(/^## (.+)$/gm)
  if (!matches) return []
  return matches.map(m => m.replace('## ', ''))
})

const renderedContent = computed(() => {
  if (!post.value) return ''
  let index = 0

  let content = post.value.content
    .replace(/^## (.+)$/gm, (_, title) => {
      return `<h2 id="heading-${index++}">${title}</h2>`
    })
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      const language = lang || 'javascript'
      try {
        const highlighted = hljs.highlight(code.trim(), { language }).value
        return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`
      } catch (e) {
        return `<pre><code>${code.trim()}</code></pre>`
      }
    })
    .replace(/`([^`]+)`/g, '<code class="inline">$1</code>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')

  return content
})

const scrollToHeading = (index) => {
  nextTick(() => {
    const element = document.getElementById(`heading-${index}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

// 阅读量统计
const viewCount = computed(() => {
  const key = `blog_views_${props.id}`
  const views = localStorage.getItem(key)
  return views ? parseInt(views) : 0
})

// 增加阅读量
onMounted(() => {
  const key = `blog_views_${props.id}`
  const currentViews = parseInt(localStorage.getItem(key) || '0')
  localStorage.setItem(key, (currentViews + 1).toString())
})
</script>

<style scoped>
.post-nav {
  margin-bottom: 1rem;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-light);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s;
}

.back-btn:hover {
  color: var(--accent-color);
}

.post-container {
  display: flex;
  gap: 2rem;
}

.toc {
  position: sticky;
  top: 100px;
  width: 180px;
  flex-shrink: 0;
  background: var(--card-bg);
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  height: fit-content;
  max-height: calc(100vh - 180px);
  overflow-y: auto;
}

.toc h3 {
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  color: var(--primary-color);
  font-weight: 600;
}

.toc ul {
  list-style: none;
}

.toc li {
  margin-bottom: 0.4rem;
}

.toc a {
  color: var(--text-light);
  font-size: 0.8rem;
  text-decoration: none;
  transition: color 0.3s;
  display: block;
  padding: 0.2rem 0;
}

.toc a:hover {
  color: var(--accent-color);
}

.post-content {
  flex: 1;
  min-width: 0;
}

.post-content h1 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.post-content .meta {
  color: var(--text-light);
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.9rem;
}

.post-content .meta .updated {
  color: var(--accent-color);
  font-weight: 500;
}

.post-content .content {
  line-height: 1.8;
  color: var(--text-color);
}

.post-content .content :deep(h2) {
  font-size: 1.3rem;
  margin: 2rem 0 1rem;
  padding-top: 1rem;
  color: var(--primary-color);
}

.post-content .content :deep(h1) {
  font-size: 1.6rem;
  margin: 2rem 0 1rem;
  color: var(--primary-color);
}

.post-content .content :deep(p) {
  margin-bottom: 1rem;
}

.post-content .content :deep(ul) {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.post-content .content :deep(li) {
  margin-bottom: 0.5rem;
}

.post-content .content :deep(code) {
  background: var(--bg-color);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'Consolas', monospace;
  font-size: 0.9em;
}

.post-footer {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.nav-buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.nav-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  background: var(--card-bg);
  border-radius: 8px;
  text-decoration: none;
  color: var(--text-color);
  font-size: 0.9rem;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.nav-btn:hover {
  background: var(--accent-color);
  color: white;
}

.nav-btn.prev {
  text-align: left;
}

.nav-btn.next {
  text-align: right;
}

.not-found {
  text-align: center;
  padding: 3rem;
}

.not-found a {
  color: var(--accent-color);
}

@media (max-width: 768px) {
  .post-container {
    flex-direction: column;
  }

  .toc {
    position: static;
    width: 100%;
    order: -1;
    max-height: none;
  }

  .nav-buttons {
    flex-direction: column;
  }
}
</style>