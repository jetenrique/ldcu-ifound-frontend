<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'

const router = useRouter()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)

const clearError = () => { errorMessage.value = '' }
const togglePassword = () => { showPassword.value = !showPassword.value }

const handleLogin = async () => {
  errorMessage.value = ''
  isLoading.value = true
  try {
    const response = await api.post('/auth/login', {
      email: email.value.trim().toLowerCase(),
      password: password.value
    })

    localStorage.setItem('access_token', response.data.access_token)
    if (rememberMe.value) localStorage.setItem('remember_me', 'true')
    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Invalid credentials.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-wrapper">
    <div class="left-panel">
      <div class="brand"><div class="brand-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="28" height="28"><path d="M20.7 7.04L12 2 3.3 7.04A2 2 0 0 0 2 8.81V20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8.81a2 2 0 0 0-1.3-1.77zM12 4.22l6.5 3.72-2.39 1.37L12 6.2 7.89 9.31 5.5 7.94 12 4.22zM4 20V9.81l7 4.01V20H4zm9 0v-6.18l7-4.01V20h-7z"/></svg></div><h1 class="brand-name">LDCU iFound</h1></div>
      <p class="brand-tagline">Reuniting the Licean Community.</p>
      <ul class="feature-list">
        <li><div class="feature-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="20" height="20"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg></div><span>Find lost items quickly</span></li>
        <li><div class="feature-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="20" height="20"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg></div><span>Connect with the community</span></li>
        <li><div class="feature-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="20" height="20"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg></div><span>Secure and trusted platform</span></li>
      </ul>
    </div>
    <div class="right-panel"><div class="login-card">
      <div class="login-header"><div class="login-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="26" height="26"><path d="M20.7 7.04L12 2 3.3 7.04A2 2 0 0 0 2 8.81V20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8.81a2 2 0 0 0-1.3-1.77zM12 4.22l6.5 3.72-2.39 1.37L12 6.2 7.89 9.31 5.5 7.94 12 4.22zM4 20V9.81l7 4.01V20H4zm9 0v-6.18l7-4.01V20h-7z"/></svg></div><h2>Welcome Back</h2></div>
      <p class="login-subtitle">Log in to your account</p>
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group"><label for="email">Email Address</label><input id="email" v-model="email" type="email" placeholder="yourname@liceo.edu.ph" @input="clearError" /></div>
        <div class="form-group"><label for="password">Password</label><div class="password-wrapper"><input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Enter your password" @input="clearError" /><button type="button" class="toggle-password" @click="togglePassword"><svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#aaa" width="20" height="20"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5-4-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg><svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#aaa" width="20" height="20"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.8 11.8 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27z"/></svg></button></div></div>
        <div class="form-options"><label class="remember-me"><input v-model="rememberMe" type="checkbox" /><span>Remember me</span></label><router-link to="/forgot-password" class="forgot-link">Forgot Password?</router-link></div>
        <div v-if="errorMessage" class="error-msg">{{ errorMessage }}</div>
        <button type="submit" class="btn-login" :disabled="isLoading">{{ isLoading ? 'Logging in...' : 'Log In' }}</button>
        <p class="signup-text">Don't have an account?<router-link to="/register" class="signup-link">Sign Up</router-link></p>
      </form>
    </div></div>
  </div>
</template>

<style scoped>
* { margin: 0; padding: 0; box-sizing: border-box; }
.login-wrapper { display: flex; min-height: 100vh; font-family: 'Segoe UI', sans-serif; }
.left-panel { width: 50%; background: linear-gradient(160deg, #1565c0 0%, #0d2b6b 60%, #091a45 100%); display: flex; flex-direction: column; justify-content: center; padding: 60px 56px; color: white; }
.brand { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
.brand-icon { width: 60px; height: 60px; background: rgba(255, 255, 255, 0.15); border-radius: 16px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
.brand-name { font-size: 2.4rem; font-weight: 700; letter-spacing: -0.5px; }
.brand-tagline { font-size: 1.05rem; color: rgba(255, 255, 255, 0.75); margin-bottom: 48px; }
.feature-list { list-style: none; display: flex; flex-direction: column; gap: 20px; }
.feature-list li { display: flex; align-items: center; gap: 16px; font-size: 1rem; color: rgba(255, 255, 255, 0.9); }
.feature-icon { width: 44px; height: 44px; background: rgba(255, 255, 255, 0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.right-panel { width: 50%; background: #ffffff; display: flex; align-items: center; justify-content: center; padding: 60px 48px; }
.login-card { width: 100%; max-width: 440px; }
.login-header { display: flex; align-items: center; gap: 14px; margin-bottom: 8px; }
.login-icon { width: 52px; height: 52px; background: #1a3c8f; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
.login-header h2 { font-size: 2rem; font-weight: 700; color: #1a3c8f; }
.login-subtitle { font-size: 0.95rem; color: #666; margin-bottom: 32px; margin-left: 2px; }
.login-form { display: flex; flex-direction: column; gap: 20px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 0.9rem; font-weight: 500; color: #333; }
.form-group input { width: 100%; padding: 13px 16px; border: 1.5px solid #dde1e9; border-radius: 10px; font-size: 0.95rem; color: #333; outline: none; transition: border-color 0.2s; background: #fff; }
.form-group input:focus { border-color: #1a3c8f; }
.password-wrapper { position: relative; }
.password-wrapper input { padding-right: 48px; }
.toggle-password { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; }
.form-options { display: flex; align-items: center; justify-content: space-between; margin-top: -4px; }
.remember-me { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: #444; cursor: pointer; }
.remember-me input[type="checkbox"] { width: 16px; height: 16px; accent-color: #1a3c8f; cursor: pointer; }
.forgot-link { font-size: 0.9rem; color: #1a3c8f; text-decoration: none; font-weight: 500; }
.forgot-link:hover { text-decoration: underline; }
.btn-login { width: 100%; padding: 14px; background: #1a3c8f; color: white; font-size: 1rem; font-weight: 600; border: none; border-radius: 10px; cursor: pointer; transition: background 0.2s; margin-top: 4px; }
.btn-login:hover { background: #14317a; }
.signup-text { text-align: center; font-size: 0.9rem; color: #555; }
.signup-link { color: #1a3c8f; font-weight: 600; text-decoration: none; margin-left: 4px; }
.signup-link:hover { text-decoration: underline; }
.error-msg { background: #fee2e2; color: #dc2626; padding: 10px 14px; border-radius: 8px; font-size: 0.88rem; text-align: center; }
@media (max-width: 768px) { .login-wrapper { flex-direction: column; } .left-panel, .right-panel { width: 100%; } .left-panel { padding: 40px 32px; } }
.loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; gap: 16px; }
.loading p { font-size: 0.95rem; color: #888; }
.spinner { width: 40px; height: 40px; border: 4px solid #e8eaed; border-top: 4px solid #1a3c8f; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>