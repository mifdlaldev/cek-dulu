# AGENTS.md — Aturan Kerja & Anti-Halusinasi

Repo ini adalah **Final Project Hacktiv8 "Maju Bareng AI"** jalur
**[Developers] AI Productivity and AI API Integration for Developers**.

Nama project: **Cek Dulu** — chatbot edukasi kewaspadaan keuangan digital.
Use case lengkap: `docs/USE-CASE-CEKDULU.md`.

Semua fakta di file ini dan di `docs/` **diekstrak verbatim dari 4 PDF materi**
yang ada di root repo. Nomor halaman selalu dicantumkan sebagai sumber.

---

## 0. BACA INI DULU SEBELUM MENYENTUH KODE

Proyek ini memakai **spec-driven development**. Kode tidak ditulis berdasarkan tafsiran,
tapi berdasarkan requirement ber-ID yang punya sumber tertulis.

**Urutan wajib sebelum koding:**

1. `openspec/project.md` — batasan stack & aturan yang selalu berlaku
2. `openspec/changes/add-cekdulu-chatbot/proposal.md` — scope & **non-goals**
3. `openspec/changes/add-cekdulu-chatbot/specs/*/spec.md` — requirement + skenario
4. `openspec/changes/add-cekdulu-chatbot/design.md` — keputusan & alternatif yang ditolak
5. `openspec/changes/add-cekdulu-chatbot/tasks.md` — task berurutan yang dikerjakan

**Aturan mutlak:**
- Kode yang tidak punya requirement ID → **jangan ditulis**.
- Spec ternyata salah/kurang di tengah implementasi → **perbaiki spec dulu**, baru koding.
  Dilarang koding menyimpang lalu memperbaiki spec agar cocok.
- Ada 40 requirement (`WS-*`, `API-*`, `PG-*`, `UI-*`). Semua punya sumber. Matriks
  keterlacakan di `design.md` §3.

Cara kerja lengkap + 5 gate verifikasi → `docs/METODOLOGI.md`.

**Progres saat ini: Fase A sampai E, G, H, I, dan J selesai; kelima gate verifikasi LULUS.**
Backend `index.js` dan frontend `public/` sudah diimplementasikan dan diverifikasi di browser
nyata — 177 dari 180 task tuntas, dan **21 dari 21 skenario uji lulus**. Antarmuka memakai
landing page sembilan section ditambah launcher dan panel dialog dengan palet light mode;
riset dan sitasinya di `docs/RISET-DESAIN.md`.

**Ada tiga penyimpangan dari kode materi**, semuanya keputusan sadar dengan bukti tertulis —
jangan "dikembalikan" tanpa membaca alasannya:

| Penyimpangan | Requirement | Keputusan |
|---|---|---|
| Nama model dibaca dari environment | `WS-02` | D-15 — model materi ditutup Google, bukti HTTP 404 di `docs/KENDALA-API.md` §1 |
| Kolom pesan `<textarea>`, bukan `<input type="text">` | `UI-01` | D-21a — use case meminta pengguna menempelkan pesan utuh beberapa baris. Nama `id="user-input"` TIDAK berubah |
| Endpoint kedua untuk lampiran berkas | `API-07` | D-24 — `multer` dan pola `inlineData` ada di materi Sesi 2 (p.30, p.43, p.47); yang tidak ada hanya cara menggabungkan berkas ke percakapan multi-turn, dan bagian itu tidak diklaim verbatim |

**Dua non-goal dicabut terbuka** pada Fase K: "endpoint multimodal" dan "`multer`". Pencabutan
beserta alasannya tercatat di `proposal.md` §3; lima non-goal baru ditambahkan untuk menutup
kembali scope di sekitarnya (audio, Files API, folder `uploads/`, base64 di riwayat, magic
byte).

Sisa: Fase F berupa screenshot dan submit. Bukti mentah di `docs/QA-REPORT.md`. Sebelum
mengerjakan apa pun, cek status per task di
`openspec/changes/add-cekdulu-chatbot/tasks.md`.

**Larangan permanen pada halaman (`UI-14`, D-20):** DILARANG memuat testimoni, logo mitra,
star rating, jumlah ulasan, jumlah pengguna, jumlah unduhan, atau tingkat kepuasan. Aplikasi
belum punya pengguna — mengarangnya melanggar aturan yang sama yang diberlakukan pada bot
(`PG-04`). Setiap angka pada halaman wajib berasal dari `docs/RISET-LAPANGAN.md` beserta
lembaga dan periode datanya. Audit larangan ini sudah dijalankan dan lulus; buktinya di
`docs/QA-REPORT.md` bagian Fase H.

