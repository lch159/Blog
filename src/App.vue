<template>
  <div class="bg-particles" ref="canvasContainer">
    <canvas ref="canvas"></canvas>
  </div>
  <div class="bg-gradient"></div>
  <NavBar />
  <main>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
  <footer>
    <p>&copy; 2026 小老弟的博客. Built with ❤️</p>
    <p class="last-update">最后更新: {{ lastUpdate }}</p>
  </footer>
  <ImageLightbox />
  <BackToTop />
  <Loading v-if="loading" />
  <!-- <MusicPlayer /> -->
  <VisitorCounter />
  <CustomCursor />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import NavBar from './components/NavBar.vue'
import ImageLightbox from './components/ImageLightbox.vue'
import BackToTop from './components/BackToTop.vue'
import Loading from './components/Loading.vue'
import MusicPlayer from './components/MusicPlayer.vue'
import CustomCursor from './components/CustomCursor.vue'
import VisitorCounter from './components/VisitorCounter.vue'
import { isLoading } from './router'
const loading = isLoading

// 网站最后更新时间
const lastUpdate = computed(() => {
  return '2026-03-04'
})
const canvas = ref(null)

onMounted(() => {
  const c = canvas.value
  const ctx = c.getContext('2d')
  let particles = []
  let mouse = { x: null, y: null }

  const resize = () => {
    c.width = window.innerWidth
    c.height = window.innerHeight
  }

  // Color palette - more vibrant
  const colors = ['#e94560', '#0f3460', '#4ecdc4', '#ff6b6b', '#ffd93d', '#6c5ce7']

  const createParticles = () => {
    particles = []
    const count = Math.floor((c.width * c.height) / 12000)
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * c.width,
        y: Math.random() * c.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI * 2
      })
    }
  }

  // Mouse interaction
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
  })

  window.addEventListener('mouseout', () => {
    mouse.x = null
    mouse.y = null
  })

  const draw = () => {
    // 清除画布，完全透明，不留拖尾
    ctx.clearRect(0, 0, c.width, c.height)

    const time = Date.now() * 0.001

    particles.forEach((p, i) => {
      // Pulsing size
      const pulseSize = p.size + Math.sin(time * 2 + p.pulse) * 0.5

      p.x += p.vx
      p.y += p.vy

      // Bounce off edges
      if (p.x < 0 || p.x > c.width) p.vx *= -1
      if (p.y < 0 || p.y > c.height) p.vy *= -1

      // Mouse interaction - particles flee from mouse
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 150) {
          const force = (150 - dist) / 150
          p.vx -= (dx / dist) * force * 0.5
          p.vy -= (dy / dist) * force * 0.5
        }
      }

      // Limit velocity
      const maxV = 2
      p.vx = Math.max(-maxV, Math.min(maxV, p.vx))
      p.vy = Math.max(-maxV, Math.min(maxV, p.vy))

      // Draw particle with glow
      ctx.beginPath()
      ctx.arc(p.x, p.y, pulseSize, 0, Math.PI * 2)
      ctx.fillStyle = p.color
      ctx.shadowBlur = 15
      ctx.shadowColor = p.color
      ctx.globalAlpha = p.alpha
      ctx.fill()
      ctx.shadowBlur = 0
      ctx.globalAlpha = 1

      // Connect particles - closer connections with mouse
      particles.slice(i + 1).forEach(p2 => {
        const dx = p.x - p2.x
        const dy = p.y - p2.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 120) {
          const opacity = (1 - dist / 120) * 0.4
          const gradient = ctx.createLinearGradient(p.x, p.y, p2.x, p2.y)
          gradient.addColorStop(0, p.color + Math.floor(opacity * 255).toString(16).padStart(2, '0'))
          gradient.addColorStop(1, p2.color + Math.floor(opacity * 255).toString(16).padStart(2, '0'))
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = gradient
          ctx.lineWidth = 1
          ctx.stroke()
        }
      })

      // Mouse connection
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 150) {
          const opacity = (1 - dist / 150) * 0.6
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
          ctx.lineWidth = 1.5
          ctx.stroke()
        }
      }
    })

    requestAnimationFrame(draw)
  }

  resize()
  createParticles()
  draw()

  window.addEventListener('resize', () => {
    resize()
    createParticles()
  })
})
</script>

<style>
.bg-particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
  pointer-events: none;
}

.bg-particles canvas {
  width: 100%;
  height: 100%;
}

.bg-gradient {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -3;
  background: #000000;
}

[data-theme="light"] .bg-gradient {
  background: linear-gradient(135deg, #faf8f5 0%, #f0ebe3 50%, #faf8f5 100%);
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Header glassmorphism - enhanced */
header {
  background: rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(20px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3) !important;
}

[data-theme="dark"] header {
  background: rgba(13, 13, 13, 0.8) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}
</style>