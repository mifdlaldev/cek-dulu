# MATERI-SESI-3.md — Pembuatan Chatbot berbasis Gemini AI Model

> Sumber: `Sesi 3 - Materi Developers.pdf` (58 halaman).
> **Kode verbatim lengkap ada di `SPEC-API.md` §3–4** — file ini fokus pada narasi & konteks.

---

## Agenda (p.5)

- Memahami dasar-dasar membangun chatbot
- Memahami cara mengintegrasikan model AI Gemini untuk mendukung respons chatbot
- Memahami jenis parameter dalam konfigurasi Gemini (temperature, top_p, top_k)
- Memahami cara konfigurasi parameter di Gemini
- Membangun chatbot sederhana menggunakan HTML, CSS, dan JavaScript

---

## 1. Persiapan Awal (p.7–10)

Checklist (p.8):
- Sudah terinstall Node.js v18+
- Akun Google Cloud dengan Gemini API
- Gemini API key
- Sudah terinstall VS Code
- **Starter Code Front End dengan Vanilla JS** — `https://bit.ly/startercode-developers`

Starter code (p.10):
> Download zip yang berisikan file html, css, and js. Debug starter-code ke browser seperti ini.

Tampilan starter code (screenshot p.10):
- Judul: **Gemini AI Chatbot**
- Area chat abu-abu
- Bubble user kanan (biru muda): `hi germini`
- Bubble bot kiri (hijau muda): `Gemini is thinking... (this is dummy response)`
- Input: placeholder `Type your message...` + tombol biru `Send`

---

## 2. Pratinjau Proyek (p.11–14)

### Definisi Chatbot (p.12)

> Chatbot adalah aplikasi yang dirancang untuk mensimulasikan percakapan dengan
> pengguna manusia.

Chatbot dapat bekerja berdasarkan:
- Aturan yang telah ditentukan (decision tree, pernyataan if sederhana)
- Machine learning atau large language model (seperti Gemini)

Chatbot banyak digunakan dalam:
- Layanan pelanggan (customer service)
- Asisten virtual
- Sistem rekomendasi
- Alat produktivitas pribadi (misalnya Copilot, ChatGPT, Google Bard)

### Persiapan Proyek (p.13)

> Dalam sesi ini, kita akan membangun chatbot berbasis web sederhana yang dapat:
> - Menerima input teks dari pengguna (melalui browser)
> - Mengirim pesan tersebut ke server (Node.js)
> - Meminta Gemini AI untuk menghasilkan respons yang relevan
> - Menampilkan pesan hasil generate AI kembali ke pengguna secara real-time
>
> Ini bukan chatbot statis (hardcoded) — chatbot ini akan menghasilkan balasan cerdas
> secara dinamis, didukung oleh model Google Gemini 2.5 Flash.

### Hasil yang Diharapkan (p.14)

Screenshot browser di `localhost:3000`:
- Tab: `Gemini AI Chatbot`
- Kartu chat di tengah, heading `Gemini AI Chatbot`
- Area chat kosong
- Input `Type your message...` + tombol `Send`
- Tooltip validasi browser: `Please fill out this field.` (input `required`)

Caption (verbatim):
> Chatbot ini mensimulasikan percakapan langsung — bukan dengan logika acak — tetapi
> dengan meminta Gemini untuk berpikir dan merespons secara alami. Ini adalah cara
> praktis yang bagus untuk mempelajari cara kerja API AI dalam aplikasi dunia nyata.

---

## 3. Integrasi Model AI Gemini (p.15–18)

### Pendahuluan (p.16)

> Dalam pengembangan web modern, integrasi AI ke dalam aplikasi menjadi semakin mudah
> berkat tools seperti Google Gemini API. Model Gemini AI mampu menghasilkan respons
> yang kaya konteks, natural, dan menyerupai percakapan manusia berdasarkan prompt dari
> pengguna. Ketika diterapkan pada sistem chatbot, model ini menggantikan logika
> berbasis aturan tradisional dengan respons cerdas secara real-time yang dapat
> beradaptasi dengan setiap input pengguna.

Tiga langkah utama integrasi:
1. Mengambil input dari pengguna di sisi frontend.
2. Mengirim input tersebut ke layanan backend.
3. Menggunakan model AI untuk menghasilkan respons dan mengembalikannya ke pengguna.

### Alur Kerja Chatbot (p.17 diagram, p.18 narasi)

