# Cek Dulu — Chatbot Edukasi Kewaspadaan Keuangan Digital

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

| Item | Status |
|---|---|
| Materi PDF (4 file, 234 halaman) | ✅ Dibaca & diekstrak penuh ke `docs/` |
| Riset lapangan + sitasi | ✅ `docs/RISET-LAPANGAN.md` |
| Use case terpilih | ✅ **Cek Dulu** — `docs/USE-CASE-CEKDULU.md` |
| Spesifikasi (30 requirement) | ✅ `openspec/changes/add-cekdulu-chatbot/` |
| Metodologi + 5 gate verifikasi | ✅ `docs/METODOLOGI.md` |
| Backend (`index.js`) | ⬜ Belum — Fase B `tasks.md` |
| Frontend (`public/`) | ⬜ Belum — Fase D `tasks.md` |
| Verifikasi 5 gate | ⬜ Belum — Fase E `tasks.md` |
| Submit ke form | ⬜ Belum — Fase F `tasks.md` |

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
    ├── proposal.md                # WHY: masalah, scope, non-goals
    ├── design.md                  # HOW: 11 keputusan + alternatif ditolak + matriks sumber
    ├── tasks.md                   # STEPS: 36 task dalam 6 fase
    └── specs/
        ├── web-server/spec.md     # WS-01 … WS-05
        ├── chat-api/spec.md       # API-01 … API-06
        ├── persona-guardrail/spec.md  # PG-01 … PG-09
        └── chat-ui/spec.md        # UI-01 … UI-10
```

30 requirement, semuanya punya sumber. Matriks keterlacakan di
[`design.md`](openspec/changes/add-cekdulu-chatbot/design.md) §3.

Alur lengkap + lima gate verifikasi: [`docs/METODOLOGI.md`](docs/METODOLOGI.md)

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

## Stack Target

| Item | Nilai |
|---|---|
| Runtime | Node.js v18+ |
| Module system | ESM (`"type": "module"`) |
| Backend | Express 5 |
| SDK Gemini | `@google/genai` ^1.10.0 |
| Model | `gemini-2.5-flash` |
| Frontend | Vanilla JS (HTML + CSS + JS) di folder `public/` |
| Port | 3000 |
| Parameter | `temperature: 0.3`, `topP: 0.8`, `topK: 30` |

Tepat **4 dependency**: `express`, `dotenv`, `cors`, `@google/genai`. Tidak ada tambahan.
Tanpa database, tanpa test framework, tanpa TypeScript, tanpa framework frontend — semua
itu tidak ada di materi. Daftar lengkap non-goals:
[`proposal.md`](openspec/changes/add-cekdulu-chatbot/proposal.md) §3.

Nilai `temperature` 0.3 dipilih atas dasar S3 p.21 yang merekomendasikan nilai rendah untuk
tanya jawab faktual — menyimpang dari contoh slide (0.9) yang ditujukan untuk penulisan
kreatif. Justifikasi: [`design.md`](openspec/changes/add-cekdulu-chatbot/design.md) D-04.

---

## Struktur Target

```
Project-Akhir-Hacktiv8/
├── public/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── .env                 # GEMINI_API_KEY=... (JANGAN di-commit)
├── .env.example
├── .gitignore
├── index.js
├── package.json
├── AGENTS.md
├── README.md
├── docs/
└── openspec/
```

---

## Setup

```bash
npm init -y
npm install express dotenv cors @google/genai
```

Tambahkan `"type": "module"` ke `package.json`.

Buat `.env`:

```
GEMINI_API_KEY=your_credential_key
```

API key didapat dari `https://aistudio.google.com/u/0/api-keys` → tombol **Create API key**.

`.gitignore`:

```
/node_modules
.env
package-lock.json
```

---

## Menjalankan

```bash
node index.js
# log akan menampilkan http://localhost:3000
```

Buka `http://localhost:3000/` di browser.

Uji endpoint langsung:

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
| [`openspec/changes/add-cekdulu-chatbot/tasks.md`](openspec/changes/add-cekdulu-chatbot/tasks.md) | 36 task dalam 6 fase |

**Referensi materi:**

| File | Isi |
|---|---|
| [`docs/SPEC-API.md`](docs/SPEC-API.md) | Kode **verbatim** dari slide + nomor halaman tiap blok |
| [`docs/FAKTA-TERVERIFIKASI.md`](docs/FAKTA-TERVERIFIKASI.md) | Ledger fakta → halaman sumber + daftar hal yang **tidak ada** di materi |
| [`docs/MATERI-SESI-1.md`](docs/MATERI-SESI-1.md) | Sesi 1 — AI/LLM, prompt engineering, Gemini Canvas, v0.dev, tools, NotebookLM, etika |
| [`docs/MATERI-SESI-2.md`](docs/MATERI-SESI-2.md) | Sesi 2 — Gemini API, 4 endpoint multimodal |
| [`docs/MATERI-SESI-3.md`](docs/MATERI-SESI-3.md) | Sesi 3 — chatbot, parameter, system instruction, frontend |
| [`docs/TOOLS-DAN-LINK.md`](docs/TOOLS-DAN-LINK.md) | Tools + versi + **seluruh URL** yang diekstrak dari PDF |

**Use case & metodologi:**

| File | Isi |
|---|---|
| [`docs/USE-CASE-CEKDULU.md`](docs/USE-CASE-CEKDULU.md) | Persona, guardrail, naskah `systemInstruction`, 12 skenario uji |
| [`docs/RISET-LAPANGAN.md`](docs/RISET-LAPANGAN.md) | Data eksternal + sitasi URL resmi |
| [`docs/METODOLOGI.md`](docs/METODOLOGI.md) | Alur spec-driven + 5 gate verifikasi |
| [`docs/FINAL-PROJECT.md`](docs/FINAL-PROJECT.md) | Requirement form, checklist submit |

---

## Materi Sumber

Empat PDF di root repo:

| File | Halaman |
|---|---|
| `Sesi 1 - Materi Developers.pdf` | 106 |
| `Sesi 2 - Instalasi Tools.pdf` | 2 |
| `Sesi 2 - Materi Developers.pdf` | 68 |
| `Sesi 3 - Materi Developers.pdf` | 58 |

Semua isi `docs/` diekstrak dari file-file ini, termasuk slide yang isinya berupa
screenshot/gambar (kode, Postman, UI, chart) — teksnya sudah dibaca dari render gambar,
bukan hanya text layer PDF.

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

