# SPEC-API.md — Spesifikasi Verbatim dari Slide

> Semua kode di file ini **disalin dari slide PDF**, bukan hasil karangan.
> Notasi sumber: `S1` = Sesi 1, `S2` = Sesi 2 - Materi Developers,
> `S3` = Sesi 3 - Materi Developers, `p.N` = halaman N.

---

## 1. STACK & VERSI

| Item | Nilai | Sumber |
|---|---|---|
| Runtime | Node.js v18+ | S2 p.8, p.19 |
| Versi demo di slide | `v23.7.0` (`node -v`) | S2 p.9, S3 p.9 |
| Module system | ESM — `"type": "module"` | S2 p.31, S3 p.26 |
| SDK Gemini | `@google/genai` `^1.10.0` | S2 p.31, S3 p.26 |
| Model | `gemini-2.5-flash` ⚠️ lihat catatan | S2 p.34, S3 p.28 |
| Port | `3000` | S2 p.34, S3 p.28 |
| Env var | `GEMINI_API_KEY` | S2 p.32, S3 p.27 |

> ⚠️ **Catatan model.** Nilai `gemini-2.5-flash` di tabel ini adalah nilai **verbatim dari
> materi**. Pada 1 Agustus 2026 model tersebut mengembalikan HTTP 404 untuk akun baru dengan
> pesan `no longer available to new users`. Implementasi repo ini memakai
> `gemini-flash-latest` sebagai nilai bawaan, dapat ditimpa lewat environment variable
> `GEMINI_MODEL`. Bukti mentah: `docs/KENDALA-API.md` §1. Keputusan: `design.md` D-15.
> Lihat juga `AGENTS.md` §3.7.

Perintah install SDK (S2 p.19):

```bash
npm install @google/genai
```

Contoh dari docs resmi yang dikutip slide (S2 p.20, sumber `https://ai.google.dev/gemini-api/docs/quickstart`):

```javascript
import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}

main();
```

Contoh `generateContent` (S2 p.21, sumber `https://ai.google.dev/gemini-api/docs/text-generation`):

```javascript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "How does AI work?",
  });
  console.log(response.text);
}

await main();
```

---

## 2. PROYEK SESI 2 — `gemini-flash-api`

### 2.1 Setup (S2 p.30)

```bash
mkdir gemini-flash-api
cd gemini-flash-api
npm init -y
npm install express dotenv @google/genai multer
```

Fungsi tiap dependency (S2 p.30):
- `express` — Menyiapkan REST API.
- `dotenv` — Memuat API key Gemini secara aman dari file `.env`.
- `@google/genai` — Menghubungkan aplikasi ke Gemini API (termasuk Flash 2.5).
- `multer` — Menangani proses upload (input gambar, audio, dokumen).

### 2.2 `package.json` (S2 p.31, verbatim dari screenshot)

```json
{
  "name": "gemini-flash-api",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "dependencies": {
    "@google/genai": "^1.10.0",
    "dotenv": "^17.2.0",
    "express": "^5.1.0",
    "multer": "^2.0.2"
  }
}
```

### 2.3 Struktur file (S2 p.32)

```
gemini-flash-api/
├── node_modules/
├── uploads/          <-- lihat AGENTS.md §3.3, kode aktual TIDAK pakai ini
├── .env
├── index.js
├── package-lock.json
└── package.json
```

`.env` (S2 p.32):

```
GEMINI_API_KEY=your_credential_key
```

### 2.4 Header `index.js` (S2 p.34, verbatim)

```javascript
import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';

const app = express();
const upload = multer();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GEMINI_MODEL = "gemini-2.5-flash";

app.use(express.json());

const PORT = 3000;
app.listen(PORT, () => console.log(`Server ready on http://localhost:${PORT}`));
```

Catatan: S2 p.35 menampilkan varian slide lain dengan `import fs from 'fs/promises';`,
`process.env.API_KEY`, dan `const PORT = process.env.PORT || 3000;`.
Lihat `AGENTS.md` §3.1 — repo ini pakai `GEMINI_API_KEY`.

Output terminal saat run (S2 p.40, p.44, p.48, p.53):

```
$ node index.js
Gemini API server is running at http://localhost:3000
```

### 2.5 Endpoint 1 — `POST /generate-text` (S2 p.39, verbatim)

```javascript
app.post('/generate-text', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
});
```

Uji (S2 p.41): `POST http://localhost:3000/generate-text`, Body → raw → JSON

