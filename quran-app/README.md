# 📖 Al-Quran Digital - Web Application

Aplikasi web modern untuk membaca dan mendengarkan Al-Quran dengan antarmuka yang elegan, responsif, dan user-friendly.

## ✨ Fitur Utama

- 📚 **Daftar Lengkap Surah** - 114 surah dengan informasi lengkap
- 🔊 **Audio Berkualitas Tinggi** - Streaming dari Mishari Al-Afasy
- 🔍 **Pencarian Surah** - Cari surah berdasarkan nama atau nomor
- 🌙 **Dark Mode** - Mode gelap untuk kenyamanan mata
- 📱 **Responsive Design** - Kompatibel dengan semua perangkat (mobile, tablet, desktop)
- ⌨️ **Keyboard Shortcuts** - Kontrol mudah menggunakan keyboard
- 💾 **Theme Preference Storage** - Menyimpan preferensi tema Anda

## 🚀 Cara Menggunakan

### 1. Buka Aplikasi
- Buka file `index.html` di browser modern (Chrome, Firefox, Safari, Edge)
- Atau akses melalui live server

### 2. Memilih Surah
- Klik pada surah di sidebar untuk memuat konten
- Gunakan kotak pencarian untuk menemukan surah dengan cepat
- Surah akan ditampilkan dengan teks Arab, transliterasi, dan terjemahan Indonesia

### 3. Mendengarkan Audio
- Klik tombol "Putar" pada ayat yang inginkan
- Atau gunakan tombol play di audio player
- Audio akan dimainkan dari Mishari Al-Afasy
- Atur volume sesuai kebutuhan

### 4. Kontrol Playback
- **Space** - Play/Pause
- **Klik Progress Bar** - Lompat ke waktu tertentu
- **Volume Slider** - Atur volume
- **Arrow Right** - Mainkan ayat berikutnya

### 5. Fitur Ayat
Untuk setiap ayat, Anda dapat:
- **Putar** - Dengarkan audio ayat
- **Salin** - Copy teks Arab ke clipboard
- **Bagikan** - Bagikan ayat ke media sosial atau aplikasi lain

## 📁 Struktur File

```
quran-app/
├── index.html      # File HTML utama
├── style.css       # Stylesheet
├── script.js       # JavaScript utama
├── sw.js          # Service Worker (offline support)
└── README.md      # Dokumentasi ini
```

## 🌐 API yang Digunakan

Aplikasi ini menggunakan API dari **https://api.quran.gading.dev**:
- **Base URL**: `https://api.quran.gading.dev`
- Response cepat: ~400ms average
- Single API request untuk semua data
- Audio URLs terintegrasi dengan fallback sources

**Endpoints**:
- `/surah` - Daftar semua 114 surah
- `/surah/{number}` - Konten surah lengkap dengan audio

### Data yang Tersedia dari API:
- Nomor dan nama Surah (Arab dan Inggris)
- Jumlah ayat  
- Tipe Revelasi (Makkiyah/Madaniyah)
- Teks Arab lengkap (Uthmani)
- Transliterasi Latin
- Terjemahan Indonesia
- Tafsir per-ayat (Bahasa Indonesia)
- **Audio URLs per-ayah** dengan primary + secondary fallback
- Metadata ayat (juz, page, sajda, etc.)

## 🎙️ Pembaca Al-Quran

**Mishari Al-Afasy** (Pembaca Pilihan - al-Qahira)
- Pembaca dengan suara yang merdu dan jelas
- Audio berkualitas tinggi dan stabil
- Kompatibel dengan semua surah

## 🎨 Fitur Desain

- ✅ Gradient backgrounds yang menarik
- ✅ Smooth animations dan transitions
- ✅ Shadow effects untuk depth
- ✅ Custom scrollbar styling
- ✅ Responsive grid layout
- ✅ Hover effects yang interaktif

## 🛠️ Teknologi yang Digunakan

- **HTML5** - Struktur markup
- **CSS3** - Styling dan animasi
- **JavaScript (ES6+)** - Logika dan interaktivitas
- **Fetch API** - AJAX requests ke API
- **Local Storage** - Penyimpanan preferensi
- **Service Worker** - Offline support

## 📦 Instalasi

1. Clone atau download folder `quran-app`
2. Buka file `index.html` di browser
3. Atau gunakan live server:
   ```bash
   # Menggunakan Live Server (VS Code)
   - Install extension Live Server
   - Right-click pada index.html
   - Pilih "Open with Live Server"
   ```

## ⚙️ Konfigurasi

### Audio Integration
Audio URLs gratis langsung dari API response (Al-Quran Cloud CDN). Setiap ayah memiliki:
```javascript
// Dari API response
ayah.audio = {
  primary: "https://cdn.alquran.cloud/media/audio/ayah/ar.alafasy/{ayahNumber}",
  secondary: [
    "https://cdn.islamic.network/quran/audio/128/ar.alafasy/{ayahNumber}.mp3",
    "https://cdn.islamic.network/quran/audio/64/ar.alafasy/{ayahNumber}.mp3"
  ]
}
```

Pembaca: **Mishari Al-Afasy** (Kuwait)

### Mengubah Color Scheme
Edit di `style.css` di bagian `:root`:
```css
:root {
  --primary: #2d5016;
  --accent: #ffc107;
  /* ... color variables lainnya */
}
```

## 🖥️ Kompatibilitas Browser

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## 📱 Responsive Breakpoints

- Desktop: > 900px
- Tablet: 768px - 900px
- Mobile: < 768px
- Small Mobile: < 480px

## 🚨 Troubleshooting

### Audio tidak terputar
- Periksa koneksi internet (audio dari server online)
- Buka DevTools (F12) → Console untuk melihat error messages
- Jika masih error, coba refresh halaman (Ctrl+Shift+R)

### Halaman lambat
- Gunakan browser yang lebih update
- Periksa kecepatan internet (audio streaming memerlukan koneksi baik)
- Tutup aplikasi lain yang menggunakan bandwidth

### Dark mode tidak tersimpan
- Pastikan Local Storage diaktifkan
- Coba refresh halaman
- Cek pengaturan privasi browser

## 📄 Lisensi

Aplikasi ini menggunakan data dari Al-Quran Cloud API yang bersifat gratis dan open-source.

## 🤝 Kontribusi

Untuk saran atau perbaikan, silakan buat issue atau pull request.

## 📞 Dukungan

Jika mengalami masalah, coba:
1. Buka Console (F12) untuk melihat error messages
2. Periksa koneksi internet
3. Try hard refresh (Ctrl+Shift+R)

## 🙏 Doa

Semoga aplikasi ini dapat membantu mempermudah kita dalam membaca dan mendengarkan Al-Quran. 

**Allahumma akhirna min Quranin kullo khair** 

---

**Created with ❤️ untuk Umat Islam**
