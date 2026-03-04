# 📊 MONEV — Monitoring & Evaluasi Kegiatan

Sistem monitoring dan evaluasi kegiatan bulanan berbasis web untuk Dinas Perhubungan DIY. Aplikasi ini membantu dalam pengelolaan program, kegiatan, sub kegiatan, dan output, serta memantau progres realisasi secara berkala.

## ✨ Fitur Utama

- **🔐 Autentikasi** — Login dengan JWT, role-based access (admin & user)
- **📋 Manajemen Kegiatan** — CRUD Program → Kegiatan → Sub Kegiatan → Output (hierarki)
- **📈 Monitoring** — Input & tracking realisasi kegiatan per bulan
- **📅 Kalender** — Visualisasi jadwal kegiatan dan event
- **📄 Laporan** — Rekap data monitoring dengan export ke Excel (.xlsx)
- **⚙️ Pengaturan** — Konfigurasi periode, tahun anggaran, dan reporting window
- **👥 Manajemen User** — Kelola akun pengguna (admin only)

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| **Front-End** | Vue.js 3, Vite, Tailwind CSS 3, Pinia, Vue Router |
| **Back-End** | Node.js, Express.js 5 |
| **Database** | PostgreSQL |
| **Auth** | JWT (jsonwebtoken), bcrypt |
| **Lainnya** | xlsx-js-style (export Excel), Heroicons |

## 📁 Struktur Proyek

```
monev/
├── back-end/
│   ├── .env                 # Konfigurasi environment
│   ├── index.js             # Entry point server
│   ├── db.js                # Koneksi PostgreSQL
│   ├── createUser.js        # Script buat user awal
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   └── routes/
│       ├── auth.js
│       ├── program.js
│       ├── kegiatan.js
│       ├── subkegiatan.js
│       ├── output.js
│       ├── monitoring.js
│       ├── tahun.js
│       ├── periode.js
│       ├── events.js
│       └── reporting-window.js
│
└── front-end/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.vue
        ├── main.js
        ├── api.js
        ├── router/
        ├── stores/
        ├── components/
        └── views/
            ├── LoginView.vue
            ├── DashboardView.vue
            ├── KegiatanView.vue
            ├── LaporanView.vue
            ├── KalenderView.vue
            ├── SettingsView.vue
            └── UsersView.vue
```

## 📋 Prasyarat

Pastikan software berikut sudah terinstall:

- [Node.js](https://nodejs.org/) v18 atau lebih baru
- [PostgreSQL](https://www.postgresql.org/) v14 atau lebih baru

## 🚀 Instalasi & Menjalankan

### 1. Clone Repository

```bash
git clone https://github.com/tyasnurtaufiq/monev.git
cd monev
```

### 2. Setup Database

Buat database PostgreSQL:

```sql
CREATE DATABASE monev_dishub;
```

> Jalankan juga SQL schema/migrasi jika tersedia untuk membuat tabel-tabel yang diperlukan.

### 3. Konfigurasi Environment

Buat atau edit file `back-end/.env`:

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=monev_dishub
DB_PASS=your_password
DB_PORT=5432

PORT=3000
JWT_SECRET=your_secret_key
```

### 4. Jalankan Back-End

```bash
cd back-end
npm install
node index.js
```

Server berjalan di `http://localhost:3000`

### 5. Jalankan Front-End

```bash
cd front-end
npm install
npm run dev
```

Aplikasi berjalan di `http://localhost:5173`

### 6. Buat User Pertama

```bash
cd back-end
node createUser.js
```

## 🔗 API Endpoints

| Method | Endpoint | Keterangan |
|---|---|---|
| `POST` | `/api/auth/login` | Login |
| `GET/POST` | `/api/program` | Manajemen program |
| `GET/POST` | `/api/kegiatan` | Manajemen kegiatan |
| `GET/POST` | `/api/subkegiatan` | Manajemen sub kegiatan |
| `GET/POST` | `/api/output` | Manajemen output |
| `GET/POST` | `/api/monitoring` | Input & tracking realisasi |
| `GET/POST` | `/api/tahun` | Manajemen tahun anggaran |
| `GET/POST` | `/api/periode` | Manajemen periode |
| `GET/POST` | `/api/events` | Manajemen event/kalender |
| `GET/POST` | `/api/reporting-window` | Konfigurasi jendela pelaporan |

## 🏗️ Build untuk Production

```bash
cd front-end
npm run build
```

Hasil build ada di folder `front-end/dist/` dan dapat disajikan menggunakan web server seperti Nginx atau langsung melalui Express.

## 📝 Lisensi

MIT License
