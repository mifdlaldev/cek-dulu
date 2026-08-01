# Panduan Kontribusi

Terima kasih atas minat Anda. Repositori ini adalah **final project pelatihan**, jadi
alur kerjanya sedikit berbeda dari proyek open source biasa.

---

## Prinsip utama: spec dulu, kode kemudian

Proyek ini memakai **spec-driven development**. Tidak ada kode yang ditulis tanpa
requirement ber-ID yang punya sumber tertulis.

Sebelum mengubah apa pun, baca berurutan:

1. [`openspec/project.md`](openspec/project.md) — batasan stack yang selalu berlaku
2. [`openspec/changes/add-cekdulu-chatbot/proposal.md`](openspec/changes/add-cekdulu-chatbot/proposal.md) — scope dan **non-goals**
3. `openspec/changes/add-cekdulu-chatbot/specs/*/spec.md` — 30 requirement + skenario
4. [`openspec/changes/add-cekdulu-chatbot/design.md`](openspec/changes/add-cekdulu-chatbot/design.md) — keputusan dan alternatif yang ditolak
5. [`docs/METODOLOGI.md`](docs/METODOLOGI.md) — alur kerja dan lima gate verifikasi

**Bila spec ternyata kurang atau salah: perbaiki spec lebih dulu, baru ubah kode.**
Menulis kode yang menyimpang lalu menyesuaikan spec agar cocok membuat spec kehilangan
fungsinya.

---

## Batasan yang tidak bisa dinegosiasikan

Proyek ini terikat materi pelatihan. Hal berikut **terkunci**:

| Item | Nilai |
|---|---|
| Dependency | Tepat empat: `express`, `dotenv`, `cors`, `@google/genai` |
| SDK | `@google/genai` — **bukan** `@google/generative-ai` |
| Model | `gemini-2.5-flash` |
| Endpoint | `POST /api/chat` saja |
| Body request | `{ conversation: [{ role, text }] }` |
| Body respons | `{ result }` atau `{ error }` |
| Frontend | Vanilla JS, tanpa framework, tanpa build step |
| Port | 3000 |

Menambah dependency, mengganti SDK, atau mengubah kontrak API akan ditolak — bukan
karena preferensi, tetapi karena melanggar batasan materi yang menjadi acuan penilaian.

Daftar lengkap hal yang **tidak** dikerjakan: `proposal.md` §3 (14 non-goals).

---

## Aturan anti-halusinasi

Repositori ini disusun agar tahan terhadap kekeliruan yang khas muncul saat bekerja
dengan bantuan AI. Bila Anda berkontribusi dengan bantuan AI, patuhi juga aturan
berikut (lengkapnya di [`AGENTS.md`](AGENTS.md)):

- Klaim tentang isi materi **wajib** menyebut nomor halaman
- Fakta yang tidak ada di materi → katakan "tidak ada di materi", jangan menebak
- Angka statistik dari `docs/RISET-LAPANGAN.md` **dilarang** masuk `systemInstruction` —
  angka itu snapshot dan akan kedaluwarsa
- Data presisi (nomor telepon, email, URL) ditulis **statis di HTML**, tidak diserahkan
  ke model
- Respons model dirender dengan `textContent`, **bukan** `innerHTML`

---

## Kredensial

- Jangan pernah meng-commit `.env`
- Jangan pernah menampilkan nilai `GEMINI_API_KEY` di kode, log, issue, atau screenshot
- Gunakan `.env.example` sebagai acuan variabel yang dibutuhkan

Bila Anda menduga sebuah key pernah ter-commit, cabut key tersebut di
`https://aistudio.google.com/u/0/api-keys` lalu buat yang baru.

---

## Sebelum mengirim pull request

Jalankan lima gate verifikasi (`docs/METODOLOGI.md` §5) dan sertakan **bukti keluaran
nyata**, bukan pernyataan:

1. **Keterlacakan** — requirement yang tersentuh punya sumber tertulis
2. **Server hidup** — `node index.js` jalan, tempel keluaran terminal
3. **Kontrak API** — `curl` positif → `200 {result}`; `curl` negatif → `500 {error}`
4. **Guardrail** — 12 skenario `docs/USE-CASE-CEKDULU.md` §5 dijalankan di browser.
   **UJI-03 wajib lulus** — bila bot menyatakan sebuah entitas legal atau ilegal,
   perubahan Anda tidak dapat diterima
5. **Kebersihan** — `.env` tidak ter-track, tidak ada dependency tambahan

"Seharusnya jalan" tidak diterima sebagai bukti.

---

## Gaya

- Bahasa dokumentasi dan pesan commit: **Indonesia**
- Nama berkas, path, identifier kode, dan pesan error: **verbatim**, jangan diterjemahkan
- Perubahan seminimal mungkin. Perbaikan bug bukan kesempatan melakukan refactor
- Jangan membuat abstraksi untuk operasi sekali pakai
