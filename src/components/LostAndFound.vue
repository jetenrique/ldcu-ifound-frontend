<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import api from '../api'

const activeTab = ref('lost')
const searchQuery = ref('')
const sidebarOpen = ref(false)
const showReportModal = ref(false)
const showReportSuccess = ref(false)
const reportReason = ref('')
const reportDetails = ref('')
const selectedItem = ref(null)
const allItems = ref([])
const isLoading = ref(false)

const filteredItems = computed(() => allItems.value.filter((item) => {
  const matchesTab = item.status === activeTab.value
  const query = searchQuery.value.toLowerCase()
  return matchesTab && (!query || item.title?.toLowerCase().includes(query))
}))

const loadItems = async () => {
  isLoading.value = true
  try { allItems.value = (await api.get('/items')).data } catch { allItems.value = [] } finally { isLoading.value = false }
}
const openReport = (item) => { selectedItem.value = item; reportReason.value = ''; reportDetails.value = ''; showReportModal.value = true }
const closeReport = () => { showReportModal.value = false }
const submitReport = () => { showReportModal.value = false; showReportSuccess.value = true }
const closeSuccess = () => { showReportSuccess.value = false }
onMounted(loadItems)
</script>

<template>
  <div class="lf-wrapper">
    <div v-if="sidebarOpen" class="overlay" @click="sidebarOpen = false"></div>
    <div class="sidebar" :class="{ open: sidebarOpen }"><div class="sidebar-top"><div class="sidebar-brand"><div class="sidebar-logo">⌂</div><div><p class="sidebar-title">LDCU iFound</p><p class="sidebar-sub">Lost &amp; Found System</p></div></div><button class="close-btn" @click="sidebarOpen = false">✕</button></div><nav class="sidebar-nav">
      <RouterLink to="/dashboard" class="nav-item">Dashboard</RouterLink><RouterLink to="/lost-and-found" class="nav-item active">Lost &amp; Found</RouterLink><RouterLink to="/claims" class="nav-item">Claims Management</RouterLink><RouterLink to="/history" class="nav-item">Claimed History</RouterLink><RouterLink to="/messages" class="nav-item">Messages</RouterLink><RouterLink to="/post-item" class="nav-item">Post Item</RouterLink><RouterLink to="/profile" class="nav-item">My Profile</RouterLink>
    </nav><div class="sidebar-footer">© 2025 LDCU iFound System</div></div>
    <div class="main"><div class="topbar"><div class="topbar-left"><button class="menu-btn" @click="sidebarOpen = !sidebarOpen">☰</button><div class="topbar-brand"><div class="topbar-logo">⌂</div><div><p class="topbar-name">LDCU iFound</p><p class="topbar-sub">Lost &amp; Found System</p></div></div></div></div>
      <div class="content"><div class="page-header"><h2>Lost &amp; Found Items</h2></div><div class="tabs"><button class="tab-btn" :class="{ 'lost-active': activeTab === 'lost' }" @click="activeTab = 'lost'">Lost Items</button><button class="tab-btn" :class="{ 'found-active': activeTab === 'found' }" @click="activeTab = 'found'">Found Items</button></div><div class="search-bar">⌕<input v-model="searchQuery" type="text" placeholder="Search items..." /></div>
        <div v-if="isLoading" class="loading"><div class="spinner"></div><p>Loading items...</p></div><div v-else class="items-grid"><div v-for="item in filteredItems" :key="item.id" class="item-card"><div class="item-img-wrapper"><img :src="item.image_url || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80'" :alt="item.title" /><div class="flag-btn" @click="openReport(item)">⚑</div><span class="status-badge" :class="item.status === 'lost' ? 'lost-badge' : 'found-badge'">{{ item.status.toUpperCase() }}</span></div><div class="item-info"><h4>{{ item.title }}</h4><p class="item-meta">⌖ {{ item.location }}</p><p class="item-meta">▣ {{ item.date }}</p><p class="item-meta">♙ Posted by {{ item.posted_by_name }}</p><RouterLink :to="`/item-details/${item.id}`" class="btn-view">View Details</RouterLink></div></div></div>
      </div></div>
    <div v-if="showReportModal" class="modal-overlay" @click="closeReport"></div><div v-if="showReportModal" class="modal"><div class="modal-header"><h3>Report a Problem</h3><button class="modal-close" @click="closeReport">✕</button></div><div class="report-warning"><p>False reports may result in account suspension. Please only report legitimate concerns.</p></div><div class="modal-form"><div class="fg"><label>Reason for Report *</label><input v-model="reportReason" type="text" /></div><div class="fg"><label>Please provide details *</label><textarea v-model="reportDetails" rows="5"></textarea></div></div><div class="modal-footer"><button class="btn-cancel" @click="closeReport">Cancel</button><button class="btn-report" @click="submitReport">Submit Report</button></div></div><div v-if="showReportSuccess" class="modal success-modal"><div class="success-check">✓</div><h3 class="success-title">Report Submitted!</h3><p class="success-text">Staff will review this dispute shortly. Thank you for helping maintain the integrity of our system.</p></div>
  </div>
