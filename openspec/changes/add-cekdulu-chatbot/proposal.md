# Proposal — add-cekdulu-chatbot

| Meta | Nilai |
|---|---|
| ID change | `add-cekdulu-chatbot` |
| Status | **Verified** — Fase A sampai E, G, H, dan I selesai, kelima gate lulus, 16/16 skenario lulus. Sisa Fase F |
| Tanggal dibuat | 1 Agustus 2026 |
| Terakhir diperbarui | 1 Agustus 2026 |
| Kapabilitas tersentuh | `web-server` ✅, `chat-api` ✅, `persona-guardrail` ✅, `chat-ui` ✅ |
| Progres task | 112 dari 119 (`tasks.md`) |
| Bukti verifikasi | `docs/QA-REPORT.md` |

---

## 1. Why

### Masalah pengguna

Indeks inklusi keuangan Indonesia mencapai **80,51%** sementara indeks literasi keuangan
baru **66,46%** (SNLIK 2025, OJK & BPS). Selisih ±14 poin persentase ini berarti puluhan
juta orang sudah memiliki akses produk keuangan digital tetapi belum punya bekal menilai
risikonya.

Konsekuensinya terukur. Indonesia Anti-Scam Centre OJK menerima **343.402 laporan**
penipuan dengan kerugian dilaporkan **Rp7,8 triliun** (22 Nov 2024 – 11 Nov 2025), dan
hanya sekitar **4,95%** dana berhasil diselamatkan. Satgas PASTI telah menghentikan
**14.005 entitas keuangan ilegal** sejak 2017, **11.873** di antaranya pinjaman online
ilegal.

Sumber lengkap: `docs/RISET-LAPANGAN.md`.

### Kenapa chatbot, bukan artikel statis

Pengguna tidak menghadapi masalah abstrak — mereka menghadapi **satu tawaran spesifik**
di layar ponsel mereka, saat itu. Artikel edukasi tidak bisa merespons isi pesan yang
baru mereka terima. Chatbot bisa: pengguna menempelkan teksnya, bot menunjukkan ciri
bahaya yang ada di teks itu.

### Kenapa cukup dengan LLM tanpa integrasi eksternal

Tugas intinya adalah **menjelaskan pola dan prosedur verifikasi** — murni penalaran teks.
Tidak butuh lookup database, tidak butuh API pihak ketiga. Ini tepat berada di kekuatan
`gemini-2.5-flash` dan sekaligus tetap di dalam batasan dependency materi.

### Kenapa use case ini kuat untuk penilaian

Form Final Project mewajibkan dua pertanyaan esai: "Siapa target pengguna chatbot Anda?"
dan "Bagaimana chatbot Anda dapat membantu pengguna?". Keduanya bisa dijawab dengan data
resmi, bukan klaim umum.

Selain itu use case ini mendemonstrasikan **keempat** fungsi System Instruction yang
diajarkan Sesi 3 p.22 — Persona, Tone, Constraints, Format Output — bukan hanya satu.
Constraint utamanya (bot tidak boleh menilai legalitas entitas) juga menyentuh langsung
prinsip Etika AI Sesi 1 p.99: Transparansi, Akuntabilitas, Keamanan.

---

## 2. What Changes

Proyek greenfield. Semua kapabilitas berstatus **ADDED**.

| Kapabilitas | Isi | Requirement | Status |
|---|---|---|---|
| `web-server` | Bootstrap Express, muat env, middleware CORS + JSON, sajikan `public/` sebagai static, listen port 3000 | `WS-01` … `WS-05` | ✅ Selesai |
| `chat-api` | Endpoint `POST /api/chat`: validasi array, transformasi ke format Gemini, panggil `generateContent()`, balas `{ result }` / `{ error }` | `API-01` … `API-06` | ✅ Selesai |
| `persona-guardrail` | `systemInstruction` persona "Cek Dulu" + `temperature`/`topP`/`topK` + larangan | `PG-01` … `PG-09` | ✅ Selesai — UJI-03 lulus |
| `chat-ui` | Antarmuka widget Vanilla JS: launcher, panel dialog, riwayat multi-turn, indikator tiga titik, fallback error, disclaimer, aksesibilitas, design token | `UI-01` … `UI-13` | ✅ Selesai — diverifikasi di browser |

Berkas yang sudah dibuat:

```
index.js                   Backend, 20 requirement
package.json               4 dependency, ESM, tanpa devDependencies
public/index.html          UI-01, UI-07, UI-08, UI-09, UI-11
public/style.css           UI-10, UI-11, UI-12
public/script.js           UI-02 s.d. UI-06, UI-11
docs/KENDALA-API.md        Kendala model dan kuota, bukti mentah
docs/QA-REPORT.md          Bukti verifikasi Gate 1, 2, 3, 5 + Fase D di browser
.github/workflows/ci.yml   Lima job, tanpa npm install
```

Berkas yang sudah ada dan tidak diubah oleh change ini: `AGENTS.md`, `README.md`,
`docs/**` (kecuali `KENDALA-API.md` dan `QA-REPORT.md`), `.gitignore`, `.env.example`,
`LICENSE`, `NOTICE.md`, `SECURITY.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`.

---

## 3. Non-Goals — DILARANG dikerjakan

Daftar 19 item ini ada untuk mematikan scope creep. Sebagian besar **tidak dibahas materi**
(lihat `docs/FAKTA-TERVERIFIKASI.md` §J); sisanya ditolak berdasarkan keputusan desain yang
beralasan di `design.md`:

