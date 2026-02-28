<template>
  <NavBar />
  <main>
    <router-view />
  </main>
  <footer>
    <p>&copy; 2026 小老弟的博客. Built with ❤️</p>
  </footer>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
</script>