# Spec — `web-server`

Status: **spec aktif** — perilaku sistem sebagaimana terimplementasi dan terverifikasi.
Asal: delta change `add-cekdulu-chatbot`, diarsipkan pada Fase F7 (`docs/METODOLOGI.md` §3 Fase 5).
Kapabilitas: penyiapan server Express dan penyajian aset statis.

---

## Requirements

### `WS-01` — Server memuat environment variable dari `.env`

| Meta | Nilai |
|---|---|
| Sumber | S3 p.28 (`import 'dotenv/config';`), S2 p.32 & S3 p.27 (nama var) |
| Berkas | `index.js` |

Sistem WAJIB memuat environment variable dari file `.env` sebelum client Gemini
diinisialisasi, menggunakan `import 'dotenv/config';`.

Nama variabel yang dipakai WAJIB `GEMINI_API_KEY`.

> Catatan konflik: slide S3 p.43 menulis `process.env.API_KEY`. Repo ini memakai
> `GEMINI_API_KEY` sesuai S3 p.27, S3 p.28, dan S2 p.32. Keputusan di `AGENTS.md` §3.1.

#### Scenario: `.env` berisi API key
- **Given** file `.env` di root berisi `GEMINI_API_KEY=<nilai>`
- **When** server dijalankan dengan `node index.js`
- **Then** `process.env.GEMINI_API_KEY` terbaca oleh aplikasi
- **And** nilai key TIDAK PERNAH ditulis ke `console.log` atau output terminal

#### Scenario: nilai key tidak boleh bocor
- **Given** server sedang berjalan
- **When** terjadi error apa pun dan pesan error dikembalikan ke client
- **Then** pesan error TIDAK memuat nilai `GEMINI_API_KEY`

---

### `WS-02` — Client Gemini diinisialisasi dengan model tunggal terpusat

| Meta | Nilai |
|---|---|
| Sumber | S3 p.28; diamandemen oleh `design.md` D-15 dan `docs/KENDALA-API.md` §1 |
| Berkas | `index.js` |

Sistem WAJIB menginisialisasi client dengan
`new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })`.

Nama model WAJIB disimpan dalam satu konstanta `GEMINI_MODEL`, agar bisa diganti di satu
tempat (alasan eksplisit S3 p.28: "Mendefinisikan variabel global untuk model Gemini default
agar mudah diganti di satu tempat").

Nilai konstanta WAJIB dibaca dari environment variable `GEMINI_MODEL` dengan nilai bawaan
`"gemini-flash-latest"`:

```javascript
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-flash-latest';
```

Import yang dipakai WAJIB `import { GoogleGenAI } from '@google/genai';`.

> **Amandemen dari nilai materi.** Materi menetapkan literal `"gemini-2.5-flash"`
> (S2 p.34, S3 p.28). Pada 1 Agustus 2026 model tersebut mengembalikan HTTP 404 dengan
> pesan `This model models/gemini-2.5-flash is no longer available to new users` untuk akun
> yang baru dibuat. Bukti mentah dan hasil uji model alternatif tercatat di
> `docs/KENDALA-API.md` §1; alasan pemilihan pola environment variable tercatat sebagai
> keputusan D-15 di `design.md`.
>
> Pola ini menjaga materi tetap dapat diikuti: pemilik akun lama yang masih memiliki akses
> `gemini-2.5-flash` cukup menulis `GEMINI_MODEL=gemini-2.5-flash` di `.env` tanpa mengubah
> kode.

#### Scenario: inisialisasi client dengan nilai bawaan
- **Given** `GEMINI_MODEL` tidak diset di environment
- **When** modul `index.js` dievaluasi
- **Then** terdapat satu instance client Gemini bernama `ai`
- **And** konstanta `GEMINI_MODEL` bernilai `"gemini-flash-latest"`

#### Scenario: model ditimpa lewat environment
- **Given** `.env` memuat `GEMINI_MODEL=gemini-2.5-flash`
- **When** modul `index.js` dievaluasi
- **Then** konstanta `GEMINI_MODEL` bernilai `"gemini-2.5-flash"`
- **And** tidak ada perubahan kode yang diperlukan untuk itu

#### Scenario: model tidak tersedia bagi kunci API
- **Given** `GEMINI_MODEL` menunjuk model yang sudah ditutup Google
- **When** client mengirim permintaan ke `POST /api/chat`
- **Then** server merespons `500` dengan pesan galat dari SDK (`API-06`)
- **And** proses server tetap berjalan

#### Scenario: API SDK lama ditolak
- **Given** pengembang hendak menambah kode pemanggilan model
- **When** kode memakai `new GoogleGenerativeAI(...)` atau `getGenerativeModel(...)`
- **Then** kode tersebut DILARANG — itu API paket `@google/generative-ai`, bukan
  `@google/genai` yang dipakai materi

---

### `WS-03` — Middleware CORS dan JSON body parser aktif

| Meta | Nilai |
|---|---|
| Sumber | S3 p.28, p.43 |
| Berkas | `index.js` |

Sistem WAJIB memasang `app.use(cors())` dan `app.use(express.json())`.

`cors()` diperlukan agar frontend dapat berkomunikasi dengan backend tanpa masalah CORS
(alasan eksplisit S3 p.43). `express.json()` diperlukan agar body request JSON terparsing.

#### Scenario: request JSON terparsing
- **Given** server berjalan
- **When** client mengirim `POST /api/chat` dengan header `Content-Type: application/json`
  dan body JSON valid
- **Then** `req.body` berisi objek hasil parsing, bukan `undefined`

---

### `WS-04` — Aset frontend disajikan sebagai static dari `public/`

| Meta | Nilai |
|---|---|
| Sumber | S3 p.34, p.43 |
| Berkas | `index.js` |

Sistem WAJIB menyajikan folder `public/` di root path menggunakan
`app.use(express.static(path.join(__dirname, 'public')))`.

Karena proyek memakai ESM, `__dirname` tidak tersedia secara bawaan. Sistem WAJIB
membentuknya dengan pola dari S3 p.43:

```javascript
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

Import yang diperlukan: `path` dari `'path'`, `fileURLToPath` dari `'url'`.

#### Scenario: halaman chat dapat dibuka
- **Given** server berjalan dan `public/index.html` ada
- **When** pengguna membuka `http://localhost:3000/` di browser
- **Then** `public/index.html` dirender
- **And** `public/style.css` serta `public/script.js` termuat tanpa error 404

---

### `WS-05` — Server listen di port 3000 dengan log konfirmasi

| Meta | Nilai |
|---|---|
| Sumber | S3 p.28 (`const PORT = 3000`), S3 p.30 & p.44 (teks log) |
| Berkas | `index.js` |

Sistem WAJIB mendengarkan di port `3000`.

Saat server siap, sistem WAJIB menulis satu baris log yang memuat URL
`http://localhost:3000` agar pengguna tahu server hidup. Slide S3 p.30 dan p.44
menampilkan log `Gemini Chatbot running on http://localhost:3000`.

#### Scenario: server hidup
- **When** perintah `node index.js` dijalankan
- **Then** proses tidak keluar dengan error
- **And** terminal menampilkan satu baris log berisi `http://localhost:3000`
- **And** log TIDAK memuat nilai API key

---

## Catatan implementasi

Susunan `index.js` mengikuti urutan S3 p.43: import → setup `__dirname` → `express()` →
client Gemini + `GEMINI_MODEL` → middleware (`cors`, `json`, `static`) → route
`/api/chat` → `app.listen`.
