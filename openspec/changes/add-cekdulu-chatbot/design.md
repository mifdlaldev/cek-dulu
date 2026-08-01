# Design — add-cekdulu-chatbot

Keputusan teknis, alternatif yang ditolak, dan matriks keterlacakan.

> Fungsi file ini: mencegah agent lain (atau saya sendiri di sesi berikutnya) "memperbaiki"
> keputusan yang sudah diambil sengaja. Setiap keputusan punya alasan tertulis.

---

## 1. Arsitektur

```
┌──────────────┐   POST /api/chat            ┌──────────────────┐
│   Browser    │   { conversation:[          │  Express (Node)  │
│              │     {role,text}, ... ] }    │                  │
│ index.html   │ ──────────────────────────► │  index.js        │
│ script.js    │                             │                  │
│ style.css    │ ◄────────────────────────── │  - cors()        │
│              │   { result: "..." }         │  - json()        │
│ riwayat[]    │   atau { error: "..." }     │  - static public │
│ (memori)     │                             │  - /api/chat     │
└──────────────┘                             └────────┬─────────┘
       ▲                                              │
       │ GET / (static)                               │ generateContent({
       └──────────────────────────────────────────────┤   model, contents,
                                                      │   config })
                                                      ▼
                                            ┌──────────────────┐
                                            │  Gemini API      │
                                            │ gemini-2.5-flash │
                                            └──────────────────┘
```

Satu proses Node melayani dua hal: aset statis dan satu endpoint API. Tidak ada proses
terpisah, tidak ada build step, tidak ada penyimpanan.

Alasan API key hanya di backend: S3 p.18 menyatakan arsitektur ini menjaga "logika AI tetap
berada di sisi backend—sehingga lebih aman dan scalable". Kalau frontend memanggil Gemini
langsung, key akan terekspos di browser.

---

## 2. Keputusan teknis

### D-01 — Satu berkas `index.js`, tidak dipecah ke modul

**Keputusan:** seluruh backend dalam satu `index.js`.

**Alasan:** struktur file S3 p.27 dan p.34 menunjukkan satu `index.js` di root. S2 p.34
menyebutnya "pengendali utama (central controller)". Total kode backend diperkirakan
<100 baris. Memecah ke `routes/`, `controllers/`, `services/` menambah struktur yang tidak
ada di materi tanpa manfaat pada skala ini.

**Ditolak:** layered architecture. Menyimpang dari struktur materi dan membuat reviewer
sulit mencocokkan kode dengan slide.

---

### D-02 — `GEMINI_API_KEY`, bukan `API_KEY`

**Keputusan:** nama env var `GEMINI_API_KEY`.

**Alasan:** tiga sumber mendukung — S2 p.32 (contoh isi `.env`), S3 p.27 (contoh isi `.env`),
S3 p.28 (kode `process.env.GEMINI_API_KEY`). Hanya satu sumber menyimpang: S3 p.43 menulis
`process.env.API_KEY`. Mayoritas dan konsistensi dengan dokumentasi resmi Gemini (yang juga
memakai `GEMINI_API_KEY`, terlihat di screenshot S2 p.20) menang.

**Ditolak:** `API_KEY`. Ditolak juga membaca keduanya dengan fallback — menambah cabang
logika untuk masalah yang tidak nyata.

---

### D-03 — `conversation` + `{ role, text }`, dan `script.js` slide diperbaiki

**Keputusan:** kontrak API memakai `conversation` dengan item `{ role, text }`. Kode
`script.js` dari slide **diperbaiki**, bukan disalin apa adanya.

**Alasan:** backend S3 p.29 secara harfiah menulis `const { conversation } = req.body` dan
`conversation.map(({ role, text }) => ...)`. Screenshot Postman S3 p.31 juga memakai
`"conversation"`. Sementara `script.js` hasil Gemini Code Assist (S3 p.39, p.42) mengirim
`{ messages: [{ role, content }] }` — tidak cocok. Kalau disalin apa adanya, `conversation`
akan `undefined`, validasi `Array.isArray` gagal, dan **setiap** request berakhir 500.

