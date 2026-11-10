import { Star, Truck, X, Zap } from 'lucide-react';
import { getProduct, products } from '../data/products';
import { getCategory } from '../data/categories';
import { formatRp } from '../data/vouchers';
import { useStore } from '../context/StoreContext';
import { useUi } from '../context/UiContext';
import ProductCard from './ProductCard';
import { ProductImage, QtyStepper, Sheet, discountPct } from './ui';

export default function ProductSheet() {
  const { productId, setProductId } = useUi();
  const { cart, setQty, addToCart, stockLeft } = useStore();
  const product = productId ? getProduct(productId) : null;
  if (!product) return null;

  const qty = cart[product.id] || 0;
  const left = stockLeft(product.id);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 6);

  return (
    <Sheet open onClose={() => setProductId(null)} wide>
      <div className="relative">
        <button onClick={() => setProductId(null)} className="absolute top-3 right-3 z-10 rounded-full bg-white/90 p-1.5 shadow" aria-label="Tutup">
          <X size={20} />
        </button>
        <div className="@3xl:grid @3xl:grid-cols-2">
          <div className="aspect-square bg-slate-50">
            <ProductImage product={product} className="h-full w-full" emojiClass="text-[7rem]" />
          </div>
          <div className="flex flex-col p-5">
            <div className="text-xs font-bold text-navy-600">{getCategory(product.category).name}</div>
            <h2 className="mt-1 text-xl font-extrabold text-navy-900">{product.name}</h2>
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
              <span>{product.size}</span>•<Star size={12} className="fill-gold-400 text-gold-400" /> {product.rating} • {product.sold.toLocaleString('id-ID')} terjual
            </div>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-2xl font-extrabold text-navy-900">{formatRp(product.price)}</span>
              <span className="pb-1 text-sm text-slate-400 line-through">{formatRp(product.originalPrice)}</span>
              <span className="mb-1 rounded-md bg-rose-100 px-1.5 text-xs font-bold text-rose-600">-{discountPct(product)}%</span>
            </div>
            <p className="mt-3 text-sm text-slate-600">{product.description}</p>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-navy-900/5 p-3 text-xs text-navy-800">
              <Truck size={16} className="text-gold-600" />
              <span>
                Stok tersedia <b>{left}</b> di Dark Store terdekat • <Zap size={12} className="inline fill-gold-400 text-gold-500" /> Tiba 15 menit
              </span>
            </div>
            <div className="mt-auto pt-5">
              {qty > 0 ? (
                <QtyStepper qty={qty} onChange={(q) => setQty(product.id, q)} max={left} full />
              ) : (
                <button
                  disabled={left <= 0}
                  onClick={() => addToCart(product.id)}
                  className="h-11 w-full rounded-xl bg-navy-900 font-extrabold text-gold-400 hover:bg-navy-800 disabled:opacity-40"
                >
                  + Tambah ke Keranjang
                </button>
              )}
            </div>
          </div>
        </div>
        {related.length > 0 && (
          <div className="border-t border-slate-100 py-4">
            <div className="mb-2 px-5 text-sm font-extrabold text-navy-900">Produk serupa</div>
            <div className="flex gap-2.5 overflow-x-auto px-5 pb-1 no-scrollbar">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} compact />
              ))}
            </div>
          </div>
        )}
      </div>
    </Sheet>
  );
}
