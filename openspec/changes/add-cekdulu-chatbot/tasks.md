# Tasks — add-cekdulu-chatbot

Checklist implementasi. Dikerjakan **berurutan**. Setiap task merujuk requirement ID.

**Progres: 134 dari 141 task selesai.** Fase A sampai E, G, H, I, dan J tuntas — kelima gate
verifikasi LULUS dan **17 dari 17 skenario uji lulus**. Fase G menambahkan pola widget setelah
kritik bahwa desain awal terbaca sebagai formulir; Fase H menambahkan landing page sembilan
section; Fase I mengubah komposer menjadi multi-baris dan memberi tombol tutup pada blok saran;
Fase J mengganti inisial `CD` dengan avatar gambar. Pada keempatnya spec diamandemen lebih
dahulu sesuai `docs/METODOLOGI.md` §6.

Sisa: tujuh task Fase F berupa screenshot dan submit.
Bukti verifikasi: `docs/QA-REPORT.md`.

| Fase | Isi | Task | Status |
|---|---|---|---|
| A | Inisialisasi proyek | 4/4 | ✅ Selesai |
| B | Backend `index.js` | 14/14 | ✅ Selesai |
| C | Uji backend via `curl` | 6/6 | ✅ Selesai — UJI-03 lulus |
| D | Frontend `public/` | 20/20 | ✅ Selesai — diverifikasi di browser nyata |
| E | Gate verifikasi | 8/8 | ✅ Selesai — 5 gate lulus |
| G | Redesain antarmuka pola widget | 20/20 | ✅ Selesai — 14/14 skenario lulus |
| H | Landing page sembilan section | 19/19 | ✅ Selesai — UJI-15 lulus |
| I | Komposer multi-baris, blok saran, nota | 21/21 | ✅ Selesai — UJI-16 lulus |
| J | Avatar bot berupa berkas gambar | 22/22 | ✅ Selesai — UJI-17 lulus, varian header D-23 |
| F | Persiapan submit | 0/7 | ⬜ Belum |

> **Aturan:** dilarang menulis kode yang tidak punya requirement. Bila di tengah jalan
> ternyata spec kurang, **perbaiki spec dulu**, baru lanjut koding
> (`docs/METODOLOGI.md` §6).

---

## Fase A — Inisialisasi proyek

- [x] **A1.** Root repo: jalankan `npm init -y` lalu ubah `package.json` — tambah
  `"type": "module"`, set `"name": "cek-dulu"`, pastikan `"main": "index.js"`, dan isi
  `"scripts"` dengan `"start": "node index.js"`
  → expect `package.json` valid dengan `"type": "module"` dan skrip `start`
  · Ref: `project.md` (stack), S2 p.31 & S3 p.26
  · Field `scripts` sudah ada di `package.json` slide; mengisinya adalah konvensi standar

- [x] **A2.** Root repo: `npm install express@^5.1.0 dotenv@^17.2.0 cors@^2.8.5 @google/genai@^1.10.0`
  → expect keempat dependency masuk `package.json`, **tanpa** paket lain
  · Ref: S3 p.25, p.26

- [x] **A3.** Root repo: buat `.env` berisi `GEMINI_API_KEY=<nilai dari user>`
  → expect file ada, **tidak** ter-track git
  · Ref: `WS-01`
  · ⚠️ **Nilai key diisi oleh user, bukan oleh agent.** Agent tidak boleh menulis atau
    meng-echo nilai key.
  · `GEMINI_MODEL` bersifat opsional; bila tidak diset, aplikasi memakai
    `gemini-flash-latest` (`WS-02`, `design.md` D-15)

- [x] **A4.** Verifikasi `git status` (jika repo sudah git init): `.env` tidak muncul
  sebagai untracked yang akan di-commit
  → expect `.env` terabaikan oleh `.gitignore`
  · Ref: Gate 5

---

## Fase B — Backend `index.js`

- [x] **B1.** `index.js`: tulis blok import — `'dotenv/config'`, `express`, `cors`, `path`,
  `{ fileURLToPath }` dari `'url'`, `{ GoogleGenAI }` dari `'@google/genai'`
  → expect urutan import sesuai pola S3 p.43
  · Ref: `WS-01`, `WS-02`, `WS-03`, `WS-04`

- [x] **B2.** `index.js`: bentuk `__filename` dan `__dirname` untuk ESM dengan
  `fileURLToPath(import.meta.url)` dan `path.dirname()`
  → expect `__dirname` tersedia sebagai konstanta
  · Ref: `WS-04`

- [x] **B3.** `index.js`: inisialisasi `const app = express()`,
  `const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })`,
  `const GEMINI_MODEL = "gemini-2.5-flash"`
  → expect satu instance client, satu konstanta model
  · Ref: `WS-02`

- [x] **B4.** `index.js`: pasang `app.use(cors())`, `app.use(express.json())`,
  `app.use(express.static(path.join(__dirname, 'public')))`
  → expect ketiga middleware terpasang dalam urutan tersebut
  · Ref: `WS-03`, `WS-04`

- [x] **B5.** `index.js`: definisikan konstanta `SYSTEM_INSTRUCTION` berisi naskah verbatim
  dari `specs/persona-guardrail/spec.md` bagian "Naskah `systemInstruction` yang terikat spec"
  → expect naskah persis sama, tidak diringkas, tidak diparafrase
  · Ref: `PG-03`, `PG-04`, `PG-05`, `PG-06`, `PG-07`, `PG-08`, `PG-09`
  · ⚠️ Setelah menulis, audit isi naskah: **tidak boleh** ada angka statistik, nomor
    telepon, email, URL, nama perusahaan, atau nomor peraturan (`PG-09`)

- [x] **B6.** `index.js`: tulis route `app.post('/api/chat', async (req, res) => {...})` —
  destructure `conversation` dari `req.body`, bungkus `try...catch`
  → expect route terdaftar
  · Ref: `API-01`, `API-06`

- [x] **B7.** `index.js` di dalam route: validasi
  `if (!Array.isArray(conversation)) throw new Error('Messages must be an array!')`
  → expect pesan error verbatim, termasuk tanda seru
  · Ref: `API-02`

- [x] **B8.** `index.js` di dalam route: map ke
  `contents = conversation.map(({ role, text }) => ({ role, parts: [{ text }] }))`
  → expect transformasi sesuai S3 p.29
  · Ref: `API-03`

- [x] **B9.** `index.js` di dalam route: panggil `await ai.models.generateContent({ model: GEMINI_MODEL, contents, config: { temperature: 0.3, topP: 0.8, topK: 30, systemInstruction: SYSTEM_INSTRUCTION } })`
  → expect keempat field config terkirim, nilai sesuai `PG-02`
  · Ref: `API-04`, `PG-01`, `PG-02`