**Ini bug nyata di materi, bukan interpretasi.** Bisa dibuktikan dengan membaca dua slide
bersamaan.

**Ditolak:** mengubah backend agar menerima `messages`. Alasan: backend adalah kode
kanonik yang dikonfirmasi tiga slide (p.29 kode, p.31 Postman, p.37 spesifikasi prompt);
`script.js` hanya satu slide dan berasal dari output AI yang tidak diverifikasi penulis materi.

**Ditolak juga:** menerima kedua field sekaligus. Menambah kompleksitas untuk mengakomodasi
kesalahan.

---

### D-04 — `temperature: 0.3`

**Keputusan:** `temperature` 0.3, `topP` 0.8, `topK` 30.

**Alasan:** S3 p.21 memberi panduan eksplisit — "Untuk tanya jawab faktual, nilai yang lebih
rendah seperti 0.2 membantu memastikan jawaban lebih akurat dan presisi." Domain Cek Dulu
adalah edukasi faktual, jadi nilai rendah tepat. Dipilih 0.3 bukan 0.2 karena bot juga perlu
merespons empatik pada pengguna yang jadi korban; 0.2 cenderung menghasilkan kalimat terlalu
kaku. `topP` dan `topK` di bawah default untuk mempersempit ruang sampling — makin sempit,
makin kecil peluang model mengarang.

Semua nilai di dalam rentang sah S3 p.21.

**Ditolak:** `temperature: 0.9` (nilai yang dipakai contoh slide S3 p.29). Alasan: 0.9 di
S3 p.21 direkomendasikan untuk *penulisan kreatif*, bukan tanya jawab faktual. Domain
keuangan menuntut presisi. Menyimpang dari contoh slide di sini justru **membuktikan
pemahaman** materi — brief S3 p.49 memang meminta "konfigurasi parameter yang sesuai dengan
kreativitas masing-masing", dan justifikasinya berasal dari slide yang sama.

---

### D-05 — Guardrail di `systemInstruction`, bukan filter kode

**Keputusan:** semua larangan ditegakkan lewat `systemInstruction`, tidak ada filter
regex/keyword di backend.

**Alasan:** materi mengajarkan System Instruction sebagai mekanisme kontrol perilaku model
(S3 p.22, fungsi Constraints). Filter kata kunci di backend akan rapuh — daftar nama entitas
tidak mungkin lengkap, dan filter bisa memblokir jawaban yang benar (misalnya bot menolak
menilai sebuah nama, tapi filter memblokir karena nama itu muncul di teks).

**Ditolak:** blocklist nama entitas di backend. Tidak mungkin lengkap, rawan false positive,
dan tidak diajarkan materi.

**Diakui sebagai batas:** pendekatan prompt-based bersifat probabilistik. Mitigasinya dua
lapis — uji manual UJI-03 sebagai gate mutlak, dan disclaimer permanen di UI (`UI-08`).

---

### D-06 — Riwayat di memori browser, dikirim utuh setiap request

**Keputusan:** array riwayat disimpan di variabel JavaScript, dikirim penuh pada setiap
request.

**Alasan:** S3 p.29 menyatakan endpoint "memungkinkan percakapan multi-turn", dan S3 p.37
menampilkan contoh body dengan tiga item bergantian `user`/`model`/`user`. Model Gemini
stateless — konteks harus dikirim ulang setiap kali. Karena tidak ada database (non-goal),
browser adalah satu-satunya tempat riwayat.

**Ditolak:** `localStorage`. Tidak ada di materi, dan menyimpan percakapan bertema keuangan
di perangkat menambah risiko privasi tanpa diminta.

**Ditolak:** session di server. Butuh state atau dependency, keduanya non-goal.

