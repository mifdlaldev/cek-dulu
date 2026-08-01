# MATERI-SESI-2.md — Eksplorasi Gemini AI API

> Sumber: `Sesi 2 - Materi Developers.pdf` (68 halaman) + `Sesi 2 - Instalasi Tools.pdf` (2 halaman).
> **Kode verbatim lengkap ada di `SPEC-API.md` §2** — file ini fokus pada narasi & konteks.

---

## Agenda (p.5)

- Pengenalan Gemini API
- Cara menggunakan API Gemini dan menginisialisasi model
- Cara menghasilkan output teks dari input teks, audio, dokumen, dan gambar
- Cara menggunakan API File

---

## 1. Persiapan Awal (p.7–9)

Checklist (p.8):
- Sudah terinstall Node.js v18+
- Akun Google Cloud dengan Gemini API
- Gemini API key
- Sudah terinstall VS Code
- Aset berupa Gambar, Dokumen dan file Audio

Verifikasi Node.js (p.9):

```bash
$ node -v
v23.7.0
```

---

## 2. Pengenalan Gemini API (p.10–17)

### Google AI Studio (p.11)

> Dengan menggunakan Google AI Studio, kita dapat mengakses API Gemini tanpa perlu
> pengaturan yang rumit. Kita dapat mengakses semua model Gemini dan memanfaatkannya
> dalam proyek kode kita.

Kemampuan yang bisa dimanfaatkan:
- Fine-tune dan memodifikasi model Gemini agar sesuai dengan tugas spesifik, mengenal pola data, dan memecahkan masalah.
- Terjemahkan bahasa biasa ke dalam kode atau data terstruktur menggunakan Pemanggilan Fungsi API Gemini.
- Menjawab pertanyaan, menghasilkan konten, mengklasifikasikan data, dan merangkum permintaan pengguna acak ke dalam tindakan spesifik.

Docs: `https://ai.google.dev/gemini-api/docs`

### Model-Model Gemini (p.13–16)

Tiga model utama + detail "Terbaik untuk" per model:

**Gemini 2.5 Pro** (p.14) — Terbaik untuk:
- Penalaran kompleks dan pembuatan kode
- Penyuntingan teks dan pemecahan masalah
- Ekstraksi data tingkat lanjut
- Penanganan file besar dan input multi-modal (audio, gambar, video, dan teks)
- Tugas pengkodean tingkat enterprise

**Gemini 2.5 Flash** (p.15) — Terbaik untuk:
- Task real-time, dengan throughput yang tinggi
- Input multi-modal (audio, gambar, video, dan teks)
- Model paling hemat biaya yang mendukung permintaan volume tinggi
- Skenario di mana Anda membutuhkan keseimbangan antara kualitas dan kecepatan

> **Disclaimer (p.15):** Untuk sesi praktik langsung (hands-on), kita akan menggunakan
> Gemini 2.5 Flash karena merupakan model yang paling hemat biaya, dengan performa yang
> cepat dan fleksibel, sehingga cocok untuk kebutuhan API secara real-time dan
> permintaan dalam jumlah besar.

**Gemini 2.5 Flash-Lite** (p.16) — Terbaik untuk:
- Tugas teks sederhana atau berkinerja tinggi
- Kasus penggunaan dengan batasan anggaran atau sumber daya yang ketat
- Penyebaran yang dapat diskalakan yang membutuhkan volume besar dan respons cepat

Catatan slide (p.13): Gemini versi 3 sudah tersedia, namun masih berupa preview/percobaan.

Tabel model ID resmi (p.12) → `FAKTA-TERVERIFIKASI.md` §H.

### Mendapatkan API Key (p.17)

> Untuk menggunakan API Gemini, Anda perlu mendapatkan API Key terlebih dahulu.
> Klik tombol "Create API Key" untuk membuat API Key dari project yang ada.

URL: `https://aistudio.google.com/u/0/api-keys`
Callout slide: **"Salin API Key untuk hands-on nanti"**
Screenshot menampilkan kolom: Key, Project, Created on, Quota tier (Free tier).

---

## 3. Menginisialisasi Model (p.18–21)

Install (p.19):

```bash
npm install @google/genai
```

Dari docs resmi yang dikutip slide p.19:
> Using Node.js v18+, install the Google Gen AI SDK for TypeScript and JavaScript
> using the following npm command.

Inisialisasi model (p.20):
> Inisialisasi model dengan import dari **GoogleGenAI**. Jika Anda ingin mengganti
> **model**, Anda dapat melakukannya dengan menyesuaikan properti model di dalam
> fungsi **generateContent**.

