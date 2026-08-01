# RISET-LAPANGAN.md — Dasar Data Eksternal untuk Use Case "Cek Dulu"

> **Status file ini:** data di luar materi PDF Hacktiv8. Semua angka **wajib punya URL
> sumber resmi**. Dipakai hanya untuk menjustifikasi pemilihan use case dan mengisi
> pertanyaan wajib di form Final Project ("Siapa target pengguna" & "Bagaimana chatbot
> membantu pengguna").
>
> **Aturan pemakaian:**
> - Angka di file ini **TIDAK BOLEH** ditulis ke dalam `systemInstruction` chatbot.
>   Alasan: angka berubah tiap periode; kalau ditanam di prompt, bot akan menyebut data
>   kedaluwarsa dan itu jadi halusinasi. Chatbot mengajarkan **pola & cara verifikasi**,
>   bukan menghafal statistik.
> - Angka di file ini boleh dipakai di `README.md`, `docs/USE-CASE-CEKDULU.md`, dan
>   jawaban form.
> - Tanggal akses riset: **1 Agustus 2026** (via You.com Search).

---

## 1. Kesenjangan literasi vs inklusi keuangan

**Sumber:** Siaran Pers Bersama OJK & BPS, SP 69/OJK/GKPB/V/2025, 2 Mei 2025.
`https://ojk.go.id/id/berita-dan-kegiatan/siaran-pers/Pages/OJK-dan-BPS-Umumkan-Hasil-Survei-Nasional-Literasi-Dan-Inklusi-Keuangan-SNLIK-Tahun-2025.aspx`

| Indeks | SNLIK 2024 | SNLIK 2025 |
|---|---|---|
| Literasi keuangan | 65,43% | **66,46%** |
| Inklusi keuangan | 75,02% | **80,51%** |

Per sektor (SNLIK 2025): perbankan menopang paling tinggi — literasi 65,50%, inklusi 70,65%.
Literasi keuangan syariah (SNLIK 2024): 39,11%.

**Implikasi untuk use case:**
Inklusi (80,51%) jauh melampaui literasi (66,46%) — selisih **±14 poin persentase**.
Artinya banyak orang sudah **punya akses** produk keuangan digital (rekening, e-wallet,
aplikasi pinjaman) tetapi **belum paham** cara menilai risikonya. Celah inilah yang
dimasuki penawaran ilegal. Chatbot edukatif menyasar tepat di celah ini.

---

## 2. Skala kerugian penipuan keuangan digital

**Sumber:** Siaran Pers Satgas PASTI, SP 08/STPASTI/XI/2025, 15 November 2025.
`https://ojk.go.id/id/berita-dan-kegiatan/info-terkini/Pages/Satgas-PASTI-Imbau-Masyarakat-Waspadai-Penipuan-Menggunakan-AI.aspx`
PDF: `https://www.ojk.go.id/id/berita-dan-kegiatan/info-terkini/Documents/Pages/Satgas-PASTI-Imbau-Masyarakat-Waspadai-Penipuan-Menggunakan-AI/SP-08%20Satgas%20PASTI%20November%202025.pdf`

Indonesia Anti-Scam Centre (IASC), periode **22 November 2024 – 11 November 2025**:

| Metrik | Nilai |
|---|---|
| Laporan penipuan diterima | **343.402** |
| Rekening terkait penipuan dilaporkan | 563.558 |
| Rekening berhasil diblokir | 106.222 |
| Total kerugian dilaporkan korban | **Rp7,8 triliun** |
| Dana berhasil diblokir | Rp386,5 miliar |

**Rasio dana terselamatkan: ±4,95%.**

**Implikasi:** hampir semua kerugian **tidak bisa dipulihkan** setelah kejadian.
Karena itu nilai terbesar ada di **pencegahan sebelum transaksi**, bukan penanganan
sesudahnya. Ini alasan utama chatbot diarahkan ke fase "cek dulu sebelum klik".

Data periode lebih awal (untuk melihat laju pertumbuhan):
- s.d. 31 Mei 2025: 135.397 laporan, kerugian Rp2,6 triliun, diblokir Rp163,3 miliar
  (SP 4/STPASTI/VI/2025, 19 Juni 2025 — `https://ojk.go.id/id/berita-dan-kegiatan/info-terkini/Pages/Satgas-PASTI-Blokir-507-Aktivitas-dan-Entitas-Keuangan-Ilegal-Minta-Masyarakat-Waspadai-Penipuan-yang-Semakin-Marak.aspx`)
- s.d. 30 Juni 2025: 166.258 laporan, kerugian Rp3,4 triliun
  (Kominfo Jatim, 9 Juli 2025 — `https://kominfo.jatimprov.go.id/berita/ojk-bekuk-ribuan-pinjol-dan-investasi-ilegal-kerugian-capai-rp-3-4-triliun`)

Laporan naik dari 135 ribu (Mei 2025) → 343 ribu (Nov 2025) dalam ±6 bulan.

---

## 3. Volume entitas keuangan ilegal

**Sumber:** Satgas PASTI, SP 08/STPASTI/XI/2025, data 2017 s.d. 12 November 2025.

| Jenis entitas | Jumlah dihentikan |
|---|---|
| Pinjaman online ilegal / pinjaman pribadi (pinpri) | **11.873** |
| Investasi ilegal | 1.882 |
| Gadai ilegal | 251 |
| **Total** | **14.005** |

Perbandingan periode: s.d. 31 Mei 2025 totalnya 13.228 entitas. Naik 777 entitas
dalam ±5,5 bulan.

Satgas PASTI juga menemukan nomor WhatsApp penagih (debt collector) pinjol ilegal yang
melakukan **ancaman dan intimidasi** (SP 4/STPASTI/VI/2025).

**Implikasi:** jumlah entitas terlalu besar dan berubah terlalu cepat untuk dihafal
siapa pun — termasuk oleh LLM. **Inilah justifikasi teknis constraint utama chatbot:**
bot tidak boleh menyatakan sebuah nama entitas legal atau ilegal, karena datanya
dinamis dan bot tidak punya akses ke daftar resmi. Bot hanya mengajari ciri + cara
verifikasi mandiri.

---

## 4. Modus penipuan berbasis AI

**Sumber:** Satgas PASTI, SP 08/STPASTI/XI/2025, 15 November 2025.

> "Satuan Tugas Pemberantasan Aktivitas Keuangan Ilegal (Satgas PASTI) mengimbau
> masyarakat untuk mewaspadai modus penipuan memanfaatkan Artificial Intelligence (AI)
> yang marak terjadi dan menimbulkan kerugian."

Badan Siber dan Sandi Negara (BSSN) bergabung ke Satgas PASTI sejak awal 2025.

**Implikasi:** ada ironi yang relevan secara etis — AI dipakai untuk menipu, maka AI
juga wajar dipakai untuk mengedukasi pertahanan. Menyentuh prinsip **Keamanan** dan
**Akuntabilitas** dalam Etika AI (Sesi 1 p.99).

---

## 5. Konteks judi online

**Sumber:** Komdigi, "Judol dan Pinjol Ilegal, Dua Entitas Pengancam Generasi Muda di Era Digital".
`https://www.komdigi.go.id/berita/artikel/detail/judol-dan-pinjol-ilegal-dua-entitas-pengancam-generasi-muda-di-era-digital`

- Awal Mei 2025: PPATK membekukan **lebih dari 5.000 rekening** terafiliasi judi online,
  nilai transaksi **lebih dari Rp600 miliar**.
- Kutipan verbatim soal dampak: "Korban tidak hanya mengalami kerugian materi, tetapi
  juga terjebak dalam lingkaran kecanduan, stres, bahkan depresi."
- Imbauan verbatim: "masyarakat harus saling mendukung, bukan menghakimi korban. Karena
  yang mereka butuhkan adalah solusi dan harapan, bukan stigma dan pengucilan."

**Implikasi:** menentukan **tone** chatbot. Ketika pengguna mengaku sudah jadi korban,
bot wajib **empatik dan tidak menghakimi**. Ini masuk ke `systemInstruction` sebagai
aturan tone, bukan sebagai data.

---

## 6. Skala edukasi yang sudah dilakukan pemerintah

**Sumber:** Komdigi (mengutip Friderica Widyasari Dewi, KE PEPK OJK, 2 Juni 2025).

Periode 1 Januari – 23 Mei 2025: OJK menyelenggarakan **lebih dari 2.366 kegiatan
edukasi keuangan**, menjangkau **lebih dari 5.667.974 peserta**.

**Implikasi:** edukasi tatap muka sudah masif tetapi terbatas jadwal, lokasi, dan
kapasitas. Chatbot melengkapi — **tersedia kapan saja, saat pengguna sedang menerima
tawaran mencurigakan**, yaitu momen paling menentukan. Positioning chatbot adalah
**pelengkap**, bukan pengganti kanal resmi.

---

## 7. Kanal resmi yang boleh dirujuk chatbot

**Sumber:** Satgas PASTI, SP 4/STPASTI/VI/2025 dan SP 08/STPASTI/XI/2025 (verbatim).

| Kanal | Detail |
|---|---|
| Kontak OJK telepon | **157** |
| Kontak OJK WhatsApp | **081 157 157 157** |
| Email konsumen | **konsumen@ojk.go.id** |
| Email Satgas PASTI | **satgaspasti@ojk.go.id** |

Kutipan verbatim siaran pers:
> "Masyarakat yang menemukan informasi atau tawaran investasi dan pinjaman online yang
> mencurigakan atau diduga ilegal atau memberikan iming-iming imbal hasil/bunga yang
> tinggi (tidak logis) untuk melaporkannya kepada Kontak OJK dengan nomor telepon 157,
> WA (081 157 157 157), email: konsumen@ojk.go.id atau email: satgaspasti@ojk.go.id."

**Aturan implementasi:**
- Keempat kanal ini **ditulis statis di HTML/footer UI**, **bukan** diserahkan ke LLM
  untuk mengingat. Alasan: nomor kontak adalah data faktual presisi — risiko halusinasi
  tinggi kalau digenerate model.
- `systemInstruction` hanya menginstruksikan bot **mengarahkan** pengguna ke kanal resmi
  OJK secara umum, tanpa bot menyebut angka spesifik dari memori.

---

## 8. Ringkasan justifikasi use case

| Pertanyaan | Jawaban berbasis data |
|---|---|
| Apakah masalahnya nyata? | Ya. Rp7,8 T kerugian dilaporkan, 343.402 laporan (IASC, Nov 2025). |
| Apakah masalahnya besar? | Ya. 14.005 entitas ilegal dihentikan sejak 2017; 11.873 di antaranya pinjol ilegal. |
| Apakah edukasi teks cukup membantu? | Ya. Hanya ±4,95% dana korban bisa diselamatkan → pencegahan bernilai jauh lebih tinggi daripada penanganan. |
| Mengapa butuh chatbot, bukan artikel? | Pengguna menghadapi tawaran **spesifik** yang perlu dinilai saat itu; artikel statis tidak bisa merespons teks tawaran yang dia terima. |
| Apakah cukup dengan LLM tanpa API eksternal? | Ya. Tugasnya menjelaskan **pola & prosedur verifikasi** — pure text reasoning, tidak butuh lookup database. |
| Apa batas etisnya? | Bot tidak boleh menilai legalitas entitas, memberi nasihat hukum/investasi, atau mengarang nomor kontak & peraturan. |

---

## 9. Catatan keterbatasan riset

- Semua angka adalah **snapshot per tanggal siaran pers**, akan berubah. Karena itu tidak
  ditanam di prompt.
- Data jumlah UMKM (65,5 juta) dan tingkat digitalisasi UMKM (33,6%) sudah dikumpulkan
  saat mengevaluasi opsi alternatif, namun **tidak dipakai** karena Opsi B tidak dipilih.
- Riset ini **tidak** mengubah batasan teknis dari materi. Stack, dependency, endpoint,
  dan kontrak API tetap persis seperti `docs/SPEC-API.md`.
