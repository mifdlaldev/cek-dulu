// Cek Dulu — logika antarmuka chat.
//
// Requirement yang diimplementasikan berkas ini:
//   UI-02  pesan pengguna langsung tampil
//   UI-03  payload memakai field conversation, bukan messages
//   UI-04  riwayat multi-turn disimpan di memori browser
//   UI-05  indikator tiga titik diganti di tempat
//   UI-06  penanganan respons dan teks fallback
//   UI-11  aria-busy, aria-expanded, focus trap, Escape, pengembalian fokus
//   UI-13  buka dan tutup panel dialog
//   UI-14  seluruh CTA landing page menunjuk satu aksi: membuka panel
//   UI-15  blok contoh pertanyaan dapat ditutup
//
// Pola dialog mengikuti W3C ARIA Authoring Practices: fokus masuk saat dibuka, fokus
// terkurung selama terbuka, Escape menutup, fokus kembali ke pemicu saat ditutup.
// Sitasi: docs/RISET-DESAIN.md bagian 2. Keputusan: design.md D-18.
//
// Gulir mulus untuk anchor navigasi ditangani `scroll-behavior` di CSS, bukan di sini.
// Properti itu sudah dinonaktifkan otomatis oleh blok prefers-reduced-motion, sedangkan
// implementasi JavaScript harus memeriksa preferensi itu sendiri.
//
// Kolom pesan adalah <textarea> yang tumbuh ke bawah, menyimpang dari <input type="text">
// pada materi S3 p.37. Enter mengirim, Shift+Enter menyisipkan baris.
// Sitasi: docs/RISET-DESAIN.md bagian 7. Keputusan: design.md D-21a.
//
// Spesifikasi: openspec/changes/add-cekdulu-chatbot/specs/chat-ui/spec.md

const launcher = document.getElementById('launcher');
const panel = document.getElementById('chat-panel');
const closeButton = document.getElementById('close-button');
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const sendButton = document.getElementById('send-button');
const samples = document.getElementById('samples');
const samplesClose = document.getElementById('samples-close');

// UI-04 — riwayat percakapan hanya hidup di memori browser. Tidak ada penyimpanan
// di server maupun localStorage, sehingga riwayat hilang saat halaman di-reload.
// Sapaan pembuka UI-07 sengaja tidak dimasukkan ke array ini agar tidak
// membingungkan konteks model.
const conversation = [];

const TEKS_MENUNGGU = 'Cek Dulu sedang menyiapkan jawaban';
const TEKS_TANPA_HASIL = 'Sorry, no response received.';
const TEKS_GAGAL = 'Failed to get response from server.';

// Berkas avatar bot. Nilai yang sama dipakai HTML statis pada sapaan pembuka dan header
// panel, sehingga browser memakai satu permintaan jaringan dari cache.
const AVATAR_BOT = 'avatar.png';

// Selector elemen yang dapat menerima fokus di dalam panel, dipakai oleh focus trap.
const SELECTOR_FOKUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

// UI-01 — field-sizing: content menumbuhkan tinggi textarea tanpa JavaScript, dan sudah
// bekerja lintas browser sejak Juni 2026. Fallback hanya dipasang bila browser tidak
// mendukungnya, sehingga tidak ada reflow per ketikan pada browser modern.
const DUKUNG_FIELD_SIZING =
  typeof CSS !== 'undefined' && CSS.supports('field-sizing', 'content');

// UI-14, UI-11 — tombol yang terakhir membuka panel. Fokus dikembalikan ke elemen ini
// saat panel ditutup, bukan selalu ke launcher, agar pengguna keyboard yang membuka
// panel dari CTA di tengah halaman tidak terlempar ke sudut layar.
let pemicuTerakhir = launcher;

/**
 * Menggulir area percakapan ke pesan terbaru. (UI-06)
 *
 * @returns {void}
 */
function scrollKeBawah() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

