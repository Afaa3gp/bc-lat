-- =====================================================================
--  BC-LAT Market Online — Skema Database (PostgreSQL / kompatibel SQLite)
--  Model bisnis: Quick-commerce (Dark Store, pengantaran 15 menit)
-- =====================================================================

CREATE TABLE users (
    id            VARCHAR(36)  PRIMARY KEY,
    full_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(100) NOT NULL UNIQUE,
    phone_number  VARCHAR(20)  NOT NULL,
    role          VARCHAR(20)  NOT NULL DEFAULT 'customer'
                  CHECK (role IN ('customer', 'admin', 'picker', 'courier')),
    created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE addresses (
    id              VARCHAR(36)  PRIMARY KEY,
    user_id         VARCHAR(36)  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label           VARCHAR(50)  NOT NULL,              -- Rumah / Kost / Kampus
    recipient_name  VARCHAR(100) NOT NULL,
    phone           VARCHAR(20)  NOT NULL,
    full_address    TEXT         NOT NULL,
    delivery_notes  TEXT,
    latitude        NUMERIC(9,6),
    longitude       NUMERIC(9,6),
    is_default      BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE TABLE dark_stores (
    id               VARCHAR(36)  PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    address          TEXT         NOT NULL,
    service_radius_km NUMERIC(4,1) NOT NULL DEFAULT 3.0,
    is_open_24h      BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE categories (
    id          VARCHAR(36)  PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    slug        VARCHAR(100) NOT NULL UNIQUE,
    icon        VARCHAR(16),
    image_url   VARCHAR(255),
    sort_order  INT          NOT NULL DEFAULT 0
);

CREATE TABLE products (
    id              VARCHAR(36)   PRIMARY KEY,
    category_id     VARCHAR(36)   NOT NULL REFERENCES categories(id),
    name            VARCHAR(150)  NOT NULL,
    slug            VARCHAR(150)  NOT NULL UNIQUE,
    package_size    VARCHAR(50),
    description     TEXT,
    original_price  NUMERIC(12,2) NOT NULL CHECK (original_price >= 0),
    sale_price      NUMERIC(12,2) NOT NULL CHECK (sale_price >= 0),
    image_url       TEXT,
    is_flash_sale   BOOLEAN       NOT NULL DEFAULT FALSE,
    rating          NUMERIC(2,1)  NOT NULL DEFAULT 5.0,
    sold_count      INT           NOT NULL DEFAULT 0,
    is_active       BOOLEAN       NOT NULL DEFAULT TRUE
);

-- Stok per Dark Store (satu produk bisa tersedia di banyak hub)
CREATE TABLE inventory (
    dark_store_id  VARCHAR(36) NOT NULL REFERENCES dark_stores(id),
    product_id     VARCHAR(36) NOT NULL REFERENCES products(id),
    stock_qty      INT         NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
    reorder_level  INT         NOT NULL DEFAULT 20,
    PRIMARY KEY (dark_store_id, product_id)
);

CREATE TABLE promotions (
    id              VARCHAR(36)   PRIMARY KEY,
    code            VARCHAR(50)   NOT NULL UNIQUE,
    title           VARCHAR(150)  NOT NULL,
    discount_type   VARCHAR(20)   NOT NULL CHECK (discount_type IN ('percentage', 'fixed', 'shipping')),
    discount_value  NUMERIC(12,2) NOT NULL,
    min_purchase    NUMERIC(12,2) NOT NULL DEFAULT 0,
    max_discount    NUMERIC(12,2),
    quota           INT,
    valid_until     TIMESTAMP
);

CREATE TABLE couriers (
    id             VARCHAR(36)  PRIMARY KEY,
    user_id        VARCHAR(36)  REFERENCES users(id),
    dark_store_id  VARCHAR(36)  NOT NULL REFERENCES dark_stores(id),
    name           VARCHAR(100) NOT NULL,
    vehicle        VARCHAR(100),
    plate_number   VARCHAR(20),
    is_available   BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE orders (
    id                 VARCHAR(36)   PRIMARY KEY,
    order_number       VARCHAR(50)   NOT NULL UNIQUE,      -- BCL-YYYYMMDD-001
    user_id            VARCHAR(36)   NOT NULL REFERENCES users(id),
    address_id         VARCHAR(36)   NOT NULL REFERENCES addresses(id),
    dark_store_id      VARCHAR(36)   NOT NULL REFERENCES dark_stores(id),
    courier_id         VARCHAR(36)   REFERENCES couriers(id),
    promotion_id       VARCHAR(36)   REFERENCES promotions(id),
    status             VARCHAR(30)   NOT NULL DEFAULT 'confirmed'
                       CHECK (status IN ('confirmed', 'packing', 'on_delivery', 'delivered', 'cancelled')),
    subtotal           NUMERIC(12,2) NOT NULL,
    discount_amount    NUMERIC(12,2) NOT NULL DEFAULT 0,
    delivery_fee       NUMERIC(12,2) NOT NULL DEFAULT 5000,
    total_amount       NUMERIC(12,2) NOT NULL,
    estimated_arrival  TIMESTAMP,
    delivered_at       TIMESTAMP,
    created_at         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id          VARCHAR(36)   PRIMARY KEY,
    order_id    VARCHAR(36)   NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id  VARCHAR(36)   NOT NULL REFERENCES products(id),
    quantity    INT           NOT NULL CHECK (quantity > 0),
    unit_price  NUMERIC(12,2) NOT NULL,
    subtotal    NUMERIC(12,2) NOT NULL
);

CREATE TABLE payments (
    id              VARCHAR(36)   PRIMARY KEY,
    order_id        VARCHAR(36)   NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    method          VARCHAR(30)   NOT NULL CHECK (method IN ('QRIS', 'GOPAY', 'SHOPEEPAY', 'VA', 'COD')),
    status          VARCHAR(20)   NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid', 'refunded', 'failed')),
    amount          NUMERIC(12,2) NOT NULL,
    reference_no    VARCHAR(100),
    paid_at         TIMESTAMP
);

CREATE TABLE order_status_logs (
    id          VARCHAR(36) PRIMARY KEY,
    order_id    VARCHAR(36) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status      VARCHAR(30) NOT NULL,
    notes       TEXT,
    created_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk query yang sering dipakai
CREATE INDEX idx_products_category   ON products(category_id);
CREATE INDEX idx_orders_user         ON orders(user_id, created_at);
CREATE INDEX idx_orders_status       ON orders(status);
CREATE INDEX idx_order_items_order   ON order_items(order_id);
CREATE INDEX idx_status_logs_order   ON order_status_logs(order_id, created_at);
