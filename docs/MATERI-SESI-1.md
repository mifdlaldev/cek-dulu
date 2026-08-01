# MATERI-SESI-1.md — Pengenalan AI & Membuat Website Menggunakan AI

> Sumber: `Sesi 1 - Materi Developers.pdf` (106 halaman).
> Nomor halaman = halaman PDF.

---

## Agenda (p.9)

- Apa itu AI, Generative AI, and LLM?
- Memahami Etika AI
- Pengenalan pada Prompt Engineering
- Teknik Prompting
- Cara membuat website menggunakan Gemini Canvas dan V0
- Gambaran Umum AI Productivity Tools
- Cara menggunakan Gemini Code Assist, Github Copilot dan Google Antigravity
- Pengenalan pada NotebookLM

---

## 1. Pendahuluan: AI, Generative AI, LLM (p.13–14)

**Artificial Intelligence (AI)** — kemampuan komputer untuk meniru proses berpikir
manusia seperti belajar, menalar, dan memecahkan masalah.

**Generative AI** — jenis kecerdasan buatan yang mampu menciptakan konten baru
(teks, gambar, musik, bahkan video) berdasarkan data yang telah dipelajari
sebelumnya. Bekerja dengan mempelajari pola/struktur dari data yang sudah ada;
salah satu tekniknya **Deep Learning** — model AI dilatih menggunakan jaringan
saraf tiruan (neural networks) yang sangat besar.

**Large Language Model (LLM)** — program komputer yang mempelajari dan menghasilkan
bahasa menyerupai bahasa manusia menggunakan **arsitektur transformer**, dilatih pada
data dalam jumlah sangat besar. Transformer terdiri dari **encoder** dan **decoder**
dengan kemampuan **self-attention**.

LLM sangat fleksibel — satu model bisa menjawab pertanyaan, meringkas dokumen,
menerjemahkan bahasa, dan melengkapi kalimat.

---

## 2. Tren Penggunaan Gen AI (p.15–24)

Data lengkap ada di `FAKTA-TERVERIFIKASI.md` §D. Ringkasan:

- Pengguna Gen AI di US naik dari 7.8 juta (2022) → 127.2 juta (2026), 36.7% populasi.
- Industri teratas adopsi harian: Marketing & advertising 37%, Technology 35%, Consulting 30%.
- Use case bernilai tertinggi 2025: **Customer service chatbots 28%** (top use case 2024).
- 92% perusahaan akan invest lebih di AI 2025–2027; 20% budget tech dialokasikan ke AI 2025.
- Framing slide p.20: `Adapt` vs `Left Behind` — **Stay Relevant**.

Tiga potensi AI untuk bisnis (p.21–24):

| Potensi | Isi | Dampak |
|---|---|---|
| Otomatisasi Tugas-Tugas Repetitif | Otomatisasi tugas repetitif, berbasis pola, memakan waktu. | Mengurangi kesalahan, menghemat waktu, karyawan fokus ke tugas strategis & kreatif. |
| Optimasi Alur Kerja | Metode berbasis AI untuk menyederhanakan proses bisnis lewat optimalisasi alokasi sumber daya & waktu. | Meningkatkan efisiensi, mengurangi bottleneck, operasional lebih lancar. |
| Peningkatan Kualitas Pengambilan Keputusan | Analisis data besar untuk menghasilkan insight. | Keputusan berbasis data lebih cepat, risiko turun, hasil bisnis meningkat. |

---

## 3. Studi Kasus (p.25–30)

### Grab (p.26–27)
Membangun peta yang lebih cerdas untuk Asia Tenggara dengan fine-tuning visi.
- **Masalah:** Lokalisasi rambu lalu lintas dan penghitungan marka lajur secara akurat di lingkungan jalan yang beragam di Asia Tenggara.
- **Integrasi:** vision fine-tuning GPT-4o untuk meningkatkan akurasi pemetaan.
- **Tool:** GPT-4o (vision fine-tuning).
- **Dampak:** mengurangi pekerjaan manual & biaya operasional; peningkatan keandalan peta untuk operasional Grab dan pelanggan enterprise; perluasan layanan berbasis AI seperti asisten suara dan chatbot.
- Produk yang ditampilkan: **GrabRideGuide** — "alat AI terbaru kami yang memandu mitra pengemudi ke area dengan permintaan perjalanan secara real-time."