**Konsekuensi diterima:** riwayat hilang saat reload. Untuk chatbot edukasi sekali-pakai,
ini wajar.

---

### D-07 — Respons dirender sebagai teks biasa via `textContent`

**Keputusan:** memakai `textContent`, bukan `innerHTML`. Tidak ada rendering Markdown.

**Alasan:** dua manfaat sekaligus. Pertama, `textContent` otomatis mencegah XSS — respons
model tidak dieksekusi sebagai HTML. Kedua, rendering Markdown butuh dependency
(`marked` + `DOMPurify`), dan itu keluar dari batasan dependency materi.

**Ditolak:** `innerHTML` + Markdown parser. Risiko keamanan + dependency baru.

**Konsekuensi diterima:** tanda `**bold**` dari model akan tampil sebagai karakter mentah.
Mitigasi: `systemInstruction` mengarahkan bot menjaga jawaban ringkas dan memakai poin-poin
sederhana; CSS memakai `white-space: pre-wrap` agar baris baru tetap terlihat rapi.

---

### D-08 — Kanal resmi statis di HTML

**Keputusan:** nomor 157, WA 081 157 157 157, dan dua alamat email ditulis langsung di HTML.

**Alasan:** data presisi tinggi. LLM rawan mengarang atau mengubah satu digit nomor telepon.
Bila bot salah menyebut nomor, pengguna bisa menghubungi pihak yang salah — justru bahaya
pada aplikasi yang tujuannya melindungi. Menempatkannya di HTML membuat data itu **tidak
pernah** lewat model.

Sumber: siaran pers Satgas PASTI, dicatat verbatim di `docs/RISET-LAPANGAN.md` §7.

**Ditolak:** menaruh nomor di `systemInstruction`. Meski akurat saat ditulis, bot bisa
memodifikasinya saat menghasilkan teks, dan angka bisa berubah tanpa kita tahu.

---

### D-09 — Statistik riset tidak masuk prompt

**Keputusan:** angka SNLIK/IASC/Satgas PASTI hanya dipakai di dokumentasi dan jawaban form.
Tidak masuk `systemInstruction`.

**Alasan:** semua angka itu snapshot per tanggal siaran pers. IASC naik dari 135 ribu laporan
(Mei 2025) ke 343 ribu (Nov 2025) dalam ±6 bulan. Angka yang ditanam hari ini akan salah
beberapa bulan lagi, dan bot akan menyampaikannya dengan yakin — definisi halusinasi.

**Ditolak:** menanam statistik untuk membuat jawaban bot terkesan berbobot. Kesan berbobot
tidak sebanding dengan risiko menyebarkan angka kedaluwarsa.

**Sebagai gantinya:** bot mengajarkan pola dan prosedur, yang jauh lebih tahan waktu.

---

### D-10 — Verifikasi manual terdokumentasi, tanpa test framework

**Keputusan:** 13 skenario uji ditulis dengan ID, input, dan ekspektasi. Dijalankan manual.
Tidak ada Jest/Vitest/Supertest.

**Alasan:** materi tidak membahas test framework, dan `package.json` di slide (S2 p.31,
S3 p.26) justru berisi placeholder `"test": "echo \"Error: no test specified\" && exit 1"`.
Menambah test framework = dependency di luar materi.

Lebih penting: guardrail persona (`PG-03`) **tidak bisa** diuji unit test yang deterministik
— outputnya probabilistik dan bervariasi kata. Yang bisa dinilai adalah apakah bot menolak
memberi penilaian legalitas, dan itu perlu penilaian manusia atas isi jawaban.

**Ditolak:** menambah Vitest. Melanggar batasan dependency, dan tidak memecahkan masalah
utama (menguji perilaku LLM).

**Kompensasi:** skenario uji ditulis lengkap dengan ID di `docs/USE-CASE-CEKDULU.md` §5,
sehingga verifikasi manual tetap dapat diulang dan diaudit — bukan "coba-coba".

---

### D-11 — `.env.example` disertakan

