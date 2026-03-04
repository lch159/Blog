<template>
  <transition name="fade">
    <button v-if="show" class="back-to-top" @click="scrollToTop" title="返回顶部">
      ↑
    </button>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const show = ref(false)

const handleScroll = () => {
  show.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 80px;
  right: 30px;
  width: 45px;
  height: 45px;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 1.25rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  transition: transform 0.3s, box-shadow 0.3s;
}

.back-to-top:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>