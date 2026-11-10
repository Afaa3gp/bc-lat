import { Plus, Star } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useUi } from '../context/UiContext';
import { formatRp } from '../data/vouchers';
import { ProductImage, QtyStepper, discountPct } from './ui';

export default function ProductCard({ product, compact = false }) {
  const { cart, setQty, addToCart, stockLeft } = useStore();
  const { setProductId } = useUi();
  const qty = cart[product.id] || 0;
  const left = stockLeft(product.id);
  const pct = discountPct(product);

  return (
    <div
      onClick={() => setProductId(product.id)}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-lg ${compact ? 'w-36 shrink-0 @3xl:w-44' : ''}`}
    >
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <ProductImage product={product} className="h-full w-full transition duration-300 group-hover:scale-105" emojiClass="text-6xl" />
        {pct > 0 && (
          <span className="absolute top-2 left-2 rounded-lg bg-rose-500 px-1.5 py-0.5 text-[10px] font-extrabold text-white">-{pct}%</span>
        )}
        {product.flashSale && (
          <span className="absolute top-2 right-2 rounded-lg bg-navy-900 px-1.5 py-0.5 text-[10px] font-extrabold text-gold-400">⚡ KILAT</span>
        )}
        {left <= 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm font-bold text-slate-600">Stok habis</div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-2.5">
        <div className="text-sm font-extrabold text-navy-900">{formatRp(product.price)}</div>
        {pct > 0 && <div className="text-[11px] text-slate-400 line-through">{formatRp(product.originalPrice)}</div>}
        <div className="mt-1 line-clamp-2 min-h-[2.5em] text-xs leading-snug font-medium text-slate-700">{product.name}</div>
        <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500">
          <span>{product.size}</span>
          <span>•</span>
          <Star size={10} className="fill-gold-400 text-gold-400" />
          <span>{product.rating}</span>
        </div>
        <div className="mt-auto pt-2">
          {qty > 0 ? (
            <QtyStepper qty={qty} onChange={(q) => setQty(product.id, q)} max={left} size="sm" full />
          ) : (
            <button
              disabled={left <= 0}
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product.id);
              }}
              className="flex h-8 w-full items-center justify-center gap-1 rounded-xl border-2 border-navy-900 text-xs font-extrabold text-navy-900 transition hover:bg-navy-900 hover:text-gold-400 active:scale-95 disabled:border-slate-200 disabled:text-slate-300"
            >
              <Plus size={14} strokeWidth={3} /> Tambah
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
