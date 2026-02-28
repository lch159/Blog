<template>
  <div class="post-detail">
    <article class="post-content" v-if="post">
      <h1>{{ post.title }}</h1>
      <p class="meta">发布于 {{ post.date }}</p>
      <div class="content" v-html="renderedContent"></div>
    </article>
    <div v-else>
      <p>文章不存在</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { posts } from '../data/posts.js'

const props = defineProps({
  id: String
})

const post = computed(() => posts.value.find(p => p.id === props.id))

const renderedContent = computed(() => {
  if (!post.value) return ''
  return post.value.content
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h2>$1</h2>')
    .replace(/\n\n/g, '</p><p>')
})
</script>