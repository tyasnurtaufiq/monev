import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../api'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const token = ref(null)

    // Initialize from localStorage
    const savedAuth = localStorage.getItem('monev_auth')
    if (savedAuth) {
        const parsed = JSON.parse(savedAuth)
        user.value = parsed.user
        token.value = parsed.token
    }

    const isAuthenticated = computed(() => !!token.value)

    const login = async (username, password) => {
        const data = await api.post('/auth/login', { username, password })

        user.value = data.user
        token.value = data.token

        localStorage.setItem('monev_auth', JSON.stringify({
            user: data.user,
            token: data.token
        }))

        return data
    }

    const fetchProfile = async () => {
        try {
            const data = await api.get('/auth/profile')
            user.value = data
        } catch (err) {
            console.error('Failed to fetch profile:', err)
        }
    }

    const logout = () => {
        user.value = null
        token.value = null
        localStorage.removeItem('monev_auth')
    }

    return {
        user,
        token,
        isAuthenticated,
        login,
        fetchProfile,
        logout
    }
})
