import { products } from './products';
import { vouchers, formatRp } from './vouchers';

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Kunci bawaan terdekripsi di runtime
const getBuiltinKey = () => {
  try {
    return atob('QVEuQWI4Uk42SzU2Y2JyVnc4TGdObUtjZktjN05LanRhVzVLVmFkOFZ6RFR1blZEaU9OVnc=');
  } catch {
    return '';
  }
};

// Engine Persona Cerdas Kila (Fallback lokal super responsif)
export function generateLocalPersonaReply(userText, history = []) {
  const t = userText.trim().toLowerCase();

  // 1. Pulsa, Paket Data, Token Listrik, Top Up
  if (/pulsa|paket data|kuota|pln|listrik|token|top up|topup|dana|ovo|gopay|shopeepay|saldo/i.test(t)) {
    return rand([
      {
        text: 'Wah kalau pulsa, paket data, atau token listrik saat ini belum tersedia di BC-LAT kak 🙏 Kami fokus antar kebutuhan belanjaan fisik (sembako, sayur & ayam segar, mie instan, snack, dan kopi dingin) yang tiba dalam 15 menit ⚡',
        action: { label: 'Lihat Produk Sembako', tab: 'home' },
      },
      {
        text: 'Belum ada pulsa atau kuota kak hehe 🥺 Tapi kalau kamu lagi lapar tengah malam atau butuh kopi biar melek nugas, Kila siap anterin sat-set!',
        productSuggestion: 'kopi-botol',
      },
    ]);
  }

  // 2. Berantem / Gelut / Emosi / Tantangan
  if (/berantem|gelut|ribut|hajar|adu|duel|tonjok|pukul|baku hantam|anjing|babi|bangsat|tai/i.test(t)) {
    return rand([
      {
        text: 'Waduh ampun bang jago! 😭🙏 Jangan ajak Kila baku hantam dong, Kila kan cuma bot imut penjaga toko... Mending duel adu cepat: kakak checkout sekarang, kurir kami sampe sebelum 15 menit! Berani ga? ⚡🛵',
        action: { label: 'Buktikan Belanja', tab: 'home' },
      },
      {
        text: 'Aduh jangan emosi dulu kak, tensi turunin dikit yuk 🥺 Nih Kila kirimin Es Krim sama Minuman Dingin biar adem kepalanya! Mau dicariin?',
        productSuggestion: 'es-krim',
      },
      {
        text: 'Kila mah cinta damai kak ✌️ Tapi kalau urusan kecepatan nganter belanjaan, kurir kami nomor satu ga ada tandingannya di Pamulang! Coba tes pesen sekarang!',
        productSuggestion: 'mie-goreng',
      },
    ]);
  }

  // 3. "Serius" / "Beneran"
  if (/^serius(an)?(\?|!|\.)*$/i.test(t) || /beneran|masa sih|yakin/i.test(t)) {
    return rand([
      {
        text: 'Dua rius kak! Kami ga pernah main-main kalau urusan pesanan tiba 15 menit dan promo diskon 20% 😉 Kalau ga percaya, coba checkout satu barang deh!',
      },
      {
        text: 'Serius lah kak, masa Kila bohong sama pelanggan tercinta 🥺 Dark Store kami beneran standby 24 jam di dekat Universitas Pamulang (UNPAM) kok, siap meluncur kapan aja!',
      },
    ]);
  }

  // 4. Salam & Sapaan santai
  if (/^(halo|hai|hi|hey|hei|p|pagi|siang|sore|malam|assalamualaikum|oy|woi|kila|tes|test)\b/i.test(t)) {
    return rand([
      {
        text: 'Halo kak! Senang ketemu kamu ⚡ Lagi butuh cemilan, sembako dapur, atau ada kebutuhan darurat tengah malam nih? Kila siap bantu 24 jam non-stop!',
      },
      {
        text: 'Hai kak! Kila di sini 🙋‍♀️ Mau belanja apa hari ini? Hari ini lagi banyak promo Flash Sale diskon sampai 30% lho!',
        action: { label: 'Lihat Flash Sale', tab: 'home' },
      },
    ]);
  }

  // 5. Tanya Tugas Kuliah / Bisnis / Dosen / Anggota Kelompok / NIB / HAKI / Skripsi
  if (/tugas|dosen|kuliah|kelompok|anggota|presentasi|bisnis|matkul|nilai|kampus|unpam|pamulang|nib|izin|legalitas|haki|skripsi|kbli|oss/i.test(t)) {
    return {
      text: 'Betul banget kak! Website BC-LAT ini dikembangkan oleh kelompok kami (Citra, Arkhan, Lutpi, Bagas, dan Mushthofaa) di Universitas Pamulang (UNPAM) 🎓 Sudah dilengkapi simulasi Legalitas NIB OSS RBA (1111260048291 - KBLI 47911), Peta GPS Live Pamulang, serta siap didaftarkan HAKI & dilanjutkan ke Skripsi/Project Work! ✨',
      action: { label: 'Lihat Legalitas & Profil', tab: 'profile' },
    };
  }

  // 6. Voucher & Promo
  if (/voucher|promo|diskon|hemat|kupon|kode|gratis ongkir/i.test(t)) {
    const list = vouchers.map((v) => `🎁 ${v.code}: ${v.title}`).join('\n');
    return {
      text: `Nih Kila bocorin promo aktif hari ini kak:\n\n${list}\n\nMasukkan kodenya di halaman keranjang sebelum checkout ya biar langsung kepotong! 🚀`,
      action: { label: 'Buka Keranjang', tab: 'cart' },
    };
  }

  // 7. Ongkir & Pengiriman
  if (/ongkir|ongkos|kirim|tarif|bayar kurir|biaya antar/i.test(t)) {
    return {
      text: 'Ongkir flat cuma Rp5.000 untuk seluruh area layanan kak! Tapi kalau belanja minimal Rp30.000, kakak bisa pakai voucher FREEONGKIR jadi GRATIS 100%! Asik kan? 🛵💨',
    };
  }

  // 8. Berapa lama sampai / Kecepatan
  if (/lama|berapa menit|kapan|sampai|waktu|kecepatan|cepat|nyampe/i.test(t)) {
    return {
      text: '⚡ Rata-rata 10 - 15 MENIT SAMPAI kak! Begitu pesanan masuk, picker kami langsung bungkus belanjaan dalam 3 menit, lalu kurir meluncur secepat kilat.',
    };
  }

  // 9. Metode Pembayaran
  if (/bayar|pembayaran|qris|gopay|shopeepay|va|transfer|cod|tunai/i.test(t)) {
    return {
      text: 'Bisa bayar pakai apa aja kak! Mau scan QRIS (semua e-wallet & m-banking), GoPay, ShopeePay, Virtual Account BCA, sampai Bayar Tunai (COD) pas kurir ketuk pintu juga bisa 💳💵',
    };
  }

  // 10. Rokok / Alkohol / Obat Terlarang
  if (/rokok|vape|pod|alkohol|miras|bir|anggur merah/i.test(t)) {
    return {
      text: 'Mohon maaf kak, BC-LAT tidak menjual rokok atau minuman beralkohol 🙏 Kami hanya menjual makanan, minuman segar, sembako, dan kebutuhan rumah tangga sehari-hari.',
    };
  }

  // 11. Lokasi Toko & Area Layanan
  if (/lokasi|dimana|alamat|toko|cabang|daerah|area|tangsel|tangerang|serpong|viktor/i.test(t)) {
    return {
      text: 'Dark Store kami berpusat di dekat Universitas Pamulang (UNPAM), Jl. Surya Kencana No. 1, Pamulang, Tangerang Selatan 🏪 Melayani pengantaran kilat 15 menit untuk seluruh radius 3 km (Kampus UNPAM Pusat, UNPAM Viktor, Witana Harja, dan sekitarnya)!',
    };
  }

  // 12. Cara Pesan / Belanja
  if (/cara pesan|cara belanja|cara order|gimana cara/i.test(t)) {
    return {
      text: 'Gampang banget kak! 1. Pilih produk yang kamu mau 2. Masukkan ke keranjang 3. Masukkan voucher (misal FREEONGKIR) 4. Pilih pembayaran (QRIS/COD/VA). Pesanan langsung diantar dalam 15 menit! 🛵',
      action: { label: 'Mulai Pilih Produk', tab: 'home' },
    };
  }

  // 13. Minimal Belanja
  if (/minimal|min belanja|batas belanja/i.test(t)) {
    return {
      text: 'Tidak ada minimal belanja kak! Beli 1 mie instan pun tetap kami antar dalam 15 menit ⚡ Kalau mau gratis ongkir, cukup belanja minimal Rp30.000 dengan voucher FREEONGKIR!',
      action: { label: 'Buka Keranjang', tab: 'cart' },
    };
  }

  // 14. Identitas Kila / Siapa Kila
  if (/kamu siapa|siapa kamu|siapa anda|kamu bot|kamu manusia|kila itu siapa/i.test(t)) {
    return {
      text: 'Aku Kila ⚡ Customer Service AI resmi BC-LAT! Aku yang bantu jawab pertanyaan kamu, kasih rekomendasi barang, dan mastiin belanjaanmu sampai kilat 15 menit!',
    };
  }

  // 15. Terima kasih & Apresiasi
  if (/makasih|terima kasih|thanks|thank you|thx|tengkyu|sip|siap|keren|mantap|oke|okee|okey/i.test(t)) {
    return rand([
      { text: 'Sama-sama kak! Senang bisa bantu kamu 😊 Selamat berbelanja dan jangan lupa klaim voucher diskonnya yaa ⚡' },
      { text: 'Siap kak! Kalau ada butuh apa-apa lagi jangan ragu chat Kila ya, Kila standby 24 jam non-stop! ✨' },
    ]);
  }

  // 16. Lapar / Haus / Ngantuk / Begadang
  if (/laper|lapar|haus|ngantuk|begadang|makan|minum|sarapan|ngemil/i.test(t)) {
    return rand([
      {
        text: 'Lapar tengah malam emang ga bisa diajak kompromi 🥺 Untung BC-LAT buka 24 jam! Pesen Mie Goreng Instan atau Kombo Sarapan aja kak, 15 menit nyampe!',
        productSuggestion: 'mie-goreng',
      },
      {
        text: 'Mata udah 5 watt tapi tugas/kerjaan masih numpuk? Butuh asupan Kopi Susu Dingin nih kak biar melek lagi ☕⚡ Langsung Kila siapin ya?',
        productSuggestion: 'kopi-botol',
      },
    ]);
  }

  // 17. Cek apakah menyebutkan produk tertentu
  const matched = products.find(
    (p) =>
      t.includes(p.name.toLowerCase()) ||
      t.includes(p.id) ||
      p.slug.toLowerCase().includes(t) ||
      (p.category && t.includes(p.category))
  );
  if (matched) {
    return {
      text: `Ada banget kak! ${matched.name} (${matched.size}) harganya ${formatRp(matched.price)}. Kualitas terjamin dan stok masih aman di Dark Store Pamulang (UNPAM)! Mau langsung masukin ke keranjang?`,
      productSuggestion: matched.id,
    };
  }

  // 18. Pertanyaan umum "ada ... ga?"
  const adaMatch = t.match(/ada\s+([a-zA-Z0-9\s]+)\s*(ga|gak|ngga|nggak|\?|$)/i);
  if (adaMatch) {
    const item = adaMatch[1].trim();
    return {
      text: `Untuk "${item}", kebetulan belum ada di etalase kami kak 🙏 Tapi kami punya banyak pilihan sembako, sayur segar, daging, mie, snack, dan minuman dingin. Coba cek katalog ya!`,
      action: { label: 'Buka Katalog Produk', tab: 'home' },
    };
  }

  // 19. Curhat / Pujian / Casual Banter
  return rand([
    {
      text: `Haha Kila paham maksud kakak! Di BC-LAT kami siap bantu keperluan sehari-hari kamu 24 jam non-stop ⚡ Mau belanja sembako, mie, atau snack?`,
      action: { label: 'Lihat Semua Produk', tab: 'home' },
    },
    {
      text: `Siap kak! Kalau ada yang mau ditanyakan seputar produk, promo voucher diskon, atau garansi kurir 15 menit, Kila selalu standby di sini yaa 😉`,
    },
  ]);
}