```json
{
  "prompt": "Explain why the sky is blue in simple terms."
}
```

### 2.6 Endpoint 2 — `POST /generate-from-image` (S2 p.43, verbatim)

```javascript
app.post("/generate-from-image", upload.single("image"), async (req, res) => {
  const { prompt } = req.body;
  const base64Image = req.file.buffer.toString("base64");

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        { text: prompt, type: "text" },
        { inlineData: { data: base64Image, mimeType: req.file.mimetype } }
      ],
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
});
```

Uji (S2 p.45): Body → form-data, key `image` (File) + `prompt` (Text, contoh `Describe this image`).

### 2.7 Endpoint 3 — `POST /generate-from-document` (S2 p.47, verbatim)

```javascript
app.post("/generate-from-document", upload.single("document"), async (req, res) => {
  const { prompt } = req.body;
  const base64Document = req.file.buffer.toString("base64");

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        { text: prompt ?? "Tolong buat ringkasan dari dokumen berikut.", type: "text" },
        { inlineData: { data: base64Document, mimeType: req.file.mimetype } }
      ],
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
});
```

Uji (S2 p.49): Body → form-data, key `document` (File) → `.pdf`, `.txt`.

### 2.8 Endpoint 4 — `POST /generate-from-audio` (S2 p.52, verbatim)

```javascript
app.post("/generate-from-audio", upload.single("audio"), async (req, res) => {
  const { prompt } = req.body;
  const base64Audio = req.file.buffer.toString("base64");

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        { text: prompt ?? "Tolong buatkan transkrip dari rekaman berikut.", type: "text" },
        { inlineData: { data: base64Audio, mimeType: req.file.mimetype } }
      ],
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
});
```

Uji (S2 p.54): Body → form-data, key `audio` (File) → `.mp3`, `.wav`.
Catatan: slide p.54 salah tulis key sebagai `document`. Yang benar `audio` (lihat `AGENTS.md` §3.5).

### 2.9 Ringkasan File API (S2 p.56, verbatim)

> Pada implementasi ini, file diproses langsung dari memory buffer sesuai format input Gemini:
> - File gambar diambil dari `req.file.buffer`, dikonversi ke Base64, lalu dikirim ke Gemini sebagai `inlineData` bersama prompt teks untuk input multimodal.
> - File dokumen (PDF, TXT, dan sejenisnya) juga dikonversi ke Base64 dari buffer, dibungkus dalam objek `inlineData` dengan MIME type yang sesuai, lalu dikirim ke Gemini dengan prompt (atau instruksi default jika tidak ada).
> - File audio diproses dengan cara yang sama: dikonversi ke Base64 dari buffer dan dikirim sebagai `inlineData` bersama prompt seperti permintaan transkrip atau analisis audio.
>
> Setiap endpoint menangani pembacaan input, konversi Base64, pemanggilan model melalui `generateContent()`, dan mengembalikan hasil output ke client **tanpa perlu menghapus file karena tidak ada penyimpanan ke disk.**

### 2.10 Helper opsional `extractText()` (S2 p.58, dari Gemini Code Assist)

```javascript
function extractText(resp) {
  try {
    if (resp?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return resp.response.candidates[0].content.parts[0].text;
    }
    if (resp?.response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
      return resp.response.candidates[0].content.parts[0].inlineData.data;
    }
    if (resp?.response?.candidates?.[0]?.content?.text) {
      return resp.response.candidates[0].content.text;
    }
    if (resp?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return resp.candidates[0].content.parts[0].text;
    }
    return JSON.stringify(resp); // fallback: show all if unsure
  } catch (err) {
    return "";
  }
}
```

Bukan bagian kode utama. Kode utama slide pakai `response.text` langsung.

---

