<template>
  <div class="home">
    <section class="hero">
      <h1>欢迎来到我的博客</h1>
      <p>记录学习笔记，分享技术心得</p>
    </section>

    <section class="recent-posts">
      <h2>最近文章</h2>
      <div class="posts-grid">
        <article class="post-card" v-for="post in recentPosts" :key="post.id">
          <h3>
            <router-link :to="{ name: 'PostDetail', params: { id: post.id } }">
              {{ post.title }}
            </router-link>
          </h3>
          <p class="post-date">{{ post.date }}</p>
          <p class="post-excerpt">{{ post.excerpt }}</p>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { posts } from '../data/posts.js'

const recentPosts = computed(() => posts.value.slice(0, 2))
</script>