**Keputusan:** menyediakan `.env.example` berisi `GEMINI_API_KEY=` tanpa nilai.

**Alasan:** `.env` tidak ter-commit, jadi orang lain yang meng-clone repo tidak tahu variabel
apa yang dibutuhkan. `.env.example` menyelesaikan itu tanpa membocorkan apa pun. Praktik ini
tidak dilarang materi dan tidak menambah dependency.

**Catatan:** materi tidak menyebut `.env.example`. Ini tambahan sadar, dicatat di sini agar
jelas bahwa itu keputusan, bukan halusinasi.

---

### D-12 — Arah visual restrained, menolak "aesthetic risk"

**Keputusan:** arah desain **restrained, kontras tinggi, tipografi tenang**. Menolak arah
brutalist, maximalist, retro-futuristic, dan eksperimen tipografi berat.

**Alasan:** panduan desain frontend modern umumnya mendorong pengambilan risiko estetis agar
antarmuka tidak terasa generik. Nasihat itu ditulis untuk portfolio, landing page, dan
produk yang bersaing memperebutkan perhatian — konteks di mana "tidak terlupakan" adalah
tujuan yang benar.

Konteks Cek Dulu berbeda secara mendasar. Penggunanya **sedang cemas**: baru menerima pesan
yang mungkin penipuan, atau sudah kehilangan uang. Bagi audiens ini, kualitas antarmuka
diukur dari **keterbacaan, ketenangan, dan kredibilitas** — bukan dari keunikan visual.
Antarmuka eksperimental pada alat kewaspadaan finansial terasa seperti mainan, dan itu
menurunkan kepercayaan tepat pada momen kepercayaan paling dibutuhkan.

Ada juga alasan struktural: seluruh nilai proyek ini bertumpu pada bot **menahan diri** —
tidak menilai legalitas, tidak mengarang angka, tidak memberi nasihat di luar kompetensi
(`PG-03` s.d. `PG-06`). Antarmuka yang berteriak bertentangan dengan pesan itu. Bentuk
mengikuti sikap.

**Yang membedakan ini dari desain malas:** presisi. Skala tipografi konsisten, spacing
berirama dari satu satuan dasar, state lengkap (hover, focus, disabled, loading, error),
kontras lulus WCAG AA, token terpusat. "Minimal yang digarap serius" dan "minimal karena
tidak digarap" terlihat berbeda pada detail-detail itu — dan detail itulah yang menjadi
requirement `UI-10`, `UI-11`, `UI-12`.

**Ditolak:** mengambil satu risiko estetis demi menghindari kesan generik. Pada domain ini,
risiko tersebut merugikan pengguna.

---

### D-13 — Aksesibilitas sebagai requirement, bukan tambahan

**Keputusan:** aksesibilitas ditetapkan sebagai requirement `UI-11` dengan lima skenario
uji, setara requirement fungsional lainnya.

**Alasan:** materi pelatihan **tidak membahas aksesibilitas web**. Saya nyatakan itu terbuka
agar tidak ada kesan requirement ini dikutip dari materi.

Dasar pembenarannya dua lapis.

*Lapis pertama — prinsip yang ada di materi.* S1 p.99 mencantumkan **Keadilan**: "AI harus
memperlakukan semua pengguna secara adil—tanpa memandang gender, ras, atau latar belakang."
Prinsip itu ditulis untuk perilaku model, tetapi tidak ada alasan prinsipiil untuk berhenti
di model dan mengabaikan pintu masuknya. Model yang adil di belakang antarmuka yang tidak
terjangkau tetap menghasilkan layanan yang tidak adil.

*Lapis kedua — konsistensi dengan use case sendiri.* Target pengguna Cek Dulu mencakup orang
lanjut usia dan berliterasi rendah — kelompok yang justru paling sering menjadi sasaran
penawaran ilegal. Kelompok yang sama lebih mungkin memakai pembesaran teks, mengandalkan
kontras tinggi, atau menggunakan screen reader. Membangun alat perlindungan yang tidak
terjangkau oleh kelompok yang paling perlu dilindungi adalah kegagalan pada premisnya
sendiri, bukan kekurangan kosmetik.

