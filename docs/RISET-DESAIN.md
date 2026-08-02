# RISET-DESAIN.md — Dasar Data Keputusan Desain Antarmuka

> **Status file ini:** data di luar materi PDF Hacktiv8. Setiap angka **wajib punya URL
> sumber**. Dipakai untuk menjustifikasi keputusan desain antarmuka.
>
> **Aturan pemakaian:** sama seperti `docs/RISET-LAPANGAN.md` — angka di sini tidak boleh
> masuk `systemInstruction`. Riset ini menyangkut antarmuka, bukan isi jawaban bot.
>
> Keputusan yang bersumber dari berkas ini: pola antarmuka widget (`UI-13`, D-18), palet warna
> light mode (`UI-12`, amandemen D-12), struktur landing page (`UI-14`, D-20), dan komposer
> multi-baris beserta blok saran yang dapat ditutup (`UI-01` amandemen, `UI-15`, D-21).
>
> Tanggal akses riset: **1 Agustus 2026** untuk bagian 1–6; **2 Agustus 2026** untuk bagian
> 7–9 (keduanya via You.com Research).

---

## 1. Mengapa pola widget, bukan halaman datar

### Masalah desain awal

Implementasi Fase D menempatkan seluruh elemen berjejer vertikal di tengah halaman: judul,
disclaimer, area chat, kolom pesan, chip, kanal resmi. Susunan itu terbaca sebagai **formulir**,
bukan percakapan. Tidak ada pemisahan konteks antara "halaman informasi" dan "ruang bicara",
sehingga pengguna tidak mendapat isyarat visual bahwa ada percakapan yang bisa dimulai.

### Data penempatan

**Sumber:** Clutch, "How to Fix Your Chatbot UI and UX (and Why It Costs You to Wait)",
26 Juni 2026. `https://clutch.co/resources/fix-your-chatbot-ux`

| Temuan | Angka |
|---|---|
| Chat widget yang memakai posisi bottom-right | **89%** |
| Penurunan engagement bila ditempatkan di posisi lain | **25–40%** |
| Konsumen yang meninggalkan alat AI karena mengganggu penjelajahan | **55%** |
| Anjuran penundaan sapaan proaktif | 5–10 detik, sekali per sesi |
| Lebar maksimal bubble pesan | **280–320px** desktop; 75% lebar layar di ponsel |
| Anjuran panjang baris | 50–65 karakter |
| Anjuran panjang pesan | 2–3 kalimat, terbaca dalam 3 detik |
| Ambang perlunya indikator mengetik | respons 1–3 detik |

Kutipan verbatim:

> Placement: Bottom-right corner is the global standard — 89% of chat widgets use this
> position. Placing it elsewhere reduces engagement by 25–40%.

> When your AI takes 1–3 seconds to respond, a typing indicator (animated dots) prevents
> users from assuming the chat is broken.

**Implikasi:** posisi bottom-right bukan preferensi estetis, melainkan konvensi yang sudah
dipelajari pengguna. Menyimpang darinya membebani pengguna dengan biaya belajar tanpa
imbalan.

### Empat lapis antarmuka chatbot

**Sumber:** messengerbot.app, "Chatbot UI Design In 2026: Best Practices For Chat Widgets,
Conversation", 13 April 2026.
`https://messengerbot.app/chatbot-ui-design-in-2026-best-practices-for-chat-widgets-conversation/`

Kutipan verbatim:

> The easiest mistake in chatbot ux is assuming the answer quality is the product. It is not.
> The interface is the product the user actually sees.

> The launcher layer decides whether the widget gets the first click at all.

> The launcher is the smallest element in the system, but it carries a huge amount of product
> weight. It has to communicate role, urgency, and relevance in one glance. That means the
> default speech-bubble icon is rarely enough on its own.

Dua larangan eksplisit dari sumber yang sama:

> Do not use unread badges as fake urgency if no real message exists.
> Do not use typing indicators before the user has actually engaged.

**Implikasi:**
1. Launcher tidak cukup berupa ikon gelembung saja — perlu label teks agar peran terbaca
   sekali pandang.
2. Tidak boleh ada badge notifikasi palsu.
3. Indikator mengetik hanya muncul **setelah** pengguna mengirim pesan, bukan saat halaman
   dibuka.

### Elemen penyusun antarmuka chatbot

**Sumber:** Clutch (URL di atas) dan Parallel HQ, "How to Design Chatbot UX: 2026
Conversational UI Patterns". `https://www.parallelhq.com/blog/chatbot-ux-design`

Kutipan Clutch:

> Chatbot UI (user interface) is the visual and interactive layer users directly see and
> touch: the widget launcher button, message bubbles, quick reply buttons, the input field,
> typing indicators, and any images or carousels.

Kutipan Parallel HQ:

> A chatbot isn't a website with a text box; it's a conversational interface that must guide
> users without a visual map.

**Implikasi:** kalimat terakhir merangkum kritik terhadap desain awal. Kotak teks di dalam
halaman bukan antarmuka percakapan.

### Aksesibilitas sebagai bagian inti

