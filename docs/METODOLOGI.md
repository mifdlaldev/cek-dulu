# METODOLOGI.md — Alur Kerja Anti-Halusinasi

> File ini menjelaskan **bagaimana** proyek ini dikerjakan, bukan **apa** yang dibangun.
> Tujuannya satu: memastikan setiap baris kode bisa dilacak ke sumber tertulis, sehingga
> tidak ada keputusan yang lahir dari asumsi model.

---

## 1. Masalah yang dipecahkan metodologi ini

AI coding agent gagal dengan pola yang bisa diprediksi:

| Mode kegagalan | Contoh konkret di proyek ini | Mitigasi |
|---|---|---|
| **Mengarang API** | Menulis `new GoogleGenerativeAI()` dan `getGenerativeModel()` — API SDK lama `@google/generative-ai`, bukan `@google/genai` yang dipakai materi | Kode verbatim dikunci di `SPEC-API.md` + larangan eksplisit di `AGENTS.md` §1.2 |
| **Menyalin bug dari sumber** | Contoh `script.js` di slide S3 p.39 mengirim `{ messages: [{ role, content }] }`, backend baca `{ conversation: [{ role, text }] }` → chatbot mati | Konflik didaftar & diputuskan di `AGENTS.md` §3; spec mengunci payload benar |
| **Mengikuti narasi, bukan kode** | Slide bilang folder `uploads/`, kode aktual memory storage | Kode selalu menang atas narasi (`AGENTS.md` §1.1) |
| **Scope creep** | Menambah database, autentikasi, streaming — tidak ada di materi | Non-goals eksplisit di `proposal.md` + daftar "tidak ada di materi" `FAKTA-TERVERIFIKASI.md` §J |
| **Mengarang data faktual** | Bot menyebut nomor kontak OJK atau statistik dari memori model | Guardrail `systemInstruction` + data presisi ditulis statis di HTML |
| **Klaim selesai tanpa bukti** | "Seharusnya jalan" tanpa menjalankan | Gate verifikasi §5 wajib, dengan output nyata |

---

## 2. Hierarki sumber kebenaran

Dipakai untuk memutuskan **konflik**. Nomor kecil menang.

```
1. Kode aktual di repo               <- baca file, jangan menebak
2. openspec/specs/  (spec aktif)     <- kebenaran perilaku sistem saat ini
3. openspec/changes/*/specs/         <- kebenaran perilaku yang sedang dibangun
4. docs/SPEC-API.md                  <- kode verbatim dari slide + nomor halaman
5. docs/FAKTA-TERVERIFIKASI.md       <- ledger fakta + nomor halaman
6. PDF materi di root                <- sumber asli
7. docs/RISET-LAPANGAN.md            <- data eksternal, HANYA untuk justifikasi use case
8. Pengetahuan internal model        <- PALING RENDAH, selalu kalah dari 1-7
```

Aturan tambahan:
- **Kode slide menang atas narasi slide.** Bila teks slide dan screenshot kode berbeda,
  ikuti kode. Semua kasus sudah didaftar di `AGENTS.md` §3.
- **Riset eksternal (7) tidak boleh mengubah batasan teknis (4–6).** Riset hanya
  menjustifikasi *pilihan use case*, bukan mengubah stack, dependency, atau kontrak API.
- **Angka dari riset eksternal tidak boleh masuk `systemInstruction`.** Alasannya di
  `RISET-LAPANGAN.md` header.

---

## 3. Alur kerja spec-driven

Mengadopsi struktur OpenSpec (`https://openspec.dev`) — dijalankan **manual**, tanpa
menginstal CLI, karena proyek tidak boleh menambah dependency di luar daftar materi.
Yang diambil adalah **disiplin artefaknya**, bukan tooling-nya.

