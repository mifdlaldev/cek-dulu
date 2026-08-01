# TOOLS-DAN-LINK.md — Tools, Versi & Seluruh URL dari PDF

> Semua URL di file ini **diekstrak langsung dari objek `/URI` di dalam PDF**,
> jadi persis seperti yang di-hyperlink di slide.

---

## 1. TABEL TOOLS RESMI

Sumber: `Sesi 2 - Instalasi Tools.pdf` p.1–2, diulang di `Sesi 1` p.104–105.

| No | Tool Name | Used in Session(s) | Version | Download Link | Configuration Notes |
|---|---|---|---|---|---|
| 1 | Node.js | 2, 3 | v18+ | `https://nodejs.org/en/download` | Verify with `node -v`. Required for running the API. |
| 2 | Visual Studio Code | 1, 2, 3 | Latest | `https://code.visualstudio.com/` | Use recommended extensions: REST Client, Prettier, .env support. |
| 3 | Postman | 2, 3 | Latest | `https://www.postman.com/downloads/` | Use for API testing. Optional: log in for cloud sync. |
| 4 | Git | 2, 3 | v2.40+ | `https://git-scm.com/downloads` | Run `git config --global user.name "yourusername"` and `git config --global user.email "youremail@example.com"` after install. |
| 5 | GitHub | 2, 3 | Web-based | `https://github.com` | Sign up/login required. Submit project via public/private repo. |
| 6 | Google Gemini Studio | 2, 3 | Web-based | `https://aistudio.google.com/` | Generate and copy API Key to `.env` file. |
| 7 | Terminal / CLI | 2, 3 | Any modern | Built-in / Git Bash (Windows) | Required to run commands: `npm`, `node`, `git`, etc. |

Git for Windows (dari hyperlink S1): `https://gitforwindows.org/`

Versi Node.js di demo slide: `v23.7.0` (S2 p.9, S3 p.9).

---

## 2. LINK ADMINISTRASI PROGRAM

| Keperluan | URL | Sumber |
|---|---|---|
| Absensi (semua sesi) | `https://bit.ly/absensi-developers` | S1 p.10/38/70, S2 p.6/36/50, S3 p.6/19/32 |
| Pre-Survey | `https://bit.ly/mba2-presurvey` | S1 p.11 |
| Pre-Test | `https://bit.ly/pretest-developers` | S1 p.11 |
| Quiz 1 | `https://bit.ly/quiz1-developers` | S1 p.101 |
| Quiz 2 | `https://bit.ly/quiz2-developers` | S2 p.66 |
| Quiz 3 | `https://bit.ly/quiz3-developers` | S3 p.56 |
| Post-Survey | `https://bit.ly/mba2-postsurvey` | S3 p.57 |
| Post-Test | `https://bit.ly/posttest-developers` | S3 p.57 |
| **Submit Final Project** | `https://bit.ly/finalproject-developers` | S3 p.52 |

Cara isi Pre-Test (S1 p.11, verbatim):
1. Isilah form Pre-Survey ini terlebih dahulu: `https://bit.ly/mba2-presurvey`
2. Screenshots bukti apabila sudah menyelesaikan Pre-Survey
3. Submit bukti tersebut ke dalam link Pre-Test: `https://bit.ly/pretest-developers`
4. Lanjutkan mengisi Pre-Test sampai selesai

Cara isi Post-Test (S3 p.57): pola sama, pakai `mba2-postsurvey` lalu `posttest-developers`.

---

## 3. ASET & STARTER CODE

| Aset | URL | Sumber |
|---|---|---|
| Starter Code Front End (Vanilla JS, zip HTML/CSS/JS) | `https://bit.ly/startercode-developers` | S3 p.8, p.10 |
| Dummy PRD (file input untuk hands-on & NotebookLM) | `https://bit.ly/dummy-prd` | S1 p.89, S2 p.37 |
| Contoh hasil v0.dev | `https://v0.dev/chat/dTvCQLV1yD1` | S1 p.61 |

---

## 4. DOKUMENTASI GEMINI API

| Topik | URL | Sumber |
|---|---|---|
| Docs utama Gemini API | `https://ai.google.dev/gemini-api/docs` | S2 p.11 |
| Daftar model | `https://ai.google.dev/gemini-api/docs/models/gemini` | S2 p.12–16 |
| Libraries / SDK install | `https://ai.google.dev/gemini-api/docs/libraries` | S2 p.19 |
| Quickstart | `https://ai.google.dev/gemini-api/docs/quickstart` | S2 p.20 |
| Text generation | `https://ai.google.dev/gemini-api/docs/text-generation` | S2 p.21 |
| Halaman API Keys | `https://aistudio.google.com/u/0/api-keys` | S2 p.17 |

Cara ambil API key (S2 p.17, verbatim):
> Untuk menggunakan API Gemini, Anda perlu mendapatkan API Key terlebih dahulu.
> Klik tombol "Create API Key" untuk membuat API Key dari project yang ada.

---

## 5. TOOLS PRODUKTIVITAS AI

| Tool | Situs | Dokumentasi / Setup | Demo link slide | Sumber |
|---|---|---|---|---|
| Gemini Code Assist | `https://codeassist.google/` | `https://developers.google.com/gemini-code-assist/docs/set-up-gemini` | — | S1 p.76 |
| GitHub Copilot | `https://docs.github.com/en/copilot` | `https://docs.github.com/en/copilot/quickstart` | `https://bit.ly/copilot-developers` | S1 p.79–80 |
| Google Antigravity | `https://antigravity.google/` | `https://codelabs.developers.google.com/getting-started-google-antigravity` | `https://bit.ly/antigravity-developers` | S1 p.82–83 |
| NotebookLM | `https://notebooklm.google/` | — | — | S1 p.88 |
| Gemini Canvas | `https://gemini.google.com/canvas` | — | — | S1 p.51 |
| v0.dev | `https://v0.dev` | — | `https://v0.dev/chat/dTvCQLV1yD1` | S1 p.60–61 |

Referensi tambahan yang dikutip slide:
- `https://firebase.studio/blog/article/build-with-gemini-in-idx` (screenshot Gemini Code Assist, S1 p.77)

---

## 6. SUMBER DATA & STUDI KASUS

| Konten | URL | Sumber |
|---|---|---|
| Tren adopsi AI 2025 | `https://www.coherentsolutions.com/insights/ai-adoption-trends-you-should-not-miss-2025` | S1 p.19 |
| Studi kasus Grab | `https://openai.com/index/grab/` | S1 p.26 |
| Studi kasus Duolingo | `https://openai.com/index/duolingo/` | S1 p.28 |
| Studi kasus Vodafone | `https://customers.microsoft.com/en-gb/story/1770174778560829849-vodafone-group-azure-telecommunications-en-united-kingdom` | S1 p.30 |
| Google.org | `http://google.org` | S1/S2/S3 p.1 |

---

## 7. ENDPOINT LOKAL YANG DIUJI DI SLIDE

Dari hyperlink PDF Sesi 2:
- `http://localhost:3000/generate-text`
- `http://localhost:3000/generate-from-image`
- `http://localhost:3000/generate-from-document`
- `http://localhost:3000/generate-from-audio`

Dari hyperlink PDF Sesi 3:
- `http://localhost:3000/`
- `http://localhost:3000/api/chat`

> Catatan: PDF juga mengandung `/URI` palsu `http://index.js` dan `http://node.js`
> — itu hasil auto-linking Google Slides pada teks `index.js` / `Node.js`, **bukan URL nyata**.