Sequence diagram p.17 (verbatim label):

```
User            Frontend (Browser)      Backend (Node.js + Express)      Gemini AI Model
 |  Type a message  ->  |                        |                             |
 |                      |  POST /api/chat with message  ->                     |
 |                      |                        |  generateContent(message) -> |
 |                      |                        |  <- AI-generated response    |
 |                      |  <- JSON { reply: response }                          |
 |  <- Display chatbot reply                     |                             |
```

⚠️ Label diagram menulis `{ reply: response }`, tapi kode aktual p.29 mengembalikan
`{ result: ... }`. Ikuti kode.

Narasi p.18 (verbatim):
> Dalam proyek praktik ini, kita menerapkan alur tersebut menggunakan frontend Vanilla
> JavaScript dan backend Node.js + Express. Saat pengguna mengirim pesan melalui form
> chat, frontend akan mengirim request POST ke endpoint `/api/chat` di backend. Backend
> kemudian memanggil metode `generateContent()` dari Gemini SDK untuk meneruskan pesan
> pengguna ke model AI. Setelah Gemini menghasilkan respons, hasil tersebut dikirim
> kembali ke frontend dan ditampilkan di antarmuka chat.
>
> Arsitektur ini memungkinkan logika AI tetap berada di sisi backend—sehingga lebih
> aman dan scalable—sekaligus memberikan pengalaman percakapan yang mulus bagi pengguna.

---

## 4. Konfigurasi Gemini (p.20–22)

### Parameter (p.21, verbatim)

| Parameter | Purpose | Value range |
|---|---|---|
| `temperature` | Mengontrol keacakan dalam output. Nilai lebih tinggi = lebih kreatif. | 0.0 – 2.0 |
| `top_k` | Membatasi respons pada top-K token yang paling mungkin | 1 – 40 |
| `top_p` | Menggunakan nucleus sampling untuk membatasi tingkat keacakan | 0.0 – 1.0 |

> **Mengapa ini penting?**
> Bayangkan kamu sedang membangun sebuah API yang membutuhkan berbagai "kepribadian":
> - Untuk penulisan kreatif, kamu mungkin ingin menggunakan `temperature: 0.9` agar hasilnya lebih variatif dan imajinatif.
> - Untuk tanya jawab faktual, nilai yang lebih rendah seperti `0.2` membantu memastikan jawaban lebih akurat dan presisi.

### System Instruction (p.22, verbatim)

> System Instruction (sering juga disebut System Prompt atau System Message) adalah
> instruksi level tinggi yang diberikan kepada model AI untuk menetapkan konteks,
> perilaku, dan batasan sebelum model tersebut mulai berinteraksi dengan pengguna.
>
> System Instruction tidak terlihat oleh pengguna akhir (user), tetapi sangat
> mempengaruhi bagaimana AI menjawab. Fungsinya meliputi:
>
> - **Menetapkan Persona:** Memberi tahu AI "siapa" dirinya.
>   - Contoh: "Kamu adalah asisten pemrograman Python senior yang teliti."
> - **Mengatur Nada Bicara (Tone):** Menentukan gaya bahasa.
>   - Contoh: "Jawablah dengan gaya yang santai, humoris, dan menggunakan emoji." atau "Jawablah dengan formal dan akademis."
> - **Memberikan Batasan (Constraints):** Memberi tahu apa yang tidak boleh dilakukan.
>   - Contoh: "Jangan pernah memberikan nasihat medis," atau "Jawab hanya dalam Bahasa Indonesia."
> - **Mengatur Format Output:** Menentukan bentuk jawaban yang diinginkan.
>   - Contoh: "Selalu berikan jawaban dalam format JSON," atau "Sertakan tabel dalam setiap perbandingan."

---

## 5. Step#1 — Membangun API (p.24–31)

Setup, `package.json`, struktur file, `index.js`, dan endpoint `/api/chat`
→ `SPEC-API.md` §3.1–3.7.

Ringkasan `index.js` (p.28, verbatim):
- Memuat environment variables menggunakan dotenv, termasuk Gemini API key.
- Mengimpor modul penting: Express untuk membangun REST API, CORS untuk mengizinkan request lintas origin, dan Gemini AI SDK untuk mengakses generative AI dari Google.
- Menginisialisasi aplikasi Express dan client Gemini AI menggunakan API key.
- Mendefinisikan variabel global untuk model Gemini default agar mudah diganti di satu tempat.
- Menerapkan middleware untuk menangani CORS dan parsing request JSON.
- Menjalankan server pada port yang ditentukan (default: 3000), siap melayani endpoint berbasis Gemini.

