# Tasks — add-cekdulu-chatbot

Checklist implementasi. Dikerjakan **berurutan**. Setiap task merujuk requirement ID.

> **Aturan:** dilarang menulis kode yang tidak punya requirement. Bila di tengah jalan
> ternyata spec kurang, **perbaiki spec dulu**, baru lanjut koding
> (`docs/METODOLOGI.md` §6).

---

## Fase A — Inisialisasi proyek

- [ ] **A1.** Root repo: jalankan `npm init -y` lalu ubah `package.json` — tambah
  `"type": "module"`, set `"name": "cek-dulu"`, pastikan `"main": "index.js"`
  → expect `package.json` valid dengan `"type": "module"`
  · Ref: `project.md` (stack), S2 p.31 & S3 p.26

- [ ] **A2.** Root repo: `npm install express@^5.1.0 dotenv@^17.2.0 cors@^2.8.5 @google/genai@^1.10.0`
  → expect keempat dependency masuk `package.json`, **tanpa** paket lain
  · Ref: S3 p.25, p.26

- [ ] **A3.** Root repo: buat `.env` berisi `GEMINI_API_KEY=<nilai dari user>`
  → expect file ada, **tidak** ter-track git
  · Ref: `WS-01`
  · ⚠️ **Nilai key diisi oleh user, bukan oleh agent.** Agent tidak boleh menulis atau
    meng-echo nilai key.

- [ ] **A4.** Verifikasi `git status` (jika repo sudah git init): `.env` tidak muncul
  sebagai untracked yang akan di-commit
  → expect `.env` terabaikan oleh `.gitignore`
  · Ref: Gate 5

---

## Fase B — Backend `index.js`

- [ ] **B1.** `index.js`: tulis blok import — `'dotenv/config'`, `express`, `cors`, `path`,
  `{ fileURLToPath }` dari `'url'`, `{ GoogleGenAI }` dari `'@google/genai'`
  → expect urutan import sesuai pola S3 p.43
  · Ref: `WS-01`, `WS-02`, `WS-03`, `WS-04`

- [ ] **B2.** `index.js`: bentuk `__filename` dan `__dirname` untuk ESM dengan
  `fileURLToPath(import.meta.url)` dan `path.dirname()`
  → expect `__dirname` tersedia sebagai konstanta
  · Ref: `WS-04`

- [ ] **B3.** `index.js`: inisialisasi `const app = express()`,
  `const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })`,
  `const GEMINI_MODEL = "gemini-2.5-flash"`
  → expect satu instance client, satu konstanta model
  · Ref: `WS-02`

- [ ] **B4.** `index.js`: pasang `app.use(cors())`, `app.use(express.json())`,
  `app.use(express.static(path.join(__dirname, 'public')))`
  → expect ketiga middleware terpasang dalam urutan tersebut
  · Ref: `WS-03`, `WS-04`

- [ ] **B5.** `index.js`: definisikan konstanta `SYSTEM_INSTRUCTION` berisi naskah verbatim
  dari `specs/persona-guardrail/spec.md` bagian "Naskah `systemInstruction` yang terikat spec"
  → expect naskah persis sama, tidak diringkas, tidak diparafrase
  · Ref: `PG-03`, `PG-04`, `PG-05`, `PG-06`, `PG-07`, `PG-08`, `PG-09`
  · ⚠️ Setelah menulis, audit isi naskah: **tidak boleh** ada angka statistik, nomor
    telepon, email, URL, nama perusahaan, atau nomor peraturan (`PG-09`)

- [ ] **B6.** `index.js`: tulis route `app.post('/api/chat', async (req, res) => {...})` —
  destructure `conversation` dari `req.body`, bungkus `try...catch`
  → expect route terdaftar
  · Ref: `API-01`, `API-06`

- [ ] **B7.** `index.js` di dalam route: validasi
  `if (!Array.isArray(conversation)) throw new Error('Messages must be an array!')`
  → expect pesan error verbatim, termasuk tanda seru
  · Ref: `API-02`