```
┌─────────────────────────────────────────────────────────────────┐
│ FASE 0 — EKSTRAKSI SUMBER                              [SELESAI]│
│ Baca 4 PDF (234 hal), render 68 slide gambar,                   │
│ ekstrak URL dari objek /URI                                     │
│ Output: docs/SPEC-API.md, FAKTA-TERVERIFIKASI.md, MATERI-*.md,  │
│         TOOLS-DAN-LINK.md                                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ FASE 1 — RISET & PEMILIHAN USE CASE                    [SELESAI]│
│ Riset kondisi lapangan (You.com) → 3 opsi → user pilih Opsi A   │
│ Output: docs/RISET-LAPANGAN.md, docs/USE-CASE-CEKDULU.md        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ FASE 2 — SPESIFIKASI                                   [SELESAI]│
│ Tulis proposal, spec delta per kapabilitas, design, tasks        │
│ Output: openspec/project.md                                     │
│         openspec/changes/add-cekdulu-chatbot/{proposal,design,   │
│                                               tasks}.md          │
│         openspec/changes/add-cekdulu-chatbot/specs/*/spec.md    │
│ Hasil: 34 requirement, 20 keputusan, 19 non-goals               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ FASE 3 — IMPLEMENTASI                                  [SELESAI]│
│ Kerjakan tasks.md berurutan. Setiap task rujuk requirement ID.  │
│ Fase A inisialisasi proyek         SELESAI  4/4 task            │
│ Fase B backend index.js            SELESAI 14/14 task           │
│ Fase C uji backend via curl        SELESAI  6/6 task            │
│ Fase D frontend public/            SELESAI 20/20 task           │
│ Fase G redesain pola widget        SELESAI 20/20 task           │
│ Fase H landing page                SELESAI 19/19 task           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ FASE 4 — VERIFIKASI                                    [SELESAI]│
│ Jalankan 5 gate §5. Bukti = output nyata, bukan klaim.          │
│ Gate 1 keterlacakan   LULUS — 34 requirement                    │
│ Gate 2 server hidup   LULUS                                     │
│ Gate 3 kontrak API    LULUS                                     │
│ Gate 4 guardrail & UI LULUS — 15 dari 15 skenario                │
│ Gate 5 kebersihan     LULUS                                     │
│ Output: docs/QA-REPORT.md                                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ FASE 5 — ARSIP & SUBMIT                            [SEDANG JALAN]│
│ Pindahkan spec delta ke openspec/specs/ sebagai spec aktif.     │
│ Screenshot UI → 1 file ≤1 MB. Isi form.                         │
└─────────────────────────────────────────────────────────────────┘
```

> Status di atas diperbarui setiap kali satu fase tuntas. Rincian per task:
> `openspec/changes/add-cekdulu-chatbot/tasks.md`. Bukti verifikasi:
> `docs/QA-REPORT.md`.

---

## 4. Struktur artefak & fungsinya

```
openspec/
├── project.md                        # Konteks & aturan proyek untuk agent
├── specs/                            # Spec AKTIF (perilaku sistem saat ini)
│   └── (kosong sampai Fase 5)
└── changes/
    └── add-cekdulu-chatbot/
        ├── proposal.md               # WHY: masalah, scope, non-goals
        ├── design.md                 # HOW: keputusan teknis + alternatif ditolak
        ├── tasks.md                  # STEPS: checklist implementasi atomik
        └── specs/                    # WHAT: delta requirement per kapabilitas
            ├── web-server/spec.md
            ├── chat-api/spec.md
            ├── persona-guardrail/spec.md
            └── chat-ui/spec.md
```

| Artefak | Menjawab | Kenapa mencegah halusinasi |
|---|---|---|
| `project.md` | Batasan apa yang berlaku selalu? | Agent tahu stack & larangan tanpa harus baca ulang 234 halaman PDF |
| `proposal.md` | Apa yang dibangun & **apa yang tidak**? | Non-goals eksplisit mematikan scope creep |
| `specs/*/spec.md` | Perilaku apa yang benar? | Requirement ber-ID + skenario Given/When/Then → bisa diuji, tidak bisa ditafsir bebas |
| `design.md` | Kenapa memilih cara ini? | Alternatif yang ditolak dicatat, agar tidak "diperbaiki" balik oleh agent lain |
| `tasks.md` | Langkah apa berikutnya? | Task atomik + rujukan requirement → agent tidak improvisasi |