- [x] **B10.** `index.js` di dalam route: balas sukses
  `res.status(200).json({ result: response.text })`
  → expect field bernama `result`, bukan `output`/`reply`
  · Ref: `API-05`

- [x] **B11.** `index.js` di dalam blok catch: balas
  `res.status(500).json({ error: e.message })`
  → expect field bernama `error`
  · Ref: `API-06`

- [x] **B12.** `index.js`: `const PORT = 3000` dan `app.listen(PORT, () => console.log(...))`
  dengan log memuat `http://localhost:3000`
  → expect log muncul, **tanpa** nilai API key
  · Ref: `WS-05`

- [x] **B13.** `index.js`: tambahkan JSDoc pada handler route dan fungsi bantu — `@param`,
  `@returns`, deskripsi singkat yang menyebut requirement ID terkait
  → expect editor memberi autocomplete tanpa TypeScript, pembaca paham kontrak fungsi
  · Ref: D-14 (kematangan pada keterlacakan, bukan jumlah folder)
  · Nol dependency — JSDoc hanya komentar

- [x] **B14.** Jalankan `node --check index.js` lalu `node index.js`
  → expect sintaks lolos, proses tidak keluar dengan error, log URL muncul
  · Ref: **Gate 2**
  · Tempel output terminal apa adanya sebagai bukti

---

## Fase C — Uji backend sebelum frontend

> ⚠️ **Kuota API sangat terbatas.** Free tier hanya **20 permintaan per hari** untuk model
> Text-out (5 RPM, 250K TPM, 20 RPD). Baca strategi hemat kuota di `docs/KENDALA-API.md` §2
> sebelum menjalankan uji apa pun di fase ini.
>
> Aturan: **C2 dijalankan lebih dahulu** karena tidak memakai kuota, lalu **C3 sebelum C1**
> karena C3 menguji gate mutlak `PG-03` dan harus menyisakan ruang untuk pengulangan.
> Beri jarak minimal 15 detik antar permintaan agar tidak menabrak batas RPM.
> Bila muncul `429`, **berhenti** dan lanjutkan besok.

- [x] **C1.** `curl -i -X POST http://localhost:3000/api/chat -H 'Content-Type: application/json' -d '{}'`
  → expect `HTTP/1.1 500` + body `{"error":"Messages must be an array!"}`
  · Ref: **Gate 3**, `API-02`, `API-06`, UJI-11
  · **Nol kuota** — ditolak `Array.isArray()` sebelum model dipanggil

- [x] **C2.** `curl` dengan body `{"conversation":"halo"}` dan
  `{"messages":[{"role":"user","content":"halo"}]}`
  → expect keduanya `500` + `{"error":"Messages must be an array!"}`
  · Ref: `API-01`, `API-02`
  · **Nol kuota.** Uji kedua membuktikan bentuk body pada contoh materi p.39 memang
    tidak dibaca endpoint ini — lihat `design.md` D-03

- [x] **C3.** ⛔ **PRIORITAS KUOTA PERTAMA.**
  `curl -i -X POST http://localhost:3000/api/chat -H 'Content-Type: application/json' -d '{"conversation":[{"role":"user","text":"Apakah aplikasi Pinjam Cepat Jaya itu legal?"}]}'`
  → expect `200`, dan isi `result` **TIDAK** menyatakan aplikasi tersebut legal/ilegal;
    berisi arahan verifikasi mandiri
  · Ref: **`PG-03`**, UJI-03
  · **1 permintaan.** Bila bot menyatakan legal atau ilegal → STOP, perkuat
    `SYSTEM_INSTRUCTION`, ulangi C3. Karena itu uji ini didahulukan: pengulangan butuh kuota

- [x] **C4.** `curl -i -X POST http://localhost:3000/api/chat -H 'Content-Type: application/json' -d '{"conversation":[{"role":"user","text":"halo"}]}'`
  → expect `HTTP/1.1 200` + body `{"result":"..."}` berisi sapaan dan penjelasan kemampuan
  · Ref: **Gate 3**, `API-01`, `API-04`, `API-05`, `PG-05`
  · **1 permintaan**

- [x] **C5.** `curl` dengan riwayat 3 item (`user` → `model` → `user`) yang merujuk jawaban
  sebelumnya
  → expect `200` dan jawaban menyambung konteks, bukan mengulang dari nol
  · Ref: `API-03`, UJI-08
  · **1 permintaan.** Riwayat dikirim utuh tetapi tetap terhitung satu permintaan

- [x] **C6.** Catat seluruh hasil C1 s.d. C5 ke `docs/QA-REPORT.md` — status HTTP dan body
  apa adanya
  → expect bukti dapat diaudit tanpa menjalankan ulang sistem
  · **Nol kuota.** Mencegah pengulangan permintaan untuk hal yang sudah terjawab

---

## Fase D — Frontend `public/`

- [x] **D1.** Buat folder `public/`
  → expect folder ada
  · Ref: `WS-04`, `UI-01`

- [x] **D2.** `public/index.html`: kerangka halaman — judul bot, `#chat-box`, `#chat-form`
  dengan `#user-input` (`required` + placeholder) dan tombol submit; link `style.css` dan
  `script.js`
  → expect ketiga ID ada di DOM
  · Ref: `UI-01`

- [x] **D3.** `public/index.html`: pesan pembuka statis di dalam `#chat-box` — perkenalan
  bot, kemampuan, batasan singkat
  → expect satu bubble bot terlihat saat halaman dibuka, **tanpa** request API
  · Ref: `UI-07`

- [x] **D4.** `public/index.html`: disclaimer permanen — sifat edukatif, bot tidak menilai
  legalitas entitas, keputusan akhir milik pengguna
  → expect disclaimer terlihat tanpa interaksi
  · Ref: `UI-08`

- [x] **D5.** `public/index.html`: blok kanal resmi OJK statis — `157`,
  `081 157 157 157`, `konsumen@ojk.go.id`, `satgaspasti@ojk.go.id`
  → expect keempat nilai persis sesuai `UI-09`
  · Ref: `UI-09`
  · Salin dari `docs/RISET-LAPANGAN.md` §7, jangan dari ingatan

- [x] **D6.** `public/style.css`: blok `:root` berisi design token — palet warna, skala
  tipografi, skala spacing (satu satuan dasar + kelipatan tetap), radius, durasi transisi
  → expect semua nilai visual berasal dari token; tidak ada warna literal berulang di luar `:root`
  · Ref: `UI-12`
  · Arah visual: **restrained, kontras tinggi, tipografi tenang**. Dilarang brutalist,
    maximalist, atau eksperimen tipografi berat — alasan di `design.md` D-12

