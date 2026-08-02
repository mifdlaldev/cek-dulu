# Spec Delta — `chat-api`

Change: `add-cekdulu-chatbot`
Kapabilitas: endpoint API proyek — `POST /api/chat` untuk percakapan teks, dan
`POST /api/chat-with-file` untuk analisis lampiran gambar atau dokumen.

> **Amandemen — lampiran berkas.** Kapabilitas ini semula hanya menyediakan `POST /api/chat`.
> Atas permintaan pengguna, ditambahkan `POST /api/chat-with-file` untuk menerima gambar dan
> dokumen. `POST /api/chat` **tidak diubah sama sekali**, sehingga `API-01` s.d. `API-06` tetap
> berlaku apa adanya dan 17 skenario uji yang sudah lulus tidak perlu diulang. Requirement baru:
> `API-07`, `API-08`. Keputusan: `design.md` D-24. Dua non-goal dicabut terbuka di
> `proposal.md` §3.

---

## ADDED Requirements

### `API-01` — Endpoint menerima field `conversation`

| Meta | Nilai |
|---|---|
| Sumber | S3 p.29 (kode), S3 p.31 (screenshot Postman) |
| Berkas | `index.js` |

Sistem WAJIB menyediakan route `POST /api/chat`.

Body request WAJIB dibaca dari field **`conversation`** berupa array objek dengan bentuk
`{ role, text }`.

Nilai `role` yang valid adalah `"user"` dan `"model"`.

> **Perangkap yang wajib dihindari.** Narasi slide S3 p.29 menyebut "array `messages`" dan
> contoh `script.js` di S3 p.39/p.42 mengirim `{ messages: [{ role, content }] }`. Kedua
> hal itu **tidak cocok** dengan kode backend yang membaca `const { conversation } = req.body`.
> Kode menang atas narasi. Keputusan di `AGENTS.md` §3.2.

#### Scenario: body valid satu pesan
- **Given** server berjalan
- **When** client mengirim `POST /api/chat` dengan body
  `{"conversation":[{"role":"user","text":"Apa itu pinjol ilegal?"}]}`
- **Then** server merespons `200`
- **And** body respons berbentuk `{ "result": "<teks jawaban>" }`

#### Scenario: field bernama `messages` tidak dikenali
- **Given** server berjalan
- **When** client mengirim body `{"messages":[{"role":"user","content":"halo"}]}`
- **Then** `conversation` bernilai `undefined`
- **And** server merespons `500` dengan `{ "error": "Messages must be an array!" }`

---

### `API-02` — Validasi bahwa `conversation` adalah array

| Meta | Nilai |
|---|---|
| Sumber | S3 p.29 (`if (!Array.isArray(conversation)) throw new Error('Messages must be an array!')`) |
| Berkas | `index.js` |

Sistem WAJIB memvalidasi bahwa `conversation` adalah array sebelum diproses.

Bila bukan array, sistem WAJIB melempar `Error` dengan pesan verbatim
**`Messages must be an array!`** — pesan ini disalin apa adanya dari slide, termasuk kata
"Messages" meski field-nya bernama `conversation`.

#### Scenario: body kosong
- **When** client mengirim `POST /api/chat` dengan body `{}`
- **Then** server merespons `500`
- **And** body respons adalah `{ "error": "Messages must be an array!" }`

#### Scenario: `conversation` bukan array
- **When** client mengirim body `{"conversation":"halo"}`
- **Then** server merespons `500`
- **And** body respons adalah `{ "error": "Messages must be an array!" }`

---

### `API-03` — Transformasi ke format `contents` Gemini

| Meta | Nilai |
|---|---|
| Sumber | S3 p.29 |
| Berkas | `index.js` |

Sistem WAJIB memetakan setiap item `conversation` ke format yang dipahami Gemini:

```javascript
const contents = conversation.map(({ role, text }) => ({
  role,
  parts: [{ text }]
}));
```

Field `text` berubah menjadi `parts: [{ text }]`. Field `role` diteruskan apa adanya.