</template>

<style scoped>
*{margin:0;padding:0;box-sizing:border-box}.lf-wrapper{display:flex;min-height:100vh;font-family:'Segoe UI',sans-serif;background:#f5f6fa;width:100%}.overlay,.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:99}.sidebar{position:fixed;top:0;left:-320px;width:280px;height:100vh;background:#0d1b2e;display:flex;flex-direction:column;padding:24px 0;z-index:100;transition:left .3s ease}.sidebar.open{left:0}.sidebar-top{display:flex;align-items:center;justify-content:space-between;padding:0 20px 24px;border-bottom:1px solid rgba(255,255,255,.1);margin-bottom:16px}.sidebar-brand{display:flex;align-items:center;gap:12px}.sidebar-logo,.topbar-logo{width:42px;height:42px;background:#1a3c8f;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff}.sidebar-title{font-size:1rem;font-weight:700;color:#fff}.sidebar-sub{font-size:.75rem;color:rgba(255,255,255,.5)}.close-btn,.menu-btn,.modal-close{background:none;border:none;cursor:pointer}.close-btn{color:rgba(255,255,255,.6);font-size:1.1rem}.sidebar-nav{display:flex;flex-direction:column;gap:4px;padding:0 12px;flex:1}.nav-item{display:flex;align-items:center;gap:14px;padding:12px 16px;border-radius:10px;color:rgba(255,255,255,.65);text-decoration:none;font-size:.95rem;font-weight:500}.nav-item:hover,.nav-item.active{background:#1a3c8f;color:#fff}.sidebar-footer{padding:16px 20px 0;border-top:1px solid rgba(255,255,255,.1);font-size:.75rem;color:rgba(255,255,255,.35);text-align:center}.main{flex:1;display:flex;flex-direction:column;min-width:0}.topbar{background:#fff;padding:12px 24px;display:flex;align-items:center;border-bottom:1px solid #e8eaed}.topbar-left,.topbar-brand{display:flex;align-items:center;gap:16px}.topbar-brand{gap:10px}.topbar-logo{width:38px;height:38px}.topbar-name{font-size:.95rem;font-weight:700;color:#111}.topbar-sub{font-size:.72rem;color:#888}.content{padding:28px;flex:1}.page-header{margin-bottom:20px}.page-header h2{font-size:1.5rem;font-weight:700;color:#111}.tabs{display:flex;gap:10px;margin-bottom:18px}.tab-btn{padding:10px 24px;border-radius:24px;border:1.5px solid #dde1e9;font-size:.9rem;font-weight:600;cursor:pointer;background:#f5f6fa;color:#555}.lost-active{background:#ef4444;color:#fff;border-color:#ef4444}.found-active{background:#22c55e;color:#fff;border-color:#22c55e}.search-bar{display:flex;align-items:center;gap:10px;background:#fff;border:1.5px solid #dde1e9;border-radius:10px;padding:10px 16px;margin-bottom:24px}.search-bar input{border:0;outline:0;flex:1;font-size:.92rem}.loading{text-align:center;padding:60px}.spinner{margin:auto;width:40px;height:40px;border:4px solid #e8eaed;border-top-color:#1a3c8f;border-radius:50%;animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}.items-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.item-card{background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.07);display:flex;flex-direction:column;min-height:380px}.item-img-wrapper{position:relative;width:100%;height:200px}.item-img-wrapper img{width:100%;height:100%;object-fit:cover}.flag-btn{position:absolute;top:10px;left:10px;background:#fff;border-radius:6px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer}.status-badge{position:absolute;top:10px;right:10px;padding:4px 12px;border-radius:6px;font-size:.78rem;font-weight:700;color:#fff}.lost-badge{background:#ef4444}.found-badge{background:#22c55e}.item-info{padding:16px;flex:1;display:flex;flex-direction:column}.item-info h4{font-size:1rem;color:#111;margin-bottom:10px}.item-meta{font-size:.82rem;color:#666;margin-bottom:6px}.btn-view{display:block;width:100%;margin-top:auto;padding:11px;background:#1a3c8f;color:#fff;text-align:center;border-radius:10px;text-decoration:none;font-size:.9rem;font-weight:600}.modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;border-radius:16px;width:90%;max-width:560px;z-index:201;padding:28px}.modal-header{display:flex;justify-content:space-between;margin-bottom:20px}.modal-form{display:flex;flex-direction:column;gap:16px}.fg{display:flex;flex-direction:column;gap:6px}.fg input,.fg textarea{padding:11px 14px;border:1.5px solid #dde1e9;border-radius:10px}.modal-footer{display:flex;gap:12px;margin-top:24px}.btn-cancel,.btn-report{flex:1;padding:13px;border:0;border-radius:10px;cursor:pointer}.btn-report{background:#ef4444;color:#fff}.success-modal{text-align:center}.success-check{font-size:3rem;color:#22c55e}.success-text{color:#555}@media(max-width:900px){.items-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:600px){.items-grid{grid-template-columns:1fr}.content{padding:16px}}
</style>