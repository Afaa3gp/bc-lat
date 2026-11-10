// Seed data produk BC-LAT (harga dalam Rupiah)
const p = (id, name, category, size, original, sale, opts = {}) => ({
  id,
  name,
  category,
  size,
  originalPrice: original,
  price: sale,
  image: `/images/products/${id}.jpg`,
  emoji: opts.emoji || '🛒',
  stock: opts.stock ?? 80,
  flashSale: !!opts.flash,
  rating: opts.rating ?? 4.8,
  sold: opts.sold ?? 120,
  description: opts.desc || `${name} pilihan BC-LAT. Dikemas higienis dari Dark Store terdekat dan siap diantar dalam 15 menit.`,
});

export const products = [
  // Kombo Hemat
  p('kombo-sop', 'Kombo Sayur Sop + Ayam', 'kombo-hemat', '1 paket', 45000, 34900, { emoji: '🥘', flash: true, sold: 870, rating: 4.9, desc: 'Paket lengkap untuk sop ayam 4 porsi: sayur sop segar, 500 g ayam potong, dan bumbu.' }),
  p('kombo-sarapan', 'Kombo Sarapan Anak Kost', 'kombo-hemat', '1 paket', 52000, 39900, { emoji: '🍳', sold: 640, desc: 'Roti tawar, 6 butir telur, susu UHT 1 L, dan selai. Sarapan seminggu beres.' }),
  p('sayur-sop', 'Sayur Sop Segar', 'kombo-hemat', '350 g', 9500, 7900, { emoji: '🥕', sold: 1320 }),

  // Protein
  p('telur', 'Telur Ayam Negeri', 'protein', '10 butir', 29000, 24500, { emoji: '🥚', flash: true, sold: 2100, rating: 4.9 }),
  p('ayam-fillet', 'Dada Ayam Fillet', 'protein', '500 g', 42000, 36900, { emoji: '🍗', sold: 980 }),
  p('daging-sapi', 'Daging Sapi Slice', 'protein', '250 g', 52000, 46500, { emoji: '🥩', sold: 410 }),
  p('tempe-tahu', 'Paket Tempe & Tahu', 'protein', '2 pcs', 12000, 9900, { emoji: '🫘', sold: 1530 }),
  p('sosis', 'Sosis Ayam', 'protein', '375 g', 31000, 26900, { emoji: '🌭', sold: 520 }),

  // Buah & sayur
  p('pisang', 'Pisang Cavendish', 'buah', '1 sisir', 28000, 22900, { emoji: '🍌', flash: true, sold: 760 }),
  p('apel', 'Apel Fuji', 'buah', '3 pcs', 32000, 27500, { emoji: '🍎', sold: 430 }),
  p('jeruk', 'Jeruk Mandarin', 'buah', '500 g', 30000, 24900, { emoji: '🍊', sold: 380 }),
  p('brokoli', 'Brokoli Segar', 'buah', '250 g', 15000, 12900, { emoji: '🥦', sold: 290 }),

  // Snack
  p('keripik', 'Keripik Kentang Original', 'snack', '68 g', 12500, 9900, { emoji: '🥔', flash: true, sold: 1720 }),
  p('biskuit', 'Biskuit Sandwich Cokelat', 'snack', '133 g', 10000, 8500, { emoji: '🍪', sold: 940 }),
  p('cokelat', 'Cokelat Batang Susu', 'snack', '60 g', 16000, 13500, { emoji: '🍫', sold: 650 }),
  p('es-krim', 'Es Krim Vanilla Cokelat', 'snack', '700 ml', 45000, 37900, { emoji: '🍨', sold: 330 }),

  // Minuman
  p('kopi-botol', 'Kopi Susu Botol', 'minuman', '220 ml', 9000, 7500, { emoji: '☕', flash: true, sold: 2650, rating: 4.9 }),
  p('susu-uht', 'Susu UHT Full Cream', 'minuman', '1 L', 21000, 18500, { emoji: '🥛', sold: 1210 }),
  p('teh-botol', 'Teh Melati Botol', 'minuman', '450 ml', 6000, 4900, { emoji: '🧋', sold: 1890 }),
  p('air-mineral', 'Air Mineral', 'minuman', '600 ml', 4000, 3500, { emoji: '💧', sold: 3400 }),

  // Sembako
  p('beras', 'Beras Pandan Wangi', 'sembako', '5 kg', 82000, 74900, { emoji: '🍚', sold: 880, rating: 4.9 }),
  p('minyak', 'Minyak Goreng', 'sembako', '2 L', 38000, 34500, { emoji: '🫗', sold: 1050 }),
  p('gula', 'Gula Pasir Putih', 'sembako', '1 kg', 18500, 16900, { emoji: '🧂', sold: 720 }),
  p('mie-goreng', 'Mie Goreng Instan (5 pcs)', 'sembako', '5 x 85 g', 17000, 14500, { emoji: '🍜', flash: true, sold: 4100, rating: 4.9 }),
  p('roti', 'Roti Tawar Kupas', 'sembako', '370 g', 18000, 15900, { emoji: '🍞', sold: 690 }),

  // P3K
  p('obat-flu', 'Obat Flu & Batuk', 'p3k', '4 tablet', 8000, 6900, { emoji: '💊', sold: 560 }),
  p('plester', 'Plester Luka', 'p3k', '10 pcs', 7500, 5900, { emoji: '🩹', sold: 310 }),
  p('tisu', 'Tisu Wajah', 'p3k', '250 lembar', 15000, 11900, { emoji: '🧻', sold: 990 }),

  // Kebersihan
  p('detergen', 'Detergen Bubuk', 'kebersihan', '800 g', 24000, 19900, { emoji: '🧺', sold: 610 }),
  p('sabun-cuci', 'Sabun Cuci Piring Jeruk Nipis', 'kebersihan', '780 ml', 16000, 12900, { emoji: '🧼', sold: 840 }),
];

export const getProduct = (id) => products.find((x) => x.id === id);