#### Scenario: riwayat multi-turn dipetakan utuh
- **Given** `conversation` berisi tiga item dengan role berurutan `user`, `model`, `user`
- **When** transformasi dijalankan
- **Then** `contents` berisi tiga item dengan urutan role yang sama
- **And** setiap item memiliki `parts` berupa array dengan satu objek `{ text }`

---

### `API-04` — Pemanggilan model melalui `generateContent()`

| Meta | Nilai |
|---|---|
| Sumber | S3 p.29 |
| Berkas | `index.js` |

Sistem WAJIB memanggil `await ai.models.generateContent({ model, contents, config })`
dengan `model` bernilai konstanta `GEMINI_MODEL` (`WS-02`).

Isi `config` diatur oleh kapabilitas `persona-guardrail` (`PG-01`, `PG-08`).

Sistem WAJIB mengambil hasil teks dari properti `response.text`.

Helper `extractText()` yang muncul di S2 p.58 **TIDAK dipakai** — itu berasal dari
screenshot Gemini Code Assist, bukan kode utama slide. Keputusan di `AGENTS.md` §3.6.

#### Scenario: pemanggilan berhasil
- **Given** `contents` valid dan API key benar
- **When** `generateContent()` dipanggil
- **Then** hasil teks diambil dari `response.text`
- **And** teks tersebut dikirim ke client sebagai nilai `result`

---

### `API-05` — Bentuk respons sukses

| Meta | Nilai |
|---|---|
| Sumber | S3 p.29 (`res.status(200).json({ result: response.text })`) |
| Berkas | `index.js` |

Respons sukses WAJIB berstatus `200` dan berbentuk `{ result: <string> }`.

Nama field WAJIB `result` — **bukan** `output`, **bukan** `reply`.

> Catatan konflik: screenshot Postman S2 p.41/45/49/54 menampilkan `{"output": ...}` dan
> diagram alur S3 p.17 menulis `JSON { reply: response }`. Keduanya tidak sesuai kode.
> Keputusan: `result`. Lihat `AGENTS.md` §3.4.

#### Scenario: field respons benar
- **When** permintaan berhasil diproses
- **Then** status HTTP adalah `200`
- **And** body memiliki tepat satu field bernama `result`

---

### `API-06` — Penanganan error

| Meta | Nilai |
|---|---|
| Sumber | S3 p.29 (`catch (e) { res.status(500).json({ error: e.message }) }`) |
| Berkas | `index.js` |

Seluruh logika handler WAJIB dibungkus `try...catch`.

Pada error apa pun, sistem WAJIB merespons status `500` dengan body
`{ error: <pesan error> }`.

Nama field error WAJIB `error` — pada endpoint Sesi 3 field-nya `error`, berbeda dari
endpoint Sesi 2 yang memakai `message` (S2 p.39). Karena Final Project adalah chatbot
Sesi 3, yang dipakai adalah `error`.

Sistem TIDAK BOLEH membocorkan nilai `GEMINI_API_KEY` melalui pesan error (`WS-01`).

#### Scenario: kegagalan pemanggilan model
- **Given** API key tidak valid atau jaringan gagal
- **When** client mengirim request valid
- **Then** server merespons `500`
- **And** body berbentuk `{ "error": "<pesan>" }`
- **And** pesan tidak memuat nilai API key

#### Scenario: server tidak crash saat error
- **Given** terjadi error pada pemanggilan model
- **When** error tertangkap
- **Then** proses server tetap berjalan dan siap menerima request berikutnya

---

### `API-07` — Endpoint lampiran gambar dan dokumen

| Meta | Nilai |
|---|---|
| Sumber | S2 p.43 (kode verbatim `upload.single("image")`), S2 p.47 (`upload.single("document")`), S2 p.30 (fungsi `multer`), S2 p.56 (memory buffer); mekanisme penggabungan ke riwayat **tanpa sumber halaman** — `design.md` D-24a |
| Berkas | `index.js` |
| Uji | UJI-18, UJI-19, UJI-20, UJI-21 |
| Terkait | `API-08`, `PG-10`, `UI-16`, `UI-17` |