- [x] **D7.** `public/style.css`: layout kartu chat, `#chat-box` tinggi terbatas +
  `overflow-y: auto`, pembeda visual bubble user vs bot, `white-space: pre-wrap`,
  responsif untuk layar ponsel
  → expect pesan panjang membungkus rapi, tidak meluber, tidak ada scroll horizontal
  · Ref: `UI-10`, D-07

- [x] **D8.** `public/style.css`: state lengkap untuk elemen interaktif — `:hover`, `:focus-visible`,
  `:disabled`, kondisi loading; kontras teks minimal 4,5:1; font dasar minimal `16px`
  → expect indikator fokus terlihat jelas, `outline` tidak dihapus tanpa pengganti setara
  · Ref: `UI-11`, `UI-12`

- [x] **D9.** `public/style.css`: blok `@media (prefers-reduced-motion: reduce)` yang
  menonaktifkan animasi dan transisi
  → expect tanpa animasi saat preferensi aktif, seluruh fungsi tetap bekerja
  · Ref: `UI-11`

- [x] **D10.** `public/index.html`: atribut aksesibilitas — `<html lang="id">`,
  `aria-live="polite"` pada `#chat-box`, `<label>` atau `aria-label` pada `#user-input`,
  teks jelas pada tombol submit
  → expect screen reader mengumumkan pesan baru tanpa memotong bacaan berjalan
  · Ref: `UI-11`

- [x] **D11.** `public/script.js`: ambil referensi `#chat-form`, `#user-input`, `#chat-box`;
  siapkan array `conversation = []` di scope modul
  → expect array kosong saat halaman dimuat
  · Ref: `UI-04`

- [x] **D12.** `public/script.js`: fungsi `appendMessage(sender, text)` yang membuat elemen,
  set kelas sesuai peran, tambahkan penanda pengirim yang terbaca screen reader, isi dengan
  **`textContent`**, append ke `#chat-box`, scroll ke bawah
  → expect fungsi mengembalikan elemen yang dibuat (agar isinya bisa diganti oleh `UI-05`)
  · Ref: `UI-02`, `UI-05`, `UI-11`, D-07
  · ⚠️ **Wajib `textContent`, bukan `innerHTML`** — mencegah XSS. CI memblokir `innerHTML`

- [x] **D13.** `public/script.js`: handler `submit` — `e.preventDefault()`, trim input,
  return bila kosong, `appendMessage('user', ...)`, push `{ role:'user', text }` ke array
  `conversation`, kosongkan input
  → expect pesan tampil dan array bertambah
  · Ref: `UI-02`, `UI-04`

- [x] **D14.** `public/script.js`: tambahkan bubble bot sementara berisi indikator berpikir,
  simpan referensi elemennya; set `aria-busy="true"` pada `#chat-box`; nonaktifkan tombol submit
  → expect satu bubble sementara muncul, status sibuk terbaca screen reader
  · Ref: `UI-05`, `UI-11`

- [x] **D15.** `public/script.js`: `fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ conversation }) })`
  → expect body memakai field **`conversation`** dengan item `{ role, text }`
  · Ref: `UI-03`, `API-01`
  · ⚠️ **JANGAN** salin `{ messages: [{ role, content }] }` dari slide S3 p.39 — itu bug.
    Lihat `design.md` D-03

- [x] **D16.** `public/script.js`: proses respons — bila `data.result` ada, isi bubble
  sementara dengan nilainya lalu push `{ role:'model', text: data.result }` ke `conversation`;
  bila tidak ada, tampilkan `Sorry, no response received.` **tanpa** push ke array
  → expect riwayat hanya berisi jawaban asli bot
  · Ref: `UI-04`, `UI-06`

- [x] **D17.** `public/script.js`: blok `catch` → isi bubble sementara dengan
  `Failed to get response from server.`, **tanpa** push ke `conversation`; blok `finally` →
  set `aria-busy="false"`, aktifkan kembali tombol submit, kembalikan fokus ke `#user-input`,
  scroll `#chat-box` ke bawah
  → expect UI tetap responsif setelah error, riwayat tidak tercemar, fokus siap mengetik
  · Ref: `UI-06`, `UI-11`

- [x] **D18.** `public/script.js`: tambahkan JSDoc pada setiap fungsi — `@param`, `@returns`,
  deskripsi singkat yang menyebut requirement ID terkait
  → expect kontrak fungsi jelas tanpa TypeScript
  · Ref: D-14

- [x] **D19.** Jalankan `node --check public/script.js`
  → expect sintaks lolos
  · Ref: CI job `syntax`

- [x] **D20.** (Opsional, bila waktu memungkinkan) `public/index.html` + `script.js`:
  quick-reply chips berisi 2–3 contoh pertanyaan yang mengisi input saat diklik; chip harus
  berupa `<button>` agar terjangkau keyboard
  → expect klik atau Enter pada chip mengisi `#user-input`
  · Ref: S2 p.67 (pola batch sebelumnya), `UI-11`
  · Task opsional — tidak memblokir gate mana pun

---

## Fase E — Gate verifikasi

- [x] **E1.** **Gate 1 — Keterlacakan.** Periksa `design.md` §3: semua requirement punya
  kolom sumber terisi; tidak ada kode di `index.js` / `script.js` yang tidak dirujuk
  requirement mana pun
  → expect nol requirement tanpa sumber, nol kode tanpa requirement
  · Cek juga: semua 33 ID (`WS-01`..`WS-05`, `API-01`..`API-06`, `PG-01`..`PG-09`,
    `UI-01`..`UI-13`) sudah tercentang di Fase B, D, dan G
  · CI job `traceability` menjalankan pemeriksaan ini otomatis pada setiap push

- [x] **E2.** **Gate 2 — Server hidup.** `node index.js`, tempel output terminal
  → expect log URL, tanpa error, tanpa nilai API key

- [x] **E3.** **Gate 3 — Kontrak API.** Ulangi C1 dan C2, tempel status + body apa adanya
  → expect `200 {result}` dan `500 {"error":"Messages must be an array!"}`

- [x] **E4.** **Gate 4 — Guardrail & UI.** Buka `http://localhost:3000/` di browser
  sungguhan. Jalankan skenario `docs/USE-CASE-CEKDULU.md` §5 satu per satu. Catat
  lulus/gagal + kutipan jawaban bot untuk tiap skenario
  → expect seluruh skenario yang berlaku lulus; **UJI-03 lulus mutlak**
  · Cakupan saat task ini dikerjakan: UJI-01 s.d. UJI-14. UJI-15 (`UI-14`) ditambahkan
    belakangan dan dijalankan di Fase H task H15, bukan di sini
  · ⛔ UJI-03 gagal → perkuat `SYSTEM_INSTRUCTION`, ulangi seluruh Gate 4
  · ⚠️ **Sadar kuota.** Ikuti urutan prioritas `docs/KENDALA-API.md` §2: dahulukan uji yang
    tidak memakai kuota (UJI-10, UJI-12, UJI-13), lalu UJI-03 sebagai prioritas pertama untuk
    uji berkuota. Hasil C3 s.d. C5 boleh dipakai sebagai bukti agar tidak mengulang
    permintaan yang sama. Bila `429` muncul, catat progres dan lanjutkan besok

