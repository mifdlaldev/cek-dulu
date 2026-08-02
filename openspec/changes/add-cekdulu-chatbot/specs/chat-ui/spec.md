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

---

## ADDED Requirements

### `UI-01` — Struktur HTML dasar

| Meta | Nilai |
|---|---|
| Sumber | S3 p.37 (struktur HTML verbatim dari prompt), S3 p.34 (isi folder `public/`); penempatan diamandemen `design.md` D-18 |
| Berkas | `public/index.html` |

Halaman WAJIB memuat elemen dengan ID berikut, persis seperti yang diasumsikan slide
S3 p.37:

```html
<form id="chat-form">
  <input type="text" id="user-input" />
  <button type="submit">Send</button>
</form>
<div id="chat-box"></div>
```

Ketiga elemen tersebut WAJIB berada **di dalam panel dialog** (`UI-13`), bukan langsung di
badan halaman. Nama ID tidak berubah karena materi mewajibkannya; yang diamandemen hanya
penempatannya.

Halaman WAJIB memuat `style.css` dan `script.js` dari folder yang sama.

Input WAJIB memiliki atribut `required` sehingga browser menampilkan validasi bawaan bila
kosong — perilaku ini terlihat di screenshot S3 p.14 dan p.45 ("Please fill out this field.").

Input WAJIB memiliki placeholder yang mengarahkan pengguna.

Halaman WAJIB memuat judul yang mengidentifikasi bot.

#### Scenario: halaman termuat
- **Given** server berjalan
- **When** pengguna membuka `http://localhost:3000/`
- **Then** elemen `#chat-form`, `#user-input`, dan `#chat-box` ada di DOM
- **And** ketiganya berada di dalam elemen panel dialog
- **And** `style.css` dan `script.js` termuat tanpa 404

#### Scenario: input kosong ditolak browser
- **Given** panel dialog terbuka
- **When** pengguna menekan tombol kirim tanpa mengisi input
- **Then** form tidak terkirim
- **And** browser menampilkan validasi bawaan

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
| Sumber | S3 p.29 (backend), S3 p.37 (spesifikasi prompt) |
| Berkas | `public/script.js` |
| Terkait | `API-01` |

Sistem WAJIB mengirim `POST` ke `/api/chat` dengan:

- Header `Content-Type: application/json`
- Body `JSON.stringify({ conversation: [...] })`
- Setiap item berbentuk `{ role, text }` dengan `role` bernilai `"user"` atau `"model"`

> **PERANGKAP.** Kode hasil Gemini Code Assist di slide S3 p.39 dan p.42 mengirim
> `body: JSON.stringify({ messages: [{ role: 'user', content: userMessage }] })`.
> Itu **BUG** — backend S3 p.29 membaca `conversation` dengan field `text`.
> Menyalin kode slide apa adanya membuat chatbot mati total.
> Payload benar: `{ conversation: [{ role: 'user', text: userMessage }] }`.
> Keputusan di `AGENTS.md` §3.2.

#### Scenario: bentuk payload benar
- **When** pengguna mengirim pesan
- **Then** body request memiliki field `conversation`, bukan `messages`
- **And** setiap item memiliki field `text`, bukan `content`

---

### `UI-04` — Riwayat percakapan multi-turn

| Meta | Nilai |
|---|---|
| Sumber | S3 p.29 ("Endpoint ini memungkinkan percakapan multi-turn dengan Gemini AI"), S3 p.37 (contoh body berisi 3 item) |
| Berkas | `public/script.js` |
| Uji | UJI-08 |

Sistem WAJIB menyimpan riwayat percakapan dalam array di memori browser, lalu
mengirimkannya **utuh** pada setiap request.

Setelah balasan bot diterima, balasan tersebut WAJIB ditambahkan ke riwayat dengan
`role: "model"`.

Riwayat TIDAK disimpan di server maupun di penyimpanan browser permanen — hilang saat
halaman di-reload. Ini konsisten dengan non-goals (tidak ada persistensi).

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
| Sumber | S2 p.67 (contoh batch: "Informasi bersifat edukatif dan bukan nasihat finansial profesional"); S1 p.99 (prinsip Transparansi) |
| Berkas | `public/index.html` |
| Terkait | `PG-03`, `UI-13` |

Halaman WAJIB memuat disclaimer yang **selalu terlihat** (tidak perlu di-scroll jauh atau
diklik), menyatakan bahwa:

1. Informasi bersifat **edukatif**, bukan nasihat keuangan, hukum, atau investasi profesional
2. Bot **tidak menilai** legalitas perusahaan atau aplikasi tertentu
3. Keputusan akhir dan verifikasi tetap tanggung jawab pengguna

Disclaimer ini WAJIB berada di **badan halaman**, bukan di dalam panel. Alasannya: disclaimer
harus terlihat sebelum pengguna memulai percakapan, dan tetap terbaca meski panel ditutup.
Panel bersifat non-modal (`UI-13`) justru agar disclaimer dan kanal resmi tidak tersembunyi
dari screen reader saat panel terbuka.

Panel SEBAIKNYA memuat pengingat ringkas satu baris pada bagian bawah komposer, sebagai
lapis tambahan yang terlihat saat pengguna sedang berdialog.

Disclaimer ini adalah **lapis pertahanan kedua** setelah `PG-03`. Karena LLM bersifat
probabilistik, guardrail prompt saja tidak cukup — pengguna harus tahu batas alat ini dari
antarmuka, bukan hanya dari jawaban bot.

