<p align="center">
  <img src="docs/assets/social-preview.png" alt="Cek Dulu — Chatbot edukasi kewaspadaan keuangan digital" width="720">
</p>

# Cek Dulu — Chatbot Edukasi Kewaspadaan Keuangan Digital

[![CI](https://github.com/mifdlaldev/cek-dulu/actions/workflows/ci.yml/badge.svg)](https://github.com/mifdlaldev/cek-dulu/actions/workflows/ci.yml)
[![Status](https://img.shields.io/badge/status-backend%20selesai%20%C2%B7%20frontend%20berjalan-orange)](openspec/changes/add-cekdulu-chatbot/tasks.md)
[![Requirement](https://img.shields.io/badge/requirement-32%20tertelusur-brightgreen)](openspec/changes/add-cekdulu-chatbot/design.md)
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
| — | Spesifikasi (32 requirement) | ✅ `openspec/changes/add-cekdulu-chatbot/` |
| — | Metodologi + 5 gate verifikasi | ✅ `docs/METODOLOGI.md` |
| A | Inisialisasi proyek (`package.json`, 4 dependency) | ✅ Selesai |
| B | Backend (`index.js`) — 20 requirement | ✅ Selesai |
| C | Uji backend via `curl` + guardrail | ✅ Selesai — **UJI-03 lulus** |
| D | Frontend (`public/`) — 12 requirement UI | ⬜ Belum |
| E | Verifikasi 5 gate penuh + 13 skenario | 🟡 Sebagian — Gate 1, 2, 3, 5 lulus; Gate 4 menunggu Fase D |
| F | Screenshot UI + submit ke form | ⬜ Belum |

Progres task: **24 dari 59** selesai (`tasks.md`).

Bukti verifikasi mentah — output terminal, `curl`, dan kutipan jawaban bot:
[`docs/QA-REPORT.md`](docs/QA-REPORT.md).

---

## Cara kerja pengembangan

Proyek ini memakai **spec-driven development** dengan struktur OpenSpec. Kode tidak
ditulis dari tafsiran, tapi dari requirement ber-ID yang punya sumber tertulis (nomor
halaman PDF materi).

```
openspec/
├── project.md                     # Batasan stack & aturan yang selalu berlaku
├── specs/                         # Spec aktif (terisi setelah implementasi diarsipkan)
└── changes/add-cekdulu-chatbot/
    ├── proposal.md                # WHY: masalah, scope, 19 non-goals
    ├── design.md                  # HOW: 16 keputusan + alternatif ditolak + matriks sumber
    ├── tasks.md                   # STEPS: 59 task dalam 6 fase
    └── specs/
        ├── web-server/spec.md     # WS-01 … WS-05
        ├── chat-api/spec.md       # API-01 … API-06
        ├── persona-guardrail/spec.md  # PG-01 … PG-09
        └── chat-ui/spec.md        # UI-01 … UI-12
```

32 requirement, semuanya punya sumber. Matriks keterlacakan di
[`design.md`](openspec/changes/add-cekdulu-chatbot/design.md) §3.

Alur lengkap + lima gate verifikasi: [`docs/METODOLOGI.md`](docs/METODOLOGI.md)

### CI menjaga keputusan desain

Lima job berjalan pada setiap push, **tanpa `npm install`** — hanya alat bawaan Node dan git:

| Job | Yang dijaga |
|---|---|
| `syntax` | `node --check` pada `index.js` dan `public/script.js` |
| `hygiene` | `.env` tidak ter-track, PDF berhak cipta tidak ter-track, pola API key tidak muncul |
| `constraints` | Tepat 4 dependency, tanpa `devDependencies`, `"type": "module"` ada, `innerHTML` dilarang di frontend |
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
| Port | 3000 |
| Parameter | `temperature: 0.3`, `topP: 0.8`, `topK: 30` |
| Tipe fungsi | JSDoc — kontrak terdokumentasi tanpa TypeScript |
| Styling | CSS custom properties (design token), arah restrained kontras tinggi |
| Aksesibilitas | WCAG 2.1 AA untuk butir yang dapat diverifikasi manual |

> ⚠️ **Model berbeda dari materi, dan itu disengaja.** Materi menetapkan `gemini-2.5-flash`,
> tetapi model tersebut mengembalikan HTTP 404 bagi akun yang baru dibuat dengan pesan
> `no longer available to new users` — diuji 1 Agustus 2026. Repo ini memakai
> `process.env.GEMINI_MODEL ?? 'gemini-flash-latest'`, yaitu alias resmi Google yang selalu
> menunjuk rilis Flash terbaru. Pemilik akun lama cukup menulis `GEMINI_MODEL=gemini-2.5-flash`
> di `.env` untuk mengikuti materi apa adanya, tanpa mengubah kode.
>
> Bukti mentah, hasil uji lima model, dan angka rate limit: [`docs/KENDALA-API.md`](docs/KENDALA-API.md).
> Keputusan: [`design.md`](openspec/changes/add-cekdulu-chatbot/design.md) D-15.

Tepat **4 dependency**: `express`, `dotenv`, `cors`, `@google/genai`. Tidak ada tambahan,
termasuk tanpa `devDependencies`. Tanpa database, tanpa test framework, tanpa TypeScript,
tanpa linter, tanpa framework frontend maupun CSS — semua itu tidak ada di materi. Daftar
lengkap 19 non-goals: [`proposal.md`](openspec/changes/add-cekdulu-chatbot/proposal.md) §3.

Backend tetap satu berkas `index.js`. Memecahnya ke `routes/` → `controllers/` →
`services/` untuk satu endpoint sepanjang ±60 baris menghasilkan indirection tanpa
kejelasan tambahan; materi sendiri menyebut `index.js` sebagai "central controller"
(S2 p.34). Alasan: [`design.md`](openspec/changes/add-cekdulu-chatbot/design.md) D-01 dan D-14.

Nilai `temperature` 0.3 dipilih atas dasar S3 p.21 yang merekomendasikan nilai rendah untuk
tanya jawab faktual — menyimpang dari contoh slide (0.9) yang ditujukan untuk penulisan
kreatif. Justifikasi: [`design.md`](openspec/changes/add-cekdulu-chatbot/design.md) D-04.

Arah visual **restrained** dipilih secara sadar, menolak saran umum untuk mengambil risiko
estetis: pengguna Cek Dulu sedang cemas, dan antarmuka eksperimental menurunkan kredibilitas
tepat saat kredibilitas paling dibutuhkan. Justifikasi:
[`design.md`](openspec/changes/add-cekdulu-chatbot/design.md) D-12.

---

## Struktur

Tanda ⬜ menandai berkas yang belum dibuat (Fase D).

```
Project-Akhir-Hacktiv8/
├── index.js                  ✅ Backend — 20 requirement
├── package.json              ✅ 4 dependency, ESM
├── public/                   ⬜ Frontend (Fase D)
│   ├── index.html            ⬜
│   ├── script.js             ⬜
│   └── style.css             ⬜
├── .env                      🔒 Tidak di-commit
├── .env.example              ✅
├── .gitignore                ✅
├── AGENTS.md                 ✅ Aturan kerja anti-halusinasi
├── README.md                 ✅
├── docs/                     ✅ Materi, riset, use case, metodologi, kendala, QA
└── openspec/                 ✅ Spesifikasi 32 requirement
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

Buka `http://localhost:3000/` di browser.

> Saat ini halaman tersebut masih mengembalikan `404` karena folder `public/` belum dibuat
> (Fase D). Endpoint API sudah berfungsi dan dapat diuji langsung dengan `curl` di bawah.

Uji endpoint:

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

---

## Dokumentasi

**Baca dulu sebelum koding:**

| File | Isi |
|---|---|
| [`AGENTS.md`](AGENTS.md) | **Aturan kerja & anti-halusinasi.** Titik masuk untuk AI agent |
| [`openspec/project.md`](openspec/project.md) | Batasan stack & aturan yang selalu berlaku |
| [`openspec/changes/add-cekdulu-chatbot/proposal.md`](openspec/changes/add-cekdulu-chatbot/proposal.md) | Scope & non-goals |
| [`openspec/changes/add-cekdulu-chatbot/design.md`](openspec/changes/add-cekdulu-chatbot/design.md) | Keputusan teknis + alternatif ditolak + matriks sumber |
| [`openspec/changes/add-cekdulu-chatbot/tasks.md`](openspec/changes/add-cekdulu-chatbot/tasks.md) | 59 task dalam 6 fase |

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
| [`docs/USE-CASE-CEKDULU.md`](docs/USE-CASE-CEKDULU.md) | Persona, guardrail, naskah `systemInstruction`, 13 skenario uji |
| [`docs/RISET-LAPANGAN.md`](docs/RISET-LAPANGAN.md) | Data eksternal + sitasi URL resmi |
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