## 3. PROYEK SESI 3 — `gemini-chatbot-api`

### 3.1 Setup (S3 p.25)

```bash
mkdir gemini-chatbot-api
cd gemini-chatbot-api
npm init -y
npm install express dotenv cors @google/genai
```

Fungsi tiap dependency (S3 p.25):
- `express` — Menyiapkan REST API.
- `dotenv` — Memuat API key Gemini secara aman dari file `.env`.
- `@google/genai` — Menghubungkan aplikasi ke Gemini API (termasuk Gemini 2.5 Flash).
- `cors` — Mengizinkan request dari berbagai origin (domain) untuk mengakses endpoint pada server.

Catatan: **tidak ada `multer`** di proyek Sesi 3.

### 3.2 `package.json` (S3 p.26, verbatim)

```json
{
  "name": "gemini-chatbot-api",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "dependencies": {
    "@google/genai": "^1.10.0",
    "cors": "^2.8.5",
    "dotenv": "^17.2.0",
    "express": "^5.1.0"
  }
}
```

### 3.3 Struktur file (S3 p.27 & p.34)

```
gemini-chatbot-api/
├── node_modules/
├── public/
│   ├── index.html      <-- File HTML utama yang dirender di browser
│   ├── script.js       <-- Logika frontend, kirim input user ke API
│   └── style.css       <-- Tampilan UI antarmuka chatbot
├── .env
├── .gitignore
├── index.js
├── package-lock.json
└── package.json
```

### 3.4 `index.js` versi dasar (S3 p.28, verbatim)

```javascript
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GEMINI_MODEL = "gemini-2.5-flash";

app.use(cors());
app.use(express.json());

const PORT = 3000;
app.listen(PORT, () => console.log(`Server ready on http://localhost:${PORT}`));
```

### 3.5 `index.js` versi final + static (S3 p.43, verbatim)

```javascript
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from "@google/genai";

// ==== Tambahan setup __dirname untuk ESM (import style) ====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const GEMINI_MODEL = "gemini-2.5-flash";

app.use(cors());
app.use(express.json());

// ==== Tambahan middleware untuk serve file static (frontend) ====
// Serve all files in public_solution (HTML, JS, CSS) at root path
app.use(express.static(path.join(__dirname, 'public')));
```

> Slide asli p.43 menulis `process.env.API_KEY`. Repo ini pakai `GEMINI_API_KEY`
> agar konsisten dengan p.27/p.28 — lihat `AGENTS.md` §3.1.

### 3.6 Endpoint `POST /api/chat` (S3 p.29, verbatim)

```javascript
app.post('/api/chat', async (req, res) => {
  const { conversation } = req.body;
  try {
    if (!Array.isArray(conversation)) throw new Error('Messages must be an array!');

    const contents = conversation.map(({ role, text }) => ({
      role,
      parts: [{ text }]
    }));

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        temperature: 0.9,
        systemInstruction: "Jawab hanya menggunakan bahasa Indonesia.",
      },
    });
    res.status(200).json({ result: response.text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
})
```

Perhatikan: field body = **`conversation`**, item = **`{ role, text }`**.
Pesan error internal berbunyi `'Messages must be an array!'` (verbatim slide).

Output terminal (S3 p.30, p.44):

```
$ node index.js
Gemini Chatbot running on http://localhost:3000
```

### 3.7 Kontrak API `/api/chat`

Request (S3 p.31, screenshot Postman verbatim):

```json
{
  "conversation": [
    { "role": "user", "text": "Apa itu GEMINI API?" }
  ]
}
```

Response 200:

```json
{
  "result": "GEMINI API adalah **Antarmuka Pemrograman Aplikasi (Application Programming Interface)** yang memungkinkan para pengembang (developer) untuk **mengakses dan mengintegrasikan kemampuan model kecerdasan buatan (AI) Gemini dari Google** ke dalam aplikasi, situs web, atau layanan mereka sendiri. ..."
}
```

Response 500:

```json
{ "error": "<pesan error>" }
```

Role yang valid untuk Gemini `contents`: `"user"` dan `"model"` (S3 p.37).

### 3.8 Parameter konfigurasi Gemini (S3 p.21, verbatim)

| Parameter | Purpose | Value range |
|---|---|---|
| `temperature` | Mengontrol keacakan dalam output. Nilai lebih tinggi = lebih kreatif. | 0.0 – 2.0 |
| `top_k` | Membatasi respons pada top-K token yang paling mungkin | 1 – 40 |
| `top_p` | Menggunakan nucleus sampling untuk membatasi tingkat keacakan | 0.0 – 1.0 |

Contoh dari slide:
- Penulisan kreatif → `temperature: 0.9`
- Tanya jawab faktual → sekitar `0.2`

### 3.9 System Instruction (S3 p.22)

Fungsi System Instruction:
- **Menetapkan Persona** — contoh: `"Kamu adalah asisten pemrograman Python senior yang teliti."`
- **Mengatur Nada Bicara (Tone)** — contoh: `"Jawablah dengan gaya yang santai, humoris, dan menggunakan emoji."` / `"Jawablah dengan formal dan akademis."`
- **Memberikan Batasan (Constraints)** — contoh: `"Jangan pernah memberikan nasihat medis,"` / `"Jawab hanya dalam Bahasa Indonesia."`
- **Mengatur Format Output** — contoh: `"Selalu berikan jawaban dalam format JSON,"` / `"Sertakan tabel dalam setiap perbandingan."`

---

## 4. FRONTEND (S3 p.34–p.42)

### 4.1 Struktur HTML yang diasumsikan (S3 p.37, verbatim dari prompt)

```html
<form id="chat-form">
  <input type="text" id="user-input" />
  <button type="submit">Send</button>
