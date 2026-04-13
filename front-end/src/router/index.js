import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import KegiatanView from '../views/KegiatanView.vue'
import LaporanView from '../views/LaporanView.vue'
import RekapView from '../views/RekapView.vue'
import KalenderView from '../views/KalenderView.vue'
import SettingsView from '../views/SettingsView.vue'
import UsersView from '../views/UsersView.vue'

const routes = [
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: { requiresAuth: false }
    },
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: DashboardView,
        meta: { requiresAuth: true }
    },
    {
        path: '/kegiatan',
        name: 'kegiatan',
        component: KegiatanView,
        meta: { requiresAuth: true }
    },
    {
        path: '/laporan',
        name: 'laporan',
        component: LaporanView,
        meta: { requiresAuth: true }
    },
    {
        path: '/rekap',
        name: 'rekap',
        component: RekapView,
        meta: { requiresAuth: true }
    },
    {
        path: '/kalender',
        name: 'kalender',
        component: KalenderView,
        meta: { requiresAuth: true }
    },
    {
        path: '/settings',
        name: 'settings',
        component: SettingsView,
        meta: { requiresAuth: true }
    },
    {
        path: '/users',
        name: 'users',
        component: UsersView,
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const auth = localStorage.getItem('monev_auth')

    if (to.meta.requiresAuth && !auth) {
        next('/login')
    } else if (to.path === '/login' && auth) {
        next('/dashboard')
    } else {
        next()
    }
})

export default router