> **Catatan keterlacakan.** Materi menyediakan kode upload berkas, tetapi **tidak pernah**
> menunjukkan berkas digabungkan ke percakapan multi-turn. Bagian itu keputusan sendiri dan
> **tidak diklaim verbatim**. Alasan lengkap beserta tiga alternatif yang ditolak: `design.md`
> D-24.

Sistem WAJIB menyediakan route `POST /api/chat-with-file` yang menerima `multipart/form-data`.

**Field yang dibaca**

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `file` | File | ya | Gambar atau dokumen yang dianalisis |
| `prompt` | Text | tidak | Pertanyaan pengguna. Bila kosong, dipakai instruksi bawaan |

Berkas WAJIB dibaca dari **memory buffer** (`req.file.buffer`), bukan dari disk. S2 p.56
menyatakan "file diproses langsung dari memory buffer ... tanpa perlu menghapus file karena
tidak ada penyimpanan ke disk". DILARANG membuat folder `uploads/`.

Payload ke model WAJIB memakai bentuk `inlineData` seperti S2 p.43:

```javascript
contents: [
  { text: prompt },
  { inlineData: { data: base64, mimeType: req.file.mimetype } }
]
```

Konfigurasi model WAJIB memakai ulang konstanta yang sama dengan `/api/chat` —
`GEMINI_MODEL`, `TEMPERATURE`, `TOP_P`, `TOP_K`, dan `SYSTEM_INSTRUCTION`. DILARANG
menduplikasi naskah persona, karena `PG-*` harus tetap satu sumber kebenaran.

**Bentuk respons** sama dengan `/api/chat`: sukses `200 { result }`, gagal `500 { error }`.
Field error WAJIB bernama `error`, bukan `message` seperti S2 p.39 — proyek ini adalah proyek
Sesi 3 dan `API-06` mewajibkan `error`.

**`POST /api/chat` DILARANG diubah** oleh requirement ini. Bila keduanya perlu berubah bersama,
yang diubah adalah konstanta bersama, bukan kontrak salah satu endpoint.

#### Scenario: gambar dianalisis
- **Given** server berjalan
- **When** client mengirim `POST /api/chat-with-file` dengan `multipart/form-data` berisi
  `file` sebuah gambar PNG dan `prompt` sebuah pertanyaan
- **Then** server merespons `200`
- **And** body respons berbentuk `{ "result": "<teks jawaban>" }`

#### Scenario: dokumen PDF dianalisis
- **When** client mengirim `file` berupa PDF
- **Then** server merespons `200` dengan `{ result }`

#### Scenario: prompt kosong memakai instruksi bawaan
- **When** client mengirim `file` tanpa field `prompt`
- **Then** server tetap merespons `200`
- **And** model menerima instruksi bawaan, mengikuti pola `prompt ?? "..."` pada S2 p.47

#### Scenario: persona tetap berlaku
- **When** berkas dianalisis
- **Then** jawaban mengikuti seluruh aturan `PG-*` yang sama dengan `/api/chat`
- **And** naskah persona tidak diduplikasi di dalam kode

#### Scenario: endpoint teks tidak terpengaruh
- **When** `POST /api/chat` dipanggil seperti sebelumnya
- **Then** perilakunya identik dengan sebelum requirement ini ada

---

### `API-08` — Validasi berkas unggahan

| Meta | Nilai |
|---|---|
| Sumber | `design.md` D-24d (tiga bug kode materi), D-24e (MIME tidak dapat dipercaya) |
| Berkas | `index.js` |
| Uji | UJI-21 |
| Terkait | `API-06`, `API-07` |

Seluruh jalur gagal WAJIB mengembalikan `500 { error }`, **bukan** halaman HTML bawaan Express.
Ini memperluas `API-06` ke jalur multipart.

**Empat jalur gagal yang WAJIB ditangani**