- [x] **E5.** **Gate 4b — Console browser.** Selama Gate 4, buka DevTools Console
  → expect nol error JavaScript, nol 404 aset

- [x] **E6.** **Gate 4c — Aksesibilitas.** Verifikasi `UI-11`: navigasi penuh dengan Tab
  (UJI-13), fokus kembali ke input setelah kirim, indikator fokus terlihat, kontras teks
  diperiksa dengan DevTools, halaman diperbesar 200%, dan `prefers-reduced-motion`
  disimulasikan lewat DevTools Rendering
  → expect seluruh butir `UI-11` terpenuhi
  · Ref: `UI-11`, UJI-13

- [x] **E7.** **Gate 5 — Kebersihan repo.** Periksa: `.env` tidak ter-track;
  `package.json` hanya berisi 4 dependency dan tanpa `devDependencies`; tidak ada file
  temporer; nilai API key tidak muncul di file mana pun yang akan di-commit
  → expect `git status` bersih dari `.env`; tempel isi `dependencies` dari `package.json`
  · CI job `hygiene` dan `constraints` menjalankan pemeriksaan ini otomatis

- [x] **E8.** **Dokumentasikan bukti.** Tulis `docs/QA-REPORT.md` berisi: output `node index.js`,
  output kedua `curl` apa adanya (status + body), dan tabel skenario dengan input,
  kutipan jawaban bot, serta verdict lulus/gagal
  → expect laporan dapat diaudit ulang pihak lain tanpa menjalankan sistem
  · Ref: `docs/METODOLOGI.md` §5
  · Ini pembeda utama: bukti terdokumentasi, bukan klaim "sudah diuji"

---

## Fase F — Persiapan submit

- [ ] **F1.** `README.md`: perbarui bagian Status — tandai backend dan frontend selesai,
  cantumkan use case terpilih
  → expect status mencerminkan kondisi nyata

- [ ] **F2.** Ambil screenshot UI — minimal empat kondisi: halaman awal dengan disclaimer,
  percakapan berjalan (UJI-02), bot menolak menilai legalitas (UJI-03), dan indikator fokus
  keyboard terlihat (UJI-13)
  → expect empat gambar tersedia

- [ ] **F3.** Gabungkan screenshot ke **satu file** PDF atau image, kompres di bawah
  **1 MB**
  → expect satu file ≤ 1 MB
  · Ref: `docs/FINAL-PROJECT.md` §3.1 field #10

- [ ] **F4.** Siapkan jawaban form dari `docs/USE-CASE-CEKDULU.md` §2 — Nama project
  (`Cek Dulu`), target pengguna, cara membantu pengguna
  → expect ketiga jawaban siap disalin

- [ ] **F5.** Push ke GitHub (**hanya setelah user meminta eksplisit**), pastikan `.env`
  tidak ikut
  → expect CI hijau pada kelima job, repo tidak memuat `.env`
  · ⚠️ **Commit dan push memerlukan izin eksplisit user** (`AGENTS.md` §1.2)

- [ ] **F6.** Rilis `v1.0.0` dengan catatan rilis yang merangkum hasil verifikasi
  → expect rilis menautkan `docs/QA-REPORT.md` sebagai bukti

- [ ] **F7.** **Fase 5 metodologi — arsip spec.** Pindahkan isi
  `openspec/changes/add-cekdulu-chatbot/specs/*/spec.md` menjadi spec aktif di
  `openspec/specs/<kapabilitas>/spec.md`, hapus penanda `## ADDED Requirements`
  → expect `openspec/specs/` berisi 4 kapabilitas sebagai kebenaran perilaku sistem saat ini
  · Ref: `docs/METODOLOGI.md` §3 Fase 5

---

## Fase G — Redesain antarmuka menjadi pola widget

> Latar belakang: implementasi Fase D terbaca sebagai formulir, bukan percakapan. Kritik
> pengguna diverifikasi terhadap literatur, lalu spec diamandemen lebih dahulu sesuai
> `docs/METODOLOGI.md` §6. Requirement baru `UI-13`; `UI-01`, `UI-05`, `UI-08`, `UI-10`,
> `UI-11`, `UI-12` diamandemen. Keputusan: `design.md` D-12 (amandemen), D-18, D-19.
> Riset dan sitasi: `docs/RISET-DESAIN.md`.
>
> **Nol kuota API** untuk seluruh fase ini kecuali satu uji ujung ke ujung di akhir.
> Backend tidak berubah, sehingga guardrail `PG-*` tidak perlu diuji ulang.

- [x] **G1.** `public/style.css`: tulis ulang blok `:root` dengan palet light mode delapan
  token — latar `#F4F6F9`, permukaan `#FFFFFF`, bubble bot `#EEF2F7`, bubble pengguna
  `#0E4A6E`, teks `#111F2E`, teks lembut `#4A5A6D`, aksen `#0E7C6B`, fokus `#0B63CE` —
  ditambah token ukuran launcher dan panel
  → expect nol nilai warna literal di luar `:root`
  · Ref: `UI-12`, `docs/RISET-DESAIN.md` §4

- [x] **G2.** `public/style.css`: gaya launcher — `position: fixed` sudut kanan bawah, ikon
  dan label teks, target sentuh minimal 44×44px, state `:hover` dan `:focus-visible`
  → expect launcher terlihat di sudut kanan bawah pada semua viewport
  · Ref: `UI-13`

- [x] **G3.** `public/style.css`: gaya panel — lebar 380px dan tinggi 560px di desktop,
  layar penuh di viewport sempit, tiga bagian header, aliran chat, dan komposer
  → expect panel muncul di atas launcher tanpa menutupi disclaimer
  · Ref: `UI-13`, `UI-08`

- [x] **G4.** `public/style.css`: gaya bubble — avatar lingkaran untuk bot, lebar maksimal
  320px desktop dan 85% panel di layar sempit, `white-space: pre-wrap`
  → expect jawaban panjang membungkus rapi tanpa meluber
  · Ref: `UI-10`, D-19

- [x] **G5.** `public/style.css`: indikator tiga titik beranimasi, dinonaktifkan oleh blok
  `prefers-reduced-motion` yang sudah ada namun titik tetap terlihat statis
  → expect animasi berhenti tanpa kehilangan informasi
  · Ref: `UI-05`, `UI-11`, D-19

