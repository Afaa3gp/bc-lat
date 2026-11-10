import { products } from './products';
import { vouchers, formatRp } from './vouchers';

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Fallback cerdas berbasis Persona Kila yang sangat ekspresif, gaul & adaptif
export function generateLocalPersonaReply(userText, history = []) {
  const t = userText.trim().toLowerCase();

  // 1. Berantem / Gelut / Nantang
  if (/berantem|gelut|ribut|hajar|adu|duel|tonjok|pukul|baku hantam/i.test(t)) {
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
        text: 'Kila mah cinta damai kak ✌️ Tapi kalau urusan kecepatan nganter belanjaan, kurir kami nomor satu ga ada tandingannya di Sleman! Coba tes pesen Indomie sekarang!',
        productSuggestion: 'mie-goreng',
      },
      {
        text: 'Haha santai atuh kak, tarik napas dulu... Mau marah-marah tapi perut kosong kan ga enak? Mending ngemil keripik kentang dulu gih 🍿',
        productSuggestion: 'keripik',
      },
    ]);
  }

  // 2. "Serius" / "Beneran"
  if (/^serius(an)?(\?|!|\.)*$/i.test(t) || /beneran|masa sih|yakin/i.test(t)) {
    return rand([
      {
        text: 'Dua rius kak! Kami ga pernah main-main kalau urusan pesanan tiba 15 menit dan promo diskon 20% 😉 Kalau ga percaya, coba checkout satu barang deh!',
      },
      {
        text: 'Serius lah kak, masa Kila boong sama pelanggan tercinta 🥺 Dark Store kami beneran standby 24 jam di Kaliurang kok, siap meluncur kapan aja!',
      },
      {
        text: 'Beneran 100% kak suerrr ✌️ Tim picker sama kurir kami udah sat-set terlatih kayak pembalap MotoGP!',
      },
    ]);
  }

  // 3. Salam & Sapaan santai
  if (/^(halo|hai|hi|hey|hei|p|pagi|siang|sore|malam|assalamualaikum|oy|woi|kila|tes|test)\b/i.test(t)) {
    return rand([
      {
        text: 'Halo kak! Senang ketemu kamu ⚡ Lagi butuh cemilan, sembako dapur, atau ada kebutuhan darurat tengah malam nih? Kila siap bantu 24 jam non-stop!',
      },
      {
        text: 'Hai kak! Kila di sini 🙋‍♀️ Mau belanja apa hari ini? Hari ini lagi banyak promo Flash Sale diskon sampai 30% lho!',
        action: { label: 'Lihat Flash Sale', tab: 'home' },
      },
      {
        text: 'Halo kak! Ada yang bisa Kila bantu cariin? Jangan lupa pakai kode voucher BCLATHEMAT ya biar dapet potongan harga! 🎉',
      },
    ]);
  }

  // 4. Tanya Tugas Kuliah / Bisnis / Dosen
  if (/tugas|dosen|kuliah|kelompok|presentasi|bisnis|matkul|nilai|kampus/i.test(t)) {
    return {
      text: 'Betul banget kak! Ini adalah website demo bisnis kelompok kami untuk mata kuliah Bisnis 🎓 Kami mendemokan konsep Quick-Commerce dengan sistem Dark Store 15 menit (mirip Astro) yang siap disimulasikan. Semoga bapak/ibu dosen ngasih nilai A yaa! Aamiin 🤲✨',
      action: { label: 'Buka Dashboard Admin Toko', tab: 'admin' },
    };
  }

  // 5. Tanya Voucher & Promo
  if (/voucher|promo|diskon|hemat|kupon|kode|gratis/i.test(t)) {
    const list = vouchers.map((v) => `🎁 ${v.code}: ${v.title}`).join('\n');
    return {
      text: `Nih Kila bocorin promo aktif hari ini kak:\n\n${list}\n\nMasukkan kodenya di halaman keranjang sebelum checkout ya biar langsung kepotong! 🚀`,
      action: { label: 'Buka Keranjang', tab: 'cart' },
    };
  }

  // 6. Ongkir & Pengiriman
  if (/ongkir|ongkos|kirim|tarif|bayar kurir|biaya antar/i.test(t)) {
    return {
      text: 'Ongkir flat cuma Rp5.000 untuk seluruh area layanan kak! Tapi kalau belanja minimal Rp30.000, kakak bisa pakai voucher FREEONGKIR jadi GRATIS 100%! Asik kan? 🛵💨',
    };
  }

  // 7. Berapa lama sampai / Kecepatan
  if (/lama|berapa menit|kapan|sampai|waktu|kecepatan|cepat|nyampe/i.test(t)) {
    return {
      text: '⚡ Rata-rata 10 - 15 MENIT SAMPAI kak! Begitu pesanan masuk, picker kami langsung bungkus belanjaan dalam 3 menit, lalu kurir meluncur secepat kilat. Kami ada live tracking-nya juga pas order!',
    };
  }

  // 8. Metode Pembayaran
  if (/bayar|pembayaran|qris|gopay|shopeepay|va|transfer|cod|tunai/i.test(t)) {
    return {
      text: 'Bisa bayar pakai apa aja kak! Mau scan QRIS (semua e-wallet & m-banking), GoPay, ShopeePay, Virtual Account BCA, sampai Bayar Tunai (COD) pas kurir ketuk pintu juga bisa 💳💵',
    };
  }

  // 9. Lapar / Haus / Ngantuk / Begadang
  if (/laper|lapar|haus|ngantuk|begadang|makan|minum|sarapan|ngemil/i.test(t)) {
    return rand([
      {
        text: 'Lapar tengah malam emang ga bisa diajak kompromi 🥺 Untung BC-LAT buka 24 jam! Pesen Mie Goreng Instan atau Kombo Sarapan aja kak, 15 menit nyampe langsung bisa dimasak!',
        productSuggestion: 'mie-goreng',
      },
      {
        text: 'Mata udah 5 watt tapi tugas/kerjaan masih numpuk? Butuh asupan Kopi Susu Dingin nih kak biar melek lagi ☕⚡ Langsung Kila siapin ya?',
        productSuggestion: 'kopi-botol',
      },
      {
        text: 'Pengen yang seger-seger manis? Susu UHT dingin atau Jeruk Segar enak banget nih kak buat nemenin harimu! 🍊🥛',
        productSuggestion: 'susu-uht',
      },
    ]);
  }

  // 10. Curhat / Galau / Asik-asikan
  if (/jomblo|pacar|cinta|sayang|sedih|capek|lelah|pusing|kesepian/i.test(t)) {
    return rand([
      {
        text: 'Duh kak, jodoh mungkin masih di tangan Tuhan, tapi kalau cemilan manis buat naikin mood bisa Kila anter 15 menit ke depan pintu! Semangat yaa kak! 🥰🍫',
        productSuggestion: 'cokelat',
      },
      {
        text: 'Tarik napas dalam-dalam kak... Capek itu wajar kok, istirahat dulu sebentar. Jangan lupa makan yang enak ya, mau Kila rekomendasiin makanan favorit anak kost?',
        productSuggestion: 'kombo-sarapan',
      },
      {
        text: 'Sini cerita sama Kila, Kila dengerin kok hehe. Tapi sambil ngobrol, jangan lupa minum air putih yang cukup ya kak biar ga dehidrasi! 💧',
        productSuggestion: 'air-mineral',
      },
    ]);
  }

  // 11. Pujian / Makasih
  if (/makasih|terima kasih|thanks|keren|mantap|top|hebat|good|lucu|gemes/i.test(t)) {
    return rand([
      {
        text: 'Aaa makasih banyak kak! Senang banget bisa bikin kamu hepi 🥰 Jangan lupa belanja terus di BC-LAT yaa ⚡',
      },
      {
        text: 'Sama-sama kak! Kalau Kila bikin kamu puas, jangan lupa doain presentasi kelompok kami dapet nilai A ya! ⭐⭐⭐⭐⭐',
      },
    ]);
  }

  // 12. Cek apakah menyebutkan produk tertentu
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

  // 13. Respon Fleksibel yang Menjawab Topik User secara Personal
  return rand([
    {
      text: `Haha asik banget ngobrol sama kamu kak! Mengenai "${userText}", Kila siap nemenin kamu belanja kebutuhan sehari-hari 24 jam non-stop ⚡ Ada cemilan atau sembako yang mau Kila cariin sekarang?`,
      action: { label: 'Lihat Semua Produk', tab: 'home' },
    },
    {
      text: `Hehe iya kak! Pokoknya kalau kamu butuh apa-apa yang urgent tengah malam atau mau masak sat-set, inget BC-LAT ya! Belanjaan tiba dalam 15 menit dijamin fresh ✨`,
    },
    {
      text: `Wah menarik kak! Ngomong-ngomong, kakak udah cek promo diskon 20% hari ini belum? Kalau mau belanja hemat, tinggal bilang ke Kila yaa 😉`,
      action: { label: 'Buka Keranjang', tab: 'cart' },
    },
  ]);
}

