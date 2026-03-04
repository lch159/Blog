<template>
  <div class="posts-page">
    <h2>全部文章</h2>

    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="搜索文章..."
        class="search-input"
      />
      <span v-if="searchQuery" class="search-clear" @click="searchQuery = ''">&times;</span>
    </div>

    <div class="page-layout">
      <aside class="sidebar">
        <div class="sidebar-section">
          <h3>最新文章</h3>
          <ul class="sidebar-list">
            <li v-for="post in recentPosts" :key="post.id">
              <router-link :to="{ name: 'PostDetail', params: { id: post.id } }">
                {{ post.title }}
              </router-link>
            </li>
          </ul>
        </div>

        <div class="sidebar-section">
          <h3>标签云</h3>
          <div class="tag-cloud">
            <span
              v-for="tag in allTags"
              :key="tag"
              class="tag-item"
              :class="{ active: selectedTag === tag }"
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </aside>

      <div class="main-content">
        <div class="filter-bar" v-if="selectedTag || searchQuery">
          <span v-if="selectedTag">
            标签: <strong>{{ selectedTag }}</strong>
            <button class="clear-btn" @click="selectedTag = null">&times;</button>
          </span>
          <span v-if="searchQuery" class="search-result">
            搜索: <strong>"{{ searchQuery }}"</strong>
            <button class="clear-btn" @click="searchQuery = ''">&times;</button>
          </span>
        </div>

        <div class="posts-grid">
          <article class="post-card" v-for="post in paginatedPosts" :key="post.id">
            <h3>
              <router-link :to="{ name: 'PostDetail', params: { id: post.id } }">
                {{ post.title }}
              </router-link>
            </h3>
            <p class="post-date">{{ post.date }}</p>
            <div class="tags" v-if="post.tags">
              <span
                v-for="tag in post.tags"
                :key="tag"
                class="tag"
                @click.stop="selectedTag = tag"
              >{{ tag }}</span>
            </div>
            <p class="post-excerpt">{{ post.excerpt }}</p>
          </article>
        </div>

        <div v-if="filteredPosts.length === 0" class="no-posts">
          没有找到匹配的文章
        </div>

        <div v-if="totalPages > 1" class="pagination">
          <button
            class="page-btn"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            上一页
          </button>
          <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
          <button
            class="page-btn"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { posts } from '../data/posts.js'

const selectedTag = ref(null)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 5

// 监听搜索变化，重置页码
watch(searchQuery, () => {
  currentPage.value = 1
})

const allTags = computed(() => {
  const tags = new Set()
  posts.value.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => tags.add(tag))
    }
  })
  return Array.from(tags).sort()
})

const recentPosts = computed(() => {
  return [...posts.value]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)
})

const filteredPosts = computed(() => {
  let result = [...posts.value]

  // 按日期排序（最新在前）
  result.sort((a, b) => b.date.localeCompare(a.date))

  // 标签筛选
  if (selectedTag.value) {
    result = result.filter(post =>
      post.tags && post.tags.includes(selectedTag.value)
    )
  }

  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
    )
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredPosts.value.length / pageSize))

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredPosts.value.slice(start, start + pageSize)
})

// 重置页码当筛选条件变化时
const resetPage = () => {
  currentPage.value = 1
}

const toggleTag = (tag) => {
  selectedTag.value = selectedTag.value === tag ? null : tag
  resetPage()
}
</script>

<style scoped>
.search-bar {
  position: relative;
  margin-bottom: 1.5rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.search-input::placeholder {
  color: var(--text-light);
}

.search-clear {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.25rem;
  color: var(--text-light);
  cursor: pointer;
}

.search-clear:hover {
  color: var(--accent-color);
}

.page-layout {
  display: flex;
  gap: 2rem;
}

.sidebar {
  width: 200px;
  flex-shrink: 0;
}

.sidebar-section {
  background: var(--card-bg);
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  margin-bottom: 1rem;
}

.sidebar-section h3 {
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  color: var(--primary-color);
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--accent-color);
}

.sidebar-list {
  list-style: none;
}

.sidebar-list li {
  margin-bottom: 0.5rem;
}

.sidebar-list a {
  color: var(--text-light);
  text-decoration: none;
  font-size: 0.85rem;
  display: block;
  padding: 0.3rem 0;
  transition: color 0.3s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-list a:hover {
  color: var(--accent-color);
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tag-item {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  background: var(--bg-color);
  border-radius: 12px;
  font-size: 0.75rem;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.3s;
}

.tag-item:hover {
  background: var(--accent-color);
  color: white;
}

.tag-item.active {
  background: var(--accent-color);
  color: white;
}

.main-content {
  flex: 1;
  min-width: 0;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  background: var(--card-bg);
  border-radius: 8px;
}

.filter-bar span {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.clear-btn {
  padding: 0.2rem 0.5rem;
  border: none;
  background: var(--text-light);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  margin-left: 0.5rem;
}

.clear-btn:hover {
  background: var(--accent-color);
}

.posts-grid {
  display: grid;
  gap: 1rem;
}

.post-card {
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s, box-shadow 0.3s;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.post-card h3 {
  margin-bottom: 0.5rem;
}

.post-card h3 a {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.3s;
}

.post-card h3 a:hover {
  color: var(--accent-color);
}

.post-date {
  font-size: 0.875rem;
  color: var(--text-light);
  margin-bottom: 0.75rem;
}

.tags {
  margin-bottom: 0.75rem;
}

.tag {
  display: inline-block;
  background: var(--accent-color);
  color: white;
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  margin-right: 0.4rem;
  opacity: 0.85;
  cursor: pointer;
  transition: opacity 0.3s;
}

.tag:hover {
  opacity: 1;
}

.post-excerpt {
  color: var(--text-light);
}

.no-posts {
  text-align: center;
  padding: 3rem;
  color: var(--text-light);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;
  background: var(--card-bg);
  border-radius: 12px;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--card-bg);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: var(--text-light);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .page-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    order: -1;
  }
}
</style>