Ringkasan endpoint `/api/chat` (p.29, verbatim):
> Endpoint ini memungkinkan percakapan multi-turn dengan Gemini AI
> - Menerima request POST ke endpoint `/api/chat` dengan array messages di body request yang merepresentasikan riwayat percakapan (role dan pesan).
> - Memvalidasi bahwa input berupa array; jika tidak, server akan mengembalikan error.
> - Mengubah setiap pesan ke format yang kompatibel dengan Gemini (`role` dan `parts`).
> - Mengkonfigurasi jawaban Gemini dengan `temperature` dan `systemInstruction`
> - Mengirim pesan yang telah diformat ke model Gemini menggunakan `generateContent()` dengan model yang ditentukan pada `GEMINI_MODEL`.
> - Mengembalikan respons AI melalui properti `response.text`.
> - Menangani error dengan mengembalikan status 500 dan pesan error jika proses gagal.

⚠️ Narasi bilang "array messages" tapi kode baca `conversation`. Lihat `AGENTS.md` §3.2.

Run (p.30):

```
$ node index.js
Gemini Chatbot running on http://localhost:3000
```

Uji Postman (p.31):
- Method POST, URL `http://localhost:3000/api/chat`, Body → raw → JSON
- Body: `{"conversation": [{ "role": "user", "text": "Apa itu GEMINI API?"}]}`
- Response 200 OK: `{"result": "GEMINI API adalah **Antarmuka Pemrograman Aplikasi (Application Programming Interface)** ..."}`

---

## 6. Step#2 — Menghubungkan API dengan Front End (p.33–46)

### Struktur folder `public/` (p.34, verbatim)

> Dalam struktur ini, folder `public` berfungsi sebagai entry point frontend untuk
> project `gemini-chatbot-api`. Folder ini berisi:
> - `index.html` – File HTML utama yang dirender di browser.
> - `script.js` – Menangani logika frontend, seperti mengirim input pengguna ke Gemini API melalui HTTP request.
> - `style.css` – Mengatur tampilan UI untuk antarmuka chatbot.
>
> Dengan menempatkan kode Vanilla JavaScript di dalam folder `public`:
> - Aset statis (HTML, JS, CSS) terpisah dari logika backend.
> - ExpressJS dapat menyajikan aset-aset tersebut menggunakan middleware seperti `express.static`.
>
> Struktur ini memungkinkan kamu untuk:
> - Menjalankan backend Gemini API menggunakan Node.js / Express.
> - Mengakses frontend chatbot melalui `http://localhost:3000/` setelah server dijalankan.

### Gemini Code Assist (p.35–42)

Tujuan (p.35, verbatim):
> Dalam sesi ini, kita akan mengintegrasikan Gemini Code Assist ke dalam frontend
> menggunakan Vanilla JavaScript (plain JS). Tujuannya adalah menghubungkan file
> `script.js` di folder `public/` dengan endpoint API backend `/api/chat` untuk
> menciptakan pengalaman chatbot yang interaktif.

Langkah (p.36):
- Buka panel chat Gemini Code Assist di project kamu.
- Pada kolom input, salin dan tempel prompt berikut, lalu tekan Enter.

Prompt lengkap (p.37) dan hasil kode (p.39, p.42) → `SPEC-API.md` §4.5, §4.3.

Starter code `script.js` yang jadi konteks follow-up (p.40) → `SPEC-API.md` §4.2.

Apa yang dipelajari dari Gemini (p.42, verbatim):
> Gemini menjelaskan bahwa setelah mengirim request ke backend `/api/chat`, sebaiknya
> frontend terlebih dahulu menampilkan pesan sementara seperti "Gemini is thinking…".
> Pesan ini nantinya akan diperbarui dengan respons AI yang sebenarnya.
>
> Setelah respons diterima, Gemini menyarankan untuk mengecek apakah data yang
> dikembalikan memiliki property `result`.
> - Jika ada, nilai dari `result` (jawaban AI) ditampilkan sebagai balasan chatbot.
> - Jika tidak ada, tampilkan pesan cadangan seperti "Sorry, no response received.".
>
> Pendekatan ini membuat penanganan respons API lebih robust, serta memastikan
> antarmuka pengguna selalu memberikan feedback yang jelas, baik saat AI berhasil
> memberikan jawaban maupun saat terjadi error atau respons kosong.

