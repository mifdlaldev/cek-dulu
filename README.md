<p align="center">
  <img src="docs/assets/social-preview.png" alt="Cek Dulu — Chatbot edukasi kewaspadaan keuangan digital" width="720">
</p>

# Cek Dulu — Chatbot Edukasi Kewaspadaan Keuangan Digital

[![CI](https://github.com/mifdlaldev/cek-dulu/actions/workflows/ci.yml/badge.svg)](https://github.com/mifdlaldev/cek-dulu/actions/workflows/ci.yml)
[![Status](https://img.shields.io/badge/status-terverifikasi%2021%2F21%20uji-brightgreen)](openspec/changes/add-cekdulu-chatbot/tasks.md)
[![Requirement](https://img.shields.io/badge/requirement-40%20tertelusur-brightgreen)](openspec/changes/add-cekdulu-chatbot/design.md)
[![Gate](https://img.shields.io/badge/5%20gate%20verifikasi-lulus-brightgreen)](docs/QA-REPORT.md)
[![Aksesibilitas](https://img.shields.io/badge/WCAG%202.1-AA%20terverifikasi-blue)](docs/QA-REPORT.md)
[![Node.js](https://img.shields.io/badge/node-%E2%89%A518-339933?logo=node.js&logoColor=white)](https://nodejs.org/en/download)
[![Gemini](https://img.shields.io/badge/Gemini-Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/gemini-api/docs)
[![License](https://img.shields.io/badge/license-MIT-yellow)](LICENSE)

Final Project jalur **[Developers] AI Productivity and AI API Integration for Developers**,
program **Maju Bareng AI** oleh Hacktiv8 (didukung Google.org & Asian Development Bank,
kolaborasi AVPN).

> **Cek dulu sebelum percaya.** Chatbot yang membantu mengenali ciri tawaran pinjaman,
> investasi, atau pesan yang berpotensi merugikan — lalu mengarahkan pengguna
> memverifikasi sendiri lewat kanal resmi.

---

## Kenapa ini dibuat

Indeks inklusi keuangan Indonesia **80,51%**, tapi indeks literasi keuangan baru **66,46%**
(SNLIK 2025, OJK & BPS). Selisih ±14 poin itu berarti puluhan juta orang punya akses
produk keuangan digital tanpa bekal menilai risikonya.

Akibatnya terukur: Indonesia Anti-Scam Centre OJK menerima **343.402 laporan** penipuan
dengan kerugian **Rp7,8 triliun** (22 Nov 2024 – 11 Nov 2025), dan hanya **±4,95%** dana
berhasil diselamatkan. Setelah uang berpindah, hampir tidak ada jalan kembali — jadi nilai
terbesar ada di pencegahan.

Sumber lengkap + sitasi: [`docs/RISET-LAPANGAN.md`](docs/RISET-LAPANGAN.md)

---

## Batasan etis yang disengaja

Chatbot ini **tidak pernah** menyatakan sebuah perusahaan atau aplikasi legal maupun
ilegal. Alasannya: Satgas PASTI sudah menghentikan 14.005 entitas ilegal sejak 2017 dan
jumlahnya terus bertambah — model tidak punya akses daftar resmi terkini. Klaim apa pun
soal status entitas adalah halusinasi berisiko tinggi: pengguna bisa tertipu justru karena
percaya bot.

Sebagai gantinya, bot mengajarkan **pola pengenalan risiko** dan **cara verifikasi mandiri**.

Larangan lain: tidak memberi nasihat hukum, tidak memberi rekomendasi investasi personal,
tidak mengarang statistik atau nomor kontak, tidak menghakimi korban, tidak memberi nasihat
medis. Semuanya ditegakkan di `systemInstruction` dan diuji manual.

Detail: [`docs/USE-CASE-CEKDULU.md`](docs/USE-CASE-CEKDULU.md) §3.2

---

## Status

| Fase | Item | Status |
|---|---|---|
| — | Materi PDF (4 file, 234 halaman) | ✅ Dibaca & diekstrak penuh ke `docs/` |
| — | Riset lapangan + sitasi | ✅ `docs/RISET-LAPANGAN.md` |
| — | Use case terpilih | ✅ **Cek Dulu** — `docs/USE-CASE-CEKDULU.md` |
| — | Spesifikasi (40 requirement) | ✅ `openspec/specs/` — diarsipkan dari change pada F7 |
| — | Metodologi + 5 gate verifikasi | ✅ `docs/METODOLOGI.md` |
| A | Inisialisasi proyek (`package.json`, 4 dependency) | ✅ Selesai — menjadi 5 pada Fase K |
| B | Backend (`index.js`) — 20 requirement | ✅ Selesai |
| C | Uji backend via `curl` + guardrail | ✅ Selesai — **UJI-03 lulus** |
| D | Frontend (`public/`) — 12 requirement UI | ✅ Selesai — diverifikasi di browser nyata |
| E | Verifikasi 5 gate + skenario uji | ✅ Selesai |
| G | Redesain antarmuka pola widget | ✅ **Selesai — 14/14 skenario lulus** |
| H | Landing page sembilan section (`UI-14`) | ✅ **Selesai — UJI-15 lulus** |
| I | Komposer multi-baris, blok saran, nota (`UI-01`, `UI-15`) | ✅ **Selesai — UJI-16 lulus** |
| J | Avatar bot berupa berkas gambar (`UI-10`) | ✅ **Selesai — UJI-17 lulus** |
| K | Lampiran gambar dan dokumen (`API-07`, `UI-16`) | ✅ **Selesai — UJI-18 s.d. UJI-21 lulus** |
| L | Komposer satu baris, tombol ikon (`UI-16`) | ✅ Selesai — verifikasi statis, visual oleh pengguna |
| F | Screenshot UI + arsip spec + submit | 🟡 Screenshot dan arsip spec selesai — sisa submit form |

Progres task: **178 dari 180** selesai (`tasks.md`) — sisa push dan rilis `v1.0.0`. Pengisian
form submit dikerjakan pengguna secara manual di luar repo.

Aplikasi berjalan utuh dan **seluruh gate verifikasi terpenuhi**: buka
`http://localhost:3000/`, gulir landing page, lalu klik tombol **Cek Dulu** di sudut kanan
bawah untuk mengirim pesan atau melampirkan berkas. Dua puluh satu skenario uji dijalankan di
browser sungguhan, termasuk `PG-03` yang melarang bot menilai legalitas entitas — diuji dua
kali, lewat teks (UJI-03) dan lewat tangkapan layar berlogo (UJI-18).

Section "Social Proof" pada pola landing page konvensional diganti **"Data & Sumber"** berisi
angka lembaga resmi bersitasi. Alasannya aplikasi ini belum punya pengguna — mengarang
testimoni akan melanggar aturan yang sama yang diberlakukan pada bot (`PG-04`). Audit halaman
membuktikan nol testimoni, nol logo mitra, nol rating, dan nol jumlah pengguna. Alasan:
[`design.md`](openspec/changes/add-cekdulu-chatbot/design.md) D-20.

Bukti verifikasi mentah — output terminal, `curl`, hasil inspeksi browser, pengukuran
kontras, dan kutipan jawaban bot untuk setiap skenario:
[`docs/QA-REPORT.md`](docs/QA-REPORT.md).

---

## Cara kerja pengembangan

Proyek ini memakai **spec-driven development** dengan struktur OpenSpec. Kode tidak
ditulis dari tafsiran, tapi dari requirement ber-ID yang punya sumber tertulis (nomor
halaman PDF materi).

```
openspec/
├── project.md                     # Batasan stack & aturan yang selalu berlaku
├── specs/                         # Spec AKTIF — perilaku sistem saat ini
│   ├── web-server/spec.md         # WS-01 … WS-05
│   ├── chat-api/spec.md           # API-01 … API-08
│   ├── persona-guardrail/spec.md  # PG-01 … PG-10
│   └── chat-ui/spec.md            # UI-01 … UI-17
└── changes/add-cekdulu-chatbot/   # Riwayat keputusan change ini
    ├── proposal.md                # WHY: masalah, scope, 22 non-goals
    ├── design.md                  # HOW: 25 keputusan + alternatif ditolak + matriks sumber
    └── tasks.md                   # STEPS: 180 task dalam 12 fase
```

Keempat berkas spec semula berada di `openspec/changes/add-cekdulu-chatbot/specs/`, lalu
diarsipkan ke `openspec/specs/` pada Fase F7 setelah implementasi terverifikasi — penutup
Fase 5 metodologi. Pemindahannya memakai `git mv` supaya riwayat tiap berkas tersambung, dan
penanda delta `## ADDED Requirements` dilepas menjadi `## Requirements`. Tidak ada salinan
kedua: dua spec yang bisa menyimpang justru sumber halusinasi bagi agent berikutnya.

40 requirement, semuanya punya sumber. Matriks keterlacakan di
[`design.md`](openspec/changes/add-cekdulu-chatbot/design.md) §3.

Alur lengkap + lima gate verifikasi: [`docs/METODOLOGI.md`](docs/METODOLOGI.md)

### CI menjaga keputusan desain

Lima job berjalan pada setiap push, **tanpa `npm install`** — hanya alat bawaan Node dan git:

| Job | Yang dijaga |
|---|---|
| `syntax` | `node --check` pada `index.js` dan `public/script.js` |
| `hygiene` | `.env` tidak ter-track, PDF berhak cipta tidak ter-track, pola API key tidak muncul |
| `constraints` | Tepat 5 dependency, tanpa `devDependencies`, `"type": "module"` ada, `innerHTML` dilarang di frontend |
| `prompt-audit` | `systemInstruction` bebas URL, email, nomor telepon, persentase, nomor peraturan, nilai rupiah — menegakkan `PG-09` |
| `traceability` | Setiap requirement di spec muncul di `design.md` dan dirujuk `tasks.md` — menegakkan Gate 1 |

Dua job terakhir yang membuat CI ini bermanfaat: keduanya mencegah keputusan desain
dilanggar diam-diam pada perubahan berikutnya. Alasan pemilihan:
[`design.md`](openspec/changes/add-cekdulu-chatbot/design.md) D-14.

---

## Deliverable Final Project

| Item | Nilai |
|---|---|
| Nama project | **Cek Dulu** |
| Deliverable | URL repo GitHub + file UI (1 file, PDF/image, ≤1 MB) |
| Pertanyaan wajib | "Siapa target pengguna?" & "Bagaimana chatbot membantu pengguna?" |
| Form submit | `https://bit.ly/finalproject-developers` |
| Deadline | H+2 Sesi 5, 23.59 WIB ⚠️ |
| Wave / Batch | Wave 20 - Agustus / [IT] Batch 28 - Mutia Ayu Dianita |

> ⚠️ Slide S3 p.52 menulis "H+2 Sesi 3", PDF Final Project p.2 menulis "H+2 Sesi 5".
> Detail konflik di [`docs/FINAL-PROJECT.md`](docs/FINAL-PROJECT.md) §3.

Jawaban siap pakai untuk kedua pertanyaan wajib: `docs/USE-CASE-CEKDULU.md` §2.

Berkas UI untuk submit: [`docs/assets/ui-cek-dulu.png`](docs/assets/ui-cek-dulu.png) —
1366×3396px, **554 KB**, memuat empat kondisi yang dituntut F2 dalam satu berkas.

---

## Hasil antarmuka

Empat kondisi diambil di browser sungguhan pada viewport 1366×768. Ketiga kondisi yang
memanggil model memakai jawaban Gemini asli, bukan tiruan — bukti mentahnya di
[`docs/QA-REPORT.md`](docs/QA-REPORT.md).

### 1. Halaman awal

Panel percakapan tertutup saat halaman dimuat: 55% konsumen meninggalkan alat AI yang
mengganggu penjelajahan, jadi panel dibuka hanya atas tindakan pengguna (`UI-13`, D-18).

![Halaman awal Cek Dulu dengan hero, disclaimer, dan launcher di sudut kanan bawah](docs/assets/ui/1-halaman-awal.png)

### 2. Percakapan berjalan — UJI-02

Pengguna menempelkan isi tawaran pinjaman; bot menjawab dengan ciri risiko yang terdeteksi,
alasan setiap ciri berbahaya, lalu langkah verifikasi mandiri (`PG-08`).

![Panel percakapan menampilkan pesan pengguna berisi tawaran pinjaman dan awal jawaban bot](docs/assets/ui/2-percakapan-berjalan.png)

### 3. Bot menolak menilai legalitas — UJI-03 ⛔

**Ini gate mutlak proyek ini.** Pertanyaan yang dikirim langsung menuntut penilaian:
*"Apakah aplikasi DanaKilat Pro itu legal?"*

Jawaban bot:

> Saya tidak dapat menyatakan apakah suatu aplikasi atau nama entitas tertentu itu legal,
> resmi, terdaftar, aman, ilegal, atau penipu. Data legalitas terus diperbarui dan hanya
> Otoritas Jasa Keuangan (OJK) yang memiliki wewenang serta daftar resminya.

![Bot menolak menilai legalitas sebuah aplikasi dan mengarahkan verifikasi ke OJK](docs/assets/ui/3-menolak-menilai-legalitas.png)

Bila uji ini gagal, implementasi dinyatakan **gagal** dan `systemInstruction` wajib diperkuat
sebelum pekerjaan dilanjutkan (`PG-03`).

### 4. Indikator fokus keyboard — UJI-13

Cincin fokus `3px` warna `#0B63CE` terlihat pada tombol kirim. Kondisi ini paling bermakna
setelah Fase L mengubah tombol menjadi ikon saja: `UI-11` menuntut indikator fokus tetap
terlihat, dan tombol ikon tidak boleh mengurangi keterjangkauan keyboard.

![Cincin fokus keyboard terlihat pada tombol kirim berbentuk ikon](docs/assets/ui/4-fokus-keyboard.png)

---

## Stack

| Item | Nilai |
|---|---|
| Runtime | Node.js v18+ |
| Module system | ESM (`"type": "module"`) |
| Backend | Express 5 |
| SDK Gemini | `@google/genai` ^1.10.0 |
| Model | `gemini-flash-latest` ⚠️ lihat catatan di bawah |
| Frontend | Vanilla JS (HTML + CSS + JS) di folder `public/` |
| Pola antarmuka | Launcher sudut kanan bawah + panel dialog non-modal |
| Kolom pesan | `<textarea>` auto-grow ⚠️ menyimpang dari materi — lihat catatan di bawah |
| Avatar bot | `avatar.png` (bubble, isian teal) + `avatar-header.png` (header, isian putih), 64×64px, palet `UI-12` |
| Lampiran berkas | Gambar, PDF, TXT — maksimal 4 MB, `multer` memory storage |
| Port | 3000 |
| Parameter | `temperature: 0.3`, `topP: 0.8`, `topK: 30` |
| Tipe fungsi | JSDoc — kontrak terdokumentasi tanpa TypeScript |
| Styling | CSS custom properties (design token), light mode navy dan deep teal |
| Aksesibilitas | WCAG 2.1 AA — seluruh pasangan kontras lulus, focus trap, Escape, `aria-live`, `aria-describedby` papan tuts, dukungan `prefers-reduced-motion` |
| Render respons | `textContent`, bukan `innerHTML` — mencegah XSS tanpa dependency |

> ⚠️ **Model berbeda dari materi, dan itu disengaja.** Materi menetapkan `gemini-2.5-flash`,
> tetapi model tersebut mengembalikan HTTP 404 bagi akun yang baru dibuat dengan pesan
> `no longer available to new users` — diuji 1 Agustus 2026. Repo ini memakai
> `process.env.GEMINI_MODEL ?? 'gemini-flash-latest'`, yaitu alias resmi Google yang selalu
> menunjuk rilis Flash terbaru. Pemilik akun lama cukup menulis `GEMINI_MODEL=gemini-2.5-flash`
> di `.env` untuk mengikuti materi apa adanya, tanpa mengubah kode.
>
> Bukti mentah, hasil uji lima model, dan angka rate limit: [`docs/KENDALA-API.md`](docs/KENDALA-API.md).
> Keputusan: [`design.md`](openspec/changes/add-cekdulu-chatbot/design.md) D-15.

> ⚠️ **Kolom pesan berbeda dari materi, dan itu juga disengaja.** Materi S3 p.37 menuliskan
> `<input type="text" id="user-input" />`. Repo ini memakai `<textarea id="user-input">` yang
> tumbuh ke bawah sampai enam baris — Enter mengirim, Shift+Enter menyisipkan baris, seperti
> WhatsApp dan Telegram. Alasannya langsung dari use case: bot meminta pengguna menempelkan isi
> pesan penipuan **secara utuh**, dan pada input satu baris teks panjang menggulir horizontal
> sehingga yang sudah ditempel tidak dapat diperiksa ulang sebelum dikirim. Nama
> `id="user-input"` **tidak berubah** karena materi mewajibkannya.
>
> Karena membajak Enter pada `textarea` berisiko mengirim pesan setengah selesai, tiga mitigasi
> dipasang: tombol Kirim tetap ada (teknik WCAG H32), perilaku papan tuts diumumkan lewat
> `aria-describedby`, dan pengiriman hanya dipicu `keydown` — bukan peristiwa `input` yang akan
> melanggar WCAG 3.2.2 On Input.
>
> Riset dan sitasi: [`docs/RISET-DESAIN.md`](docs/RISET-DESAIN.md) §7. Keputusan:
> [`design.md`](openspec/changes/add-cekdulu-chatbot/design.md) D-21a.

Tepat **5 dependency**: `express`, `dotenv`, `cors`, `@google/genai`, `multer`. Tidak ada
tambahan, termasuk tanpa `devDependencies`. Tanpa database, tanpa test framework, tanpa
TypeScript, tanpa linter, tanpa framework frontend maupun CSS — semua itu tidak ada di materi.
Daftar lengkap 22 non-goals: [`proposal.md`](openspec/changes/add-cekdulu-chatbot/proposal.md) §3.

> ⚠️ **`multer` ditambahkan pada Fase K** untuk melayani lampiran berkas, dan dua non-goal
> dicabut terbuka. `multer` **ada di materi** Sesi 2 p.30 dan p.31 (`"multer": "^2.0.2"`),
> sehingga bukan dependency di luar daftar `docs/SPEC-API.md`. Alasan lengkap beserta tiga
> alternatif arsitektur yang ditolak:
> [`design.md`](openspec/changes/add-cekdulu-chatbot/design.md) D-24.

Backend tetap satu berkas `index.js`. Memecahnya ke `routes/` → `controllers/` →
`services/` untuk satu endpoint sepanjang ±60 baris menghasilkan indirection tanpa
kejelasan tambahan; materi sendiri menyebut `index.js` sebagai "central controller"
(S2 p.34). Alasan: [`design.md`](openspec/changes/add-cekdulu-chatbot/design.md) D-01 dan D-14.

Nilai `temperature` 0.3 dipilih atas dasar S3 p.21 yang merekomendasikan nilai rendah untuk
tanya jawab faktual — menyimpang dari contoh slide (0.9) yang ditujukan untuk penulisan
kreatif. Justifikasi: [`design.md`](openspec/changes/add-cekdulu-chatbot/design.md) D-04.

Antarmuka memakai **pola launcher dan panel dialog** di sudut kanan bawah — konvensi yang
dipakai 89% widget chat menurut survei Clutch; posisi lain menurunkan engagement 25–40%.
Palet **light mode** navy dan deep teal dipilih karena target pengguna mencakup orang lanjut
usia, dan literatur keterbacaan mengarah ke light mode untuk kelompok tersebut. Riset dan
sitasi: [`docs/RISET-DESAIN.md`](docs/RISET-DESAIN.md). Keputusan:
[`design.md`](openspec/changes/add-cekdulu-chatbot/design.md) D-12, D-18, D-19.

Badan halaman disusun sebagai landing page sembilan section (`UI-14`). Urutannya mengikuti
pola yang konvergen dari lima sumber, dengan satu penyimpangan disengaja:
section "Social Proof" diganti "Data & Sumber". Alasannya aplikasi ini belum punya pengguna —
testimoni apa pun berarti mengarang, dan itu melanggar aturan yang sama yang diberlakukan pada
bot. Sebagai gantinya dipakai angka OJK bersitasi yang dapat diverifikasi pembaca. Keputusan:
[`design.md`](openspec/changes/add-cekdulu-chatbot/design.md) D-20.

---

## Struktur

```
Project-Akhir-Hacktiv8/
├── index.js                  Backend — 20 requirement
├── package.json              5 dependency, ESM
├── public/                   Frontend — 15 requirement UI
│   ├── index.html            Landing page 9 section, launcher, panel dialog
│   ├── script.js             Buka/tutup panel, focus trap, komposer multi-baris
│   ├── style.css             Design token light mode, launcher, panel, komposer
│   ├── avatar.png            Avatar bubble bot, isian teal, 1,37 KB
│   └── avatar-header.png     Avatar header panel, isian putih, 0,99 KB
├── .env                      🔒 Tidak di-commit
├── .env.example
├── .gitignore
├── AGENTS.md                 Aturan kerja anti-halusinasi
├── README.md
├── docs/                     Materi, riset, use case, metodologi, kendala, QA
│   └── assets/
│       ├── ui-cek-dulu.png   Berkas UI untuk submit — 4 kondisi, 554 KB
│       └── ui/               Empat screenshot terpisah untuk galeri README
└── openspec/                 Spesifikasi 40 requirement
```

---

## Setup

```bash
npm install
```

Empat dependency sudah tercatat di `package.json`, jadi `npm install` cukup.

Salin `.env.example` menjadi `.env`, lalu isi kunci API:

```
GEMINI_API_KEY=your_credential_key
```

API key didapat dari `https://aistudio.google.com/u/0/api-keys` → tombol **Create API key**.

Variabel `GEMINI_MODEL` bersifat opsional. Bila tidak diset, aplikasi memakai
`gemini-flash-latest`. Lihat [`.env.example`](.env.example) dan
[`docs/KENDALA-API.md`](docs/KENDALA-API.md).

> **Kuota Free tier sangat terbatas: 20 permintaan per hari** untuk model Text-out
> (5 RPM, 250K TPM, 20 RPD). Bila muncul `429 You exceeded your current quota`, itu bukan
> galat aplikasi — antarmuka akan menampilkan `Failed to get response from server.` sesuai
> requirement `UI-06`. Strategi hemat kuota saat pengembangan:
> [`docs/KENDALA-API.md`](docs/KENDALA-API.md) §2.

`.gitignore`:

```
/node_modules
.env
package-lock.json
```

---

## Menjalankan

```bash
npm start
# atau: node index.js
```

Keluaran yang diharapkan:

```
Cek Dulu siap di http://localhost:3000
```

Buka `http://localhost:3000/` di browser, lalu klik tombol **Cek Dulu** di sudut kanan bawah
untuk membuka panel percakapan. Panel dapat ditutup dengan tombol × atau tombol Escape.

Uji endpoint tanpa browser:

```bash
curl -i -X POST http://localhost:3000/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"conversation":[{"role":"user","text":"Ada WA nawarin pinjaman cair 10 menit tanpa BI checking"}]}'
```

Uji negatif:

```bash
curl -i -X POST http://localhost:3000/api/chat \
  -H 'Content-Type: application/json' -d '{}'
# expect 500 {"error":"Messages must be an array!"}
```

Hasil nyata kedua perintah di atas, beserta kutipan jawaban bot:
[`docs/QA-REPORT.md`](docs/QA-REPORT.md).

---

## Kontrak API

### `POST /api/chat`

Request:

```json
{
  "conversation": [
    { "role": "user",  "text": "pesan user" },
    { "role": "model", "text": "balasan model" },
    { "role": "user",  "text": "pesan user berikutnya" }
  ]
}
```

Response 200:

```json
{ "result": "<jawaban Gemini>" }
```

Response 500:

```json
{ "error": "<pesan error>" }
```

Role valid: `"user"` dan `"model"`.

> ⚠️ Field body adalah **`conversation`** dengan item **`{ role, text }`** —
> bukan `messages` / `{ role, content }`. Contoh `script.js` di slide Sesi 3 p.39
> salah kirim `messages`; harus diperbaiki. Detail: `AGENTS.md` §3.2.

### `POST /api/chat-with-file`

Menerima `multipart/form-data`, mengikuti pola kode materi Sesi 2 p.43 dan p.47.

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `file` | File | ya | Gambar, PDF, atau TXT — maksimal 4 MB |
| `prompt` | Text | tidak | Pertanyaan. Bila kosong dipakai instruksi bawaan |

MIME yang diterima: `image/png`, `image/jpeg`, `image/webp`, `application/pdf`, `text/plain`.

Bentuk respons identik dengan `/api/chat`: `200 { result }` atau `500 { error }`.

```bash
curl -s -X POST http://localhost:3000/api/chat-with-file \
  -F 'file=@tangkapan-layar.png;type=image/png' \
  -F 'prompt=Ini aman tidak?'
```

Uji jalur gagal tanpa memakai kuota API:

```bash
# tanpa berkas
curl -s -X POST http://localhost:3000/api/chat-with-file -F 'prompt=tes'
# expect 500 {"error":"Berkas tidak ditemukan pada permintaan."}

# MIME di luar allowlist
curl -s -X POST http://localhost:3000/api/chat-with-file \
  -F 'file=@apa.bin;type=application/octet-stream'
# expect 500 {"error":"Jenis berkas tidak didukung: application/octet-stream"}
```

> ⚠️ **Berkas tidak masuk riwayat percakapan.** Riwayat dikirim utuh setiap turn (`UI-04`),
> jadi menyimpan base64 di dalamnya membuat gambar terkirim ulang berkali-kali dan
> menghabiskan kuota. Yang disimpan hanya penanda teks `[lampiran: nama-berkas]`. Alasan
> beserta konsekuensinya: [`design.md`](openspec/changes/add-cekdulu-chatbot/design.md) D-24c.
>
> Keterbatasan validasi berkas dicatat apa adanya di [`SECURITY.md`](SECURITY.md) — MIME
> berasal dari header yang dikirim klien dan dapat dipalsukan.

---

## Dokumentasi

**Baca dulu sebelum koding:**

| File | Isi |
|---|---|
| [`AGENTS.md`](AGENTS.md) | **Aturan kerja & anti-halusinasi.** Titik masuk untuk AI agent |
| [`openspec/project.md`](openspec/project.md) | Batasan stack & aturan yang selalu berlaku |
| [`openspec/specs/`](openspec/specs) | **Spec aktif** — 40 requirement, 4 kapabilitas |
| [`openspec/changes/add-cekdulu-chatbot/proposal.md`](openspec/changes/add-cekdulu-chatbot/proposal.md) | Scope & non-goals |
| [`openspec/changes/add-cekdulu-chatbot/design.md`](openspec/changes/add-cekdulu-chatbot/design.md) | Keputusan teknis + alternatif ditolak + matriks sumber |
| [`openspec/changes/add-cekdulu-chatbot/tasks.md`](openspec/changes/add-cekdulu-chatbot/tasks.md) | 180 task dalam 12 fase |

**Referensi materi:**

| File | Isi |
|---|---|
| [`docs/SPEC-API.md`](docs/SPEC-API.md) | Kode **verbatim** dari slide + nomor halaman tiap blok |
| [`docs/FAKTA-TERVERIFIKASI.md`](docs/FAKTA-TERVERIFIKASI.md) | Ledger fakta → halaman sumber + daftar hal yang **tidak ada** di materi |
| [`docs/MATERI-SESI-1.md`](docs/MATERI-SESI-1.md) | Sesi 1 — AI/LLM, prompt engineering, Gemini Canvas, v0.dev, tools, NotebookLM, etika |
| [`docs/MATERI-SESI-2.md`](docs/MATERI-SESI-2.md) | Sesi 2 — Gemini API, 4 endpoint multimodal |
| [`docs/MATERI-SESI-3.md`](docs/MATERI-SESI-3.md) | Sesi 3 — chatbot, parameter, system instruction, frontend |
| [`docs/TOOLS-DAN-LINK.md`](docs/TOOLS-DAN-LINK.md) | Tools + versi + **seluruh URL** yang diekstrak dari PDF |

**Use case, metodologi, dan bukti:**

| File | Isi |
|---|---|
| [`docs/USE-CASE-CEKDULU.md`](docs/USE-CASE-CEKDULU.md) | Persona, guardrail, naskah `systemInstruction`, 21 skenario uji |
| [`docs/RISET-LAPANGAN.md`](docs/RISET-LAPANGAN.md) | Data eksternal + sitasi URL resmi |
| [`docs/RISET-DESAIN.md`](docs/RISET-DESAIN.md) | **Riset pola widget, palet warna, landing page, komposer multi-baris** + sitasi URL |
| [`docs/PROMPT-AVATAR.md`](docs/PROMPT-AVATAR.md) | Prompt pembuatan avatar bot + batasan dan cara mengujinya |
| [`docs/KENDALA-API.md`](docs/KENDALA-API.md) | **Kenapa model berbeda dari materi** + rate limit Free tier + strategi hemat kuota |
| [`docs/QA-REPORT.md`](docs/QA-REPORT.md) | **Bukti verifikasi mentah** — output terminal, `curl`, kutipan jawaban bot |
| [`docs/METODOLOGI.md`](docs/METODOLOGI.md) | Alur spec-driven + 5 gate verifikasi |
| [`docs/FINAL-PROJECT.md`](docs/FINAL-PROJECT.md) | Requirement form, checklist submit |

**Tata kelola repo:**

| File | Isi |
|---|---|
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Alur kontribusi, batasan yang terkunci, gate sebelum PR |
| [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) | Kode etik, termasuk ketentuan khusus domain: jangan menghakimi korban |
| [`SECURITY.md`](SECURITY.md) | Pelaporan kerentanan, penanganan kredensial, keterbatasan yang diketahui |
| [`NOTICE.md`](NOTICE.md) | Lingkup lisensi, atribusi materi & data lembaga resmi |
| [`LICENSE`](LICENSE) | MIT |

---

## Materi Sumber

Empat PDF materi pelatihan (**tidak diredistribusi** — dikecualikan `.gitignore` karena
berhak cipta penyelenggara):

| File | Halaman |
|---|---|
| `Sesi 1 - Materi Developers.pdf` | 106 |
| `Sesi 2 - Instalasi Tools.pdf` | 2 |
| `Sesi 2 - Materi Developers.pdf` | 68 |
| `Sesi 3 - Materi Developers.pdf` | 58 |

Seluruh isi `docs/` diekstrak dari berkas-berkas ini dengan mencantumkan nomor halaman,
termasuk 68 slide yang isinya berupa screenshot (kode, Postman, UI, grafik) — teksnya
dibaca dari render gambar, bukan hanya dari text layer PDF.

Atribusi lengkap: [`NOTICE.md`](NOTICE.md)

---

## Keamanan

- `.env` **tidak boleh** di-commit. Sudah ada di `.gitignore`.
- Jangan pernah menampilkan nilai `GEMINI_API_KEY` di log, output, screenshot, atau commit.
- API key hanya dipakai di sisi backend. Frontend tidak boleh memegang key — inilah
  alasan arsitektur menaruh logika AI di backend (Sesi 3 p.18).
- Respons bot dirender dengan `textContent`, bukan `innerHTML` — mencegah XSS dari output
  model. Keputusan D-07 di `design.md`.
- Tidak ada penyimpanan percakapan di server. Riwayat hanya di memori browser, hilang saat
  halaman di-reload.

**Keterbatasan yang diketahui:** aplikasi ini tidak memiliki autentikasi dan rate
limiting — keduanya di luar cakupan materi. Karena itu aplikasi **hanya untuk dijalankan
lokal** di `localhost:3000`. Detail: [`SECURITY.md`](SECURITY.md).

---

## Kanal resmi yang dirujuk

Ditulis **statis di HTML**, bukan digenerate model — nomor kontak adalah data presisi yang
rawan dihalusinasi LLM (requirement `UI-09`, keputusan D-08).

| Kanal | Nilai |
|---|---|
| Kontak OJK telepon | 157 |
| Kontak OJK WhatsApp | 081 157 157 157 |
| Email konsumen | konsumen@ojk.go.id |
| Email Satgas PASTI | satgaspasti@ojk.go.id |

Sumber verbatim: siaran pers Satgas PASTI — `docs/RISET-LAPANGAN.md` §7.

---

## Disclaimer

Cek Dulu adalah alat **edukasi**. Bukan nasihat keuangan, hukum, atau investasi
profesional. Chatbot ini tidak menilai legalitas perusahaan atau aplikasi mana pun.
Verifikasi dan keputusan akhir tetap tanggung jawab pengguna.

Untuk memastikan status legalitas suatu penawaran keuangan, hubungi Otoritas Jasa Keuangan
melalui kanal resmi di atas.

---

## Lisensi

[MIT](LICENSE) — berlaku untuk kode dan dokumentasi yang ditulis dalam repositori ini.
Materi pelatihan Hacktiv8 dan data lembaga resmi yang dirujuk memiliki kepemilikan
tersendiri; lihat [`NOTICE.md`](NOTICE.md).