/**
 * Membuat bubble pesan beserta avatar dan penanda pengirim. (UI-02, UI-10, UI-11)
 *
 * Isi pesan diset dengan `textContent`, bukan `innerHTML`. Selain menghindari
 * kebutuhan pustaka sanitasi, ini mencegah keluaran model dieksekusi sebagai HTML.
 * Keputusan D-07; larangan penulisan HTML mentah ditegakkan otomatis oleh CI.
 *
 * @param {'user' | 'bot'} pengirim Peran pengirim pesan.
 * @param {string} teks Isi pesan yang ditampilkan.
 * @returns {{ artikel: HTMLElement, isi: HTMLElement }} Referensi elemen agar isinya
 *   dapat diganti di tempat oleh `UI-05`.
 */
function appendMessage(pengirim, teks) {
  const artikel = document.createElement('article');
  artikel.classList.add('msg', pengirim === 'user' ? 'msg--user' : 'msg--bot');

  // Avatar disembunyikan dari screen reader agar peran tidak dibaca dua kali bersama
  // penanda pengirim di bawahnya. Bot memakai berkas gambar (D-22), pengguna tetap
  // inisial dari CSS dan teks karena hanya satu huruf.
  const avatar = pengirim === 'user' ? document.createElement('span') : document.createElement('img');
  avatar.className = 'msg__avatar';
  avatar.setAttribute('aria-hidden', 'true');
  if (pengirim === 'user') {
    avatar.textContent = 'A';
  } else {
    avatar.src = AVATAR_BOT;
    avatar.alt = '';
    avatar.width = 64;
    avatar.height = 64;
  }

  const body = document.createElement('div');
  body.className = 'msg__body';

  // UI-11 — penanda pengirim berupa teks agar terbaca screen reader, bukan hanya
  // dibedakan lewat warna dan posisi.
  const label = document.createElement('span');
  label.className = 'msg__who';
  label.textContent = pengirim === 'user' ? 'Anda' : 'Cek Dulu';

  const isi = document.createElement('p');
  isi.className = 'msg__text';
  isi.textContent = teks;

  body.append(label, isi);
  artikel.append(avatar, body);
  chatBox.appendChild(artikel);
  scrollKeBawah();

  return { artikel, isi };
}

/**
 * Mengganti isi bubble menunggu dengan tiga titik beranimasi. (UI-05)
 *
 * Titik disertai teks tersembunyi karena animasi tidak menyampaikan apa pun kepada
 * screen reader. Keputusan D-19.
 *
 * @param {HTMLElement} isi Elemen paragraf yang akan diisi indikator.
 * @returns {void}
 */
function pasangIndikator(isi) {
  isi.textContent = '';

  const wadah = document.createElement('span');
  wadah.className = 'dots';
  wadah.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 3; i += 1) {
    const titik = document.createElement('span');
    titik.className = 'dots__dot';
    wadah.appendChild(titik);
  }

  const teks = document.createElement('span');
  teks.className = 'sr-only';
  teks.textContent = TEKS_MENUNGGU;

  isi.append(wadah, teks);
}

/**
 * Menyesuaikan tinggi kolom pesan dengan isinya. (UI-01)
 *
 * Hanya dipakai sebagai fallback bila browser tidak mendukung `field-sizing: content`.
 * Urutan `auto` lalu `scrollHeight` bersifat wajib: tanpa reset ke `auto`, tinggi eksplisit
 * sebelumnya menahan layout sehingga `scrollHeight` tidak menyusut dan kolom yang sudah
 * tinggi tidak pernah kembali mengecil. Batas atas ditangani `max-height` di CSS.
 * Sitasi: docs/RISET-DESAIN.md bagian 7. Keputusan: design.md D-21a.
 *
 * @returns {void}
 */
function sesuaikanTinggiKolom() {
  if (DUKUNG_FIELD_SIZING) return;
  input.style.height = 'auto';
  input.style.height = `${input.scrollHeight}px`;
}

/**
 * Mengembalikan kolom pesan ke tinggi satu baris. (UI-01, UI-02)
 *
 * Dipanggil setelah pesan terkirim, karena mengosongkan `value` saja tidak melepas tinggi
 * inline yang sudah disetel fallback.
 *
 * @returns {void}
 */
function resetTinggiKolom() {
  if (DUKUNG_FIELD_SIZING) return;
  input.style.height = 'auto';
}

