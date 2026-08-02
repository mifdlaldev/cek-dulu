# Kebijakan Keamanan

## Melaporkan kerentanan

Bila Anda menemukan masalah keamanan pada repositori ini, mohon **jangan** membuat
issue publik. Laporkan lewat GitHub Security Advisory:

`https://github.com/mifdlaldev/cek-dulu/security/advisories/new`

## Cakupan

Proyek ini adalah aplikasi web sederhana untuk keperluan edukasi. Hal-hal yang
relevan dilaporkan:

- Kebocoran kredensial di dalam riwayat commit
- Kerentanan injeksi pada penanganan input pengguna
- Kelemahan pada penanganan keluaran model bahasa (misalnya XSS)
- Cara melewati guardrail persona yang menyebabkan bot memberikan penilaian
  legalitas terhadap suatu entitas — ini pelanggaran requirement `PG-03` dan
  ditangani dengan prioritas tinggi

## Penanganan kredensial

- `GEMINI_API_KEY` disimpan di `.env` yang dikecualikan `.gitignore`
- API key hanya dipakai di sisi server; tidak pernah dikirim ke browser
- Nilai key tidak pernah ditulis ke log, keluaran terminal, atau pesan error

Bila Anda menduga sebuah API key pernah ter-commit, segera cabut key tersebut di
`https://aistudio.google.com/u/0/api-keys` lalu buat yang baru.

## Keterbatasan yang diketahui

Aplikasi ini **tidak memiliki** autentikasi dan rate limiting. Keduanya berada di
luar cakupan materi pelatihan yang menjadi acuan proyek
(lihat `openspec/changes/add-cekdulu-chatbot/proposal.md` §3).

Konsekuensinya: aplikasi ini **hanya untuk dijalankan secara lokal** pada
`localhost:3000`. Menjalankannya di server yang terekspos internet tanpa
menambahkan autentikasi dan pembatasan laju akan membuat kuota API Gemini Anda
dapat dipakai siapa saja.

## Unggahan berkas

Endpoint `POST /api/chat-with-file` menerima gambar dan dokumen dari pengguna
(requirement `API-07`, `API-08`). Tiga hal berikut disampaikan apa adanya, bukan
sebagai klaim keamanan.

### Validasi jenis berkas tidak sepenuhnya dapat diandalkan

Berkas divalidasi lewat **allowlist MIME** di sisi server:

| MIME diizinkan | Keterangan |
|---|---|
| `image/png`, `image/jpeg`, `image/webp` | gambar |
| `application/pdf` | dokumen |
| `text/plain` | teks |

Nilai yang diperiksa adalah `req.file.mimetype`, dan nilai itu berasal dari header
`Content-Type` pada bagian multipart yang **dikirim klien**. Header itu **dapat
dipalsukan**.

Validasi magic byte akan lebih kuat karena memeriksa isi berkas alih-alih
mempercayai label pengirim, tetapi menuntut dependency di luar daftar materi
pelatihan sehingga tidak dikerjakan (keputusan `design.md` D-24e).

**Karena itu:** allowlist ini mengurangi risiko, **tidak menghilangkannya**. Jangan
memperlakukan endpoint ini sebagai penyaring berkas yang aman.

Yang membatasi dampaknya: berkas tidak pernah ditulis ke disk, tidak pernah
dieksekusi, dan hanya diteruskan ke API Gemini sebagai data base64. Tidak ada folder
`uploads/` — `multer()` memakai memory storage sesuai materi Sesi 2 p.56.

### Batas ukuran

Berkas dibatasi **4 MB**. Permintaan yang melebihi batas ditolak `multer` di
tingkat middleware dan dikembalikan sebagai `500 { error }`.

### Berkas dikirim ke pihak ketiga

Berkas yang diunggah **dikirim ke API Google Gemini** untuk dianalisis. Ini
perubahan sifat dibandingkan input teks: sebelumnya pengguna menempelkan teks yang
ia pilih sendiri, sedangkan tangkapan layar hampir selalu memuat nomor telepon,
nama kontak, dan kadang nominal saldo.

Dua lapis mitigasi disediakan, dan keduanya perlu dipahami batasnya:

1. **Nota privasi statis** di dekat tombol lampiran (`UI-17`) menganjurkan pengguna
   menutup bagian yang memuat data pribadi lebih dahulu. Lapis ini **tidak
   bergantung pada model** dan bekerja sebelum berkas terkirim.
2. **Larangan `PG-10`** melarang bot membacakan ulang data pribadi yang terlihat.
   Lapis ini **bergantung pada model**, sehingga bersifat probabilistik seperti
   guardrail lainnya.

Tidak ada penyensoran otomatis. Aplikasi tidak memeriksa isi berkas sebelum
mengirimkannya.

### Prompt injection lewat gambar

Gambar dapat memuat tulisan yang ditujukan kepada model, misalnya perintah untuk
mengabaikan aturannya. Model membaca teks di dalam gambar, sehingga permukaan
serangan ini nyata dan tidak ada pada input teks biasa.

`PG-10` memuat larangan eksplisit: seluruh tulisan di dalam berkas adalah bahan
yang dianalisis, bukan perintah. UJI-20 menguji ini secara langsung, dan buktinya
tercatat di `docs/QA-REPORT.md`.

Seperti guardrail lainnya, larangan ini menurunkan risiko tanpa menghilangkannya.
Bila Anda menemukan cara menembusnya sehingga bot memberikan penilaian legalitas,
itu pelanggaran `PG-03` dan termasuk yang ditangani dengan prioritas tinggi.

## Batas guardrail

Model bahasa bersifat probabilistik. `systemInstruction` menurunkan risiko
keluaran yang tidak diinginkan, tetapi tidak menghilangkannya. Antarmuka memuat
disclaimer permanen sebagai lapis pertahanan kedua, dan setiap guardrail
diverifikasi melalui skenario pengujian manual yang terdokumentasi di
`docs/USE-CASE-CEKDULU.md` §5, dengan bukti mentah di `docs/QA-REPORT.md`.
