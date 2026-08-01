// Cek Dulu — logika antarmuka chat.
//
// Requirement yang diimplementasikan berkas ini:
//   UI-02  pesan pengguna langsung tampil
//   UI-03  payload memakai field conversation, bukan messages
//   UI-04  riwayat multi-turn disimpan di memori browser
//   UI-05  indikator sedang berpikir diganti di tempat
//   UI-06  penanganan respons dan teks fallback
//   UI-11  aria-busy, pengembalian fokus, penanda pengirim
//
// Spesifikasi: openspec/changes/add-cekdulu-chatbot/specs/chat-ui/spec.md

const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const sendButton = document.getElementById('send-button');

// UI-04 — riwayat percakapan hanya hidup di memori browser. Tidak ada penyimpanan
// di server maupun localStorage, sehingga riwayat hilang saat halaman di-reload.
// Sapaan pembuka UI-07 sengaja tidak dimasukkan ke array ini agar tidak
// membingungkan konteks model.
const conversation = [];

const TEKS_MENUNGGU = 'Cek Dulu sedang memeriksa...';
const TEKS_TANPA_HASIL = 'Sorry, no response received.';
const TEKS_GAGAL = 'Failed to get response from server.';

/**
 * Menggulir area percakapan ke pesan terbaru. (UI-06)
 *
 * @returns {void}
 */
function scrollKeBawah() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

/**
 * Menambahkan satu bubble pesan ke area percakapan. (UI-02, UI-05, UI-11)
 *
 * Isi pesan diset dengan `textContent`, bukan `innerHTML`. Selain menghindari
 * kebutuhan pustaka sanitasi, ini mencegah keluaran model dieksekusi sebagai HTML.
 * Keputusan D-07; larangan `innerHTML` ditegakkan otomatis oleh CI.
 *
 * @param {'user' | 'bot'} pengirim Peran pengirim pesan.
 * @param {string} teks Isi pesan yang ditampilkan.
 * @param {boolean} [menunggu=false] Menandai bubble sebagai indikator sementara.
 * @returns {{ artikel: HTMLElement, paragraf: HTMLElement }} Referensi elemen agar
 *   isinya dapat diganti di tempat oleh `UI-05`.
 */
function appendMessage(pengirim, teks, menunggu = false) {
  const artikel = document.createElement('article');
  artikel.classList.add('msg', pengirim === 'user' ? 'msg--user' : 'msg--bot');
  if (menunggu) artikel.classList.add('msg--menunggu');

  // UI-11 — penanda pengirim ditulis sebagai teks agar terbaca screen reader,
  // tidak hanya dibedakan lewat warna dan posisi.
  const label = document.createElement('span');
  label.className = 'msg__who';
  label.textContent = pengirim === 'user' ? 'Anda' : 'Cek Dulu';

  const paragraf = document.createElement('p');
  paragraf.className = 'msg__text';
  paragraf.textContent = teks;

  artikel.append(label, paragraf);
  chatBox.appendChild(artikel);
  scrollKeBawah();

  return { artikel, paragraf };
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

  // UI-05 — bubble sementara dibuat sekali, lalu isinya diganti di tempat setelah
  // respons tiba. Materi Sesi 3 p.41 menyebut pendekatan ini menghindari
  // pergeseran tata letak yang mengganggu.
  const { artikel, paragraf } = appendMessage('bot', TEKS_MENUNGGU, true);
  setSibuk(true);

  try {
    const data = await kirimKeBackend(conversation);

    if (data && data.result) {
      paragraf.textContent = data.result;
      artikel.classList.remove('msg--menunggu');
      conversation.push({ role: 'model', text: data.result });
    } else {
      // UI-06 — teks fallback disalin verbatim dari materi Sesi 3 p.37.
      // Tidak di-push ke riwayat agar konteks model tidak tercemar.
      paragraf.textContent = TEKS_TANPA_HASIL;
    }
  } catch (error) {
    console.error('Gagal mengambil respons:', error);
    paragraf.textContent = TEKS_GAGAL;
  } finally {
    setSibuk(false);
    // UI-11 — fokus dikembalikan ke kolom pesan agar pengguna keyboard dapat
    // langsung mengetik lagi tanpa menyentuh mouse.
    input.focus();
    scrollKeBawah();
  }
}

form.addEventListener('submit', handleSubmit);

// Task D20 — contoh pertanyaan mengisi kolom pesan saat diklik. Berupa <button>
// sehingga terjangkau keyboard sesuai UI-11.
for (const chip of document.querySelectorAll('.chip')) {
  chip.addEventListener('click', () => {
    input.value = chip.dataset.fill ?? '';
    input.focus();
  });
}