#### Scenario: disclaimer terlihat
- **When** pengguna membuka halaman
- **Then** disclaimer terlihat tanpa interaksi tambahan
- **And** disclaimer menyebut sifat edukatif dan batas penilaian legalitas

#### Scenario: disclaimer tetap terjangkau saat panel terbuka
- **Given** panel dialog terbuka
- **When** screen reader membaca halaman
- **Then** disclaimer di badan halaman tetap dapat dibaca karena panel non-modal

---

### `UI-09` — Kanal resmi ditulis statis

| Meta | Nilai |
|---|---|
| Sumber | `docs/RISET-LAPANGAN.md` §7 (verbatim siaran pers Satgas PASTI) |
| Berkas | `public/index.html` |
| Terkait | `PG-04` |

Kanal resmi OJK WAJIB ditulis **statis di HTML**, tidak digenerate oleh model:

| Kanal | Nilai |
|---|---|
| Telepon | `157` |
| WhatsApp | `081 157 157 157` |
| Email konsumen | `konsumen@ojk.go.id` |
| Email Satgas PASTI | `satgaspasti@ojk.go.id` |

Alasan: nomor kontak adalah data presisi tinggi dengan risiko halusinasi besar bila
diserahkan ke LLM. `PG-04` melarang bot menyebutkannya dari ingatan; requirement ini
menyediakan tempat yang benar untuk data tersebut.

Sumber data WAJIB dicantumkan agar bisa diaudit ulang.

#### Scenario: kanal resmi tersedia di halaman
- **When** pengguna membuka halaman
- **Then** keempat kanal resmi terlihat atau dapat diakses dari halaman
- **And** nilainya persis seperti tabel di atas

#### Scenario: bot mengarahkan ke kanal yang sudah ada di halaman
- **When** pengguna bertanya cara melapor
- **Then** bot mengarahkan ke kanal resmi secara umum tanpa mengarang nomor
- **And** pengguna dapat menemukan nomor tersebut di halaman

---

### `UI-10` — Tampilan dan pembeda peran

| Meta | Nilai |
|---|---|
| Sumber | S3 p.10 & p.14 (screenshot tampilan target), S3 p.34 (`style.css` mengatur tampilan); batas lebar bubble dari `docs/RISET-DESAIN.md` §1 |
| Berkas | `public/style.css` |

Tampilan WAJIB memenuhi:

- Pesan pengguna dan pesan bot **dapat dibedakan secara visual** (posisi dan/atau warna).
  Pada starter code S3 p.10: bubble pengguna rata kanan, bubble bot rata kiri.
- Setiap bubble bot didahului **avatar** berbentuk lingkaran (`design.md` D-19). Avatar dibuat
  dari CSS dan teks, bukan berkas gambar, dan memakai `aria-hidden="true"` agar tidak dibaca
  ganda oleh screen reader.
- Lebar bubble maksimal **320px** pada desktop dan **85%** lebar panel pada layar sempit.
  Clutch menyebut rentang 280–320px sebagai batas keterbacaan.
- `#chat-box` memiliki tinggi terbatas dengan scroll vertikal.
- Layout **responsif** — tetap terpakai di layar ponsel. Ini penting karena target
  pengguna adalah orang yang menerima tawaran mencurigakan di ponselnya.
- Teks memiliki kontras cukup untuk keterbacaan (`UI-11`).
- Teks panjang dari bot tidak terpotong dan tidak meluber keluar kontainer.

Styling ditulis dengan CSS biasa. **DILARANG** memakai framework CSS via CDN atau
dependency baru — materi menetapkan Vanilla (S3 p.34).

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
| Sumber | S1 p.99 (prinsip **Keadilan**: "AI harus memperlakukan semua pengguna secara adil—tanpa memandang gender, ras, atau latar belakang") — diterapkan pada keterjangkauan antarmuka |
| Berkas | `public/index.html`, `public/style.css`, `public/script.js` |
| Uji | UJI-13 |

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
- Setiap bubble pesan memiliki penanda pengirim yang terbaca screen reader (bukan hanya
  dibedakan warna atau posisi)

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

---

### `UI-12` — Design token dan arah visual

| Meta | Nilai |
|---|---|
| Sumber | S3 p.34 (`style.css` mengatur tampilan UI); `docs/USE-CASE-CEKDULU.md` §1 (persona); palet dari `docs/RISET-DESAIN.md` §3–4 |
| Berkas | `public/style.css` |
| Terkait | `UI-10`, `UI-11`, `UI-13` |

Seluruh nilai visual WAJIB didefinisikan sebagai CSS custom properties dalam satu blok
`:root`, mencakup: palet warna, skala tipografi, skala spacing, radius, durasi transisi, dan
ukuran struktural launcher serta panel.

Aturan turunan:
- Selector di bawah `:root` **wajib** merujuk token, tidak menulis nilai literal berulang
- Skala tipografi memakai kelipatan yang konsisten, bukan angka acak per elemen
- Skala spacing memakai satu satuan dasar dengan kelipatan tetap

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
| Avatar berupa berkas gambar atau emoji robot | Berkas gambar menambah permintaan jaringan; emoji robot menggeser nada menjadi ceria, tidak sesuai konteks pengguna yang cemas (D-19) |