Slide juga menampilkan catatan docs Google:
> If you set your API key as the environment variable `GEMINI_API_KEY`, it will be
> picked up automatically by the client when using the Gemini API libraries.
> Otherwise you will need to pass your API key as an argument when initializing the client.

Fungsi `generateContent` (p.21):
> Untuk melakukan perintah teks, gunakan fungsi **generateContent** dan masukkan
> perintah yang diinginkan.

Kode verbatim kedua contoh → `SPEC-API.md` §1.

---

## 4. Tentang Proyek (p.23–28)

Peran tools (p.25) → `FAKTA-TERVERIFIKASI.md` §H.

Brief proyek (p.26) → `FINAL-PROJECT.md` §1.

Deskripsi teknis (p.27):
> Proyek ini adalah API RESTful yang dibangun dengan ExpressJS yang terintegrasi
> dengan Google Gemini 2.5 Flash untuk menghasilkan respons berbasis teks menggunakan
> berbagai tipe input: Teks biasa, Berkas gambar, Berkas dokumen (misalnya PDF, TXT),
> Berkas audio (misalnya MP3, WAV).
> Ini berfungsi sebagai middleware antara permintaan klien (misalnya melalui Postman)
> dan API AI Gemini.

---

## 5. Setup Proyek (p.30–32)

Perintah setup, `package.json`, struktur file, dan `.env` → `SPEC-API.md` §2.1–2.3.

Catatan penting soal folder `uploads/` (p.32, verbatim):
> - Folder `uploads/` yang ditampilkan pada struktur file diatur secara otomatis oleh
>   multer, sebuah middleware yang digunakan untuk mengatur multipart/form-data di Express.
> - Tidak perlu untuk membuat atau mengubah folder `uploads` secara manual — folder
>   tersebut akan dibuat secara dinamis oleh multer, ketika file diupload melalui API.

⚠️ **Tapi kode aktual p.34 pakai `multer()` tanpa opsi = memory storage, dan p.56
mengonfirmasi tidak ada penyimpanan ke disk.** Lihat `AGENTS.md` §3.3.

---

## 6. Konfigurasi `index.js` (p.33–35)

Fungsi file (p.34):
> File `index.js` berfungsi sebagai pengendali utama (central controller) dari aplikasi.
> File ini menginisialisasi server Express dan mendefinisikan berbagai route untuk
> menangani permintaan API, termasuk permintaan dengan input teks, gambar, audio, dan
> dokumen menggunakan Gemini 2.5 Flash API.

Yang dilakukan blok setup (p.35, verbatim):
- Memuat environment variables dari file `.env` (termasuk API key).
- Mengimpor library penting untuk: pembuatan server (`express`), upload file (`multer`), pengelolaan file (`fs/promises`), integrasi dengan Gemini AI (`@google/genai`).
- Menginisialisasi aplikasi Express dan mengatur Multer agar menyimpan file yang di-upload ke folder `uploads/`.
- Membuat client Gemini AI menggunakan API key, serta menetapkan model ke `gemini-2.5-flash`.
- Mengonfigurasi Express agar dapat menerima request berformat JSON.
- Menjalankan server pada port 3000.

Kode verbatim kedua versi (p.34 dan p.35) → `SPEC-API.md` §2.4.

---

## 7. Empat Endpoint (p.38–54)

Kode verbatim semua endpoint → `SPEC-API.md` §2.5–2.8.

| # | Endpoint | Method | Body | Key file | Halaman kode | Halaman uji |
|---|---|---|---|---|---|---|
| 1 | `/generate-text` | POST | raw JSON `{ prompt }` | — | p.39 | p.41 |
| 2 | `/generate-from-image` | POST | form-data | `image` (File) + `prompt` (Text) | p.43 | p.45 |
| 3 | `/generate-from-document` | POST | form-data | `document` (File) | p.47 | p.49 |
| 4 | `/generate-from-audio` | POST | form-data | `audio` (File) | p.52 | p.54 |

Cara run (p.40, p.44, p.48, p.53):

```
$ node index.js
Gemini API server is running at http://localhost:3000
```

Alur langkah demi langkah `/generate-text` (p.39, verbatim):
1. Server menerima prompt teks dari body request client.
2. Server memanggil model Gemini AI dengan prompt tersebut.
3. Model memproses prompt dan menghasilkan respons.
4. Server mengirimkan hasil generate ke client dalam format JSON.
5. Jika terjadi kesalahan di tahap mana pun, server mengembalikan respons HTTP 500 dengan pesan error yang menjelaskan masalahnya.

