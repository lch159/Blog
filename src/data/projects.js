import { ref } from 'vue'

export const projects = ref([
  {
    id: 'blog-vue',
    title: '小老弟的博客',
    description: '基于 Vue 3 + Vite 的个人博客，包含黑暗模式、标签筛选、时间线等功能。',
    tech: ['Vue 3', 'Vite', 'Vue Router'],
    link: 'https://lch159.github.io/Blog/',
    icon: '📝'
  },
  {
    id: 'tetris',
    title: '俄罗斯方块',
    description: '使用原生 JavaScript 实现的经典俄罗斯方块游戏。',
    tech: ['JavaScript', 'HTML5', 'CSS3'],
    link: '/tetris.html',
    icon: '🧱'
  },
  {
    id: 'tank-battle',
    title: '坦克大战',
    description: '经典坦克大战游戏，支持双人模式。',
    tech: ['JavaScript', 'Canvas', 'HTML5'],
    link: '/tank-battle.html',
    icon: '🚜'
  },
  {
    id: 'visual-show',
    title: '视觉展示',
    description: '一些有趣的视觉效果展示。',
    tech: ['CSS3', 'JavaScript'],
    link: '/visual-show/',
    icon: '✨'
  }
])