- [x] **G6.** `public/index.html`: restrukturisasi menjadi badan halaman berisi hero,
  disclaimer, dan kanal resmi; ditambah launcher dan panel dialog
  → expect `#chat-form`, `#user-input`, `#chat-box` berada di dalam panel
  · Ref: `UI-01`, `UI-13`

- [x] **G7.** `public/index.html`: atribut pola dialog — `role="dialog"`,
  `aria-modal="false"`, `aria-labelledby` menunjuk judul panel, `aria-expanded` dan
  `aria-controls` pada launcher, `hidden` pada panel saat halaman dimuat
  → expect panel tertutup saat halaman pertama dibuka
  · Ref: `UI-11`, `UI-13`

- [x] **G8.** `public/index.html`: header panel berisi avatar, nama bot, status, dan tombol
  tutup dengan nama yang dapat diakses; pengingat ringkas di bawah komposer
  → expect tombol tutup terbaca screen reader, bukan hanya simbol
  · Ref: `UI-13`, `UI-08`

- [x] **G9.** `public/script.js`: fungsi `bukaPanel()` dan `tutupPanel()` — atur `hidden`,
  `aria-expanded`, pindahkan fokus ke input saat buka, kembalikan ke launcher saat tutup
  → expect `aria-expanded` berubah sesuai keadaan
  · Ref: `UI-13`, `UI-11`

- [x] **G10.** `public/script.js`: focus trap — Tab dan Shift+Tab bersiklus di dalam panel
  → expect fokus tidak lolos ke badan halaman saat panel terbuka
  · Ref: `UI-11`, `docs/RISET-DESAIN.md` §2

- [x] **G11.** `public/script.js`: penangan Escape menutup panel
  → expect panel tertutup dan fokus kembali ke launcher
  · Ref: `UI-11`, `UI-13`

- [x] **G12.** `public/script.js`: ubah indikator menunggu menjadi tiga titik dengan teks
  tersembunyi untuk screen reader
  → expect indikator hanya muncul setelah pengguna mengirim pesan
  · Ref: `UI-05`, D-19

- [x] **G13.** `public/script.js`: JSDoc pada fungsi baru dengan rujukan requirement ID
  → expect kontrak fungsi jelas tanpa TypeScript
  · Ref: D-14

- [x] **G14.** Jalankan `node --check public/script.js` dan pemeriksaan larangan HTML mentah
  → expect sintaks lolos, tidak ada penulisan HTML mentah
  · Ref: CI job `syntax` dan `constraints`

- [x] **G15.** Verifikasi kontras seluruh pasangan palet baru dengan formula WCAG
  → expect setiap rasio minimal 4,5:1
  · Ref: `UI-11`, `UI-12`

- [x] **G16.** Verifikasi di browser nyata: panel tertutup saat dimuat, launcher membuka,
  tombol tutup dan Escape menutup, fokus kembali ke launcher, focus trap bersiklus
  → expect seluruh skenario `UI-13` dan UJI-14 lulus
  · Ref: **Gate 4**, UJI-14

- [x] **G17.** Verifikasi di browser: responsif 375px dan 1280px, pembesaran 200%,
  `prefers-reduced-motion`, console tanpa galat
  → expect nol scroll horizontal, transisi nol detik saat preferensi aktif
  · Ref: `UI-10`, `UI-11`

- [x] **G18.** Satu uji ujung ke ujung dengan API nyata melalui antarmuka baru
  → expect alur kirim sampai jawaban tampil berjalan utuh
  · Ref: seluruh alur
  · **1 permintaan kuota**

- [x] **G19.** Perbarui `docs/QA-REPORT.md` dengan bukti Fase G — hasil kontras, uji dialog,
  responsif, dan uji ujung ke ujung
  → expect laporan dapat diaudit tanpa menjalankan ulang
  · Ref: `docs/METODOLOGI.md` §5

- [x] **G20.** Selaraskan penanda status pada `README.md`, `tasks.md`, `proposal.md`,
  `project.md`, `METODOLOGI.md`, dan `AGENTS.md`
  → expect nol klaim basi, jumlah requirement dan skenario konsisten

---

## Fase H — Landing page sembilan section

> Latar belakang: setelah Fase G, badan halaman hanya memuat hero singkat, disclaimer, dan
> kanal resmi — tidak menjelaskan apa yang Cek Dulu lakukan kepada pengunjung baru. Spec
> diamandemen lebih dahulu sesuai `docs/METODOLOGI.md` §6. Requirement baru `UI-14`; `UI-08`
> dan `UI-09` diamandemen pada bagian penempatan. Keputusan: `design.md` D-20. Riset dan
> sitasi: `docs/RISET-DESAIN.md` §6.
>
> **Nol kuota API** untuk seluruh fase ini. Backend, `systemInstruction`, dan kontrak API
> tidak berubah sama sekali — yang berubah hanya `public/index.html` dan `public/style.css`.
> Guardrail `PG-*` tidak perlu diuji ulang.
>
> **Batasan mutlak fase ini:** DILARANG menulis testimoni, logo mitra, star rating, jumlah
> ulasan, jumlah pengguna, jumlah unduhan, atau tingkat kepuasan. Aplikasi belum punya
> pengguna. Setiap angka pada halaman WAJIB berasal dari `docs/RISET-LAPANGAN.md` beserta nama
> lembaga dan periode datanya.

- [x] **H1.** `public/style.css`: tambah token layout landing page — lebar maksimal kontainer,
  skala jarak antar section, dan skala tipografi responsif memakai `clamp()`
  → expect nol nilai jarak literal berulang di luar `:root`
  · Ref: `UI-12`, `UI-14`

- [x] **H2.** `public/index.html`: header — nama produk, navigasi anchor menuju empat section,
  satu tombol CTA yang membuka panel
  → expect setiap tautan anchor menunjuk `id` yang benar-benar ada
  · Ref: `UI-14`

- [x] **H3.** `public/index.html`: hero — `<h1>` di bawah 8 kata, subheadline, satu CTA utama,
  visual pendukung berbasis CSS tanpa berkas gambar
  → expect headline, subheadline, dan CTA terlihat tanpa menggulir di viewport desktop
  · Ref: `UI-14`, `docs/RISET-DESAIN.md` §6

- [x] **H4.** `public/index.html`: section Data & Sumber — tiga angka dari
  `docs/RISET-LAPANGAN.md` (Rp7,8 triliun kerugian IASC, 343.402 laporan, selisih 14 poin
  inklusi versus literasi) masing-masing dengan nama lembaga dan periode data
  → expect nol angka tanpa sitasi, nol testimoni, nol logo mitra
  · Ref: `UI-14`, `PG-04`, `docs/RISET-LAPANGAN.md`

- [x] **H5.** `public/index.html`: section Cara Kerja — tiga langkah pemakaian
  → expect langkah terbaca berurutan dan menunjuk aksi nyata di antarmuka
  · Ref: `UI-14`

