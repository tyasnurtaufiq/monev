import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../api'

export const useMonevStore = defineStore('monev', () => {
    // ===== STATE =====
    const tahunList = ref([])
    const selectedTahunId = ref(null)
    const programs = ref([])
    const kegiatanList = ref([])
    const subKegiatanList = ref([])
    const outputList = ref([])
    const belanjaList = ref([])
    const periodeList = ref([])
    const monitoringList = ref([])
    const rekapData = ref([])
    const dashboardData = ref([])
    const loading = ref(false)

    // ===== GETTERS =====
    const selectedTahun = computed(() =>
        tahunList.value.find(t => t.id === selectedTahunId.value)
    )

    const bulanNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ]

    // Stats
    const totalProgram = computed(() => programs.value.length)
    const totalKegiatan = computed(() => kegiatanList.value.length)
    const totalSubKegiatan = computed(() => subKegiatanList.value.length)
    const totalOutput = computed(() => outputList.value.length)

    const totalPagu = computed(() => {
        // Derive from rekapData so it covers all outputs for the entire tahun
        const seen = new Set()
        let sum = 0
        rekapData.value.forEach(row => {
            if (row.output_id && !seen.has(row.output_id)) {
                seen.add(row.output_id)
                sum += parseFloat(row.pagu || 0)
            }
        })
        return sum
    })

    // Rekap stats
    const rekapStats = computed(() => {
        if (rekapData.value.length === 0) return { latestFisik: 0, latestKeuangan: 0, totalRealisasi: 0 }

        const withMonitoring = rekapData.value.filter(r => r.monitoring_id !== null)
        if (withMonitoring.length === 0) return { latestFisik: 0, latestKeuangan: 0, totalRealisasi: 0 }

        // Group by output_id and find the latest bulan for each output
        const byOutput = {}
        withMonitoring.forEach(r => {
            const oid = r.output_id
            if (!byOutput[oid] || r.bulan > byOutput[oid].bulan) {
                byOutput[oid] = r
            }
        })
        const latestRows = Object.values(byOutput)

        const latestFisik = latestRows.length
            ? Math.round(latestRows.reduce((s, r) => s + parseFloat(r.realisasi_fisik || 0), 0) / latestRows.length * 100) / 100
            : 0
        const totalRealisasi = latestRows.reduce((s, r) => s + parseFloat(r.realisasi_keuangan || 0), 0)

        return {
            latestFisik,
            totalRealisasi
        }
    })

    // Group rekap by program
    const rekapByProgram = computed(() => {
        const grouped = {}
        rekapData.value.forEach(row => {
            if (!row.program_id) return
            if (!grouped[row.program_id]) {
                grouped[row.program_id] = {
                    id: row.program_id,
                    kode_program: row.kode_program,
                    nama_program: row.nama_program,
                    kegiatanMap: {}
                }
            }
            const prog = grouped[row.program_id]

            if (row.kegiatan_id && !prog.kegiatanMap[row.kegiatan_id]) {
                prog.kegiatanMap[row.kegiatan_id] = {
                    id: row.kegiatan_id,
                    kode_kegiatan: row.kode_kegiatan,
                    nama_kegiatan: row.nama_kegiatan,
                    subKegiatanMap: {}
                }
            }

            if (row.kegiatan_id && row.sub_kegiatan_id) {
                const keg = prog.kegiatanMap[row.kegiatan_id]
                if (!keg.subKegiatanMap[row.sub_kegiatan_id]) {
                    keg.subKegiatanMap[row.sub_kegiatan_id] = {
                        id: row.sub_kegiatan_id,
                        kode_sub_kegiatan: row.kode_sub_kegiatan,
                        nama_sub_kegiatan: row.nama_sub_kegiatan,
                        outputs: []
                    }
                }

                if (row.output_id) {
                    const sk = keg.subKegiatanMap[row.sub_kegiatan_id]
                    // Check if output already added
                    let out = sk.outputs.find(o => o.id === row.output_id)
                    if (!out) {
                        out = {
                            id: row.output_id,
                            kode: row.kode_output,
                            nama_output: row.nama_output,
                            pagu: row.pagu,
                            monitoring: []
                        }
                        sk.outputs.push(out)
                    }
                    if (row.monitoring_id) {
                        out.monitoring.push({
                            id: row.monitoring_id,
                            bulan: row.bulan,
                            periode_id: row.periode_id,
                            target_fisik: row.target_fisik,
                            realisasi_fisik: row.realisasi_fisik,
                            target_keuangan: row.target_keuangan,
                            realisasi_keuangan: row.realisasi_keuangan,
                            progress: row.progress,
                            hambatan: row.hambatan,
                            pendorong: row.pendorong
                        })
                    }
                }
            }
        })

        // Convert maps to arrays
        return Object.values(grouped).map(prog => ({
            ...prog,
            kegiatan: Object.values(prog.kegiatanMap).map(keg => ({
                ...keg,
                subKegiatan: Object.values(keg.subKegiatanMap)
            }))
        }))
    })

    // ===== ACTIONS =====

    // Tahun
    const fetchTahun = async () => {
        tahunList.value = await api.get('/tahun')
        if (tahunList.value.length > 0 && !selectedTahunId.value) {
            const currentYear = new Date().getFullYear().toString()
            const found = tahunList.value.find(t => t.tahun.toString() === currentYear)
            selectedTahunId.value = found ? found.id : tahunList.value[0].id
        }
    }

    const addTahun = async (tahun) => {
        const result = await api.post('/tahun', { tahun })
        tahunList.value.unshift(result)
        return result
    }

    // Program
    const fetchPrograms = async (tahunId) => {
        const id = tahunId || selectedTahunId.value
        if (!id) return
        programs.value = await api.get(`/program?tahun_id=${id}`)
    }

    const addProgram = async (data) => {
        const result = await api.post('/program', data)
        programs.value.push(result)
        return result
    }

    const updateProgram = async (id, data) => {
        const result = await api.put(`/program/${id}`, data)
        const idx = programs.value.findIndex(p => p.id === id)
        if (idx !== -1) programs.value[idx] = result
        return result
    }

    const deleteProgram = async (id) => {
        await api.delete(`/program/${id}`)
        programs.value = programs.value.filter(p => p.id !== id)
    }

    // Kegiatan
    const fetchKegiatan = async (programId) => {
        const query = programId ? `?program_id=${programId}` : ''
        kegiatanList.value = await api.get(`/kegiatan${query}`)
    }

    const addKegiatan = async (data) => {
        const result = await api.post('/kegiatan', data)
        kegiatanList.value.push(result)
        return result
    }

    const updateKegiatan = async (id, data) => {
        const result = await api.put(`/kegiatan/${id}`, data)
        const idx = kegiatanList.value.findIndex(k => k.id === id)
        if (idx !== -1) kegiatanList.value[idx] = result
        return result
    }

    const deleteKegiatan = async (id) => {
        await api.delete(`/kegiatan/${id}`)
        kegiatanList.value = kegiatanList.value.filter(k => k.id !== id)
    }

    // Sub Kegiatan
    const fetchSubKegiatan = async (kegiatanId) => {
        const query = kegiatanId ? `?kegiatan_id=${kegiatanId}` : ''
        subKegiatanList.value = await api.get(`/subkegiatan${query}`)
    }

    const addSubKegiatan = async (data) => {
        const result = await api.post('/subkegiatan', data)
        subKegiatanList.value.push(result)
        return result
    }

    const updateSubKegiatan = async (id, data) => {
        const result = await api.put(`/subkegiatan/${id}`, data)
        const idx = subKegiatanList.value.findIndex(s => s.id === id)
        if (idx !== -1) subKegiatanList.value[idx] = result
        return result
    }

    const deleteSubKegiatan = async (id) => {
        await api.delete(`/subkegiatan/${id}`)
        subKegiatanList.value = subKegiatanList.value.filter(s => s.id !== id)
    }

    // Output
    const fetchOutput = async (subKegiatanId) => {
        const query = subKegiatanId ? `?sub_kegiatan_id=${subKegiatanId}` : ''
        outputList.value = await api.get(`/output${query}`)
    }

    const addOutput = async (data) => {
        const result = await api.post('/output', data)
        outputList.value.push(result)
        return result
    }

    const updateOutput = async (id, data) => {
        const result = await api.put(`/output/${id}`, data)
        const idx = outputList.value.findIndex(o => o.id === id)
        if (idx !== -1) outputList.value[idx] = result
        return result
    }

    const deleteOutput = async (id) => {
        await api.delete(`/output/${id}`)
        outputList.value = outputList.value.filter(o => o.id !== id)
    }

    // Belanja
    const fetchBelanja = async (outputId) => {
        const query = outputId ? `?output_id=${outputId}` : ''
        belanjaList.value = await api.get(`/belanja${query}`)
    }

    const addBelanja = async (data) => {
        const result = await api.post('/belanja', data)
        belanjaList.value.push(result)
        return result
    }

    const updateBelanja = async (id, data) => {
        const result = await api.put(`/belanja/${id}`, data)
        const idx = belanjaList.value.findIndex(b => b.id === id)
        if (idx !== -1) belanjaList.value[idx] = result
        return result
    }

    const deleteBelanja = async (id) => {
        await api.delete(`/belanja/${id}`)
        belanjaList.value = belanjaList.value.filter(b => b.id !== id)
    }

    // Periode
    const fetchPeriode = async (tahunId) => {
        const id = tahunId || selectedTahunId.value
        if (!id) return
        periodeList.value = await api.get(`/periode?tahun_id=${id}`)
    }

    const generatePeriode = async (tahunId) => {
        const id = tahunId || selectedTahunId.value
        if (!id) return
        periodeList.value = await api.post('/periode/generate', { tahun_id: id })
    }

    // Monitoring
    const fetchMonitoring = async (outputId, periodeId) => {
        let query = '?'
        if (outputId) query += `output_id=${outputId}&`
        if (periodeId) query += `periode_id=${periodeId}&`
        monitoringList.value = await api.get(`/monitoring${query}`)
    }

    const fetchRekap = async (tahunId) => {
        const id = tahunId || selectedTahunId.value
        if (!id) return
        try {
            rekapData.value = await api.get(`/monitoring/rekap?tahun_id=${id}`)
        } catch (e) {
            console.error('fetchRekap error:', e)
        }
    }

    const fetchDashboard = async (tahunId) => {
        const id = tahunId || selectedTahunId.value
        if (!id) return
        try {
            dashboardData.value = await api.get(`/monitoring/dashboard?tahun_id=${id}`)
        } catch (e) {
            console.error('fetchDashboard error:', e)
        }
    }

    const saveMonitoring = async (data) => {
        const result = await api.post('/monitoring', data)
        // Refresh monitoring list if same output is being viewed
        return result
    }

    const updateMonitoring = async (id, data) => {
        const result = await api.put(`/monitoring/${id}`, data)
        return result
    }

    const deleteMonitoring = async (id) => {
        await api.delete(`/monitoring/${id}`)
    }

    const saveMonitoringBelanja = async (data) => {
        const result = await api.post('/monitoring/belanja', data)
        return result
    }

    // Load semua data untuk tahun yang dipilih
    const loadAllForTahun = async (tahunId) => {
        const id = tahunId || selectedTahunId.value
        if (!id) return
        selectedTahunId.value = id
        loading.value = true
        try {
            await Promise.all([
                fetchPrograms(id),
                fetchPeriode(id),
                fetchRekap(id),
                fetchDashboard(id)
            ])
        } finally {
            loading.value = false
        }
    }

    return {
        // State
        tahunList, selectedTahunId, programs, kegiatanList,
        subKegiatanList, outputList, belanjaList, periodeList, monitoringList,
        rekapData, dashboardData, loading,
        // Getters
        selectedTahun, bulanNames,
        totalProgram, totalKegiatan, totalSubKegiatan, totalOutput, totalPagu,
        rekapStats, rekapByProgram,
        // Actions
        fetchTahun, addTahun,
        fetchPrograms, addProgram, updateProgram, deleteProgram,
        fetchKegiatan, addKegiatan, updateKegiatan, deleteKegiatan,
        fetchSubKegiatan, addSubKegiatan, updateSubKegiatan, deleteSubKegiatan,
        fetchOutput, addOutput, updateOutput, deleteOutput,
        fetchBelanja, addBelanja, updateBelanja, deleteBelanja,
        fetchPeriode, generatePeriode,
        fetchMonitoring, fetchRekap, fetchDashboard, saveMonitoring, updateMonitoring, deleteMonitoring, saveMonitoringBelanja,
        loadAllForTahun
    }
})