**`PG-03` adalah gate mutlak:** bot dilarang menyatakan sebuah perusahaan/aplikasi legal
atau ilegal. Uji UJI-03 sudah dijalankan pada 1 Agustus 2026 dan **lulus** — kutipan jawaban
bot ada di `docs/QA-REPORT.md`. Bila di kemudian hari uji ini gagal, implementasi dinyatakan
**gagal** dan `systemInstruction` wajib diperkuat sebelum pekerjaan dilanjutkan.

---

## 1. ATURAN ANTI-HALUSINASI (WAJIB)

### 1.1 Sumber kebenaran (urutan prioritas)

1. **Kode aktual di repo** — baca file, jangan mengarang.
2. **`openspec/specs/`** — spec aktif (perilaku sistem saat ini).
3. **`openspec/changes/*/specs/`** — spec yang sedang dibangun.
4. **`docs/SPEC-API.md`** — spesifikasi endpoint verbatim dari slide.
5. **`docs/FAKTA-TERVERIFIKASI.md`** — ledger fakta + halaman sumber.
6. **PDF materi di root** — sumber asli.
7. **`docs/RISET-LAPANGAN.md`** — data eksternal, **hanya** untuk justifikasi use case.
8. Pengetahuan internal model — **PALING RENDAH**. Selalu kalah dari 1–7.

### 1.2 Yang DILARANG

- ❌ Mengarang nama endpoint, field JSON, atau nama env var yang tidak ada di `docs/SPEC-API.md`.
- ❌ Mengklaim "materi bilang X" tanpa nomor halaman PDF.
- ❌ Mengganti `@google/genai` ke `@google/generative-ai` (SDK lama, **bukan** yang dipakai materi).
- ❌ Memakai `new GoogleGenerativeAI(...)` / `getGenerativeModel(...)` — itu API SDK lama.
- ❌ Menambah dependency di luar daftar `docs/SPEC-API.md` tanpa persetujuan user.
- ❌ Menulis `.env` atau meng-echo nilai API key ke output/log/commit.
- ❌ Commit tanpa permintaan eksplisit user.
- ❌ Menulis kode yang tidak punya requirement ID di `openspec/changes/*/specs/`.
- ❌ Mengerjakan apa pun yang tercantum di Non-Goals `proposal.md` §3.
- ❌ Menanam angka statistik dari `docs/RISET-LAPANGAN.md` ke dalam `systemInstruction`.
- ❌ Menyerahkan data presisi (nomor telepon, email, URL, nomor peraturan) ke LLM.
  Data itu ditulis **statis di HTML** (`UI-09`).

### 1.3 Yang WAJIB

- ✅ Sebelum klaim tentang materi → buka `docs/` dulu, sebut halamannya.
- ✅ SDK: `import { GoogleGenAI } from "@google/genai"` lalu `ai.models.generateContent({...})`.
- ✅ Model: `gemini-2.5-flash` (string literal, disimpan di `const GEMINI_MODEL`).
- ✅ Env var: **`GEMINI_API_KEY`** (lihat 3.1 soal konflik `API_KEY`).
- ✅ Response sukses: `res.status(200).json({ result: response.text })`.
- ✅ Response error: `res.status(500).json({ ... })`.
- ✅ Jika fakta tidak ada di PDF → katakan **"tidak ada di materi"**, jangan menebak.
- ✅ Frontend kirim `{ conversation: [{ role, text }] }` — **bukan** `{ messages: [{ role, content }] }`.
- ✅ Render respons bot dengan `textContent`, bukan `innerHTML` (cegah XSS).

### 1.4 Verifikasi sebelum bilang "selesai"

Lima gate `docs/METODOLOGI.md` §5, semuanya wajib dengan **bukti output nyata**:

1. **Keterlacakan** — setiap requirement punya sumber tertulis.
2. **Server hidup** — `node index.js` jalan, log muncul, tempel outputnya.
3. **Kontrak API** — `curl` positif → `200 {result}`; `curl` negatif → `500 {error}`.
4. **Guardrail & UI** — 21 skenario `docs/USE-CASE-CEKDULU.md` §5 dijalankan di browser
   sungguhan; **UJI-03 lulus mutlak**. Termasuk verifikasi aksesibilitas `UI-11`.
5. **Kebersihan repo** — `.env` tidak ter-track, hanya 5 dependency, tanpa `devDependencies`,
   tidak ada file temporer.

Ditambah satu syarat: hasil verifikasi ditulis ke **`docs/QA-REPORT.md`** berisi bukti mentah
— output terminal, output `curl` apa adanya, dan kutipan jawaban bot per skenario.

"Seharusnya jalan" ≠ terverifikasi. Klaim tanpa output = tidak sah.

