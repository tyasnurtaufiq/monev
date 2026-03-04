import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useActivitiesStore = defineStore('activities', () => {
    // Divisions
    const divisions = ref([
        { id: 1, name: 'IT & Development', color: '#7C3AED' },
        { id: 2, name: 'Marketing', color: '#10B981' },
        { id: 3, name: 'Human Resources', color: '#F59E0B' },
        { id: 4, name: 'Finance', color: '#3B82F6' },
        { id: 5, name: 'Operations', color: '#EF4444' }
    ])

    // Activities data
    const activities = ref([
        {
            id: 1,
            title: 'Pengembangan Sistem Monitoring',
            description: 'Membangun dashboard monitoring untuk tracking kegiatan perusahaan',
            divisionId: 1,
            status: 'in_progress',
            priority: 'high',
            deadline: '2026-02-15',
            assignees: ['Admin User', 'John Doe'],
            createdAt: '2026-02-01',
            progress: 65
        },
        {
            id: 2,
            title: 'Kampanye Marketing Q1',
            description: 'Pelaksanaan kampanye digital marketing untuk produk baru',
            divisionId: 2,
            status: 'in_progress',
            priority: 'high',
            deadline: '2026-02-28',
            assignees: ['Jane Smith'],
            createdAt: '2026-01-15',
            progress: 40
        },
        {
            id: 3,
            title: 'Rekrutmen Developer',
            description: 'Proses rekrutmen 3 developer baru untuk tim IT',
            divisionId: 3,
            status: 'completed',
            priority: 'medium',
            deadline: '2026-01-31',
            assignees: ['HR Team'],
            createdAt: '2026-01-05',
            progress: 100
        },
        {
            id: 4,
            title: 'Laporan Keuangan Januari',
            description: 'Pembuatan laporan keuangan bulan Januari 2026',
            divisionId: 4,
            status: 'completed',
            priority: 'high',
            deadline: '2026-02-05',
            assignees: ['Finance Team'],
            createdAt: '2026-02-01',
            progress: 100
        },
        {
            id: 5,
            title: 'Optimasi Proses Produksi',
            description: 'Review dan optimasi alur proses produksi di pabrik',
            divisionId: 5,
            status: 'in_progress',
            priority: 'medium',
            deadline: '2026-02-20',
            assignees: ['Operations Lead'],
            createdAt: '2026-02-02',
            progress: 25
        },
        {
            id: 6,
            title: 'Training Karyawan Baru',
            description: 'Program onboarding dan training untuk karyawan baru',
            divisionId: 3,
            status: 'pending',
            priority: 'low',
            deadline: '2026-02-25',
            assignees: ['HR Team', 'Department Heads'],
            createdAt: '2026-02-03',
            progress: 0
        }
    ])

    // Filters
    const selectedDivision = ref(null)
    const selectedStatus = ref('all')

    // Getters
    const filteredActivities = computed(() => {
        return activities.value.filter(activity => {
            const divisionMatch = !selectedDivision.value || activity.divisionId === selectedDivision.value
            const statusMatch = selectedStatus.value === 'all' || activity.status === selectedStatus.value
            return divisionMatch && statusMatch
        })
    })

    const activeActivities = computed(() => {
        return activities.value.filter(a => a.status !== 'completed')
    })

    const completedActivities = computed(() => {
        return activities.value.filter(a => a.status === 'completed')
    })

    const activitiesByDivision = computed(() => {
        const grouped = {}
        activities.value.forEach(activity => {
            const div = divisions.value.find(d => d.id === activity.divisionId)
            if (!grouped[div.name]) {
                grouped[div.name] = []
            }
            grouped[div.name].push(activity)
        })
        return grouped
    })

    const totalProgress = computed(() => {
        if (activities.value.length === 0) return 0
        const total = activities.value.reduce((sum, a) => sum + a.progress, 0)
        return Math.round(total / activities.value.length)
    })

    // Actions
    const addActivity = (activity) => {
        const newId = Math.max(...activities.value.map(a => a.id)) + 1
        activities.value.push({
            ...activity,
            id: newId,
            createdAt: new Date().toISOString().split('T')[0],
            progress: 0
        })
    }

    const updateActivity = (id, updates) => {
        const index = activities.value.findIndex(a => a.id === id)
        if (index !== -1) {
            activities.value[index] = { ...activities.value[index], ...updates }
        }
    }

    const deleteActivity = (id) => {
        const index = activities.value.findIndex(a => a.id === id)
        if (index !== -1) {
            activities.value.splice(index, 1)
        }
    }

    const getDivisionById = (id) => {
        return divisions.value.find(d => d.id === id)
    }

    return {
        divisions,
        activities,
        selectedDivision,
        selectedStatus,
        filteredActivities,
        activeActivities,
        completedActivities,
        activitiesByDivision,
        totalProgress,
        addActivity,
        updateActivity,
        deleteActivity,
        getDivisionById
    }
})