/**
 * Menyembunyikan blok contoh pertanyaan. (UI-15, UI-11)
 *
 * Blok disembunyikan dengan atribut `hidden`, bukan dihapus dari DOM: menghapus elemen yang
 * sedang memegang fokus membuat fokus melompat ke `body` dan pengguna keyboard kehilangan
 * posisi. Fokus dipindahkan eksplisit ke kolom pesan. Keputusan: design.md D-21b.
 *
 * @returns {void}
 */
function tutupBlokSaran() {
  samples.hidden = true;
  samplesClose.setAttribute('aria-expanded', 'false');
  input.focus();
  scrollKeBawah();
}

/**
 * Mengatur status sibuk antarmuka selama menunggu respons. (UI-05, UI-11)
 *
 * @param {boolean} sibuk `true` saat permintaan sedang berjalan.
 * @returns {void}
 */
function setSibuk(sibuk) {
  chatBox.setAttribute('aria-busy', String(sibuk));
  sendButton.disabled = sibuk;
  input.disabled = sibuk;
}

/**
 * Membuka panel dialog. (UI-13, UI-11, UI-14)
 *
 * Pemicu dicatat agar fokus dapat dikembalikan ke tombol yang benar saat panel
 * ditutup. Tanpa ini, pengguna keyboard yang membuka panel dari CTA di tengah halaman
 * akan terlempar ke launcher di sudut layar.
 *
 * @param {HTMLElement} [pemicu] Tombol yang membuka panel. Default launcher.
 * @returns {void}
 */
function bukaPanel(pemicu) {
  pemicuTerakhir = pemicu instanceof HTMLElement ? pemicu : launcher;
  panel.hidden = false;
  launcher.setAttribute('aria-expanded', 'true');
  input.focus();
  scrollKeBawah();
}

/**
 * Menutup panel dialog dan mengembalikan fokus ke pemicu yang membukanya. (UI-13, UI-11)
 *
 * Pengembalian fokus ke pemicu adalah salah satu dari empat kegagalan tersering pada
 * implementasi dialog, sehingga ditangani eksplisit.
 *
 * @returns {void}
 */
function tutupPanel() {
  panel.hidden = true;
  launcher.setAttribute('aria-expanded', 'false');
  pemicuTerakhir.focus();
}

/**
 * Mengurung fokus di dalam panel selama panel terbuka. (UI-11)
 *
 * Tanpa ini, Tab akan melanjutkan ke elemen di badan halaman dan pengguna keyboard
 * kehilangan konteks dialog.
 *
 * @param {KeyboardEvent} event Peristiwa penekanan tombol.
 * @returns {void}
 */
function kurungFokus(event) {
  const kandidat = Array.from(panel.querySelectorAll(SELECTOR_FOKUSABLE)).filter(
    (el) => !el.disabled && el.offsetParent !== null,
  );
  if (kandidat.length === 0) return;

  const pertama = kandidat[0];
  const terakhir = kandidat[kandidat.length - 1];

  if (event.shiftKey && document.activeElement === pertama) {
    event.preventDefault();
    terakhir.focus();
  } else if (!event.shiftKey && document.activeElement === terakhir) {
    event.preventDefault();
    pertama.focus();
  }
}

/**
 * Menangani penekanan tombol pada kolom pesan. (UI-01, UI-11)
 *
 * Enter mengirim, Shift+Enter menyisipkan baris baru — konvensi WhatsApp, Telegram, dan
 * Slack. Pengiriman sengaja dipicu dari `keydown`, bukan dari peristiwa `input`: mengirim
 * pada perubahan nilai melanggar WCAG 3.2.2 On Input.
 *
 * Shift+Enter tidak ditangani sama sekali agar perilaku bawaan textarea berjalan.
 * Sitasi: docs/RISET-DESAIN.md bagian 7. Keputusan: design.md D-21a.
 *
 * @param {KeyboardEvent} event Peristiwa penekanan tombol.
 * @returns {void}
 */
function handleKolomKeydown(event) {
  if (event.key !== 'Enter' || event.shiftKey) return;
  event.preventDefault();
  form.requestSubmit();
}

/**
 * Menangani penekanan tombol saat panel terbuka. (UI-11, UI-13)
 *
 * @param {KeyboardEvent} event Peristiwa penekanan tombol.
 * @returns {void}
 */
function handleKeydown(event) {
  if (panel.hidden) return;

  if (event.key === 'Escape') {
    event.preventDefault();
    tutupPanel();
    return;
  }

  if (event.key === 'Tab') {
    kurungFokus(event);
  }
}