### Format delta spec

Mengikuti konvensi OpenSpec: bagian ditandai `## ADDED Requirements`,
`## MODIFIED Requirements`, `## REMOVED Requirements`. Karena ini proyek greenfield,
semuanya `ADDED`.

Setiap requirement wajib:
- Punya **ID** unik (`WS-01`, `API-03`, dst.) supaya bisa dirujuk dari `tasks.md`
- Punya **≥1 skenario** Given/When/Then yang bisa dieksekusi manual
- Punya **kolom sumber** (nomor halaman PDF atau nama dokumen)

Requirement tanpa sumber = **tidak sah**, harus dihapus atau dicari sumbernya.

---

## 5. Lima gate verifikasi

Tidak boleh menyatakan "selesai" sebelum kelima gate lewat, **dengan bukti output nyata**.

### Gate 1 — Keterlacakan sumber
Setiap requirement punya nomor halaman PDF atau nama dokumen sumber.
Setiap keputusan di `design.md` punya alasan tertulis.
**Bukti:** kolom "Sumber" terisi di semua tabel requirement.
Dijaga otomatis oleh CI job `traceability` — memastikan setiap requirement yang
didefinisikan di spec muncul di matriks `design.md` dan dirujuk `tasks.md`.

### Gate 2 — Server hidup
```bash
node index.js
# harus muncul log, tanpa exception
```
**Bukti:** output terminal ditempel apa adanya.

### Gate 3 — Kontrak API
```bash
curl -i -X POST http://localhost:3000/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"conversation":[{"role":"user","text":"halo"}]}'
```
Harus `200` + body `{"result": "..."}`.

Uji negatif:
```bash
curl -i -X POST http://localhost:3000/api/chat \
  -H 'Content-Type: application/json' -d '{}'
```
Harus `500` + body `{"error":"Messages must be an array!"}`.
**Bukti:** status code + body ditempel apa adanya.

### Gate 4 — Guardrail persona berfungsi
Jalankan **15 skenario** `USE-CASE-CEKDULU.md` §5 lewat UI di browser sungguhan.
**UJI-03 (menolak menilai legalitas entitas) adalah gate mutlak** — kalau bot menyatakan
sebuah aplikasi legal atau ilegal, implementasi **gagal** dan `systemInstruction` wajib
diperkuat sebelum lanjut.
**Bukti:** hasil per skenario ditulis lulus/gagal beserta kutipan jawaban bot.

### Gate 5 — Kebersihan repo
- `.env` tidak ter-track git
- Nilai `GEMINI_API_KEY` tidak pernah muncul di log, output, atau screenshot
- Tidak ada dependency di luar `express`, `dotenv`, `cors`, `@google/genai`
- Tidak ada `devDependencies`
- Tidak ada file temporer tersisa

**Bukti:** `git status` bersih dari `.env`; isi `package.json` ditempel.
Dijaga otomatis oleh CI job `hygiene` dan `constraints`.

---

## 5.1 Apa yang dijaga CI, apa yang tetap manual

CI (`.github/workflows/ci.yml`) menjalankan lima job pada setiap push, **tanpa
`npm install`** — hanya `node --check`, `node -e`, `git ls-files`, `git grep`, dan `grep`.

| Job | Menegakkan | Gate |
|---|---|---|
| `syntax` | `index.js` dan `public/script.js` bebas galat sintaks | prasyarat Gate 2 |
| `hygiene` | `.env` & PDF tidak ter-track; pola API key tidak muncul | Gate 5 |
| `constraints` | Tepat 4 dependency, tanpa devDeps, `"type": "module"`, `innerHTML` dilarang | Gate 5, D-07 |
| `prompt-audit` | `systemInstruction` bebas URL, email, telepon, persentase, nomor peraturan, rupiah | `PG-09` |
| `traceability` | Setiap requirement muncul di `design.md` dan `tasks.md` | Gate 1 |

**Yang tetap manual dan tidak bisa diotomatiskan:**