</form>
<div id="chat-box"></div>
```

### 4.2 Starter code `script.js` (S3 p.40, verbatim)

```javascript
form.addEventListener('submit', function (e) {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  // Placeholder bot reply
  setTimeout(() => {
    appendMessage('bot', 'Gemini is thinking... (this is dummy response)');
  }, 1000);
});
```

### 4.3 Hasil Gemini Code Assist (S3 p.39 & p.42, verbatim dari screenshot)

```javascript
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  // Create a placeholder message that we can update later
  const botMessageElement = document.createElement('div');
  botMessageElement.classList.add('message', 'bot');
  botMessageElement.textContent = 'Gemini is thinking...';
  chatBox.appendChild(botMessageElement);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!response.ok) {
      // Try to get a more specific error from the server's JSON response
      const errorData = await response.json().catch(() => null); // Gracefully handle non-JSON error responses
      const errorMessage = errorData?.error || response.statusText;
      throw new Error(`Server error: ${errorMessage}`);
    }

    const data = await response.json();

    if (data && data.result) {
      botMessageElement.textContent = data.result;
    } else {
      botMessageElement.textContent = 'Sorry, no response received.';
    }
  } catch (error) {
    console.error('Error fetching response:', error);
    botMessageElement.textContent = 'Failed to get response from server.';
  } finally {
    // Ensure we scroll to the bottom after the final message is rendered
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  // ... (terpotong di slide)
}
```

> ⚠️ **BUG DI SLIDE:** kode ini kirim `{ messages: [{ role, content }] }`,
> tapi backend S3 p.29 baca `{ conversation: [{ role, text }] }`.
> **Payload yang benar:**
>
> ```javascript
> body: JSON.stringify({
>   conversation: [{ role: 'user', text: userMessage }],
> }),
> ```
>
> Lihat `AGENTS.md` §3.2.

### 4.4 Perilaku UI yang diminta (S3 p.37, verbatim dari prompt)

- Add the user's message to the chat box.
- Show a temporary "Thinking..." bot message.
- Send the user's message as a POST request to `/api/chat` (with JSON body above).
- When the response arrives, replace the "Thinking..." message with the AI's reply (from the `result` property).
- If an error occurs or no result is received, show `"Sorry, no response received."` or `"Failed to get response from server."`

### 4.5 Prompt lengkap untuk Gemini Code Assist (S3 p.37, verbatim)

```
I'm building a chatbot web app using Node.js + Express (backend) and Vanilla JavaScript (frontend).
My backend exposes a POST endpoint at /api/chat that expects a JSON body in this format:

