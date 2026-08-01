// Cek Dulu — chatbot edukasi kewaspadaan keuangan digital.
//
// Berkas ini adalah pengendali utama (central controller) aplikasi: menginisialisasi
// server Express, menyajikan aset frontend, dan mendefinisikan satu endpoint API.
// Struktur satu berkas dipilih secara sadar; alasannya tercatat di
// openspec/changes/add-cekdulu-chatbot/design.md keputusan D-01 dan D-14.
//
// Requirement yang diimplementasikan berkas ini:
//   WS-01 .. WS-05  penyiapan server dan aset statis
//   API-01 .. API-06 kontrak POST /api/chat
//   PG-01 .. PG-09   persona, parameter, dan guardrail model
//
// Spesifikasi lengkap: openspec/changes/add-cekdulu-chatbot/specs/

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

// ==== Setup __dirname untuk ESM ==== (WS-04)
// ESM tidak menyediakan __dirname secara bawaan. Pola ini mengikuti materi Sesi 3 p.43.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ==== Client Gemini dan model terpusat ==== (WS-01, WS-02)
// Nama model disimpan dalam satu konstanta agar dapat diganti di satu tempat.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const GEMINI_MODEL = 'gemini-2.5-flash';

// ==== Parameter generasi ==== (PG-02)
// Nilai dipilih berdasarkan panduan materi Sesi 3 p.21: nilai temperature rendah
// untuk tanya jawab faktual. Dipilih 0.3, bukan 0.9 seperti contoh slide, karena
// domain ini menuntut presisi. Justifikasi lengkap: design.md keputusan D-04.
const TEMPERATURE = 0.3;
const TOP_P = 0.8;
const TOP_K = 30;

// ==== Persona dan guardrail ==== (PG-03 s.d. PG-09)
// Naskah ini disalin verbatim dari
// openspec/changes/add-cekdulu-chatbot/specs/persona-guardrail/spec.md
// Perubahan naskah WAJIB melalui pembaruan spec tersebut lebih dahulu.
//
// Pemetaan bagian naskah ke requirement:
//   PG-05  paragraf pembuka (persona) dan blok BAHASA DAN NADA
//   PG-03  larangan menyatakan entitas legal atau ilegal — gate mutlak proyek ini
//   PG-06  larangan nasihat hukum, investasi, medis, dan pertanyaan di luar domain
//   PG-04  larangan menyebut statistik, nomor kontak, tautan, dan nomor peraturan
//   PG-07  pengingat agar pengguna tidak membagikan data pribadi
//   PG-08  blok CARA MENJAWAB — urutan jawaban dan kalimat penutup
//   PG-09  keseluruhan naskah bebas angka dan nama entitas
//
// PG-09 melarang naskah memuat data yang berubah: angka statistik, nomor kontak,
// alamat surel, tautan, maupun nomor peraturan. Data presisi ditulis statis pada
// antarmuka oleh requirement UI-09. Larangan ini ditegakkan otomatis oleh CI job
// prompt-audit pada .github/workflows/ci.yml
const SYSTEM_INSTRUCTION = `Kamu adalah "Cek Dulu", asisten edukasi kewaspadaan keuangan digital untuk masyarakat
Indonesia. Tugasmu membantu pengguna mengenali ciri-ciri tawaran pinjaman, investasi,
atau pesan yang berpotensi merugikan, serta menjelaskan cara memeriksanya secara mandiri.

BAHASA DAN NADA
- Jawab hanya dalam Bahasa Indonesia.
- Gunakan bahasa sehari-hari yang sederhana. Hindari jargon keuangan; jika harus dipakai,
  jelaskan artinya.
- Bersikap tenang dan membantu. Jangan menakut-nakuti secara berlebihan.
- Jika pengguna mengaku sudah menjadi korban, tunjukkan empati lebih dahulu dan jangan
  sekali-kali menghakimi atau menyalahkan mereka.

BATASAN YANG TIDAK BOLEH DILANGGAR
- JANGAN PERNAH menyatakan bahwa sebuah perusahaan, aplikasi, platform, atau nama entitas
  tertentu itu legal, resmi, terdaftar, aman, ilegal, atau penipu. Kamu tidak memiliki
  akses ke daftar resmi dan data legalitas terus berubah. Selalu arahkan pengguna untuk
  memeriksa sendiri melalui kanal resmi Otoritas Jasa Keuangan.
- JANGAN memberikan nasihat hukum.
- JANGAN memberikan rekomendasi atau nasihat investasi personal.
- JANGAN menyebutkan angka statistik, persentase, jumlah kasus, nomor telepon, alamat
  email, tautan situs, atau nomor peraturan dari ingatanmu. Jika pengguna menanyakannya,
  katakan bahwa data tersebut sebaiknya dipastikan langsung dari sumber resmi.
- JANGAN memberikan nasihat medis atau penanganan psikologis. Jika pengguna menunjukkan
  tanda tekanan mental berat atau niat menyakiti diri, tanggapi dengan hangat dan
  sarankan mereka berbicara dengan orang terdekat atau tenaga profesional.
- JANGAN menjawab pertanyaan di luar topik keuangan digital, pinjaman, investasi, dan
  penipuan. Tolak dengan sopan lalu tawarkan bantuan yang sesuai bidangmu.
- Jika pengguna menempelkan teks yang memuat data pribadi seperti NIK, nomor rekening,
  atau nomor telepon, ingatkan mereka untuk tidak membagikan data tersebut.

CARA MENJAWAB
- Ketika pengguna menempelkan isi tawaran atau pesan, jawab dengan urutan:
  1. Sebutkan ciri-ciri yang perlu diwaspadai dari teks tersebut, satu per satu.
  2. Jelaskan singkat mengapa setiap ciri itu berisiko.
  3. Berikan langkah yang bisa dilakukan pengguna untuk memeriksa sendiri.
- Bicara tentang POLA dan CIRI, bukan tentang penilaian terhadap pihak tertentu.
- Jaga jawaban tetap ringkas dan mudah dibaca. Gunakan poin-poin bila membantu.
- Tutup setiap jawaban dengan satu kalimat pengingat agar pengguna memverifikasi ke
  sumber resmi sebelum mengambil keputusan.`;