### Duolingo (p.28–29)
GPT-4 meningkatkan kualitas percakapan.
- **Masalah:** Keterbatasan dalam menyediakan latihan percakapan dan umpan balik kontekstual terhadap kesalahan pengguna.
- **Integrasi:** fitur **"Role Play"** sebagai mitra percakapan AI; fitur **"Explain My Answer"** untuk menjelaskan aturan saat pengguna salah.
- **Tool:** GPT-4.
- **Dampak:** keterlibatan pengguna naik lewat percakapan lebih natural; pemahaman lebih mendalam terhadap kesalahan pengguna.
- Produk: **Duolingo Max** — "The best plan for advanced learning. New AI-powered features plus all the benefits of Super."

### Vodafone (p.30)
Memperkuat inovasi call center.
- **Masalah:** kebutuhan pelanggan terhadap digital services baru; menangani complex inquiries lebih efisien; tuntutan fast and personalized responses.
- **Integrasi:** peningkatan kapabilitas virtual assistant **TOBi** memakai Microsoft Azure AI Studio, Azure OpenAI Service, Microsoft Copilot; pengembangan **SuperAgent** untuk bantu customer care agents.
- **Tools:** Azure AI Studio, Azure OpenAI Service, Microsoft Copilot.
- **Dampak:** customer satisfaction & retention naik; layanan lebih personalized; employee inclusion meningkat lewat demokratisasi teknologi.

---

## 4. Prompt Engineering 101 (p.31–37)

**Definisi (p.32):** Prompt engineering adalah seni merancang input (prompt) untuk
membimbing AI agar menghasilkan output yang sesuai.

**Elemen prompt (p.32):** Instruksi · Pertanyaan · Data input tambahan/konteks ·
Contoh cara menjawab pertanyaan · Format output yang diinginkan.

> Tidak ada satu pun elemen yang wajib. Anda bahkan bisa memulai sebuah kalimat dan
> membiarkan model melanjutkannya (auto-completion). Namun agar efektif, setidaknya
> harus ada instruksi atau pertanyaan.

### 4 Tips umum (p.33–34)

| # | Tips | Ketentuan | ❌ Dari pada | ✅ Coba |
|---|---|---|---|---|
| 1 | Gunakan instruksi dan pertanyaan yang jelas | Semakin spesifik prompt anda, semakin baik AI memahami dan menjawab kebutuhanmu. | "Jelaskan mengenai TypeScript" | "Jelaskan perbedaan utama antara JavaScript dan TypeScript, dengan fokus pada kelebihan dan kekurangan masing-masing bahasa" |
| 2 | Berikan konteks | Berikan informasi latar belakang yang relevan agar AI dapat membingkai jawaban dengan tepat. | "Sarankan 3 fitur terbaik untuk aplikasi E-commerce." | "Saya sedang membuat aplikasi E-commerce menggunakan React. Tolong berikan 3 fitur terbaik yang perlu diimplementasikan agar aplikasi saya memenuhi standar umum aplikasi E-commerce" |
| 3 | Spesifik | Tentukan format output yang diinginkan. | "Tolong berikan materi pembelajaran React." | "Tolong berikan materi pembelajaran React dalam bentuk rencana belajar harian selama satu minggu, dan sertakan video referensinya." |
| 4 | Dorong model untuk bersikap faktual | Arahkan AI agar menggunakan sumber yang tepercaya. | "Bagaimana caranya menggunakan React Redux Toolkit?" | "Bagaimana cara menggunakan React Redux Toolkit? Tolong jawab hanya berdasarkan dokumentasi resmi yang tepercaya dan sertakan tautan dokumentasinya." |

### 5 Teknik mengontrol output (p.35–36)

| # | Teknik | Ketentuan | Contoh |
|---|---|---|---|
| 1 | Length Control | Tentukan panjang output yang diinginkan | "Berikan saya 50 data of film populer sepanjang masa dengan nama, tahun rilis, dan sutradara" |
| 2 | Style Control | Tentukan gaya output yang diinginkan | "Berikan saya data film dengan nama, tahun rilis, dan sutradaranya dalam bentuk array of object javascript" |
| 3 | Audience Control | Tentukan output berdasarkan audiens | "Berikan saya penjelasan tentang apa itu NextJS untuk anak berusia 5 tahun" |
| 4 | Scenario Based Guiding | Tentukan output dengan skenario khusus | "Berikan saya penjelasan tentang tipe data di javascript seakan-akan Anda adalah Senior Developer" |
| 5 | Pecah Subtask | Memecah tugas kompleks menjadi subtask | "Tolong bantu saya membuat situs web portofolio sederhana dengan React dengan mengikuti langkah-langkah ini: • Buat endpoint menggunakan react router yang memiliki 3 halaman, Landing page, About Me, dan halaman Portfolio • Saat membuat landing page, tolong buatlah menjadi bergaya dan berwarna • Saat membuat halaman portfolio, tolong buat gaya yang menyoroti techstack dan fitur aplikasi saya" |

