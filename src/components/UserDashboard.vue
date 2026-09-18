<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'

const router = useRouter()
const sidebarOpen = ref(false)
const currentTime = ref('')
const currentDate = ref('')
const stats = ref({ claimReviews: 0, lostReports: 0, foundReports: 0 })
const recentActivity = ref([])
let timer

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })
  currentDate.value = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  })
}

const timeAgo = (dateString) => {
  const difference = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)
  if (difference < 60) return `${difference} secs ago`
  if (difference < 3600) return `${Math.floor(difference / 60)} mins ago`
  if (difference < 86400) return `${Math.floor(difference / 3600)} hours ago`
  return `${Math.floor(difference / 86400)} days ago`
}

const loadStats = async () => {
  try {
    const [itemsResponse, claimsResponse] = await Promise.all([
      api.get('/items'),
      api.get('/claims')
    ])
    const items = itemsResponse.data
    const claims = claimsResponse.data
    stats.value = {
      lostReports: items.filter((item) => item.status === 'lost').length,
      foundReports: items.filter((item) => item.status === 'found').length,
      claimReviews: claims.filter((claim) => claim.status === 'under_review').length
    }
  } catch {
    // Keep the dashboard available while the API is unavailable.
  }
}

const loadRecentActivity = async () => {
  try {
    const response = await api.get('/items')
    recentActivity.value = response.data.slice(0, 5).map((item) => ({
      id: item.id,
      name: item.title,
      time: timeAgo(item.created_at),
      status: item.status.charAt(0).toUpperCase() + item.status.slice(1)
    }))
  } catch {
    recentActivity.value = []
  }
}

const toggleSidebar = () => { sidebarOpen.value = !sidebarOpen.value }
const closeSidebar = () => { sidebarOpen.value = false }

const getStatusClass = (status) => {
  switch (status) {
    case 'Found': return 'status-found'
    case 'Lost': return 'status-lost'
    case 'Claim': return 'status-claim'
    default: return ''
  }
}

const reviewItem = (id) => router.push(`/item-details/${id}`)

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  loadStats()
  loadRecentActivity()
})

onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div class="dashboard-wrapper">
    <div v-if="sidebarOpen" class="overlay" @click="closeSidebar"></div>

    <div class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-top">
        <div class="sidebar-brand">
          <div class="sidebar-logo"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="22" height="22"><path d="M20.7 7.04L12 2 3.3 7.04A2 2 0 0 0 2 8.81V20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8.81a2 2 0 0 0-1.3-1.77zM12 4.22l6.5 3.72-2.39 1.37L12 6.2 7.89 9.31 5.5 7.94 12 4.22zM4 20V9.81l7 4.01V20H4zm9 0v-6.18l7-4.01V20h-7z"/></svg></div>
          <div><p class="sidebar-title">LDCU iFound</p><p class="sidebar-sub">Lost &amp; Found System</p></div>
        </div>
        <button class="close-btn" @click="closeSidebar">✕</button>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/dashboard" class="nav-item active"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>Dashboard</router-link>
        <router-link to="/lost-and-found" class="nav-item"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>Lost &amp; Found</router-link>
        <router-link to="/claims" class="nav-item"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1 0 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.5-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/></svg>Claims Management</router-link>
        <router-link to="/history" class="nav-item"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>Claimed History</router-link>
        <router-link to="/messages" class="nav-item"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>Messages</router-link>
        <router-link to="/post-item" class="nav-item"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z"/></svg>Post Item</router-link>
        <router-link to="/profile" class="nav-item"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z"/></svg>My Profile</router-link>
      </nav>

      <div class="sidebar-footer">© 2025 LDCU iFound System</div>
    </div>

    <div class="main">
      <div class="topbar">
        <div class="topbar-left">
          <button class="menu-btn" @click="toggleSidebar"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#333" width="24" height="24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg></button>
          <div class="topbar-brand"><div class="topbar-logo"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="20" height="20"><path d="M20.7 7.04L12 2 3.3 7.04A2 2 0 0 0 2 8.81V20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8.81a2 2 0 0 0-1.3-1.77zM12 4.22l6.5 3.72-2.39 1.37L12 6.2 7.89 9.31 5.5 7.94 12 4.22zM4 20V9.81l7 4.01V20H4zm9 0v-6.18l7-4.01V20h-7z"/></svg></div><div><p class="topbar-name">LDCU iFound</p><p class="topbar-sub">Lost &amp; Found System</p></div></div>
        </div>
        <div class="clock-box"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="18" height="18"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg><div><p class="clock-time">{{ currentTime }}</p><p class="clock-date">{{ currentDate }}</p></div></div>
      </div>

      <div class="content">
        <div class="welcome"><h2>Good Day, Liceans!</h2><p>Welcome to LDCU iFound Lost &amp; Found System</p></div>
        <h3 class="section-title">Pending Reviews</h3>
        <div class="stats-grid">
          <div class="stat-card"><div class="stat-icon yellow"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="28" height="28"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg></div><div><p class="stat-num">{{ stats.claimReviews }}</p><p class="stat-label">Claim Reviews</p></div></div>
          <div class="stat-card"><div class="stat-icon red"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="28" height="28"><path d="M20.7 7.04L12 2 3.3 7.04A2 2 0 0 0 2 8.81V20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8.81a2 2 0 0 0-1.3-1.77zM12 4.22l6.5 3.72-2.39 1.37L12 6.2 7.89 9.31 5.5 7.94 12 4.22zM4 20V9.81l7 4.01V20H4zm9 0v-6.18l7-4.01V20h-7z"/></svg></div><div><p class="stat-num">{{ stats.lostReports }}</p><p class="stat-label">Lost Reports</p></div></div>
          <div class="stat-card"><div class="stat-icon green"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="28" height="28"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></div><div><p class="stat-num">{{ stats.foundReports }}</p><p class="stat-label">Found Reports</p></div></div>
        </div>

        <h3 class="section-title">Recent Activity</h3>
        <div class="table-wrapper"><table><thead><tr><th>Item Name</th><th>Time</th><th>Status</th><th>Action</th></tr></thead><tbody>
          <tr v-for="item in recentActivity" :key="item.id"><td>{{ item.name }}</td><td>{{ item.time }}</td><td><span class="status-badge" :class="getStatusClass(item.status)">{{ item.status }}</span></td><td><button class="review-btn" @click="reviewItem(item.id)">Review</button></td></tr>
        </tbody></table></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* { margin: 0; padding: 0; box-sizing: border-box; }