// Fungsi utama AI: terhubung langsung dengan Google Gemini Flash Lite
export async function askKilaAi(message, history = [], customKey = '') {
  const key = customKey || localStorage.getItem('bclat_gemini_key') || getBuiltinKey();

  if (key) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const systemInstruction = `Kamu adalah Kila, Customer Service AI resmi dari "BC-LAT Market Online" (aplikasi quick-commerce belanja kebutuhan harian, tiba dalam 15 menit, buka 24 jam di area Universitas Pamulang / UNPAM, Tangerang Selatan).
Tim pembuat proyek kelompok ini adalah: Citra, Arkhan, Lutpi, Bagas, dan Mushthofaa.
Karakter: Ramah, santai, gaul khas anak muda/mahasiswa Indonesia, seru, suka bercanda tapi tetap membantu.
PENTING:
- Jawab singkat dan natural (1-2 kalimat saja) layaknya live chat WhatsApp / e-commerce beneran.
- Gunakan emoji secukupnya agar chat terasa hidup.
- Jika user tanya paket data/pulsa/token PLN, jelaskan secara ramah bahwa saat ini belum tersedia dan BC-LAT fokus belanjaan fisik (sembako, sayur, daging, mie, snack, kopi) antar 15 menit.
- Jika diajak bercanda, ngajak gelut/berantem, gombal, atau curhat, tanggapi dengan santai dan kocak.`;

      // Format percakapan sesuai aturan Google Gemini API (WAJIB bergantian user dan model)
      const validContents = [];
      const chatPast = history.slice(-6);

      for (const h of chatPast) {
        const role = h.from === 'me' ? 'user' : 'model';
        if (validContents.length === 0 && role !== 'user') continue;
        if (validContents.length > 0 && validContents[validContents.length - 1].role === role) continue;
        validContents.push({ role, parts: [{ text: h.text }] });
      }

      if (validContents.length === 0 || validContents[validContents.length - 1].role !== 'user') {
        validContents.push({ role: 'user', parts: [{ text: message }] });
      } else {
        validContents[validContents.length - 1].parts = [{ text: message }];
      }

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemInstruction }] },
            contents: validContents,
            generationConfig: {
              temperature: 0.9,
              maxOutputTokens: 200,
            },
          }),
        }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) {
          const prod = products.find((p) => text.toLowerCase().includes(p.name.toLowerCase()));
          return { text, productSuggestion: prod ? prod.id : null };
        }
      }
    } catch {
      // Jika terjadi kendala jaringan/timeout, lanjut ke engine persona lokal
    }
  }

  // Fallback selalu aman dan cerdas ke Persona Kila
  return generateLocalPersonaReply(message, history);
}
