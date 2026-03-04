<template>
  <Teleport to="body">
    <transition name="lightbox">
      <div class="lightbox" v-if="show" @click="close" @touchmove.prevent>
        <img :src="src" :alt="alt" class="lightbox-img" />
        <span class="lightbox-close">&times;</span>
        <span v-if="alt" class="lightbox-alt">{{ alt }}</span>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const show = ref(false)
const src = ref('')
const alt = ref('')

const open = (imgSrc, imgAlt = '') => {
  src.value = imgSrc
  alt.value = imgAlt
  show.value = true
  document.body.style.overflow = 'hidden'
}

const close = () => {
  show.value = false
  document.body.style.overflow = ''
}

onMounted(() => {
  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG' && e.target.closest('.content')) {
      open(e.target.src, e.target.alt)
    }
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && show.value) {
      close()
    }
  })
})
</script>

<style scoped>
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  cursor: zoom-out;
}

.lightbox-img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  border-radius: 4px;
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 30px;
  font-size: 40px;
  color: white;
  cursor: pointer;
}

.lightbox-alt {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 14px;
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.3s;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>