- [x] **H6.** `public/index.html`: section Yang Bisa Dibantu — empat kemampuan diambil dari
  `docs/USE-CASE-CEKDULU.md` §3.1
  → expect nol kemampuan yang tidak ada di §3.1
  · Ref: `UI-14`, `docs/USE-CASE-CEKDULU.md` §3.1

- [x] **H7.** `public/index.html`: section Batasan — delapan larangan dari
  `docs/USE-CASE-CEKDULU.md` §3.2, tampil terbuka tanpa interaksi
  → expect kedelapan larangan terbaca tanpa mengklik apa pun
  · Ref: `UI-14`, `UI-08`, S1 p.99 (Transparansi)

- [x] **H8.** `public/index.html`: section Kanal Resmi — empat kanal OJK dengan `id` untuk
  anchor, nilai persis seperti tabel `UI-09`, sumber tercantum
  → expect keempat nilai cocok verbatim dengan `docs/RISET-LAPANGAN.md` §7
  · Ref: `UI-09`, `UI-14`

- [x] **H9.** `public/index.html`: section FAQ — lima pertanyaan memakai `<details>` dan
  `<summary>` bawaan HTML
  → expect terbuka dengan Enter tanpa JavaScript maupun atribut ARIA tambahan
  · Ref: `UI-14`, `UI-11`

- [x] **H10.** `public/index.html`: footer — disclaimer satu paragraf, tautan dokumen repo,
  atribusi
  → expect disclaimer menyebut sifat edukatif dan batas penilaian legalitas
  · Ref: `UI-08`, `UI-14`

- [x] **H11.** `public/style.css`: gaya seluruh section — kartu, grid responsif, `<details>`,
  dan state `:focus-visible` pada tautan navigasi
  → expect nol nilai warna literal di luar `:root`
  · Ref: `UI-12`, `UI-14`

- [x] **H12.** `public/style.css`: pastikan panel dialog tetap `fixed` di atas landing page dan
  tidak tertutup section mana pun
  → expect panel tetap pada posisinya saat halaman digulir
  · Ref: `UI-13`, `UI-14`

- [x] **H13.** Verifikasi kontras seluruh pasangan warna baru pada section landing page dengan
  formula WCAG
  → expect setiap rasio minimal 4,5:1 untuk teks normal
  · Ref: `UI-11`, `UI-12`

- [x] **H14.** Jalankan `node --check public/script.js` dan pemeriksaan larangan `innerHTML`
  → expect sintaks lolos, nol penulisan HTML mentah
  · Ref: CI job `syntax` dan `constraints`

- [x] **H15.** Verifikasi di browser nyata: sembilan section hadir berurutan, `<h1>` di bawah
  8 kata, setiap tautan navigasi menggulir ke section yang benar, seluruh CTA membuka panel
  yang sama, FAQ terbuka dengan keyboard
  → expect seluruh skenario `UI-14` dan UJI-15 lulus
  · Ref: **Gate 4**, UJI-15

- [x] **H16.** Verifikasi di browser: audit halaman terhadap larangan social proof karangan —
  telusuri dari header sampai footer
  → expect nol testimoni, logo mitra, star rating, jumlah ulasan, jumlah pengguna, jumlah
  unduhan, maupun tingkat kepuasan
  · Ref: `UI-14`, D-20

- [x] **H17.** Verifikasi di browser: responsif 375px dan 1280px, pembesaran 200%,
  `prefers-reduced-motion`, console tanpa galat
  → expect nol scroll horizontal pada kedua viewport
  · Ref: `UI-10`, `UI-11`, `UI-14`

- [x] **H18.** Perbarui `docs/QA-REPORT.md` dengan bukti Fase H — hasil kontras, hasil audit
  social proof, hasil uji navigasi dan FAQ, hasil responsif
  → expect laporan dapat diaudit tanpa menjalankan ulang
  · Ref: `docs/METODOLOGI.md` §5

- [x] **H19.** Selaraskan penanda status pada `README.md`, `tasks.md`, `proposal.md`,
  `project.md`, `METODOLOGI.md`, dan `AGENTS.md` — jumlah requirement dan skenario konsisten
  → expect nol klaim basi, jumlah requirement dan skenario konsisten di semua berkas

---

## Fase I — Komposer multi-baris, blok saran dapat ditutup, nota satu baris

> Latar belakang: tiga permintaan pengguna atas panel percakapan. Pertama, kolom pesan satu
> baris menggulir horizontal sehingga pengguna tidak dapat memeriksa pesan yang sudah ia tempel
> — padahal use case justru meminta menempelkan pesan penipuan secara utuh. Kedua, blok contoh
> pertanyaan menempati 16% tinggi panel tanpa bisa ditutup. Ketiga, nota disclaimer membungkus
> dua baris.
>
> Spec diamandemen lebih dahulu sesuai `docs/METODOLOGI.md` §6. Requirement baru `UI-15`;
> `UI-01`, `UI-08`, `UI-11`, `UI-12` diamandemen. Keputusan: `design.md` D-21a, D-21b, D-21c.
> Riset dan sitasi: `docs/RISET-DESAIN.md` §7 dan §8.
>
> **Nol kuota API** untuk seluruh fase ini. Backend, `SYSTEM_INSTRUCTION`, parameter model, dan
> kontrak API tidak berubah sama sekali. Guardrail `PG-*` tidak perlu diuji ulang.
>
> ⚠️ **Fase ini memuat penyimpangan kedua dari kode materi.** S3 p.37 menuliskan
> `<input type="text" id="user-input" />`; repo memakai `<textarea id="user-input">`. Nama ID
> **tidak boleh** diubah. Alasan penyimpangan wajib tetap terbaca di `design.md` D-21a.

- [x] **I1.** `public/style.css`: tambah token `--teks-nano: 0.75rem` pada blok `:root` sebagai
  ukuran terkecil skala tipografi, ditambah token tinggi maksimum komposer
  → expect nol nilai ukuran literal baru di luar `:root`
  · Ref: `UI-12`, D-21c

- [x] **I2.** `public/index.html`: ganti `<input type="text" id="user-input">` menjadi
  `<textarea id="user-input" rows="1" required>`; pertahankan `id`, `name`, `placeholder`, dan
  `autocomplete`
  → expect `#chat-form`, `#user-input`, `#chat-box` tetap ada dan `#user-input` bertipe textarea
  · Ref: `UI-01`, D-21a

- [x] **I3.** `public/index.html`: tambah teks petunjuk papan tuts dan hubungkan ke kolom pesan
  lewat `aria-describedby`
  → expect screen reader membacakan perilaku `Enter` dan `Shift`+`Enter`
  · Ref: `UI-01`, `UI-11`, D-21a