**Sumber:** messengerbot.app dan Lollypop Design, "Chatbot UI UX Design Best Practices &
Examples (2026 Guide)".
`https://lollypop.design/blog/2025/january/chatbot-ui-ux-design-best-practices-examples/`

Kutipan messengerbot.app:

> Accessibility should be treated as part of core chatbot ux, not as a legal cleanup task.

Kutipan Lollypop:

> Furthermore, accessibility requires high-contrast chat bubbles, spacious tap targets, full
> keyboard compatibility, and screen-reader support.

**Implikasi:** menguatkan keputusan D-13 yang sudah menempatkan aksesibilitas sebagai
requirement, bukan pekerjaan tambahan.

---

## 2. Pola dialog yang dapat diakses

Panel chat yang muncul di atas halaman adalah **dialog**. Pola aksesibilitasnya sudah baku.

**Sumber:** UXPin, "How to Build Accessible Modals with Focus Traps (2026 Guide)", 22 April
2026. `https://www.uxpin.com/studio/blog/how-to-build-accessible-modals-with-focus-traps/`
Dan ExceedAbility, "Accessible Modal Dialogs & Popups, ARIA".
`https://exceedability.com/modals-popups-and-dialog-boxs.html`

Persyaratan minimum menurut UXPin:

> ARIA attributes (role="dialog", aria-modal="true", aria-labelledby, aria-describedby) give
> screen readers the context they need. Keyboard navigation — Tab, Shift+Tab, and Escape must
> all work predictably within the modal.

> Every modal must trap focus, support Escape to close, and restore focus on dismissal.

Empat kegagalan yang paling sering terjadi, menurut ExceedAbility:

> Background content is still reachable by Tab, occurs when a custom overlay is used without a
> focus trap or inert attribute on background content. ESC key does not close the dialog...
> Focus is not returned to the trigger on close, causes keyboard users to lose their place...
> No accessible name on the dialog, without aria-labelledby pointing to the heading, screen
> readers announce "dialog" with no context.

**Implikasi — enam kewajiban untuk `UI-13`:**
1. `role="dialog"` dengan `aria-labelledby` menunjuk judul panel
2. Fokus masuk ke panel saat dibuka
3. Fokus terkurung di dalam panel (Tab dan Shift+Tab bersiklus)
4. Escape menutup panel
5. Fokus kembali ke launcher saat panel ditutup
6. Tombol tutup memiliki nama yang dapat diakses, bukan hanya simbol

**Catatan implementasi:** UXPin menyebut elemen `<dialog>` native menangani focus trap,
Escape, dan peran ARIA secara otomatis. Namun panel chat pada proyek ini **non-modal** —
pengguna harus tetap dapat membaca disclaimer dan kanal resmi di halaman di belakangnya.
Karena itu dipakai `role="dialog"` dengan `aria-modal="false"` dan focus trap manual, tanpa
membuat konten latar menjadi inert. Alasan lengkap: `design.md` keputusan D-18.

---

## 3. Mengapa light mode, bukan dark mode

### Koreksi terhadap keputusan awal

Implementasi Fase D memakai palet dark navy. Keputusan D-12 saat itu beralasan "restrained,
kontras tinggi, tipografi tenang" — arah yang tetap benar — tetapi pilihan **dark mode**
diambil tanpa dasar riset. Riset berikut menunjukkan pilihan itu tidak optimal untuk target
pengguna Cek Dulu.

### Keterbacaan light mode versus dark mode

**Sumber:** ResearchGate, "The Role of Color in User Experience: A Systematic Literature Study
of User Preferences for Dark and Light Mode", 26 Juni 2025.
`https://www.researchgate.net/publication/393055215`

Kutipan verbatim:

> The results showed that light mode was better in terms of readability and tasks that require
> high lighting, dark mode provides better visual comfort than light mode and reduces eye
> fatigue in low light conditions.

> User preferences were influenced by several things such as age, device type, environment,
> and emotional needs.

**Sumber:** Taylor & Francis, Ergonomics, "The dark side of the interface: examining the
influence of dark mode", 2025. `https://www.tandfonline.com/doi/full/10.1080/00140139.2025.2483451`

Kutipan verbatim:

> For adults who may experience age-related changes in vision, interface designs optimised for
> readability and accessibility are paramount. In this context, the adoption of light mode
> interfaces ... aligns with recommendations for mitigating age-related visual challenges and
> enhancing user performance.

**Sumber:** Nielsen Norman Group, "Dark Mode vs. Light Mode: Which Is Better?", 24 Januari
2024. `https://www.nngroup.com/articles/dark-mode/`

Kutipan verbatim:

> In people with normal vision (or corrected-to-normal vision), visual performance tends to be
> better with light mode, whereas some people with cataract and related disorders may perform
> better with dark mode.

**Implikasi:** target pengguna Cek Dulu mencakup **orang lanjut usia dan berliterasi rendah**
(`docs/USE-CASE-CEKDULU.md` §2) — kelompok yang paling sering menjadi sasaran penawaran
ilegal. Literatur secara eksplisit merekomendasikan light mode untuk kelompok dengan
perubahan penglihatan terkait usia. Aplikasi ini juga dipakai pada siang hari saat pengguna
menerima pesan mencurigakan, bukan dalam kondisi cahaya rendah.

