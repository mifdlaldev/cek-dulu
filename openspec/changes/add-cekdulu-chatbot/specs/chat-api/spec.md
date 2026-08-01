# Spec Delta — `chat-api`

Change: `add-cekdulu-chatbot`
Kapabilitas: endpoint `POST /api/chat` sebagai satu-satunya API proyek.

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

## Endpoint yang TIDAK dibuat

Kapabilitas ini hanya menyediakan `POST /api/chat`. Endpoint berikut milik proyek Sesi 2
(`gemini-flash-api`) dan **DILARANG** ditambahkan ke Final Project:

- `POST /generate-text`
- `POST /generate-from-image`
- `POST /generate-from-document`
- `POST /generate-from-audio`

Alasan: dependency Sesi 3 tidak memuat `multer` (S3 p.25), dan brief Final Project
meminta chatbot, bukan API multimodal.