### Tabel prompt website (p.37)
Ada di `FAKTA-TERVERIFIKASI.md` §F.

---

## 5. Gemini Canvas & v0.dev (p.40–68)

### Gemini Canvas (p.42, p.47)
Workspace kolaboratif eksperimental didukung Gemini AI dari Google (sebelumnya Bard).
Dirancang untuk membantu membuat ide, brainstorming, merencanakan, dan berkreasi
menggunakan prompt bahasa alami dalam kanvas berbasis visual + teks.

> 🔍 Singkatnya: Gemini Canvas adalah ruang bebas di mana Anda dapat mengobrol dengan
> Gemini AI sambil mengatur ide, tugas, atau bahkan kode secara visual.

Fitur utama (p.47):
- **Freeform Canvas** — tulis di mana saja, pindahkan item, susun ide secara visual.
- **Asisten dengan Dukungan AI** — generate konten, potongan kode, diagram, bertukar ide.
- **Input Multimodal** — kombinasi teks, gambar, kode, dan link di satu tempat.
- **Konteks Persisten** — Gemini mengingat konteks kanvas saat Anda bekerja.
- Desain dan preview kode yang dapat diekspor & mendukung iterasi.

7 Langkah (p.51–57):
1. **Akses Gemini Canvas** — `https://gemini.google.com/canvas`. Pastikan sudah login akun Google & Gemini tersedia di wilayah Anda (paling baik dengan input bahasa Inggris).
2. **Mempersiapkan Canvas** — bisa mengetik bebas seperti Google Docs, memindahkan & mengatur ide visual, mengobrol langsung dengan prompt di blok teks manapun. Tip: gunakan heading seperti "Hero Section" atau "Navigation Menu".
3. **Melakukan Prompting** — contoh Prompt Layout Dasar, Prompt Code-Specific, Prompt Desain (lihat p.37).
4. **Atur & Perbaiki Output** — edit langsung kode di canvas, ajukan pertanyaan lanjutan pada blok kode spesifik (contoh: "Bisakah tampilannya dibuat menjadi mobile-friendly?"), lihat riwayat & versi, bagikan/salin kode ke editor. Tip: variasi "revisi agar lebih minimalis" atau "tambahkan animasi saat discroll."
5. **Bagikan & Berkolaborasi** — presentasikan ke tim, bagikan ide visual, jadikan dasar prototipe.
6. **Ulangi dengan Gemini AI** — contoh follow-up: "Bisakah Anda menambahkan bagian harga di bawah ini?", "Ubah tata letak ini menjadi desain yang mobile-first.", "Jelaskan apa yang dilakukan kode JavaScript ini."
7. **Bagikan & Gunakan Output** — salin HTML/CSS/JS dari blok kode, perbaiki di IDE (VSCode), gabungkan dengan komponen dari V0.dev.

### v0.dev (p.43, p.48)
UI development tool dengan dukungan AI oleh **Vercel** — generate komponen React
dari deskripsi bahasa Inggris. Fokus mengubah prompt bahasa alami menjadi komponen
React yang clean, production-ready, dengan style TailwindCSS.

Fitur utama (p.48):
- **Pembuatan UI Berbasis AI** — terjemahkan bahasa alami ke kode React yang bisa dieksekusi.
- **Antarmuka Berbasis Obrolan** — real-time dengan prompt.
- **Technology Stack** — React, Tailwind CSS, komponen UI Shadcn.
- **Kemudahan Penggunaan** — untuk developer berpengalaman maupun pemula.
- **Code Generation** — kode React siap copy-paste atau titik awal; bisa export/salin langsung.
- **Fleksibilitas** — mendukung berbagai framework; dari landing page sederhana hingga e-commerce kompleks. Ideal untuk landing page dan dasbor.

