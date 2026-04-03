
# 🎓 SPMB Online - Sistem Penerimaan Murid Baru

Aplikasi web modern untuk pendaftaran siswa baru yang terintegrasi dengan Google Spreadsheet dan Google Drive.

## 🚀 Cara Menjalankan Lokal

1. **Clone repository ini**
2. **Install dependensi:**
   ```bash
   npm install
   ```
3. **Jalankan mode development:**
   ```bash
   npm run dev
   ```

## 📦 Cara Deploy ke GitHub & Vercel

### Langkah 1: Push ke GitHub
1. Buat repository baru di [GitHub](https://github.com/new).
2. Di terminal folder proyek Anda:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/USERNAME_ANDA/NAMA_REPO.git
   git push -u origin main
   ```

### Langkah 2: Hubungkan ke Vercel
1. Masuk ke [Vercel](https://vercel.com).
2. Klik **"Add New"** > **"Project"**.
3. Pilih repository GitHub yang baru saja Anda buat.
4. Vercel akan otomatis mendeteksi **Vite**.
5. Klik **"Deploy"**.

### ⚙️ Konfigurasi Backend
Jangan lupa untuk memastikan kode di `backend/code.gs` sudah terpasang di Google Apps Script Anda dan URL-nya sudah diperbarui di file `services/api.ts`.

---
*Developed with ❤️ for Education*