| Non-goal | Alasan |
|---|---|
| Autentikasi / login / session | Tidak ada di materi |
| Database atau persistensi riwayat di server | Tidak ada di materi. Riwayat cukup di memori browser |
| Streaming response (`generateContentStream`) | Tidak ada di materi; materi pakai `generateContent()` |
| Function calling / tool use Gemini | Tidak ada di materi |
| Rate limiting / kuota di sisi aplikasi | Tidak ada di materi |
| Deployment ke Vercel / Railway / Cloud Run | Tidak ada di materi. Submit berupa repo GitHub, bukan URL live |
| Test framework (Jest / Vitest / Supertest) | Tidak ada di materi; `package.json` slide berisi placeholder test. Verifikasi manual terdokumentasi (`docs/METODOLOGI.md` §5) |
| Linter / formatter (ESLint, Prettier) | Dependency baru di luar batasan materi. CI memakai `node --check` bawaan |
| TypeScript | Materi pakai JavaScript. Kontrak fungsi didokumentasikan dengan JSDoc — nol dependency |
| Framework frontend (React / Vue / Svelte) | Materi eksplisit Vanilla JS (S3 p.34, p.37) |
| Framework CSS (Tailwind / Bootstrap) via CDN | Materi eksplisit Vanilla. Design token `UI-12` memberi konsistensi yang dibutuhkan |
| Layered architecture backend (`routes/`, `controllers/`, `services/`) | Over-engineering untuk satu endpoint ±60 baris. Materi menyebut `index.js` sebagai "central controller" (S2 p.34). Alasan: `design.md` D-01, D-14 |
| Arah desain brutalist / maximalist / eksperimental | Pengguna sedang cemas; antarmuka eksperimental menurunkan kredibilitas. Alasan: `design.md` D-12 |
| Dark mode toggle | Muncul di contoh batch sebelumnya (S2 p.67) tetapi menambah dua set token dan permukaan uji tanpa melayani requirement mana pun |
| Endpoint multimodal (`/generate-from-image` dll.) | Milik proyek Sesi 2 `gemini-flash-api`. Final Project = chatbot Sesi 3 |
| `multer` | Tidak ada di dependency Sesi 3 (S3 p.25) |
| Integrasi API eksternal (cek daftar OJK otomatis) | Brief menyebutnya sebagai *contoh* kreativitas opsional, bukan kewajiban. Menambahnya berarti dependency baru + risiko klaim legalitas yang justru dilarang guardrail |
| Menanam statistik ke dalam `systemInstruction` | Angka berubah tiap periode; akan jadi halusinasi. Lihat `docs/RISET-LAPANGAN.md` header. CI job `prompt-audit` menegakkan ini otomatis |
| Bot menilai entitas tertentu legal/ilegal | **Larangan inti proyek.** Data dinamis, bot tidak punya akses daftar resmi |

---

## 4. Impact

### Risiko dan mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Bot menyatakan sebuah aplikasi "legal" atau "aman" | **Tinggi** — pengguna bisa tertipu karena percaya bot | Constraint eksplisit di `systemInstruction` (`PG-03`); `temperature` rendah 0.3; disclaimer permanen di UI (`UI-08`); diuji wajib di UJI-03 |
| Bot mengarang nomor kontak / statistik / nomor peraturan | Sedang — informasi salah | Constraint `PG-04`; kanal resmi ditulis statis di HTML (`UI-09`) |
| Bot menghakimi korban | Sedang — merugikan psikologis, bertentangan imbauan Komdigi | Aturan tone `PG-02`; diuji UJI-04 |
| Bot memberi nasihat medis pada kasus tekanan mental | Sedang | Constraint `PG-06`; diuji UJI-09 |
| API key terekspos | **Tinggi** | Key hanya di backend, `.env` di `.gitignore`, tidak pernah di-log |
| Payload frontend salah (`messages` vs `conversation`) | Tinggi — chatbot mati total | Dikunci di `API-01` dan `UI-03`; sudah tercatat sebagai bug slide di `AGENTS.md` §3.2 |
| Prompt injection lewat teks tawaran yang ditempel pengguna | Rendah–sedang | Constraint ditulis sebagai aturan absolut ("JANGAN PERNAH"); tidak ada aksi berbahaya yang bisa dipicu karena bot hanya menghasilkan teks |

### Yang tidak berubah

Kontrak API, stack, dependency, nama field, struktur folder — semuanya persis sesuai
`docs/SPEC-API.md`. Change ini **tidak** memodifikasi apa pun dari batasan materi.
Kreativitas seluruhnya berada di isi `systemInstruction`, nilai parameter, teks UI, dan
styling.

---

## 5. Definisi selesai

Change ini selesai ketika kelima gate `docs/METODOLOGI.md` §5 lewat dengan bukti nyata:

1. Setiap requirement punya sumber tertulis — diperiksa manual dan oleh CI job `traceability`
2. `node index.js` hidup tanpa error
3. `curl` positif → `200 { result }`; `curl` negatif → `500 { error }`
4. 16 skenario `docs/USE-CASE-CEKDULU.md` §5 dijalankan di browser; **UJI-03 lulus mutlak**;
   `UI-11` diverifikasi lewat navigasi keyboard, kontras, pembesaran 200%, dan
   `prefers-reduced-motion`
5. `.env` tidak ter-track, tidak ada dependency di luar 4 yang diizinkan, tidak ada
   `devDependencies`

Ditambah satu syarat dokumentasi:

6. `docs/QA-REPORT.md` memuat bukti mentah — output `node index.js`, output `curl` apa
   adanya, dan tabel skenario beserta kutipan jawaban bot. Klaim tanpa bukti tidak sah.

CI (`.github/workflows/ci.yml`) menjaga gate 1, 5, dan sebagian `PG-09` secara otomatis
pada setiap push. Detail: `design.md` D-14.