CI (`.github/workflows/ci.yml`) menjaga Gate 1, Gate 5, `PG-09`, dan larangan `innerHTML`
secara otomatis pada setiap push — tanpa `npm install`. Pembagian tugas CI versus manual:
`docs/METODOLOGI.md` §5.1.

---

## 2. FAKTA TEKNIS KUNCI (ringkas)

| Item | Nilai | Sumber |
|---|---|---|
| SDK | `@google/genai` `^1.10.0` | S2 p.31, S3 p.26 |
| Upload | `multer` `^2.0.2` memory storage ⚠️ | S2 p.30, p.31, p.56 — ditambahkan Fase K, `design.md` D-24 |
| Model (materi) | `gemini-2.5-flash` — **ditutup Google untuk akun baru** | S2 p.34, S3 p.28 |
| Model (dipakai repo) | `process.env.GEMINI_MODEL ?? 'gemini-flash-latest'` | `docs/KENDALA-API.md` §1, `design.md` D-15 |
| Node.js | v18+ (demo pakai v23.7.0) | S2 p.8–9 |
| Module system | `"type": "module"` di package.json | S2 p.31, S3 p.26 |
| Port | 3000 | S2 p.34, S3 p.28 |
| Env var | `GEMINI_API_KEY` | S2 p.32, S3 p.27 |
| Endpoint chatbot | `POST /api/chat` | S3 p.29 |
| Endpoint lampiran | `POST /api/chat-with-file` ⚠️ | Pola S2 p.43, p.47 — lihat `design.md` D-24 |
| Body chatbot | `{ conversation: [{ role, text }] }` | S3 p.29, p.31 |
| Body lampiran | `multipart/form-data` field `file` + `prompt` | S2 p.45, p.49 |
| Response | `{ result: "<teks>" }` | S3 p.29, p.31 |
| Frontend | Vanilla JS di folder `public/` | S3 p.34 |
| Static serve | `app.use(express.static(path.join(__dirname, 'public')))` | S3 p.43 |

Detail lengkap → `docs/SPEC-API.md`.

**Kuota API sangat terbatas.** Free tier hanya **20 permintaan per hari** untuk model
Text-out. Sebelum menjalankan uji apa pun yang memanggil model, baca strategi hemat kuota di
`docs/KENDALA-API.md` §2. Jangan mengulang permintaan untuk menguji hal yang sudah terjawab.
Bila muncul `429`, **berhenti** — memaksa hanya memperpanjang blokir.

---

## 3. KONFLIK DALAM MATERI (jangan bingung, sudah diputuskan)

Materi punya beberapa inkonsistensi internal. Keputusan repo ini:

### 3.1 `GEMINI_API_KEY` vs `API_KEY`
- Slide teks & struktur file: `GEMINI_API_KEY` (S2 p.32, S3 p.27)
- Slide kode S2 p.34 & S3 p.28: `process.env.GEMINI_API_KEY`
- Slide kode S3 p.43: `process.env.API_KEY` ← **menyimpang**
- **KEPUTUSAN: pakai `GEMINI_API_KEY`.**

### 3.2 `conversation` vs `messages`
- Narasi slide S3 p.29 bilang "array `messages`"
- Kode aktual S3 p.29: `const { conversation } = req.body`
- Postman S3 p.31: `{"conversation": [...]}`
- Contoh `script.js` dari Gemini Code Assist (S3 p.39, p.42) justru kirim `{ messages: [{ role, content }] }` ← **tidak cocok backend**
- **KEPUTUSAN: `conversation` dengan item `{ role, text }`.** `script.js` harus diperbaiki agar sesuai, jangan copas mentah dari slide.

### 3.3 Folder `uploads/` (Sesi 2)
- S2 p.32 & p.35 (teks) bilang multer simpan ke `uploads/`
- Kode aktual S2 p.34: `const upload = multer();` → **memory storage**, baca `req.file.buffer`
- S2 p.56 mengonfirmasi: "file diproses langsung dari memory buffer ... tanpa perlu menghapus file karena tidak ada penyimpanan ke disk"
- **KEPUTUSAN: memory storage. Tidak ada folder `uploads/`.**

### 3.4 `{ result: ... }` vs `{ output: ... }`
- Kode slide: `res.status(200).json({ result: response.text })`
- Screenshot Postman S2 p.41/45/49/54 menampilkan `{"output": "..."}` ← screenshot dari versi lama
- **KEPUTUSAN: `result`.**

### 3.5 Salah tulis key audio
- S2 p.54 menulis key form-data `document` untuk endpoint audio
- Kode: `upload.single("audio")`
- **KEPUTUSAN: key = `audio`.**

