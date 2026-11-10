-- BC-LAT Market Online — Data awal (auto-generate dari src/data, jangan edit manual)

INSERT INTO dark_stores (id, name, address, service_radius_km, is_open_24h) VALUES
('ds-kaliurang', 'Dark Store BC-LAT Kaliurang', 'Jl. Kaliurang KM 5, Sleman, Yogyakarta', 3.0, TRUE);

INSERT INTO users (id, full_name, email, phone_number, role) VALUES
('usr-demo', 'Kelompok BC-LAT', 'demo@bclat.id', '081234567890', 'customer'),
('usr-admin', 'Admin Dark Store', 'admin@bclat.id', '081200000001', 'admin');

INSERT INTO addresses (id, user_id, label, recipient_name, phone, full_address, delivery_notes, is_default) VALUES
('addr-1', 'usr-demo', 'Kost', 'Kelompok BC-LAT', '081234567890', 'Kost Putri Kenanga No. 12, Jl. Kaliurang KM 5, Sleman', 'Pagar hijau, titip satpam', TRUE),
('addr-2', 'usr-demo', 'Kampus', 'Kelompok BC-LAT', '081234567890', 'Gedung Fakultas Ekonomi & Bisnis, Lobby Utama', 'Hubungi saat sampai', FALSE);

INSERT INTO couriers (id, dark_store_id, name, vehicle, plate_number) VALUES
('cr-1', 'ds-kaliurang', 'Budi Santoso', 'Honda Beat Hitam', 'AB 4521 KL'),
('cr-2', 'ds-kaliurang', 'Rina Kartika', 'Yamaha Mio Biru', 'AB 3317 UX'),
('cr-3', 'ds-kaliurang', 'Dimas Prasetyo', 'Honda Vario Putih', 'AB 6802 ZE');

INSERT INTO categories (id, name, slug, icon, image_url, sort_order) VALUES
('kombo-hemat', 'Kombo Hemat', 'kombo-hemat', '📦', '/images/categories/kombo-hemat.jpg', 1),
('protein', 'Protein for Every Meal', 'protein', '🍗', '/images/categories/protein.jpg', 2),
('buah', 'Fresh & Fruity Picks', 'buah', '🍊', '/images/categories/buah.jpg', 3),
('snack', 'Teman Chill, Teman Ngemil', 'snack', '🍿', '/images/categories/snack.jpg', 4),
('minuman', 'Minuman Sat-Set', 'minuman', '🧋', '/images/categories/minuman.jpg', 5),
('sembako', 'Dapur & Sembako', 'sembako', '🍚', '/images/categories/sembako.jpg', 6),
('p3k', 'P3K & Darurat', 'p3k', '💊', '/images/categories/p3k.jpg', 7),
('kebersihan', 'Kost & Rumah Bersih', 'kebersihan', '🧼', '/images/categories/kebersihan.jpg', 8);