/**
 * Mengirim riwayat percakapan ke backend. (UI-03)
 *
 * Body memakai field `conversation` dengan item `{ role, text }`, mengikuti kode
 * backend pada materi Sesi 3 p.29. Contoh `script.js` pada materi p.39 mengirim
 * `{ messages: [{ role, content }] }` dan itu tidak dibaca endpoint — lihat
 * design.md keputusan D-03.
 *
 * @param {Array<{role: string, text: string}>} riwayat Riwayat percakapan utuh.
 * @returns {Promise<{result?: string}>} Body respons yang sudah diparsing.
 * @throws {Error} Bila status respons bukan OK.
 */
async function kirimKeBackend(riwayat) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversation: riwayat }),
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  return response.json();
}

/**
 * Menangani pengiriman form chat. (UI-02, UI-03, UI-04, UI-05, UI-06, UI-11)
 *
 * @param {SubmitEvent} event Peristiwa submit form.
 * @returns {Promise<void>}
 */
async function handleSubmit(event) {
  event.preventDefault();

  const pesanPengguna = input.value.trim();
  if (!pesanPengguna) return;

  appendMessage('user', pesanPengguna);
  conversation.push({ role: 'user', text: pesanPengguna });
  input.value = '';
  resetTinggiKolom();

  // UI-05 — bubble sementara dibuat sekali, lalu isinya diganti di tempat setelah
  // respons tiba. Materi Sesi 3 p.41 menyebut pendekatan ini menghindari pergeseran
  // tata letak yang mengganggu.
  const { isi } = appendMessage('bot', '');
  pasangIndikator(isi);
  setSibuk(true);

  try {
    const data = await kirimKeBackend(conversation);

    if (data && data.result) {
      isi.textContent = data.result;
      conversation.push({ role: 'model', text: data.result });
    } else {
      // UI-06 — teks fallback disalin verbatim dari materi Sesi 3 p.37.
      // Tidak di-push ke riwayat agar konteks model tidak tercemar.
      isi.textContent = TEKS_TANPA_HASIL;
    }
  } catch (error) {
    console.error('Gagal mengambil respons:', error);
    isi.textContent = TEKS_GAGAL;
  } finally {
    setSibuk(false);
    // UI-11 — fokus dikembalikan ke kolom pesan agar pengguna keyboard dapat
    // langsung mengetik lagi tanpa menyentuh mouse.
    input.focus();
    scrollKeBawah();
  }
}

launcher.addEventListener('click', bukaPanel);
closeButton.addEventListener('click', tutupPanel);
document.addEventListener('keydown', handleKeydown);
form.addEventListener('submit', handleSubmit);
input.addEventListener('keydown', handleKolomKeydown);
samplesClose.addEventListener('click', tutupBlokSaran);

// UI-01 — fallback tinggi kolom hanya dipasang bila field-sizing tidak didukung, sehingga
// browser modern tidak menanggung reflow per ketikan.
if (!DUKUNG_FIELD_SIZING) {
  input.addEventListener('input', sesuaikanTinggiKolom);
}

// UI-14 — seluruh tombol CTA di halaman menunjuk satu aksi yang sama: membuka panel.
// Genesys Growth menetapkan satu aksi utama per halaman, tanpa pengecualian.
for (const pemicu of document.querySelectorAll('[data-buka-panel]')) {
  pemicu.addEventListener('click', () => bukaPanel(pemicu));
}

// Contoh pertanyaan mengisi kolom pesan saat diklik. Berupa <button> sehingga
// terjangkau keyboard sesuai UI-11.
for (const chip of document.querySelectorAll('.chip')) {
  chip.addEventListener('click', () => {
    input.value = chip.dataset.fill ?? '';
    sesuaikanTinggiKolom();
    input.focus();
  });

  // UI-11 — daftar chip digulir horizontal, sehingga chip yang menerima fokus keyboard
  // bisa berada sebagian di luar area terlihat dan cincin fokusnya terpotong. Chrome
  // tidak menggulir sendiri bila elemen sudah terlihat separuh, jadi digulir eksplisit.
  chip.addEventListener('focus', () => {
    chip.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  });
}