**Ditolak:** memperlakukan aksesibilitas sebagai polish opsional di akhir pekerjaan. Yang
ditunda sampai akhir hampir selalu tidak dikerjakan, dan menambal ARIA di atas markup yang
sudah jadi menghasilkan hasil lebih buruk daripada merancangnya sejak awal.

**Cakupan yang diambil:** WCAG 2.1 level AA untuk hal-hal yang dapat diverifikasi manual —
kontras, urutan fokus, label, pengumuman live region, dukungan pembesaran,
`prefers-reduced-motion`. Audit menyeluruh dengan alat otomatis di luar cakupan karena
memerlukan dependency.

---

### D-14 — Struktur backend tetap satu berkas; CI ringan tanpa dependency

**Keputusan:** menolak layered architecture untuk backend (lihat juga D-01). Menambahkan CI
GitHub Actions yang **tidak menginstal dependency apa pun**.

**Alasan menolak layering:** ini poin yang mudah salah dinilai. Menambah
`routes/` → `controllers/` → `services/` → `repositories/` pada backend satu endpoint
sepanjang ±60 baris menghasilkan enam berkas dengan indirection yang tidak menambah
kejelasan. Pola enterprise yang ditempel ke masalah yang tidak membutuhkannya adalah tanda
pengalaman yang kurang, bukan lebih. Materi menyebut `index.js` sebagai "central controller"
(S2 p.34), dan pada skala ini itu keputusan yang tepat.

Kematangan rekayasa pada proyek ini terletak pada **keterlacakan dan verifikasi** —
requirement bersumber, keputusan berargumen, gate berbukti — bukan pada jumlah folder.

**Isi CI yang dipilih:**

| Job | Alat | Kenapa aman |
|---|---|---|
| Validasi sintaks `index.js` | `node --check` | Bawaan Node, tanpa install |
| Validasi sintaks `public/script.js` | `node --check` | Sama |
| Pastikan `.env` tidak ter-track | `git ls-files` | Bawaan git |
| Pastikan hanya 4 dependency | `node` membaca `package.json` | Tanpa install |
| Pastikan tidak ada `innerHTML` di frontend | `grep` | Menegakkan D-07 secara otomatis |
| Pastikan `systemInstruction` bebas data presisi | `grep` pola nomor telepon/email/URL | Menegakkan `PG-09` secara otomatis |

Dua job terakhir yang membuat CI ini bermanfaat, bukan sekadar hiasan: keduanya menjaga
keputusan desain agar tidak diam-diam dilanggar pada perubahan berikutnya.

**Ditolak:** `npm ci` + ESLint + Prettier + Vitest. Ketiganya dependency baru di luar
batasan materi, dan CI yang menginstal `node_modules` untuk memeriksa berkas sepanjang 60
baris tidak sebanding.

**Ditolak:** matriks Node multi-versi. Materi menetapkan v18+ satu baseline; matriks di sini
hanya menambah waktu jalan tanpa informasi baru.

**Catatan:** materi tidak menyebut CI. Ini tambahan sadar, sama seperti D-11.

---

### D-15 — Model dibaca dari environment, bawaan `gemini-flash-latest`

**Keputusan:** `const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-flash-latest';`

**Alasan:** materi menetapkan literal `"gemini-2.5-flash"` (S2 p.34, S3 p.28). Saat uji
positif Fase C dijalankan pada 1 Agustus 2026, model itu mengembalikan HTTP 404:

> This model models/gemini-2.5-flash is no longer available to new users. Please update your
> code to use a newer model for the latest features and improvements.

Ini bukan kesalahan implementasi. Nama model dipanggil dengan benar; Google menutup akses
model tersebut untuk akun yang baru dibuat, dan materi disusun sebelum penutupan berlaku.