| Jalur | Penyebab | Penanganan |
|---|---|---|
| Berkas tidak dikirim | `req.file` bernilai `undefined` | Validasi eksplisit di dalam `try`, lempar galat bermakna |
| MIME tidak diizinkan | Tipe di luar allowlist | Tolak sebelum memanggil model |
| Berkas terlalu besar | Melebihi batas `multer` | Error handler Express khusus multipart |
| Galat model | Kuota, jaringan, atau model | `try`/`catch` seperti `API-06` |

**Pembacaan buffer WAJIB berada di dalam blok `try`.** Kode S2 p.43 menempatkan
`req.file.buffer.toString("base64")` **sebelum** `try`; bila berkas tidak ada, barisnya melempar
`TypeError` yang tidak tertangkap dan Express membalas HTML. Ini penyimpangan yang disengaja
dari verbatim, dicatat di D-24d.

**Galat `multer` terjadi di middleware, sebelum handler.** `try` di dalam handler tidak akan
menyentuhnya. Karena itu WAJIB ada error handler Express bertanda tangan empat argumen yang
mengubahnya menjadi `500 { error }`.

**Allowlist MIME sisi server** yang WAJIB diterapkan:

| MIME | Keterangan |
|---|---|
| `image/png` | tangkapan layar |
| `image/jpeg` | foto |
| `image/webp` | tangkapan layar modern |
| `application/pdf` | dokumen, diuji materi S2 p.49 |
| `text/plain` | dokumen teks, diuji materi S2 p.49 |

Selain kelima tipe itu WAJIB ditolak.

**Batas ukuran berkas: 4 MB.** Permintaan inline Gemini dibatasi di orde 20 MB dan base64
menambah sekitar 33%, sehingga batas praktis jauh di bawah batas teknis.

`req.file.mimetype` berasal dari header yang dikirim klien dan **dapat dipalsukan**. Allowlist
ini mengurangi risiko, bukan menghilangkannya. Validasi magic byte menuntut dependency di luar
daftar materi, sehingga tidak dikerjakan — keterbatasannya WAJIB dicatat apa adanya di
`SECURITY.md`, dan DILARANG diklaim aman.

#### Scenario: berkas tidak dikirim
- **When** client mengirim `POST /api/chat-with-file` tanpa field `file`
- **Then** server merespons `500`
- **And** body berbentuk `{ "error": "..." }`, bukan halaman HTML

#### Scenario: MIME tidak diizinkan
- **When** client mengirim berkas bertipe di luar allowlist
- **Then** server merespons `500` dengan `{ error }`
- **And** model TIDAK dipanggil, sehingga kuota tidak terpakai

#### Scenario: berkas melebihi batas ukuran
- **When** client mengirim berkas lebih besar daripada batas
- **Then** server merespons `500` dengan `{ error }`
- **And** responsnya JSON, bukan halaman HTML bawaan Express

#### Scenario: server tetap berjalan
- **Given** salah satu jalur gagal terjadi
- **When** galat tertangkap
- **Then** proses server tetap berjalan dan siap menerima request berikutnya

---

## Endpoint yang TIDAK dibuat

Kapabilitas ini menyediakan **dua** endpoint: `POST /api/chat` dan
`POST /api/chat-with-file`. Endpoint berikut milik proyek Sesi 2 (`gemini-flash-api`) dan
**DILARANG** ditambahkan:

| Endpoint | Alasan |
|---|---|
| `POST /generate-text` | Duplikat `POST /api/chat` tanpa riwayat percakapan |
| `POST /generate-from-image` | Kapabilitasnya sudah dilayani `API-07` di dalam bentuk chatbot |
| `POST /generate-from-document` | Sama seperti di atas |
| `POST /generate-from-audio` | Audio ditolak — alasan di `design.md` D-24b dan `proposal.md` §3 |

Brief Final Project S3 p.49 meminta **chatbot**, bukan API multimodal. `API-07` menambah
kapabilitas berkas **ke dalam** chatbot, tidak mengubah bentuknya menjadi API Sesi 2.
