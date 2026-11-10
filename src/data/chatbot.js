import { products } from './products';
import { vouchers, formatRp } from './vouchers';

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function getCsReply(userText, context = {}) {
  const t = userText.trim().toLowerCase();

  // 1. Berantem / Emosi / Tantangan / Becanda
  if (/berantem|gelut|ribut|hajar|adu|duel|baku hantam/i.test(t)) {
    return rand([
      {
        text: 'Waduh ampun bang jago! 😭🙏 Mending jangan berantem, mending kita adu cepat: kakak checkout sekarang, kurir kami sampe sebelum 15 menit! Berani coba? ⚡',
        action: { label: 'Buktikan Belanja', tab: 'home' },
      },
      {
        text: 'Aduh jangan emosi kak, dunia udah keras 🥺 Mending minum Kopi Susu Dingin atau Es Krim dulu biar kepala adem! Mau Kila cariin?',
        productSuggestion: 'es-krim',
      },
      {
        text: 'Kila cinta damai kak ✌️ Tapi kalau urusan kecepatan antar belanjaan, kami siap duel sat-set 15 menit tiba di depan gerbang kost! 🛵',
      },
    ]);
  }

  // 2. Serius / Memastikan
  if (/serius|beneran|masa sih|yakin/i.test(t)) {
    return rand([
      {
        text: 'Dua rius kak! Kami ga pernah main-main kalau soal garansi 15 menit sampai dan diskon s/d 50% 😉 Mau Kila buktiin?',
      },
      {
        text: 'Beneran 100% kak! Dark Store kami ada di Kaliurang dalam radius 3 km, makanya kurir bisa meluncur kilat tanpa macet ⚡',
      },
    ]);
  }

  // 3. Salam & Sapaan
  if (/^(halo|hai|hi|hey|hei|p|pagi|siang|sore|malam|assalamualaikum|oy|woi)\b/i.test(t)) {
    return rand([
      {
        text: 'Halo kak! Senang ketemu kamu ⚡ Butuh camilan, sembako, atau ada kebutuhan darurat? Kila siap bantu 24 jam non-stop!',
      },
      {
        text: 'Hai kak! Selamat datang di BC-LAT Market Online. Hari ini lagi ada Flash Sale hemat lho, mau Kila tunjukin?',
        action: { label: 'Lihat Flash Sale', tab: 'home' },
      },
      {
        text: 'Halo kak! Jangan lupa pakai voucher BCLATHEMAT ya buat belanja pertamamu, diskon 20%! 🎉',
      },
    ]);
  }

  // 4. Tanya Tugas Kuliah / Bisnis / Dosen
  if (/tugas|dosen|kuliah|kelompok|presentasi|bisnis|matkul|nilai/i.test(t)) {
    return {
      text: 'Betul kak! Ini adalah proyek demo bisnis kelompok kami untuk mata kuliah Bisnis 🎓 Kami mengusung model Quick-Commerce berbasis Dark Store (seperti Astro). Semoga dosen kita ngasih nilai A ya! Aamiin 🤲⭐',
      action: { label: 'Buka Dashboard Admin', tab: 'admin' },
    };
  }

  // 5. Tanya Voucher & Promo
  if (/voucher|promo|diskon|hemat|kupon|kode/i.test(t)) {
    const list = vouchers.map((v) => `• ${v.code} (${v.title})`).join('\n');
    return {
      text: `Ini daftar kode promo aktif hari ini kak:\n${list}\n\nMasukkan di halaman keranjang ya biar langsung kepotong! 🎁`,
      action: { label: 'Buka Keranjang', tab: 'cart' },
    };
  }

  // 6. Ongkir & Pengiriman
  if (/ongkir|ongkos|kirim|gratis|tarif|bayar kurir/i.test(t)) {
    return {
      text: 'Ongkos kirim flat cuma Rp5.000 untuk area Sleman & sekitarnya kak! Tapi kalau belanja minimal Rp30.000, kakak bisa pakai voucher FREEONGKIR jadi GRATIS! 🛵✨',
    };
  }

  // 7. Berapa lama sampai / Kecepatan
  if (/lama|berapa menit|kapan|sampai|waktu|kecepatan|cepat/i.test(t)) {
    return {
      text: '⚡ Garansi tiba dalam 15 MENIT kak! Begitu order masuk, picker kami kemas dalam 2-3 menit, lalu kurir meluncur langsung dari Dark Store terdekat.',
    };
  }

  // 8. Metode Pembayaran (QRIS, COD, dll)
  if (/bayar|pembayaran|qris|gopay|shopeepay|va|transfer|cod|tunai/i.test(t)) {
    return {
      text: 'Metode bayar super fleksibel kak! Bisa QRIS (semua bank & e-wallet), GoPay, ShopeePay, Virtual Account BCA, atau Bayar Tunai di Tempat (COD) pas kurir sampai 💳💵',
    };
  }

  // 9. Lapar / Haus / Ngantuk / Begadang
  if (/laper|lapar|haus|haus|ngantuk|begadang|makan|minum/i.test(t)) {
    return rand([
      {
        text: 'Lapar tengah malam emang ujian terberat anak kost 🥺 Tenang kak, kami buka 24 jam! Coba pesan Mie Goreng atau Kombo Sarapan, 15 menit nyampe!',
        productSuggestion: 'mie-goreng',
      },
      {
        text: 'Ngantuk tapi tugas numpuk? Butuh asupan kafein nih kak! Kopi Susu Botol dingin siap meluncur sekarang juga ☕⚡',
        productSuggestion: 'kopi-botol',
      },
    ]);
  }

  // 10. Curhat / Galau / Lucu
  if (/jomblo|pacar|cinta|sayang|sedih|capek|lelah|pusing/i.test(t)) {
    return rand([
      {
        text: 'Duh kak, jodoh mungkin masih diatur Tuhan, tapi cemilan enak buat naikin mood bisa Kila anter 15 menit ke depan pintumu! Semangat yaa ✨',
        productSuggestion: 'cokelat',
      },
      {
        text: 'Tarik napas dulu kak... Capek itu wajar, yang penting jangan lupa makan ya! Mau Kila siapin cemilan?',
      },
    ]);
  }

  // 11. Pujian / Makasih
  if (/makasih|terima kasih|thanks|keren|mantap|top|hebat|good/i.test(t)) {
    return rand([
      {
        text: 'Sama-sama kak! Senang banget bisa bantu kamu. Jangan lupa belanja lagi di BC-LAT ya ⚡💛',
      },
      {
        text: 'Makasih kembali kak! Doakan kelompok kami sukses dan proyek ini lancar yaa ⭐⭐⭐⭐⭐',
      },
    ]);
  }

  // 12. Cari Produk Otomatis dari Database
  const matchedProduct = products.find(
    (p) =>
      t.includes(p.name.toLowerCase()) ||
      t.includes(p.id) ||
      p.slug.toLowerCase().includes(t)
  );
  if (matchedProduct) {
    return {
      text: `Ada dong kak! ${matchedProduct.name} (${matchedProduct.size}) harganya cuma ${formatRp(matchedProduct.price)}. Stok masih aman di Dark Store! Mau langsung pesan?`,
      productSuggestion: matchedProduct.id,
    };
  }

  // 13. Fallback Cerdas (Tidak kaku & tidak mengulang template boring)
  return rand([
    {
      text: `Siap kak! Maksud kakak "${userText}" ya? Kalau butuh bantuan cari produk sembako, info promo diskon, atau cek status antar 15 menit, tinggal bilang ke Kila aja ya! ⚡`,
    },
    {
      text: `Hehe Kila siap bantu kak! Mau belanja apa hari ini? Kami punya beras, minyak goreng, telur, mie instan, sampai snack malam lho.`,
      action: { label: 'Buka Katalog Produk', tab: 'home' },
    },
    {
      text: `Pesanmu sudah Kila baca dengan seksama kak! Ada produk yang mau dicariin atau mau tanya info garansi pengiriman kilat 15 menit kami? 😉`,
    },
  ]);
}