// ==== Middleware ==== (WS-03, WS-04)
// cors() agar frontend dapat menghubungi backend tanpa kendala lintas origin.
// express.json() agar body request JSON terparsing.
// express.static() menyajikan folder public/ pada root path.
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Mengubah riwayat percakapan dari format frontend ke format `contents` Gemini.
 *
 * Frontend mengirim `{ role, text }`; Gemini menerima `{ role, parts: [{ text }] }`.
 * Pemetaan ini mengikuti materi Sesi 3 p.29. (API-03)
 *
 * @param {Array<{role: string, text: string}>} conversation Riwayat percakapan.
 *   Nilai `role` yang valid adalah `"user"` dan `"model"`.
 * @returns {Array<{role: string, parts: Array<{text: string}>}>} Struktur `contents`
 *   yang siap dikirim ke `generateContent()`.
 */
function toGeminiContents(conversation) {
  return conversation.map(({ role, text }) => ({
    role,
    parts: [{ text }],
  }));
}

/**
 * Endpoint percakapan multi-turn dengan Gemini. (API-01 .. API-06)
 *
 * Menerima seluruh riwayat percakapan pada setiap permintaan karena model bersifat
 * stateless dan tidak ada penyimpanan di sisi server.
 *
 * Body request:
 *   `{ conversation: [{ role: "user" | "model", text: string }] }`
 *
 * Perhatikan bahwa nama field adalah `conversation` dengan item `text`, mengikuti kode
 * backend pada materi Sesi 3 p.29. Contoh `script.js` pada materi p.39 mengirim
 * `{ messages: [{ role, content }] }`, dan itu tidak dibaca endpoint ini.
 * Lihat design.md keputusan D-03.
 *
 * Respons berhasil: `200 { result: string }`
 * Respons gagal:    `500 { error: string }`
 *
 * @param {import('express').Request} req Permintaan Express.
 * @param {import('express').Response} res Respons Express.
 * @returns {Promise<void>}
 */
app.post('/api/chat', async (req, res) => {
  const { conversation } = req.body;

  try {
    // Validasi bentuk input. Pesan error disalin verbatim dari materi Sesi 3 p.29,
    // termasuk kata "Messages" meskipun nama field adalah conversation. (API-02)
    if (!Array.isArray(conversation)) throw new Error('Messages must be an array!');

    const contents = toGeminiContents(conversation);

    // (API-04, PG-01) Konfigurasi persona dan parameter dikirim melalui properti config,
    // mengikuti pola materi Sesi 3 p.29.
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        temperature: TEMPERATURE,
        topP: TOP_P,
        topK: TOP_K,
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    // (API-05) Nama field adalah result, bukan output maupun reply.
    res.status(200).json({ result: response.text });
  } catch (e) {
    // (API-06) Pesan error tidak memuat nilai kredensial karena hanya meneruskan
    // e.message dari SDK atau dari validasi di atas. (WS-01)
    res.status(500).json({ error: e.message });
  }
});

// ==== Menjalankan server ==== (WS-05)
const PORT = 3000;
app.listen(PORT, () => console.log(`Cek Dulu siap di http://localhost:${PORT}`));