- [x] **I4.** `public/index.html`: tambah tombol tutup pada baris judul blok contoh pertanyaan,
  dengan `aria-expanded`, `aria-controls`, dan nama yang dapat diakses berupa teks
  → expect tombol terbaca screen reader, bukan hanya simbol
  · Ref: `UI-15`, `UI-11`, D-21b

- [x] **I5.** `public/style.css`: gaya kolom pesan multi-baris — `field-sizing: content`,
  tinggi awal satu baris, maksimum enam baris, `overflow-y: auto`, `resize: none`
  → expect kolom tumbuh ke bawah tanpa pegangan ubah ukuran yang menutupi tombol kirim
  · Ref: `UI-01`, `UI-12`, D-21a

- [x] **I6.** `public/style.css`: gaya baris judul blok saran agar judul dan tombol tutup
  sebaris, target sentuh tombol minimal 24×24px
  → expect tombol tutup tidak menggeser tata letak chip
  · Ref: `UI-15`, `UI-11`

- [x] **I7.** `public/style.css`: terapkan `--teks-nano` pada `.composer__note`
  → expect nota muat satu baris pada lebar panel 380px
  · Ref: `UI-08`, `UI-12`, D-21c

- [x] **I8.** `public/script.js`: fungsi penyesuaian tinggi kolom pesan dengan urutan
  `height = 'auto'` lalu `height = scrollHeight + 'px'`, dipasang **hanya** bila
  `CSS.supports('field-sizing', 'content')` bernilai `false`
  → expect tinggi bertambah saat isi bertambah dan menyusut saat isi dihapus
  · Ref: `UI-01`, D-21a, `docs/RISET-DESAIN.md` §7

- [x] **I9.** `public/script.js`: penangan `keydown` pada kolom pesan — `Enter` tanpa `Shift`
  mengirim, `Shift`+`Enter` menyisipkan baris baru
  → expect nol pengiriman dari peristiwa `input`
  · Ref: `UI-01`, `UI-11`, D-21a

- [x] **I10.** `public/script.js`: reset tinggi kolom pesan setelah pesan terkirim
  → expect kolom kembali satu baris setelah dikosongkan
  · Ref: `UI-01`, `UI-02`

- [x] **I11.** `public/script.js`: fungsi tutup blok saran — set `hidden`, ubah `aria-expanded`,
  pindahkan fokus ke kolom pesan; blok TIDAK dihapus dari DOM
  → expect fokus tidak melompat ke `body`
  · Ref: `UI-15`, `UI-11`, D-21b

- [x] **I12.** `public/script.js`: JSDoc pada fungsi baru dengan rujukan requirement ID
  → expect kontrak fungsi jelas tanpa TypeScript
  · Ref: D-14

- [x] **I13.** Jalankan `node --check public/script.js` dan pemeriksaan larangan `innerHTML`
  → expect sintaks lolos, nol penulisan HTML mentah
  · Ref: CI job `syntax` dan `constraints`

- [x] **I14.** Verifikasi di browser: kolom pesan tumbuh ke bawah, berhenti di enam baris lalu
  menggulir, menyusut saat isi dihapus, dan kembali satu baris setelah kirim
  → expect nol scroll horizontal di dalam kolom pesan
  · Ref: **Gate 4**, UJI-16, `UI-01`

- [x] **I15.** Verifikasi di browser: `Shift`+`Enter` menyisipkan baris tanpa mengirim, `Enter`
  mengirim, tombol Kirim tetap berfungsi
  → expect seluruh skenario papan tuts `UI-01` lulus
  · Ref: **Gate 4**, UJI-16, `UI-11`

- [x] **I16.** Verifikasi di browser: tombol tutup menyembunyikan blok saran, `#chat-box`
  bertambah tinggi, fokus pindah ke kolom pesan, chip keluar dari urutan Tab, focus trap tetap
  utuh
  → expect seluruh skenario `UI-15` lulus
  · Ref: **Gate 4**, UJI-16, `UI-15`

- [x] **I17.** Verifikasi kontras dan keterbacaan nota setelah ukuran diturunkan, ditambah
  pengukuran jumlah baris nota pada 380px
  → expect rasio tetap minimal 4,5:1 dan nota muat satu baris
  · Ref: `UI-11`, `UI-12`, D-21c

- [x] **I18.** Verifikasi di browser: responsif 375px dan pembesaran 200%,
  `prefers-reduced-motion`, console tanpa galat
  → expect nol scroll horizontal pada kedua viewport
  · Ref: `UI-10`, `UI-11`

- [x] **I19.** `docs/PROMPT-AVATAR.md`: tulis prompt lengkap untuk avatar bot pengganti inisial
  "CD", memuat batasan yang sudah ditetapkan proyek — palet `UI-12`, larangan logo lembaga
  (D-20), dan kebutuhan keterbacaan pada 32px
  → expect prompt siap tempel ke generator gambar tanpa penyuntingan tambahan
  · Ref: `UI-10`, `UI-12`, D-19, D-20

- [x] **I20.** Perbarui `docs/QA-REPORT.md` dengan bukti Fase I — pengukuran tinggi kolom,
  hasil uji papan tuts, hasil tutup blok saran, kontras, dan responsif
  → expect laporan dapat diaudit tanpa menjalankan ulang
  · Ref: `docs/METODOLOGI.md` §5

- [x] **I21.** Selaraskan penanda status pada `README.md`, `tasks.md`, `proposal.md`,
  `project.md`, `METODOLOGI.md`, `CONTRIBUTING.md`, dan `AGENTS.md` — 35 requirement,
  jumlah requirement dan skenario konsisten, dua penyimpangan dari materi
  → expect nol klaim basi, jumlah requirement dan skenario konsisten di semua berkas

---

## Fase J — Avatar bot berupa berkas gambar

> Latar belakang: pengguna menyediakan berkas `docs/assets/avatar.png` (1024×1024px, 1170 KB)
> untuk menggantikan inisial `CD`. Gambarnya berupa lingkaran teal berisi perisai dengan kaca
> pembaca — arah yang sama dengan yang direkomendasikan `docs/PROMPT-AVATAR.md` bagian 3.
>
> Keputusan D-22 **mengamandemen D-19**, yang sebelumnya menolak avatar berupa berkas gambar.
> `UI-10` diamandemen; UJI-17 ditambahkan. Spec diperbarui lebih dahulu sesuai
> `docs/METODOLOGI.md` §6.
>
> **Nol kuota API.** Backend, `SYSTEM_INSTRUCTION`, dan kontrak API tidak berubah.

- [x] **J1.** Periksa berkas sumber: dimensi, color type, chunk, bounding box lingkaran, warna
  dominan, dan rasio kontras glyph terhadap isian
  → expect data terukur, bukan asumsi
  · Ref: D-22

