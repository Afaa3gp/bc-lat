// Generate database/seed.sql dari data yang sama dengan yang dipakai website.
// Jalankan: npm run db:seed
import { writeFileSync } from 'node:fs';
import { categories } from '../src/data/categories.js';
import { products } from '../src/data/products.js';
import { vouchers } from '../src/data/vouchers.js';

const q = (v) => (v === null || v === undefined ? 'NULL' : typeof v === 'number' || typeof v === 'boolean' ? String(v).toUpperCase() : `'${String(v).replace(/'/g, "''")}'`);
const row = (vals) => `(${vals.map(q).join(', ')})`;

const lines = [
  '-- BC-LAT Market Online — Data awal (auto-generate dari src/data, jangan edit manual)',
  '',
  "INSERT INTO dark_stores (id, name, address, service_radius_km, is_open_24h) VALUES",
  "('ds-kaliurang', 'Dark Store BC-LAT Kaliurang', 'Jl. Kaliurang KM 5, Sleman, Yogyakarta', 3.0, TRUE);",
  '',
  'INSERT INTO users (id, full_name, email, phone_number, role) VALUES',
  "('usr-demo', 'Kelompok BC-LAT', 'demo@bclat.id', '081234567890', 'customer'),",
  "('usr-admin', 'Admin Dark Store', 'admin@bclat.id', '081200000001', 'admin');",
  '',
  'INSERT INTO addresses (id, user_id, label, recipient_name, phone, full_address, delivery_notes, is_default) VALUES',
  "('addr-1', 'usr-demo', 'Kost', 'Kelompok BC-LAT', '081234567890', 'Kost Putri Kenanga No. 12, Jl. Kaliurang KM 5, Sleman', 'Pagar hijau, titip satpam', TRUE),",
  "('addr-2', 'usr-demo', 'Kampus', 'Kelompok BC-LAT', '081234567890', 'Gedung Fakultas Ekonomi & Bisnis, Lobby Utama', 'Hubungi saat sampai', FALSE);",
  '',
  'INSERT INTO couriers (id, dark_store_id, name, vehicle, plate_number) VALUES',
  "('cr-1', 'ds-kaliurang', 'Budi Santoso', 'Honda Beat Hitam', 'AB 4521 KL'),",
  "('cr-2', 'ds-kaliurang', 'Rina Kartika', 'Yamaha Mio Biru', 'AB 3317 UX'),",
  "('cr-3', 'ds-kaliurang', 'Dimas Prasetyo', 'Honda Vario Putih', 'AB 6802 ZE');",
  '',
  'INSERT INTO categories (id, name, slug, icon, image_url, sort_order) VALUES',
  categories.map((c, i) => row([c.id, c.name, c.id, c.emoji, c.image, i + 1])).join(',\n') + ';',
  '',
  'INSERT INTO products (id, category_id, name, slug, package_size, description, original_price, sale_price, image_url, is_flash_sale, rating, sold_count) VALUES',
  products.map((p) => row([p.id, p.category, p.name, p.id, p.size, p.description, p.originalPrice, p.price, p.image, p.flashSale, p.rating, p.sold])).join(',\n') + ';',
  '',
  'INSERT INTO inventory (dark_store_id, product_id, stock_qty, reorder_level) VALUES',
  products.map((p) => row(['ds-kaliurang', p.id, p.stock, 20])).join(',\n') + ';',
  '',
  'INSERT INTO promotions (id, code, title, discount_type, discount_value, min_purchase, max_discount) VALUES',
  vouchers.map((v) => row([`promo-${v.code.toLowerCase()}`, v.code, v.title, v.type, v.value, v.minPurchase, v.maxDiscount ?? null])).join(',\n') + ';',
  '',
];

writeFileSync(new URL('../database/seed.sql', import.meta.url), lines.join('\n'));
console.log(`seed.sql dibuat: ${categories.length} kategori, ${products.length} produk, ${vouchers.length} voucher`);
