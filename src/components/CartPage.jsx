import { useState } from 'react';
import { ChevronRight, MapPin, ShoppingBag, Tag, Trash2, X, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useUi } from '../context/UiContext';
import { formatRp, vouchers } from '../data/vouchers';
import { ProductImage, QtyStepper } from './ui';

export default function CartPage() {
  const s = useStore();
  const { go, setCheckoutOpen } = useUi();
  const [code, setCode] = useState('');

  if (!s.cartItems.length) {
    return (
      <div className="flex flex-col items-center px-6 py-20 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-navy-900 text-gold-400">
          <ShoppingBag size={44} />
        </div>
        <h2 className="mt-5 text-xl font-extrabold text-navy-900">Keranjangmu masih kosong</h2>
        <p className="mt-1 text-sm text-slate-500">Yuk isi dengan kebutuhan harianmu, kami antar dalam 15 menit ⚡</p>
        <button onClick={() => go('home')} className="mt-6 rounded-xl bg-gold-400 px-6 py-3 font-extrabold text-navy-900 hover:bg-gold-500">
          Mulai Belanja
        </button>
      </div>
    );
  }

  return (
    <div className="py-4 @3xl:grid @3xl:grid-cols-[1fr_380px] @3xl:items-start @3xl:gap-6 @3xl:py-6">
      <div className="space-y-3">
        <h1 className="px-4 text-xl font-extrabold text-navy-900 @3xl:px-0">Keranjang ({s.cartCount} item)</h1>

        <div className="mx-4 flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-slate-200/70 @3xl:mx-0">
          <MapPin className="text-gold-600" size={20} />
          <div className="min-w-0 flex-1">
            <div className="text-xs text-slate-500">Antar ke {s.address.label}</div>
            <div className="truncate text-sm font-bold text-navy-900">{s.address.full}</div>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-navy-900 px-2.5 py-1 text-[11px] font-bold text-gold-400">
            <Zap size={12} className="fill-gold-400" /> 15 mnt
          </span>
        </div>

        <div className="mx-4 divide-y divide-slate-100 rounded-2xl bg-white ring-1 ring-slate-200/70 @3xl:mx-0">
          {s.cartItems.map(({ product, qty }) => (
            <div key={product.id} className="flex gap-3 p-3">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-50">
                <ProductImage product={product} className="h-full w-full" emojiClass="text-4xl" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="line-clamp-2 text-sm font-semibold text-navy-900">{product.name}</div>
                <div className="text-xs text-slate-500">{product.size}</div>
                <div className="mt-auto flex items-end justify-between gap-2">
                  <div>
                    <div className="text-sm font-extrabold text-navy-900">{formatRp(product.price * qty)}</div>
                    <div className="text-[11px] text-slate-400 line-through">{formatRp(product.originalPrice * qty)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => s.setQty(product.id, 0)} className="p-1 text-slate-400 hover:text-rose-500" aria-label="Hapus">
                      <Trash2 size={16} />
                    </button>
                    <QtyStepper qty={qty} onChange={(q) => s.setQty(product.id, q)} max={s.stockLeft(product.id)} size="sm" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 space-y-3 @3xl:sticky @3xl:top-40 @3xl:mt-11">
        {/* Voucher */}
        <div className="mx-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200/70 @3xl:mx-0">
          <div className="mb-2 flex items-center gap-2 text-sm font-extrabold text-navy-900">
            <Tag size={16} className="text-gold-600" /> Voucher
          </div>
          {s.voucher ? (
            <div className={`flex items-center justify-between rounded-xl p-3 ${s.voucherResult.error ? 'bg-amber-50' : 'bg-emerald-50'}`}>
              <div>
                <div className="text-sm font-bold text-navy-900">{s.voucher.code}</div>
                <div className={`text-xs ${s.voucherResult.error ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {s.voucherResult.error ? `Belum berlaku: ${s.voucherResult.error}` : s.voucher.title}
                </div>
              </div>
              <button onClick={s.removeVoucher} className="p-1 text-slate-500 hover:text-rose-500" aria-label="Hapus voucher">
                <X size={18} />
              </button>
            </div>
          ) : (
            <>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (s.applyVoucher(code)) setCode('');
                }}
                className="flex gap-2"
              >
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Masukkan kode voucher"
                  className="flex-1 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-gold-400"
                />
                <button className="rounded-xl bg-navy-900 px-4 text-sm font-bold text-gold-400">Pakai</button>
              </form>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {vouchers.map((v) => (
                  <button key={v.code} onClick={() => s.applyVoucher(v.code)} className="rounded-full border border-dashed border-gold-500 px-2 py-0.5 text-[11px] font-bold text-gold-600 hover:bg-gold-300/20">
                    {v.code}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Ringkasan */}
        <div className="mx-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200/70 @3xl:mx-0">
          <div className="mb-3 text-sm font-extrabold text-navy-900">Ringkasan Belanja</div>
          <Row label="Subtotal produk" value={formatRp(s.subtotal)} />
          {s.voucherResult.discount > 0 && <Row label="Diskon voucher" value={`-${formatRp(s.voucherResult.discount)}`} green />}
          <Row
            label="Ongkos kirim"
            value={s.deliveryFee === 0 ? <span><s className="mr-1 text-slate-400">Rp5.000</s>GRATIS</span> : formatRp(s.deliveryFee)}
            green={s.deliveryFee === 0}
          />
          <div className="my-3 border-t border-dashed border-slate-200" />
          <Row label={<b className="text-navy-900">Total bayar</b>} value={<b className="text-lg text-navy-900">{formatRp(s.total)}</b>} />
          <div className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
            🎉 Kamu hemat {formatRp(s.savings + s.voucherResult.discount + (5000 - s.deliveryFee))} di pesanan ini!
          </div>
        </div>

        {/* CTA: sticky di mobile */}
        <div className="sticky bottom-16 z-10 mx-4 @3xl:static @3xl:mx-0">
          <button
            onClick={() => setCheckoutOpen(true)}
            className="flex h-14 w-full items-center justify-between rounded-2xl bg-gold-400 px-5 font-extrabold text-navy-900 shadow-lg shadow-gold-500/30 hover:bg-gold-500 active:scale-[0.98]"
          >
            <span>Pilih Pembayaran</span>
            <span className="flex items-center gap-1">
              {formatRp(s.total)} <ChevronRight size={18} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, green }) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="text-slate-600">{label}</span>
      <span className={green ? 'font-bold text-emerald-600' : 'font-semibold text-slate-800'}>{value}</span>
    </div>
  );
}