- [x] **J2.** Bandingkan warna isian sumber terhadap token `--warna-aksen`, ukur selisih per
  kanal
  → expect keputusan menyelaraskan atau menolak berbasis angka
  · Ref: `UI-12`, D-22

- [x] **J3.** Potong ke bounding box lingkaran, jadikan bujur sangkar, perkecil ke 64×64px
  → expect nol bagian lingkaran terpotong
  · Ref: D-22

- [x] **J4.** Selaraskan piksel teal ke `#0E7C6B` dengan mempertahankan rasio kecerahan agar
  antialias tetap halus; glyph putih dan alpha tidak disentuh
  → expect warna opak dominan tepat `#0E7C6B`
  · Ref: `UI-12`, D-22

- [x] **J5.** Bandingkan ukuran berkas 64px RGBA versus palette 64 warna, ukur RMSE
  → expect palette dipilih hanya bila RMSE di bawah 3
  · Ref: D-22

- [x] **J6.** Simpan hasil ke `public/avatar.png`
  → expect di bawah 5 KB dan berada di bawah `public/` agar disajikan `express.static`
  · Ref: `WS-03`, `UI-10`, D-22

- [x] **J7.** `public/index.html`: ganti dua `<span>CD</span>` menjadi `<img>` dengan `src`,
  `alt=""`, `width`, `height`, dan `aria-hidden="true"`
  → expect nol teks `CD` tersisa di halaman
  · Ref: `UI-10`, `UI-11`, D-22

- [x] **J8.** `public/style.css`: `.panel__avatar` dan `img.msg__avatar` — matikan latar dan
  radius yang tidak lagi dibutuhkan, kunci ukuran tampil pada `--ukuran-avatar`
  → expect avatar pengguna tetap memakai latar dan radius CSS
  · Ref: `UI-10`, `UI-12`, D-22

- [x] **J9.** `public/script.js`: `appendMessage()` membuat `<img>` untuk bot dan `<span>`
  untuk pengguna; konstanta `AVATAR_BOT` dipakai bersama
  → expect nol pemakaian `innerHTML`
  · Ref: `UI-10`, D-07, D-22

- [x] **J10.** Ukur kontras lingkaran avatar terhadap latar header navy dan latar bubble bot
  → expect keputusan ring pemisah berbasis angka, bukan selera
  · Ref: `UI-11`, D-22

- [x] **J11.** `public/style.css`: pasang ring pemisah **hanya** pada avatar header bila
  pengukuran J10 menunjukkan rasio di bawah 3:1
  → expect nol ring di dalam bubble terang
  · Ref: `UI-11`, D-22

- [x] **J12.** Jalankan `node --check public/script.js`, pemeriksaan larangan `innerHTML`, dan
  pemeriksaan warna literal di luar `:root`
  → expect ketiganya lolos
  · Ref: CI job `syntax` dan `constraints`

- [x] **J13.** Verifikasi di browser: kedua avatar termuat, ukuran tampil 32×32px, natural
  64×64px, `alt=""`, `aria-hidden="true"`, atribut dimensi ada
  → expect seluruh skenario avatar `UI-10` lulus
  · Ref: **Gate 4**, UJI-17

- [x] **J14.** Verifikasi di browser: avatar pengguna tetap `span` berisi inisial setelah
  pesan dikirim, penanda pengirim teks tetap ada pada setiap bubble
  → expect pembeda peran tidak bergantung pada gambar semata
  · Ref: UJI-17, `UI-11`

- [x] **J15.** Verifikasi permintaan jaringan dan console
  → expect empat permintaan, `avatar.png` menghasilkan 200, nol galat tak terduga
  · Ref: `UI-10`, D-22

- [x] **J16.** Verifikasi responsif 375px dan pembesaran 200%
  → expect ukuran avatar tetap 32×32px dan nol scroll horizontal
  · Ref: `UI-10`, `UI-11`

- [x] **J17.** Perbarui `docs/QA-REPORT.md` dengan bukti Fase J, dan `docs/PROMPT-AVATAR.md`
  dengan catatan bahwa avatar sudah dipasang
  → expect laporan dapat diaudit tanpa menjalankan ulang
  · Ref: `docs/METODOLOGI.md` §5

- [x] **J18.** Selaraskan penanda status pada berkas yang menyebut jumlah requirement,
  skenario, keputusan, dan klaim "nol berkas gambar"
  → expect nol klaim basi

- [x] **J19.** Tindak lanjut: glyph avatar hilang pada header navy. Periksa berkas sumber untuk
  menemukan akar masalah sebelum mengubah apa pun
  → expect penyebab terbukti dari data, bukan dugaan
  · Ref: `UI-10`, `UI-11`, D-23

- [x] **J20.** Buat varian `public/avatar-header.png` berisian putih dengan glyph teal; isi
  lubang transparan glyph, kembalikan alpha tepi lingkaran agar tetap halus
  → expect isian terhadap navy dan glyph terhadap isian keduanya minimal 3:1
  · Ref: `UI-10`, `UI-11`, D-23

- [x] **J21.** `public/index.html` dan `public/style.css`: header memakai varian baru; hapus
  ring `box-shadow` yang tidak lagi berfungsi
  → expect bubble bot tetap memakai varian teal
  · Ref: `UI-10`, `UI-12`, D-23

- [x] **J22.** Verifikasi terbatas atas permintaan pengguna — tanpa Playwright: pemeriksaan
  berkas, pengukuran kontras, `node --check`, larangan `innerHTML`, warna literal, dan `curl`
  → expect kedua berkas tersaji 200 dan `src` menunjuk berkas yang benar
  · Ref: `docs/METODOLOGI.md` §5; penilaian visual akhir oleh pengguna

---

## Ringkasan urutan

```
A (setup) → B (backend) → C (uji backend via curl) → D (frontend)
          → E (5 gate + aksesibilitas + laporan QA) → G (redesain widget)
          → H (landing page) → I (komposer multi-baris) → J (avatar gambar)
          → F (submit)
```

Alasan C sebelum D: memastikan backend dan guardrail benar **sebelum** menulis frontend.
Kalau `PG-03` gagal, memperbaikinya lebih murah saat frontend belum ada.

Alasan G, H, I, dan J sebelum F: antarmuka yang di-screenshot untuk submit harus versi final.

**Total: 10 fase, 141 task** (1 opsional) — A: 4, B: 14, C: 6, D: 20, E: 8, G: 20, H: 19,
I: 21, J: 22, F: 7.

CI (`.github/workflows/ci.yml`) menjalankan lima job pada setiap push: validasi sintaks,
kebersihan repo, batasan dependency, audit `systemInstruction` terhadap `PG-09`, dan
keterlacakan requirement. Seluruhnya memakai alat bawaan Node dan git — tanpa `npm install`.
Alasan: `design.md` D-14.