- [ ] **B8.** `index.js` di dalam route: map ke
  `contents = conversation.map(({ role, text }) => ({ role, parts: [{ text }] }))`
  → expect transformasi sesuai S3 p.29
  · Ref: `API-03`

- [ ] **B9.** `index.js` di dalam route: panggil `await ai.models.generateContent({ model: GEMINI_MODEL, contents, config: { temperature: 0.3, topP: 0.8, topK: 30, systemInstruction: SYSTEM_INSTRUCTION } })`
  → expect keempat field config terkirim, nilai sesuai `PG-02`
  · Ref: `API-04`, `PG-01`, `PG-02`

- [ ] **B10.** `index.js` di dalam route: balas sukses
  `res.status(200).json({ result: response.text })`
  → expect field bernama `result`, bukan `output`/`reply`
  · Ref: `API-05`

- [ ] **B11.** `index.js` di dalam blok catch: balas
  `res.status(500).json({ error: e.message })`
  → expect field bernama `error`
  · Ref: `API-06`

- [ ] **B12.** `index.js`: `const PORT = 3000` dan `app.listen(PORT, () => console.log(...))`
  dengan log memuat `http://localhost:3000`
  → expect log muncul, **tanpa** nilai API key
  · Ref: `WS-05`

- [ ] **B13.** Jalankan `node index.js`
  → expect proses tidak keluar dengan error, log URL muncul
  · Ref: **Gate 2**
  · Tempel output terminal apa adanya sebagai bukti

---

## Fase C — Uji backend sebelum frontend

- [ ] **C1.** `curl -i -X POST http://localhost:3000/api/chat -H 'Content-Type: application/json' -d '{"conversation":[{"role":"user","text":"halo"}]}'`
  → expect `HTTP/1.1 200` + body `{"result":"..."}`
  · Ref: **Gate 3**, `API-01`, `API-04`, `API-05`

- [ ] **C2.** `curl -i -X POST http://localhost:3000/api/chat -H 'Content-Type: application/json' -d '{}'`
  → expect `HTTP/1.1 500` + body `{"error":"Messages must be an array!"}`
  · Ref: **Gate 3**, `API-02`, `API-06`, UJI-11

- [ ] **C3.** `curl -i -X POST http://localhost:3000/api/chat -H 'Content-Type: application/json' -d '{"conversation":[{"role":"user","text":"Apakah aplikasi Pinjam Cepat Jaya itu legal?"}]}'`
  → expect `200`, dan isi `result` **TIDAK** menyatakan aplikasi tersebut legal/ilegal;
    berisi arahan verifikasi mandiri
  · Ref: **`PG-03`**, UJI-03
  · ⛔ **Bila bot menyatakan legal atau ilegal → STOP. Perkuat `SYSTEM_INSTRUCTION`, ulangi C3.**

- [ ] **C4.** `curl` dengan riwayat 3 item (`user` → `model` → `user`) yang merujuk jawaban
  sebelumnya
  → expect `200` dan jawaban menyambung konteks, bukan mengulang dari nol
  · Ref: `API-03`, UJI-08

---

## Fase D — Frontend `public/`

- [ ] **D1.** Buat folder `public/`
  → expect folder ada
  · Ref: `WS-04`, `UI-01`

- [ ] **D2.** `public/index.html`: kerangka halaman — judul bot, `#chat-box`, `#chat-form`
  dengan `#user-input` (`required` + placeholder) dan tombol submit; link `style.css` dan
  `script.js`
  → expect ketiga ID ada di DOM
  · Ref: `UI-01`

- [ ] **D3.** `public/index.html`: pesan pembuka statis di dalam `#chat-box` — perkenalan
  bot, kemampuan, batasan singkat
  → expect satu bubble bot terlihat saat halaman dibuka, **tanpa** request API
  · Ref: `UI-07`

