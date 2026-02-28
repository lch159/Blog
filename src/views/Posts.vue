<template>
  <div class="posts-page">
    <h2>全部文章</h2>
    <div class="posts-grid">
      <article class="post-card" v-for="post in posts" :key="post.id">
        <h3>
          <router-link :to="{ name: 'PostDetail', params: { id: post.id } }">
            {{ post.title }}
          </router-link>
        </h3>
        <p class="post-date">{{ post.date }}</p>
        <p class="post-excerpt">{{ post.excerpt }}</p>
      </article>
    </div>
  </div>
</template>

<script setup>
import { posts } from '../data/posts.js'
</script>