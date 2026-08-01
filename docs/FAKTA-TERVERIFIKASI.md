# FAKTA-TERVERIFIKASI.md — Ledger Fakta → Halaman Sumber

> Setiap baris di file ini **sudah dibaca langsung dari PDF**.
> Kalau sebuah klaim tidak ada di tabel ini dan tidak ada di `SPEC-API.md`,
> maka klaim itu **belum terverifikasi** — jangan dipakai sebagai fakta.
>
> Notasi: `S1` = Sesi 1 - Materi Developers.pdf (106 hal),
> `S2` = Sesi 2 - Materi Developers.pdf (68 hal),
> `S2T` = Sesi 2 - Instalasi Tools.pdf (2 hal),
> `S3` = Sesi 3 - Materi Developers.pdf (58 hal).

---

## A. PROGRAM & ADMINISTRASI

| Fakta | Nilai | Sumber |
|---|---|---|
| Nama program | Maju Bareng AI | S1 p.2 |
| Penyelenggara | Hacktiv8 | S1 p.1 |
| Bagian dari | AI Opportunity Fund: Asia Pacific | S1 p.1 |
| Kolaborasi | AVPN | S1 p.1 |
| Didukung | Google.org, Asian Development Bank | S1 p.1 |
| Jalur pelatihan | [Developers] AI Productivity and AI API Integration for Developers | S1 p.2 |
| Timeline | 1 week (each batch) | S1 p.2 |
| Platform utama | ONLINE — Google Classroom & Google Meet | S1 p.2 |
| Total sesi | 3 | S1 p.2 |
| Total durasi | 10 Hours | S1 p.2 |
| Jam sesi online | 19.00–22.00 WIB | S1 p.4 |
| Local Training Partner | PT. Hacktivate Teknologi Indonesia (Hacktiv8) | S1 p.11 |
| Country | Indonesia | S1 p.11 |
| Kontak | 021 8067 5787, halo@hacktiv8.com | S1 p.106 |

### Syarat sertifikat (S1 p.6)

| Tier | Presence | Pre-Post Survey | Quiz | Final Project |
|---|---|---|---|---|
| Tier 1 | 2/3 | 2/2 | 3/3 | 1/1 |
| Tier 2 | 2/3 | 2/2 | 3/3 | 0/1 |

### Checklist tugas (S1 p.5)

| Phase | Task | Due Date |
|---|---|---|
| Session 1 | Pre-Test | Session 1 |
| Session 1 | Presence & Quiz 1 | Session 1 |
| Session 2 | Presence & Quiz 2 | Session 2 |
| Session 3 | Presence & Quiz 3 | Session 3 |
| Session 3 | Post-Test | Session 3 |
| Final Project | Form Submission: Final Project | H+2 Session 3 |

Deadline Quiz 1/2/3: hari yang sama, 23.59 WIB (S1 p.101, S2 p.66, S3 p.56).
Deadline Final Project: H+2 Sesi 3, 23.59 WIB (S3 p.52).

---

## B. KURIKULUM PER SESI (S1 p.3, p.7–8)

### Sesi 1 — Pengenalan AI & Membuat Website Menggunakan AI
- Konsep AI, generative AI & etikanya
- Teknik prompting untuk Large Language Model (LLM)
- Membangun Website menggunakan Gemini Canvas & V0
- Perangkat AI untuk produktivitas: Gemini Code Assist, Copilot, Google Antigravity
- Pengenalan NotebookLM

### Sesi 2 — Eksplorasi Gemini AI API
- Pengenalan Gemini AI API
- Menginisialisasi model Gemini AI
- Menghasilkan teks dengan input: Gambar, Audio, Teks, dokumen
- File API

### Sesi 3 — Pembuatan Chatbot berbasis Gemini AI Model
- Mengkonfigurasi Gemini AI API
- Parameter (temp, top_p, top_k)
- System Instruction
- Membuat Chatbot
- Mengimplementasikan Gemini AI pada Chatbot

---

## C. KONSEP AI (SESI 1)

