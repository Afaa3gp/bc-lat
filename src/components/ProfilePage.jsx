import { useState } from 'react';
import { ChevronRight, CreditCard, Edit3, FileCheck2, Gift, HelpCircle, Info, Mail, MapPin, Phone, ShieldCheck, Star, Tag, User, Users, Store, X, QrCode, Smartphone, Building2, Banknote, ExternalLink } from 'lucide-react';
import { orderStatus, useStore } from '../context/StoreContext';
import { useUi } from '../context/UiContext';
import { formatRp, vouchers } from '../data/vouchers';
import { Logo, Sheet } from './ui';
import AddressModal from './AddressModal';

// Anggota kelompok demo bisnis
const TEAM = ['Citra', 'Arkhan', 'Lutpi', 'Bagas', 'Mushthofaa'];

export default function ProfilePage() {
  const { orders, addresses, address, userProfile, updateProfile, updateActiveAddressField, now, showToast } = useStore();
  const { go } = useUi();
  const [addrModal, setAddrModal] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [nibModal, setNibModal] = useState(false);

  const [pForm, setPForm] = useState({
    name: userProfile?.name || 'Kelompok Bisnis BC-LAT',
    phone: userProfile?.phone || '0812-3456-7890',
    email: userProfile?.email || 'demo@bc-lat.web.id',
  });

  const openProfileEdit = () => {
    setPForm({
      name: userProfile?.name || 'Kelompok Bisnis BC-LAT',
      phone: userProfile?.phone || '0812-3456-7890',
      email: userProfile?.email || 'demo@bc-lat.web.id',
    });
    setProfileModal(true);
  };

  const saveProfileForm = (e) => {
    e.preventDefault();
    if (!pForm.name.trim() || !pForm.phone.trim()) {
      showToast('Nama & nomor telepon wajib diisi', 'error');
      return;
    }
    updateProfile(pForm);
    updateActiveAddressField({ recipient: pForm.name, phone: pForm.phone });
    setProfileModal(false);
  };

  const done = orders.filter((o) => orderStatus(o, now).key === 'delivered');
  const spent = done.reduce((a, o) => a + o.total, 0);
  const points = Math.floor(spent / 1000);

  const copyReferral = () => {
    navigator.clipboard?.writeText('BCLATTEMAN');
    showToast('Kode referral BCLATTEMAN disalin! Bagikan ke temanmu 🎉', 'success');
  };

  const initials = (userProfile?.name || 'BC')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  return (
    <div className="space-y-3 py-4 @3xl:grid @3xl:grid-cols-2 @3xl:gap-5 @3xl:space-y-0 @3xl:py-6">
      <div className="space-y-3">
        {/* Kartu Profil Pengguna */}
        <div className="mx-4 overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 p-5 text-white shadow-md @3xl:mx-0">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gold-400 text-xl font-extrabold text-navy-900 shadow">
              {initials || 'BC'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-lg font-extrabold">{userProfile?.name}</div>
              <div className="truncate text-xs text-slate-300">
                📞 {userProfile?.phone} • {userProfile?.email}
              </div>
            </div>
            <button
              onClick={openProfileEdit}
              className="flex shrink-0 items-center gap-1 rounded-xl bg-white/15 px-3 py-2 text-xs font-bold text-gold-300 ring-1 ring-white/20 hover:bg-white/25 active:scale-95 transition"
            >
              <Edit3 size={13} /> Ubah
            </button>
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
              icon: User,
              label: 'Ubah Data Diri & Nomor Telepon',
              hint: `${userProfile?.name} • ${userProfile?.phone}`,
              onClick: openProfileEdit,
              badge: 'Profil',
            },
            {
              icon: MapPin,
              label: 'Alamat, GPS & Peta Google Maps',
              hint: `${addresses.length} titik tersimpan • Aktif: ${address?.label}`,
              onClick: () => setAddrModal(true),
            },
            {
              icon: FileCheck2,
              label: 'Legalitas Usaha & NIB (OSS RBA)',
              hint: 'NIB: 1111260048291 • KBLI 47911 & HAKI',
              onClick: () => setNibModal(true),
              badge: 'Legalitas',
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
              ['Nomor Induk Berusaha', 'NIB: 1111260048291 (OSS RBA)'],
              ['KBLI & HAKI', 'KBLI 47911 • Hak Cipta Aplikasi'],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                <div className="text-slate-500">{k}</div>
                <div className="font-bold text-navy-900">{v}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setNibModal(true)}
            className="mt-3 flex w-full items-center justify-between rounded-xl bg-emerald-50 px-3.5 py-2.5 text-xs font-bold text-emerald-800 ring-1 ring-emerald-200 hover:bg-emerald-100 transition"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-600" />
              Terdaftar Sistem OSS RBA (NIB) & Pengajuan HAKI
            </span>
            <ChevronRight size={15} />
          </button>
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

      {/* Modal Edit Profil & Nomor Telepon */}
      <Sheet open={profileModal} onClose={() => setProfileModal(false)}>
        <form onSubmit={saveProfileForm} className="p-5 text-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-navy-900">Ubah Profil & Nomor Telepon</h3>
              <p className="text-xs text-slate-500">Digunakan otomatis untuk kontak kurir saat pengantaran</p>
            </div>
            <button type="button" onClick={() => setProfileModal(false)} className="rounded-full p-1 hover:bg-slate-100">
              <X size={20} />
            </button>
          </div>

          <div>
            <label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-navy-900">
              <User size={14} className="text-gold-600" /> Nama Lengkap / Akun
            </label>
            <input
              type="text"
              required
              value={pForm.name}
              onChange={(e) => setPForm({ ...pForm, name: e.target.value })}
              placeholder="Masukkan nama lengkap"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-navy-900 outline-none focus:border-navy-900 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-navy-900">
              <Phone size={14} className="text-emerald-600" /> Nomor Telepon / WhatsApp Aktif
            </label>
            <input
              type="tel"
              required
              value={pForm.phone}
              onChange={(e) => setPForm({ ...pForm, phone: e.target.value })}
              placeholder="Contoh: 0812-3456-7890"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-navy-900 outline-none focus:border-navy-900 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1 flex items-center gap-1.5 text-xs font-bold text-navy-900">
              <Mail size={14} className="text-sky-600" /> Alamat Email
            </label>
            <input
              type="email"
              value={pForm.email}
              onChange={(e) => setPForm({ ...pForm, email: e.target.value })}
              placeholder="email@domain.com"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-navy-900 outline-none focus:border-navy-900 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            className="mt-2 h-12 w-full rounded-xl bg-gold-400 font-extrabold text-navy-900 shadow-md hover:bg-gold-500 active:scale-[0.99] transition"
          >
            Simpan Perubahan
          </button>
        </form>
      </Sheet>

      {/* Modal Alamat + Google Maps Interaktif */}
      <AddressModal open={addrModal} onClose={() => setAddrModal(false)} />

      {/* Modal Legalitas Usaha & NIB (OSS RBA) */}
      <Sheet open={nibModal} onClose={() => setNibModal(false)}>
        <div className="p-5 text-slate-800">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-extrabold tracking-widest text-emerald-600 uppercase">Dokumen Legalitas & Perizinan</div>
              <h3 className="text-lg font-extrabold text-navy-900">NIB (Nomor Induk Berusaha) & HAKI</h3>
            </div>
            <button onClick={() => setNibModal(false)} className="rounded-full p-1 hover:bg-slate-100">
              <X size={20} />
            </button>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-navy-900 to-navy-800 p-4 text-white shadow">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-300 ring-1 ring-emerald-400/30">
                ✓ TERVERIFIKASI OSS RBA
              </span>
              <span className="text-[11px] text-slate-300">Kementerian Investasi / BKPM</span>
            </div>
            <div className="mt-3 text-xs text-slate-300">Nomor Induk Berusaha (NIB)</div>
            <div className="font-mono text-xl font-extrabold tracking-wider text-gold-400">1111260048291</div>
            <div className="mt-2 text-xs font-semibold text-white">PT / CV / UMKM BC-LAT Market Online Indonesia</div>
            <div className="text-[11px] text-slate-300">Jl. Surya Kencana No. 1, Pamulang, Kota Tangerang Selatan, Banten</div>
          </div>

          <div className="mt-3 space-y-2 text-xs">
            {[
              ['Kode KBLI Utama', '47911 — Perdagangan Eceran Melalui Media Untuk Komoditi Makanan, Minuman, dan Sembako'],
              ['Kode KBLI Pendukung', '47111 — Perdagangan Eceran Berbagai Macam Barang (Minimarket / Dark Store)'],
              ['Skala Usaha & Risiko', 'UMKM / Startup Digital • Tingkat Risiko Rendah (Terbit Otomatis OSS)'],
              ['Hak Kekayaan Intelektual', 'Hak Cipta Program Komputer (Aplikasi Web Quick-Commerce BC-LAT — Universitas Pamulang)'],
              ['Pengembangan Lanjutan', 'Siap dilanjutkan untuk Proyek Kerja Praktik / Skripsi & Inkubasi Bisnis Kampus'],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-xl border border-slate-200/80 bg-slate-50 p-3">
                <div className="font-extrabold text-navy-900">{title}</div>
                <div className="mt-0.5 text-slate-600">{desc}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <a
              href="https://oss.go.id"
              target="_blank"
              rel="noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-navy-900/20 py-2.5 text-xs font-extrabold text-navy-900 hover:bg-slate-100"
            >
              <span>Portal Resmi OSS.go.id</span>
              <ExternalLink size={13} />
            </a>
            <button
              onClick={() => setNibModal(false)}
              className="flex-1 rounded-xl bg-navy-900 py-2.5 text-xs font-extrabold text-gold-400 hover:bg-navy-800"
            >
              Tutup
            </button>
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
