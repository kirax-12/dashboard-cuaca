# Dashboard Cuaca

**Demo live:** [dashboard-cuaca di GitHub Pages](https://kirax-12.github.io/dashboard-cuaca/)

Dashboard cuaca real-time untuk kota mana pun di dunia, dibuat oleh [Remike Dev](https://github.com/kirax-12).

Menggunakan [Open-Meteo](https://open-meteo.com) — API cuaca gratis yang tidak memerlukan API key dan tidak perlu backend.

## Fitur

- Cari kota mana pun (geocoding otomatis dari Open-Meteo)
- Cuaca saat ini: suhu, terasa seperti, kelembapan, kecepatan angin, zona waktu
- Prakiraan 7 hari: kondisi, suhu tertinggi/terendah, peluang hujan
- Kode cuaca WMO diterjemahkan ke Bahasa Indonesia
- Tampilan default: Jakarta
- Responsif untuk HP dan desktop

## Cara menjalankan

Buka `index.html` di browser (perlu koneksi internet untuk mengambil data cuaca), atau:

```bash
npx serve .
```

## Teknologi

HTML · CSS · JavaScript murni (Fetch API) · Open-Meteo Geocoding & Forecast API

## Lisensi

MIT