- [ ] **D4.** `public/index.html`: disclaimer permanen — sifat edukatif, bot tidak menilai
  legalitas entitas, keputusan akhir milik pengguna
  → expect disclaimer terlihat tanpa interaksi
  · Ref: `UI-08`

- [ ] **D5.** `public/index.html`: blok kanal resmi OJK statis — `157`,
  `081 157 157 157`, `konsumen@ojk.go.id`, `satgaspasti@ojk.go.id`
  → expect keempat nilai persis sesuai `UI-09`
  · Ref: `UI-09`
  · Salin dari `docs/RISET-LAPANGAN.md` §7, jangan dari ingatan

- [ ] **D6.** `public/style.css`: layout kartu chat, `#chat-box` tinggi terbatas +
  `overflow-y: auto`, pembeda visual bubble user vs bot, `white-space: pre-wrap`,
  responsif untuk layar ponsel
  → expect pesan panjang membungkus rapi, tidak meluber, tidak ada scroll horizontal
  · Ref: `UI-10`, D-07

- [ ] **D7.** `public/script.js`: ambil referensi `#chat-form`, `#user-input`, `#chat-box`;
  siapkan array `conversation = []` di scope modul
  → expect array kosong saat halaman dimuat
  · Ref: `UI-04`

- [ ] **D8.** `public/script.js`: fungsi `appendMessage(sender, text)` yang membuat elemen,
  set kelas sesuai peran, isi dengan **`textContent`**, append ke `#chat-box`, scroll ke bawah
  → expect fungsi mengembalikan elemen yang dibuat (agar bisa diganti isinya oleh `UI-05`)
  · Ref: `UI-02`, `UI-05`, D-07
  · ⚠️ **Wajib `textContent`, bukan `innerHTML`** — mencegah XSS

- [ ] **D9.** `public/script.js`: handler `submit` — `e.preventDefault()`, trim input,
  return bila kosong, `appendMessage('user', ...)`, push `{ role:'user', text }` ke array
  `conversation`, kosongkan input
  → expect pesan tampil dan array bertambah
  · Ref: `UI-02`, `UI-04`

- [ ] **D10.** `public/script.js`: tambahkan bubble bot sementara berisi indikator berpikir,
  simpan referensi elemennya; nonaktifkan tombol submit
  → expect satu bubble sementara muncul
  · Ref: `UI-05`

- [ ] **D11.** `public/script.js`: `fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ conversation }) })`
  → expect body memakai field **`conversation`** dengan item `{ role, text }`
  · Ref: `UI-03`, `API-01`
  · ⚠️ **JANGAN** salin `{ messages: [{ role, content }] }` dari slide S3 p.39 — itu bug.
    Lihat `design.md` D-03

- [ ] **D12.** `public/script.js`: proses respons — bila `data.result` ada, isi bubble
  sementara dengan nilainya lalu push `{ role:'model', text: data.result }` ke `conversation`;
  bila tidak ada, tampilkan `Sorry, no response received.` **tanpa** push ke array
  → expect riwayat hanya berisi jawaban asli bot
  · Ref: `UI-04`, `UI-06`

- [ ] **D13.** `public/script.js`: blok `catch` → isi bubble sementara dengan
  `Failed to get response from server.`, **tanpa** push ke `conversation`; blok `finally` →
  aktifkan kembali tombol submit dan scroll `#chat-box` ke bawah
  → expect UI tetap responsif setelah error, riwayat tidak tercemar
  · Ref: `UI-06`

- [ ] **D14.** (Opsional, bila waktu memungkinkan) `public/index.html` + `script.js`:
  quick-reply chips berisi 2–3 contoh pertanyaan yang mengisi input saat diklik
  → expect klik chip mengisi `#user-input`
  · Ref: S2 p.67 (pola batch sebelumnya)
  · Task opsional — tidak memblokir gate mana pun

---

## Fase E — Gate verifikasi

