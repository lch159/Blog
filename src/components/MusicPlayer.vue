<template>
  <div class="music-player" :class="{ collapsed: isCollapsed }">
    <button class="toggle-btn" @click="togglePlayer">
      <span v-if="isCollapsed">🎵</span>
      <span v-else>✕</span>
    </button>

    <div class="player-content" v-show="!isCollapsed">
      <div class="player-header">
        <span class="music-icon">🎧</span>
        <span class="player-title">BGM</span>
      </div>

      <div class="track-info">
        <div class="track-name">{{ currentTrack.name }}</div>
        <div class="track-artist">{{ currentTrack.artist }}</div>
      </div>

      <div class="progress-bar" @click="seekTo">
        <div class="progress" :style="{ width: progressPercent + '%' }"></div>
      </div>

      <div class="time-display">
        <span>{{ formatTime(currentTime) }}</span>
        <span>{{ formatTime(duration) }}</span>
      </div>

      <div class="controls">
        <button class="control-btn" @click="prevTrack">⏮</button>
        <button class="control-btn play-btn" @click="togglePlay">
          {{ isPlaying ? '⏸' : '▶' }}
        </button>
        <button class="control-btn" @click="nextTrack">⏭</button>
      </div>

      <div class="volume-control">
        <span>🔊</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          v-model="volume"
          @input="updateVolume"
        />
      </div>

      <div class="track-list">
        <div
          v-for="(track, index) in tracks"
          :key="index"
          class="track-item"
          :class="{ active: currentTrackIndex === index }"
          @click="playTrack(index)"
        >
          {{ track.name }}
        </div>
      </div>
    </div>

    <audio ref="audioRef" @timeupdate="onTimeUpdate" @ended="onEnded" @loadedmetadata="onLoaded"></audio>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const audioRef = ref(null)
const isCollapsed = ref(true)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.5)
const currentTrackIndex = ref(0)

// 免费 LO-FI 音乐 (使用预定义的音乐 URL)
const tracks = ref([
  {
    name: 'Lo-Fi Chill',
    artist: 'Free Sound',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    name: 'Relaxing Beat',
    artist: 'Free Sound',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    name: 'Peaceful Piano',
    artist: 'Free Sound',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  }
])

const currentTrack = computed(() => tracks.value[currentTrackIndex.value])

const progressPercent = computed(() => {
  if (!duration.value) return 0
  return (currentTime.value / duration.value) * 100
})

const togglePlayer = () => {
  isCollapsed.value = !isCollapsed.value
}

const togglePlay = () => {
  if (isPlaying.value) {
    audioRef.value?.pause()
  } else {
    audioRef.value?.play()
  }
  isPlaying.value = !isPlaying.value
}

const playTrack = (index) => {
  currentTrackIndex.value = index
  audioRef.value.src = tracks.value[index].url
  audioRef.value.volume = volume.value
  audioRef.value.play()
  isPlaying.value = true
}

const prevTrack = () => {
  let newIndex = currentTrackIndex.value - 1
  if (newIndex < 0) newIndex = tracks.value.length - 1
  playTrack(newIndex)
}

const nextTrack = () => {
  let newIndex = currentTrackIndex.value + 1
  if (newIndex >= tracks.value.length) newIndex = 0
  playTrack(newIndex)
}

const seekTo = (e) => {
  const rect = e.target.getBoundingClientRect()
  const percent = (e.clientX - rect.left) / rect.width
  audioRef.value.currentTime = percent * duration.value
}

const updateVolume = () => {
  audioRef.value.volume = volume.value
}

const onTimeUpdate = () => {
  currentTime.value = audioRef.value?.currentTime || 0
}

const onLoaded = () => {
  duration.value = audioRef.value?.duration || 0
}

const onEnded = () => {
  nextTrack()
}

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 自动播放第一首（需要用户交互后才能播放）
onMounted(() => {
  if (audioRef.value) {
    audioRef.value.volume = volume.value
  }
})

watch(currentTrack, (newTrack) => {
  if (audioRef.value) {
    audioRef.value.src = newTrack.url
  }
})
</script>

<style scoped>
.music-player {
  position: fixed;
  left: 20px;
  bottom: 140px;
  z-index: 9999;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.music-player.collapsed {
  left: 20px;
  bottom: 140px;
}

.toggle-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid #ffdd00;
  background: #000000;
  color: #ffdd00;
  font-size: 1.8rem;
  cursor: pointer;
  box-shadow: 0 0 25px rgba(255, 221, 0, 0.6), 0 4px 15px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

[data-theme="light"] .toggle-btn {
  background: #ffffff;
  border-color: #ff9500;
  color: #ff9500;
  box-shadow: 0 0 25px rgba(255, 149, 0, 0.4), 0 4px 15px rgba(0, 0, 0, 0.15);
}

.toggle-btn:hover {
  transform: scale(1.1) rotate(10deg);
}

.player-content {
  position: absolute;
  bottom: 60px;
  left: 0;
  width: 260px;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

[data-theme="light"] .player-content {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.player-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.music-icon {
  font-size: 1.5rem;
}

.player-title {
  font-weight: 700;
  color: #e94560;
  font-size: 1rem;
}

.track-info {
  text-align: center;
  margin-bottom: 1rem;
}

.track-name {
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

[data-theme="light"] .track-name {
  color: #1a1a2e;
}

.track-artist {
  color: #9ca3af;
  font-size: 0.8rem;
}

.progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  cursor: pointer;
  margin-bottom: 0.5rem;
}

[data-theme="light"] .progress-bar {
  background: #e5e0db;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #e94560, #4ecdc4);
  border-radius: 2px;
  transition: width 0.1s;
}

.time-display {
  display: flex;
  justify-content: space-between;
  color: #9ca3af;
  font-size: 0.75rem;
  margin-bottom: 1rem;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.control-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

[data-theme="light"] .control-btn {
  background: #f0ebe3;
  color: #1a1a2e;
}

.control-btn:hover {
  background: #e94560;
  transform: scale(1.1);
}

.play-btn {
  width: 50px;
  height: 50px;
  font-size: 1.25rem;
  background: linear-gradient(135deg, #e94560, #0f3460);
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.volume-control input {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  outline: none;
}

[data-theme="light"] .volume-control input {
  background: #e5e0db;
}

.volume-control input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #e94560;
  cursor: pointer;
}

.track-list {
  max-height: 120px;
  overflow-y: auto;
}

.track-item {
  padding: 0.5rem;
  color: #9ca3af;
  font-size: 0.8rem;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

[data-theme="light"] .track-item {
  color: #6b7280;
}

.track-item:hover {
  background: rgba(233, 69, 96, 0.2);
  color: white;
}

[data-theme="light"] .track-item:hover {
  background: #f0ebe3;
  color: #1a1a2e;
}

.track-item.active {
  color: #e94560;
  background: rgba(233, 69, 96, 0.15);
}

@media (max-width: 768px) {
  .music-player {
    left: 10px;
    bottom: 80px;
  }

  .player-content {
    width: 220px;
    padding: 1rem;
  }
}
</style>