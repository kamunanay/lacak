# MediaFire Phishing Simulator - Edukasi Keamanan Digital

Proyek ini adalah simulator phishing edukasi yang dibuat untuk meningkatkan kesadaran keamanan digital. Aplikasi ini mensimulasikan halaman download MediaFire yang meminta izin lokasi dan kamera secara otomatis, kemudian mengirimkan data tersebut ke bot Telegram.

## ⚠️ PERINGATAN PENTING
**Proyek ini hanya untuk tujuan edukasi dan kesadaran keamanan digital. Dilarang keras menggunakan tools ini untuk aktivitas ilegal atau berbahaya. Selalu dapatkan persetujuan dari target sebelum melakukan simulasi.**

## Fitur

- Antarmuka yang menyerupai halaman download MediaFire
- Akses lokasi perangkat secara otomatis
- Akses kamera perangkat secara otomatis
- Pengiriman data ke bot Telegram
- Token keamanan untuk verifikasi
- Responsif untuk berbagai perangkat

## Persyaratan Sistem

- Node.js (v14 atau lebih tinggi)
- Akun Telegram dan Bot Token dari @BotFather
- Akses ke Termux (jika dijalankan di Android)
- Akun GitHub untuk deploy

## Cara Install dan Jalankan

### 1. Install Node.js di Termux
```bash
pkg update && pkg upgrade
pkg install nodejs
pkg install git