Perlu dicatat: NN/G juga mencatat sebagian pengguna dengan katarak justru lebih baik dengan
dark mode. Karena proyek ini menolak toggle mode (non-goal), pilihan tunggal harus melayani
mayoritas target — dan itu light mode.

### Warna sebagai penentu kepercayaan

**Sumber:** Bethany Works LLC, "Color Psychology for Financial Services Brands", 24 April
2026. `https://bethanyworks.com/color-psychology-financial-services-brands/`

Kutipan verbatim:

> Research from the Institute for Color Research shows that people make subconscious judgments
> about products within 90 seconds of initial viewing, with 62-90% of that assessment based on
> color.

Panduan per warna dari sumber yang sama:

| Warna | Catatan |
|---|---|
| **Deep teal** | "Combines blue's trustworthiness with green's growth associations. More distinctive than navy while maintaining professionalism." |
| Red | "Creates urgency and excitement but can trigger anxiety around money. Use sparingly as an accent." |
| Yellow | "Optimistic and energetic but can undermine seriousness if used as a primary color." |
| Orange | "Friendly and approachable but lacks the authority most financial clients seek." |

Arketipe merek yang relevan dengan Cek Dulu:

> Sage (wisdom, expertise): Deep blue, navy, purple, gray—colors that convey knowledge and
> trustworthiness
> Caregiver (nurturing, support): Soft blue, sage green, warm gray—approachable while
> maintaining professionalism

**Implikasi:** Cek Dulu berada di antara Sage dan Caregiver — memberi pengetahuan sekaligus
mendampingi orang yang cemas. Kombinasi navy dan deep teal melayani keduanya.

### Chromatic Anxiety dan Tonal Restraint

**Sumber:** WE AND THE COLOR, "Color Psychology in Fintech Branding: Building User Trust",
10 April 2026.
`https://weandthecolor.com/color-psychology-in-fintech-branding-how-the-right-palette-builds-user-trust/209146`

Kutipan verbatim:

> Chromatic Anxiety is an original editorial concept describing the accumulated psychological
> stress created by inconsistent, over-stimulating, or poorly calibrated color use across a
> fintech interface. It occurs when warning colors appear in non-warning contexts, when the
> palette lacks coherence across screens, or when too many competing color signals reduce the
> interface's legibility.

> The second behavior is Tonal Restraint: the palette uses fewer colors with greater intention.
> Restraint communicates discipline. A financial platform with a tight, coherent color system
> suggests organizational discipline — the same discipline users want applied to their money.

> First, the decline of default corporate blue as the automatic first choice for fintech
> Tier 1 palettes. As the sector matures and differentiates, more brands will seek distinctive
> Anchor Colors that still carry trust signals — deep teal, warm charcoal, refined forest
> green — rather than retreating to the same congested blue territory.

**Implikasi:** dua konsep ini menguatkan bagian D-12 yang tetap berlaku. Palet Cek Dulu
memakai **delapan token warna dengan satu aksen** — Tonal Restraint. Warna peringatan tidak
dipakai di konteks non-peringatan, menghindari Chromatic Anxiety.

Deep teal juga menjawab kritik "congested blue territory": membawa isyarat kepercayaan tanpa
menjadi biru korporat generik.

### Konteks Indonesia

**Sumber:** jadipcpm.id, "Logo Bank Indonesia: Makna, Sejarah dan Filosofinya", 22 Agustus
2024. `https://jadipcpm.id/logo-bank-indonesia/`
Dan "Beberapa Bank di Indonesia Logo", 25 Maret 2025. `https://jadipcpm.id/bank-di-indonesia-logo/`

Kutipan verbatim tentang Bank Indonesia:

> Logo BI didominasi oleh warna biru, yang secara universal melambangkan kepercayaan,
> stabilitas, dan profesionalisme.

Tentang BCA:

> Warna biru yang digunakan menggambarkan ketenangan dan kepercayaan yang menjadi ciri khas
> pelayanan BCA.

**Implikasi:** pengguna Indonesia sudah mengasosiasikan biru dengan lembaga keuangan yang
dapat dipercaya — Bank Indonesia, Mandiri, BCA, BRI. Memakai navy sebagai warna teks dan
bubble pengguna memanfaatkan asosiasi yang sudah terbentuk, tanpa meniru merek mana pun.

### Warna yang ditolak

| Warna | Alasan penolakan | Sumber |
|---|---|---|
| Ungu | Diasosiasikan kreativitas dan feminitas, bukan otoritas. Sudah padat dipakai fintech sehingga kehilangan daya beda | inordo, BFA Global |
| Merah sebagai warna utama | "Can trigger anxiety around money" | Bethany Works |
| Kuning sebagai warna utama | "Can undermine seriousness" | Bethany Works |
| Oranye | "Lacks the authority most financial clients seek" | Bethany Works |
| Lime green | "Can feel untrustworthy" | inspoai.io |

