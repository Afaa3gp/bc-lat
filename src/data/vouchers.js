export const DELIVERY_FEE = 5000;

export const vouchers = [
  { code: 'BCLATHEMAT', title: 'Diskon 20% Pengguna Baru', type: 'percentage', value: 20, minPurchase: 50000, maxDiscount: 25000 },
  { code: 'KILAT15', title: 'Potongan Rp15.000', type: 'fixed', value: 15000, minPurchase: 75000 },
  { code: 'FREEONGKIR', title: 'Gratis Ongkir', type: 'shipping', value: DELIVERY_FEE, minPurchase: 30000 },
];

export const findVoucher = (code) =>
  vouchers.find((v) => v.code === code.trim().toUpperCase());

/** Hitung diskon voucher. Mengembalikan { discount, shippingDiscount, error } */
export function evaluateVoucher(voucher, subtotal) {
  if (!voucher) return { discount: 0, shippingDiscount: 0 };
  if (subtotal < voucher.minPurchase) {
    return { discount: 0, shippingDiscount: 0, error: `Min. belanja Rp${voucher.minPurchase.toLocaleString('id-ID')}` };
  }
  if (voucher.type === 'percentage') {
    const d = Math.min(Math.round((subtotal * voucher.value) / 100), voucher.maxDiscount ?? Infinity);
    return { discount: d, shippingDiscount: 0 };
  }
  if (voucher.type === 'fixed') return { discount: Math.min(voucher.value, subtotal), shippingDiscount: 0 };
  return { discount: 0, shippingDiscount: voucher.value };
}

export const banners = [
  {
    id: 1,
    image: '/images/banners/banner-1.jpg',
    eyebrow: 'GEBYAR LAUNCHING',
    title: 'Diskon s/d 50% + Gratis Ongkir',
    subtitle: 'Pakai kode FREEONGKIR untuk belanja pertamamu',
    bg: 'linear-gradient(120deg,#0B132B 0%,#1C2E5A 60%,#2B4C8C 100%)',
  },
  {
    id: 2,
    image: '/images/banners/banner-2.jpg',
    eyebrow: 'BUKA 24 JAM',
    title: 'Lapar Tengah Malam? Sat-Set 15 Menit',
    subtitle: 'Mie, snack & minuman dingin siap diantar kapan aja',
    bg: 'linear-gradient(120deg,#0B132B 0%,#16244A 70%,#F59E0B 160%)',
  },
  {
    id: 3,
    image: '/images/banners/banner-3.jpg',
    eyebrow: 'KOMBO HEMAT MAHASISWA',
    title: 'Masak Hemat Mulai Rp7.900',
    subtitle: 'Diskon 20% pakai kode BCLATHEMAT',
    bg: 'linear-gradient(120deg,#064E3B 0%,#0B132B 100%)',
  },
];

export const formatRp = (n) => 'Rp' + Math.round(n).toLocaleString('id-ID');