### 3.6 `extractText()` helper
- Muncul hanya di S2 p.58 (screenshot Gemini Code Assist). Bukan bagian kode utama slide.
- **KEPUTUSAN: opsional. Kode utama pakai `response.text` langsung.**

### 3.7 Model `gemini-2.5-flash` ditutup Google
Ini bukan inkonsistensi di dalam materi, tetapi **materi versus kondisi API aktual**.

- Materi menetapkan `const GEMINI_MODEL = "gemini-2.5-flash"` (S2 p.34, S3 p.28)
- Uji nyata 1 Agustus 2026 → HTTP 404: `This model models/gemini-2.5-flash is no longer available to new users`
- `gemini-2.5-flash-lite` juga 404. `gemini-flash-latest` berhasil
- **KEPUTUSAN: `process.env.GEMINI_MODEL ?? 'gemini-flash-latest'`.**
  Pemilik akun lama cukup menulis `GEMINI_MODEL=gemini-2.5-flash` di `.env` untuk mengikuti
  materi apa adanya, tanpa mengubah kode.
- Bukti mentah: `docs/KENDALA-API.md` §1. Keputusan: `design.md` D-15. Requirement: `WS-02`.

---

## 4. GAYA KERJA

- Bahasa balasan ke user: **Indonesia**.
- Nama file, path, identifier kode, pesan error: **verbatim**, jangan diterjemahkan.
- Perubahan minimal. Bug fix ≠ refactor.
- Jangan buat abstraksi untuk operasi sekali pakai.
- Jangan buat file baru kalau bisa edit file yang ada.
- `.gitignore` wajib berisi: `/node_modules`, `.env`, `package-lock.json` (S2 p.61, S3 p.50).

---

## 5. PETA DOKUMEN

| File | Isi |
|---|---|
| `README.md` | Ringkasan repo + status |
| `docs/SPEC-API.md` | Spesifikasi endpoint & kode verbatim dari slide |
| `docs/FAKTA-TERVERIFIKASI.md` | Ledger fakta → halaman sumber |
| `docs/MATERI-SESI-1.md` | Ringkasan lengkap Sesi 1 |
| `docs/MATERI-SESI-2.md` | Ringkasan lengkap Sesi 2 |
| `docs/MATERI-SESI-3.md` | Ringkasan lengkap Sesi 3 |
| `docs/TOOLS-DAN-LINK.md` | Daftar tools, versi, dan semua URL dari PDF |
| `docs/FINAL-PROJECT.md` | Requirement + kriteria submit final project |
| `docs/USE-CASE-CEKDULU.md` | Use case terpilih, persona, guardrail, 21 skenario uji |
| `docs/RISET-LAPANGAN.md` | Data eksternal + sitasi URL resmi |
| `docs/RISET-DESAIN.md` | Riset pola widget, palet warna, landing page, komposer + sitasi URL |
| `docs/PROMPT-AVATAR.md` | Prompt pembuatan avatar bot + batasan dan cara ujinya |
| `docs/KENDALA-API.md` | Model materi ditutup Google + rate limit + strategi hemat kuota |
| `docs/QA-REPORT.md` | Bukti verifikasi mentah — output terminal, `curl`, kutipan jawaban bot |
| `docs/METODOLOGI.md` | Alur kerja spec-driven + 5 gate verifikasi |
| `openspec/project.md` | Konteks & batasan proyek untuk agent |
| `openspec/changes/add-cekdulu-chatbot/` | Requirement yang sedang dibangun |
| `openspec/specs/` | Spec aktif (terisi setelah implementasi diarsipkan) |

---

## 6. ATURAN RISET EKSTERNAL

Riset di luar materi (web search, dokumentasi resmi) **diizinkan** untuk:
- Menjustifikasi pemilihan use case
- Mengisi pertanyaan esai di form Final Project
- Memverifikasi kanal resmi yang dirujuk UI

Riset **DILARANG** untuk:
- Mengubah stack, dependency, endpoint, atau kontrak API — itu terkunci oleh materi
- Menambah fitur yang tidak diminta brief
- Mengisi `systemInstruction` dengan angka atau nama entitas

Setiap angka hasil riset **wajib punya URL sumber** di `docs/RISET-LAPANGAN.md`.
Angka tanpa sumber = tidak sah, hapus.

Alasan angka tidak boleh masuk prompt: semua data itu snapshot per tanggal siaran pers.
IASC naik dari 135 ribu laporan (Mei 2025) ke 343 ribu (Nov 2025) dalam ±6 bulan. Angka
yang ditanam hari ini akan salah beberapa bulan lagi, dan bot menyampaikannya dengan
yakin — itu definisi halusinasi.