⚠️ Screenshot Postman p.41/45/49/54 menampilkan `{"output": "..."}` sedangkan kode
mengembalikan `{ result: ... }`. Ikuti kode. Lihat `AGENTS.md` §3.4.

⚠️ Slide p.54 menulis key form-data audio sebagai `document`. Yang benar `audio`.
Lihat `AGENTS.md` §3.5.

File dummy untuk hands-on: `https://bit.ly/dummy-prd` (p.37).

---

## 8. Penggunaan File API (p.55–56)

Verbatim p.56:
> Untuk memungkinkan Gemini AI menghasilkan output dari file yang diupload—seperti
> gambar, dokumen, dan audio, kita membuat endpoint khusus yang menerima upload file
> menggunakan multer sebagai middleware multipart/form-data di Express. Pada
> implementasi ini, file diproses langsung dari memory buffer sesuai format input Gemini:
>
> - File gambar diambil dari `req.file.buffer`, dikonversi ke Base64, lalu dikirim ke Gemini sebagai `inlineData` bersama prompt teks untuk input multimodal.
> - File dokumen (PDF, TXT, dan sejenisnya) juga dikonversi ke Base64 dari buffer, dibungkus dalam objek `inlineData` dengan MIME type yang sesuai, lalu dikirim ke Gemini dengan prompt (atau instruksi default jika tidak ada).
> - File audio diproses dengan cara yang sama: dikonversi ke Base64 dari buffer dan dikirim sebagai `inlineData` bersama prompt seperti permintaan transkrip atau analisis audio.
>
> Setiap endpoint menangani pembacaan input, konversi Base64, pemanggilan model melalui
> `generateContent()`, dan mengembalikan hasil output ke client tanpa perlu menghapus
> file karena tidak ada penyimpanan ke disk.

---

## 9. Alternatif: Memahami Kode dengan Gemini Code Assist (p.57–58)

Slide p.58 menampilkan sesi Gemini Code Assist menjelaskan endpoint `/generate-text`
baris per baris, plus helper `extractText()` yang tidak ada di kode utama slide.
Kode helper verbatim → `SPEC-API.md` §2.10.

Penjelasan Gemini di slide (verbatim sebagian):
> This block of code is an Express.js route handler for a POST request to the
> `/generate-text` endpoint. Its purpose is to take a text prompt from a user, get a
> response from the Gemini AI, and send that response back.

---

## 10. Pengumpulan Proyek (p.60–62)

`.gitignore` (p.61) dan perintah git (p.62) → `SPEC-API.md` §6–7.

Alasan `.gitignore` (p.61, verbatim):
> `/node_modules` dan `package-lock.json` dikecualikan karena folder dan file ini dapat
> di generate ulang dari file `package.json` dengan `npm install`.
> `.env` dikecualikan karena file ini berisi gemini api key yang sifatnya rahasia.

Catatan p.62: **"Project akan dikumpulkan pada sesi 3 setelah sudah membuat User Interface nya."**

---

## 11. Kesimpulan Sesi 2 (p.64)

Verbatim:
> Dalam sesi ini, kita telah membangun pondasi kuat tentang cara mengintegrasikan
> Gemini AI ke dalam RESTful API menggunakan ExpressJS, serta cara berinteraksi
> dengannya melalui berbagai jenis input—teks, gambar, dokumen, dan audio.

Poin Penting (Key Takeaways):
- Mempelajari cara menyiapkan project Node.js + ExpressJS yang terintegrasi dengan Gemini 2.5 Flash.
- Mengimplementasikan pengelolaan API key secara aman menggunakan file `.env`.
- Membangun endpoint API untuk:
  - `/generate-text` untuk prompt berbasis teks.
  - `/generate-from-image` untuk prompt teks dengan file gambar berformat Base64.
  - `/generate-from-document` untuk prompt teks dengan file dokumen berformat Base64.
  - `/generate-from-audio` untuk prompt teks dengan file audio berformat Base64.
- Menggunakan multer untuk menangani upload file dengan direktori `uploads/` yang dikelola otomatis.
- Mengonversi file ke format yang kompatibel dengan Gemini (misalnya `inlineData` dan MIME type).
- Memahami cara mengkombinasikan prompt + file sebagai input multimodal untuk metode `generateContent()` pada Gemini.

Quiz 2: `https://bit.ly/quiz2-developers`, due hari itu 23.59 WIB (p.66).

Teaser Sesi 3 (p.67): "Di Session 3, kita akan Bikin tampilan Chatbot yang tadi sudah
dibuat!" + 3 contoh **"Hasil karya batch sebelumnya!"** (detail di `FINAL-PROJECT.md` §5).
