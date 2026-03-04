<template>
  <header>
    <nav>
      <router-link to="/" class="logo">🐱 小老弟</router-link>
      <div class="nav-right">
        <ul class="nav-links">
          <li><router-link to="/">首页</router-link></li>
          <li><router-link to="/posts">文章</router-link></li>
          <li><router-link to="/timeline">时间线</router-link></li>
          <li><router-link to="/about">关于</router-link></li>
        </ul>
        <button class="music-toggle" @click="toggleMusic" title="播放音乐">
          {{ isPlaying ? '⏸️' : '🎵' }}
        </button>
        <button class="theme-toggle" @click="toggleTheme" :title="isDark ? '切换亮色' : '切换暗色'">
          {{ isDark ? '☀️' : '🌙' }}
        </button>
      </div>
    </nav>
    <audio ref="audioRef" loop></audio>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isDark = ref(false)
const isPlaying = ref(false)
const audioRef = ref(null)

// 音乐播放
const toggleMusic = () => {
  if (!audioRef.value) return

  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    // 使用免费的 LOFI 音乐
    audioRef.value.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    audioRef.value.volume = 0.3
    audioRef.value.play().catch(() => {
      // 用户交互后才能播放
      alert('点击页面后再次点击播放按钮')
    })
  }
  isPlaying.value = !isPlaying.value
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
})
</script>

<style scoped>
.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.music-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.3rem;
  padding: 0.4rem;
  transition: transform 0.3s ease;
  border-radius: 50%;
}

.music-toggle:hover {
  transform: scale(1.15) rotate(15deg);
  background: var(--bg-color);
}
</style>