| Fakta | Isi | Sumber |
|---|---|---|
| Definisi AI | Kemampuan komputer untuk meniru proses berpikir manusia seperti belajar, menalar, dan memecahkan masalah. | S1 p.13 |
| Definisi Generative AI | Jenis kecerdasan buatan yang mampu menciptakan konten baru (teks, gambar, musik, video) berdasarkan data yang telah dipelajari. | S1 p.13 |
| Cara kerja Gen AI | Mempelajari pola/struktur dari data yang sudah ada; salah satu teknik = Deep Learning dengan neural networks yang sangat besar. | S1 p.13 |
| Definisi LLM | Program komputer yang mempelajari dan menghasilkan bahasa menyerupai bahasa manusia menggunakan arsitektur transformer, dilatih pada data sangat besar. | S1 p.14 |
| Arsitektur transformer | Terdiri dari encoder dan decoder dengan kemampuan self-attention. | S1 p.14 |

### Prinsip Etika AI (S1 p.99, verbatim)

| Prinsip | Penjelasan | Analogi |
|---|---|---|
| Transparansi | Sistem AI harus dapat dipahami—pengguna perlu tahu apa yang dilakukan AI dan alasannya. | Seperti kalkulator: anda tahu rumus di balik perhitungannya. |
| Keadilan | AI harus memperlakukan semua pengguna secara adil—tanpa memandang gender, ras, atau latar belakang. | Seperti wasit yang adil dalam permainan. |
| Akuntabilitas | Manusia—bukan mesin—yang harus bertanggung jawab atas hasil yang dihasilkan AI. | Seperti koki yang bertanggung jawab atas masakan—bukan pisaunya. |
| Privasi | Data pribadi yang digunakan AI harus dilindungi dan hanya digunakan dengan persetujuan. | Seperti buku harian yang terkunci. |
| Keamanan | AI tidak boleh menimbulkan bahaya—baik sengaja maupun tidak. | Seperti merancang mobil dengan rem dan airbag. |

---

## D. DATA TREN (SESI 1)

### Jumlah pengguna Generative AI, US 2022–2026 (S1 p.16, sumber EMARKETER Forecast Juni 2024)

| Tahun | Juta pengguna | % populasi |
|---|---|---|
| 2022 | 7.8 | — |
| 2023 | 77.8 | 22.9% |
| 2024 | 100.1 | 29.3% |
| 2025 | 116.8 | 34.0% |
| 2026 | 127.2 | 36.7% |

### Industri yang mengadopsi Gen AI harian (S1 p.17, sumber Statista/AIPRM)

| Industri | % |
|---|---|
| Marketing and advertising | 37% |
| Technology | 35% |
| Consulting | 30% |
| Teaching | 19% |
| Accounting | 16% |
| Healthcare | 15% |

### Highest Anticipated Value from GenAI for 2025 (S1 p.18, sumber ISG 2024, n=201)

| Use case | % | Kategori |
|---|---|---|
| Customer service chatbots | 28% | Top Use Case in 2024 |
| Business process workflow management | 21% | Top Use Case in 2024 |
| Customer service support | 19% | Top Use Case in 2024 |
| Market research/customer insights | 18% | Emerging Use Case for 2025 |
| Customer communications | 18% | Top Use Case in 2024 |
| Software code generation/translation | 18% | Emerging Use Case for 2025 |
| Planning, budgeting and forecasting | 17% | Emerging Use Case for 2025 |
| Supply chain optimization | 16% | Emerging Use Case for 2025 |
| Regulatory documentation/compliance | 16% | Emerging Use Case for 2025 |
| Contact center management/monitoring | 15% | Top Use Case in 2024 |

### Investasi AI (S1 p.19, sumber coherentsolutions.com)

- **75%** of firms have employed AI by 2025 vs. 55% by 2024
- **92%** of companies look to invest more in AI in 2025–2027
- **20%** of tech budgets will be allocated to AI in 2025

### Tiga potensi AI untuk bisnis (S1 p.21–24)
1. Otomatisasi Tugas-Tugas Repetitif
2. Optimasi Alur Kerja
3. Peningkatan Kualitas Pengambilan Keputusan

---

## E. STUDI KASUS (SESI 1)

