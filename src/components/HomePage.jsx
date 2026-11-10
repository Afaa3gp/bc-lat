import { useEffect, useMemo, useState } from 'react';
import { Clock, Leaf, ShieldCheck, Tag, Timer, Wallet, X, Zap } from 'lucide-react';
import { categories, getCategory } from '../data/categories';
import { products } from '../data/products';
import { vouchers, formatRp } from '../data/vouchers';
import { useStore } from '../context/StoreContext';
import { useUi } from '../context/UiContext';
import BannerSlider from './BannerSlider';
import CategoryGrid from './CategoryGrid';
import ProductCard from './ProductCard';
import { SectionTitle } from './ui';

export default function HomePage() {
  const { query, category, setCategory, setQuery } = useUi();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        (!category || p.category === category) &&
        (!q || p.name.toLowerCase().includes(q) || getCategory(p.category).name.toLowerCase().includes(q))
    );
  }, [query, category]);

  if (query || category) {
    const cat = getCategory(category);
    return (
      <div className="space-y-4 py-4">
        <div className="flex gap-2 overflow-x-auto px-4 no-scrollbar @3xl:flex-wrap @3xl:px-0">
          <Chip active={!category} onClick={() => setCategory(null)}>Semua</Chip>
          {categories.map((c) => (
            <Chip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
              {c.emoji} {c.name}
            </Chip>
          ))}
        </div>
        <div className="flex items-center justify-between px-4 @3xl:px-0">
          <h2 className="text-lg font-extrabold text-navy-900">
            {query ? `Hasil untuk "${query}"` : cat?.name}
            <span className="ml-2 text-sm font-medium text-slate-500">{results.length} produk</span>
          </h2>
          <button onClick={() => { setCategory(null); setQuery(''); }} className="flex items-center gap-1 text-sm font-bold text-navy-600">
            <X size={16} /> Reset
          </button>
        </div>
        {results.length ? (
          <ProductGrid items={results} />
        ) : (
          <div className="mx-4 rounded-3xl bg-white p-10 text-center">
            <div className="text-5xl">🔍</div>
            <div className="mt-3 font-bold text-navy-900">Produk tidak ditemukan</div>
            <div className="text-sm text-slate-500">Coba kata kunci lain, misalnya "telur" atau "kopi".</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-7 py-4 @3xl:space-y-10 @3xl:py-6">
      <BannerSlider />
      <ValueProps />
      <CategoryGrid />
      <FlashSale />
      <VoucherStrip />
      {['kombo-hemat', 'sembako', 'protein', 'minuman', 'snack'].map((cid) => (
        <CategoryRow key={cid} categoryId={cid} />
      ))}
      <WhyUs />
    </div>
  );
}

function Chip({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold ring-1 transition ${
        active ? 'bg-navy-900 text-gold-400 ring-navy-900' : 'bg-white text-slate-700 ring-slate-200 hover:ring-slate-300'
      }`}
    >
      {children}
    </button>
  );
}

export function ProductGrid({ items }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 px-4 @md:grid-cols-3 @3xl:grid-cols-5 @3xl:gap-4 @3xl:px-0 @5xl:grid-cols-6">
      {items.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

function ValueProps() {
  const items = [
    { icon: Zap, title: '15 Menit Sampai', desc: 'Dari Dark Store terdekat' },
    { icon: Clock, title: 'Buka 24 Jam', desc: 'Pagi, siang, tengah malam' },
    { icon: Wallet, title: 'Harga Hemat', desc: 'Promo tiap hari' },
    { icon: Leaf, title: 'Dijamin Segar', desc: 'Garansi uang kembali' },
  ];
  return (
    <div className="mx-4 grid grid-cols-4 gap-1 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200/70 @3xl:mx-0 @3xl:gap-4 @3xl:p-5">
      {items.map(({ icon: Icon, title, desc }) => (
        <div key={title} className="flex flex-col items-center gap-1.5 text-center @3xl:flex-row @3xl:text-left">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-gold-400 @3xl:h-11 @3xl:w-11">
            <Icon size={18} />
          </div>
          <div>
            <div className="text-[10px] leading-tight font-extrabold text-navy-900 @3xl:text-sm">{title}</div>
            <div className="hidden text-xs text-slate-500 @3xl:block">{desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function useCountdown() {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    const tick = () => {
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      setLeft(Math.max(0, end - Date.now()));
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  const s = Math.floor(left / 1000);
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((n) => String(n).padStart(2, '0'));
}

function FlashSale() {
  const [h, m, s] = useCountdown();
  const items = products.filter((p) => p.flashSale);
  return (
    <section className="bg-gradient-to-br from-navy-900 to-navy-700 py-5 @3xl:rounded-3xl @3xl:px-6">
      <div className="mb-4 flex items-center justify-between px-4 @3xl:px-0">
        <div className="flex items-center gap-2">
          <Zap className="fill-gold-400 text-gold-400" size={22} />
          <h2 className="text-lg font-extrabold text-white @3xl:text-xl">Flash Sale Kilat</h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
          <Timer size={14} /> Berakhir
          {[h, m, s].map((v, i) => (
            <span key={i} className="rounded-md bg-gold-400 px-1.5 py-0.5 font-extrabold text-navy-900 tabular-nums">{v}</span>
          ))}
        </div>
      </div>
      <div className="flex gap-2.5 overflow-x-auto px-4 pb-1 no-scrollbar @3xl:px-0">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} compact />
        ))}
      </div>
    </section>
  );
}

function VoucherStrip() {
  const { applyVoucher, voucherCode } = useStore();
  return (
    <section>
      <SectionTitle title="Voucher Buat Kamu" icon={<Tag size={18} className="text-gold-500" />} />
      <div className="flex gap-3 overflow-x-auto px-4 pb-1 no-scrollbar @3xl:grid @3xl:grid-cols-3 @3xl:px-0">
        {vouchers.map((v) => (
          <div key={v.code} className="relative flex w-64 shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70 @3xl:w-auto">
            <div className="flex w-16 flex-col items-center justify-center bg-gold-400 text-navy-900">
              <Tag size={20} />
            </div>
            <div className="flex-1 border-l-2 border-dashed border-slate-200 p-3">
              <div className="text-sm font-extrabold text-navy-900">{v.title}</div>
              <div className="text-[11px] text-slate-500">Min. belanja {formatRp(v.minPurchase)}</div>
              <div className="mt-2 flex items-center justify-between">
                <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-bold text-navy-700">{v.code}</code>
                <button
                  onClick={() => applyVoucher(v.code)}
                  disabled={voucherCode === v.code}
                  className="rounded-lg bg-navy-900 px-3 py-1 text-[11px] font-bold text-gold-400 disabled:bg-emerald-500 disabled:text-white"
                >
                  {voucherCode === v.code ? 'Terpakai' : 'Pakai'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CategoryRow({ categoryId }) {
  const { openCategory } = useUi();
  const cat = getCategory(categoryId);
  const items = products.filter((p) => p.category === categoryId);
  return (
    <section>
      <SectionTitle title={`${cat.emoji} ${cat.name}`} action="Lihat semua" onAction={() => openCategory(categoryId)} />
      <div className="flex gap-2.5 overflow-x-auto px-4 pb-1 no-scrollbar @3xl:px-0">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} compact />
        ))}
      </div>
    </section>
  );
}

function WhyUs() {
  const stats = [
    ['15 mnt', 'rata-rata waktu antar'],
    ['24/7', 'operasional Dark Store'],
    ['>10rb', 'produk kebutuhan harian'],
    ['3 km', 'radius layanan per hub'],
  ];
  return (
    <section className="mx-4 overflow-hidden rounded-3xl bg-navy-900 p-6 text-white @3xl:mx-0 @3xl:p-10">
      <div className="grid gap-6 @3xl:grid-cols-2 @3xl:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold tracking-widest text-gold-400 uppercase">
            <ShieldCheck size={16} /> Kenapa BC-LAT?
          </div>
          <h3 className="text-2xl leading-tight font-extrabold @3xl:text-3xl">
            Belanja bulanan <span className="text-gold-gradient">kapan aja bisa</span>, secepat kilat.
          </h3>
          <p className="mt-3 text-sm text-slate-300">
            BC-LAT mengoperasikan jaringan <b>Dark Store</b> — gudang mini di tengah kota yang khusus melayani pesanan online.
            Produk dipilih oleh picker dalam 3 menit lalu diantar kurir kilat, sehingga belanjaanmu tiba dalam 15 menit.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {stats.map(([v, l]) => (
            <div key={l} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="text-2xl font-extrabold text-gold-400">{v}</div>
              <div className="text-xs text-slate-300">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
