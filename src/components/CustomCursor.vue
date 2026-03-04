<template>
  <div
    class="custom-cursor"
    :class="{ 'cursor-hover': isHovering, 'cursor-hidden': hideCursor }"
    :style="{ left: x + 'px', top: y + 'px' }"
  ></div>
  <div
    class="cursor-dot"
    :style="{ left: x + 'px', top: y + 'px' }"
  ></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)
const isHovering = ref(false)
const hideCursor = ref(false)

const handleMouseMove = (e) => {
  x.value = e.clientX
  y.value = e.clientY
}

const handleMouseOver = (e) => {
  const target = e.target
  if (target.tagName === 'A' || target.tagName === 'BUTTON' ||
      target.closest('a') || target.closest('button') ||
      target.classList.contains('tag') || target.classList.contains('tag-item')) {
    isHovering.value = true
  }
}

const handleMouseOut = () => {
  isHovering.value = false
}

const handleMouseDown = () => {
  hideCursor.value = true
}

const handleMouseUp = () => {
  hideCursor.value = false
}

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseover', handleMouseOver)
  document.addEventListener('mouseout', handleMouseOut)
  document.addEventListener('mousedown', handleMouseDown)
  document.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseover', handleMouseOver)
  document.removeEventListener('mouseout', handleMouseOut)
  document.removeEventListener('mousedown', handleMouseDown)
  document.removeEventListener('mouseup', handleMouseUp)
})
</script>

<style scoped>
.custom-cursor {
  position: fixed;
  width: 40px;
  height: 40px;
  border: 2px solid #e94560;
  border-radius: 50%;
  pointer-events: none;
  z-index: 99999;
  transform: translate(-50%, -50%);
  transition: width 0.2s, height 0.2s, background 0.2s;
  mix-blend-mode: difference;
}

.custom-cursor.cursor-hover {
  width: 60px;
  height: 60px;
  background: rgba(233, 69, 96, 0.2);
}

.custom-cursor.cursor-hidden {
  opacity: 0;
}

.cursor-dot {
  position: fixed;
  width: 8px;
  height: 8px;
  background: #e94560;
  border-radius: 50%;
  pointer-events: none;
  z-index: 99999;
  transform: translate(-50%, -50%);
}

@media (max-width: 768px) {
  .custom-cursor,
  .cursor-dot {
    display: none;
  }
}
</style>