INSERT INTO products (id, category_id, name, slug, package_size, description, original_price, sale_price, image_url, is_flash_sale, rating, sold_count) VALUES
('kombo-sop', 'kombo-hemat', 'Kombo Sayur Sop + Ayam', 'kombo-sop', '1 paket', 'Paket lengkap untuk sop ayam 4 porsi: sayur sop segar, 500 g ayam potong, dan bumbu.', 45000, 34900, '/images/products/kombo-sop.jpg', TRUE, 4.9, 870),
('kombo-sarapan', 'kombo-hemat', 'Kombo Sarapan Anak Kost', 'kombo-sarapan', '1 paket', 'Roti tawar, 6 butir telur, susu UHT 1 L, dan selai. Sarapan seminggu beres.', 52000, 39900, '/images/products/kombo-sarapan.jpg', FALSE, 4.8, 640),
('sayur-sop', 'kombo-hemat', 'Sayur Sop Segar', 'sayur-sop', '350 g', 'Sayur Sop Segar pilihan BC-LAT. Dikemas higienis dari Dark Store terdekat dan siap diantar dalam 15 menit.', 9500, 7900, '/images/products/sayur-sop.jpg', FALSE, 4.8, 1320),
('telur', 'protein', 'Telur Ayam Negeri', 'telur', '10 butir', 'Telur Ayam Negeri pilihan BC-LAT. Dikemas higienis dari Dark Store terdekat dan siap diantar dalam 15 menit.', 29000, 24500, '/images/products/telur.jpg', TRUE, 4.9, 2100),
('ayam-fillet', 'protein', 'Dada Ayam Fillet', 'ayam-fillet', '500 g', 'Dada Ayam Fillet pilihan BC-LAT. Dikemas higienis dari Dark Store terdekat dan siap diantar dalam 15 menit.', 42000, 36900, '/images/products/ayam-fillet.jpg', FALSE, 4.8, 980),
('daging-sapi', 'protein', 'Daging Sapi Slice', 'daging-sapi', '250 g', 'Daging Sapi Slice pilihan BC-LAT. Dikemas higienis dari Dark Store terdekat dan siap diantar dalam 15 menit.', 52000, 46500, '/images/products/daging-sapi.jpg', FALSE, 4.8, 410),
('tempe-tahu', 'protein', 'Paket Tempe & Tahu', 'tempe-tahu', '2 pcs', 'Paket Tempe & Tahu pilihan BC-LAT. Dikemas higienis dari Dark Store terdekat dan siap diantar dalam 15 menit.', 12000, 9900, '/images/products/tempe-tahu.jpg', FALSE, 4.8, 1530),
('sosis', 'protein', 'Sosis Ayam', 'sosis', '375 g', 'Sosis Ayam pilihan BC-LAT. Dikemas higienis dari Dark Store terdekat dan siap diantar dalam 15 menit.', 31000, 26900, '/images/products/sosis.jpg', FALSE, 4.8, 520),
('pisang', 'buah', 'Pisang Cavendish', 'pisang', '1 sisir', 'Pisang Cavendish pilihan BC-LAT. Dikemas higienis dari Dark Store terdekat dan siap diantar dalam 15 menit.', 28000, 22900, '/images/products/pisang.jpg', TRUE, 4.8, 760),
('apel', 'buah', 'Apel Fuji', 'apel', '3 pcs', 'Apel Fuji pilihan BC-LAT. Dikemas higienis dari Dark Store terdekat dan siap diantar dalam 15 menit.', 32000, 27500, '/images/products/apel.jpg', FALSE, 4.8, 430),
('jeruk', 'buah', 'Jeruk Mandarin', 'jeruk', '500 g', 'Jeruk Mandarin pilihan BC-LAT. Dikemas higienis dari Dark Store terdekat dan siap diantar dalam 15 menit.', 30000, 24900, '/images/products/jeruk.jpg', FALSE, 4.8, 380),
('brokoli', 'buah', 'Brokoli Segar', 'brokoli', '250 g', 'Brokoli Segar pilihan BC-LAT. Dikemas higienis dari Dark Store terdekat dan siap diantar dalam 15 menit.', 15000, 12900, '/images/products/brokoli.jpg', FALSE, 4.8, 290),
('keripik', 'snack', 'Keripik Kentang Original', 'keripik', '68 g', 'Keripik Kentang Original pilihan BC-LAT. Dikemas higienis dari Dark Store terdekat dan siap diantar dalam 15 menit.', 12500, 9900, '/images/products/keripik.jpg', TRUE, 4.8, 1720),
('biskuit', 'snack', 'Biskuit Sandwich Cokelat', 'biskuit', '133 g', 'Biskuit Sandwich Cokelat pilihan BC-LAT. Dikemas higienis dari Dark Store terdekat dan siap diantar dalam 15 menit.', 10000, 8500, '/images/products/biskuit.jpg', FALSE, 4.8, 940),
('cokelat', 'snack', 'Cokelat Batang Susu', 'cokelat', '60 g', 'Cokelat Batang Susu pilihan BC-LAT. Dikemas higienis dari Dark Store terdekat dan siap diantar dalam 15 menit.', 16000, 13500, '/images/products/cokelat.jpg', FALSE, 4.8, 650),
('es-krim', 'snack', 'Es Krim Vanilla Cokelat', 'es-krim', '700 ml', 'Es Krim Vanilla Cokelat pilihan BC-LAT. Dikemas higienis dari Dark Store terdekat dan siap diantar dalam 15 menit.', 45000, 37900, '/images/products/es-krim.jpg', FALSE, 4.8, 330),
('kopi-botol', 'minuman', 'Kopi Susu Botol', 'kopi-botol', '220 ml', 'Kopi Susu Botol pilihan BC-LAT. Dikemas higienis dari Dark Store terdekat dan siap diantar dalam 15 menit.', 9000, 7500, '/images/products/kopi-botol.jpg', TRUE, 4.9, 2650),
('susu-uht', 'minuman', 'Susu UHT Full Cream', 'susu-uht', '1 L', 'Susu UHT Full Cream pilihan BC-LAT. Dikemas higienis dari Dark Store terdekat dan siap diantar dalam 15 menit.', 21000, 18500, '/images/products/susu-uht.jpg', FALSE, 4.8, 1210),
('teh-botol', 'minuman', 'Teh Melati Botol', 'teh-botol', '450 ml', 'Teh Melati Botol pilihan BC-LAT. Dikemas higienis dari Dark Store terdekat dan siap diantar dalam 15 menit.', 6000, 4900, '/images/products/teh-botol.jpg', FALSE, 4.8, 1890),
('air-mineral', 'minuman', 'Air Mineral', 'air-mineral', '600 ml', 'Air Mineral pilihan BC-LAT. Dikemas higienis dari Dark Store terdekat dan siap diantar dalam 15 menit.', 4000, 3500, '/images/products/air-mineral.jpg', FALSE, 4.8, 3400),
('beras', 'sembako', 'Beras Pandan Wangi', 'beras', '5 kg', 'Beras Pandan Wangi pilihan BC-LAT. Dikemas higienis dari Dark Store terdekat dan siap diantar dalam 15 menit.', 82000, 74900, '/images/products/beras.jpg', FALSE, 4.9, 880),
('minyak', 'sembako', 'Minyak Goreng', 'minyak', '2 L', 'Minyak Goreng pilihan BC-LAT. Dikemas higienis dari Dark Store terdekat dan siap diantar dalam 15 menit.', 38000, 34500, '/images/products/minyak.jpg', FALSE, 4.8, 1050),
('gula', 'sembako', 'Gula Pasir Putih', 'gula', '1 kg', 'Gula Pasir Putih pilihan BC-LAT. Dikemas higienis dari Dark Store terdekat dan siap diantar dalam 15 menit.', 18500, 16900, '/images/products/gula.jpg', FALSE, 4.8, 720),
('mie-goreng', 'sembako', 'Mie Goreng Instan (5 pcs)', 'mie-goreng', '5 x 85 g', 'Mie Goreng Instan (5 pcs) pilihan BC-LAT. Dikemas higienis dari Dark Store terdekat dan siap diantar dalam 15 menit.', 17000, 14500, '/images/products/mie-goreng.jpg', TRUE, 4.9, 4100),
('roti', 'sembako', 'Roti Tawar Kupas', 'roti', '370 g', 'Roti Tawar Kupas pilihan BC-LAT. Dikemas higienis dari Dark Store terdekat dan siap diantar dalam 15 menit.', 18000, 15900, '/images/products/roti.jpg', FALSE, 4.8, 690),
('obat-flu', 'p3k', 'Obat Flu & Batuk', 'obat-flu', '4 tablet', 'Obat Flu & Batuk pilihan BC-LAT. Dikemas higienis dari Dark Store terdekat dan siap diantar dalam 15 menit.', 8000, 6900, '/images/products/obat-flu.jpg', FALSE, 4.8, 560),
('plester', 'p3k', 'Plester Luka', 'plester', '10 pcs', 'Plester Luka pilihan BC-LAT. Dikemas higienis dari Dark Store terdekat dan siap diantar dalam 15 menit.', 7500, 5900, '/images/products/plester.jpg', FALSE, 4.8, 310),
('tisu', 'p3k', 'Tisu Wajah', 'tisu', '250 lembar', 'Tisu Wajah pilihan BC-LAT. Dikemas higienis dari Dark Store terdekat dan siap diantar dalam 15 menit.', 15000, 11900, '/images/products/tisu.jpg', FALSE, 4.8, 990),
('detergen', 'kebersihan', 'Detergen Bubuk', 'detergen', '800 g', 'Detergen Bubuk pilihan BC-LAT. Dikemas higienis dari Dark Store terdekat dan siap diantar dalam 15 menit.', 24000, 19900, '/images/products/detergen.jpg', FALSE, 4.8, 610),
('sabun-cuci', 'kebersihan', 'Sabun Cuci Piring Jeruk Nipis', 'sabun-cuci', '780 ml', 'Sabun Cuci Piring Jeruk Nipis pilihan BC-LAT. Dikemas higienis dari Dark Store terdekat dan siap diantar dalam 15 menit.', 16000, 12900, '/images/products/sabun-cuci.jpg', FALSE, 4.8, 840);