- [ ] **E1.** **Gate 1 — Keterlacakan.** Periksa `design.md` §3: semua 30 requirement punya
  kolom sumber terisi; tidak ada kode di `index.js` / `script.js` yang tidak dirujuk
  requirement mana pun
  → expect nol requirement tanpa sumber, nol kode tanpa requirement
  · Cek juga: semua 30 ID (`WS-01`..`WS-05`, `API-01`..`API-06`, `PG-01`..`PG-09`,
    `UI-01`..`UI-10`) sudah tercentang di Fase B dan D

- [ ] **E2.** **Gate 2 — Server hidup.** `node index.js`, tempel output terminal
  → expect log URL, tanpa error, tanpa nilai API key

- [ ] **E3.** **Gate 3 — Kontrak API.** Ulangi C1 dan C2, tempel status + body apa adanya
  → expect `200 {result}` dan `500 {"error":"Messages must be an array!"}`

- [ ] **E4.** **Gate 4 — Guardrail & UI.** Buka `http://localhost:3000/` di browser
  sungguhan. Jalankan **12 skenario** `docs/USE-CASE-CEKDULU.md` §5 satu per satu. Catat
  lulus/gagal + kutipan jawaban bot untuk tiap skenario
  → expect 12/12 lulus; **UJI-03 lulus mutlak**
  · ⛔ UJI-03 gagal → perkuat `SYSTEM_INSTRUCTION`, ulangi seluruh Gate 4

- [ ] **E5.** **Gate 4b — Console browser.** Selama Gate 4, buka DevTools Console
  → expect nol error JavaScript, nol 404 aset

- [ ] **E6.** **Gate 5 — Kebersihan repo.** Periksa: `.env` tidak ter-track;
  `package.json` hanya berisi 4 dependency; tidak ada file temporer; nilai API key tidak
  muncul di file mana pun yang akan di-commit
  → expect `git status` bersih dari `.env`; tempel isi `dependencies` dari `package.json`

---

## Fase F — Persiapan submit

- [ ] **F1.** `README.md`: perbarui bagian Status — tandai backend dan frontend selesai,
  cantumkan use case terpilih
  → expect status mencerminkan kondisi nyata

- [ ] **F2.** Ambil screenshot UI — minimal tiga kondisi: halaman awal dengan disclaimer,
  percakapan berjalan (UJI-02), dan bot menolak menilai legalitas (UJI-03)
  → expect tiga gambar tersedia

- [ ] **F3.** Gabungkan screenshot ke **satu file** PDF atau image, kompres di bawah
  **1 MB**
  → expect satu file ≤ 1 MB
  · Ref: `docs/FINAL-PROJECT.md` §3.1 field #10

- [ ] **F4.** Siapkan jawaban form dari `docs/USE-CASE-CEKDULU.md` §2 — Nama project
  (`Cek Dulu`), target pengguna, cara membantu pengguna
  → expect ketiga jawaban siap disalin

- [ ] **F5.** Push ke GitHub (**hanya setelah user meminta eksplisit**), pastikan `.env`
  tidak ikut
  → expect repo publik/privat berisi kode tanpa `.env`
  · ⚠️ **Commit dan push memerlukan izin eksplisit user** (`AGENTS.md` §1.2)

- [ ] **F6.** **Fase 5 metodologi — arsip spec.** Pindahkan isi
  `openspec/changes/add-cekdulu-chatbot/specs/*/spec.md` menjadi spec aktif di
  `openspec/specs/<kapabilitas>/spec.md`, hapus penanda `## ADDED Requirements`
  → expect `openspec/specs/` berisi 4 kapabilitas sebagai kebenaran perilaku sistem saat ini
  · Ref: `docs/METODOLOGI.md` §3 Fase 5

---

## Ringkasan urutan

```
A (setup) → B (backend) → C (uji backend via curl) → D (frontend)
          → E (5 gate verifikasi) → F (submit)
```

Alasan C sebelum D: memastikan backend dan guardrail benar **sebelum** menulis frontend.
Kalau `PG-03` gagal, memperbaikinya lebih murah saat frontend belum ada.

**Total: 6 fase, 36 task** (1 opsional).
