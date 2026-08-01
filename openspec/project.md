# project.md — Konteks Proyek untuk Coding Agent

> Dibaca **pertama** oleh agent sebelum menyentuh kode apa pun.
> Berlaku untuk semua change di `openspec/changes/`.

---

## Identitas

| Item | Nilai |
|---|---|
| Nama project | **Cek Dulu** |
| Jenis | Final Project Hacktiv8 "Maju Bareng AI" |
| Jalur | [Developers] AI Productivity and AI API Integration for Developers |
| Wave / Batch | Wave 20 - Agustus / [IT] Batch 28 - Mutia Ayu Dianita |
| Bahasa komunikasi | Indonesia |
| Bahasa kode & identifier | Inggris (verbatim sesuai materi) |

---

## Stack — TERKUNCI, tidak boleh diubah

| Item | Nilai | Sumber |
|---|---|---|
| Runtime | Node.js v18+ | S2 p.8, p.19 |
| Module system | ESM — `"type": "module"` | S2 p.31, S3 p.26 |
| Web framework | Express `^5.1.0` | S3 p.26 |
| SDK Gemini | `@google/genai` `^1.10.0` | S3 p.26 |
| CORS | `cors` `^2.8.5` | S3 p.26 |
| Env loader | `dotenv` `^17.2.0` | S3 p.26 |
| Model (materi) | `gemini-2.5-flash` — **ditutup Google untuk akun baru** | S3 p.28 |
| Model (dipakai) | `process.env.GEMINI_MODEL ?? 'gemini-flash-latest'` | `docs/KENDALA-API.md` §1, `design.md` D-15 |
| Frontend | Vanilla JS — HTML + CSS + JS, **tanpa framework** | S3 p.34, p.37 |
| Port | `3000` | S3 p.28 |
| Env var wajib | `GEMINI_API_KEY` | S2 p.32, S3 p.27 |
| Env var opsional | `GEMINI_MODEL` | `design.md` D-15 |

**Dependency tambahan = DILARANG** tanpa persetujuan eksplisit user. Termasuk:
test framework, TypeScript, bundler, linter, markdown renderer, UI library, ORM.

---

## Pola SDK yang WAJIB dipakai

```javascript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const response = await ai.models.generateContent({
  model: GEMINI_MODEL,
  contents,
  config: { /* temperature, topP, topK, systemInstruction */ },
});

// hasil teks:
response.text
```

**DILARANG** (API SDK lama `@google/generative-ai`, bukan yang dipakai materi):
- `new GoogleGenerativeAI(...)`
- `getGenerativeModel(...)`
- `model.startChat(...)`
- `result.response.text()`

---

## Kontrak API — TERKUNCI

`POST /api/chat`

Request:
```json
{ "conversation": [ { "role": "user", "text": "..." } ] }
```

Response sukses `200`:
```json
{ "result": "..." }
```

Response gagal `500`:
```json
{ "error": "..." }
```

Role valid: `"user"`, `"model"`.

**Perangkap yang harus dihindari:** contoh `script.js` di slide S3 p.39 mengirim
`{ messages: [{ role, content }] }`. Itu **tidak cocok** dengan backend. Payload benar
adalah `{ conversation: [{ role, text }] }`. Lihat `AGENTS.md` §3.2.

---

## Struktur file

Tanda ⬜ menandai berkas yang belum dibuat.

```
Project-Akhir-Hacktiv8/
├── index.js              ✅ Backend, 20 requirement
├── package.json          ✅ 4 dependency, ESM
├── public/               ⬜ Fase D
│   ├── index.html        ⬜
│   ├── script.js         ⬜
│   └── style.css         ⬜
├── .env                  🔒 JANGAN commit, JANGAN tulis nilainya ke output
├── .env.example          ✅
├── .gitignore            ✅
├── AGENTS.md             ✅
├── README.md             ✅
├── docs/                 ✅
└── openspec/             ✅
```

Progres task terkini: `openspec/changes/add-cekdulu-chatbot/tasks.md`.
Bukti verifikasi: `docs/QA-REPORT.md`.

---

## Rules per artefak

### proposal.md
- Sebutkan masalah nyata + dampak ke pengguna
- **Wajib** ada bagian Non-Goals yang eksplisit
- Sebutkan kapabilitas yang tersentuh

### specs/*/spec.md
- Setiap requirement punya **ID unik** (`WS-01`, `API-02`, `PG-03`, `UI-04`)
- Setiap requirement punya **≥1 skenario** format `#### Scenario:` dengan Given/When/Then
- Setiap requirement punya **kolom Sumber** — nomor halaman PDF atau nama dokumen
- Requirement tanpa sumber = tidak sah
- Pakai penanda `## ADDED Requirements` / `## MODIFIED Requirements` / `## REMOVED Requirements`

### design.md
- Setiap keputusan teknis punya alasan tertulis
- **Wajib** catat alternatif yang ditolak beserta alasannya
- Sertakan matriks keterlacakan requirement → sumber

### tasks.md
- Task atomik: selesai dalam 1 file atau 1 perintah
- Setiap task **merujuk requirement ID**
- Gate verifikasi ditulis sebagai task tersendiri, bukan catatan

---

## Aturan keamanan

- `.env` tidak boleh di-commit. Sudah di `.gitignore`.
- Nilai `GEMINI_API_KEY` tidak boleh muncul di log, `console.log`, output terminal,
  screenshot, atau commit message.
- API key hanya di backend. Frontend **tidak boleh** memegang key — ini alasan
  arsitektural materi menaruh logika AI di backend (S3 p.18).
- Tidak ada penyimpanan data pengguna di server. Riwayat chat hanya di memori browser.

---

## Aturan anti-halusinasi ringkas

1. Belum membaca file → **jangan** berkomentar tentang isinya.
2. Klaim tentang materi → **wajib** sebut nomor halaman.
3. Fakta tidak ada di PDF → katakan **"tidak ada di materi"**, jangan menebak.
4. Kode slide menang atas narasi slide.
5. Angka statistik dari `docs/RISET-LAPANGAN.md` **tidak boleh** masuk `systemInstruction`.
6. Nomor kontak, email, URL resmi ditulis **statis di HTML**, bukan digenerate LLM.
7. Selesai = 5 gate `docs/METODOLOGI.md` §5 lewat dengan bukti output nyata.

---

## Peta dokumen

| Butuh tahu | Baca |
|---|---|
| Aturan kerja & konflik materi | `AGENTS.md` |
| Kode verbatim dari slide | `docs/SPEC-API.md` |
| Fakta + halaman sumber, dan apa yang **tidak ada** di materi | `docs/FAKTA-TERVERIFIKASI.md` |
| Use case, persona, guardrail, skenario uji | `docs/USE-CASE-CEKDULU.md` |
| Data eksternal & sitasinya | `docs/RISET-LAPANGAN.md` |
| Cara kerja & gate verifikasi | `docs/METODOLOGI.md` |
| Requirement yang sedang dibangun | `openspec/changes/add-cekdulu-chatbot/` |
| Requirement form submit | `docs/FINAL-PROJECT.md` |