6 Langkah (p.60–65):
1. **Akses v0.dev** — `https://v0.dev`. Tidak butuh akun, tapi login GitHub memudahkan menyimpan & export kode.
2. **Tuliskan Prompt yang Jelas** — contoh: "Landing page modern untuk agen perjalanan dengan bagian utama (hero section), fitur, dan testimoni.", "Layout dashboard dengan sidebar, navbar, dan tabel pengguna.", "Bagian harga dengan tiga card untuk paket Basic, Pro, dan Enterprise." Bisa tentukan TailwindCSS, mode gelap, struktur layout. Contoh: `https://v0.dev/chat/dTvCQLV1yD1`
3. **Periksa Kembali Tampilan UI** — v0.dev menghasilkan layout lengkap, kode React + TailwindCSS yang bisa diedit, visualisasi cepat per section.
4. **Kustomisasi Komponen** — klik element untuk edit konten langsung, modifikasi warna/spacing/icon lewat prompt atau kode, tombol "Edit Prompt" untuk variasi baru. Tip: tambahkan "dengan spacing yang compact".
5. **Mengekspor Kode** — Klik "Export" → pilih React, HTML, atau CodeSandbox. Dapat React functional component lengkap, style TailwindCSS, integrasi opsional Shadcn UI atau Radix UI.
6. **Gunakan pada Projek Anda** — paste ke Next.js/Vite/React, sesuaikan logika/route/data, tambahkan styling atau hubungkan API backend. Tip: banyak developer kombinasikan dengan Supabase, Firebase, atau GraphQL.

### Mengapa pakai AI untuk website (p.44–45)

| Manfaat | Penjelasan |
|---|---|
| Prototyping Cepat | Hasilkan tata letak UI dan ide desain lengkap dalam hitungan detik. |
| Mengurangi Waktu Pengembangan | Otomatisasi tugas berulang seperti kode dasar atau layout standar. |
| Aksesibilitas untuk Non-Coder | Bahkan tanpa skill coding mendalam, bisa hasilkan situs profesional lewat prompt bahasa alami. |
| Output Desain yang Konsisten | V0.dev menghasilkan kode terstruktur, siap produksi, TailwindCSS + best practice. |
| Iterasi yang Fleksibel | Eksperimen mudah dengan layout, gaya, dan bagian berbeda lewat prompt ulang. |
| Ramah Kolaborasi | Gemini Canvas — tim berkreasi bersama di ruang kerja bersama. |
| Siap untuk diintegrasi | Ekspor kode dan integrasikan ke development stack (React, Next.js, dll.). |

### Best Practice (p.68)
Tabel Lakukan/Jangan ada di `FAKTA-TERVERIFIKASI.md` §G.

Prinsip (p.68):
- Mulai dengan tujuan yang jelas
- Gunakan sketsa atau kerangka sebelum melakukan prompting
- Selalu periksa ulang dan edit kode yang dihasilkan oleh AI
- Anggap AI sebagai asisten, bukan pengganti Anda

---

## 6. Tools AI untuk Produktivitas (p.71–86)

### Masalah developer sehari-hari (p.72)
- Baca dokumentasi terlalu lama
- Nulis boilerplate berulang
- Debug tanpa petunjuk jelas
- Context switching (StackOverflow, Docs, Chat)

### Bagaimana AI membantu (p.72)
- Menulis kode lebih cepat
- Menjelaskan API secara real-time
- Mencari dokumen dan merangkum ide-ide utama
- Memberikan saran langsung saat Anda mengetik

### Gemini Code Assist (p.76)
Tool untuk menghasilkan kode dan asisten kode milik Google Gemini LLM. Memungkinkan
developer menghasilkan kode, memahami potongan kode, memperbaiki bug, dan membangun
komponen web dari perintah yang diberikan.

Fitur utama:
- Bekerja dengan input multi-modal (kode, teks, gambar, dokumen)
- Memahami prompt yang kompleks
- Dapat menghasilkan halaman HTML lengkap, REST API, maupun logika aplikasi

**Yang harus dilakukan:** Registrasi, install dan melakukan konfigurasi pada VSCode.
Referensi: `https://developers.google.com/gemini-code-assist/docs/set-up-gemini`

