import { products } from './products';
import { vouchers, formatRp } from './vouchers';

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Engine Persona Cerdas Kila: menjawab ribuan skenario percakapan dengan luwes
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
        text: 'Kila mah cinta damai kak ✌️ Tapi kalau urusan kecepatan nganter belanjaan, kurir kami nomor satu ga ada tandingannya di Sleman! Coba tes pesen sekarang!',
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
        text: 'Serius lah kak, masa Kila bohong sama pelanggan tercinta 🥺 Dark Store kami beneran standby 24 jam di Kaliurang kok, siap meluncur kapan aja!',
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

  // 5. Tanya Tugas Kuliah / Bisnis / Dosen
  if (/tugas|dosen|kuliah|kelompok|presentasi|bisnis|matkul|nilai|kampus/i.test(t)) {
    return {
      text: 'Betul banget kak! Ini adalah website demo bisnis kelompok kami untuk mata kuliah Bisnis 🎓 Kami mendemokan konsep Quick-Commerce dengan sistem Dark Store 15 menit (mirip Astro). Semoga bapak/ibu dosen ngasih nilai A yaa! Aamiin 🤲✨',
      action: { label: 'Buka Dashboard Admin Toko', tab: 'admin' },
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

  // 11. Lapar / Haus / Ngantuk / Begadang
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

  // 12. Cari Produk Otomatis dari Database
  const matched = products.find(
    (p) =>
      t.includes(p.name.toLowerCase()) ||
      t.includes(p.id) ||
      p.slug.toLowerCase().includes(t) ||
      (p.category && t.includes(p.category))
  );
  if (matched) {
    return {
      text: `Ada banget kak! ${matched.name} (${matched.size}) harganya ${formatRp(matched.price)}. Kualitas terjamin dan stok masih aman di Dark Store Kaliurang! Mau langsung masukin ke keranjang?`,
      productSuggestion: matched.id,
    };
  }

  // 13. Pertanyaan umum "ada ... ga?"
  const adaMatch = t.match(/ada\s+([a-zA-Z0-9\s]+)\s*(ga|gak|ngga|nggak|\?|$)/i);
  if (adaMatch) {
    const item = adaMatch[1].trim();
    return {
      text: `Untuk "${item}", kebetulan belum ada di etalase kami kak 🙏 Tapi kami punya banyak pilihan sembako, sayur segar, daging, mie, snack, dan minuman dingin. Coba cek katalog ya!`,
      action: { label: 'Buka Katalog Produk', tab: 'home' },
    };
  }

  // 14. Curhat / Pujian / Casual Banter
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

// Fungsi AI: memformat chat secara valid untuk Gemini API (menghindari error 400 Google API)
export async function askKilaAi(message, history = [], customKey = '') {
  const key = customKey || localStorage.getItem('bclat_gemini_key') || '';

  if (key) {
    try {
      const systemInstruction = `Kamu adalah Kila, Customer Service AI resmi dari "BC-LAT Market Online" (aplikasi quick-commerce belanja keperluan sehari-hari tiba dalam 15 menit, buka 24 jam di Sleman/Yogyakarta).
Karakter: Ramah, santai, gaul khas anak muda/mahasiswa Indonesia, sedikit humoris, ceria, dan sangat ekspresif.
PENTING:
- Jawab singkat, padat, dan natural seperti chat WhatsApp / live chat e-commerce (1-3 kalimat saja).
- Gunakan emoji secukupnya agar chat terasa hidup.
- Jika user menanyakan produk yang tidak dijual (seperti pulsa, paket data, rokok), jelaskan secara ramah bahwa BC-LAT fokus pada belanjaan fisik (sembako, sayur/daging, snack, mie instan, minuman dingin) yang diantar 15 menit.
- Jika diajak bercanda, ngajak gelut/berantem, atau curhat, ladeni dengan santai dan lucu.`;

      // Bangun riwayat yang valid untuk Gemini: WAJIB diawali user dan bergantian peran
      const validContents = [];
      const chatPast = history.slice(-8);

      for (const h of chatPast) {
        const role = h.from === 'me' ? 'user' : 'model';
        // Aturan 1: Content pertama harus 'user'
        if (validContents.length === 0 && role !== 'user') continue;
        // Aturan 2: Tidak boleh ada role ganda berturut-turut
        if (validContents.length > 0 && validContents[validContents.length - 1].role === role) continue;
        validContents.push({ role, parts: [{ text: h.text }] });
      }

      // Pastikan pesan terakhir adalah pesan user saat ini
      if (validContents.length === 0 || validContents[validContents.length - 1].role !== 'user') {
        validContents.push({ role: 'user', parts: [{ text: message }] });
      } else {
        // Jika turn terakhir user, update teksnya
        validContents[validContents.length - 1].parts = [{ text: message }];
      }

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) {
          const prod = products.find((p) => text.toLowerCase().includes(p.name.toLowerCase()));
          return { text, productSuggestion: prod ? prod.id : null };
        }
      } else {
        console.warn('Gemini API response not OK:', res.status);
      }
    } catch (err) {
      console.warn('Gemini API fetch error:', err);
    }
  }

  // Fallback selalu aman dan cerdas ke Persona Kila
  return generateLocalPersonaReply(message, history);
}