Hasil uji pemanggilan nyata pada kandidat pengganti tercatat di `docs/KENDALA-API.md` §1.
Ringkasnya: `gemini-2.5-flash` dan `gemini-2.5-flash-lite` mengembalikan 404;
`gemini-2.0-flash` dan `gemini-2.5-pro` mengembalikan 429 karena kuota;
`gemini-flash-latest` berhasil. Alias tersebut resmi dari Google
(`displayName: "Gemini Flash Latest"`, `description: "Latest release of Gemini Flash"`) dan
selalu menunjuk rilis Flash terbaru — kelas model yang sama dengan yang dimaksud Sesi 2 p.15
ketika memilih Flash karena hemat biaya dan cepat.

**Mengapa environment variable, bukan sekadar mengganti satu string:**

1. Materi tetap dapat diikuti. Pemilik akun lama yang masih memiliki akses
   `gemini-2.5-flash` cukup menulis satu baris di `.env` tanpa menyentuh kode.
2. Tahan terhadap penutupan berikutnya. Google terbukti dapat menutup model kapan saja;
   penggantian tidak lagi memerlukan perubahan kode.
3. Konsisten dengan maksud materi. S3 p.28 menyebut nama model disimpan dalam satu konstanta
   "agar mudah diganti di satu tempat". Membacanya dari environment memenuhi maksud itu
   lebih baik, bukan menyimpang darinya.

**Ditolak:** mengganti literal menjadi `"gemini-flash-latest"` tanpa jalur override. Itu
memutus kemampuan mengikuti materi apa adanya bagi yang akunnya masih mendukung.

**Ditolak:** mempertahankan `"gemini-2.5-flash"` dan menunggu. Model mengembalikan 404,
bukan 429 — artinya penutupan bersifat permanen bagi akun baru, bukan sekadar kuota habis.

**Ditolak:** mencoba beberapa model berurutan dengan fallback otomatis di dalam kode. Setiap
percobaan memakan kuota, dan kuota Free tier hanya 20 permintaan per hari (lihat D-16).
Fallback justru mempercepat habisnya kuota.

`WS-02` diamandemen mengikuti keputusan ini.

---

### D-16 — Strategi pengujian sadar kuota, tanpa retry otomatis

**Keputusan:** rencana pengujian disusun berdasarkan konsumsi kuota, dengan `UJI-03`
mendapat prioritas pertama. Tidak menambahkan retry otomatis, cache, maupun rate limiting
di sisi aplikasi.

**Alasan:** dasbor Google AI Studio menunjukkan batas Free tier untuk model Text-out:
**5 RPM, 250K TPM, dan 20 RPD**. Batas paling mengikat adalah **RPD — hanya 20 permintaan
per hari**. Angka TPM terlihat besar tetapi tidak relevan; RPD tercapai lebih dahulu.

Konsekuensinya, kuota harus dibelanjakan dengan sengaja. Tiga aturan yang diambil:

*Pertama, dahulukan uji yang tidak memakai kuota.* Sebagian besar verifikasi tidak menyentuh
API sama sekali — validasi input kosong ditolak browser, body tanpa `conversation` ditolak
`Array.isArray()` sebelum model dipanggil, uji server mati tidak mengirim permintaan, dan
seluruh pemeriksaan aksesibilitas serta tampilan bersifat inspeksi. Daftar lengkapnya di
`docs/KENDALA-API.md` §2.

*Kedua, `UJI-03` diuji lebih dahulu.* Requirement `PG-03` adalah gate mutlak: bila bot
menyatakan sebuah entitas legal atau ilegal, implementasi dinyatakan gagal dan prompt wajib
diperkuat. Menguji ini terakhir berisiko kehabisan kuota tepat saat pengulangan dibutuhkan.

*Ketiga, jangan mengulang permintaan untuk hal yang sudah terjawab.* Hasil dicatat sekali di
`docs/QA-REPORT.md`, lalu lanjut.