Referensi visual yang diberikan pengguna memakai ungu cerah. Konteksnya e-commerce dan
customer service, di mana keceriaan adalah nilai. Untuk alat kewaspadaan finansial pada
pengguna yang sedang cemas, prioritasnya berbeda. **Yang diadopsi dari referensi tersebut
adalah struktur dan pola interaksinya, bukan paletnya.**

---

## 4. Palet final dan hasil uji kontras

Delapan token warna, satu aksen. Nilai kontras dihitung dengan formula luminansi relatif
WCAG 2.1.

| Peran | Nilai | Dasar |
|---|---|---|
| Latar halaman | `#F4F6F9` | Netral sejuk, bukan putih menyilaukan |
| Permukaan panel | `#FFFFFF` | Kejelasan maksimal untuk area baca |
| Bubble bot | `#EEF2F7` | Terpisah dari permukaan tanpa mencolok |
| Bubble pengguna | `#0E4A6E` | Navy — kepercayaan, sejalan asosiasi lembaga keuangan Indonesia |
| Teks | `#111F2E` | Navy nyaris hitam, lebih lembut daripada hitam murni |
| Teks lembut | `#4A5A6D` | Hierarki sekunder |
| Aksen | `#0E7C6B` | Deep teal — trust biru + growth hijau, khas |
| Fokus | `#0B63CE` | Biru terang, indikator fokus keyboard |

Hasil uji kontras:

| Pasangan | Rasio | AA 4,5:1 | AAA 7:1 |
|---|---|---|---|
| teks pada latar halaman | 15,40:1 | LULUS | lulus |
| teks pada permukaan | 16,68:1 | LULUS | lulus |
| teks lembut pada permukaan | 7,06:1 | LULUS | lulus |
| teks lembut pada latar | 6,52:1 | LULUS | — |
| teks pada bubble bot | 14,83:1 | LULUS | lulus |
| teks invers pada bubble pengguna | 9,45:1 | LULUS | lulus |
| teks invers pada aksen | 5,10:1 | LULUS | — |
| aksen pada permukaan | 5,10:1 | LULUS | — |
| aksen pekat pada latar | 7,20:1 | LULUS | lulus |
| fokus pada permukaan | 5,69:1 | LULUS | — |

Sepuluh pasangan lulus AA, **enam di antaranya lulus AAA**. Rasio terendah 5,10:1 — masih
13% di atas ambang AA.

Perbandingan dengan palet dark sebelumnya perlu dibaca hati-hati agar tidak menyesatkan.
Rasio terendah palet lama adalah 8,03:1, sedangkan palet baru 5,10:1 — secara angka **turun**.
Penyebabnya: 5,10:1 diukur pada teks putih di atas aksen teal, pasangan yang tidak ada
padanannya di palet lama karena tombol lama memakai teks navy di atas teal terang.

Yang membaik adalah pasangan yang paling sering dibaca:

| Pasangan | Palet lama (dark) | Palet baru (light) |
|---|---|---|
| Teks utama pada permukaan | 14,60:1 | **16,68:1** |
| Teks pada bubble bot | 13,19:1 | **14,83:1** |
| Teks lembut pada permukaan | 8,89:1 | 7,06:1 |

Keunggulan sebenarnya bukan pada angka kontras — keduanya lulus AA dengan margin lebar —
melainkan pada **kesesuaian dengan literatur keterbacaan untuk pengguna lanjut usia**.

---

## 5. Keterbatasan riset ini

- Angka Clutch, messengerbot.app, dan Lollypop berasal dari survei dan praktik industri, bukan
  eksperimen terkontrol. Dipakai sebagai panduan konvensi, bukan hukum.
- Literatur light mode versus dark mode menunjukkan preferensi bervariasi menurut usia,
  perangkat, lingkungan, dan kebutuhan emosional. Pilihan tunggal light mode adalah keputusan
  untuk mayoritas target, bukan klaim bahwa dark mode selalu lebih buruk.
- Angka "62–90% penilaian berdasarkan warna" dari Institute for Color Research dikutip ulang
  oleh dua sumber sekunder; publikasi aslinya tidak dapat diakses langsung. Dicatat sebagai
  rujukan sekunder.
- Riset ini **tidak** mengubah batasan teknis materi. Stack, dependency, endpoint, dan kontrak
  API tetap seperti `docs/SPEC-API.md`. Yang berubah hanya HTML, CSS, dan logika antarmuka.

---

## 6. Struktur landing page

### Alasan menambahkan landing page

Setelah pola widget diterapkan, badan halaman hanya memuat hero singkat, disclaimer, dan
kanal resmi. Cukup secara fungsional, tetapi tidak menjelaskan apa yang Cek Dulu lakukan
kepada orang yang pertama kali membukanya.

Brief materi Sesi 3 p.49 meminta "use case dan konfigurasi parameter yang sesuai dengan
**kreativitas masing-masing**". Materi mengunci stack, endpoint, dan kontrak API, tetapi
tidak mengunci struktur halaman. Landing page berada di ruang kreativitas yang memang dibuka
brief, sama seperti isi `systemInstruction` dan palet warna.

### Urutan section yang konvergen dari lima sumber

