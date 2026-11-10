// Kategori "Spesial di BC-LAT" — mengikuti pola kategori cepat ala Astro
export const categories = [
  { id: 'kombo-hemat', name: 'Kombo Hemat', tagline: 'Paket masak sat-set', image: '/images/categories/kombo-hemat.jpg', emoji: '📦', color: '#FEF3C7' },
  { id: 'protein', name: 'Protein for Every Meal', tagline: 'Ayam, daging, telur', image: '/images/categories/protein.jpg', emoji: '🍗', color: '#FFE4E6' },
  { id: 'buah', name: 'Fresh & Fruity Picks', tagline: 'Buah & sayur segar', image: '/images/categories/buah.jpg', emoji: '🍊', color: '#DCFCE7' },
  { id: 'snack', name: 'Teman Chill, Teman Ngemil', tagline: 'Snack & cokelat', image: '/images/categories/snack.jpg', emoji: '🍿', color: '#FCE7F3' },
  { id: 'minuman', name: 'Minuman Sat-Set', tagline: 'Kopi, susu, teh', image: '/images/categories/minuman.jpg', emoji: '🧋', color: '#E0F2FE' },
  { id: 'sembako', name: 'Dapur & Sembako', tagline: 'Beras, minyak, mie', image: '/images/categories/sembako.jpg', emoji: '🍚', color: '#FEF9C3' },
  { id: 'p3k', name: 'P3K & Darurat', tagline: 'Obat & perawatan', image: '/images/categories/p3k.jpg', emoji: '💊', color: '#EDE9FE' },
  { id: 'kebersihan', name: 'Kost & Rumah Bersih', tagline: 'Sabun & detergen', image: '/images/categories/kebersihan.jpg', emoji: '🧼', color: '#CCFBF1' },
];

export const getCategory = (id) => categories.find((c) => c.id === id);
