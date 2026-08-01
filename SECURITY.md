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

## Batas guardrail

Model bahasa bersifat probabilistik. `systemInstruction` menurunkan risiko
keluaran yang tidak diinginkan, tetapi tidak menghilangkannya. Antarmuka memuat
disclaimer permanen sebagai lapis pertahanan kedua, dan setiap guardrail
diverifikasi melalui 12 skenario pengujian manual yang terdokumentasi di
`docs/USE-CASE-CEKDULU.md` §5.
