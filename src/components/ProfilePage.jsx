import { ChevronRight, CreditCard, Gift, HelpCircle, Info, MapPin, ShieldCheck, Star, Tag, Users } from 'lucide-react';
import { orderStatus, useStore } from '../context/StoreContext';
import { useUi } from '../context/UiContext';
import { formatRp, vouchers } from '../data/vouchers';
import { Logo } from './ui';

// Ganti dengan nama anggota kelompok
const TEAM = ['Anggota 1', 'Anggota 2', 'Anggota 3', 'Anggota 4', 'Anggota 5'];

export default function ProfilePage() {
  const { orders, addresses, now } = useStore();
  const { go } = useUi();
  const done = orders.filter((o) => orderStatus(o, now).key === 'delivered');
  const spent = done.reduce((a, o) => a + o.total, 0);
  const points = Math.floor(spent / 1000);

  return (
    <div className="space-y-3 py-4 @3xl:grid @3xl:grid-cols-2 @3xl:gap-5 @3xl:space-y-0 @3xl:py-6">
      <div className="space-y-3">
        <div className="mx-4 overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 to-navy-700 p-5 text-white @3xl:mx-0">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-400 text-xl font-extrabold text-navy-900">BC</div>
            <div className="flex-1">
              <div className="text-lg font-extrabold">Kelompok BC-LAT</div>
              <div className="text-xs text-slate-300">0812-3456-7890 • demo@bclat.id</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              ['Pesanan', orders.length],
              ['Poin Kilat', points],
              ['Total Belanja', formatRp(spent)],
            ].map(([l, v]) => (
              <div key={l} className="rounded-xl bg-white/10 p-2">
                <div className="truncate text-sm font-extrabold text-gold-400">{v}</div>
                <div className="text-[10px] text-slate-300">{l}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-gold-400/15 px-3 py-2 text-xs text-gold-300">
            <Star size={14} className="fill-gold-400 text-gold-400" /> Member <b>Kilat Silver</b> — gratis ongkir 2x/minggu
          </div>
        </div>

        <Menu
          items={[
            { icon: MapPin, label: 'Alamat Tersimpan', hint: `${addresses.length} alamat` },
            { icon: Tag, label: 'Voucher Saya', hint: `${vouchers.length} voucher`, onClick: () => go('cart') },
            { icon: CreditCard, label: 'Metode Pembayaran', hint: 'QRIS, e-wallet, VA, COD' },
            { icon: Gift, label: 'Ajak Teman, Dapat Rp20rb', hint: 'Kode: BCLATTEMAN' },
            { icon: HelpCircle, label: 'Pusat Bantuan', hint: 'CS 24 jam' },
          ]}
        />
      </div>

      <div className="space-y-3">
        <div className="mx-4 rounded-3xl bg-white p-5 ring-1 ring-slate-200/70 @3xl:mx-0">
          <div className="flex items-center gap-2 text-sm font-extrabold text-navy-900">
            <Info size={16} className="text-gold-600" /> Tentang BC-LAT
          </div>
          <div className="mt-3 flex justify-center rounded-2xl bg-navy-900 py-6">
            <Logo size="lg" tagline />
          </div>
          <p className="mt-3 text-sm text-slate-600">
            BC-LAT adalah <b>market online quick-commerce</b> untuk keperluan sehari-hari. Dengan model <b>Dark Store</b> di
            dekat kampus & perumahan, kami menjamin belanjaan tiba dalam <b>15 menit</b>, 24 jam sehari.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            {[
              ['Target pasar', 'Mahasiswa & keluarga muda'],
              ['Model pendapatan', 'Margin produk + ongkir'],
              ['Keunggulan', 'Cepat, 24 jam, harga hemat'],
              ['Area awal', 'Sleman, Yogyakarta'],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-slate-50 p-2.5">
                <div className="text-slate-500">{k}</div>
                <div className="font-bold text-navy-900">{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-4 rounded-3xl bg-white p-5 ring-1 ring-slate-200/70 @3xl:mx-0">
          <div className="flex items-center gap-2 text-sm font-extrabold text-navy-900">
            <Users size={16} className="text-gold-600" /> Tim Kelompok
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {TEAM.map((n) => (
              <span key={n} className="rounded-full bg-navy-900/5 px-3 py-1 text-xs font-semibold text-navy-800">{n}</span>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck size={14} /> Website demo tugas mata kuliah Bisnis — data transaksi hanya simulasi.
          </div>
        </div>
      </div>
    </div>
  );
}

function Menu({ items }) {
  return (
    <div className="mx-4 divide-y divide-slate-100 rounded-3xl bg-white ring-1 ring-slate-200/70 @3xl:mx-0">
      {items.map(({ icon: Icon, label, hint, onClick }) => (
        <button key={label} onClick={onClick} className="flex w-full items-center gap-3 p-4 text-left hover:bg-slate-50">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-900/5 text-navy-800">
            <Icon size={18} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-navy-900">{label}</div>
            <div className="text-xs text-slate-500">{hint}</div>
          </div>
          <ChevronRight size={18} className="text-slate-300" />
        </button>
      ))}
    </div>
  );
}