{
    "conversation": [
          { "role": "user", "text": "<user_message>"},
          { "role": "model", "text": "<model_message>" },
          { "role": "user", "text": "<user_message>"}
    ]
}
The backend uses Google Gemini API to generate AI responses and returns a JSON object like:

{ "result": "<gemini_ai_response>" }

On the frontend, I have a form with a text input and a submit button. When the user submits the form, I want to:
- Add the user's message to the chat box.
- Show a temporary "Thinking..." bot message.
- Send the user's message as a POST request to /api/chat (with JSON body above).
- When the response arrives, replace the "Thinking..." message with the AI's reply (from the `result` property).
- If an error occurs or no result is received, show "Sorry, no response received." or "Failed to get response from server."

Can you help me write the complete script.js for the frontend (Vanilla JS, no frameworks) that covers this flow, including
proper error handling and DOM manipulation? Please make sure the code is simple and production-ready.

The HTML structure is:
<form id="chat-form">
  <input type="text" id="user-input" />
  <button type="submit">Send</button>
</form>
<div id="chat-box"></div>

Please provide the complete code for script.js only, matching the backend API spec above.
```

### 4.6 Tampilan UI target (S3 p.10, p.14, p.45)

- Judul halaman & heading: `Gemini AI Chatbot`
- Tab browser: `Gemini AI Chatbot`
- Diakses di `localhost:3000`
- Kartu chat tengah layar, area chat abu-abu, di bawahnya input `Type your message...` + tombol biru `Send`
- Bubble user rata kanan (biru muda), bubble bot rata kiri (hijau muda)
- Contoh isi starter code: bubble user `hi germini`, bubble bot `Gemini is thinking... (this is dummy response)`
- Input `required` → browser tampilkan `Please fill out this field.` jika kosong

---

## 5. ALUR KERJA CHATBOT (S3 p.17, sequence diagram verbatim)

```
User            Frontend (Browser)      Backend (Node.js + Express)      Gemini AI Model
 |  Type a message  ->  |                        |                             |
 |                      |  POST /api/chat with message  ->                     |
 |                      |                        |  generateContent(message) -> |
 |                      |                        |  <- AI-generated response    |
 |                      |  <- JSON { reply: response }                          |
 |  <- Display chatbot reply                     |                             |
```

Catatan: label diagram menulis `JSON { reply: response }`, tapi kode aktual
mengembalikan `{ result: ... }`. Ikuti kode → `result`.

Tiga langkah utama integrasi (S3 p.16, verbatim):
1. Mengambil input dari pengguna di sisi frontend.
2. Mengirim input tersebut ke layanan backend.
3. Menggunakan model AI untuk menghasilkan respons dan mengembalikannya ke pengguna.

---

## 6. `.gitignore` (S2 p.61 & S3 p.50, verbatim)

```
/node_modules
.env
package-lock.json
```

Alasan (verbatim slide):
> `/node_modules` dan `package-lock.json` dikecualikan karena folder dan file ini
> dapat di generate ulang dari file `package.json` dengan `npm install`.
> `.env` dikecualikan karena file ini berisi gemini api key yang sifatnya rahasia.

---

## 7. PERINTAH GIT (S3 p.51, verbatim)

```bash
git init                                                              # Inisialisasi Git di dalam folder projek
git add .                                                             # Menambahkan semua file ke area staging
git commit -m "Implementasi endpoint Gemini AI API"                   # Commit pertama dengan isi yang jelas
git branch -M main                                                    # Mengubah nama branch saat ini menjadi main
git remote add origin https://github.com/yourusername/your-repo-name.git  # Hubungkan ke remote repo
git push -u origin main                                               # Push kode ke repository GitHub
```

Versi S2 p.62 identik kecuali urutan: `git remote add` sebelum `git branch -M main`.

> Catatan: flag yang benar sebenarnya `git branch -M main` (huruf besar `-M` =
> force rename). Slide menulis `-M`, jadi tetap dipakai verbatim.
