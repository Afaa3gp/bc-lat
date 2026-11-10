import { useMemo } from 'react';
import { AlertTriangle, Boxes, ChevronsRight, DollarSign, Package, ShoppingBag, Timer, TrendingUp, XCircle } from 'lucide-react';
import { orderStatus, useStore } from '../context/StoreContext';
import { useUi } from '../context/UiContext';
import { products } from '../data/products';
import { getCategory } from '../data/categories';
import { formatRp } from '../data/vouchers';
import { StatusBadge } from './OrdersPage';
import { ProductImage } from './ui';

/** Dashboard operasional Dark Store — untuk dipresentasikan dari sisi toko */
export default function AdminDashboard() {
  const { orders, now, advanceOrder, cancelOrder, stockLeft } = useStore();
  const { setTrackingId, go } = useUi();

  const stats = useMemo(() => {
    const valid = orders.filter((o) => !o.cancelled);
    const revenue = valid.reduce((a, o) => a + o.total, 0);
    const items = valid.reduce((a, o) => a + o.items.reduce((x, i) => x + i.qty, 0), 0);
    const active = valid.filter((o) => orderStatus(o, now).key !== 'delivered').length;
    const grossMargin = valid.reduce((a, o) => a + o.subtotal * 0.18 - o.discount, 0);
    const sold = {};
    valid.forEach((o) => o.items.forEach((i) => (sold[i.id] = (sold[i.id] || 0) + i.qty)));
    const top = Object.entries(sold)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, qty]) => ({ product: products.find((p) => p.id === id), qty }));
    return { revenue, items, active, count: valid.length, aov: valid.length ? revenue / valid.length : 0, grossMargin, top };
  }, [orders, now]);

  const lowStock = products.map((p) => ({ p, left: stockLeft(p.id) })).filter((x) => x.left < 75).sort((a, b) => a.left - b.left);

  const cards = [
    { label: 'Omzet (GMV)', value: formatRp(stats.revenue), icon: DollarSign, color: 'bg-emerald-500' },
    { label: 'Total Pesanan', value: stats.count, icon: ShoppingBag, color: 'bg-navy-700' },
    { label: 'Pesanan Aktif', value: stats.active, icon: Timer, color: 'bg-gold-500' },
    { label: 'Rata-rata Keranjang', value: formatRp(stats.aov), icon: TrendingUp, color: 'bg-indigo-500' },
    { label: 'Item Terjual', value: stats.items, icon: Package, color: 'bg-rose-500' },
    { label: 'Est. Laba Kotor (18%)', value: formatRp(stats.grossMargin), icon: Boxes, color: 'bg-teal-500' },
  ];

  return (
    <div className="space-y-4 px-4 py-4 @3xl:px-0 @3xl:py-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <div className="text-xs font-bold tracking-widest text-gold-600 uppercase">Mode Admin</div>
          <h1 className="text-xl font-extrabold text-navy-900">Dashboard Dark Store — Kaliurang</h1>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> Toko buka 24 jam
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 @3xl:grid-cols-6">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl bg-white p-3 ring-1 ring-slate-200/70">
            <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg text-white ${color}`}>
              <Icon size={16} />
            </div>
            <div className="truncate text-base font-extrabold text-navy-900">{value}</div>
            <div className="text-[11px] text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 @3xl:grid-cols-[1.6fr_1fr]">
        {/* Antrian pesanan */}
        <div className="rounded-2xl bg-white ring-1 ring-slate-200/70">
          <div className="border-b border-slate-100 p-4 text-sm font-extrabold text-navy-900">Antrian Pesanan Masuk</div>
          {!orders.length ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Belum ada pesanan. Buat pesanan dari mode <b>Pembeli</b> untuk melihatnya di sini.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {orders.map((o) => {
                const st = orderStatus(o, now);
                const canAdvance = !o.cancelled && st.key !== 'delivered';
                return (
                  <div key={o.id} className="flex flex-wrap items-center gap-3 p-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-navy-900">{o.number}</span>
                        <StatusBadge status={st} />
                      </div>
                      <div className="truncate text-[11px] text-slate-500">
                        {o.items.length} jenis • {o.paymentMethod} • {o.address.label} • Kurir {o.courier.name}
                      </div>
                    </div>
                    <div className="text-sm font-extrabold text-navy-900">{formatRp(o.total)}</div>
                    <div className="flex gap-1.5">
                      {canAdvance && (
                        <button onClick={() => advanceOrder(o.id)} className="flex items-center gap-1 rounded-lg bg-navy-900 px-2.5 py-1.5 text-[11px] font-bold text-gold-400" title="Majukan status">
                          <ChevronsRight size={14} /> Proses
                        </button>
                      )}
                      {canAdvance && st.index < 2 && (
                        <button onClick={() => cancelOrder(o.id)} className="rounded-lg border border-rose-200 p-1.5 text-rose-500" title="Batalkan">
                          <XCircle size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setTrackingId(o.id);
                          go('orders');
                        }}
                        className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-navy-800"
                      >
                        Lacak
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200/70">
            <div className="mb-3 text-sm font-extrabold text-navy-900">Produk Terlaris</div>
            {stats.top.length ? (
              stats.top.map(({ product, qty }, i) => (
                <div key={product.id} className="flex items-center gap-3 py-1.5">
                  <span className="w-4 text-xs font-extrabold text-gold-600">{i + 1}</span>
                  <div className="h-9 w-9 overflow-hidden rounded-lg">
                    <ProductImage product={product} className="h-full w-full" emojiClass="text-lg" />
                  </div>
                  <div className="min-w-0 flex-1 truncate text-xs font-semibold">{product.name}</div>
                  <span className="text-xs font-bold text-navy-900">{qty} pcs</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500">Belum ada data penjualan.</div>
            )}
          </div>

          <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200/70">
            <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-navy-900">
              <AlertTriangle size={16} className="text-gold-600" /> Stok Perlu Restock
            </div>
            {lowStock.length ? (
              lowStock.slice(0, 6).map(({ p, left }) => (
                <div key={p.id} className="py-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold">{p.name}</span>
                    <span className="text-slate-500">{left}/{p.stock}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-slate-100">
                    <div className={`h-1.5 rounded-full ${left < 20 ? 'bg-rose-500' : 'bg-gold-400'}`} style={{ width: `${(left / p.stock) * 100}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500">Semua stok aman ✓ ({products.length} SKU, {new Set(products.map((p) => getCategory(p.category).id)).size} kategori)</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