### Menghubungkan `index.js` (p.43)

> Sebelum melakukan testing atau menjalankan kode chatbot frontend yang diberikan oleh
> Gemini, pastikan `index.js` (backend) kamu sudah mengaktifkan CORS dan menyiapkan
> file statis frontend (HTML, JS, CSS).
>
> Hal ini penting agar frontend dapat berkomunikasi dengan backend API dan dimuat di
> browser tanpa masalah CORS.

Kode verbatim → `SPEC-API.md` §3.5.
⚠️ Slide p.43 menulis `process.env.API_KEY`. Repo pakai `GEMINI_API_KEY`. Lihat `AGENTS.md` §3.1.

### Pengujian (p.44–45)

Run (p.44):

```
$ node index.js
Gemini Chatbot running on http://localhost:3000
```

Frontend (p.45): buka `localhost:3000` → kartu `Gemini AI Chatbot` muncul.

Caption (verbatim):
> Chatbot ini mensimulasikan percakapan secara real-time bukan dengan logika acak,
> melainkan dengan meminta Gemini untuk bernalar dan merespons secara natural. Ini
> merupakan cara praktik yang sangat baik untuk memahami bagaimana AI API bekerja dalam
> aplikasi dunia nyata.

### Tips Menggunakan Gemini Secara Efektif (p.46, verbatim)

- Jaga prompt tetap singkat, tetapi tetap berikan konteks yang cukup.
- Jelaskan dengan jelas di mana kode akan ditempatkan (misalnya di dalam event listener).
- Gunakan prompt lanjutan seperti "Dapatkah anda mengoptimisasi kode ini?" atau "Tolong wrap kode ini ke dalam satu function." untuk penyempurnaan kode.

---

## 7. Pengumpulan Proyek (p.48–52)

Brief final project (p.49) → `FINAL-PROJECT.md` §1.
`.gitignore` (p.50) dan perintah git (p.51) → `SPEC-API.md` §6–7.

Setelah push ke GitHub (p.51, verbatim):
1. Salin (copy) URL repository GitHub (misalnya: `https://github.com/yourusername/gemini-ai-api-project`)
2. Tempelkan (paste) URL ke form pengumpulan projek yang ada di akhir sesi

Form: `https://bit.ly/finalproject-developers` — Due: H+2 Sesi 3 | 23.59 WIB (p.52).

---

## 8. Kesimpulan Sesi 3 (p.54)

Verbatim:
> Dalam sesi ini, kita mempelajari cara membangun chatbot berbasis AI yang sederhana
> namun powerful menggunakan Vanilla JavaScript di sisi frontend dan Node.js dengan
> Express di sisi backend. Dengan mengintegrasikan Google Gemini AI, chatbot mampu
> menghasilkan respons cerdas secara real-time, melampaui chatbot tradisional yang
> berbasis aturan statis.
>
> Proyek hands-on ini memperkenalkan peserta pada dasar-dasar arsitektur chatbot,
> komunikasi full-stack melalui API, serta cara meningkatkan aplikasi dengan model AI
> modern. Melalui proses pengembangan bertahap—mulai dari desain UI hingga integrasi
> backend—peserta merasakan langsung alur kerja nyata dalam membangun aplikasi web
> interaktif.

Poin Penting (Key Takeaways):
- Chatbot mensimulasikan percakapan antara pengguna dan mesin.
- Gemini AI memungkinkan respons yang natural dan dinamis melalui API.
- `fetch()` menghubungkan frontend dan backend secara asynchronous.
- Route Express menangani pesan pengguna dan meneruskannya ke Gemini.
- Proyek ini menjembatani UI, logika backend, dan integrasi AI dalam satu alur kerja terpadu.

---

## 9. Penutup

- Quiz 3: `https://bit.ly/quiz3-developers`, due hari itu 23.59 WIB (p.56).
- Post-Test (p.57): isi Post-Survey `https://bit.ly/mba2-postsurvey` → screenshot bukti → submit ke `https://bit.ly/posttest-developers` → lanjutkan Post-Test sampai selesai.
  - Country: Indonesia
  - Local Training Partner (LTP): PT. Hacktivate Teknologi Indonesia (Hacktiv8)
