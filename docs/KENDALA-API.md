# KENDALA-API.md — Perbedaan Materi dengan Kondisi API Aktual

> Berkas ini mendokumentasikan kendala nyata yang ditemukan **saat menjalankan** aplikasi,
> beserta bukti mentahnya. Ditulis agar pembaca memahami mengapa satu nilai di kode berbeda
> dari yang tertulis di materi pelatihan — dan bahwa perbedaan itu adalah keputusan
> berdasar, bukan kekeliruan.
>
> Tanggal pengujian: **1 Agustus 2026**
> Tier akun: **Free tier** (Google AI Studio)

---

## 1. Model `gemini-2.5-flash` tidak lagi tersedia untuk pengguna baru

### Apa yang tertulis di materi

| Sumber | Isi |
|---|---|
| Sesi 2 p.34, Sesi 3 p.28 | `const GEMINI_MODEL = "gemini-2.5-flash";` |
| Sesi 2 p.15 | "Untuk sesi praktik langsung (hands-on), kita akan menggunakan **Gemini 2.5 Flash** karena merupakan model yang paling hemat biaya, dengan performa yang cepat dan fleksibel" |

Implementasi awal mengikuti nilai tersebut secara verbatim, sesuai requirement `WS-02`.

### Apa yang terjadi saat dijalankan

Server hidup normal:

```
$ node index.js
Cek Dulu siap di http://localhost:3000
```

Permintaan pertama ke endpoint gagal:

```bash
$ curl -s -X POST http://localhost:3000/api/chat \
    -H 'Content-Type: application/json' \
    -d '{"conversation":[{"role":"user","text":"halo"}]}'
```

```json
{"error":"{\"error\":{\"code\":404,\"message\":\"This model models/gemini-2.5-flash is no longer available to new users. Please update your code to use a newer model for the latest features and improvements.\",\"status\":\"NOT_FOUND\"}}"}
```

Pesan dari Google, verbatim:

> This model models/gemini-2.5-flash is no longer available to new users.
> Please update your code to use a newer model for the latest features and improvements.

**Ini bukan kesalahan implementasi.** Kode memanggil model dengan nama yang benar; Google
yang menutup akses model tersebut untuk akun yang baru dibuat. Materi pelatihan disusun
sebelum penutupan itu berlaku.

### Model apa yang tersedia

Diperiksa langsung ke endpoint `ListModels`:

```bash
$ curl -s -H "x-goog-api-key: $GEMINI_API_KEY" \
    "https://generativelanguage.googleapis.com/v1beta/models?pageSize=200"
```

Hasil uji pemanggilan nyata pada beberapa kandidat:

| Model | Kode | Keterangan |
|---|---|---|
| `gemini-2.5-flash` | **404** | `no longer available to new users` |
| `gemini-2.5-flash-lite` | **404** | Pesan sama |
| `gemini-2.0-flash` | **429** | `You exceeded your current quota` |
| `gemini-2.5-pro` | **429** | Pesan sama |
| **`gemini-flash-latest`** | **200** | Berhasil, mengembalikan `"Siap"` |

Metadata `gemini-flash-latest` menurut API:

```
name        : models/gemini-flash-latest
displayName : Gemini Flash Latest
version     : Gemini Flash Latest
description : Latest release of Gemini Flash
```

Ini **alias resmi Google** yang selalu menunjuk rilis Gemini Flash terbaru. Sifatnya sama
dengan yang dimaksud materi — model Flash, kelas hemat biaya dan cepat — sehingga semangat
pemilihan model pada Sesi 2 p.15 tetap terjaga.

### Keputusan

Nama model **tidak lagi ditanam sebagai literal** di kode. Model dibaca dari environment
variable dengan nilai bawaan alias resmi:

```javascript
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-flash-latest';
```

Alasan pola ini, bukan sekadar mengganti satu string:

