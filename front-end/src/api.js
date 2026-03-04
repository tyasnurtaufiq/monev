const API_BASE = '/api'

async function request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`

    // Ambil token dari localStorage
    const saved = localStorage.getItem('monev_auth')
    const token = saved ? JSON.parse(saved).token : null

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers
        },
        ...options
    }

    const response = await fetch(url, config)

    if (response.status === 401 || response.status === 403) {
        // Token expired / invalid → logout
        localStorage.removeItem('monev_auth')
        window.location.href = '/login'
        throw new Error('Sesi berakhir, silakan login kembali')
    }

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Terjadi kesalahan' }))
        throw new Error(error.message || 'Terjadi kesalahan')
    }

    return response.json()
}

export const api = {
    get: (endpoint) => request(endpoint),
    post: (endpoint, data) => request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
    put: (endpoint, data) => request(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (endpoint) => request(endpoint, { method: 'DELETE' })
}