**Sumber:**
- involve.me, "Landing Page Structure: Anatomy & Best Practices", 10 Mei 2026.
  `https://www.involve.me/blog/landing-page-structure`
- Replo, "Anatomy Of A Landing Page". `https://www.replo.app/blog/anatomy-of-a-landing-page`
- Landy AI, "Hero Section Design: 20+ Examples & Best Practices for 2026", 18 Maret 2026.
  `https://www.landy-ai.com/blog/hero-section-design`
- Genesys Growth, "Best Practices for Designing B2B SaaS Landing Pages – 2026", 12 Maret 2026.
  `https://genesysgrowth.com/blog/designing-b2b-saas-landing-pages`
- Neel Networks, "High-Converting Landing Page Design: 2026 Complete Guide", 15 Mei 2026.
  `https://www.neelnetworks.com/blog/high-converting-landing-page-design-2026/`

Kutipan involve.me:

> The ideal landing page structure is a focused sequence that takes visitors from promise to
> proof to action. This means starting with a strong Hero section (main headline, subhead,
> visual, CTA) that matches your ad's promise, followed by your Unique Value Proposition,
> Benefits, Social Proof, and another primary CTA.

Kutipan Replo:

> Usually, they all consist of these sections in the following order from top to bottom: the
> hero section with it's headline, the product section or product buy box, the product
> benefits, social proof, and the FAQ or upsell section at the very bottom.

Urutan yang disepakati kelima sumber:

```
Hero → Value Proposition → Benefits → Social Proof → How It Works → FAQ → CTA akhir → Footer
```

### Angka yang memandu keputusan

| Temuan | Angka | Sumber |
|---|---|---|
| Waktu hero untuk mengomunikasikan nilai | ±5 detik | Neel Networks |
| Panjang H1 berperforma tinggi | < 8 kata, maksimal 44 karakter | Genesys Growth |
| Jumlah CTA utama per halaman | **1**, "no exceptions" | Genesys Growth |
| Proporsi trafik dari ponsel | 60%+ | Landy AI |
| Urutan hero pada ponsel | headline, subheadline, CTA, visual | Landy AI |
| Pengguna meninggalkan situs lambat | 53% | Landy AI |
| Target LCP | di bawah 2,5 detik | Landy AI |

Kutipan Genesys Growth:

> The average high-performing H1 headline contains under 8 words (44 characters maximum). This
> constraint forces clarity and eliminates unnecessary jargon that confuses visitors.

> One primary CTA per page. No exceptions.

Kutipan Neel Networks:

> The headline, subheadline, hero image, and primary CTA that appear above the fold — the
> portion of the page visible without scrolling. This section has approximately 5 seconds to
> communicate enough value and relevance to keep the visitor on the page.

Kutipan Landy AI mengenai enam elemen hero:

> Every high-converting hero section includes these six essential elements: (1) compelling
> headline (primary value proposition), (2) supporting subheadline (expands on promise),
> (3) clear call-to-action (single, focused action), (4) hero visual (reinforces message),
> (5) trust signals (social proof, logos, ratings), and (6) strategic whitespace.

### Larangan tegas: testimoni yang dikarang

Tiga sumber independen memperingatkan hal yang sama.

**Sumber:**
- WiserNotify, "I Tested 10 Social Proof Landing Page Tactics (2026)", 24 Maret 2026.
  `https://wisernotify.com/blog/landing-page-social-proof/`
- ProveSource, "Social Proof on Landing Pages: 7 Types and Best Practices", 7 Juni 2026.
  `https://provesrc.com/blog/social-proof-landing-pages-best-practices/`
- Nudgify, "12 Best Ways to Use Landing Page Social Proof".
  `https://www.nudgify.com/social-proof-landing-pages/`

Kutipan WiserNotify:

> Using fake or obviously manufactured testimonials. If every testimonial reads as if it were
> written by the same copywriter, visitors will notice.

> One honest, detailed review beats ten polished fakes.

Kutipan ProveSource:

> Real, imperfect testimonials outperform polished marketing copy. Visitors can sense fake or
> overly edited reviews.

> Fake-looking testimonials, excessive popups, or irrelevant reviews can damage trust and
> annoy visitors.

Kutipan Nudgify mengutip PowerReviews:

> Research by PowerReviews reveals that 95% of consumers suspect censorship or fake reviews
> when there are no negative reviews present.

**Implikasi bagi Cek Dulu:** aplikasi ini **belum memiliki pengguna**. Menuliskan testimoni
apa pun berarti mengarang. Selain melanggar larangan di atas, itu bertentangan langsung dengan
nilai proyek: aplikasi yang melarang bot mengarang statistik (`PG-04`) tetapi halamannya
sendiri mengarang testimoni tidak akan koheren bagi pembaca yang teliti.

WiserNotify menyediakan jalan keluar untuk situasi tanpa testimoni:

> In that case, pair logos with the total number of customers (like "Trusted by 10,000+
> businesses") to create a quantity signal instead.

Pola itu tetap tidak bisa dipakai karena Cek Dulu juga tidak punya mitra maupun jumlah
pengguna. **Yang dipakai sebagai gantinya adalah angka nyata dari lembaga resmi** yang sudah
tersitasi di `docs/RISET-LAPANGAN.md`: kerugian Rp7,8 triliun yang dilaporkan ke IASC, 343.402
laporan penipuan, dan selisih 14 poin persentase antara indeks inklusi dan literasi keuangan.

Angka tersebut lebih kuat daripada testimoni karangan karena **dapat diverifikasi** — setiap
angka punya URL siaran pers, dan pembaca dapat memeriksanya sendiri. Konsisten pula dengan
pesan aplikasi: verifikasi ke sumber resmi.

### Section Batasan sebagai pembeda

Landing page umumnya hanya menjual kelebihan. Untuk domain ini, menampilkan batasan secara
terbuka justru memperkuat kredibilitas.

Delapan larangan yang sudah tercatat di `docs/USE-CASE-CEKDULU.md` §3.2 ditampilkan sebagai
section tersendiri. Alasannya bertumpu pada prinsip **Transparansi** dalam Etika AI
(Sesi 1 p.99): "Sistem AI harus dapat dipahami—pengguna perlu tahu apa yang dilakukan AI dan
alasannya."

Pengguna yang datang dalam keadaan cemas perlu tahu batas alat ini **sebelum** bertanya, bukan
setelah mendapat jawaban yang tidak sesuai harapan.

### Struktur final yang ditetapkan

| # | Section | Isi | Dasar |
|---|---|---|---|
| 1 | Header | Logo, nav anchor, satu CTA | Konvensi; satu CTA dari Genesys Growth |
| 2 | Hero | H1 lima kata, subheadline, CTA, visual, whitespace | Enam elemen Landy AI |
| 3 | Data & Sumber | Tiga angka OJK bersitasi | Pengganti Social Proof, `RISET-LAPANGAN.md` |
| 4 | Cara Kerja | Tiga langkah | "How It Works" pada urutan konvergen |
| 5 | Yang Bisa Dibantu | Empat kemampuan | "Benefits" pada urutan konvergen; isi dari `USE-CASE-CEKDULU.md` §3.1 |
| 6 | Batasan | Delapan larangan | Transparansi S1 p.99; isi dari §3.2 |
| 7 | Kanal Resmi | Empat kanal OJK | `UI-09`, `RISET-LAPANGAN.md` §7 |
| 8 | FAQ | Lima pertanyaan | "FAQ" pada urutan konvergen Replo |
| 9 | Footer | Disclaimer, tautan, atribusi | Konvensi |

FAQ memakai elemen `<details>` dan `<summary>` bawaan HTML. Elemen ini sudah dapat dibuka
dengan keyboard dan diumumkan screen reader tanpa JavaScript maupun ARIA tambahan — sejalan
dengan batasan Vanilla dan prinsip aksesibilitas `UI-11`.

### Yang ditolak untuk landing page

| Ditolak | Alasan |
|---|---|
| Testimoni pengguna | Tidak ada pengguna nyata; mengarang bertentangan dengan nilai proyek |
| Logo "dipercaya oleh" | Tidak ada mitra; memalsukan afiliasi |
| Star rating atau jumlah ulasan | Tidak ada ulasan |
| Logo Hacktiv8 atau OJK | Merek pihak lain; berpotensi terbaca sebagai klaim afiliasi resmi |
| Hero berupa video | 53% pengguna meninggalkan situs lambat; video menambah bobot muat |
| Dua atau lebih CTA utama yang bersaing | Genesys Growth: satu CTA utama, tanpa pengecualian |
| Framework CSS atau pustaka animasi | Non-goal proyek; materi menetapkan Vanilla |
| Angka pengguna, unduhan, atau kepuasan | Tidak ada datanya |


---

## 7. Komposer multi-baris

### Masalah yang diselidiki

Komposer memakai `<input type="text">` sesuai kode materi S3 p.37. Pada input satu baris,
teks panjang menggulir horizontal dan pengguna hanya melihat potongan terakhir dari apa yang
ia tulis. Untuk Cek Dulu ini merugikan: pengguna diminta **menempelkan isi pesan penipuan
secara utuh**, yang lazimnya beberapa baris. Ia tidak dapat memeriksa ulang apa yang sudah
ditempel sebelum mengirim.

### Konvensi papan tuts pada aplikasi perpesanan

**Sumber:**
- Slack Help Center, "Format your messages".
  `https://slack.com/help/articles/202288908-Format-your-messages`
- Sync With Tech, "How to Insert Newline If Enter Key Sends Msg — WhatsApp, Telegram".
  `https://www.syncwithtech.org/whatsapp-telegram-insert-newline-enter-key/`

Kutipan Slack:

> To start a new line, press **Shift Enter**.

Kutipan Sync With Tech mengenai WhatsApp dan Telegram:

> On WhatsApp, Telegram desktop or web, you can use **shift + enter** for a newline.

Konvensi yang berlaku pada keempat aplikasi besar: **Enter mengirim, Shift+Enter menyisipkan
baris baru**.

### Teknik CSS: `field-sizing: content`

**Sumber:**
- MDN Web Docs, "field-sizing" — CSS.
  `https://developer.mozilla.org/en-US/docs/Web/CSS/field-sizing`
- Chrome for Developers, "CSS field-sizing".
  `https://developer.chrome.com/docs/css-ui/css-field-sizing`
- web-features explorer, "field-sizing".
  `https://web-platform-dx.github.io/web-features-explorer/features/field-sizing/`

Kutipan MDN mengenai status dukungan:

> **Since June 2026, this feature works across the latest devices and browser versions.**

> This property is typically used to style text `<input>` and `<textarea>` elements to allow
> them to shrinkwrap their content as well as grow when more text is entered into the form
> control.

Kutipan Chrome for Developers:

> Without `field-sizing`, to create a well-sized input field you had to either guess at an
> average size of a text field input or use JavaScript to count characters and increase the
> element height or width as the user entered text. In other words, it wasn't easy, and it was
> error prone.

> Previously, inputs had a fair amount of fixed sizes, but after applying
> `field-sizing: content`, the inputs can become much too small or much too large. … They help
> the elements not collapse into too small of a box and also, in the case of textarea, not grow
> too large.

Properti ini masuk Baseline pada Juni 2026, dua bulan sebelum proyek ini dikerjakan. Cukup
baru untuk perlu diwaspadai, tetapi sudah lintas browser.

### Teknik fallback JavaScript

**Sumber:**
- CSS-Tricks, "The Cleanest Trick for Autogrowing Textareas".
  `https://css-tricks.com/the-cleanest-trick-for-autogrowing-textareas/`
- codestudy.net, "How to Create an Auto-Resize Textarea That Shrinks When Content is Deleted".
  `https://www.codestudy.net/blog/creating-a-textarea-with-auto-resize/`
- makandra dev, "How to auto-resize a textarea (or other inputs) in pure CSS".
  `https://makandracards.com/makandra/625410-auto-resize-textarea-inputs-pure-css`

Pola kanonis:

```js
el.style.height = 'auto';
el.style.height = el.scrollHeight + 'px';
```

Kutipan codestudy.net mengenai **mengapa `auto` harus lebih dulu**:

> The key to success is resetting the textarea's height to `auto` before measuring
> `scrollHeight` — this ensures the browser recalculates the content's natural height, even
> after deletion.

Tanpa langkah itu, tinggi eksplisit sebelumnya menahan layout sehingga `scrollHeight` tidak
menyusut, dan kolom yang sudah tinggi tidak pernah kembali mengecil.

Kutipan makandra dev mengenai strategi gabungan:

> `field-sizing: content` lets textareas and other inputs grow to fit their contents, but
> Firefox and Safari still need a JavaScript fallback.

Deteksi dukungan dilakukan dengan `CSS.supports('field-sizing', 'content')`, sehingga fallback
hanya dipasang bila memang dibutuhkan.

### Batas tinggi sebelum kolom sendiri menggulir

Tidak ada standar formal. Rentang yang konvergen dari sumber:

| Sumber | Anjuran |
|---|---|
| Chrome for Developers | `min-block-size` dan `max-block-size` dengan satuan `lh` atau `rlh` |
| modern-css.com | `min-height: 2lh; max-height: 10lh` |
| Material UI `TextareaAutosize`, Atlassian Textarea | properti `maxRows` sekitar 5–10 baris |

Rentang praktis: mulai 1–2 baris, tumbuh sampai 6–10 baris, lalu `overflow-y: auto`.

**Sumber tambahan:**
- modern-css.com, "Auto-Resize Textarea in CSS: field-sizing: content".
  `https://modern-css.com/auto-growing-textarea-without-javascript/`
- Material UI, "Textarea Autosize React component".
  `https://mui.com/material-ui/react-textarea-autosize/`

### Peringatan aksesibilitas: Enter yang dibajak

Ini bagian terpenting dari riset ini, dan yang paling mudah dilewatkan.

**Sumber:**
- W3C, "Understanding Success Criterion 2.1.1: Keyboard".
  `https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html`
- WebAIM E-mail List Archives, thread 10428.
  `https://webaim.org/discussion/mail_thread?thread=10428`
- Stack Overflow, "Is implicit submission (submit on enter key) useful to people using readers
  and keyboard navigation?"
  `https://stackoverflow.com/questions/57064691/is-implicit-submission-submit-on-enter-key-useful-to-people-using-readers-and`
- Mat Janson Blanchet, "The Enter key should submit the form currently in focus".
  `https://jansensan.net/blog/enter-key-should-submit-form-currently-focus`
- JavaScript Room, "How to Catch Enter Keypress on Textarea Without Triggering Shift+Enter".
  `https://www.javascriptroom.com/blog/how-to-catch-enter-keypress-on-textarea-but-not-shift-enter/`

Kutipan WebAIM:

> WCAG 3.2.2 does not allow for submitting forms by changing the setting of a user interface
> component … There is a bit of a tradition that pressing enter with focus on a text input
> submits forms, though **it can cause inadvertent submissions for users who are trying to
> create a new line.**

Kutipan Stack Overflow:

> What if some keyboard user presses enter wanting to add a new line, but sends the form
> instead? … When entering a text field, it is announced to screen readers, whether it is
> single line (`input`) or multiline (`textarea`).

Inti persoalannya: begitu elemen berubah menjadi `<textarea>`, screen reader mengumumkannya
sebagai kolom multi-baris. Pengguna lalu berharap Enter menyisipkan baris — dan bila Enter
justru mengirim, pesan setengah selesai terkirim tanpa bisa ditarik kembali.

Mitigasi yang dianjurkan sumber:

1. **Pertahankan tombol Kirim yang terlihat dan dapat difokuskan.** Teknik WCAG H32 meminta
   tombol submit eksplisit, bukan hanya submit implisit lewat Enter.
2. **Umumkan perilaku papan tuts.** JavaScript Room memberi contoh langsung:
   `aria-label="Type your message. Press Enter to send, Shift+Enter for a new line"`.
3. **Jangan mengirim pada peristiwa `input`.** Hanya `keydown` dengan `Enter` tanpa
   `shiftKey`, sehingga tidak melanggar WCAG 3.2.2 On Input.

### Kesimpulan untuk Cek Dulu

| Butir | Keputusan |
|---|---|
| Elemen | `<textarea>` dengan `id="user-input"` dipertahankan |
| Tinggi awal | 1 baris, tumbuh sampai 6 baris lalu `overflow-y: auto` |
| Teknik utama | `field-sizing: content` |
| Fallback | `scrollHeight` dengan reset `height = auto`, dipasang hanya bila `CSS.supports` gagal |
| Enter | Mengirim |
| Shift+Enter | Baris baru |
| Mitigasi a11y | Tombol Kirim tetap ada; instruksi papan tuts diumumkan lewat `aria-describedby` |
| Batas panel | Tinggi maksimum komposer dibatasi agar aliran chat tidak tergeser habis |

Perubahan `<input>` menjadi `<textarea>` **menyimpang dari kode materi** S3 p.37. Penyimpangan
ini dicatat sebagai keputusan sadar di `design.md` D-21, sejalan dengan cara D-15 menangani
penyimpangan nama model.

---

## 8. Menutup blok saran, dan ukuran teks nota

### Blok saran yang dapat ditutup

Riset bagian 1 mencatat bahwa 55% konsumen meninggalkan alat AI yang mengganggu penjelajahan.
Prinsip yang sama berlaku di dalam panel: blok "Contoh pertanyaan" menempati 88px dari 560px
tinggi panel, atau 16%. Bagi pengguna yang sudah tahu apa yang mau ditanyakan, blok itu murni
mengurangi ruang baca percakapan.

Pola yang dipakai: satu tombol tutup pada baris judul blok, memakai `aria-expanded` dan
`aria-controls` seperti launcher (`UI-13`) agar konsisten dengan pola dialog yang sudah
diverifikasi. Blok disembunyikan dengan atribut `hidden`, bukan dihapus dari DOM, sehingga
dapat dimunculkan kembali dan tidak merusak urutan Tab secara permanen.

Keputusan menyembunyikan alih-alih menghapus juga mencegah masalah aksesibilitas: menghapus
elemen yang sedang memegang fokus membuat fokus melompat ke `body`, dan pengguna keyboard
kehilangan posisi. Fokus dipindahkan eksplisit ke kolom pesan saat blok ditutup.

### Ukuran teks nota

Nota `Bersifat edukatif. Cek Dulu tidak menilai legalitas entitas mana pun.` membungkus dua
baris pada lebar panel 380px dengan ukuran `--teks-mikro` (13px). Dua baris pada teks yang
selalu terlihat menambah tinggi tetap komposer.

WCAG tidak menetapkan ukuran font minimum absolut; yang diwajibkan adalah kontras (1.4.3) dan
kemampuan diperbesar 200% tanpa kehilangan isi (1.4.4). Karena itu ukuran boleh diturunkan
selama dua syarat itu tetap terpenuhi, dan pengujian keduanya wajib diulang.

Nilai yang dipakai: token baru `--teks-nano` sebesar `0.75rem` (12px). Warna tidak berubah,
sehingga rasio kontras 7,06:1 yang sudah terukur tetap berlaku.

---

## 9. Keterbatasan riset bagian 7 dan 8

- Rentang 6–10 baris untuk batas tinggi textarea berasal dari praktik pustaka komponen, bukan
  eksperimen terkontrol. Nilai 6 dipilih karena tinggi panel Cek Dulu hanya 560px, lebih pendek
  daripada jendela chat aplikasi desktop yang menjadi acuan sumber.
- `field-sizing: content` baru masuk Baseline Juni 2026. Fallback JavaScript tetap disediakan,
  dan pengujian dilakukan pada Chromium — perilaku pada Safari dan Firefox versi lama tidak
  diverifikasi langsung pada proyek ini.
- Konvensi Enter mengirim diambil dari aplikasi perpesanan umum. Untuk pengguna yang belum
  terbiasa dengan pola itu, risiko terkirim sebelum selesai tetap ada. Mitigasinya berupa
  instruksi yang diumumkan screen reader dan tombol Kirim yang tetap tersedia, bukan
  penghapusan risiko.