| Perusahaan | Masalah | Tool | Sumber PDF | Link |
|---|---|---|---|---|
| Grab | Lokalisasi rambu lalu lintas & penghitungan marka lajur di Asia Tenggara | GPT-4o (vision fine-tuning) | S1 p.26–27 | `https://openai.com/index/grab/` |
| Duolingo | Keterbatasan latihan percakapan & umpan balik kontekstual | GPT-4 | S1 p.28–29 | `https://openai.com/index/duolingo/` |
| Vodafone | Kebutuhan digital services baru & complex inquiries | Azure AI Studio, Azure OpenAI Service, Microsoft Copilot | S1 p.30 | `https://customers.microsoft.com/en-gb/story/1770174778560829849-vodafone-group-azure-telecommunications-en-united-kingdom` |

Produk Grab yang disebut: **GrabRideGuide** (S1 p.27).
Fitur Duolingo yang disebut: **Role Play**, **Explain My Answer**, produk **Duolingo Max** (S1 p.28–29).
Produk Vodafone: virtual assistant **TOBi**, **SuperAgent** (S1 p.30).

---

## F. PROMPT ENGINEERING (SESI 1)

### Elemen prompt (S1 p.32, verbatim)
- Instruksi
- Pertanyaan
- Data input tambahan / konteks
- Contoh cara menjawab pertanyaan
- Format output yang diinginkan

> Sebuah prompt dapat memiliki kelima elemen tersebut, namun sebenarnya tidak ada
> satu pun elemen yang wajib ada. ... Namun, agar sebuah prompt menjadi efektif,
> setidaknya harus ada instruksi atau pertanyaan yang disertakan.

### 4 Tips umum (S1 p.33–34)
1. Gunakan instruksi dan pertanyaan yang jelas
2. Berikan konteks
3. Spesifik (tentukan format output)
4. Dorong model untuk bersikap faktual

### 5 Teknik prompting (S1 p.35–36)
1. **Length Control** — tentukan panjang output
2. **Style Control** — tentukan gaya output
3. **Audience Control** — sesuaikan dengan audiens
4. **Scenario Based Guiding** — tentukan skenario khusus
5. **Pecah Subtask** — memecah tugas kompleks menjadi subtask

### Tabel prompt website (S1 p.37)

| Jenis | ❌ Buruk | ✅ Baik |
|---|---|---|
| Contoh | "Buatkan saya sebuah website" | "Buatkan sebuah website travel agency yang responsive dengan bagian: hero, tujuan, testimonial, Call to Action menggunakan TailwindCSS" |
| Prompt Layout Dasar | "Buatkan saya sebuah wireframe" | "Buat layout wireframe layout untuk sebuah website personal portfolio dengan bagian: hero, tentang saya, projek dan kontak." |
| Prompt Code-Specific | "Buatkan saya sebuah website menggunakan js" | "Buatkan kode HTML dan TailwindCSS yang responsif untuk bagian hero dengan call to action button dan gambar background." |
| Prompt Desain | "Buatkan saya sebuah website yang berwarna-warni" | "Sarankan sebuah palet warna yang modern, serta gaya font untuk website startup SaaS." |

---

## G. TOOLS AI (SESI 1)

### Kesimpulan tools (S1 p.86, verbatim)

| Tools | Fungsi Utama | Penggunaan Terbaik |
|---|---|---|
| Gemini Code Assist | Menghasilkan kode dan menjelaskan potongan kode | Web/App Developers |
| GitHub Copilot | Menyarankan kode pada baris di dalam IDE | Software Engineers |
| Google Antigravity | Kode Editor berbasis AI dengan Agent di dalamnya | Alur kerja yang membutuhkan AI di dalamnya |

Status wajib/opsional:
- Gemini Code Assist — **wajib**: "Registrasi, install dan melakukan konfigurasi pada VSCode" (S1 p.76)
- GitHub Copilot — **Alternatif / Opsional** (S1 p.79)
- Google Antigravity — **Alternatif / Opsional** (S1 p.82)

### Gemini Canvas — 7 langkah (S1 p.51–57)
1. Akses Gemini Canvas (`https://gemini.google.com/canvas`)
2. Mempersiapkan Canvas
3. Melakukan Prompting
4. Atur & Perbaiki Output
5. Bagikan & Berkolaborasi
6. Ulangi dengan Gemini AI
7. Bagikan & Gunakan Output

