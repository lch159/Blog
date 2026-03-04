<template>
  <div class="timeline-page">
    <h2>时间线</h2>

    <div class="timeline">
      <div class="timeline-item" v-for="(group, date) in timelineGroups" :key="date">
        <div class="timeline-date">{{ date }}</div>
        <div class="timeline-content">
          <article class="post-card" v-for="post in group" :key="post.id">
            <h3>
              <router-link :to="{ name: 'PostDetail', params: { id: post.id } }">
                {{ post.title }}
              </router-link>
            </h3>
            <p class="post-date">{{ post.date }}</p>
            <div class="tags" v-if="post.tags">
              <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <p class="post-excerpt">{{ post.excerpt }}</p>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { posts } from '../data/posts.js'

const timelineGroups = computed(() => {
  const groups = {}
  const sortedPosts = [...posts.value].sort((a, b) => b.date.localeCompare(a.date))

  sortedPosts.forEach(post => {
    const yearMonth = post.date.substring(0, 7) // YYYY-MM
    if (!groups[yearMonth]) {
      groups[yearMonth] = []
    }
    groups[yearMonth].push(post)
  })

  return groups
})
</script>

<style scoped>
.timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--accent-color);
  border-radius: 2px;
}

.timeline-item {
  position: relative;
  margin-bottom: 2rem;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -2rem;
  top: 0.5rem;
  width: 12px;
  height: 12px;
  background: var(--accent-color);
  border-radius: 50%;
  transform: translateX(-4.5px);
}

.timeline-date {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--accent-color);
  margin-bottom: 1rem;
}

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-card {
  background: var(--card-bg);
  padding: 1.25rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s, box-shadow 0.3s;
}

.post-card:hover {
  transform: translateX(8px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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
  margin-bottom: 0.5rem;
}

.tags {
  margin-bottom: 0.5rem;
}

.tag {
  display: inline-block;
  background: var(--accent-color);
  color: white;
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  margin-right: 0.4rem;
}

.post-excerpt {
  color: var(--text-light);
  font-size: 0.9rem;
}
</style>