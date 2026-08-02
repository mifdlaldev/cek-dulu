# PROMPT-AVATAR.md — Prompt Pembuatan Avatar Bot

> **Status berkas ini:** naskah prompt siap tempel untuk generator gambar. Berkas ini
> **tidak** mengubah kode. Avatar hasil generasi belum dipasang ke `public/`; keputusan
> memasangnya beserta konsekuensinya dibahas di bagian 6.
>
> Seluruh nilai warna, ukuran, dan larangan pada prompt ini **diambil dari keputusan yang
> sudah ada di repositori**, bukan dikarang. Rujukannya dicantumkan per butir di bagian 2.

---

## 1. Masalah yang diselesaikan

Avatar bot saat ini adalah inisial `CD` di dalam lingkaran, dibuat dari CSS dan teks
(keputusan `design.md` D-19). Pilihan itu diambil karena berkas gambar menambah permintaan
jaringan, dan sampai Fase H halaman memang **nol berkas gambar** — terbukti pada audit
`docs/QA-REPORT.md` bagian Fase H: `jumlahImg: 0`.

Inisial berfungsi, tetapi tidak menyampaikan peran. Pengguna yang baru membuka panel melihat
dua huruf tanpa petunjuk bahwa yang dihadapinya adalah asisten yang memeriksa risiko keuangan.

---

## 2. Batasan yang mengikat prompt

Setiap butir di bawah **sudah menjadi keputusan repositori**. Prompt wajib mematuhinya, dan
gambar yang melanggar salah satunya harus dibuang, bukan dikompromikan.

| Batasan | Nilai | Sumber |
|---|---|---|
| Palet warna | Navy `#0E4A6E`, deep teal `#0E7C6B`, teal pekat `#0A5D50`, latar bubble `#EEF2F7`, permukaan `#FFFFFF` | `UI-12`, `docs/RISET-DESAIN.md` §4 |
| Ukuran tampil | 32×32px pada bubble dan header panel (`--ukuran-avatar: 2rem`) | `public/style.css` |
| Bentuk | Lingkaran penuh (`border-radius: var(--radius-penuh)`) | `public/style.css` |
| Nada | Tenang, empatik, tidak menakut-nakuti | `docs/USE-CASE-CEKDULU.md` §4 tabel Tone |
| DILARANG | Emoji robot atau nada ceria | `design.md` D-19 — "menggeser nada menjadi ceria, tidak sesuai konteks pengguna yang cemas" |
| DILARANG | Logo Hacktiv8, OJK, atau lembaga mana pun | `design.md` D-20; `NOTICE.md` |
| DILARANG | Atribut yang menyiratkan otoritas resmi — lencana polisi, seragam pemerintah, lambang negara | `PG-03` melarang bot menilai legalitas; avatar tidak boleh menyiratkan wewenang yang tidak dimiliki |
| DILARANG | Wajah yang dapat dikenali sebagai orang nyata | Menghindari klaim identitas palsu |
| Aksesibilitas | Avatar tetap `aria-hidden="true"`; penanda pengirim berupa teks tetap ada | `UI-11`, D-19 |

**Catatan penting soal "avatar wajah customer service".** Permintaan awal menyebut opsi wajah
petugas layanan pelanggan. Itu dapat dikerjakan, tetapi dua risiko harus disadari lebih dulu:

1. **Wajah manusia pada 32px hampir tidak terbaca.** Mata, mulut, dan ekspresi lenyap pada
   ukuran itu. Yang tersisa hanya bentuk kepala dan warna.
2. **Wajah menyiratkan ada manusia di balik jawaban.** Cek Dulu adalah model bahasa, dan
   `PG-01` mewajibkan bot memperkenalkan diri sebagai asisten. Avatar wajah yang terlalu
   realistis bertentangan dengan prinsip Transparansi (S1 p.99) yang dipakai proyek ini
   sebagai dasar `UI-08`.

Karena itu bagian 3 menyediakan **tiga arah**, diurutkan dari yang paling aman terhadap
batasan di atas. Bagian 4 memuat prompt siap tempel untuk masing-masing.

---

## 3. Tiga arah yang diusulkan

| # | Arah | Kekuatan | Risiko |
|---|---|---|---|
| **A** | **Lambang perisai dan kaca pembaca** — abstrak, tanpa figur | Terbaca jelas pada 32px; konsisten dengan ikon launcher dan favicon yang sudah ada; nol risiko klaim identitas | Tidak "ramah" seperti figur |
| **B** | **Figur petugas bergaya geometris** — siluet kepala dan bahu, tanpa detail wajah | Menyampaikan peran pendamping; masih terbaca pada 32px | Perlu disiplin agar tidak terbaca sebagai seragam resmi |
| **C** | **Figur dengan wajah minimal** — dua titik mata, tanpa mulut realistis | Paling personal | Paling rapuh pada 32px; paling dekat dengan risiko menyiratkan manusia |