1. **Materi tetap dapat diikuti.** Peserta atau penguji yang memiliki akun lama —
   di mana `gemini-2.5-flash` masih aktif — cukup menulis satu baris di `.env` tanpa
   menyentuh kode:
   `GEMINI_MODEL=gemini-2.5-flash`
2. **Tahan terhadap penutupan berikutnya.** Google terbukti dapat menutup model kapan saja.
   Bila `gemini-flash-latest` suatu saat bermasalah, penggantiannya tidak memerlukan
   perubahan kode.
3. **Konsisten dengan alasan asli materi.** Sesi 3 p.28 menyebut nama model disimpan dalam
   satu konstanta "agar mudah diganti di satu tempat". Membacanya dari environment adalah
   pemenuhan maksud itu secara lebih baik, bukan penyimpangan darinya.

Requirement `WS-02` diamandemen mengikuti keputusan ini. Alasan lengkap tercatat sebagai
keputusan **D-15** pada `openspec/changes/add-cekdulu-chatbot/design.md`.

---

## 2. Rate limit Free tier sangat ketat

### Angka yang berlaku

Dibaca dari dasbor **Google AI Studio → Rate Limit**, project `Sertifikat`, tier
**Free tier**, rentang 28 hari, pada 1 Agustus 2026:

| Model | Kategori | RPM | TPM | RPD |
|---|---|---|---|---|
| Gemini 2.5 Flash | Text-out models | 1 / **5** | 629 / **250K** | 2 / **20** |
| Gemini 3.6 Flash | Text-out models | 1 / **5** | 7 / **250K** | 1 / **20** |
| Gemini 2.5 Flash Lite | Text-out models | 1 / **10** | 5 / **250K** | 1 / **20** |
| Antigravity | Agents | 0 / 60 | 0 / 100K | 0 / 100 |

Keterangan singkatan:
- **RPM** — requests per minute
- **TPM** — tokens per minute
- **RPD** — requests per day

### Konsekuensi yang paling menentukan

**RPD hanya 20 permintaan per hari** untuk model Text-out. Ini batas paling mengikat, jauh
lebih membatasi daripada RPM atau TPM.

Angka TPM 250.000 terlihat besar, tetapi tidak relevan karena RPD akan tercapai lebih dulu.
Dengan `systemInstruction` sepanjang sekitar 2.500 karakter yang dikirim pada **setiap**
permintaan, satu percakapan pendek memakai kurang dari 1.000 token — jadi kuota token
bukan kendala. Yang menjadi kendala adalah **jumlah permintaan**.

Perlu diperhatikan: percakapan multi-turn mengirim **seluruh riwayat** pada setiap
permintaan (requirement `UI-04`, keputusan D-06). Ini konsumsi token yang wajar, tetapi
tetap terhitung **satu permintaan** — jadi tidak memperburuk RPD.

### Strategi hemat kuota yang diterapkan

Rencana pengujian disusun ulang agar tidak menghabiskan kuota sebelum verifikasi penting
selesai. Prinsipnya: **uji yang tidak memakai kuota dijalankan lebih dahulu, dan uji yang
paling menentukan mendapat prioritas kuota.**

**Tidak memakai kuota sama sekali** — jalankan sebanyak apa pun:

| Uji | Alasan tidak memakai kuota |
|---|---|
| UJI-10 validasi input kosong | Ditolak browser sebelum permintaan dikirim |
| UJI-11 body tanpa `conversation` | Ditolak `Array.isArray()` sebelum memanggil model |
| UJI-12 server mati | Tidak ada permintaan yang sampai ke Google |
| UJI-13 navigasi keyboard | Murni interaksi antarmuka |
| Pemeriksaan `UI-08`, `UI-09`, `UI-11`, `UI-12` | Inspeksi halaman dan DevTools |
| Kelima job CI | Hanya `node --check`, `grep`, dan `git` |
| Uji `public/index.html` dimuat | Aset statis, tidak menyentuh API |

