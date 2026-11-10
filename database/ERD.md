# Perancangan Database BC-LAT Market Online (Quick-Commerce)

Dokumen perancangan database ini disusun untuk memenuhi kelengkapan laporan mata kuliah bisnis, memetakan seluruh entitas transaksi, katalog, persediaan (*dark store inventory*), dan logistik pengantaran 15 menit.

---

## 1. Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ ADDRESSES : "memiliki (1:N)"
    USERS ||--o{ ORDERS : "melakukan (1:N)"
    DARK_STORES ||--o{ COURIERS : "menugaskan (1:N)"
    DARK_STORES ||--o{ INVENTORY : "menyimpan (1:N)"
    DARK_STORES ||--o{ ORDERS : "memproses (1:N)"
    CATEGORIES ||--o{ PRODUCTS : "mengelompokkan (1:N)"
    PRODUCTS ||--o{ INVENTORY : "tercatat di (1:N)"
    PRODUCTS ||--o{ ORDER_ITEMS : "dipesan di (1:N)"
    ORDERS ||--|{ ORDER_ITEMS : "terdiri dari (1:N)"
    ORDERS ||--|| PAYMENTS : "memiliki (1:1)"
    ORDERS ||--o{ ORDER_STATUS_LOGS : "mencatat tahapan (1:N)"
    COURIERS ||--o{ ORDERS : "mengantar (1:N)"
    PROMOTIONS ||--o{ ORDERS : "digunakan pada (1:N)"

    USERS {
        varchar id PK
        varchar full_name
        varchar email UK
        varchar phone_number
        varchar role "customer / admin / picker / courier"
        timestamp created_at
    }

    ADDRESSES {
        varchar id PK
        varchar user_id FK
        varchar label "Kost / Rumah / Kampus"
        varchar recipient_name
        varchar phone
        text full_address
        text delivery_notes
        boolean is_default
    }

    DARK_STORES {
        varchar id PK
        varchar name "Hub Kaliurang / Gejayan"
        text address
        numeric service_radius_km "Default 3.0 km"
        boolean is_open_24h
    }

    CATEGORIES {
        varchar id PK
        varchar name
        varchar slug UK
        varchar icon
        varchar image_url
        int sort_order
    }

    PRODUCTS {
        varchar id PK
        varchar category_id FK
        varchar name
        varchar slug UK
        varchar package_size "1 kg / 250 ml / 10 butir"
        text description
        numeric original_price
        numeric sale_price
        text image_url
        boolean is_flash_sale
        numeric rating
        int sold_count
    }

    INVENTORY {
        varchar dark_store_id PK,FK
        varchar product_id PK,FK
        int stock_qty
        int reorder_level
    }

    COURIERS {
        varchar id PK
        varchar dark_store_id FK
        varchar name
        varchar vehicle
        varchar plate_number
        boolean is_available
    }

    PROMOTIONS {
        varchar id PK
        varchar code UK "BCLATHEMAT / FREEONGKIR"
        varchar title
        varchar discount_type "percentage / fixed / shipping"
        numeric discount_value
        numeric min_purchase
        numeric max_discount
        timestamp valid_until
    }

    ORDERS {
        varchar id PK
        varchar order_number UK "BCL-YYYYMMDD-001"
        varchar user_id FK
        varchar address_id FK
        varchar dark_store_id FK
        varchar courier_id FK
        varchar promotion_id FK
        varchar status "confirmed / packing / on_delivery / delivered / cancelled"
        numeric subtotal
        numeric discount_amount
        numeric delivery_fee
        numeric total_amount
        timestamp estimated_arrival
        timestamp delivered_at
        timestamp created_at
    }

    ORDER_ITEMS {
        varchar id PK
        varchar order_id FK
        varchar product_id FK
        int quantity
        numeric unit_price
        numeric subtotal
    }

    PAYMENTS {
        varchar id PK
        varchar order_id FK,UK
        varchar method "QRIS / GOPAY / SHOPEEPAY / VA / COD"
        varchar status "unpaid / paid / refunded"
        numeric amount
        timestamp paid_at
    }

    ORDER_STATUS_LOGS {
        varchar id PK
        varchar order_id FK
        varchar status
        text notes
        timestamp created_at
    }
```

---

## 2. Hubungan Bisnis & Aturan Relasi (Business Logic)

1. **Model Dark Store (Micro-Fulfillment Hub)**:
   - Pesanan dilayani oleh Dark Store terdekat (dalam radius ≤ 3 km) agar target garansi **tiba dalam 15 menit** tercapai.
   - Tabel `inventory` memiliki kunci komposit `(dark_store_id, product_id)` sehingga tiap hub memiliki catatan stok fisik riil masing-masing.

2. **Alur Status Pemesanan & Audit Trail**:
   - `confirmed` (Menit 0) → Dark Store menerima pesanan.
   - `packing` (Menit 2) → Picker menyiapkan barang dalam kantong ramah lingkungan.
   - `on_delivery` (Menit 6) → Kurir kilat berangkat menuju lokasi pelanggan.
   - `delivered` (Menit 14) → Pesanan diterima pelanggan.
   - Setiap perubahan status otomatis tercatat di `order_status_logs` untuk audit SLA kecepatan.

3. **Promosi & Voucher**:
   - Mendukung tipe diskon persentase (`percentage`, dengan batasan `max_discount`), nominal tetap (`fixed`), dan gratis ongkos kirim (`shipping`).

4. **Metode Pembayaran**:
   - Terintegrasi dengan QRIS (Standar Nasional), GoPay, ShopeePay, Virtual Account BCA, dan Bayar di Tempat (COD).

---

## 3. File Terkait dalam Proyek

- **DDL Skema SQL**: `database/schema.sql` (bisa dieksekusi di PostgreSQL / SQLite / MySQL).
- **Seed Data Awal**: `database/seed.sql` (memuat 8 kategori, 30 produk groceries, 3 voucher promosi aktif, dan 3 profil kurir demo).
- **Generator Script**: `scripts/generate-seed.mjs` (menghubungkan data aplikasi langsung ke SQL).