// Fungsi utama pemanggil AI: mencoba Gemini API dulu (jika key ada), kalau tidak ada pakai Local Generative Engine
export async function askKilaAi(message, history = [], customKey = '') {
  const key = customKey || localStorage.getItem('bclat_gemini_key') || '';

  // 1. Jika ada API Key di localStorage atau Vercel Serverless
  if (key) {
    try {
      const systemInstruction = `Kamu adalah Kila, Customer Service AI resmi dari "BC-LAT Market Online" (aplikasi quick-commerce belanja kebutuhan sehari-hari tiba dalam 15 menit, buka 24 jam di Sleman/Jogja).
Karakter: Ramah, santai, gaul, ceria, sedikit humoris khas anak muda Indonesia, suka bercanda dan sangat ekspresif.
PENTING: Jawab singkat, natural, dan to the point layaknya chat WhatsApp / live chat e-commerce (1-3 kalimat saja). Boleh gunakan emoji secukupnya. Jangan pernah bikin format surat atau esai panjang.
Kalau ada yang ngajak berantem, curhat, atau bercanda, ladeni dengan santai dan lucu.`;

      const contents = [
        ...history.slice(-6).map((h) => ({
          role: h.from === 'me' ? 'user' : 'model',
          parts: [{ text: h.text }],
        })),
        { role: 'user', parts: [{ text: message }] },
      ];

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemInstruction }] },
            contents,
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
      }
    } catch {
      // Abaikan jika offline / quota limit
    }
  }

  // 2. Coba Vercel Serverless Function /api/chat jika tersedia
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, customApiKey: key }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.reply) {
        const prod = products.find((p) => data.reply.toLowerCase().includes(p.name.toLowerCase()));
        return { text: data.reply, productSuggestion: prod ? prod.id : null };
      }
    }
  } catch {
    // Abaikan jika offline / local tanpa vercel dev
  }

  // 3. Fallback ke Generative Persona Engine Kila yang sangat hidup
  return generateLocalPersonaReply(message, history);
}
