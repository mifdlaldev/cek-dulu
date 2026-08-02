# FINAL-PROJECT.md — Requirement & Kriteria Submit

> Sumber: `Sesi 2 - Materi Developers.pdf` p.26, `Sesi 3 - Materi Developers.pdf` p.49–52.

---

## 1. BRIEF RESMI (verbatim, S3 p.49 = S2 p.26)

> Buatlah sebuah chatbot berbasis AI dengan use case dan konfigurasi parameter yang
> sesuai dengan kreativitas masing-masing. Chatbot harus menggunakan model AI
> (misalnya NLP/LLM) untuk memproses bahasa alami dan memberikan respon yang relevan
> kepada pengguna.
>
> - **Contoh Use Case:** customer service bot, education bot, travel assistant,
>   personal productivity assistant, dll.
> - **Contoh Parameter Kreatif:** gaya bahasa (formal/santai), domain pengetahuan
>   tertentu (misalnya kesehatan, edukasi, hobi), integrasi API eksternal, atau fitur
>   tambahan seperti memory dan rekomendasi.
>
> **Deliverables:**
> - URL repositori GitHub
> - Screenshoots User Interface

---

## 2. DESKRIPSI TEKNIS PROYEK (verbatim, S2 p.27)

> Proyek ini adalah API RESTful yang dibangun dengan ExpressJS yang terintegrasi
> dengan Google Gemini 2.5 Flash untuk menghasilkan respons berbasis teks
> menggunakan berbagai tipe input:
> - Teks biasa
> - Berkas gambar
> - Berkas dokumen (misalnya, PDF, TXT)
> - Berkas audio (misalnya, MP3, WAV)
>
> Ini berfungsi sebagai middleware antara permintaan klien (misalnya, melalui
> Postman) dan API AI Gemini.

---

## 3. DEADLINE & FORM

| Item | Nilai | Sumber |
|---|---|---|
| Form submit | `https://bit.ly/finalproject-developers` | S3 p.52 |
| Due date | **H+2 Sesi 5, 23.59 WIB** | `Final Project - Developers.pdf` p.2 |
| Yang di-submit | URL repository GitHub + file UI | Form Google Formulir |

> ⚠️ **Konflik due date.** Slide S3 p.52 dan checklist S1 p.5 menulis "H+2 Sesi 3",
> sedangkan PDF `Final Project - Developers.pdf` p.2 menulis **"H+2 Sesi 5 | 23.59 WIB"**.
> PDF Final Project lebih spesifik dan lebih dekat ke sumber form.
> **KEPUTUSAN: pakai H+2 Sesi 5.** Tetap konfirmasi ke instruktur bila memungkinkan.

Langkah submit (S3 p.51, verbatim):
1. Salin (copy) URL repository GitHub (misalnya: `https://github.com/yourusername/gemini-ai-api-project`)
2. Tempelkan (paste) URL ke form pengumpulan projek yang ada di akhir sesi

---

## 3.1 ISI FORM GOOGLE FORMULIR (dari screenshot form aktual)

Pembuka form (verbatim):
> Final Project ini bertujuan untuk menilai kemampuan peserta dalam menerapkan materi
> yang telah dipelajari selama program berlangsung.
> Pastikan project dikumpulkan sesuai dengan ketentuan yang telah ditetapkan.
> Terima kasih atas kerja sama dan partisipasi Anda.

Catatan form: "Nama, alamat email, dan foto yang terkait dengan Akun Google Anda akan
direkam saat Anda mengupload file dan mengirimkan formulir ini."

| # | Field | Wajib | Keterangan |
|---|---|---|---|
| 1 | Email | ✅ | — |
| 2 | Nama | ✅ | — |
| 3 | Nomor Telepon | ✅ | Format: `628`. "Mohon untuk tidak menggunakan + / -" |
| 4 | Wave | ✅ | Pilihan: `Wave 20 - Agustus` |
| 5 | Batch | ✅ | "Pilih batch sesuai dengan nama Instructor di kelas yang Anda hadiri" — pilihan: `[IT] Batch 28 - Mutia Ayu Dianita` |
| 6 | **Nama project** | ✅ | Isian teks singkat |
| 7 | **Siapa target pengguna chatbot Anda?** | ✅ | Isian esai |
| 8 | **Bagaimana chatbot Anda dapat membantu pengguna?** | ✅ | Isian esai |
| 9 | **Link Github** | ✅ | URL repo |
| 10 | **UI (User Interface) chatbot** | ✅ | Upload **1 file**, format **PDF atau image**, **maks 1 MB** |
| 11 | Izin publikasi oleh tim Hacktiv8 | ✅ | `Ya, saya setuju` / `Tidak, saya tidak setuju` |

Catatan footer form: "Jangan pernah mengirimkan sandi melalui Google Formulir."

### Implikasi penting

1. **Field 7 dan 8 adalah kriteria penilaian yang tidak muncul di slide.** Use case
   dinilai dari kejelasan target pengguna dan manfaat konkret — bukan dari kerumitan
   teknis. Jawaban siap pakai ada di `USE-CASE-CEKDULU.md` §2.
2. **Field 10 dibatasi 1 MB dan hanya 1 file.** Kalau butuh beberapa tampilan
   (kondisi awal, percakapan berjalan, guardrail menolak), gabungkan ke **satu PDF**
   lalu kompres di bawah 1 MB.
3. **Field 6 "Nama project"** — nama proyek harus ditentukan sebelum submit.
   Nama terpilih: **Cek Dulu**.

