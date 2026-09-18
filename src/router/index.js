import { createRouter, createWebHistory } from 'vue-router'
import ClaimedHistory from '../components/ClaimedHistory.vue'
import ClaimsManagement from '../components/ClaimsManagement.vue'
import LostAndFound from '../components/LostAndFound.vue'
import Messages from '../components/Messages.vue'
import MyProfile from '../components/MyProfile.vue'
import PostItem from '../components/PostItem.vue'
import UserDashboard from '../components/UserDashboard.vue'
import UserLogin from '../components/UserLogin.vue'
import UserRegister from '../components/UserRegister.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: UserLogin },
  { path: '/register', component: UserRegister },
  { path: '/dashboard', component: UserDashboard },
  { path: '/lost-and-found', component: LostAndFound },
  { path: '/claims', component: ClaimsManagement },
  { path: '/history', component: ClaimedHistory },
  { path: '/profile', component: MyProfile },
  { path: '/messages', component: Messages },
  { path: '/post-item', component: PostItem }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router