INSERT INTO inventory (dark_store_id, product_id, stock_qty, reorder_level) VALUES
('ds-kaliurang', 'kombo-sop', 80, 20),
('ds-kaliurang', 'kombo-sarapan', 80, 20),
('ds-kaliurang', 'sayur-sop', 80, 20),
('ds-kaliurang', 'telur', 80, 20),
('ds-kaliurang', 'ayam-fillet', 80, 20),
('ds-kaliurang', 'daging-sapi', 80, 20),
('ds-kaliurang', 'tempe-tahu', 80, 20),
('ds-kaliurang', 'sosis', 80, 20),
('ds-kaliurang', 'pisang', 80, 20),
('ds-kaliurang', 'apel', 80, 20),
('ds-kaliurang', 'jeruk', 80, 20),
('ds-kaliurang', 'brokoli', 80, 20),
('ds-kaliurang', 'keripik', 80, 20),
('ds-kaliurang', 'biskuit', 80, 20),
('ds-kaliurang', 'cokelat', 80, 20),
('ds-kaliurang', 'es-krim', 80, 20),
('ds-kaliurang', 'kopi-botol', 80, 20),
('ds-kaliurang', 'susu-uht', 80, 20),
('ds-kaliurang', 'teh-botol', 80, 20),
('ds-kaliurang', 'air-mineral', 80, 20),
('ds-kaliurang', 'beras', 80, 20),
('ds-kaliurang', 'minyak', 80, 20),
('ds-kaliurang', 'gula', 80, 20),
('ds-kaliurang', 'mie-goreng', 80, 20),
('ds-kaliurang', 'roti', 80, 20),
('ds-kaliurang', 'obat-flu', 80, 20),
('ds-kaliurang', 'plester', 80, 20),
('ds-kaliurang', 'tisu', 80, 20),
('ds-kaliurang', 'detergen', 80, 20),
('ds-kaliurang', 'sabun-cuci', 80, 20);

INSERT INTO promotions (id, code, title, discount_type, discount_value, min_purchase, max_discount) VALUES
('promo-bclathemat', 'BCLATHEMAT', 'Diskon 20% Pengguna Baru', 'percentage', 20, 50000, 25000),
('promo-kilat15', 'KILAT15', 'Potongan Rp15.000', 'fixed', 15000, 75000, NULL),
('promo-freeongkir', 'FREEONGKIR', 'Gratis Ongkir', 'shipping', 5000, 30000, NULL);
