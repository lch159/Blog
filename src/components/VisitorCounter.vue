<template>
  <div class="visitor-counter" :class="{ expanded: isExpanded }">
    <button class="counter-toggle" @click="toggleCounter">
      <span class="counter-icon">👁️</span>
      <span class="counter-value">{{ visitorCount }}</span>
    </button>

    <div class="counter-content" v-show="isExpanded">
      <div class="counter-title">访问人数</div>
      <div class="counter-stats">
        <div class="stat-item">
          <span class="stat-label">今日访问</span>
          <span class="stat-num">{{ todayVisitors }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">本周访问</span>
          <span class="stat-num">{{ weekVisitors }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">本月访问</span>
          <span class="stat-num">{{ monthVisitors }}</span>
        </div>
      </div>
      <div class="online-users">
        <span class="online-dot"></span>
        <span>当前 {{ onlineCount }} 人在线</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isExpanded = ref(false)
const visitorCount = ref(0)
const todayVisitors = ref(0)
const weekVisitors = ref(0)
const monthVisitors = ref(0)
const onlineCount = ref(1)

const toggleCounter = () => {
  isExpanded.value = !isExpanded.value
}

// 模拟访问数据（实际可以用 localStorage 或后端）
const initCounter = () => {
  const today = new Date().toDateString()

  // 读取存储的数据
  const stored = localStorage.getItem('blog_visitor')
  let data = stored ? JSON.parse(stored) : {
    total: 0,
    lastVisit: null,
    today: 0,
    todayDate: today,
    week: 0,
    weekStart: getWeekStart(),
    month: 0,
    monthStart: getMonthStart()
  }

  // 检查是否是本周/本月
  const currentWeekStart = getWeekStart()
  const currentMonthStart = getMonthStart()

  if (data.weekStart !== currentWeekStart) {
    data.week = 0
    data.weekStart = currentWeekStart
  }

  if (data.monthStart !== currentMonthStart) {
    data.month = 0
    data.monthStart = currentMonthStart
  }

  // 检查是否是今天
  if (data.todayDate !== today) {
    data.today = 0
    data.todayDate = today
  }

  // 增加访问次数
  data.total++
  data.today++
  data.week++
  data.month++
  data.lastVisit = new Date().toISOString()

  // 保存
  localStorage.setItem('blog_visitor', JSON.stringify(data))

  // 更新显示
  visitorCount.value = data.total
  todayVisitors.value = data.today
  weekVisitors.value = data.week
  monthVisitors.value = data.month

  // 模拟在线人数（随机 1-5 人）
  onlineCount.value = Math.floor(Math.random() * 5) + 1
}

const getWeekStart = () => {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(now.setDate(diff)).toDateString()
}

const getMonthStart = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1).toDateString()
}

onMounted(() => {
  initCounter()
})
</script>

<style scoped>
.visitor-counter {
  position: fixed;
  right: 20px;
  bottom: 140px;
  z-index: 9998;
}

.counter-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: rgba(26, 26, 46, 0.9);
  backdrop-filter: blur(10px);
  border: 2px solid #4ecdc4;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
}

[data-theme="light"] .counter-toggle {
  background: rgba(255, 255, 255, 0.95);
  color: #1a1a2e;
}

.counter-toggle:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 20px rgba(78, 205, 196, 0.4);
}

.counter-icon {
  font-size: 1.2rem;
}

.counter-value {
  font-weight: 700;
  font-size: 1rem;
  color: #4ecdc4;
}

.counter-content {
  position: absolute;
  bottom: 60px;
  right: 0;
  width: 220px;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

[data-theme="light"] .counter-content {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.counter-title {
  text-align: center;
  font-weight: 700;
  color: #4ecdc4;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.counter-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  color: #9ca3af;
  font-size: 0.8rem;
}

[data-theme="light"] .stat-label {
  color: #6b7280;
}

.stat-num {
  color: white;
  font-weight: 700;
  font-size: 1rem;
}

[data-theme="light"] .stat-num {
  color: #1a1a2e;
}

.online-users {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #9ca3af;
  font-size: 0.8rem;
}

[data-theme="light"] .online-users {
  border-top-color: rgba(0, 0, 0, 0.1);
  color: #6b7280;
}

.online-dot {
  width: 8px;
  height: 8px;
  background: #4ecdc4;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@media (max-width: 768px) {
  .visitor-counter {
    right: 10px;
    bottom: 80px;
  }
}
</style>