**Rekomendasi: arah A.** Alasannya bukan selera. Ikon launcher dan favicon yang sudah ada di
`public/index.html` memakai bentuk perisai dengan kaca pembaca. Arah A membuat avatar
melanjutkan bahasa visual itu alih-alih memperkenalkan bahasa baru di dalam widget yang sama.

---

## 4. Prompt siap tempel

Ketiga prompt ditulis dalam bahasa Inggris karena generator gambar utama dilatih pada teks
Inggris. Nilai warna ditulis eksplisit sebagai hex agar tidak ditafsir ulang.

### 4.A — Perisai dan kaca pembaca (rekomendasi)

```
A flat vector app icon for a financial-safety education chatbot, designed to remain legible
at 32x32 pixels.

Subject: a rounded shield seen straight on, containing a simple magnifying glass at its
center. Nothing else inside the shield.

Style: flat geometric vector, 2-pixel-equivalent uniform stroke weight, no gradients, no
drop shadows, no 3D shading, no texture, no outline glow. Generous negative space. Silhouette
must stay readable when scaled down to 32 pixels.

Composition: perfectly centered within a full-bleed circular frame. The circle is filled
solid deep teal #0E7C6B. The shield and magnifying glass are drawn in white #FFFFFF. No
border ring around the circle.

Mood: calm, steady, trustworthy, protective. Not cheerful, not playful, not alarming.

Strictly avoid: any text, letters, numbers, or initials; robot faces; cartoon eyes; smiling
expressions; emoji; police badges, government seals, national emblems, stars, or any insignia
implying official authority; any real company or institution logo; padlocks; warning
triangles; exclamation marks; dollar or currency symbols; photographic realism; skeuomorphism.

Output: square canvas, transparent background outside the circle, SVG-like clean edges.
```

### 4.B — Figur petugas bergaya geometris

```
A flat vector avatar for a financial-safety education assistant, designed to remain legible
at 32x32 pixels.

Subject: a head-and-shoulders silhouette of a calm support person, rendered as pure geometry —
a circle for the head and a wide rounded trapezoid for the shoulders. No facial features at
all. A small shield shape rests on the chest area, drawn with the same stroke weight as the
figure.

Style: flat geometric vector, uniform stroke weight, no gradients, no shading, no texture.
High contrast between figure and background. Silhouette must stay readable when scaled down to
32 pixels.

Composition: figure centered and cropped at the shoulders inside a full-bleed circle. Circle
filled solid navy #0E4A6E. Figure and shield drawn in white #FFFFFF.

Mood: calm, patient, approachable, professional. Not cheerful, not authoritative, not stern.

Strictly avoid: any text, letters, numbers, or initials; facial features of any kind including
eyes, mouth, eyebrows; headsets or microphones; uniforms, epaulettes, ties, name tags; police
or security badges; government seals or national emblems; any real company or institution
logo; identifiable ethnicity, gender markers, hairstyles, or resemblance to any real person;
photographic realism; cartoon styling; emoji.

Output: square canvas, transparent background outside the circle, SVG-like clean edges.
```

### 4.C — Figur dengan wajah minimal

```
A flat vector avatar for a financial-safety education assistant, designed to remain legible
at 32x32 pixels.

Subject: a minimal head-and-shoulders figure. The face carries only two small solid dots as
eyes, positioned slightly wide apart. No mouth, no nose, no eyebrows. A small shield shape
rests on the chest area.

Style: flat geometric vector, uniform stroke weight, no gradients, no shading, no texture.
Silhouette must stay readable when scaled down to 32 pixels; the eye dots must remain distinct
and not merge at that size.

Composition: figure centered and cropped at the shoulders inside a full-bleed circle. Circle
filled solid navy #0E4A6E. Figure, eye dots, and shield drawn in white #FFFFFF.

Mood: calm, attentive, gentle. Neutral expression. Not cheerful, not sad, not surprised.

Strictly avoid: any text, letters, numbers, or initials; smiling or frowning mouths; eyebrows;
blush marks; cartoon or mascot styling; robot antennae or metallic plating; headsets;
uniforms, badges, government seals, national emblems; any real company or institution logo;
identifiable ethnicity, gender markers, or resemblance to any real person; photographic
realism; emoji.

Output: square canvas, transparent background outside the circle, SVG-like clean edges.
```

---