---

## 4. CHECKLIST KESIAPAN SUBMIT

Backend — **selesai**, diverifikasi di `docs/QA-REPORT.md`:
- [x] `package.json` ada `"type": "module"`
- [x] Dependencies: `express`, `dotenv`, `cors`, `@google/genai` — tanpa `multer` karena tidak ada endpoint file
- [x] `index.js` inisialisasi `new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })`
- [x] `const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-flash-latest'` — materi menetapkan `gemini-2.5-flash`, tetapi model itu ditutup Google (`KENDALA-API.md` §1)
- [x] `app.use(cors())` dan `app.use(express.json())`
- [x] `app.use(express.static(path.join(__dirname, 'public')))`
- [x] Endpoint `POST /api/chat` baca `{ conversation }`, balas `{ result }`
- [x] `config` berisi `temperature` + `topP` + `topK` + `systemInstruction` sesuai use case
- [x] Server listen di port 3000

Frontend (`public/`) — **selesai**, diverifikasi di browser nyata:
- [x] `index.html` punya `#chat-form`, `#user-input`, `#chat-box`
- [x] `script.js` kirim body `{ conversation: [{ role, text }] }` — **bukan** `{ messages: [{ role, content }] }`
- [x] `script.js` baca `data.result`
- [x] Tampil pesan sementara lalu diganti jawaban AI di tempat yang sama
- [x] Fallback error: `"Sorry, no response received."` / `"Failed to get response from server."`
- [x] `style.css` mengatur tampilan chatbot dengan design token terpusat
- [x] Aksesibilitas: `lang="id"`, `aria-live`, `aria-busy`, label input, navigasi keyboard, kontras terendah 8,03:1

Repo — **sebagian selesai**:
- [x] `.gitignore` isi: `/node_modules`, `.env`, `package-lock.json`
- [x] `.env` **TIDAK** ter-commit — diverifikasi termasuk terhadap riwayat commit
- [x] `README.md` menjelaskan cara install + run
- [ ] Screenshot UI sudah diambil — Fase F

Verifikasi nyata (bukan asumsi):
- [x] `node index.js` → server hidup, log muncul tanpa nilai kredensial
- [x] `curl -X POST http://localhost:3000/api/chat -H 'Content-Type: application/json' -d '{"conversation":[{"role":"user","text":"halo"}]}'` → dapat `{ "result": ... }`
- [x] `curl` dengan body `{}` → `500 {"error":"Messages must be an array!"}`
- [x] UJI-03 guardrail legalitas → bot menolak menilai entitas
- [x] Buka `http://localhost:3000/` di browser, kirim pesan → balasan muncul di UI
- [x] Cek console browser tidak ada error

Bukti mentah seluruh verifikasi: `docs/QA-REPORT.md`.

Kesiapan isi form:
- [x] Nama project ditentukan → **Cek Dulu**
- [x] Jawaban "Siapa target pengguna" siap → `USE-CASE-CEKDULU.md` §2
- [x] Jawaban "Bagaimana chatbot membantu pengguna" siap → `USE-CASE-CEKDULU.md` §2
- [ ] File UI: **1 file** PDF atau image, **≤ 1 MB** — Fase F
- [x] 15 skenario uji `USE-CASE-CEKDULU.md` §5 dijalankan — **15/15 lulus**, termasuk UJI-03 guardrail legalitas
- [ ] Nomor telepon format `628...` tanpa `+` atau `-` — diisi saat submit

---

## 5. IDE KREATIVITAS (dari contoh batch sebelumnya, S2 p.67)

Slide S2 p.67 memperlihatkan 3 hasil batch sebelumnya sebagai referensi:

1. **Chatbot Edukasi Finansial** — "Membantu memahami konsep keuangan secara ritel
   dan sederhana". Punya disclaimer: "Saya membantu menjelaskan konsep keuangan dan
   kerangka berpikir, namun tidak memberikan saran investasi personal." Footer:
   "Informasi bersifat edukatif dan bukan nasihat finansial profesional". Ada chip
   contoh pertanyaan: "apa itu inflasi dan dampaknya?"

2. **Weather Forecast Chatbot** — Bahasa Inggris, ada toggle **Dark Mode**,
   placeholder input "Ask me about the weather...", persona ramah dengan emoji.

3. **PuncakNusantara — Gear & Guide** — Website hiking lengkap (nav: Beranda, Alat
   Hiking, Pemandu, Ulasan) dengan chat widget **Ranger Bot** ("Online • Siap
   membantu") yang menawarkan rekomendasi alat hiking, jalur pendakian, dan pemandu.
   Ada quick-reply chips: "Rekomendasi tenda", "Pemandu Terbaik".

Pola yang bisa dicontoh:
- Persona jelas + nama bot
- Sapaan pembuka otomatis yang menjelaskan kemampuan bot
- Quick-reply chips / contoh pertanyaan
- Disclaimer kalau domainnya sensitif (finansial/kesehatan)
- `systemInstruction` yang mengikat persona + batasan domain
- `temperature` disesuaikan: rendah untuk faktual, tinggi untuk kreatif

> **Catatan:** contoh #1 (Chatbot Edukasi Finansial) paling dekat dengan use case
> terpilih **Cek Dulu**, terutama pola disclaimer eksplisit di footer. Pola itu diadopsi.
> Detail use case terpilih → `USE-CASE-CEKDULU.md`.
