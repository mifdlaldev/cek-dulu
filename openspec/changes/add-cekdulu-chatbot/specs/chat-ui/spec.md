# Spec Delta — `chat-ui`

Change: `add-cekdulu-chatbot`
Kapabilitas: antarmuka chat Vanilla JavaScript di folder `public/`.

> **Amandemen setelah riset desain.** Versi pertama kapabilitas ini menempatkan seluruh
> elemen berjejer vertikal di tengah halaman — susunan yang terbaca sebagai formulir, bukan
> percakapan. Antarmuka kini memakai pola **launcher dan panel dialog** sesuai konvensi 89%
> widget chat, dengan palet **light mode** yang sejalan literatur keterbacaan untuk pengguna
> lanjut usia. Requirement yang terpengaruh: `UI-01` (penempatan), `UI-11` (pola dialog),
> `UI-12` (palet). Requirement baru: `UI-13`. Bukti dan sitasi: `docs/RISET-DESAIN.md`.
> Keputusan: `design.md` D-12 (amandemen), D-18, D-19.
>
> **Amandemen keempat — lampiran berkas.** Atas permintaan pengguna, komposer mendapat tombol
> lampiran untuk gambar dan dokumen. Requirement baru: `UI-16`, `UI-17`. Requirement yang
> diamandemen: `UI-03` (jalur multipart), `UI-04` (base64 tidak masuk riwayat), `UI-11`
> (aksesibilitas pemilih berkas). Keputusan: `design.md` D-24. Dua non-goal dicabut terbuka di
> `proposal.md` §3.
>
> **Amandemen ketiga — komposer.** Kolom pesan berubah dari `<input type="text">` menjadi
> `<textarea>` yang tumbuh ke bawah, karena use case meminta pengguna menempelkan pesan utuh
> beberapa baris dan input satu baris menyembunyikan apa yang sudah ditulis. Blok contoh
> pertanyaan mendapat tombol tutup, dan nota disclaimer diperkecil agar muat satu baris.
> Requirement yang terpengaruh: `UI-01` (jenis elemen — **menyimpang dari kode materi**),
> `UI-08` dan `UI-12` (ukuran teks nota). Requirement baru: `UI-15`. Bukti dan sitasi:
> `docs/RISET-DESAIN.md` §7 dan §8. Keputusan: `design.md` D-21.
>
> **Amandemen kedua — landing page.** Setelah pola widget diterapkan, badan halaman hanya
> memuat hero singkat, disclaimer, dan kanal resmi; tidak menjelaskan apa yang Cek Dulu
> lakukan kepada pengunjung baru. Badan halaman kini disusun sebagai landing page sembilan
> section dengan section "Social Proof" **diganti** "Data & Sumber" berisi angka lembaga resmi
> bersitasi — karena aplikasi belum punya pengguna dan mengarang testimoni bertentangan dengan
> nilai proyek. Requirement yang terpengaruh: `UI-08` dan `UI-09` (penempatan). Requirement
> baru: `UI-14`. Bukti dan sitasi: `docs/RISET-DESAIN.md` §6. Keputusan: `design.md` D-20.

---

## ADDED Requirements

### `UI-01` — Struktur HTML dasar dan komposer multi-baris ⚠️

| Meta | Nilai |
|---|---|
| Sumber | S3 p.37 (struktur HTML verbatim dari prompt), S3 p.34 (isi folder `public/`); penempatan diamandemen `design.md` D-18; jenis elemen kolom pesan diamandemen D-21a |
| Berkas | `public/index.html`, `public/style.css`, `public/script.js` |
| Uji | UJI-10, UJI-16 |
| Terkait | `UI-11`, `UI-13`, `UI-15` |

> **Penyimpangan dari kode materi.** Slide S3 p.37 menuliskan
> `<input type="text" id="user-input" />`. Requirement ini menggantinya dengan `<textarea>`.
> Alasan lengkap beserta alternatif yang ditolak: `design.md` D-21a. Riset dan sitasi:
> `docs/RISET-DESAIN.md` §7. Ini penyimpangan kedua dari materi setelah `WS-02` (D-15).

Halaman WAJIB memuat elemen dengan ID berikut. Nama ID **tidak berubah** karena materi
mewajibkannya; yang diamandemen hanya jenis elemen kolom pesan dan penempatannya:

```html
<form id="chat-form">
  <textarea id="user-input" rows="1" required></textarea>
  <button type="submit" id="send-button">Kirim</button>
</form>
<div id="chat-box"></div>
```

Ketiga elemen WAJIB berada **di dalam panel dialog** (`UI-13`), bukan langsung di badan
halaman.

Halaman WAJIB memuat `style.css` dan `script.js` dari folder yang sama.