### v0.dev — 6 langkah (S1 p.60–65)
1. Akses v0.dev (`https://v0.dev`)
2. Tuliskan Prompt yang Jelas
3. Periksa Kembali Tampilan UI
4. Kustomisasi Komponen
5. Mengekspor Kode (Export → React, HTML, or CodeSandbox)
6. Gunakan pada Projek Anda

### NotebookLM (S1 p.88, p.91)

Cara kerja:
1. Upload dokumen (PDF, Google Docs, etc.)
2. Tanyakan pertanyaan
3. NotebookLM hanya menjawab berdasarkan dokumen sumber yang diberikan

Fitur untuk developer (S1 p.91, verbatim):

| Fitur | Fungsi | Contoh Penggunaan bagi Developer |
|---|---|---|
| Source Grounding | Membatasi jawaban AI hanya berdasarkan dokumen yang anda unggah. | Mempersingkat waktu untuk mencari informasi yang dibutuhkan pada PRD yang panjang. |
| Multi-Source Synthesis | Menghubungkan berbagai informasi dari berbagai file (PDF, Docs, Link) sekaligus. | Membandingkan dokumentasi API v1 dan v2 dari dua file berbeda untuk memetakan breaking changes. |
| Infographics | Visualisasi data dan informasi dalam grafis satu halaman. | Mengubah metrik sistem (latency/uptime) menjadi grafis visual untuk manajemen. |

Jenis file didukung NotebookLM (S1 p.90): PDF, .txt, Markdown, Audio (mis. mp3),
Google Drive (Google Dokumen, Google Slide), Link (Situs, YouTube), Tempelkan teks.

Output studio NotebookLM (S1 p.92–93): Ringkasan Audio, Ringkasan Video, Peta Pikiran,
Laporan, Kartu tanya jawab, Kuis, Infografis (BETA), Slide Presentasi (BETA).

### Best practice website AI (S1 p.68, verbatim)

| Lakukan | Jangan Lakukan |
|---|---|
| Sebutkan secara spesifik bagian dan tata letaknya. | Menggunakan petunjuk yang samar seperti "buatkan saya situs web" |
| Sebutkan preferensi desain (style, framework) | Berekspektasi mendapatkan production-ready code secara instan. |
| Lakukan iterasi dan kembangkan berdasarkan hasil yang ada | Menggunakan hasilnya tanpa meninjau atau memodifikasinya |
| Gabungkan dengan tool seperti V0.dev untuk implementasinya | Mengandalkan Canvas sebagai satu-satunya sumber. |

---

## H. MODEL GEMINI (SESI 2)

### Tiga model utama (S2 p.13, verbatim)

| Model | Deskripsi |
|---|---|
| Gemini 2.5 Pro | Model pemikiran canggih, mampu penalaran atas masalah kompleks dalam kode, matematika, dan STEM, serta menganalisis set data, codebase, dan dokumen besar dengan konteks panjang. |
| Gemini 2.5 Flash | Model terbaik dalam hal performa harga, kemampuan serbaguna. Paling cocok untuk pemrosesan skala besar, tugas bervolume tinggi dengan latensi rendah yang memerlukan penalaran, dan use case berbasis agen. |
| Gemini 2.5 Flash Lite | Model flash tercepat yang dioptimalkan untuk efisiensi biaya dan throughput tinggi. |

> Gemini versi 3 sudah tersedia, namun saat ini versi tersebut masih berupa
> preview atau percobaan. (S2 p.13)

### Model ID resmi (S2 p.12, dari docs Google)

| Model | ID |
|---|---|
| Gemini 2.5 Pro | `gemini-2.5-pro` |
| Gemini 2.5 Flash | `gemini-2.5-flash` |
| Gemini 2.5 Flash-Lite Preview | `gemini-2.5-flash-lite-preview-06-17` |
| Gemini 2.5 Flash Native Audio | `gemini-2.5-flash-preview-native-audio-dialog`, `gemini-2.5-flash-exp-native-audio-thinking-dialog` |
| Gemini 2.5 Flash Preview TTS | `gemini-2.5-flash-preview-tts` |

### Disclaimer pemilihan model (S2 p.15, verbatim)

> Untuk sesi praktik langsung (hands-on), kita akan menggunakan **Gemini 2.5 Flash**
> karena merupakan model yang paling hemat biaya, dengan performa yang cepat dan
> fleksibel, sehingga cocok untuk kebutuhan API secara real-time dan permintaan
> dalam jumlah besar.