.dashboard-wrapper { display: flex; min-height: 100vh; font-family: 'Segoe UI', sans-serif; background: #f5f6fa; position: relative; }
.overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 99; }
.sidebar { position: fixed; top: 0; left: -320px; width: 280px; height: 100vh; background: #0d1b2e; display: flex; flex-direction: column; padding: 24px 0; z-index: 100; transition: left 0.3s ease; }
.sidebar.open { left: 0; }
.sidebar-top { display: flex; align-items: center; justify-content: space-between; padding: 0 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 16px; }
.sidebar-brand { display: flex; align-items: center; gap: 12px; }
.sidebar-logo { width: 42px; height: 42px; background: #1a3c8f; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.sidebar-title { font-size: 1rem; font-weight: 700; color: white; }
.sidebar-sub { font-size: 0.75rem; color: rgba(255,255,255,0.5); }
.close-btn { background: none; border: none; color: rgba(255,255,255,0.6); font-size: 1.1rem; cursor: pointer; padding: 4px; }
.close-btn:hover { color: white; }
.sidebar-nav { display: flex; flex-direction: column; gap: 4px; padding: 0 12px; flex: 1; }
.nav-item { display: flex; align-items: center; gap: 14px; padding: 12px 16px; border-radius: 10px; color: rgba(255,255,255,0.65); text-decoration: none; font-size: 0.95rem; font-weight: 500; transition: all 0.2s; }
.nav-item span { width: 20px; text-align: center; font-size: 1.15rem; }
.nav-item:hover { background: rgba(255,255,255,0.08); color: white; }
.nav-item.active { background: #1a3c8f; color: white; }
.sidebar-footer { padding: 16px 20px 0; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.75rem; color: rgba(255,255,255,0.35); text-align: center; }
.main { flex: 1; display: flex; flex-direction: column; min-height: 100vh; }
.topbar { background: white; padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e8eaed; position: sticky; top: 0; z-index: 10; }
.topbar-left { display: flex; align-items: center; gap: 16px; }
.menu-btn { background: none; border: none; cursor: pointer; padding: 6px; border-radius: 8px; display: flex; align-items: center; }
.menu-btn:hover { background: #f0f0f0; }
.topbar-brand { display: flex; align-items: center; gap: 10px; }
.topbar-logo { width: 38px; height: 38px; background: #1a3c8f; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.3rem; }
.topbar-name { font-size: 0.95rem; font-weight: 700; color: #111; }
.topbar-sub { font-size: 0.72rem; color: #888; }
.clock-box { display: flex; align-items: center; gap: 10px; background: #1a3c8f; color: white; padding: 10px 18px; border-radius: 12px; }
.clock-box > span { font-size: 1.3rem; }
.clock-time { font-size: 1rem; font-weight: 700; line-height: 1.2; }
.clock-date { font-size: 0.72rem; color: rgba(255,255,255,0.75); }
.content { padding: 28px 28px; flex: 1; }
.welcome { margin-bottom: 28px; }
.welcome h2 { font-size: 1.6rem; font-weight: 700; color: #111; margin-bottom: 4px; }
.welcome p { font-size: 0.9rem; color: #666; }
.section-title { font-size: 1.05rem; font-weight: 700; color: #111; margin-bottom: 16px; }
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
.stat-card { background: white; border-radius: 14px; padding: 20px 24px; display: flex; align-items: center; gap: 18px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.stat-icon { width: 60px; height: 60px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: white; font-size: 1.8rem; font-weight: 700; }
.stat-icon.yellow { background: #f59e0b; }
.stat-icon.red { background: #ef4444; }
.stat-icon.green { background: #22c55e; }
.stat-num { font-size: 1.8rem; font-weight: 700; color: #111; line-height: 1; margin-bottom: 4px; }
.stat-label { font-size: 0.88rem; color: #666; }
.table-wrapper { background: white; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
table { width: 100%; border-collapse: collapse; }
thead tr { background: #0d1b2e; }
thead th { padding: 14px 20px; text-align: left; font-size: 0.88rem; font-weight: 600; color: white; }
tbody tr { border-bottom: 1px solid #f0f0f0; }
tbody tr:last-child { border-bottom: none; }
tbody tr:hover { background: #fafafa; }
tbody td { padding: 14px 20px; font-size: 0.9rem; color: #333; }
.status-badge { padding: 4px 14px; border-radius: 20px; font-size: 0.82rem; font-weight: 600; }
.status-found { background: #dcfce7; color: #16a34a; }
.status-lost { background: #fee2e2; color: #dc2626; }
.status-claim { background: #fef9c3; color: #ca8a04; }
.review-btn { background: #1a3c8f; color: white; border: none; padding: 8px 20px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.review-btn:hover { background: #14317a; }
@media (max-width: 768px) { .stats-grid { grid-template-columns: 1fr; } .content { padding: 20px 16px; } .topbar { padding: 12px 16px; } .clock-box { padding: 8px 12px; } }
</style>