**Ditolak: retry otomatis dengan exponential backoff.** Menambah kompleksitas, dan justru
**memperbanyak** permintaan tepat saat kuota kritis. Kegagalan sudah ditangani `API-06` di
backend dan ditampilkan jelas oleh `UI-06` di antarmuka — pengguna mendapat umpan balik yang
benar tanpa mekanisme tambahan.

**Ditolak: cache respons.** Memerlukan penyimpanan, dan itu non-goal proyek. Selain itu
percakapan bersifat kontekstual sehingga tingkat kena cache akan sangat rendah.

**Ditolak: rate limiting di sisi aplikasi.** Non-goal, tidak dibahas materi, dan batas
sebenarnya sudah ditegakkan Google. Menambahkannya hanya menduplikasi penegakan yang ada.

**Konsekuensi yang diterima:** verifikasi Gate 4 berjalan lebih lambat dan mungkin terbagi
ke dua hari bila kuota habis. Itu pertukaran yang wajar; alternatifnya adalah memaksa
permintaan dan memperpanjang blokir.

---

## 3. Matriks keterlacakan requirement → sumber

| Req | Isi singkat | Sumber |
|---|---|---|
| `WS-01` | Muat `.env`, var `GEMINI_API_KEY` | S3 p.28; S2 p.32; S3 p.27 |
| `WS-02` | Client `GoogleGenAI` + `GEMINI_MODEL` dari env, bawaan `gemini-flash-latest` | S3 p.28, diamandemen D-15 ⚠️ model materi ditutup Google |
| `WS-03` | `cors()` + `express.json()` | S3 p.28, p.43 |
| `WS-04` | `express.static` + `__dirname` ESM | S3 p.34, p.43 |
| `WS-05` | Listen port 3000 + log | S3 p.28, p.30, p.44 |
| `API-01` | Field `conversation`, item `{role,text}` | S3 p.29, p.31 |
| `API-02` | Validasi array, pesan `Messages must be an array!` | S3 p.29 |
| `API-03` | Map ke `{ role, parts:[{text}] }` | S3 p.29 |
| `API-04` | `generateContent()` + `response.text` | S3 p.29 |
| `API-05` | `200 { result }` | S3 p.29 |
| `API-06` | `500 { error }` | S3 p.29 |
| `PG-01` | Config lewat properti `config` | S3 p.29 |
| `PG-02` | `temperature` 0.3, `topP` 0.8, `topK` 30 | S3 p.21 (rentang + panduan) |
| `PG-03` | Larangan menilai legalitas entitas | S3 p.22 (Constraints); `RISET-LAPANGAN.md` §3 |
| `PG-04` | Larangan mengarang data presisi | S3 p.22; `RISET-LAPANGAN.md` §7 |
| `PG-05` | Persona + tone empatik | S3 p.22 (Persona, Tone); `RISET-LAPANGAN.md` §5 |
| `PG-06` | Batas domain + batas kompetensi | S3 p.22 (Constraints) |
| `PG-07` | Ingatkan data pribadi | S1 p.99 (Privasi) |
| `PG-08` | Format output 3 langkah | S3 p.22 (Format Output) |
| `PG-09` | Prompt bebas data yang berubah | `RISET-LAPANGAN.md` header |
| `UI-01` | ID elemen `chat-form`/`user-input`/`chat-box` | S3 p.37; S3 p.34 |
| `UI-02` | Pesan pengguna langsung tampil | S3 p.37, p.39 |
| `UI-03` | Payload `conversation` (perbaikan bug slide) | S3 p.29 vs p.39 |
| `UI-04` | Riwayat multi-turn | S3 p.29, p.37 |
| `UI-05` | Indikator berpikir, diganti di tempat | S3 p.37, p.41, p.42 |
| `UI-06` | Fallback `Sorry, no response received.` / `Failed to get response from server.` | S3 p.37, p.42 |
| `UI-07` | Sapaan pembuka statis | S2 p.67 (pola batch lalu) |
| `UI-08` | Disclaimer permanen | S2 p.67; S1 p.99 (Transparansi) |
| `UI-09` | Kanal resmi statis | `RISET-LAPANGAN.md` §7 |
| `UI-10` | Pembeda peran, scroll, responsif | S3 p.10, p.14, p.34 |
| `UI-11` | Aksesibilitas — ARIA live, fokus, kontras, reduced-motion | S1 p.99 (Keadilan) + D-13 ⚠️ interpretasi |
| `UI-12` | Design token + arah visual restrained | S3 p.34 + D-12 ⚠️ interpretasi |