**Memakai satu permintaan** — dijalankan berurutan sesuai prioritas:

| Prioritas | Uji | Requirement | Kenapa prioritas ini |
|---|---|---|---|
| 1 | **UJI-03** | **`PG-03`** | **Gate mutlak.** Bila gagal, implementasi dinyatakan gagal dan prompt wajib diperkuat. Harus diuji lebih dahulu agar masih ada kuota untuk mengulang |
| 2 | UJI-02 | `PG-08` | Kemampuan inti aplikasi |
| 3 | UJI-04 | `PG-05` | Tone terhadap korban |
| 4 | UJI-05 | `PG-06` | Batas domain |
| 5 | UJI-06 | `PG-04` | Anti-halusinasi statistik |
| 6 | UJI-07 | `PG-04`, `UI-09` | Anti-halusinasi data kontak |
| 7 | UJI-08 | `API-03`, `UI-04` | Multi-turn, butuh 2 permintaan |
| 8 | UJI-09 | `PG-06` | Batas keamanan |
| 9 | UJI-01 | `PG-05`, `UI-07` | Sapaan; sebagian sudah dijamin `UI-07` yang bersifat statis |

Total kebutuhan minimum: sekitar **10 permintaan** untuk satu putaran penuh, menyisakan
ruang untuk pengulangan bila UJI-03 gagal.

**Aturan operasional saat pengembangan:**

- Jangan menjalankan permintaan berulang untuk menguji hal yang sama. Catat hasilnya di
  `docs/QA-REPORT.md` lalu lanjut.
- Ketika mengerjakan tampilan (`UI-10`, `UI-12`), gunakan pesan pembuka statis `UI-07` dan
  bubble contoh yang ditulis langsung di HTML — jangan memanggil API hanya untuk melihat
  hasil styling.
- Jaga jarak minimal 15 detik antar permintaan agar tidak menabrak batas RPM 5.
- Bila muncul `429`, **berhenti**. Kuota harian akan tersedia kembali; memaksa hanya
  memperpanjang blokir.

### Yang sengaja tidak dilakukan

| Tidak dilakukan | Alasan |
|---|---|
| Menambahkan retry otomatis dengan backoff | Menambah kompleksitas dan justru **memperbanyak** permintaan saat kuota habis. Kegagalan sudah ditangani `API-06` dan ditampilkan jelas oleh `UI-06` |
| Menambahkan cache respons | Memerlukan penyimpanan, dan itu non-goal proyek |
| Menambahkan rate limiting di sisi aplikasi | Non-goal, tidak dibahas materi. Batas sebenarnya sudah ditegakkan Google |
| Beralih ke tier berbayar | Di luar cakupan tugas |

---

## 3. Ringkasan untuk penguji

Bila Anda menjalankan repositori ini dan menemui galat, dua kemungkinan besar:

**`404` dengan pesan `no longer available to new users`**
Nilai `GEMINI_MODEL` pada `.env` Anda menunjuk model yang sudah ditutup. Hapus baris
tersebut agar aplikasi memakai nilai bawaan `gemini-flash-latest`.

**`429` dengan pesan `You exceeded your current quota`**
Kuota harian Free tier sudah habis, yaitu 20 permintaan per hari untuk model Text-out.
Tunggu kuota tersedia kembali. Ini bukan galat aplikasi; antarmuka akan menampilkan
`Failed to get response from server.` sesuai requirement `UI-06`.

Untuk mengetahui model apa saja yang tersedia bagi kunci API Anda:

```bash
curl -s -H "x-goog-api-key: $GEMINI_API_KEY" \
  "https://generativelanguage.googleapis.com/v1beta/models?pageSize=200" \
  | grep -o '"name": "models/[^"]*"'
```

Batas kuota akun Anda dapat dilihat di Google AI Studio pada menu **Rate Limit**.
