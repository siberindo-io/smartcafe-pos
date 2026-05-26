# POI Coffee Web (Local Node.js)

Web app POS + POI System untuk coffee shop dengan SQLite, login role-based, export Excel, manajemen user, workflow status order, dan backup/restore.

## Fitur Utama
- Login kasir/admin dengan session cookie
- Role-based access:
  - kasir: akses POS/dashboard/order
  - admin: akses export Excel + panel admin
- Dashboard ringkasan penjualan (revenue, transaksi, order aktif, best seller)
- Filter dashboard berdasarkan:
  - harian
  - mingguan
  - bulanan
- Navigasi per halaman untuk setiap menu sidebar (`/dashboard`, `/pos`, `/orders`, `/reports`, `/settings`, `/admin`, `/admin-tables`)
- POS + POI map dalam satu halaman (`/pos`) dengan alur pilih meja dulu
- POI map status meja (kosong/terisi/reservasi)
- Inventory berkurang otomatis saat checkout
- Order history + update status order (`Process -> Done/Cancel`)
- Log perubahan status order
- Export laporan `.xlsx` dengan filter tanggal/range
- Menu management (admin):
  - tambah/edit/hapus menu
  - upload foto menu (URL atau file image -> base64)
  - ubah status aktif/nonaktif menu
  - atur stok & minimum stok per menu
- User management (admin):
  - tampilkan data user eksisting
  - tambah user
  - ubah role
  - aktif/nonaktif user
  - reset password user
- Database table viewer (admin):
  - lihat daftar tabel SQLite
  - lihat isi tabel beserta kolomnya
- Backup & restore SQLite (manual + auto backup berkala)

## Security Hardening
- Password hash menggunakan `bcrypt`
- HTTP-only cookie session
- Rate limit login per IP
- Auto lock akun sementara setelah gagal login berulang
- Session dibersihkan otomatis saat expired

## Demo Akun
- `kasir / kasir123`
- `admin / admin123`

## Struktur Proyek
- `server.js`: Express API + auth + SQLite + backup + export
- `data/poi_coffee.sqlite`: database SQLite
- `data/backups/`: file backup SQLite
- `public/index.html`: UI
- `public/styles.css`: styling
- `public/app.js`: logic frontend

## Instalasi & Jalankan
1. Pastikan Node.js versi 18+ terpasang
2. Install dependency
   ```bash
   npm install
   ```
3. Jalankan server
   ```bash
   npm start
   ```
4. Buka
   ```text
   http://localhost:3000
   ```

## Seed Dummy Data
Untuk menambah data dummy user + menu (beserta inventory) ke database:

```bash
npm run seed:dummy
```

Script ini aman dijalankan berulang karena menggunakan upsert/insert-or-ignore untuk data dummy.

## Endpoint API
### Auth
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Dashboard & POS
- `GET /api/state?range=daily|weekly|monthly&date=YYYY-MM-DD`
- `POST /api/orders`
- `PATCH /api/orders/:orderCode/status`
- `GET /api/orders/:orderCode/logs`

### Admin
- `GET /api/admin/menus`
- `POST /api/admin/menus`
- `PATCH /api/admin/menus/:productId`
- `DELETE /api/admin/menus/:productId`
- `GET /api/admin/db/tables`
- `GET /api/admin/db/tables/:tableName?limit=100&offset=0`
- `GET /api/admin/users`
- `POST /api/admin/users`
- `PATCH /api/admin/users/:userId`
- `POST /api/admin/users/:userId/reset-password`
- `GET /api/admin/backups`
- `POST /api/admin/backups`
- `POST /api/admin/backups/restore`

### Export
- `GET /api/export/orders.xlsx?range=daily|weekly|monthly&date=YYYY-MM-DD`

## Environment Variable Opsional
- `PORT` (default `3000`)
- `COOKIE_SECURE` (`true|false`)
- `LOGIN_RATE_WINDOW_MS`
- `LOGIN_RATE_MAX_ATTEMPTS`
- `ACCOUNT_LOCK_THRESHOLD`
- `ACCOUNT_LOCK_DURATION_MS`
- `AUTO_BACKUP_INTERVAL_HOURS` (default `24`)
- `MAX_BACKUP_FILES` (default `30`)

## Catatan
- Jika ingin reset data total, hapus `data/poi_coffee.sqlite` lalu jalankan ulang server.