## 5. Cara menguji hasil generasi

Gambar yang lolos generator **belum tentu** memenuhi batasan bagian 2. Lima pemeriksaan
berikut wajib dijalankan sebelum avatar dipakai, dan hasilnya dicatat.

| # | Pemeriksaan | Cara | Lulus bila |
|---|---|---|---|
| 1 | Keterbacaan 32px | Perkecil gambar ke 32×32px, lihat pada 100% | Bentuk masih dapat dikenali; tidak menjadi gumpalan |
| 2 | Kontras terhadap latar | Ukur rasio warna figur terhadap warna lingkaran dengan formula WCAG | Minimal 4,5:1, sama seperti ambang teks pada `UI-11` |
| 3 | Nol teks | Perbesar dan telusuri seluruh gambar | Tidak ada huruf, angka, atau inisial |
| 4 | Nol atribut otoritas | Telusuri lencana, bintang, seragam, lambang | Nihil |
| 5 | Konsistensi palet | Bandingkan nilai warna hasil generasi dengan tabel bagian 2 | Hanya memakai warna dari palet `UI-12` |

Pemeriksaan 2 memakai formula yang sama dengan yang sudah dipakai proyek ini pada
`docs/QA-REPORT.md`. Untuk arah A, pasangan yang diukur adalah putih `#FFFFFF` terhadap deep
teal `#0E7C6B` — pasangan itu **sudah terukur 5,10:1** pada Fase H, sehingga lulus tanpa
pengukuran baru. Untuk arah B dan C, pasangan putih terhadap navy `#0E4A6E` **sudah terukur
9,45:1**.

Artinya kedua kombinasi warna yang diusulkan sudah terbukti memenuhi ambang. Yang masih perlu
diuji adalah empat pemeriksaan lainnya.

---

## 6. Konsekuensi memasang avatar gambar, dan cara menghindarinya

Memasang berkas gambar membalik salah satu alasan D-19. Tiga konsekuensi nyata:

1. **Permintaan jaringan bertambah.** Audit Fase H mencatat halaman hanya melakukan tiga
   permintaan: dokumen, CSS, dan JS. Menambah berkas PNG membuatnya empat.
2. **Berkas masuk repositori.** Ukurannya harus dijaga kecil agar tidak membebani kloning.
3. **Avatar muncul di dua tempat** — bubble bot dan header panel — sehingga keduanya harus
   diperbarui bersamaan agar tidak timpang.

**Cara menghindari ketiganya: minta hasil dalam bentuk SVG, lalu tanam inline.** Ikon launcher
dan favicon yang sudah ada memakai pendekatan ini — SVG inline dan data URI, nol permintaan
jaringan tambahan. Prompt di bagian 4 sudah meminta "SVG-like clean edges" untuk maksud itu.

Bila generator hanya menghasilkan raster, jalur yang tetap konsisten dengan D-19 adalah
menggambar ulang bentuknya sebagai SVG inline dengan hasil generasi sebagai acuan visual, bukan
memasang PNG-nya langsung.

**Bila avatar akhirnya dipasang, tiga hal wajib diperbarui:**

| Berkas | Perubahan |
|---|---|
| `design.md` | Amandemen D-19 — hapus larangan "avatar berupa berkas gambar" bila memang beralih, atau catat bahwa avatar tetap berbasis SVG inline sehingga larangan tidak dilanggar |
| `public/script.js` | `appendMessage()` masih menulis `avatar.textContent = 'CD'`; harus diganti pembuatan elemen SVG. **Ingat `UI-12` melarang `innerHTML`** — SVG wajib dibangun dengan `createElementNS`, bukan string HTML |
| `docs/QA-REPORT.md` | Audit `jumlahImg: 0` pada Fase H menjadi tidak berlaku bila raster dipakai; catat perubahannya |

Butir kedua adalah jebakan yang paling mudah terlewat: CI job `constraints` menolak
`innerHTML`, dan cara termudah menanam SVG lewat JavaScript justru memakai `innerHTML`.

---

## 7. Yang TIDAK diputuskan berkas ini

- Berkas ini **tidak memilih** salah satu dari tiga arah. Rekomendasi diberikan beserta
  alasannya; keputusan ada pada pemilik proyek.
- Berkas ini **tidak mengubah** `public/`. Avatar `CD` masih berlaku sampai ada keputusan.
- Berkas ini **tidak menambah** requirement baru. Bila avatar dipasang, `UI-10` dan `UI-11`
  yang sudah ada sudah cukup mengatur pembeda peran dan aksesibilitasnya; yang perlu adalah
  amandemen D-19, bukan requirement baru.