### Checklist persiapan Sesi 2 (S2 p.8)
- Sudah terinstall Node.js v18+
- Akun Google Cloud dengan Gemini API
- Gemini API key
- Sudah terinstall VS Code
- Aset berupa Gambar, Dokumen dan file Audio

### Checklist persiapan Sesi 3 (S3 p.8)
- Sudah terinstall Node.js v18+
- Akun Google Cloud dengan Gemini API
- Gemini API key
- Sudah terinstall VS Code
- Starter Code Front End dengan Vanilla JS (`https://bit.ly/startercode-developers`)

### Peran tools dalam proyek (S2 p.25, verbatim)

| Tools | Kegunaan |
|---|---|
| Gemini Code Assist | Untuk membantu menyusun dan menghasilkan secara otomatis bagian-bagian dari logika API. |
| Gemini API | AI Engine yang memproses prompt dari pengguna |
| Node.js (Express) | Untuk membangun sebuah RESTful API |
| Postman | Untuk menguji (test) API |
| VS Code | Kode editor dengan extension Gemini Assist (opsional) |

---

## I. CHATBOT (SESI 3)

| Fakta | Isi | Sumber |
|---|---|---|
| Definisi chatbot | Aplikasi yang dirancang untuk mensimulasikan percakapan dengan pengguna manusia. | S3 p.12 |
| Basis kerja chatbot | (a) Aturan yang telah ditentukan (decision tree, if sederhana); (b) Machine learning atau LLM seperti Gemini | S3 p.12 |
| Penggunaan chatbot | Layanan pelanggan, asisten virtual, sistem rekomendasi, alat produktivitas pribadi (Copilot, ChatGPT, Google Bard) | S3 p.12 |
| Kemampuan target proyek | Terima input teks dari browser → kirim ke server Node.js → minta Gemini AI generate respons → tampilkan real-time | S3 p.13 |
| Arsitektur | Logika AI tetap di sisi backend — lebih aman dan scalable | S3 p.18 |

Key takeaways Sesi 3 (S3 p.54, verbatim):
- Chatbot mensimulasikan percakapan antara pengguna dan mesin.
- Gemini AI memungkinkan respons yang natural dan dinamis melalui API.
- `fetch()` menghubungkan frontend dan backend secara asynchronous.
- Route Express menangani pesan pengguna dan meneruskannya ke Gemini.
- Proyek ini menjembatani UI, logika backend, dan integrasi AI dalam satu alur kerja terpadu.

Tips menggunakan Gemini Code Assist secara efektif (S3 p.46, verbatim):
- Jaga prompt tetap singkat, tetapi tetap berikan konteks yang cukup.
- Jelaskan dengan jelas di mana kode akan ditempatkan (misalnya di dalam event listener).
- Gunakan prompt lanjutan seperti "Dapatkah anda mengoptimisasi kode ini?" atau "Tolong wrap kode ini ke dalam satu function." untuk penyempurnaan kode.

---

## J. HAL YANG **TIDAK ADA** DI MATERI

Jangan mengarang soal hal-hal ini — materi tidak membahasnya:

- ❌ Autentikasi / login / session pada chatbot
- ❌ Database / persistensi riwayat chat di server
- ❌ Rate limiting, throttling, atau kuota API di sisi aplikasi
- ❌ Streaming response (`generateContentStream`)
- ❌ Function calling / tool use Gemini
- ❌ Deployment ke Vercel/Railway/Render/Cloud Run
- ❌ Unit test / test framework (`package.json` justru berisi placeholder `"test": "echo \"Error: no test specified\" && exit 1"`)
- ❌ TypeScript
- ❌ Framework frontend (React/Vue/Svelte) untuk proyek Sesi 3 — **eksplisit Vanilla JS** (S3 p.34, p.37)
- ❌ Isi lengkap `index.html` dan `style.css` starter code (hanya ada screenshot tampilan, S3 p.10)
- ❌ Isi lengkap fungsi `appendMessage()` (terpotong di slide S3 p.39)
- ❌ Nilai `top_k` / `top_p` yang dipakai di kode contoh (hanya `temperature: 0.9` yang muncul di kode, S3 p.29)
