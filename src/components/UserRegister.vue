<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'

const router = useRouter()
const role = ref('Student')
const idNumber = ref('')
const fullName = ref('')
const department = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

const selectRole = (selectedRole) => { role.value = selectedRole }
const togglePassword = () => { showPassword.value = !showPassword.value }
const toggleConfirmPassword = () => { showConfirmPassword.value = !showConfirmPassword.value }

const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  const emailInput = email.value.trim().toLowerCase()
  const normalizedEmail = emailInput.includes('@') ? emailInput : `${emailInput}@liceo.edu.ph`

  if (!normalizedEmail.endsWith('@liceo.edu.ph') || normalizedEmail === '@liceo.edu.ph') {
    errorMessage.value = 'Only @liceo.edu.ph email addresses are allowed.'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  isLoading.value = true
  try {
    const response = await api.post('/auth/register', {
      full_name: fullName.value,
      email: normalizedEmail,
      password: password.value,
      role: role.value,
      id_number: idNumber.value,
      department: department.value
    })

    if (response.data.access_token) localStorage.setItem('access_token', response.data.access_token)
    successMessage.value = 'Account created successfully! Redirecting...'
    setTimeout(() => router.push('/login'), 1200)
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Registration failed.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="signup-wrapper">
    <div class="left-panel">
      <div class="brand"><div class="brand-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="28" height="28"><path d="M20.7 7.04L12 2 3.3 7.04A2 2 0 0 0 2 8.81V20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8.81a2 2 0 0 0-1.3-1.77zM12 4.22l6.5 3.72-2.39 1.37L12 6.2 7.89 9.31 5.5 7.94 12 4.22zM4 20V9.81l7 4.01V20H4zm9 0v-6.18l7-4.01V20h-7z"/></svg></div><h1 class="brand-name">LDCU iFound</h1></div>
      <p class="brand-tagline">Reuniting the Licean Community.</p>
      <ul class="feature-list">
        <li><div class="feature-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="20" height="20"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div><span>Join the community</span></li>
        <li><div class="feature-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="20" height="20"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-2.24-2-2s.9-2 2-2 2 .9 2 2-0.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg></div><span>Secure registration</span></li>
        <li><div class="feature-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="20" height="20"><path d="M13 2.05v2.02c3.95.49 7 3.85 7 7.93 0 3.21-1.81 6-4.72 7.28L13 17v5h5l-1.22-1.22C19.91 19.07 22 15.76 22 12c0-5.18-3.95-9.45-9-9.95zM11 2.05C5.95 2.55 2 6.82 2 12c0 3.76 2.09 7.07 5.22 8.78L6 22h5V2.05z"/></svg></div><span>Quick and easy setup</span></li>
      </ul>
    </div>
    <div class="right-panel"><div class="signup-card">
      <div class="signup-header"><div class="signup-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="26" height="26"><path d="M20.7 7.04L12 2 3.3 7.04A2 2 0 0 0 2 8.81V20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8.81a2 2 0 0 0-1.3-1.77zM12 4.22l6.5 3.72-2.39 1.37L12 6.2 7.89 9.31 5.5 7.94 12 4.22zM4 20V9.81l7 4.01V20H4zm9 0v-6.18l7-4.01V20h-7z"/></svg></div><h2>Create Account</h2></div>
      <p class="signup-subtitle">Sign Up to get started</p>
      <form class="signup-form" @submit.prevent="handleRegister">
        <div class="form-group"><label>I am a</label><div class="role-toggle"><button type="button" :class="{ active: role === 'Student' }" @click="selectRole('Student')">Student</button><button type="button" :class="{ active: role === 'Teacher' }" @click="selectRole('Teacher')">Teacher</button></div></div>
        <div class="form-group"><label for="idNumber">ID Number</label><input id="idNumber" v-model="idNumber" type="text" placeholder="e.g., 2023-0000" /></div>
        <div class="form-group"><label for="fullName">Full Name</label><input id="fullName" v-model="fullName" type="text" placeholder="Enter your full name" /></div>
        <div class="form-group"><label for="department">Department</label><input id="department" v-model="department" type="text" /></div>
        <div class="form-group"><label for="email">Email Address</label><div class="email-wrapper"><input id="email" v-model="email" type="text" placeholder="yourname" /><span class="email-suffix">&#64;liceo.edu.ph</span></div><small>Use your official Liceo email address</small></div>
        <div class="form-group"><label for="password">Password</label><div class="password-wrapper"><input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Create a password" /><button type="button" class="toggle-password" @click="togglePassword"><svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#aaa" width="20" height="20"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5-4-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg><svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#aaa" width="20" height="20"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.8 11.8 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27z"/></svg></button></div></div>
        <div class="form-group"><label for="confirmPassword">Confirm Password</label><div class="password-wrapper"><input id="confirmPassword" v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" placeholder="Confirm your password" /><button type="button" class="toggle-password" @click="toggleConfirmPassword"><svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#aaa" width="20" height="20"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5-4-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg><svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#aaa" width="20" height="20"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.8 11.8 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27z"/></svg></button></div></div>
        <div v-if="errorMessage" class="error-msg">{{ errorMessage }}</div><p v-if="successMessage" class="success-msg">{{ successMessage }}</p>
        <button type="submit" class="btn-signup" :disabled="isLoading">{{ isLoading ? 'Creating account...' : 'Sign Up' }}</button>
        <p class="login-text">Already have an account?<router-link to="/login" class="login-link">Log In</router-link></p>
      </form>
    </div></div>
  </div>
</template>

<style scoped>
* { margin: 0; padding: 0; box-sizing: border-box; }
.signup-wrapper { display: flex; min-height: 100vh; font-family: 'Segoe UI', sans-serif; }
.left-panel { width: 50%; background: linear-gradient(160deg, #1565c0 0%, #0d2b6b 60%, #091a45 100%); display: flex; flex-direction: column; justify-content: center; padding: 60px 56px; color: white; }
.brand { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
.brand-icon { width: 60px; height: 60px; background: rgba(255, 255, 255, 0.15); border-radius: 16px; display: flex; align-items: center; justify-content: center; }
.brand-name { font-size: 2.4rem; font-weight: 700; letter-spacing: -0.5px; }
.brand-tagline { font-size: 1.05rem; color: rgba(255, 255, 255, 0.75); margin-bottom: 48px; }
.feature-list { list-style: none; display: flex; flex-direction: column; gap: 20px; }
.feature-list li { display: flex; align-items: center; gap: 16px; font-size: 1rem; color: rgba(255, 255, 255, 0.9); }
.feature-icon { width: 44px; height: 44px; background: rgba(255, 255, 255, 0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.right-panel { width: 50%; background: #f5f6fa; display: flex; align-items: flex-start; justify-content: center; padding: 48px; overflow-y: auto; min-height: 100vh; }
.signup-card { width: 100%; max-width: 440px; background: #fff; border-radius: 16px; padding: 40px; margin: auto 0; }
.signup-header { display: flex; align-items: center; gap: 14px; margin-bottom: 8px; }
.signup-icon { width: 52px; height: 52px; background: #1a3c8f; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
.signup-header h2 { font-size: 2rem; font-weight: 700; color: #1a3c8f; }
.signup-subtitle { font-size: 0.95rem; color: #666; margin-bottom: 28px; }
.signup-form { display: flex; flex-direction: column; gap: 18px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 0.9rem; font-weight: 500; color: #333; }
.form-group input { width: 100%; padding: 13px 16px; border: 1.5px solid #dde1e9; border-radius: 10px; font-size: 0.95rem; color: #333; outline: none; transition: border-color 0.2s; background: #fff; }
.form-group input:focus { border-color: #1a3c8f; }
.form-group small { font-size: 0.8rem; color: #888; }
.role-toggle { display: flex; gap: 12px; }
.role-toggle button { flex: 1; padding: 12px; border: 1.5px solid #dde1e9; border-radius: 10px; font-size: 0.95rem; font-weight: 500; cursor: pointer; background: #fff; color: #555; transition: all 0.2s; }
.role-toggle button.active { background: #1a3c8f; color: #fff; border-color: #1a3c8f; }
.email-wrapper { display: flex; align-items: center; border: 1.5px solid #dde1e9; border-radius: 10px; overflow: hidden; background: #fff; transition: border-color 0.2s; }
.email-wrapper:focus-within { border-color: #1a3c8f; }
.email-wrapper input { border: none; border-radius: 0; flex: 1; padding: 13px 16px; outline: none; }
.email-suffix { padding: 0 14px; font-size: 0.9rem; color: #888; background: #f5f6fa; height: 100%; display: flex; align-items: center; border-left: 1.5px solid #dde1e9; white-space: nowrap; }
.password-wrapper { position: relative; }
.password-wrapper input { padding-right: 48px; }
.toggle-password { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; }
.btn-signup { width: 100%; padding: 14px; background: #1a3c8f; color: white; font-size: 1rem; font-weight: 600; border: none; border-radius: 10px; cursor: pointer; transition: background 0.2s; margin-top: 4px; }
.btn-signup:hover { background: #14317a; }
.login-text { text-align: center; font-size: 0.9rem; color: #555; }
.login-link { color: #1a3c8f; font-weight: 600; text-decoration: none; margin-left: 4px; }
.login-link:hover { text-decoration: underline; }
.error-msg { background: #fee2e2; color: #dc2626; padding: 10px 14px; border-radius: 8px; font-size: 0.88rem; text-align: center; }
.success-msg { color: #15803d; font-size: 0.88rem; text-align: center; }
@media (max-width: 768px) { .signup-wrapper { flex-direction: column; } .left-panel, .right-panel { width: 100%; } .left-panel { padding: 40px 32px; } }
</style>