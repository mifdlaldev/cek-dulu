# RISET-DESAIN.md — Dasar Data Keputusan Desain Antarmuka

> **Status file ini:** data di luar materi PDF Hacktiv8. Setiap angka **wajib punya URL
> sumber**. Dipakai untuk menjustifikasi dua keputusan: pola antarmuka widget (`UI-13`,
> keputusan D-18) dan palet warna light mode (`UI-12`, amandemen keputusan D-12).
>
> **Aturan pemakaian:** sama seperti `docs/RISET-LAPANGAN.md` — angka di sini tidak boleh
> masuk `systemInstruction`. Riset ini menyangkut antarmuka, bukan isi jawaban bot.
>
> Tanggal akses riset: **1 Agustus 2026** (via You.com Search).

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
