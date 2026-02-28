import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Posts from '../views/Posts.vue'
import About from '../views/About.vue'
import PostDetail from '../views/PostDetail.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/posts', name: 'Posts', component: Posts },
  { path: '/about', name: 'About', component: About },
  { path: '/post/:id', name: 'PostDetail', component: PostDetail, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router