**32 requirement, semuanya punya sumber.** Dua di antaranya (`UI-11`, `UI-12`) berbasis
**interpretasi prinsip** dari materi, bukan kutipan langsung — ditandai `⚠️` dan alasannya
tertulis penuh di D-12 dan D-13. Satu requirement (`WS-02`) **diamandemen dari nilai materi**
karena model yang ditetapkan materi ditutup Google; bukti dan alasan di `docs/KENDALA-API.md`
§1 dan keputusan D-15. Sisanya merujuk nomor halaman langsung.

---

## 4. Pemetaan requirement → skenario uji

| Uji | Requirement yang diverifikasi |
|---|---|
| UJI-01 | `PG-05`, `UI-02`, `UI-07` |
| UJI-02 | `PG-08` |
| UJI-03 | **`PG-03`** ⛔ gate mutlak |
| UJI-04 | `PG-05` |
| UJI-05 | `PG-06` |
| UJI-06 | `PG-04` |
| UJI-07 | `PG-04`, `UI-09` |
| UJI-08 | `API-03`, `UI-04` |
| UJI-09 | `PG-06` |
| UJI-10 | `UI-01` |
| UJI-11 | `API-02`, `API-06` |
| UJI-12 | `UI-06` |
| UJI-13 | `UI-11` |

Requirement yang diverifikasi lewat gate lain (bukan 13 skenario UI):
`WS-01` s.d. `WS-05` → Gate 2; `API-01`, `API-04`, `API-05` → Gate 3;
`PG-01`, `PG-02`, `PG-09`, `UI-08`, `UI-10`, `UI-12` → inspeksi kode & halaman;
`PG-07` → uji ad-hoc saat Gate 4.

Sebagian `PG-09`, `UI-12` (larangan `innerHTML`), dan kebersihan dependency juga dijaga
otomatis oleh CI (D-14).

---

## 5. Risiko yang tidak sepenuhnya bisa dihilangkan

| Risiko | Status |
|---|---|
| Bot melanggar `PG-03` pada input yang tidak terduga | Tidak bisa dijamin 0%. Mitigasi: prompt absolut + `temperature` rendah + disclaimer UI + uji manual |
| Prompt injection lewat teks tawaran yang ditempel pengguna | Dampak terbatas — bot hanya menghasilkan teks, tidak ada aksi berbahaya yang bisa dipicu. Tidak ada eksekusi kode, tidak ada akses data |
| Kuota API habis saat demo | **Nyata dan terukur.** Free tier hanya 20 permintaan per hari. Mitigasi: strategi pengujian sadar kuota (D-16), dan `UI-06` menampilkan pesan gagal yang jelas alih-alih membuat antarmuka menggantung |
| Model yang dipakai ditutup Google | **Sudah terjadi** pada `gemini-2.5-flash`. Mitigasi: model dibaca dari environment variable (D-15) sehingga penggantian tidak memerlukan perubahan kode |
| Model mengembalikan format tidak sesuai instruksi | Ditangani `UI-06` (fallback bila `result` tidak ada) |
| Angka di `RISET-LAPANGAN.md` kedaluwarsa | Diterima. Angka tidak masuk prompt (D-09); tanggal akses dicatat |
