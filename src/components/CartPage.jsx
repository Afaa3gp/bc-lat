import { useState } from 'react';
import { ChevronRight, Edit3, MapPin, Phone, ShoppingBag, Tag, Trash2, User, X, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useUi } from '../context/UiContext';
import { formatRp, vouchers } from '../data/vouchers';
import { ProductImage, QtyStepper } from './ui';
import AddressModal from './AddressModal';

export default function CartPage() {
  const s = useStore();
  const { go, setCheckoutOpen } = useUi();
  const [code, setCode] = useState('');
  const [addrOpen, setAddrOpen] = useState(false);

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

        {/* Kartu Lokasi Pengiriman, Nomor Telepon & Google Maps */}
        <div className="mx-4 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70 @3xl:mx-0">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-2.5">
            <div className="flex items-center gap-2 text-xs font-extrabold text-navy-900">
              <MapPin size={15} className="text-gold-600" />
              <span>Detail Pengiriman & Nomor Telepon</span>
            </div>
            <button
              onClick={() => setAddrOpen(true)}
              className="flex items-center gap-1 rounded-lg bg-navy-900 px-2.5 py-1 text-[11px] font-bold text-gold-400 hover:bg-navy-800 active:scale-95 transition"
            >
              <Edit3 size={11} /> Pilih Peta / Alamat
            </button>
          </div>

          <div className="p-3.5 space-y-3">
            {/* Alamat Aktif + Mini Map */}
            <div
              onClick={() => setAddrOpen(true)}
              className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50/60 p-2.5 hover:border-gold-400 transition"
            >
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-200">
                <iframe
                  title="Mini Google Maps"
                  src={`https://maps.google.com/maps?q=${s.address?.lat || -6.3461},${s.address?.lng || 106.737}&hl=id&z=15&output=embed`}
                  className="pointer-events-none h-28 w-28 -translate-x-7 -translate-y-7 scale-90 border-0"
                  loading="lazy"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-extrabold text-navy-900">{s.address?.label}</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    {s.address?.distanceKm || 0.9} km • 15 mnt ⚡
                  </span>
                </div>
                <div className="mt-0.5 line-clamp-2 text-xs text-slate-600">{s.address?.full}</div>
              </div>
            </div>

            {/* Form Cepat Penerima & Nomor Telepon/WA */}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 flex items-center gap-1 text-[11px] font-bold text-slate-600">
                  <User size={12} className="text-gold-600" /> Nama Penerima
                </span>
                <input
                  type="text"
                  value={s.address?.recipient || ''}
                  onChange={(e) => s.updateActiveAddressField({ recipient: e.target.value })}
                  placeholder="Masukkan nama penerima"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-navy-900 outline-none focus:border-navy-900 focus:bg-white"
                />
              </label>
              <label className="block">
                <span className="mb-1 flex items-center gap-1 text-[11px] font-bold text-slate-600">
                  <Phone size={12} className="text-emerald-600" /> Nomor Telepon / WhatsApp
                </span>
                <input
                  type="tel"
                  value={s.address?.phone || ''}
                  onChange={(e) => s.updateActiveAddressField({ phone: e.target.value })}
                  placeholder="Contoh: 0812-3456-7890"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-navy-900 outline-none focus:border-navy-900 focus:bg-white"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1 block text-[11px] font-bold text-slate-600">
                Catatan Lokasi / Patokan Kurir
              </span>
              <input
                type="text"
                value={s.address?.notes || ''}
                onChange={(e) => s.updateActiveAddressField({ notes: e.target.value })}
                placeholder="Mis: Titip di satpam lobby / rumah pagar hitam / nomor kamar kost..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-navy-900 outline-none focus:border-navy-900 focus:bg-white"
              />
            </label>
          </div>
        </div>

        {/* Daftar Produk di Keranjang */}
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
        <div className="sticky bottom-[74px] z-20 mx-4 pb-1 @3xl:static @3xl:mx-0 @3xl:pb-0">
          <button
            onClick={() => {
              if (!s.address?.phone || s.address.phone.trim().length < 8) {
                s.showToast('Mohon isi nomor telepon / WhatsApp penerima terlebih dahulu', 'error');
                return;
              }
              setCheckoutOpen(true);
            }}
            className="flex h-14 w-full items-center justify-between rounded-2xl bg-gold-400 px-5 font-extrabold text-navy-900 shadow-xl shadow-gold-500/30 hover:bg-gold-500 active:scale-[0.98] transition-transform"
          >
            <span>Pilih Pembayaran</span>
            <span className="flex items-center gap-1">
              {formatRp(s.total)} <ChevronRight size={18} />
            </span>
          </button>
        </div>
      </div>

      {/* Modal Pilih & Tambah Alamat + Google Maps */}
      <AddressModal open={addrOpen} onClose={() => setAddrOpen(false)} />
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