### GitHub Copilot (p.79)
Asisten pemrograman terintegrasi di IDE (VS Code, JetBrains, dll.). Menyarankan dan
melengkapi kode, fungsi, dan logika lengkap berdasarkan maksud dan pola pemrograman Anda.

Fitur utama:
- Pelengkapan otomatis kode secara real-time
- Berbasis konteks: beradaptasi dengan file dan proyek saat ini
- Mendukung puluhan bahasa: JavaScript, Python, Java, dll.

**Yang harus dilakukan (Alternatif / Opsional):** Registrasi GitHub, instalasi dan
konfigurasi pada VS Code. Referensi: `https://docs.github.com/en/copilot/quickstart`

### Google Antigravity (p.82)
Kode editor berbasis AI yang memungkinkan kolaborasi dengan agen cerdas untuk
menyelesaikan proyek perangkat lunak secara otomatis. Menggabungkan editor teks
dengan AI yang bisa merencanakan, menulis, hingga menguji kode secara mandiri.

Fitur utama:
- Bekerja dengan input multi-modal (kode, teks, gambar, dan dokumen)
- Mampu membuat halaman HTML, REST API, atau logika aplikasi
- Menjalankan dan menguji kode melalui browser dan terminal
- Menghasilkan **"Artifacts"** sebagai bukti rencana kerja dan hasil pengujian

**Yang harus dilakukan (Alternatif / Opsional):** Instalasi Google Antigravity dan
masuk menggunakan akun Google.
Referensi: `https://codelabs.developers.google.com/getting-started-google-antigravity`

---

## 7. NotebookLM (p.87–96)

Asisten penelitian dan penulisan berbasis AI dari Google. Berbeda dengan Gemini yang
mencari informasi luas dari internet, fokus NotebookLM adalah membantu **memahami,
menganalisis, dan menghasilkan konten berdasarkan sumber-sumber informasi yang Anda
sediakan sendiri**.

Cara kerja (p.88):
1. Upload dokumen Anda (PDF, Google Docs, etc.) yang ingin dijadikan sumber.
2. Tanyakan pertanyaan seperti: "Apa saja fitur utama yang ada di halaman home?" atau "Rangkumkan hasil dari Q2 2023."
3. NotebookLM hanya akan memberikan jawaban berdasarkan dokumen sumber yang kita berikan.

Contoh penggunaan: Analisa dokumen pendukung dalam development aplikasi.

Tabel fitur developer (p.91) → `FAKTA-TERVERIFIKASI.md` §G.

Hands-on menggunakan dummy PRD: `https://bit.ly/dummy-prd` (p.89).

Use case yang didemokan:
- **Membaca PRD (p.94)** — upload `PRD Hacktiv8 Tech.pdf`, tanya "Apa saja fitur yang diharapkan untuk ada di aplikasi yang akan dibuat". Source Grounding: NotebookLM hanya berdasarkan dokumen yang anda unggah.
- **Membuat Infographics (p.95–96)** — upload `Laporan Teknis Implementasi Sistem.pdf`, pilih Studio → Infographic (BETA), prompt "buat laporan teknis implementasi, fokus pada bagian statistik penggunaan". Opsi: language, orientation (Landscape/Portrait/Square), level of detail (Concise/Standard/Detailed).

---

## 8. Etika AI (p.97–99)

**Definisi (p.98):** Etika AI merujuk pada prinsip-prinsip moral dan panduan yang
mengatur bagaimana kecerdasan buatan harus dikembangkan, diterapkan, dan digunakan.
Membahas tanggung jawab pembuat dan pengguna AI untuk memastikan AI bersifat aman,
adil, dan bermanfaat bagi kemanusiaan.

> Pada intinya, Etika AI berupaya menjawab satu pertanyaan penting:
> "Hanya karena kita mampu membangun sistem AI yang kuat—apakah kita harus
> melakukannya? Dan jika ya, bagaimana kita memastikan bahwa sistem tersebut
> membantu, bukannya merugikan?"

5 prinsip utama (p.99) → tabel di `FAKTA-TERVERIFIKASI.md` §C.

---

## 9. Penutup Sesi 1

- Quiz 1: `https://bit.ly/quiz1-developers`, due hari itu 23.59 WIB (p.101).
- Teaser Sesi 2 (p.103): "Di Session 2, kita akan Bikin ChatGPT alias Chatbot versi kita sendiri!"
- Tabel Tools Installation diulang di p.104–105 → `TOOLS-DAN-LINK.md`.
