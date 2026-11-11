import { useState } from 'react';
import { ChevronRight, CreditCard, Gift, HelpCircle, Info, MapPin, ShieldCheck, Star, Tag, Users, Store, Check, X, QrCode, Smartphone, Building2, Banknote, Copy } from 'lucide-react';
import { orderStatus, useStore } from '../context/StoreContext';
import { useUi } from '../context/UiContext';
import { formatRp, vouchers } from '../data/vouchers';
import { Logo, Sheet } from './ui';

// Anggota kelompok demo bisnis
const TEAM = ['Citra', 'Arkhan', 'Lutpi', 'Bagas', 'Mushthofaa'];

export default function ProfilePage() {
  const { orders, addresses, address, setAddressId, now, showToast } = useStore();
  const { go } = useUi();
  const [addrModal, setAddrModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);

  const done = orders.filter((o) => orderStatus(o, now).key === 'delivered');
  const spent = done.reduce((a, o) => a + o.total, 0);
  const points = Math.floor(spent / 1000);

  const copyReferral = () => {
    navigator.clipboard?.writeText('BCLATTEMAN');
    showToast('Kode referral BCLATTEMAN disalin! Bagikan ke temanmu 🎉', 'success');
  };

  return (
    <div className="space-y-3 py-4 @3xl:grid @3xl:grid-cols-2 @3xl:gap-5 @3xl:space-y-0 @3xl:py-6">
      <div className="space-y-3">
        {/* Kartu Profil Pengguna */}
        <div className="mx-4 overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 p-5 text-white shadow-md @3xl:mx-0">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-400 text-xl font-extrabold text-navy-900 shadow">
              BC
            </div>
            <div className="flex-1">
              <div className="text-lg font-extrabold">Kelompok Bisnis BC-LAT</div>
              <div className="text-xs text-slate-300">0812-3456-7890 • demo@bclat.id</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              ['Pesanan', orders.length],
              ['Poin Kilat', points],
              ['Total Belanja', formatRp(spent)],
            ].map(([l, v]) => (
              <div key={l} className="rounded-xl bg-white/10 p-2 backdrop-blur-sm">
                <div className="truncate text-sm font-extrabold text-gold-400">{v}</div>
                <div className="text-[10px] text-slate-300">{l}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-gold-400/20 px-3 py-2 text-xs text-gold-300">
            <Star size={14} className="fill-gold-400 text-gold-400" /> Member <b>Kilat Silver</b> — kuota gratis ongkir aktif
          </div>
        </div>

        {/* Menu Pilihan */}
        <Menu
          items={[
            {
              icon: Store,
              label: 'Dashboard Admin Dark Store',
              hint: 'Kelola pesanan & stok (Khusus Demo)',
              onClick: () => go('admin'),
              badge: 'Presenter',
              highlight: true,
            },
            {
              icon: MapPin,
              label: 'Alamat Tersimpan',
              hint: `${addresses.length} alamat (${address?.label})`,
              onClick: () => setAddrModal(true),
            },
            {
              icon: Tag,
              label: 'Voucher Saya',
              hint: `${vouchers.length} voucher aktif`,
              onClick: () => go('cart'),
            },
            {
              icon: CreditCard,
              label: 'Metode Pembayaran',
              hint: 'QRIS, GoPay, ShopeePay, BCA VA, COD',
              onClick: () => setPaymentModal(true),
            },
            {
              icon: Gift,
              label: 'Ajak Teman, Dapat Rp20rb',
              hint: 'Salin kode: BCLATTEMAN',
              onClick: copyReferral,
            },
            {
              icon: HelpCircle,
              label: 'Pusat Bantuan (Chat CS Kila)',
              hint: 'Online 24 jam dengan AI',
              onClick: () => {
                const btn = document.querySelector('button[aria-label="Beranda BC-LAT"]')?.parentElement?.querySelector('button:has(svg)');
                // Trigger Chat CS
                document.querySelectorAll('button').forEach((b) => {
                  if (b.textContent?.includes('Chat CS')) b.click();
                });
              },
            },
          ]}
        />
      </div>

      <div className="space-y-3">
        {/* Info Tentang BC-LAT */}
        <div className="mx-4 rounded-3xl bg-white p-5 ring-1 ring-slate-200/70 shadow-sm @3xl:mx-0">
          <div className="flex items-center gap-2 text-sm font-extrabold text-navy-900">
            <Info size={16} className="text-gold-600" /> Tentang BC-LAT
          </div>
          <div className="mt-3 flex justify-center rounded-2xl bg-navy-900 py-6 shadow-inner">
            <Logo size="lg" tagline />
          </div>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            BC-LAT adalah <b>market online quick-commerce</b> untuk keperluan sehari-hari. Berbasis jaringan <b>Dark Store</b> di
            wilayah kampus Universitas Pamulang (UNPAM) & sekitarnya, kami menjamin pesanan tiba dalam <b>15 menit</b>, 24 jam non-stop.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            {[
              ['Target Pasar', 'Mahasiswa & keluarga muda'],
              ['Model Bisnis', 'Margin produk + micro-delivery'],
              ['Keunggulan', '15 Menit sampai, buka 24 jam'],
              ['Area Layanan', 'Radius 3 km Hub UNPAM Pamulang'],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                <div className="text-slate-500">{k}</div>
                <div className="font-bold text-navy-900">{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tim Kelompok Bisnis */}
        <div className="mx-4 rounded-3xl bg-white p-5 ring-1 ring-slate-200/70 shadow-sm @3xl:mx-0">
          <div className="flex items-center gap-2 text-sm font-extrabold text-navy-900">
            <Users size={16} className="text-gold-600" /> Tim Proyek Kelompok
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {TEAM.map((n) => (
              <span key={n} className="rounded-full bg-navy-900/5 px-3 py-1 text-xs font-semibold text-navy-800 border border-navy-900/10">
                {n}
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck size={14} className="text-emerald-600" /> Website demo mata kuliah Bisnis • Data transaksi disimulasikan secara aman.
          </div>
        </div>
      </div>

      {/* Modal Alamat */}
      <Sheet open={addrModal} onClose={() => setAddrModal(false)}>
        <div className="p-5 text-slate-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-navy-900">Alamat Pengiriman</h3>
            <button onClick={() => setAddrModal(false)} className="rounded-full p-1 hover:bg-slate-100">
              <X size={20} />
            </button>
          </div>
          <div className="space-y-2.5">
            {addresses.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  setAddressId(a.id);
                  setAddrModal(false);
                  showToast(`Alamat diubah ke ${a.label}`, 'success');
                }}
                className={`flex w-full items-start gap-3 rounded-2xl border-2 p-3 text-left transition ${
                  a.id === address?.id ? 'border-gold-500 bg-gold-300/15' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <MapPin className={a.id === address?.id ? 'text-gold-600 mt-0.5' : 'text-slate-400 mt-0.5'} size={20} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-navy-900">{a.label}</span>
                    {a.id === address?.id && (
                      <span className="flex items-center gap-0.5 rounded-full bg-gold-400 px-2 py-0.5 text-[10px] font-extrabold text-navy-900">
                        <Check size={11} strokeWidth={3} /> Aktif
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">{a.full}</div>
                  {a.notes && <div className="mt-1 text-[11px] text-slate-400">Catatan: {a.notes}</div>}
                </div>
              </button>
            ))}
          </div>
        </div>
      </Sheet>

      {/* Modal Metode Pembayaran */}
      <Sheet open={paymentModal} onClose={() => setPaymentModal(false)}>
        <div className="p-5 text-slate-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-navy-900">Metode Pembayaran Tersedia</h3>
            <button onClick={() => setPaymentModal(false)} className="rounded-full p-1 hover:bg-slate-100">
              <X size={20} />
            </button>
          </div>
          <div className="space-y-2">
            {[
              { icon: QrCode, name: 'QRIS Standar Nasional', desc: 'Bisa scan dari BCA, Mandiri, BRI, GoPay, OVO, ShopeePay' },
              { icon: Smartphone, name: 'GoPay & ShopeePay', desc: 'Pembayaran otomatis langsung terhubung' },
              { icon: Building2, name: 'Virtual Account BCA', desc: 'Transfer instan via m-BCA / ATM (No: 8077 0812 3456 7890)' },
              { icon: Banknote, name: 'Cash on Delivery (COD)', desc: 'Bayar tunai pas kurir 15 menit tiba di depan gerbang' },
            ].map(({ icon: Icon, name, desc }) => (
              <div key={name} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3 border border-slate-100">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                  <Icon size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold text-navy-900">{name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setPaymentModal(false)}
            className="mt-4 h-11 w-full rounded-xl bg-navy-900 font-extrabold text-gold-400 hover:bg-navy-800"
          >
            Tutup
          </button>
        </div>
      </Sheet>
    </div>
  );
}

function Menu({ items }) {
  return (
    <div className="mx-4 divide-y divide-slate-100 rounded-3xl bg-white ring-1 ring-slate-200/70 shadow-sm @3xl:mx-0">
      {items.map(({ icon: Icon, label, hint, onClick, badge, highlight }) => (
        <button
          key={label}
          onClick={onClick}
          className={`flex w-full items-center gap-3 p-4 text-left transition active:bg-slate-100 hover:bg-slate-50 ${
            highlight ? 'bg-amber-50/60 hover:bg-amber-50' : ''
          }`}
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              highlight ? 'bg-gold-400 text-navy-900' : 'bg-navy-900/5 text-navy-800'
            }`}
          >
            <Icon size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${highlight ? 'text-navy-900 font-extrabold' : 'text-navy-900'}`}>{label}</span>
              {badge && <span className="rounded bg-gold-400 px-1.5 py-0.5 text-[10px] font-extrabold text-navy-900">{badge}</span>}
            </div>
            <div className="truncate text-xs text-slate-500">{hint}</div>
          </div>
          <ChevronRight size={18} className="text-slate-300 shrink-0" />
        </button>
      ))}
    </div>
  );
}
