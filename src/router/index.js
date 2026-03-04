import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Posts from '../views/Posts.vue'
import About from '../views/About.vue'
import Timeline from '../views/Timeline.vue'
import PostDetail from '../views/PostDetail.vue'
import { ref } from 'vue'

export const isLoading = ref(false)

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/posts', name: 'Posts', component: Posts },
  { path: '/timeline', name: 'Timeline', component: Timeline },
  { path: '/about', name: 'About', component: About },
  { path: '/post/:id', name: 'PostDetail', component: PostDetail, props: true }
]

const router = createRouter({
  history: createWebHashHistory('/Blog/'),
  routes
})

router.beforeEach((to, from, next) => {
  isLoading.value = true
  next()
})

router.afterEach(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 300)
})

export default router