- **Gate 3** — kontrak API butuh server hidup dan API key nyata
- **Gate 4** — perilaku guardrail bersifat probabilistik; menilai apakah bot benar-benar
  menolak memberi penilaian legalitas memerlukan pembacaan manusia atas isi jawaban
- **`UI-11`** — kontras, urutan fokus, dan pengumuman screen reader diperiksa lewat
  DevTools dan navigasi keyboard nyata
- **`UI-12`** — konsistensi skala visual dinilai dengan mata, bukan regex

Pembagian ini disengaja: CI menjaga hal-hal yang **deterministik dan mudah dilanggar
diam-diam**; manusia menilai hal-hal yang **butuh penilaian**. Alasan pemilihan job:
`openspec/changes/add-cekdulu-chatbot/design.md` D-14.

---

## 6. Aturan saat mengubah rencana

Kalau di tengah implementasi ternyata spec salah atau kurang:

1. **STOP menulis kode.**
2. Perbaiki `specs/*/spec.md` atau `design.md` **lebih dulu**.
3. Sesuaikan `tasks.md`.
4. Baru lanjut koding.

**Dilarang** menulis kode yang menyimpang dari spec lalu memperbaiki spec belakangan
supaya cocok. Itu membuat spec kehilangan fungsinya sebagai alat kontrol.

Kalau konflik baru ditemukan di materi (seperti 6 konflik yang sudah ada), catat di
`AGENTS.md` §3 dengan format: bukti tiap sisi → keputusan → alasan.

---

## 7. Batas metodologi ini

Jujur tentang apa yang **tidak** dijamin:

- **Tidak menjamin bot selalu patuh.** LLM bersifat probabilistik; `systemInstruction`
  menurunkan risiko, tidak menghilangkannya. Karena itu Gate 4 diuji manual, bukan
  diasumsikan, dan UI memuat disclaimer permanen.
- **Tidak ada automated test.** Materi tidak membahas test framework, dan `package.json`
  di slide justru berisi placeholder `"test": "echo \"Error: no test specified\" && exit 1"`
  (S2 p.31, S3 p.26). Menambah Jest/Vitest berarti keluar dari batasan materi.
  Verifikasi karena itu **manual tapi terdokumentasi** — setiap skenario punya ID,
  input, dan ekspektasi tertulis, hasilnya dicatat di `docs/QA-REPORT.md`.
  CI menutup sebagian celah ini untuk hal-hal yang deterministik (§5.1).
- **Aksesibilitas tidak diaudit alat otomatis.** `UI-11` mencakup WCAG 2.1 AA untuk butir
  yang dapat diverifikasi manual. Audit menyeluruh dengan axe atau Lighthouse memerlukan
  dependency, jadi di luar cakupan. Keterbatasan ini diakui, bukan disembunyikan.
- **Angka riset akan kedaluwarsa.** Semua angka di `RISET-LAPANGAN.md` adalah snapshot
  per tanggal siaran pers. Itu sebabnya angka tidak ditanam di prompt.
- **Kuota API membatasi verifikasi.** Free tier hanya 20 permintaan per hari untuk model
  Text-out. Gate 4 karena itu dijalankan dengan urutan prioritas sadar kuota, dan mungkin
  terbagi ke dua hari. Detail: `KENDALA-API.md` §2, keputusan D-16.
- **Materi dapat tertinggal dari kondisi API.** Model `gemini-2.5-flash` yang ditetapkan
  materi sudah ditutup Google untuk akun baru. Ini menegaskan mengapa Gate 2 dan Gate 3
  harus dijalankan sungguhan, bukan diasumsikan: masalah semacam ini hanya terlihat saat
  kode benar-benar dieksekusi. Bukti: `KENDALA-API.md` §1, keputusan D-15.
- **Due date masih ambigu.** Slide S3 p.52 vs PDF Final Project p.2 berbeda
  (Sesi 3 vs Sesi 5). Keputusan sementara di `FINAL-PROJECT.md` §3; sebaiknya
  dikonfirmasi ke instruktur.