Kolom pesan WAJIB memiliki atribut `required` sehingga browser menampilkan validasi bawaan
bila kosong — perilaku ini terlihat di screenshot S3 p.14 dan p.45 ("Please fill out this
field.").

Kolom pesan WAJIB memiliki placeholder yang mengarahkan pengguna.

Halaman WAJIB memuat judul yang mengidentifikasi bot.

**Perilaku tinggi kolom pesan**

- Kolom pesan WAJIB tumbuh **ke bawah** mengikuti jumlah baris isi. DILARANG menggulir
  horizontal, karena pengguna diminta menempelkan pesan utuh beberapa baris dan harus dapat
  memeriksanya sebelum mengirim.
- Tinggi awal **satu baris**.
- Tumbuh sampai **maksimal enam baris**, lalu kolom itu sendiri menggulir vertikal
  (`overflow-y: auto`). Batas dipilih karena tinggi panel hanya 560px; sumber menganjurkan
  rentang 6–10 baris.
- Tinggi WAJIB **menyusut kembali** saat isi dihapus.
- Jalur utama memakai `field-sizing: content`. Bila browser tidak mendukungnya
  (`CSS.supports('field-sizing', 'content')` bernilai `false`), fallback JavaScript WAJIB
  memakai urutan `height = 'auto'` lalu `height = scrollHeight + 'px'` — reset ke `auto`
  wajib lebih dulu, tanpanya tinggi tidak pernah menyusut.
- Atribut `resize` bawaan textarea WAJIB dimatikan (`resize: none`) agar pegangan ubah ukuran
  tidak menutupi tombol kirim.

**Perilaku papan tuts**

| Tombol | Aksi |
|---|---|
| `Enter` tanpa `Shift` | Mengirim pesan |
| `Shift` + `Enter` | Menyisipkan baris baru |

Konvensi ini mengikuti WhatsApp, Telegram, dan Slack. Pengiriman WAJIB dipicu **hanya** oleh
`keydown`; DILARANG memicu pengiriman dari peristiwa `input`, karena itu melanggar WCAG 3.2.2
On Input.

Mitigasi aksesibilitas yang WAJIB ada, karena membajak Enter pada textarea berisiko
mengirim pesan setengah selesai:

1. Tombol **Kirim** tetap ada, terlihat, dan dapat difokuskan — teknik WCAG H32 meminta tombol
   submit eksplisit, bukan hanya submit implisit lewat Enter.
2. Perilaku papan tuts WAJIB diumumkan ke screen reader lewat `aria-describedby` pada kolom
   pesan yang menunjuk teks petunjuk.

#### Scenario: halaman termuat
- **Given** server berjalan
- **When** pengguna membuka `http://localhost:3000/`
- **Then** elemen `#chat-form`, `#user-input`, dan `#chat-box` ada di DOM
- **And** `#user-input` adalah elemen `textarea`
- **And** ketiganya berada di dalam elemen panel dialog
- **And** `style.css` dan `script.js` termuat tanpa 404

#### Scenario: input kosong ditolak browser
- **Given** panel dialog terbuka
- **When** pengguna menekan tombol kirim tanpa mengisi kolom pesan
- **Then** form tidak terkirim
- **And** browser menampilkan validasi bawaan

#### Scenario: kolom pesan tumbuh ke bawah
- **Given** panel dialog terbuka
- **When** pengguna menempelkan teks yang panjangnya beberapa baris
- **Then** tinggi kolom pesan bertambah
- **And** seluruh baris terlihat tanpa menggulir horizontal

#### Scenario: kolom pesan menyusut saat isi dihapus
- **Given** kolom pesan sudah tumbuh beberapa baris
- **When** pengguna menghapus isinya
- **Then** tinggi kolom pesan kembali ke satu baris

#### Scenario: pertumbuhan dibatasi enam baris
- **When** pengguna mengisi lebih dari enam baris
- **Then** tinggi kolom pesan berhenti bertambah
- **And** kolom pesan menggulir vertikal
- **And** aliran chat tidak tergeser habis

#### Scenario: Enter mengirim pesan
- **Given** kolom pesan berisi teks
- **When** pengguna menekan `Enter` tanpa `Shift`
- **Then** pesan terkirim
- **And** tidak ada baris baru yang tersisip

#### Scenario: Shift+Enter menyisipkan baris baru
- **Given** kolom pesan berisi teks
- **When** pengguna menekan `Shift` dan `Enter` bersamaan
- **Then** baris baru tersisip
- **And** pesan TIDAK terkirim

#### Scenario: tombol kirim tetap dapat dipakai
- **Given** kolom pesan berisi teks
- **When** pengguna memberi fokus pada tombol kirim lalu menekan `Enter`
- **Then** pesan terkirim

#### Scenario: perilaku papan tuts diumumkan
- **When** screen reader membacakan kolom pesan
- **Then** ada deskripsi yang menyebut `Enter` mengirim dan `Shift` dengan `Enter` membuat
  baris baru

#### Scenario: tinggi kolom kembali setelah pesan terkirim
- **Given** kolom pesan sudah tumbuh beberapa baris
- **When** pesan terkirim
- **Then** kolom pesan kosong
- **And** tingginya kembali ke satu baris

---

### `UI-02` — Pesan pengguna langsung tampil

| Meta | Nilai |
|---|---|
| Sumber | S3 p.37 ("Add the user's message to the chat box"), S3 p.39/p.42 (kode) |
| Berkas | `public/script.js` |
| Uji | UJI-01 |

Saat form disubmit, sistem WAJIB:

1. Mencegah reload dengan `e.preventDefault()`
2. Mengambil nilai input dan memangkasnya dengan `.trim()`
3. Berhenti bila hasil trim kosong
4. Menambahkan pesan pengguna ke `#chat-box`
5. Mengosongkan input

#### Scenario: kirim pesan
- **When** pengguna mengetik "Halo" dan menekan Send
- **Then** halaman tidak reload
- **And** bubble berisi "Halo" muncul di `#chat-box` sebagai pesan pengguna
- **And** input menjadi kosong

#### Scenario: input berisi hanya spasi
- **When** pengguna mengisi input dengan spasi lalu menekan Send
- **Then** tidak ada pesan ditambahkan ke `#chat-box`
- **And** tidak ada request dikirim ke server

---

### `UI-03` — Payload request memakai `conversation` ⚠️

| Meta | Nilai |
|---|---|
| Sumber | S3 p.29 (backend), S3 p.37 (spesifikasi prompt); jalur multipart diamandemen `design.md` D-24 |
| Berkas | `public/script.js` |
| Terkait | `API-01`, `API-07`, `UI-16` |

Sistem WAJIB mengirim `POST` ke `/api/chat` dengan:

- Header `Content-Type: application/json`
- Body `JSON.stringify({ conversation: [...] })`
- Setiap item berbentuk `{ role, text }` dengan `role` bernilai `"user"` atau `"model"`

**Jalur kedua untuk lampiran.** Bila pengguna melampirkan berkas (`UI-16`), sistem WAJIB
mengirim `POST` ke `/api/chat-with-file` dengan `FormData` berisi field `file` dan `prompt`.

Pada jalur ini, header `Content-Type` **DILARANG diset manual**. `fetch` menetapkannya sendiri
beserta `boundary` multipart; menuliskannya manual menghilangkan `boundary` dan membuat
`multer` gagal mem-parsing berkas.

> **PERANGKAP.** Kode hasil Gemini Code Assist di slide S3 p.39 dan p.42 mengirim
> `body: JSON.stringify({ messages: [{ role: 'user', content: userMessage }] })`.
> Itu **BUG** — backend S3 p.29 membaca `conversation` dengan field `text`.
> Menyalin kode slide apa adanya membuat chatbot mati total.
> Payload benar: `{ conversation: [{ role: 'user', text: userMessage }] }`.
> Keputusan di `AGENTS.md` §3.2.

#### Scenario: bentuk payload benar
- **When** pengguna mengirim pesan tanpa lampiran
- **Then** body request memiliki field `conversation`, bukan `messages`
- **And** setiap item memiliki field `text`, bukan `content`
- **And** tujuannya `/api/chat`

#### Scenario: lampiran dikirim sebagai FormData
- **Given** pengguna sudah memilih sebuah berkas
- **When** pengguna mengirim pesan
- **Then** tujuannya `/api/chat-with-file`
- **And** body berupa `FormData` dengan field `file` dan `prompt`
- **And** header `Content-Type` TIDAK diset manual oleh kode

---

### `UI-04` — Riwayat percakapan multi-turn

| Meta | Nilai |
|---|---|
| Sumber | S3 p.29 ("Endpoint ini memungkinkan percakapan multi-turn dengan Gemini AI"), S3 p.37 (contoh body berisi 3 item); perlakuan lampiran diamandemen `design.md` D-24c |
| Berkas | `public/script.js` |
| Uji | UJI-08 |
| Terkait | `UI-16`, `API-07` |

Sistem WAJIB menyimpan riwayat percakapan dalam array di memori browser, lalu
mengirimkannya **utuh** pada setiap request.

Setelah balasan bot diterima, balasan tersebut WAJIB ditambahkan ke riwayat dengan
`role: "model"`.

Riwayat TIDAK disimpan di server maupun di penyimpanan browser permanen — hilang saat
halaman di-reload. Ini konsisten dengan non-goals (tidak ada persistensi).

**Data base64 berkas DILARANG masuk riwayat.** Ketika pengguna melampirkan berkas, yang
disuntikkan ke riwayat adalah **satu turn teks** berisi penanda nama berkas beserta prompt
pengguna, diikuti jawaban bot sebagai `role: "model"`.

Alasannya aritmetika, bukan selera: riwayat dikirim utuh setiap turn, sehingga menyimpan
base64 di dalamnya membuat gambar dikirim ulang pada **setiap** permintaan berikutnya —
menabrak batas token per menit dan menghabiskan kuota 20 permintaan per hari dalam beberapa
pesan.

**Konsekuensi yang diterima:** model tidak melihat gambar pada turn lanjutan, hanya jawabannya
sendiri. Pertanyaan lanjutan tetap bekerja karena jawaban bot ada di riwayat, tetapi pertanyaan
yang menuntut melihat ulang gambar tidak akan terjawab akurat. Alasan pertukaran ini:
`design.md` D-24c.

#### Scenario: bot memahami rujukan ke jawaban sebelumnya
- **Given** pengguna sudah bertanya "Apa itu pinjol ilegal?" dan bot sudah menjawab
- **When** pengguna mengirim "Terus yang tadi poin kedua tolong jelaskan lagi"
- **Then** body request memuat riwayat lengkap: pesan pertama pengguna, balasan bot dengan
  `role: "model"`, dan pesan baru pengguna
- **And** bot menjawab sesuai konteks sebelumnya, bukan bertanya ulang dari nol

#### Scenario: riwayat direset saat reload
- **Given** percakapan sudah berlangsung beberapa turn
- **When** halaman di-reload
- **Then** `#chat-box` kembali ke kondisi awal
- **And** riwayat yang dikirim ke server dimulai dari kosong

---

### `UI-05` — Indikator "sedang berpikir" yang diganti di tempat

| Meta | Nilai |
|---|---|
| Sumber | S3 p.37, p.42 ("sebaiknya frontend terlebih dahulu menampilkan pesan sementara seperti 'Gemini is thinking…'"), S3 p.39 (kode); bentuk visual dari `design.md` D-19 |
| Berkas | `public/script.js`, `public/style.css` |

Sebelum request dikirim, sistem WAJIB menambahkan satu elemen pesan bot sementara ke
`#chat-box`.

Setelah respons diterima, sistem WAJIB **mengganti isi elemen yang sama** — bukan
menambahkan elemen baru. Alasan eksplisit dari slide S3 p.41: pendekatan ini "avoids
jarring layout shifts".

Selama menunggu, tombol submit WAJIB dinonaktifkan agar pengguna tidak mengirim ganda.

Indikator WAJIB berbentuk **tiga titik beranimasi**, bukan teks biasa. Clutch menyatakan
indikator diperlukan untuk respons 1–3 detik; respons model pada proyek ini berkisar 5–30
detik, jauh di atas ambang tersebut.

Indikator WAJIB memuat **teks tersembunyi untuk screen reader**, karena titik beranimasi
tidak menyampaikan apa pun kepada pembaca layar.

Indikator DILARANG muncul sebelum pengguna mengirim pesan. messengerbot.app melarang
"typing indicators before the user has actually engaged".

Animasi titik WAJIB berhenti bila `prefers-reduced-motion: reduce` aktif, dengan titik tetap
terlihat statis agar informasi tidak hilang (`UI-11`).

#### Scenario: indikator muncul lalu diganti
- **When** pengguna mengirim pesan
- **Then** muncul satu bubble bot berisi tiga titik beranimasi
- **And** setelah respons tiba, bubble yang sama berubah isinya menjadi jawaban bot
- **And** jumlah bubble bot tidak bertambah dua

#### Scenario: indikator tidak muncul sebelum pengguna terlibat
- **When** halaman baru dibuka dan panel dibuka
- **Then** tidak ada indikator mengetik di `#chat-box`
- **And** hanya sapaan pembuka `UI-07` yang terlihat

#### Scenario: indikator terbaca screen reader
- **Given** pengguna memakai screen reader
- **When** indikator muncul
- **Then** ada teks yang menjelaskan bahwa jawaban sedang disiapkan

---

### `UI-06` — Penanganan respons dan fallback error

| Meta | Nilai |
|---|---|
| Sumber | S3 p.37, p.42 (teks fallback verbatim), S3 p.39 (kode) |
| Berkas | `public/script.js` |
| Uji | UJI-12 |

Sistem WAJIB memeriksa apakah respons memiliki properti `result`:

- Ada → tampilkan nilainya sebagai balasan bot
- Tidak ada → tampilkan `Sorry, no response received.`

Bila request gagal (jaringan mati, server mati, atau status non-OK), sistem WAJIB
menampilkan `Failed to get response from server.`

Kedua teks fallback disalin verbatim dari S3 p.37.

Sistem WAJIB menggulir `#chat-box` ke bawah setelah pesan terakhir dirender, dijalankan
di blok `finally` sesuai pola S3 p.42.

Pada kondisi error, riwayat percakapan TIDAK BOLEH tercemar pesan error — pesan error
hanya ditampilkan di UI, tidak ditambahkan ke array riwayat sebagai `role: "model"`.

#### Scenario: server mati
- **Given** server backend tidak berjalan
- **When** pengguna mengirim pesan
- **Then** UI menampilkan `Failed to get response from server.`
- **And** halaman tidak crash

#### Scenario: respons tanpa field `result`
- **Given** server mengembalikan `200` dengan body tanpa `result`
- **When** respons diproses
- **Then** UI menampilkan `Sorry, no response received.`

#### Scenario: error tidak mencemari riwayat
- **Given** satu request gagal
- **When** pengguna mengirim pesan berikutnya setelah server hidup kembali
- **Then** riwayat yang dikirim tidak memuat teks pesan error

---

### `UI-07` — Sapaan pembuka

| Meta | Nilai |
|---|---|
| Sumber | S2 p.67 (pola batch sebelumnya: sapaan "Halo 👋" + penjelasan kemampuan) |
| Berkas | `public/index.html` atau `public/script.js` |

Saat halaman pertama dibuka, `#chat-box` WAJIB menampilkan satu pesan pembuka dari bot
yang menjelaskan: siapa bot ini, apa yang bisa dibantu, dan batasannya secara singkat.

Pesan pembuka ini **statis** — ditulis langsung, tidak memanggil API. Alasannya: menghemat
kuota dan memastikan teks pembuka konsisten dan bebas halusinasi.

Pesan pembuka TIDAK dimasukkan ke array riwayat yang dikirim ke server, agar tidak
membingungkan konteks model.

#### Scenario: halaman pertama dibuka
- **When** pengguna membuka halaman
- **Then** ada satu pesan bot pembuka di `#chat-box`
- **And** tidak ada request ke `/api/chat` yang terkirim
- **And** pesan pembuka tidak ikut terkirim pada request pertama pengguna

---

### `UI-08` — Disclaimer permanen

| Meta | Nilai |
|---|---|
| Sumber | S2 p.67 (contoh batch: "Informasi bersifat edukatif dan bukan nasihat finansial profesional"); S1 p.99 (prinsip Transparansi); penempatan diamandemen `design.md` D-20; ukuran teks nota komposer diamandemen D-21c |
| Berkas | `public/index.html`, `public/style.css` |
| Terkait | `PG-03`, `UI-12`, `UI-13`, `UI-14` |

Halaman WAJIB memuat disclaimer yang menyatakan bahwa:

1. Informasi bersifat **edukatif**, bukan nasihat keuangan, hukum, atau investasi profesional
2. Bot **tidak menilai** legalitas perusahaan atau aplikasi tertentu
3. Keputusan akhir dan verifikasi tetap tanggung jawab pengguna

Disclaimer WAJIB muncul di **tiga tempat**, masing-masing dengan fungsi berbeda:

| Tempat | Bentuk | Fungsi |
|---|---|---|
| Section Batasan (`UI-14`) | Delapan larangan lengkap | Pembaca memahami batas sebelum bertanya |
| Bawah komposer di panel | Satu baris ringkas, memakai `--teks-nano` | Terlihat saat pengguna sedang berdialog |
| Footer | Satu paragraf | Penutup halaman, selalu ada |

Seluruhnya berada di **badan halaman atau panel**, bukan tersembunyi di balik interaksi. Panel
bersifat non-modal (`UI-13`) justru agar disclaimer di badan halaman tidak tersembunyi dari
screen reader saat panel terbuka.

Disclaimer ini adalah **lapis pertahanan kedua** setelah `PG-03`. Karena LLM bersifat
probabilistik, guardrail prompt saja tidak cukup — pengguna harus tahu batas alat ini dari
antarmuka, bukan hanya dari jawaban bot.

#### Scenario: disclaimer terlihat tanpa interaksi
- **When** pengguna membuka halaman
- **Then** disclaimer di footer dan section Batasan dapat dijangkau dengan menggulir
- **And** keduanya menyebut sifat edukatif dan batas penilaian legalitas

#### Scenario: disclaimer terlihat saat berdialog
- **Given** panel dialog terbuka
- **When** pengguna melihat komposer
- **Then** ada pengingat ringkas di bawah kolom pesan
- **And** pengingat itu muat dalam satu baris pada lebar panel desktop
- **And** isinya tetap menyebut sifat edukatif dan larangan menilai legalitas

#### Scenario: disclaimer tetap terjangkau saat panel terbuka
- **Given** panel dialog terbuka
- **When** screen reader membaca halaman
- **Then** disclaimer di badan halaman tetap dapat dibaca karena panel non-modal

---

### `UI-09` — Kanal resmi ditulis statis

| Meta | Nilai |
|---|---|
| Sumber | `docs/RISET-LAPANGAN.md` §7 (verbatim siaran pers Satgas PASTI); penempatan diamandemen `design.md` D-20 |
| Berkas | `public/index.html` |
| Terkait | `PG-04`, `UI-14` |

Kanal resmi OJK WAJIB ditulis **statis di HTML**, tidak digenerate oleh model:

| Kanal | Nilai |
|---|---|
| Telepon | `157` |
| WhatsApp | `081 157 157 157` |
| Email konsumen | `konsumen@ojk.go.id` |
| Email Satgas PASTI | `satgaspasti@ojk.go.id` |

Keempatnya WAJIB ditempatkan sebagai **section tersendiri** pada landing page (`UI-14`), dengan
judul yang menyebut Otoritas Jasa Keuangan.

Alasan: nomor kontak adalah data presisi tinggi dengan risiko halusinasi besar bila
diserahkan ke LLM. `PG-04` melarang bot menyebutkannya dari ingatan; requirement ini
menyediakan tempat yang benar untuk data tersebut.

Sumber data WAJIB dicantumkan agar bisa diaudit ulang.

#### Scenario: kanal resmi tersedia di halaman
- **When** pengguna membuka halaman
- **Then** keempat kanal resmi terlihat pada section tersendiri
- **And** nilainya persis seperti tabel di atas
- **And** sumber data tercantum

#### Scenario: kanal resmi dapat dijangkau dari navigasi
- **When** pengguna mengklik tautan navigasi menuju kanal resmi
- **Then** halaman menggulir ke section tersebut

#### Scenario: bot mengarahkan ke kanal yang sudah ada di halaman
- **When** pengguna bertanya cara melapor
- **Then** bot mengarahkan ke kanal resmi secara umum tanpa mengarang nomor
- **And** pengguna dapat menemukan nomor tersebut di halaman

---

### `UI-10` — Tampilan dan pembeda peran

| Meta | Nilai |
|---|---|
| Sumber | S3 p.10 & p.14 (screenshot tampilan target), S3 p.34 (`style.css` mengatur tampilan); batas lebar bubble dari `docs/RISET-DESAIN.md` §1; bentuk avatar diamandemen `design.md` D-22, varian header D-23 |
| Berkas | `public/style.css`, `public/index.html`, `public/script.js`, `public/avatar.png`, `public/avatar-header.png` |
| Uji | UJI-17 |

Tampilan WAJIB memenuhi:

- Pesan pengguna dan pesan bot **dapat dibedakan secara visual** (posisi dan/atau warna).
  Pada starter code S3 p.10: bubble pengguna rata kanan, bubble bot rata kiri.
- Setiap bubble bot didahului **avatar** berbentuk lingkaran (`design.md` D-19, diamandemen
  D-22). Avatar bot berupa **berkas gambar** `public/avatar.png`; avatar pengguna tetap dibuat
  dari CSS dan teks karena hanya berisi satu inisial. Keduanya memakai `aria-hidden="true"`
  agar tidak dibaca ganda oleh screen reader.
- Berkas avatar WAJIB memenuhi: ukuran sumber **64×64px** (dua kali ukuran tampil 32px agar
  tajam pada layar kerapatan ganda), ukuran berkas **di bawah 5 KB**, dan hanya memakai warna
  dari palet `UI-12`.
- Avatar memakai **dua varian** karena latar tempatnya berbeda (`design.md` D-23):
  `avatar.png` berisian teal untuk bubble bot yang berlatar terang, dan `avatar-header.png`
  berisian putih untuk header panel yang berlatar navy. Isian putih di bubble terang akan
  melebur, dan isian teal di header navy membuat glyph hilang.
- Elemen `<img>` avatar WAJIB memuat atribut `width` dan `height` agar browser memesan ruang
  sebelum gambar termuat, sehingga tidak terjadi pergeseran tata letak.
- Elemen `<img>` avatar WAJIB memakai `alt=""`, bukan `alt` yang dihilangkan — atribut kosong
  menandai gambar dekoratif, sedangkan atribut yang hilang membuat screen reader membacakan
  nama berkas.
- Isian lingkaran terhadap latar tempatnya WAJIB memenuhi minimal **3:1**, dan glyph terhadap
  isian juga minimal **3:1** — ambang WCAG 1.4.11 untuk objek grafis. Bila salah satu tidak
  terpenuhi, yang diubah adalah **isi berkasnya**, bukan menambah pemisah tepi lewat CSS:
  glyph pada berkas sumber berupa lubang transparan, sehingga gaya CSS tidak dapat
  memperbaikinya.
- Lebar bubble maksimal **320px** pada desktop dan **85%** lebar panel pada layar sempit.
  Clutch menyebut rentang 280–320px sebagai batas keterbacaan.
- `#chat-box` memiliki tinggi terbatas dengan scroll vertikal.
- Layout **responsif** — tetap terpakai di layar ponsel. Ini penting karena target
  pengguna adalah orang yang menerima tawaran mencurigakan di ponselnya.
- Teks memiliki kontras cukup untuk keterbacaan (`UI-11`).
- Teks panjang dari bot tidak terpotong dan tidak meluber keluar kontainer.

Styling ditulis dengan CSS biasa. **DILARANG** memakai framework CSS via CDN atau
dependency baru — materi menetapkan Vanilla (S3 p.34).

#### Scenario: avatar bot berupa gambar yang termuat
- **Given** panel dialog terbuka
- **When** bubble bot diperiksa
- **Then** avatarnya adalah elemen `img` dengan `src` menunjuk `avatar.png`
- **And** gambar berhasil termuat
- **And** ukuran tampilnya 32×32px

#### Scenario: avatar pengguna tetap inisial
- **Given** pengguna sudah mengirim satu pesan
- **When** bubble pengguna diperiksa
- **Then** avatarnya adalah elemen `span` berisi teks inisial
- **And** bukan elemen `img`

#### Scenario: avatar tidak dibaca screen reader
- **When** kedua avatar diperiksa
- **Then** keduanya memiliki `aria-hidden="true"`
- **And** keduanya memiliki `alt=""`
- **And** penanda pengirim berupa teks tetap ada pada setiap bubble

#### Scenario: avatar tidak menggeser tata letak
- **When** elemen `img` avatar diperiksa
- **Then** atribut `width` dan `height` ada
- **And** tidak ada scroll horizontal pada dokumen

#### Scenario: avatar header memakai varian berisian putih
- **When** avatar pada header panel diperiksa
- **Then** `src` menunjuk `avatar-header.png`
- **And** isian lingkaran berwarna putih
- **And** glyph berwarna teal dari palet `UI-12`

#### Scenario: avatar bubble memakai varian berisian teal
- **When** avatar pada bubble bot diperiksa
- **Then** `src` menunjuk `avatar.png`
- **And** isian lingkaran berwarna teal

#### Scenario: kedua varian memenuhi ambang objek grafis
- **When** kontras diukur pada masing-masing latar tempatnya
- **Then** isian terhadap latar minimal 3:1
- **And** glyph terhadap isian minimal 3:1

#### Scenario: pesan panjang tetap rapi
- **Given** bot mengembalikan jawaban panjang dengan beberapa poin
- **When** jawaban dirender
- **Then** teks membungkus dengan benar, tidak terpotong, tidak keluar kontainer
- **And** `#chat-box` dapat di-scroll ke seluruh isi

#### Scenario: lebar bubble terbatas
- **When** bot mengembalikan jawaban panjang pada viewport desktop
- **Then** lebar bubble tidak melebihi 320px

#### Scenario: tampilan di layar sempit
- **When** halaman dibuka pada viewport selebar ponsel
- **Then** panel menempati layar penuh (`UI-13`)
- **And** tidak ada elemen yang terpotong atau menyebabkan scroll horizontal

---

### `UI-11` — Aksesibilitas

| Meta | Nilai |
|---|---|
| Sumber | S1 p.99 (prinsip **Keadilan**: "AI harus memperlakukan semua pengguna secara adil—tanpa memandang gender, ras, atau latar belakang") — diterapkan pada keterjangkauan antarmuka; mitigasi Enter pada textarea dari `docs/RISET-DESAIN.md` §7 + `design.md` D-21a; pemilih berkas dari D-24 |
| Berkas | `public/index.html`, `public/style.css`, `public/script.js` |
| Uji | UJI-13, UJI-16, UJI-18 |

> **Catatan keterlacakan.** Materi pelatihan **tidak membahas aksesibilitas web**.
> Requirement ini adalah penerapan prinsip Keadilan (S1 p.99) ke ranah antarmuka, plus
> argumen praktis: target pengguna Cek Dulu mencakup orang lanjut usia dan berliterasi
> rendah (`docs/USE-CASE-CEKDULU.md` §2). Antarmuka yang tidak terjangkau mereka membuat
> use case gagal di premisnya sendiri. Ditandai sebagai keputusan sadar, bukan klaim materi.
> Alasan lengkap: `design.md` D-13.

Antarmuka WAJIB memenuhi:

**Pengumuman jawaban bot ke screen reader**
- `#chat-box` memiliki `aria-live="polite"` sehingga pesan baru diumumkan tanpa memotong
  bacaan yang sedang berlangsung
- `#chat-box` memiliki `aria-busy="true"` selama menunggu respons, dikembalikan ke `false`
  setelah jawaban tiba

**Label dan peran**
- `#user-input` memiliki `<label>` terkait, atau `aria-label` bila label visual tidak
  dikehendaki
- Tombol submit memiliki teks yang jelas, bukan hanya ikon
- Setiap tombol yang hanya berisi simbol (tutup panel, tutup blok saran) memiliki nama yang
  dapat diakses berupa teks
- Setiap bubble pesan memiliki penanda pengirim yang terbaca screen reader (bukan hanya
  dibedakan warna atau posisi)

**Pemilih berkas** (`UI-16`)
- Pemilih berkas WAJIB berupa `<input type="file">` dengan `<label>` terkait, bukan `<div>`
  dengan penangan klik — kontrol bawaan sudah dapat dioperasikan keyboard dan diumumkan
  screen reader
- Nama berkas yang terpilih WAJIB diumumkan ke screen reader
- Tombol hapus lampiran WAJIB terjangkau Tab dan berada di dalam focus trap panel
- Pratinjau gambar WAJIB memakai `alt=""` karena dekoratif; informasinya sudah disampaikan
  nama berkas

**Pengumuman perilaku papan tuts pada kolom pesan**
- `#user-input` adalah `<textarea>` (`UI-01`), sehingga screen reader mengumumkannya sebagai
  kolom multi-baris dan pengguna berharap `Enter` menyisipkan baris
- Karena `Enter` justru mengirim, `#user-input` WAJIB memiliki `aria-describedby` yang menunjuk
  teks petunjuk yang menyebut `Enter` mengirim dan `Shift` dengan `Enter` membuat baris baru
- Tombol Kirim WAJIB tetap ada dan dapat difokuskan — teknik WCAG H32 meminta tombol submit
  eksplisit, bukan hanya submit implisit lewat `Enter`
- Pengiriman DILARANG dipicu dari peristiwa `input`; hanya dari `keydown` dengan `Enter` tanpa
  `shiftKey`, agar WCAG 3.2.2 On Input tidak dilanggar

**Fokus keyboard**
- Setelah pesan terkirim, fokus kembali ke `#user-input` agar pengguna keyboard dapat
  langsung mengetik lagi
- Seluruh elemen interaktif dapat dijangkau dengan Tab dalam urutan logis
- Indikator fokus terlihat jelas — `outline` **tidak boleh** dihapus tanpa pengganti yang
  setara

**Kontras dan keterbacaan**
- Kontras teks terhadap latar minimal **4,5:1** untuk teks normal (WCAG 2.1 AA)
- Ukuran font dasar minimal `16px`; teks dapat diperbesar sampai 200% tanpa kehilangan isi
- Informasi tidak disampaikan **hanya** lewat warna

**Preferensi pengguna**
- `@media (prefers-reduced-motion: reduce)` menonaktifkan animasi dan transisi
- Halaman memiliki `<html lang="id">`

**Pola dialog untuk panel** (`UI-13`, `design.md` D-18)
- Panel memakai `role="dialog"` dengan `aria-labelledby` menunjuk judul panel
- Launcher memakai `aria-expanded` yang berubah sesuai keadaan panel, dan `aria-controls`
  menunjuk id panel
- Saat panel dibuka, fokus berpindah ke dalam panel
- Selama panel terbuka, Tab dan Shift+Tab **bersiklus di dalam panel** — fokus tidak lolos
  ke latar
- **Escape menutup panel**
- Saat panel ditutup, fokus **kembali ke launcher**
- Tombol tutup memiliki nama yang dapat diakses, bukan hanya simbol

Keempat butir terakhir diambil dari empat kegagalan tersering pada implementasi dialog yang
dirangkum ExceedAbility: latar masih terjangkau Tab, Escape tidak berfungsi, fokus tidak
kembali ke pemicu, dan dialog tanpa nama yang dapat diakses. Sitasi: `docs/RISET-DESAIN.md` §2.

#### Scenario: screen reader mengumumkan jawaban bot
- **Given** pengguna memakai screen reader
- **When** bot mengirim jawaban
- **Then** isi jawaban diumumkan karena `#chat-box` bersifat `aria-live="polite"`
- **And** pengumuman tidak memotong bacaan yang sedang berlangsung

#### Scenario: navigasi penuh dengan keyboard
- **Given** pengguna hanya memakai keyboard
- **When** pengguna menekan Tab dari awal halaman
- **Then** seluruh elemen interaktif terjangkau dalam urutan logis
- **And** indikator fokus terlihat pada setiap elemen

#### Scenario: fokus terkurung di dalam panel
- **Given** panel dialog terbuka
- **When** pengguna menekan Tab berulang sampai melewati elemen terakhir di panel
- **Then** fokus kembali ke elemen pertama di dalam panel
- **And** fokus tidak berpindah ke elemen di badan halaman

#### Scenario: Escape menutup panel
- **Given** panel dialog terbuka
- **When** pengguna menekan Escape
- **Then** panel tertutup
- **And** fokus kembali ke launcher

#### Scenario: fokus kembali setelah kirim
- **When** pengguna mengirim pesan dengan menekan Enter
- **Then** setelah proses selesai, fokus berada di `#user-input`
- **And** pengguna dapat langsung mengetik pesan berikutnya tanpa menyentuh mouse

#### Scenario: pengguna menonaktifkan animasi
- **Given** sistem operasi pengguna menyetel `prefers-reduced-motion: reduce`
- **When** halaman dimuat, panel dibuka, dan pesan dikirim
- **Then** tidak ada animasi atau transisi yang berjalan
- **And** tiga titik indikator tetap terlihat statis
- **And** seluruh fungsi tetap bekerja

#### Scenario: pembesaran teks
- **When** pengguna memperbesar halaman sampai 200%
- **Then** seluruh teks tetap terbaca
- **And** tidak ada isi yang hilang atau tertimpa
- **And** nota disclaimer di bawah komposer tetap terbaca meski memakai `--teks-nano`

#### Scenario: petunjuk papan tuts terjangkau screen reader
- **Given** panel dialog terbuka
- **When** screen reader membacakan kolom pesan
- **Then** deskripsi yang menyebut perilaku `Enter` dan `Shift` dengan `Enter` ikut dibacakan

#### Scenario: tombol simbol punya nama yang dapat diakses
- **When** screen reader membacakan tombol tutup panel dan tombol tutup blok saran
- **Then** keduanya membacakan teks yang menjelaskan aksinya, bukan simbol

#### Scenario: pemilih berkas diumumkan screen reader
- **When** screen reader membacakan pemilih berkas
- **Then** ada label yang menjelaskan fungsinya
- **And** setelah berkas dipilih, nama berkas diumumkan

---

### `UI-12` — Design token dan arah visual

| Meta | Nilai |
|---|---|
| Sumber | S3 p.34 (`style.css` mengatur tampilan UI); `docs/USE-CASE-CEKDULU.md` §1 (persona); palet dari `docs/RISET-DESAIN.md` §3–4; ukuran teks nota diamandemen `design.md` D-21c |
| Berkas | `public/style.css` |
| Terkait | `UI-08`, `UI-10`, `UI-11`, `UI-13`, `UI-14` |

Seluruh nilai visual WAJIB didefinisikan sebagai CSS custom properties dalam satu blok
`:root`, mencakup: palet warna, skala tipografi, skala spacing, radius, durasi transisi, dan
ukuran struktural launcher serta panel.

Aturan turunan:
- Selector di bawah `:root` **wajib** merujuk token, tidak menulis nilai literal berulang
- Skala tipografi memakai kelipatan yang konsisten, bukan angka acak per elemen
- Skala spacing memakai satu satuan dasar dengan kelipatan tetap

**Ukuran terkecil pada skala tipografi** adalah token `--teks-nano` (`0.75rem`), dipakai
khusus untuk nota disclaimer di bawah komposer agar muat satu baris pada lebar panel 380px.

WCAG tidak menetapkan ukuran font minimum absolut; yang diwajibkan adalah kontras (1.4.3) dan
kemampuan diperbesar 200% tanpa kehilangan isi (1.4.4). Karena itu setiap penurunan ukuran
teks WAJIB disertai pengujian ulang kedua syarat tersebut, dan hasilnya dicatat di
`docs/QA-REPORT.md`. Warna teks nota tidak berubah, sehingga rasio kontras yang sudah terukur
tetap berlaku.

**Arah visual yang ditetapkan: restrained, kontras tinggi, tipografi tenang, dengan light
mode.**

Alasan: pengguna Cek Dulu sedang dalam kondisi cemas — baru menerima tawaran yang mungkin
menipu, atau sudah kehilangan uang. Antarmuka yang ramai atau eksperimental menurunkan
kredibilitas tepat saat kredibilitas paling dibutuhkan.

Light mode dipilih karena target pengguna mencakup orang lanjut usia dan berliterasi rendah.
Kajian literatur sistematis 2025 menemukan light mode lebih baik untuk keterbacaan, dan
jurnal Ergonomics 2025 menyatakan light mode sejalan dengan anjuran mengurangi hambatan
visual terkait usia. Justifikasi lengkap: `design.md` D-12, sitasi `docs/RISET-DESAIN.md` §3.

**Palet yang ditetapkan** — delapan token warna, satu aksen:

| Peran | Nilai | Dasar |
|---|---|---|
| Latar halaman | `#F4F6F9` | Netral sejuk, bukan putih menyilaukan |
| Permukaan panel | `#FFFFFF` | Kejelasan maksimal untuk area baca |
| Bubble bot | `#EEF2F7` | Terpisah dari permukaan tanpa mencolok |
| Bubble pengguna | `#0E4A6E` | Navy — asosiasi kepercayaan lembaga keuangan Indonesia |
| Teks | `#111F2E` | Navy nyaris hitam, lebih lembut daripada hitam murni |
| Teks lembut | `#4A5A6D` | Hierarki sekunder |
| Aksen | `#0E7C6B` | Deep teal — trust biru digabung growth hijau |
| Fokus | `#0B63CE` | Biru terang untuk indikator fokus keyboard |

Kontras seluruh pasangan WAJIB memenuhi WCAG 2.1 AA minimal 4,5:1. Hasil pengukuran tercatat
di `docs/RISET-DESAIN.md` §4 — sepuluh pasangan lulus AA, enam di antaranya lulus AAA, dengan
rasio terendah 5,10:1.

Konsekuensi yang DILARANG:
- Arah brutalist, maximalist, retro-futuristic, atau eksperimen tipografi berat
- Ungu sebagai warna utama — diasosiasikan kreativitas dan feminitas, bukan otoritas, dan
  sudah padat dipakai fintech
- Merah, kuning, atau oranye sebagai warna utama — memicu kecemasan soal uang, mengurangi
  keseriusan, atau kurang berwibawa
- Warna dekoratif yang tidak membawa makna
- Animasi yang tidak memiliki fungsi informatif
- Framework CSS via CDN atau dependency baru — materi menetapkan Vanilla (S3 p.34)

#### Scenario: token terpusat
- **When** `style.css` diperiksa
- **Then** terdapat satu blok `:root` yang memuat token warna, tipografi, spacing, radius,
  durasi, dan ukuran launcher serta panel
- **And** tidak ada nilai warna literal yang ditulis berulang di luar blok tersebut

#### Scenario: mengubah tema di satu tempat
- **Given** pengembang ingin mengubah warna aksen
- **When** satu token warna di `:root` diubah
- **Then** seluruh elemen yang memakai aksen tersebut berubah konsisten

#### Scenario: skala konsisten
- **When** ukuran font dan spacing di seluruh berkas diperiksa
- **Then** setiap nilai berasal dari token, bukan angka yang dipilih ad hoc per elemen

#### Scenario: kontras memenuhi WCAG AA
- **When** seluruh pasangan warna latar dan teks diukur
- **Then** setiap rasio minimal 4,5:1

---

### `UI-13` — Launcher dan panel dialog

| Meta | Nilai |
|---|---|
| Sumber | `docs/RISET-DESAIN.md` §1–2 (survei Clutch, praktik messengerbot.app, pola dialog W3C ARIA APG) |
| Berkas | `public/index.html`, `public/style.css`, `public/script.js` |
| Uji | UJI-14 |

> **Catatan keterlacakan.** Materi pelatihan **tidak membahas pola widget chat**. Requirement
> ini lahir dari kritik pengguna terhadap desain awal yang terbaca sebagai formulir, lalu
> diverifikasi terhadap literatur. Ditandai sebagai keputusan sadar berbasis riset, bukan klaim
> materi. Alasan lengkap: `design.md` D-18.

**Launcher**

- WAJIB berada di **sudut kanan bawah** viewport dengan posisi `fixed`. Survei Clutch mencatat
  89% widget chat memakai posisi ini; posisi lain menurunkan engagement 25–40%.
- WAJIB memuat **ikon dan label teks**, bukan ikon saja. messengerbot.app menyatakan ikon
  gelembung bawaan jarang cukup untuk mengomunikasikan peran.
- WAJIB berupa elemen `<button>` dengan `aria-expanded` dan `aria-controls`.
- DILARANG memuat badge notifikasi. messengerbot.app melarang badge sebagai urgensi buatan
  ketika tidak ada pesan nyata yang menunggu.
- Target sentuh minimal **44×44px** agar mudah dijangkau di ponsel.

**Panel**

- WAJIB **tertutup** saat halaman pertama dimuat. Clutch mencatat 55% konsumen meninggalkan
  alat AI yang mengganggu penjelajahan. Panel dibuka hanya atas tindakan pengguna.
- WAJIB memakai `role="dialog"` dengan `aria-modal="false"` dan `aria-labelledby` menunjuk
  judul panel.
- Bersifat **non-modal**: konten latar TIDAK dibuat inert, agar disclaimer (`UI-08`) dan kanal
  resmi (`UI-09`) tetap terjangkau screen reader saat panel terbuka.
- WAJIB memuat tiga bagian: **header** (avatar, nama bot, status, tombol tutup), **aliran
  chat** (`#chat-box`), dan **komposer** (`#chat-form`).
- Ukuran pada desktop: lebar sekitar **380px**, tinggi sekitar **560px**, muncul di atas
  launcher.
- Pada layar sempit: menempati **layar penuh** agar area baca maksimal.
- Perilaku keyboard dan fokus mengikuti `UI-11` bagian pola dialog.

#### Scenario: panel tertutup saat halaman dimuat
- **When** pengguna membuka `http://localhost:3000/`
- **Then** panel tidak terlihat
- **And** launcher terlihat di sudut kanan bawah
- **And** `aria-expanded` pada launcher bernilai `false`

#### Scenario: launcher membuka panel
- **When** pengguna mengklik launcher
- **Then** panel terlihat
- **And** `aria-expanded` bernilai `true`
- **And** fokus berpindah ke dalam panel

#### Scenario: tombol tutup menutup panel
- **Given** panel terbuka
- **When** pengguna mengklik tombol tutup
- **Then** panel tidak terlihat
- **And** `aria-expanded` bernilai `false`
- **And** fokus kembali ke launcher

#### Scenario: launcher memuat label teks
- **When** launcher diperiksa
- **Then** launcher memuat teks yang menyebut nama bot, bukan hanya ikon

#### Scenario: tidak ada badge notifikasi
- **When** halaman dimuat
- **Then** tidak ada penanda jumlah pesan belum dibaca pada launcher

#### Scenario: panel layar penuh di ponsel
- **When** panel dibuka pada viewport selebar ponsel
- **Then** panel menempati hampir seluruh layar
- **And** tidak ada scroll horizontal pada dokumen

#### Scenario: riwayat bertahan saat panel ditutup lalu dibuka
- **Given** pengguna sudah berbalas pesan lalu menutup panel
- **When** pengguna membuka panel kembali
- **Then** riwayat percakapan masih terlihat
- **And** riwayat yang dikirim ke server tetap utuh (`UI-04`)

---

### `UI-14` — Struktur landing page

| Meta | Nilai |
|---|---|
| Sumber | `docs/RISET-DESAIN.md` §6 (urutan konvergen involve.me, Replo, Landy AI, Genesys Growth, Neel Networks; larangan testimoni dari WiserNotify, ProveSource, Nudgify) |
| Berkas | `public/index.html`, `public/style.css` |
| Uji | UJI-15 |
| Terkait | `UI-08`, `UI-09`, `UI-13` |

> **Catatan keterlacakan.** Materi pelatihan **tidak membahas struktur landing page**.
> Requirement ini lahir dari riset di luar materi. Brief S3 p.49 meminta use case dan
> konfigurasi "sesuai dengan kreativitas masing-masing" — struktur halaman tidak dikunci
> materi. Ditandai sebagai keputusan sadar berbasis riset, bukan klaim materi. Alasan
> lengkap: `design.md` D-20.

Badan halaman WAJIB disusun sebagai landing page dengan **sembilan section** dalam urutan
berikut:

| # | Section | Isi wajib |
|---|---|---|
| 1 | Header | Nama produk, navigasi anchor, satu tombol CTA |
| 2 | Hero | `<h1>`, subheadline, satu CTA utama, visual pendukung |
| 3 | Data & Sumber | Tiga angka lembaga resmi beserta sitasinya |
| 4 | Cara Kerja | Tiga langkah pemakaian |
| 5 | Yang Bisa Dibantu | Empat kemampuan dari `USE-CASE-CEKDULU.md` §3.1 |
| 6 | Batasan | Delapan larangan dari `USE-CASE-CEKDULU.md` §3.2 |
| 7 | Kanal Resmi | Empat kanal OJK (`UI-09`) |
| 8 | FAQ | Lima pertanyaan |
| 9 | Footer | Disclaimer (`UI-08`), tautan dokumen, atribusi |

**Hero**

- `<h1>` WAJIB **di bawah 8 kata**. Genesys Growth mencatat H1 berperforma tinggi berada di
  bawah 8 kata atau 44 karakter.
- WAJIB memuat subheadline yang memperluas janji headline.
- Hero WAJIB terbaca tanpa menggulir pada viewport desktop biasa. Neel Networks memberi hero
  sekitar 5 detik untuk mengomunikasikan nilai.
- Pada ponsel, urutan WAJIB: headline, subheadline, CTA, lalu visual — 60% lebih trafik
  berasal dari ponsel (Landy AI).

**CTA**

- Halaman WAJIB memiliki **satu aksi utama saja**: membuka panel percakapan (`UI-13`).
  Genesys Growth menyatakan satu CTA utama per halaman, tanpa pengecualian.
- Seluruh tombol CTA di halaman WAJIB menunjuk aksi yang sama. Jumlah tombol boleh lebih dari
  satu, tetapi aksinya tunggal.

**Data & Sumber — pengganti Social Proof**

- Section ini WAJIB memuat angka dari `docs/RISET-LAPANGAN.md` beserta nama lembaga dan
  periode datanya.
- Setiap angka WAJIB dapat ditelusuri ke sumber resmi. Tanpa sitasi, angka DILARANG tampil.
- DILARANG memuat testimoni pengguna, logo mitra, star rating, jumlah ulasan, jumlah pengguna,
  jumlah unduhan, atau tingkat kepuasan. Aplikasi ini belum memiliki pengguna; angka apa pun
  di kategori tersebut berarti mengarang. Ini aturan yang sama seperti `PG-04` bagi bot,
  diberlakukan pada halaman.

**Batasan**

- Delapan larangan WAJIB tampil terbuka, tidak disembunyikan di balik interaksi.
- Dasarnya prinsip Transparansi (S1 p.99): pengguna perlu tahu batas alat **sebelum** bertanya.

**FAQ**

- WAJIB memakai elemen `<details>` dan `<summary>` bawaan HTML. Keduanya sudah dapat dioperasikan
  keyboard dan diumumkan screen reader tanpa JavaScript maupun ARIA tambahan (`UI-11`).

**Navigasi**

- Setiap tautan anchor di header WAJIB menuju section yang ada pada halaman.
- Section yang dirujuk WAJIB memiliki `id` yang cocok.

#### Scenario: sembilan section hadir dalam urutan yang ditetapkan
- **When** pengguna membuka `http://localhost:3000/`
- **Then** kesembilan section ada di DOM
- **And** urutannya sesuai tabel di atas

#### Scenario: headline memenuhi batas panjang
- **When** `<h1>` diperiksa
- **Then** jumlah katanya di bawah 8

#### Scenario: hero terbaca tanpa menggulir
- **When** halaman dibuka pada viewport desktop biasa
- **Then** headline, subheadline, dan CTA utama terlihat tanpa menggulir

#### Scenario: seluruh CTA menunjuk aksi yang sama
- **When** setiap tombol CTA diklik
- **Then** panel percakapan terbuka
- **And** tidak ada aksi utama lain yang bersaing

#### Scenario: angka pada Data & Sumber punya sitasi
- **When** section Data & Sumber diperiksa
- **Then** setiap angka disertai nama lembaga dan periode data
- **And** sumbernya dapat ditelusuri

#### Scenario: tidak ada social proof yang dikarang
- **When** halaman diperiksa dari header sampai footer
- **Then** tidak ada testimoni, logo mitra, star rating, jumlah ulasan, jumlah pengguna,
  jumlah unduhan, maupun tingkat kepuasan

#### Scenario: delapan batasan tampil terbuka
- **When** section Batasan diperiksa
- **Then** kedelapan larangan terbaca tanpa interaksi tambahan

#### Scenario: FAQ dapat dioperasikan keyboard
- **When** pengguna memberi fokus pada `<summary>` lalu menekan Enter
- **Then** jawaban terbuka
- **And** tidak ada atribut ARIA tambahan yang dibutuhkan

#### Scenario: tautan navigasi menuju section yang ada
- **When** setiap tautan anchor di header diklik
- **Then** halaman menggulir ke section dengan `id` yang cocok

#### Scenario: landing page tidak mengganggu panel
- **Given** panel percakapan terbuka
- **When** pengguna menggulir halaman
- **Then** panel tetap pada posisinya
- **And** tidak ada scroll horizontal pada dokumen

---

### `UI-15` — Blok contoh pertanyaan dapat ditutup

| Meta | Nilai |
|---|---|
| Sumber | `docs/RISET-DESAIN.md` §8 (blok saran menempati 16% tinggi panel; 55% konsumen meninggalkan alat AI yang mengganggu) + `design.md` D-21b |
| Berkas | `public/index.html`, `public/style.css`, `public/script.js` |
| Uji | UJI-16 |
| Terkait | `UI-11`, `UI-13` |

> **Catatan keterlacakan.** Materi menampilkan quick-reply chips pada contoh batch sebelumnya
> (S2 p.67) tetapi tidak membahas kemampuan menutupnya. Requirement ini lahir dari kebutuhan
> ruang baca di dalam panel dan ditandai sebagai keputusan berbasis riset, bukan klaim materi.
> Alasan lengkap: `design.md` D-21b.

Blok "Contoh pertanyaan" WAJIB dapat ditutup pengguna.

**Tombol tutup**

- WAJIB berupa elemen `<button type="button">` pada baris judul blok.
- WAJIB memiliki nama yang dapat diakses, bukan hanya simbol `×`.
- WAJIB memakai `aria-expanded` dan `aria-controls` yang menunjuk blok saran — pola yang sama
  dengan launcher (`UI-13`) agar konsisten.
- Target sentuh minimal **24×24px**.

**Perilaku**

- Blok WAJIB **terlihat** saat panel pertama dibuka. Blok membantu pengguna yang belum tahu
  harus bertanya apa.
- Saat ditutup, blok WAJIB disembunyikan dengan atribut `hidden`. **DILARANG menghapusnya dari
  DOM** — menghapus elemen yang sedang memegang fokus membuat fokus melompat ke `body` dan
  pengguna keyboard kehilangan posisi.
- Saat ditutup, fokus WAJIB dipindahkan eksplisit ke kolom pesan.
- Saat ditutup, area percakapan (`#chat-box`) WAJIB bertambah tinggi.
- Chip yang tersembunyi WAJIB keluar dari urutan Tab.
- DILARANG menutup blok secara otomatis, termasuk setelah pesan pertama terkirim. Kendali ada
  pada pengguna.
- DILARANG menyimpan keadaan tertutup ke `localStorage`. Penyimpanan lokal termasuk yang
  ditolak pada kapabilitas ini.

#### Scenario: blok saran terlihat saat panel dibuka
- **When** pengguna membuka panel percakapan
- **Then** blok contoh pertanyaan terlihat
- **And** `aria-expanded` pada tombol tutup bernilai `true`

#### Scenario: tombol tutup menyembunyikan blok saran
- **Given** panel dialog terbuka
- **When** pengguna mengklik tombol tutup pada blok contoh pertanyaan
- **Then** blok tidak terlihat
- **And** blok memiliki atribut `hidden`
- **And** blok tetap ada di DOM
- **And** `aria-expanded` bernilai `false`

#### Scenario: area percakapan bertambah tinggi
- **Given** tinggi area percakapan sudah diukur saat blok saran terlihat
- **When** blok saran ditutup
- **Then** tinggi `#chat-box` bertambah

#### Scenario: fokus berpindah ke kolom pesan
- **Given** fokus berada pada tombol tutup blok saran
- **When** pengguna mengaktifkan tombol tersebut
- **Then** fokus berpindah ke `#user-input`
- **And** fokus TIDAK melompat ke `body`

#### Scenario: chip tersembunyi keluar dari urutan Tab
- **Given** blok saran sudah ditutup
- **When** pengguna menekan Tab berulang di dalam panel
- **Then** tidak ada chip yang menerima fokus
- **And** fokus tetap terkurung di dalam panel (`UI-11`)

#### Scenario: blok saran tidak menutup sendiri
- **Given** blok saran terlihat
- **When** pengguna mengirim satu pesan
- **Then** blok saran tetap terlihat

#### Scenario: tombol tutup punya nama yang dapat diakses
- **When** screen reader membacakan tombol tutup blok saran
- **Then** yang dibacakan adalah teks yang menjelaskan aksinya, bukan simbol

---

### `UI-16` — Tombol lampiran berkas

| Meta | Nilai |
|---|---|
| Sumber | S2 p.45 dan p.49 (jenis berkas yang diuji materi); `design.md` D-24 |
| Berkas | `public/index.html`, `public/style.css`, `public/script.js` |
| Uji | UJI-18, UJI-19, UJI-20, UJI-21 |
| Terkait | `UI-01`, `UI-03`, `UI-04`, `UI-11`, `UI-17`, `API-07` |

> **Catatan keterlacakan.** Materi menguji berkas lewat Postman (S2 p.45, p.49), bukan lewat
> antarmuka. Bentuk tombol lampiran pada panel percakapan adalah keputusan sendiri. Ditandai
> sebagai keputusan sadar, bukan klaim materi. Alasan: `design.md` D-24.

Komposer WAJIB menyediakan cara melampirkan satu berkas.

**Pemilih berkas**

- WAJIB berupa `<input type="file">` dengan `<label>` terkait, bukan `<div>` dengan penangan
  klik. Kontrol bawaan sudah dapat dioperasikan keyboard dan diumumkan screen reader.
- WAJIB memakai atribut `accept` yang selaras dengan allowlist `API-08`.
- Hanya **satu** berkas per pesan. Atribut `multiple` DILARANG.

**Pratinjau lampiran**

- Setelah berkas dipilih, WAJIB tampil pratinjau berisi nama berkas dan tombol hapus.
- Nama berkas WAJIB dirender dengan `textContent`. Nama berkas berasal dari luar aplikasi,
  sehingga merender dengan `innerHTML` membuka XSS — larangan yang sama dengan D-07.
- Bila berkas berupa gambar, pratinjau SEBAIKNYA menampilkan gambarnya. Elemen `<img>` WAJIB
  dibuat dengan `createElement`, bukan string HTML.
- Bila `URL.createObjectURL` dipakai, `URL.revokeObjectURL` WAJIB dipanggil saat lampiran
  dihapus atau diganti, agar tidak menahan memori.

**Tombol hapus lampiran**

- WAJIB berupa `<button type="button">` dengan nama yang dapat diakses berupa teks.
- Saat diaktifkan, lampiran dilepas, pratinjau dihilangkan, dan nilai `<input type="file">`
  dikosongkan agar berkas yang sama dapat dipilih ulang.

**Perilaku pengiriman**

- Bila ada lampiran, pengiriman diarahkan ke `/api/chat-with-file` (`UI-03`).
- Kolom pesan boleh kosong ketika ada lampiran. Ini pengecualian dari perilaku
  `handleSubmit` yang berhenti bila kolom kosong — tanpa pengecualian ini, mengirim berkas
  tanpa teks akan gagal diam-diam.
- Bila kolom pesan kosong, sistem WAJIB memakai prompt bawaan, mengikuti pola `prompt ?? "..."`
  pada S2 p.47.
- Setelah pesan terkirim, lampiran WAJIB dilepas agar tidak terkirim ulang pada pesan
  berikutnya.
- Bubble pengguna WAJIB menampilkan penanda bahwa ada berkas dilampirkan, sehingga riwayat
  percakapan tetap dapat dibaca.

**Aksesibilitas** (`UI-11`)

- Nama berkas terpilih WAJIB diumumkan ke screen reader.
- Tombol hapus WAJIB terjangkau Tab dan berada di dalam focus trap panel.
- Pratinjau gambar WAJIB memakai `alt=""` karena bersifat dekoratif — informasinya sudah
  disampaikan nama berkas.

#### Scenario: berkas dipilih dan pratinjau tampil
- **Given** panel dialog terbuka
- **When** pengguna memilih sebuah berkas gambar
- **Then** pratinjau tampil berisi nama berkas
- **And** nama berkas dirender sebagai teks, bukan HTML

#### Scenario: lampiran dapat dihapus
- **Given** sebuah berkas sudah dipilih
- **When** pengguna mengaktifkan tombol hapus
- **Then** pratinjau hilang
- **And** nilai `input type="file"` kosong sehingga berkas yang sama dapat dipilih ulang

#### Scenario: kirim berkas tanpa teks
- **Given** sebuah berkas sudah dipilih dan kolom pesan kosong
- **When** pengguna menekan kirim
- **Then** permintaan tetap terkirim
- **And** prompt bawaan dipakai

#### Scenario: lampiran dilepas setelah terkirim
- **Given** pesan dengan lampiran sudah terkirim
- **When** pengguna mengirim pesan berikutnya tanpa memilih berkas
- **Then** permintaan diarahkan ke `/api/chat`, bukan `/api/chat-with-file`

#### Scenario: hanya satu berkas per pesan
- **When** `input type="file"` diperiksa
- **Then** atribut `multiple` tidak ada

#### Scenario: pemilih berkas terjangkau keyboard
- **When** pengguna menekan Tab di dalam panel
- **Then** pemilih berkas menerima fokus
- **And** tombol hapus juga menerima fokus ketika lampiran ada
- **And** fokus tetap terkurung di dalam panel

---

### `UI-17` — Nota privasi lampiran

| Meta | Nilai |
|---|---|
| Sumber | S1 p.99 (prinsip Privasi dan Transparansi); `design.md` D-24f |
| Berkas | `public/index.html`, `public/style.css` |
| Uji | UJI-19 |
| Terkait | `PG-07`, `PG-10`, `UI-08`, `UI-16` |

Antarmuka WAJIB memuat nota statis di dekat tombol lampiran yang menyatakan:

1. Berkas **dikirim untuk dianalisis**, bukan disimpan
2. Anjuran menutup bagian yang memuat data pribadi lebih dahulu
3. Batas ukuran berkas dan jenis yang diterima

Nota WAJIB **statis di HTML**, tidak digenerate model — alasan yang sama dengan `UI-09`.

Nota ini adalah lapis perlindungan yang **tidak bergantung pada model**. `PG-10` melarang bot
membacakan data pribadi, tetapi larangan itu probabilistik; nota ini bekerja sebelum berkas
terkirim, sehingga tetap berfungsi meski model gagal menuruti instruksinya.

Alasan keberadaannya: sebelum fitur lampiran, pengguna menempelkan teks yang ia pilih sendiri.
Dengan lampiran, ia mengunggah tangkapan layar penuh yang hampir selalu memuat nomor telepon
dan nama kontak. Itu perubahan sifat, bukan sekadar penambahan fitur (`design.md` D-24f).

#### Scenario: nota terlihat tanpa interaksi
- **Given** panel dialog terbuka
- **When** pengguna melihat komposer
- **Then** nota privasi lampiran terbaca tanpa mengklik apa pun

#### Scenario: nota menyebut tiga hal wajib
- **When** nota diperiksa
- **Then** nota menyebut bahwa berkas dikirim untuk dianalisis
- **And** nota menganjurkan menutup data pribadi lebih dahulu
- **And** nota menyebut batas ukuran dan jenis berkas yang diterima

---

## Yang TIDAK dibuat di frontend

| Tidak dibuat | Alasan |
|---|---|
| Rendering Markdown dari respons bot | Butuh dependency (`marked`/`DOMPurify`) — di luar batasan materi. Respons ditampilkan sebagai teks biasa via `textContent`, yang sekaligus mencegah XSS. Bot dilarang memakai penanda Markdown (`PG-08`, D-17) |
| Penyimpanan riwayat ke `localStorage` | Tidak ada di materi; menyimpan percakapan bertema keuangan di browser menambah risiko privasi tanpa manfaat yang diminta |
| Upload file / gambar | Milik proyek Sesi 2; dependency `multer` tidak ada di Sesi 3 |
| Streaming karakter per karakter | Materi memakai `generateContent()`, bukan `generateContentStream()` |
| Framework atau build step | Materi eksplisit Vanilla JS tanpa bundler |
| Framework CSS via CDN (Tailwind, Bootstrap) | Sama dengan di atas. Design token `UI-12` sudah memberi konsistensi yang dibutuhkan |
| Dark mode toggle | Muncul di contoh batch sebelumnya (S2 p.67) tetapi menambah dua set token dan permukaan uji tanpa melayani requirement mana pun. Keterbatasan diakui di `docs/RISET-DESAIN.md` §5 |
| Carousel dan kartu produk | Clutch menyebutnya sebagai elemen antarmuka chatbot, tetapi Cek Dulu tidak memiliki produk untuk ditampilkan (D-19) |
| Badge notifikasi pada launcher | messengerbot.app melarang badge sebagai urgensi buatan ketika tidak ada pesan nyata (D-18) |
| Sapaan proaktif yang membuka panel otomatis | Clutch mencatat 55% konsumen meninggalkan alat AI yang mengganggu penjelajahan (D-18) |
| Penyimpanan keadaan blok saran ke `localStorage` | Penyimpanan lokal ditolak pada kapabilitas ini; menyimpan jejak pemakaian alat bertema keuangan menambah risiko privasi tanpa requirement yang memintanya (D-21b) |
| Menutup blok saran secara otomatis | Merampas kendali pengguna yang justru ingin memakai saran kedua dan ketiga (D-21b) |
| `<div contenteditable>` sebagai kolom pesan | Membatalkan validasi `required` bawaan browser dan menuntut penanganan tempel yang bisa memasukkan HTML — bertabrakan dengan D-07 (D-21a) |
| Pustaka auto-resize textarea | Menambah dependency di luar empat paket materi untuk persoalan yang selesai dengan satu properti CSS dan ±5 baris JavaScript (D-21a) |
| Enter selalu menyisipkan baris, kirim hanya lewat tombol | Paling aman secara aksesibilitas tetapi bertentangan dengan kebiasaan WhatsApp, Telegram, dan Slack yang menjadi rujukan pengguna sasaran (D-21a) |
| Avatar berupa berkas gambar atau emoji robot | Berkas gambar menambah permintaan jaringan; emoji robot menggeser nada menjadi ceria, tidak sesuai konteks pengguna yang cemas (D-19) |
| Testimoni pengguna | Aplikasi belum memiliki pengguna. WiserNotify: "one honest, detailed review beats ten polished fakes". Mengarang testimoni melanggar nilai proyek yang melarang bot mengarang (`PG-04`) — D-20 |
| Logo "dipercaya oleh" atau logo mitra | Tidak ada mitra; memalsukan afiliasi (D-20) |
| Star rating dan jumlah ulasan | Tidak ada ulasan (D-20) |
| Logo Hacktiv8 maupun OJK di halaman | Merek pihak lain, berpotensi terbaca sebagai klaim afiliasi resmi. `NOTICE.md` menyatakan repositori tidak meredistribusi aset penyelenggara (D-20) |
| Angka pengguna, unduhan, atau tingkat kepuasan | Tidak ada datanya. Aturan yang sama seperti yang diberlakukan pada bot: tidak mengarang angka (D-20) |
| Hero berupa video | Landy AI mencatat 53% pengguna meninggalkan situs lambat; video menambah bobot muat tanpa manfaat sebanding (D-20) |
| Dua atau lebih CTA utama yang bersaing | Genesys Growth: satu CTA utama per halaman, tanpa pengecualian (D-20) |
| Akordeon FAQ tulisan sendiri | `<details>`/`<summary>` bawaan HTML sudah aksesibel keyboard dan screen reader tanpa JavaScript; menulis sendiri menambah risiko kesalahan aksesibilitas untuk hasil sama (D-20) |
| Lampiran lebih dari satu berkas per pesan | Materi memakai `upload.single()` (S2 p.43, p.47), bukan `upload.array()`. Satu berkas per pesan cukup untuk use case menganalisis satu tangkapan layar (D-24) |
| Lampiran audio | Ditolak — alasan di `design.md` D-24b dan `proposal.md` §3 |
| Menyimpan base64 lampiran ke riwayat percakapan | Membuat gambar dikirim ulang setiap turn dan menghabiskan kuota (D-24c, `UI-04`) |
| Sensor otomatis data pribadi pada gambar sebelum dikirim | Menuntut pustaka visi komputer, jauh di luar batasan dependency materi. Yang dipakai nota privasi (`UI-17`) dan larangan `PG-10` |
| Kompresi gambar di sisi klien sebelum unggah | Menambah kerumitan tanpa requirement yang memintanya. Batas 4 MB (`API-08`) sudah cukup untuk tangkapan layar ponsel |
